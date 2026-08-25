import { getProduct, products } from "@/data/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  return { title: product ? `${product.title} | LumaYard` : "Product | LumaYard", description: product?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const whatsapp = `https://wa.me/${process.env.WHATSAPP_NUMBER ?? "15551234567"}?text=${encodeURIComponent(`Hi, I'm interested in ${product.title}`)}`;

  return <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 sm:px-8 lg:px-14"><div className="mx-auto max-w-[1440px]"><div className="flex items-center justify-between"><Link href="/" className="font-[family-name:var(--font-display)] text-3xl text-[#19382f]">Luma<span className="italic">Yard</span></Link><Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#19382f]">Back to shop</Link></div><div className="mt-14 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-18"><div className="overflow-hidden bg-[#849075]"><img src={product.image} alt={product.title} className="aspect-square h-full w-full object-cover" /></div><div className="flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">{product.collection} collection</p><h1 className="mt-4 max-w-lg font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-[#19382f] sm:text-6xl">{product.title}</h1><p className="mt-5 text-2xl text-[#927141]">${product.price}</p><p className="mt-7 max-w-lg text-base leading-7 text-[#536058]">{product.description}</p><div className="mt-8 border-y border-[#19382f]/20 py-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b7e57]">Why you&apos;ll love it</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{product.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-[#19382f]"><span className="h-1.5 w-1.5 rounded-full bg-[#c89957]" />{feature}</li>)}</ul></div><div className="mt-8 flex flex-col gap-3 sm:flex-row">{product.stripePaymentLink ? <a href={product.stripePaymentLink} target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center bg-[#19382f] px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#102c25]">Buy now — ${product.price}</a> : null}<a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center border border-[#19382f]/35 px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-[#19382f] hover:border-[#19382f]">Get a project quote</a></div><p className="mt-4 text-xs text-[#536058]">Need a larger setup? We&apos;ll help you plan quantities and placement.</p></div></div></div></main>;
}
