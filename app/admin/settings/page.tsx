"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Settings = { email: string; whatsappNumber: string; linkedinUrl: string; facebookUrl: string; xUrl: string; instagramUrl: string; youtubeUrl: string; serviceArea: string; hours: string };
const empty: Settings = { email: "", whatsappNumber: "", linkedinUrl: "", facebookUrl: "", xUrl: "", instagramUrl: "", youtubeUrl: "", serviceArea: "", hours: "" };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(empty);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { void fetch("/api/admin/site-settings").then(async (res) => { if (!res.ok) throw new Error(); setSettings(await res.json()); }).catch(() => setError("Unable to load settings.")); }, []);
  const save = async (event: React.FormEvent) => { event.preventDefault(); setMessage(""); setError(""); const res = await fetch("/api/admin/site-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) }); const data = await res.json(); if (!res.ok) { setError(data.error || "Unable to save settings."); return; } setSettings(data); setMessage("Saved. Public contact details are now updated."); };
  return <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900"><div className="mx-auto max-w-3xl"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Public contact settings</h1></div><Link href="/admin" className="text-sm text-blue-700 hover:underline">Back to dashboard</Link></div><form onSubmit={save} className="space-y-5 rounded-lg bg-white p-6 shadow-sm"><p className="text-sm text-gray-600">These details appear on the website footer and contact page. WhatsApp numbers should include country code.</p>{([['email','Email address','hello@lumayard.com'],['whatsappNumber','WhatsApp number','15551234567'],['linkedinUrl','LinkedIn URL','https://www.linkedin.com/company/...'],['facebookUrl','Facebook URL','https://www.facebook.com/...'],['xUrl','X URL','https://x.com/...'],['instagramUrl','Instagram URL','https://www.instagram.com/...'],['youtubeUrl','YouTube URL','https://www.youtube.com/@...'],['serviceArea','Service area','Serving homeowners...'],['hours','Response hours','Mon-Fri, 9am-5pm']] as const).map(([key,label,placeholder]) => <label key={key} className="block text-sm font-medium">{label}<input type={key.endsWith("Url") ? "url" : "text"} value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder} className="mt-2 w-full rounded border px-3 py-2 font-normal" /></label>)}{error && <p className="text-sm text-red-700">{error}</p>}{message && <p className="text-sm text-green-700">{message}</p>}<button className="rounded bg-[#19382f] px-5 py-2 text-sm font-semibold text-white">Save settings</button></form></div></main>;
}
