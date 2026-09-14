import Image from "next/image";
import Link from "next/link";
import { listPublishedContent, contentTypeLabel } from "@/lib/content-store";

type ContentCard = Awaited<ReturnType<typeof listPublishedContent>>[number];
type ContentAsset = ContentCard["assets"][number];

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const items = await listPublishedContent();
  return <main className="min-h-screen bg-[#f5f2eb] text-[#19382f]">
    <header className="border-b border-[#19382f]/10 bg-[#f5f2eb] px-6 py-7 md:px-12"><div className="mx-auto flex max-w-[1440px] items-center justify-between"><Link href="/" className="font-[family-name:var(--font-display)] text-3xl">Luma<span className="italic">Yard</span></Link><Link href="/" className="text-xs font-bold uppercase tracking-[0.16em]">Back home</Link></div></header>
    <section className="mx-auto max-w-[1440px] px-6 pb-12 pt-20 md:px-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927141]">Ideas & inspiration</p><h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.02] md:text-7xl">A better way to live outside.</h1><p className="mt-6 max-w-xl text-base leading-7 text-[#536058]">Guides, gardens and considered details for evenings that last a little longer.</p></section>
    <section className="mx-auto grid max-w-[1440px] gap-6 px-6 pb-24 sm:grid-cols-2 md:px-12 lg:grid-cols-3">{items.map((item: ContentCard) => { const image = item.assets.find((a: ContentAsset) => a.kind === "IMAGE" && !a.pageNumber) ?? item.assets.find((a: ContentAsset) => a.kind === "IMAGE"); return <Link key={item.id} href={`/ideas/${item.slug}`} className="group border-t border-[#19382f]/20 pt-4">{image && <div className="relative aspect-[4/3] overflow-hidden rounded-t-[20px] bg-[#e4dfd5]"><Image src={image.publicUrl} alt={image.altText || item.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" /></div>}<p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#927141]">{contentTypeLabel(item.type)}</p><h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight group-hover:underline">{item.title}</h2>{item.excerpt && <p className="mt-3 text-sm leading-6 text-[#536058]">{item.excerpt}</p>}</Link>})}</section>
    {items.length === 0 && <p className="mx-auto max-w-xl px-6 pb-24 text-center text-[#536058]">New ideas are on the way.</p>}
  </main>;
}
