import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPublishedContent, contentTypeLabel } from "@/lib/content-store";

type ContentDetail = NonNullable<Awaited<ReturnType<typeof findPublishedContent>>>;

export const dynamic = "force-dynamic";

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await findPublishedContent(slug);
  if (!item) notFound();
  const images = item.assets.filter((asset: ContentDetail["assets"][number]) => asset.kind === "IMAGE");
  return <main className="min-h-screen bg-[#f5f2eb] text-[#19382f]"><header className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-7"><Link href="/ideas" className="text-xs font-bold uppercase tracking-[0.16em]">All ideas</Link><Link href="/" className="font-[family-name:var(--font-display)] text-2xl">Luma<span className="italic">Yard</span></Link></header><article className="mx-auto max-w-[900px] px-6 pb-24 pt-14"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927141]">{contentTypeLabel(item.type)}{item.category ? ` / ${item.category}` : ""}</p><h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[1.03] md:text-7xl">{item.title}</h1>{item.excerpt && <p className="mt-7 max-w-2xl text-xl leading-8 text-[#536058]">{item.excerpt}</p>}<div className="prose prose-lg mt-12 max-w-none text-[#33443d]">{item.body?.split(/\n\s*\n/).map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}</div>{images.length > 0 && <div className="mt-14 grid gap-5 sm:grid-cols-2">{images.map((image: ContentDetail["assets"][number]) => <figure key={image.id}><div className="relative aspect-[4/3] overflow-hidden rounded-t-[20px]"><Image src={image.publicUrl} alt={image.altText || item.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" /></div>{image.caption && <figcaption className="mt-2 text-xs text-[#536058]">{image.caption}</figcaption>}</figure>)}</div>}</article></main>;
}
