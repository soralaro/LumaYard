"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Summary = { totalViews: number; totalVisitors: number; last24Hours: number; activeVisitors: number };
type Identity = { name: string; email: string; phone: string | null };
type Visitor = {
  visitorId: string; views: number; sessions: number; firstSeenAt: string; lastSeenAt: string;
  identity: Identity | null; ipAddress: string | null; countryName: string | null; regionName: string | null;
  city: string | null; latestPath: string; referrer: string | null; userAgent: string | null;
};
type PageVisit = {
  id: string; visitorId: string; sessionId: string | null; path: string; pageTitle: string | null;
  ipAddress: string | null; countryName: string | null; regionName: string | null; city: string | null;
  referrer: string | null; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null;
  language: string | null; timezone: string | null; screenWidth: number | null; screenHeight: number | null;
  userAgent: string | null; durationMs: number | null; createdAt: string; product: { title: string } | null;
};
type Event = { id: string; action: string; ipAddress: string | null; createdAt: string; user: { email: string } | null };

function region(value: { city: string | null; regionName: string | null; countryName: string | null }) {
  return [value.city, value.regionName, value.countryName].filter(Boolean).join(", ") || "Unknown";
}

function source(referrer: string | null) {
  if (!referrer) return "Direct / unknown";
  try { return new URL(referrer).hostname || referrer; } catch { return referrer; }
}

function duration(ms: number | null) {
  if (!ms) return "-";
  if (ms < 60_000) return `${Math.round(ms / 1_000)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

export default function AuditLogPage() {
  const [summary, setSummary] = useState<Summary>({ totalViews: 0, totalVisitors: 0, last24Hours: 0, activeVisitors: 0 });
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [recentViews, setRecentViews] = useState<PageVisit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/audit-log").then(async (response) => {
      if (!response.ok) { setError("Only the account owner can view visitor history."); return; }
      const data = await response.json() as { summary: Summary; visitors: Visitor[]; recentViews: PageVisit[]; events: Event[] };
      setSummary(data.summary); setVisitors(data.visitors); setRecentViews(data.recentViews); setEvents(data.events);
    }).catch(() => setError("Unable to load visitor history."));
  }, []);

  const metrics = [
    ["Watching now", summary.activeVisitors], ["Last 24 hours", summary.last24Hours],
    ["Known visitors", summary.totalVisitors], ["All page views", summary.totalViews],
  ] as const;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Visitor activity</h1><p className="mt-1 text-sm text-gray-500">Anonymous and identified customers across every public page.</p></div>
          <div className="flex gap-4 text-sm"><Link href="/admin/analytics" className="text-blue-700 hover:text-blue-900">View analysis</Link><Link href="/admin" className="text-blue-700 hover:text-blue-900">Dashboard</Link></div>
        </div>
        {error && <p className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden border bg-gray-200 sm:grid-cols-4">
          {metrics.map(([label, value]) => <div key={label} className="bg-white px-5 py-4"><p className="text-xs uppercase text-gray-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}
        </div>

        <section className="mb-8 overflow-hidden border bg-white">
          <div className="border-b px-5 py-4"><h2 className="font-semibold">Visitors</h2><p className="mt-1 text-xs text-gray-500">A name and email appear when the visitor submits an inquiry.</p></div>
          <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Visitor</th><th className="px-5 py-3">Location / IP</th><th className="px-5 py-3">Latest page</th><th className="px-5 py-3">Activity</th><th className="px-5 py-3">Last seen</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{visitors.map((visitor) => <tr key={visitor.visitorId}>
              <td className="px-5 py-4"><p className="font-medium">{visitor.identity?.name || `Anonymous ${visitor.visitorId.slice(0, 8)}`}</p><p className="text-xs text-gray-500">{visitor.identity?.email || visitor.visitorId}</p></td>
              <td className="px-5 py-4"><p>{region(visitor)}</p><p className="font-mono text-xs text-gray-500">{visitor.ipAddress || "IP unavailable"}</p></td>
              <td className="px-5 py-4"><p className="font-medium">{visitor.latestPath}</p><p className="max-w-56 truncate text-xs text-gray-500" title={visitor.referrer || ""}>{source(visitor.referrer)}</p></td>
              <td className="px-5 py-4">{visitor.views} pages / {visitor.sessions || 1} visits</td>
              <td className="whitespace-nowrap px-5 py-4 text-gray-500">{new Date(visitor.lastSeenAt).toLocaleString()}</td>
            </tr>)}</tbody>
          </table></div>
          {!visitors.length && !error && <p className="p-6 text-sm text-gray-500">No public visits recorded yet.</p>}
        </section>

        <section className="mb-8 overflow-hidden border bg-white">
          <div className="border-b px-5 py-4"><h2 className="font-semibold">Recent page views</h2><p className="mt-1 text-xs text-gray-500">Latest 500 rows are shown; older history remains stored and included in totals.</p></div>
          <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Page</th><th className="px-5 py-3">Visitor</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Device</th><th className="px-5 py-3">Time</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{recentViews.map((view) => <tr key={view.id}>
              <td className="px-5 py-4"><p className="font-medium">{view.product?.title || view.pageTitle || view.path}</p><p className="text-xs text-gray-500">{view.path} · {duration(view.durationMs)}</p></td>
              <td className="px-5 py-4 font-mono text-xs">{view.visitorId.slice(0, 8)}</td>
              <td className="px-5 py-4"><p>{region(view)}</p><p className="font-mono text-xs text-gray-500">{view.ipAddress || "-"}</p></td>
              <td className="px-5 py-4"><p>{view.utmSource || source(view.referrer)}</p>{view.utmCampaign && <p className="text-xs text-gray-500">{view.utmCampaign}</p>}</td>
              <td className="max-w-64 px-5 py-4" title={view.userAgent || ""}><p>{view.language || "-"} · {view.timezone || "-"}</p><p className="truncate text-xs text-gray-500">{view.screenWidth && view.screenHeight ? `${view.screenWidth}×${view.screenHeight}` : "Screen unknown"} · {view.userAgent || "Device unknown"}</p></td>
              <td className="whitespace-nowrap px-5 py-4 text-gray-500">{new Date(view.createdAt).toLocaleString()}</td>
            </tr>)}</tbody>
          </table></div>
        </section>

        <details className="border bg-white"><summary className="cursor-pointer px-5 py-4 font-semibold">Administrator security activity ({events.length})</summary><div className="overflow-x-auto border-t"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs text-gray-500"><tr><th className="px-5 py-3">Action</th><th className="px-5 py-3">Account</th><th className="px-5 py-3">IP</th><th className="px-5 py-3">Time</th></tr></thead><tbody className="divide-y divide-gray-100">{events.map((event) => <tr key={event.id}><td className="px-5 py-4">{event.action}</td><td className="px-5 py-4">{event.user?.email || "System"}</td><td className="px-5 py-4">{event.ipAddress || "-"}</td><td className="px-5 py-4 text-gray-500">{new Date(event.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div></details>
      </div>
    </main>
  );
}
