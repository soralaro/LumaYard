import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/admin-auth";
import { lookupGeoLocation } from "@/lib/geoip";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "lumayard_visitor";
const SESSION_COOKIE = "lumayard_visit_session";
const SESSION_SECONDS = 30 * 60;
const DEDUPLICATION_MS = 30 * 1000;
const BOT_PATTERN = /bot|crawler|spider|slurp|headless|preview|facebookexternalhit|whatsapp/i;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxLength) : null;
}

function integer(value: unknown, maximum: number) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= maximum ? value : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const pageViewId = text(body.pageViewId, 64);
    if (pageViewId) {
      const durationMs = integer(body.durationMs, 24 * 60 * 60 * 1000);
      const visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
      if (durationMs && visitorId) await prisma.pageView.updateMany({ where: { id: pageViewId, visitorId }, data: { durationMs } });
      return NextResponse.json({ updated: Boolean(durationMs) });
    }

    const path = text(body.path, 500);
    if (!path || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const userAgent = text(request.headers.get("user-agent"), 1_000);
    if (userAgent && BOT_PATTERN.test(userAgent)) return NextResponse.json({ ignored: true });

    const visitorCookie = request.cookies.get(VISITOR_COOKIE)?.value;
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
    const visitorId = visitorCookie && /^[a-f0-9-]{36}$/i.test(visitorCookie) ? visitorCookie : randomUUID();
    const sessionId = sessionCookie && /^[a-f0-9-]{36}$/i.test(sessionCookie) ? sessionCookie : randomUUID();
    const recent = await prisma.pageView.findFirst({
      where: { visitorId, path, createdAt: { gt: new Date(Date.now() - DEDUPLICATION_MS) } },
      select: { id: true },
    });

    let id = recent?.id;
    if (!id) {
      const productIdentifier = path.match(/^\/products\/([^/?#]+)/)?.[1];
      const product = productIdentifier
        ? await prisma.product.findFirst({
            where: { status: "PUBLISHED", OR: [{ id: productIdentifier }, { legacyId: productIdentifier }, { handle: productIdentifier }] },
            select: { id: true },
          })
        : null;
      const ipAddress = getClientIp(request);
      const previousLocation = ipAddress ? await prisma.pageView.findFirst({
        where: { ipAddress },
        orderBy: { createdAt: "desc" },
        select: { countryCode: true, countryName: true, regionName: true, city: true },
      }) : null;
      const location = previousLocation ?? await lookupGeoLocation(ipAddress);
      const view = await prisma.pageView.create({
        data: {
          visitorId,
          sessionId,
          path,
          productId: product?.id,
          pageTitle: text(body.pageTitle, 300),
          queryString: text(body.queryString, 2_000),
          ipAddress,
          ...location,
          userAgent,
          referrer: text(body.referrer, 2_000),
          utmSource: text(body.utmSource, 200),
          utmMedium: text(body.utmMedium, 200),
          utmCampaign: text(body.utmCampaign, 300),
          language: text(body.language, 50),
          timezone: text(body.timezone, 100),
          screenWidth: integer(body.screenWidth, 20_000),
          screenHeight: integer(body.screenHeight, 20_000),
        },
        select: { id: true },
      });
      id = view.id;
    }

    const response = NextResponse.json({ tracked: true, deduplicated: Boolean(recent), pageViewId: id });
    const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
    if (!visitorCookie) response.cookies.set(VISITOR_COOKIE, visitorId, { ...cookieOptions, maxAge: 365 * 24 * 60 * 60 });
    response.cookies.set(SESSION_COOKIE, sessionId, { ...cookieOptions, maxAge: SESSION_SECONDS });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to record view" }, { status: 400 });
  }
}
