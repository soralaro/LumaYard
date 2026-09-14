"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Summary = { views: number; visitors: number; sessions: number };
type Ranked = { views: number; visitors: number };
type ProductInterest = Ranked & { product: { id: string; legacyId: string | null; handle: string; title: string }; durationMs: number; lastViewedAt: string };
type PageInterest = Ranked & { path: string; title: string | null; durationMs: number; lastViewedAt: string };
type RegionInterest = Ranked & { countryCode: string | null; countryName: string | null; regionName: string | null; city: string | null };
type SourceInterest = Ranked & { source: string };
type ContentInterest = { content: { id: string; title?: string; slug?: string }; eventType: string; count: number };

function averageDuration(durationMs: number, views: number) {
  if (!durationMs || !views) return "-";
  const seconds = Math.round(durationMs / views / 1_000);
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function RankedTable({ title, rows }: { title: string; rows: Array<{ label: string; detail?: string; views: number; visitors: number }> }) {
  return <section className="overflow-hidden border bg-white"><div className="border-b px-5 py-4"><h2 className="font-semibold">{title}</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Visitors</th></tr></thead><tbody className="divide-y divide-gray-100">{rows.map((row, index) => <tr key={`${row.label}-${index}`}><td className="px-5 py-4"><p className="font-medium">{row.label}</p>{row.detail && <p className="text-xs text-gray-500">{row.detail}</p>}</td><td className="px-5 py-4 font-semibold">{row.views}</td><td className="px-5 py-4">{row.visitors}</td></tr>)}</tbody></table></div>{!rows.length && <p className="p-6 text-sm text-gray-500">No data recorded yet.</p>}</section>;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary>({ views: 0, visitors: 0, sessions: 0 });
  const [products, setProducts] = useState<ProductInterest[]>([]);
  const [pages, setPages] = useState<PageInterest[]>([]);
  const [regions, setRegions] = useState<RegionInterest[]>([]);
  const [sources, setSources] = useState<SourceInterest[]>([]);
  const [content, setContent] = useState<ContentInterest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/analytics").then(async (response) => {
      if (!response.ok) { setError("Unable to load audience analysis."); return; }
      const data = await response.json() as { summary: Summary; products: ProductInterest[]; pages: PageInterest[]; regions: RegionInterest[]; sources: SourceInterest[] };
      setSummary(data.summary); setProducts(data.products); setPages(data.pages); setRegions(data.regions); setSources(data.sources);
    }).catch(() => setError("Unable to load audience analysis."));
    void fetch("/api/admin/content/analytics").then(async (response) => { if (response.ok) setContent((await response.json()).analytics || []); });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6"><div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Audience and interest</h1><p className="mt-1 text-sm text-gray-500">What people explore, where they arrive from, and which products hold attention.</p></div><div className="flex gap-4 text-sm"><Link href="/admin/audit-log" className="text-blue-700 hover:text-blue-900">Visitor activity</Link><Link href="/admin" className="text-blue-700 hover:text-blue-900">Dashboard</Link></div></div>
      {error && <p className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <div className="mb-8 grid grid-cols-3 gap-px overflow-hidden border bg-gray-200">{[["Page views", summary.views], ["Visitors", summary.visitors], ["Visits", summary.sessions]].map(([label, value]) => <div key={label} className="bg-white px-5 py-4"><p className="text-xs uppercase text-gray-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</div>

      <section className="mb-8 overflow-hidden border bg-white"><div className="border-b px-5 py-4"><h2 className="font-semibold">Products people care about</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Visitors</th><th className="px-5 py-3">Average attention</th><th className="px-5 py-3">Last viewed</th></tr></thead><tbody className="divide-y divide-gray-100">{products.map((item) => <tr key={item.product.id}><td className="px-5 py-4"><Link href={`/products/${item.product.legacyId || item.product.handle}`} className="font-medium text-blue-700 hover:underline">{item.product.title}</Link></td><td className="px-5 py-4 font-semibold">{item.views}</td><td className="px-5 py-4">{item.visitors}</td><td className="px-5 py-4">{averageDuration(item.durationMs, item.views)}</td><td className="whitespace-nowrap px-5 py-4 text-gray-500">{new Date(item.lastViewedAt).toLocaleString()}</td></tr>)}</tbody></table></div>{!products.length && <p className="p-6 text-sm text-gray-500">No product views recorded yet.</p>}</section>

      <div className="mb-8 grid gap-8 xl:grid-cols-2">
        <section className="overflow-hidden border bg-white"><div className="border-b px-5 py-4"><h2 className="font-semibold">Every page</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Page</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Visitors</th><th className="px-5 py-3">Avg.</th></tr></thead><tbody className="divide-y divide-gray-100">{pages.map((page) => <tr key={page.path}><td className="px-5 py-4"><p className="font-medium">{page.title || page.path}</p><p className="text-xs text-gray-500">{page.path}</p></td><td className="px-5 py-4 font-semibold">{page.views}</td><td className="px-5 py-4">{page.visitors}</td><td className="px-5 py-4">{averageDuration(page.durationMs, page.views)}</td></tr>)}</tbody></table></div></section>
        <RankedTable title="Where visitors come from" rows={sources.map((item) => ({ label: item.source, views: item.views, visitors: item.visitors }))} />
      </div>
      <RankedTable title="Visitor locations" rows={regions.map((item) => ({ label: [item.city, item.regionName, item.countryName].filter(Boolean).join(", ") || "Unknown", views: item.views, visitors: item.visitors }))} />
      <section className="mt-8 overflow-hidden border bg-white"><div className="border-b px-5 py-4"><h2 className="font-semibold">Content engagement</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Content</th><th className="px-5 py-3">Event</th><th className="px-5 py-3">Count</th></tr></thead><tbody className="divide-y divide-gray-100">{content.map((item, index) => <tr key={`${item.content.id}-${item.eventType}-${index}`}><td className="px-5 py-4">{item.content.title || item.content.id}</td><td className="px-5 py-4">{item.eventType}</td><td className="px-5 py-4 font-semibold">{item.count}</td></tr>)}</tbody></table></div>{!content.length && <p className="p-6 text-sm text-gray-500">No content events recorded yet.</p>}</section>
    </div></main>
  );
}
