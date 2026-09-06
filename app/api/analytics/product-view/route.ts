import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { lookupGeoLocation } from "@/lib/geoip";

const VISITOR_COOKIE = "lumayard_visitor";
const VIEW_DEDUPLICATION_MS = 30 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { productId?: unknown; referrer?: unknown };
    const identifier = typeof body.productId === "string" ? body.productId.trim() : "";
    if (!identifier || identifier.length > 160) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: {
        status: "PUBLISHED",
        OR: [{ id: identifier }, { legacyId: identifier }, { handle: identifier }],
      },
      select: { id: true, legacyId: true, handle: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const cookieValue = request.cookies.get(VISITOR_COOKIE)?.value;
    const visitorId = cookieValue && /^[a-f0-9-]{36}$/i.test(cookieValue) ? cookieValue : randomUUID();
    const recentView = await prisma.pageView.findFirst({
      where: {
        visitorId,
        productId: product.id,
        createdAt: { gt: new Date(Date.now() - VIEW_DEDUPLICATION_MS) },
      },
      select: { id: true },
    });

    if (!recentView) {
      const ipAddress = getClientIp(request);
      const location = await lookupGeoLocation(ipAddress);
      await prisma.pageView.create({
        data: {
          visitorId,
          productId: product.id,
          path: `/products/${product.legacyId || product.handle}`,
          ipAddress,
          ...location,
          userAgent: request.headers.get("user-agent"),
          referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 2_000) : null,
        },
      });
    }

    const response = NextResponse.json({ tracked: true, deduplicated: Boolean(recentView) });
    if (!cookieValue) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to record view" }, { status: 400 });
  }
}
