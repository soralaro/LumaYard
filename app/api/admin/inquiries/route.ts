import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inquiries = await prisma.inquiry.findMany({
    take: 200,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { legacyId: true, handle: true, title: true } } },
  });
  const visitorIds = inquiries.flatMap((inquiry) => inquiry.visitorId ? [inquiry.visitorId] : []);
  const views = visitorIds.length ? await prisma.pageView.findMany({
    where: { visitorId: { in: visitorIds }, productId: { not: null } },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, legacyId: true, handle: true, title: true } } },
  }) : [];

  const enriched = inquiries.map((inquiry) => {
    const matching = views.filter((view) => view.visitorId === inquiry.visitorId && view.product);
    const products = new Map<string, { id: string; handle: string; title: string; views: number; lastViewedAt: Date }>();
    for (const view of matching) {
      if (!view.product) continue;
      const current = products.get(view.product.id);
      products.set(view.product.id, {
        id: view.product.legacyId || view.product.handle,
        handle: view.product.handle,
        title: view.product.title,
        views: (current?.views || 0) + 1,
        lastViewedAt: current?.lastViewedAt && current.lastViewedAt > view.createdAt ? current.lastViewedAt : view.createdAt,
      });
    }
    return { ...inquiry, interestedProducts: [...products.values()] };
  });
  return NextResponse.json({ inquiries: enriched });
}
