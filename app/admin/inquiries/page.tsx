"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type InquiryStatus = "NEW" | "IN_PROGRESS" | "CLOSED" | "SPAM";
type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
  visitorId: string | null;
  status: InquiryStatus;
  internalNotes: string | null;
  ipAddress: string | null;
  countryCode: string | null;
  countryName: string | null;
  regionName: string | null;
  city: string | null;
  userAgent: string | null;
  createdAt: string;
  product: { legacyId: string | null; handle: string; title: string } | null;
  interestedProducts: { id: string; handle: string; title: string; views: number; lastViewedAt: string }[];
};

const statusLabels: Record<InquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CLOSED: "Closed",
  SPAM: "Spam",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadInquiries = useCallback(async () => {
    const response = await fetch("/api/admin/inquiries");
    if (!response.ok) { setError("Unable to load inquiries."); return; }
    const data = await response.json() as { inquiries: Inquiry[] };
    setInquiries(data.inquiries);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadInquiries(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadInquiries]);

  const selectInquiry = (inquiry: Inquiry) => {
    setSelected(inquiry);
    setNotes(inquiry.internalNotes || "");
  };

  const saveInquiry = async (status: InquiryStatus) => {
    if (!selected) return;
    setSaving(true);
    const response = await fetch(`/api/admin/inquiries/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNotes: notes }),
    });
    const data = await response.json() as { inquiry?: Inquiry; error?: string };
    setSaving(false);
    if (!response.ok || !data.inquiry) { setError(data.error || "Unable to save inquiry."); return; }
    const updated = { ...selected, ...data.inquiry, interestedProducts: selected.interestedProducts };
    setSelected(updated);
    setInquiries((current) => current.map((inquiry) => inquiry.id === updated.id ? updated : inquiry));
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Customer inquiries</h1></div><Link href="/admin" className="text-sm text-blue-700 hover:text-blue-900">Back to dashboard</Link></div>
        {error && <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b px-5 py-4 text-sm font-semibold">{inquiries.length} inquiries</div><div className="divide-y divide-gray-100">{inquiries.map((inquiry) => <button key={inquiry.id} onClick={() => selectInquiry(inquiry)} className={`block w-full px-5 py-4 text-left hover:bg-gray-50 ${selected?.id === inquiry.id ? "bg-blue-50" : ""}`}><div className="flex items-center justify-between gap-3"><span className="font-medium">{inquiry.name}</span><span className="text-xs text-gray-500">{statusLabels[inquiry.status]}</span></div><p className="mt-1 truncate text-sm text-gray-600">{inquiry.email}</p><p className="mt-1 text-xs text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</p></button>)}</div></section>
          <section className="rounded-lg bg-white p-6 shadow-sm">{selected ? <><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{selected.name}</h2><a href={`mailto:${selected.email}`} className="text-sm text-blue-700 hover:underline">{selected.email}</a></div><select value={selected.status} onChange={(event) => void saveInquiry(event.target.value as InquiryStatus)} disabled={saving} className="rounded border px-3 py-2 text-sm">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="mt-6 border-t pt-5"><p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{selected.message}</p></div><div className="mt-6 border-t pt-5"><h3 className="text-sm font-semibold">Product interest</h3>{selected.interestedProducts.length ? <div className="mt-3 space-y-2">{selected.interestedProducts.map((product) => <Link key={product.id} href={`/products/${product.id}`} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100"><span>{product.title}</span><span className="text-xs text-gray-500">{product.views} view{product.views === 1 ? "" : "s"}</span></Link>)}</div> : <p className="mt-2 text-sm text-gray-500">No product views linked to this visitor.</p>}</div><div className="mt-6 grid gap-3 border-t pt-5 text-xs text-gray-500"><p>Visitor: {selected.visitorId || "Unavailable"}</p><p>Source: {selected.source}</p><p>IP: {selected.ipAddress || "Unavailable"}</p><p>Region: {[selected.city, selected.regionName, selected.countryName].filter(Boolean).join(", ") || "Local network / unknown"}</p><p className="break-all">Device: {selected.userAgent || "Unavailable"}</p></div><label className="mt-6 block border-t pt-5 text-sm font-medium">Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} className="mt-2 w-full rounded border p-3 font-normal" placeholder="Notes visible only to administrators" /></label><button onClick={() => void saveInquiry(selected.status)} disabled={saving} className="mt-4 rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50">{saving ? "Saving..." : "Save notes"}</button></> : <p className="text-sm text-gray-500">Select an inquiry to review it.</p>}</section>
        </div>
      </div>
    </main>
  );
}
