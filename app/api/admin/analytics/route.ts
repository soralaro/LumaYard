import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const views = await prisma.pageView.findMany({
    take: 10_000,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, legacyId: true, handle: true, title: true, legacyImages: true } } },
  });

  const totals = new Map<string, { product: NonNullable<(typeof views)[number]["product"]>; views: number; visitors: Set<string>; lastViewedAt: Date }>();
  for (const view of views) {
    if (!view.product) continue;
    const current = totals.get(view.product.id) || { product: view.product, views: 0, visitors: new Set<string>(), lastViewedAt: view.createdAt };
    current.views += 1;
    current.visitors.add(view.visitorId);
    if (view.createdAt > current.lastViewedAt) current.lastViewedAt = view.createdAt;
    totals.set(view.product.id, current);
  }

  const products = [...totals.values()]
    .map((item) => ({ product: item.product, views: item.views, visitors: item.visitors.size, lastViewedAt: item.lastViewedAt }))
    .sort((left, right) => right.views - left.views);

  const locations = new Map<string, { countryCode: string | null; countryName: string | null; regionName: string | null; city: string | null; views: number; visitors: Set<string> }>();
  for (const view of views) {
    const key = [view.countryCode, view.regionName, view.city].join("|") || "unknown";
    const current = locations.get(key) || { countryCode: view.countryCode, countryName: view.countryName, regionName: view.regionName, city: view.city, views: 0, visitors: new Set<string>() };
    current.views += 1;
    current.visitors.add(view.visitorId);
    locations.set(key, current);
  }
  const regions = [...locations.values()].map((location) => ({ ...location, visitors: location.visitors.size })).sort((left, right) => right.views - left.views);

  return NextResponse.json({ products, regions, recentViews: views.slice(0, 200) });
}
