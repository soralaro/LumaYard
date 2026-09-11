import { NextResponse } from "next/server";
import { getCurrentAdmin, isOwner } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || !isOwner(admin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [views, events, sessions] = await Promise.all([
    prisma.pageView.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: { select: { title: true, handle: true, legacyId: true } } },
    }),
    prisma.auditLog.findMany({ take: 200, orderBy: { createdAt: "desc" }, include: { user: { select: { email: true, name: true } } } }),
    prisma.session.findMany({
      take: 200,
      orderBy: { createdAt: "desc" },
      select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true, user: { select: { email: true, name: true } } },
    }),
  ]);

  const visitorIds = [...new Set(views.map((view) => view.visitorId))];
  const inquiries = visitorIds.length
    ? await prisma.inquiry.findMany({
        where: { visitorId: { in: visitorIds } },
        orderBy: { createdAt: "desc" },
        select: { visitorId: true, name: true, email: true, phone: true },
      })
    : [];
  const identities = new Map<string, (typeof inquiries)[number]>();
  for (const inquiry of inquiries) if (inquiry.visitorId && !identities.has(inquiry.visitorId)) identities.set(inquiry.visitorId, inquiry);

  const visitorMap = new Map<string, {
    visitorId: string;
    views: number;
    sessions: Set<string>;
    firstSeenAt: Date;
    lastSeenAt: Date;
    latest: (typeof views)[number];
  }>();
  for (const view of views) {
    const current = visitorMap.get(view.visitorId);
    if (current) {
      current.views += 1;
      if (view.sessionId) current.sessions.add(view.sessionId);
      if (view.createdAt < current.firstSeenAt) current.firstSeenAt = view.createdAt;
    } else {
      visitorMap.set(view.visitorId, {
        visitorId: view.visitorId,
        views: 1,
        sessions: new Set(view.sessionId ? [view.sessionId] : []),
        firstSeenAt: view.createdAt,
        lastSeenAt: view.createdAt,
        latest: view,
      });
    }
  }

  const now = Date.now();
  const visitors = [...visitorMap.values()].map((visitor) => ({
    visitorId: visitor.visitorId,
    views: visitor.views,
    sessions: visitor.sessions.size,
    firstSeenAt: visitor.firstSeenAt,
    lastSeenAt: visitor.lastSeenAt,
    identity: identities.get(visitor.visitorId) ?? null,
    ipAddress: visitor.latest.ipAddress,
    countryName: visitor.latest.countryName,
    regionName: visitor.latest.regionName,
    city: visitor.latest.city,
    latestPath: visitor.latest.path,
    referrer: visitor.latest.referrer,
    userAgent: visitor.latest.userAgent,
  }));

  return NextResponse.json({
    summary: {
      totalViews: views.length,
      totalVisitors: visitors.length,
      last24Hours: views.filter((view) => now - view.createdAt.getTime() <= 86_400_000).length,
      activeVisitors: visitors.filter((visitor) => now - visitor.lastSeenAt.getTime() <= 10 * 60_000).length,
    },
    visitors,
    recentViews: views.slice(0, 500),
    events,
    sessions,
  });
}
