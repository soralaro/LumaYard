import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function sourceName(referrer: string | null, utmSource: string | null) {
  if (utmSource) return utmSource;
  if (!referrer) return "Direct / unknown";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host.endsWith("lumayard.me.uk") || host === "localhost" ? "Internal navigation" : host;
  } catch {
    return "Other";
  }
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const views = await prisma.pageView.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, legacyId: true, handle: true, title: true, legacyImages: true } } },
  });

  const productTotals = new Map<string, { product: NonNullable<(typeof views)[number]["product"]>; views: number; visitors: Set<string>; durationMs: number; lastViewedAt: Date }>();
  const pageTotals = new Map<string, { path: string; title: string | null; views: number; visitors: Set<string>; durationMs: number; lastViewedAt: Date }>();
  const locationTotals = new Map<string, { countryCode: string | null; countryName: string | null; regionName: string | null; city: string | null; views: number; visitors: Set<string> }>();
  const sourceTotals = new Map<string, { source: string; views: number; visitors: Set<string> }>();

  for (const view of views) {
    const page = pageTotals.get(view.path) || { path: view.path, title: view.pageTitle, views: 0, visitors: new Set<string>(), durationMs: 0, lastViewedAt: view.createdAt };
    page.views += 1;
    page.visitors.add(view.visitorId);
    page.durationMs += view.durationMs || 0;
    if (view.createdAt > page.lastViewedAt) page.lastViewedAt = view.createdAt;
    pageTotals.set(view.path, page);

    if (view.product) {
      const product = productTotals.get(view.product.id) || { product: view.product, views: 0, visitors: new Set<string>(), durationMs: 0, lastViewedAt: view.createdAt };
      product.views += 1;
      product.visitors.add(view.visitorId);
      product.durationMs += view.durationMs || 0;
      if (view.createdAt > product.lastViewedAt) product.lastViewedAt = view.createdAt;
      productTotals.set(view.product.id, product);
    }

    const locationKey = [view.countryCode, view.regionName, view.city].join("|") || "unknown";
    const location = locationTotals.get(locationKey) || { countryCode: view.countryCode, countryName: view.countryName, regionName: view.regionName, city: view.city, views: 0, visitors: new Set<string>() };
    location.views += 1;
    location.visitors.add(view.visitorId);
    locationTotals.set(locationKey, location);

    const sourceKey = sourceName(view.referrer, view.utmSource);
    const source = sourceTotals.get(sourceKey) || { source: sourceKey, views: 0, visitors: new Set<string>() };
    source.views += 1;
    source.visitors.add(view.visitorId);
    sourceTotals.set(sourceKey, source);
  }

  const compact = <T extends { visitors: Set<string>; views: number }>(items: T[]) => items
    .map((item) => ({ ...item, visitors: item.visitors.size }))
    .sort((left, right) => right.views - left.views);

  return NextResponse.json({
    summary: { views: views.length, visitors: new Set(views.map((view) => view.visitorId)).size, sessions: new Set(views.flatMap((view) => view.sessionId ? [view.sessionId] : [])).size },
    products: compact([...productTotals.values()]),
    pages: compact([...pageTotals.values()]),
    regions: compact([...locationTotals.values()]),
    sources: compact([...sourceTotals.values()]),
    recentViews: views.slice(0, 500),
  });
}
