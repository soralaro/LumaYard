"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ProductInterest = {
  product: { id: string; legacyId: string | null; handle: string; title: string };
  views: number;
  visitors: number;
  lastViewedAt: string;
};
type RegionInterest = { countryCode: string | null; countryName: string | null; regionName: string | null; city: string | null; views: number; visitors: number };

type RecentView = {
  id: string;
  visitorId: string;
  path: string;
  ipAddress: string | null;
  countryName: string | null;
  regionName: string | null;
  city: string | null;
  userAgent: string | null;
  referrer: string | null;
  createdAt: string;
  product: { id: string; legacyId: string | null; handle: string; title: string } | null;
};

export default function ProductAnalyticsPage() {
  const [products, setProducts] = useState<ProductInterest[]>([]);
  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [regions, setRegions] = useState<RegionInterest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/analytics").then(async (response) => {
      if (!response.ok) { setError("Unable to load product interest."); return; }
      const data = await response.json() as { products: ProductInterest[]; regions: RegionInterest[]; recentViews: RecentView[] };
      setProducts(data.products);
      setRegions(data.regions);
      setRecentViews(data.recentViews);
    }).catch(() => setError("Unable to load product interest."));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Product interest</h1></div><Link href="/admin" className="text-sm text-blue-700 hover:text-blue-900">Back to dashboard</Link></div>
        {error && <p className="mb-5 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <section className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-semibold">Most viewed products</h2></div><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Visitors</th><th className="px-5 py-3">Last viewed</th></tr></thead><tbody className="divide-y divide-gray-100">{products.map((item) => <tr key={item.product.id}><td className="px-5 py-4"><Link href={`/products/${item.product.legacyId || item.product.handle}`} className="font-medium text-blue-700 hover:underline">{item.product.title}</Link></td><td className="px-5 py-4 font-semibold">{item.views}</td><td className="px-5 py-4">{item.visitors}</td><td className="px-5 py-4 text-gray-500">{new Date(item.lastViewedAt).toLocaleString()}</td></tr>)}</tbody></table>{!products.length && <p className="p-6 text-sm text-gray-500">No product views recorded yet.</p>}</section>
        <section className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-semibold">Visitor regions</h2></div><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Region</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Visitors</th></tr></thead><tbody className="divide-y divide-gray-100">{regions.map((region, index) => <tr key={`${region.countryCode}-${region.regionName}-${region.city}-${index}`}><td className="px-5 py-4">{[region.city, region.regionName, region.countryName].filter(Boolean).join(", ") || "Local network / unknown"}</td><td className="px-5 py-4 font-semibold">{region.views}</td><td className="px-5 py-4">{region.visitors}</td></tr>)}</tbody></table>{!regions.length && <p className="p-6 text-sm text-gray-500">No region data recorded yet.</p>}</section>
        <section className="overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-semibold">Recent customer activity</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Visitor</th><th className="px-5 py-3">Region</th><th className="px-5 py-3">IP</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Time</th></tr></thead><tbody className="divide-y divide-gray-100">{recentViews.map((view) => <tr key={view.id}><td className="px-5 py-4">{view.product?.title || view.path}</td><td className="px-5 py-4 font-mono text-xs">{view.visitorId.slice(0, 8)}</td><td className="px-5 py-4">{[view.city, view.regionName, view.countryName].filter(Boolean).join(", ") || "Local / unknown"}</td><td className="px-5 py-4">{view.ipAddress || "Unavailable"}</td><td className="max-w-xs truncate px-5 py-4 text-gray-500" title={view.referrer || ""}>{view.referrer || "Direct"}</td><td className="px-5 py-4 text-gray-500">{new Date(view.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>
      </div>
    </main>
  );
}
