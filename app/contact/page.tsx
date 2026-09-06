"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactForm from "./contact-form";

type ContactSettings = { email: string; whatsappNumber: string; linkedinUrl: string; serviceArea: string; hours: string };
const defaults: ContactSettings = { email: "hello@lumayard.com", whatsappNumber: "15551234567", linkedinUrl: "", serviceArea: "Serving homeowners and outdoor projects across the United States.", hours: "Mon-Fri, 9am-5pm" };

export default function ContactPage() {
  const [settings, setSettings] = useState(defaults);
  useEffect(() => { void fetch("/api/site-settings").then(async (response) => { if (response.ok) setSettings(await response.json()); }); }, []);
  const whatsapp = settings.whatsappNumber.replace(/[^\d]/g, "");
  return <main className="min-h-screen bg-[#dfd7c8] px-5 py-10 sm:px-8 lg:px-14"><div className="mx-auto max-w-[1100px]"><div className="flex items-center justify-between"><Link href="/" className="font-[family-name:var(--font-display)] text-3xl text-[#19382f]">Luma<span className="italic">Yard</span></Link><Link href="/" className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#19382f]">Home</Link></div><div className="mt-20 grid gap-14 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Start a conversation</p><h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-[#19382f]">Tell us what you&apos;re imagining.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#536058]">Whether you&apos;re looking for one lamp or a complete outdoor plan, we&apos;re here to help you make a space you&apos;ll use more often.</p><div className="mt-10 space-y-5 border-t border-[#19382f]/20 pt-5 text-sm text-[#19382f]"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b7e57]">Email</p><a href={`mailto:${settings.email}`} className="mt-1 inline-block underline decoration-[#c89957] underline-offset-4">{settings.email}</a></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b7e57]">WhatsApp</p><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="mt-1 inline-block underline decoration-[#c89957] underline-offset-4">Message our team</a></div>{settings.linkedinUrl && <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b7e57]">LinkedIn</p><a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block underline decoration-[#c89957] underline-offset-4">Follow LumaYard</a></div>}<p className="leading-6 text-[#536058]"><strong className="font-semibold text-[#19382f]">Service area:</strong> {settings.serviceArea}<br /><strong className="font-semibold text-[#19382f]">Response hours:</strong> {settings.hours}</p></div></div><ContactForm /></div></div></main>;
}
