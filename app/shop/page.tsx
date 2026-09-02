import { products } from "@/data/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop | LumaYard",
  description: "Fences, lighting, robotics, and energy solutions for complete outdoor living.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-12 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1440px]">
        <Link href="/" className="font-[family-name:var(--font-display)] text-3xl text-[#19382f]">Luma<span className="italic">Yard</span></Link>
        <div className="mt-18 max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">The complete collection</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.04em] text-[#19382f] sm:text-7xl">Everything for outdoor living.</h1><p className="mt-6 text-base leading-7 text-[#536058]">From privacy fencing to smart garden tools, find what makes your outdoor space work beautifully.</p></div>
        <div className="mt-16 grid gap-x-5 gap-y-12 md:grid-cols-3">{products.map((product) => <article key={product.handle}><Link href={`/products/${product.handle}`} className="group block overflow-hidden bg-[#849075]"><img src={product.image} alt={product.title} className="aspect-[1.05] w-full object-cover transition duration-700 group-hover:scale-105" /></Link><div className="mt-4 flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#927141]">{product.collection}</p><h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#19382f]"><Link href={`/products/${product.handle}`}>{product.title}</Link></h2></div><span className="pt-4 text-sm text-[#536058]">${product.price.toLocaleString()}</span></div><p className="mt-2 max-w-sm text-sm leading-6 text-[#536058]">{product.description}</p></article>)}</div>
      </div>
    </main>
  );
}
