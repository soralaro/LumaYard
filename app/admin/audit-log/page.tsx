"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = { id: string; action: string; entityType: string; entityId: string | null; ipAddress: string | null; createdAt: string; user: { email: string; name: string | null } | null };
type Session = { id: string; ipAddress: string | null; userAgent: string | null; createdAt: string; expiresAt: string; user: { email: string; name: string | null } };

export default function AuditLogPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/audit-log").then(async (response) => {
      if (!response.ok) { setError("Only the account owner can view audit history."); return; }
      const data = await response.json() as { events: Event[]; sessions: Session[] };
      setEvents(data.events); setSessions(data.sessions);
    }).catch(() => setError("Unable to load audit history."));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900"><div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Access history</h1></div><Link href="/admin" className="text-sm text-blue-700 hover:text-blue-900">Back to dashboard</Link></div>
      {error && <p className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <section className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-semibold">Recent sign-ins</h2></div><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Account</th><th className="px-5 py-3">IP address</th><th className="px-5 py-3">Device</th><th className="px-5 py-3">Signed in</th></tr></thead><tbody className="divide-y divide-gray-100">{sessions.map((session) => <tr key={session.id}><td className="px-5 py-4">{session.user.email}</td><td className="px-5 py-4">{session.ipAddress || "Unavailable"}</td><td className="max-w-xs truncate px-5 py-4 text-gray-500" title={session.userAgent || ""}>{session.userAgent || "Unavailable"}</td><td className="px-5 py-4 text-gray-600">{new Date(session.createdAt).toLocaleString()}</td></tr>)}</tbody></table></section>
      <section className="overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-semibold">Administrative activity</h2></div><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Action</th><th className="px-5 py-3">Account</th><th className="px-5 py-3">IP address</th><th className="px-5 py-3">Time</th></tr></thead><tbody className="divide-y divide-gray-100">{events.map((event) => <tr key={event.id}><td className="px-5 py-4">{event.action}</td><td className="px-5 py-4">{event.user?.email || "System"}</td><td className="px-5 py-4">{event.ipAddress || "Unavailable"}</td><td className="px-5 py-4 text-gray-600">{new Date(event.createdAt).toLocaleString()}</td></tr>)}</tbody></table></section>
    </div></main>
  );
}
