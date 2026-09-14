// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPublishedContent } from "@/lib/content-store";
export const dynamic = "force-dynamic";
export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) { const item = await findPublishedContent((await params).slug); if (!item) notFound(); const docs = item.assets.filter((a) => a.kind === "DOCUMENT"); return <main className="min-h-screen bg-[#f5f2eb] p-8 text-[#19382f]"><Link href="/ideas">All ideas</Link><article className="mx-auto max-w-3xl py-20"><p className="text-xs uppercase tracking-widest">{item.type}</p><h1 className="mt-5 font-[family-name:var(--font-display)] text-6xl">{item.title}</h1>{item.excerpt && <p className="mt-6 text-xl">{item.excerpt}</p>}<div className="prose mt-10">{item.body?.split(/\n\s*\n/).map((text, i) => <p key={i}>{text}</p>)}</div>{docs.map((doc) => <div key={doc.id} className="mt-8 flex justify-between border p-4"><span>{doc.originalName}</span><span className="flex gap-4"><a href={doc.publicUrl} target="_blank" rel="noreferrer">Open</a><a href={doc.publicUrl} download>Download</a></span></div>)}</article></main>; }
