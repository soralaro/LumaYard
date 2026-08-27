import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./contact-form";

export const metadata: Metadata = { title: "Contact | LumaYard", description: "Tell us about the outdoor space you are creating." };

export default function ContactPage() {
  const whatsappNumber = process.env.WHATSAPP_NUMBER ?? "15551234567";
  return <main className="min-h-screen bg-[#dfd7c8] px-5 py-10 sm:px-8 lg:px-14"><div className="mx-auto max-w-[1100px]"><div className="flex items-center justify-between"><Link href="/" className="font-[family-name:var(--font-display)] text-3xl text-[#19382f]">Luma<span className="italic">Yard</span></Link><Link href="/" className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#19382f]">Home</Link></div><div className="mt-20 grid gap-14 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Start a conversation</p><h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-[#19382f]">Tell us what you&apos;re imagining.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#536058]">Whether you&apos;re looking for one lamp or a complete outdoor plan, we&apos;re here to help you make a space you&apos;ll use more often.</p><div className="mt-10 border-t border-[#19382f]/20 pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b7e57]">Prefer WhatsApp?</p><a href={`https://wa.me/${whatsappNumber}`} className="mt-2 inline-block text-lg text-[#19382f] underline decoration-[#c89957] underline-offset-4">Message our team</a></div></div><ContactForm /></div></div></main>;
}
