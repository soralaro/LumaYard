"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import products from "@/data/products.json";

type IconName =
  | "arrow"
  | "menu"
  | "close"
  | "spark"
  | "sun"
  | "drop"
  | "bolt"
  | "leaf"
  | "pin"
  | "plus";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const shared = {
    className: `h-5 w-5 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "arrow") return <svg {...shared}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
  if (name === "menu") return <svg {...shared}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
  if (name === "close") return <svg {...shared}><path d="M6 6l12 12M18 6 6 18" /></svg>;
  if (name === "spark") return <svg {...shared}><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>;
  if (name === "sun") return <svg {...shared}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
  if (name === "drop") return <svg {...shared}><path d="M12 2.5S5.5 9.1 5.5 14A6.5 6.5 0 0 0 18.5 14c0-4.9-6.5-11.5-6.5-11.5Z" /><path d="M9.2 15.2c.3 1.2 1.2 2.1 2.5 2.4" /></svg>;
  if (name === "bolt") return <svg {...shared}><path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" /></svg>;
  if (name === "leaf") return <svg {...shared}><path d="M20.5 3.5C12 3.5 5 7.2 5 14c0 3.7 2.7 6.5 6.2 6.5 6.8 0 9.3-8.7 9.3-17Z" /><path d="M3.5 20.5c3-5 6.5-7.6 11.5-10" /></svg>;
  if (name === "pin") return <svg {...shared}><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  return <svg {...shared}><path d="M12 5v14M5 12h14" /></svg>;
}

const spaces = [
  { title: "Backyard", eyebrow: "Gather after dark", color: "bg-[#9e8c70]", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85" },
  { title: "Garden", eyebrow: "Let every path glow", color: "bg-[#749068]", image: "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1000&q=85" },
  { title: "Patio", eyebrow: "Your table, outdoors", color: "bg-[#ad7959]", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85" },
  { title: "Deck", eyebrow: "Stay a little longer", color: "bg-[#63705a]", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
];

const collections = [
  { number: "01", title: "Solar lighting", description: "Warm, reliable light that comes on when the evening does.", image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85" },
  { number: "02", title: "Portable light", description: "Rechargeable lamps for every table, blanket, and last round.", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85" },
  { number: "03", title: "Privacy & structure", description: "Beautiful boundaries that make a space feel entirely your own.", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85" },
];

const ideas = [
  { category: "The Luma journal", title: "How to light a backyard you never want to leave", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85" },
  { category: "Outdoor notes", title: "Five easy ways to make a small patio feel expansive", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85" },
  { category: "Garden guide", title: "The quiet art of creating garden boundaries", image: "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1000&q=85" },
];

function ArrowLink({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <a href="#shop" className={`group inline-flex items-center gap-3 border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${light ? "border-white/35 text-white hover:border-white" : "border-[#1e3b33]/35 text-[#1e3b33] hover:border-[#1e3b33]"}`}>{children}<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("Backyard");

  return (
    <main className="overflow-hidden">
      <div className="bg-[#1e3b33] px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f8f3e9] sm:text-xs">
        Free shipping on lighting orders over $99 <span className="mx-2 text-[#c89957]">·</span> Made for long nights outside
      </div>

      <header className="absolute inset-x-0 top-[39px] z-30 text-white">
        <div className="mx-auto flex h-22 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-14">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] sm:text-3xl">Luma<span className="italic">Yard</span></Link>
          <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em] lg:flex">
            <a href="#shop" className="transition-opacity hover:opacity-65">Shop</a>
            <a href="#spaces" className="transition-opacity hover:opacity-65">Spaces</a>
            <a href="#look" className="transition-opacity hover:opacity-65">The look</a>
            <a href="#ideas" className="transition-opacity hover:opacity-65">Ideas</a>
            <a href="#planner" className="flex items-center gap-1.5 text-[#edce9b] transition-opacity hover:opacity-65"><Icon name="spark" className="h-3.5 w-3.5" />Plan my yard</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden text-[11px] font-bold uppercase tracking-[0.16em] sm:block">Contact us</a>
            <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white/15 lg:hidden"><Icon name="menu" /></button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-[#17362e] px-6 py-6 text-white lg:hidden">
        <div className="flex items-center justify-between"><span className="font-[family-name:var(--font-display)] text-3xl">Luma<span className="italic">Yard</span></span><button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/35"><Icon name="close" /></button></div>
        <nav className="mt-18 flex flex-col gap-7 text-3xl font-[family-name:var(--font-display)]"><a onClick={() => setMenuOpen(false)} href="#shop">Shop</a><a onClick={() => setMenuOpen(false)} href="#spaces">Spaces</a><a onClick={() => setMenuOpen(false)} href="#look">The look</a><a onClick={() => setMenuOpen(false)} href="#ideas">Ideas</a><a onClick={() => setMenuOpen(false)} href="#planner" className="text-[#edce9b]">Plan my yard</a></nav>
      </div>}

      <section className="relative flex min-h-[740px] items-end bg-[#283f32] md:min-h-[820px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=90')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102c25]/82 via-[#102c25]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#102c25]/62 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-18 pt-48 text-white md:px-10 md:pb-24 lg:px-14">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#edce9b]"><span className="h-px w-8 bg-[#edce9b]" />Outdoor living, beautifully considered</p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-8xl">Bring the<br /><em className="font-normal">evening</em> home.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/80 md:text-lg">Thoughtful lighting and outdoor pieces for the moments you want to make last.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#shop" className="inline-flex min-h-13 items-center justify-center bg-[#e8c58d] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[#18372f] transition-transform hover:-translate-y-0.5">Explore the collection</a><a href="#planner" className="inline-flex min-h-13 items-center justify-center border border-white/55 px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#18372f]">Plan your space</a></div>
        </div>
        <div className="absolute bottom-7 right-8 hidden items-center gap-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 md:flex"><span>Scroll to wander</span><span className="h-11 w-px bg-white/45" /></div>
      </section>

      <section id="spaces" className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Find your feeling</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">Start with your space.</h2></div><p className="max-w-sm text-sm leading-6 text-[#536058]">Every outdoor space has a different rhythm. Begin where you gather, grow, and slow down.</p></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {spaces.map((space) => <a href="#shop" key={space.title} className="group relative aspect-[0.78] overflow-hidden bg-[#74806d]"><Image src={space.image} alt={`${space.title} outdoor space`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#122c25]/80 via-transparent to-transparent" /><div className="absolute inset-x-4 bottom-4 text-white md:inset-x-5 md:bottom-5"><p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/70">{space.eyebrow}</p><div className="flex items-end justify-between"><h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">{space.title}</h3><Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div></div></a>)}
          </div>
        </div>
      </section>

      <section id="shop" className="bg-[#eae4d9] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 grid gap-5 md:grid-cols-[1fr_auto]"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Made to live outdoors</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">A better kind of glow.</h2></div><ArrowLink>Shop all collections</ArrowLink></div>
          <div className="grid gap-5 md:grid-cols-3">
            {collections.map((collection) => <article key={collection.title} className="group"><a href="#contact" className="relative block aspect-[1.13] overflow-hidden bg-[#849075]"><Image src={collection.image} alt={`${collection.title} collection`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></a><div className="border-b border-[#1e3b33]/20 py-5"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.2em] text-[#9c7747]">{collection.number}</span><a href="#contact" aria-label={`Explore ${collection.title}`} className="text-[#1e3b33]"><Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a></div><h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#19382f]">{collection.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#59625b]">{collection.description}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="products" className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Shop the pieces</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">Made for your evenings.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[#536058]">Tap a product to see its full gallery, price, specifications, and details.</p></div>
            <Link href="/shop" className="group inline-flex items-center gap-3 border-b border-[#1e3b33]/35 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1e3b33]">View all products <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {products.map((product) => <article key={product.handle} className="group">
              <Link href={`/products/${product.handle}`} className="relative block aspect-[1.05] overflow-hidden bg-[#849075]"><Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></Link>
              <div className="border-b border-[#1e3b33]/20 py-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#927141]">{product.collection}</p><h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#19382f]"><Link href={`/products/${product.handle}`} className="hover:underline">{product.title}</Link></h3></div><span className="pt-1 text-sm text-[#536058]">${product.price}</span></div><p className="mt-3 text-sm leading-6 text-[#536058]">{product.description}</p><Link href={`/products/${product.handle}`} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#19382f]">View details <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="grid bg-[#183a31] text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-18 lg:py-28"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e8c58d]">A light changed everything</p><h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.04em] sm:text-5xl">The best rooms don&apos;t have ceilings.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/70">We believe your outdoor space deserves the same attention as the one inside. A little warmth is where every beautiful evening begins.</p><div className="mt-9"><ArrowLink light>Discover our story</ArrowLink></div></div>
        <div className="relative min-h-[430px] overflow-hidden"><Image src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1300&q=85" alt="A warm outdoor dining table at night" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-[#15352d]/15" /><div className="absolute bottom-7 left-7 flex items-center gap-3 rounded-full bg-[#f5f2eb] px-4 py-2.5 text-xs font-semibold text-[#17362e]"><Icon name="spark" className="h-4 w-4 text-[#b96a48]" />Designed for the golden hour</div></div>
      </section>

      <section id="look" className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-11 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">See it come together</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">The LumaYard look.</h2></div>
          <div className="relative aspect-[1.1] min-h-[440px] overflow-hidden bg-[#697961] md:aspect-[2.25]"><Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=88" alt="A layered outdoor backyard setup" fill sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#102c25]/68 via-transparent to-transparent" />
            <div className="absolute left-6 top-7 max-w-xs text-white md:left-10 md:top-10"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#edce9b]">The softly lit patio</p><h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight md:text-4xl">All the pieces for an evening in.</h3><p className="mt-3 text-sm leading-6 text-white/75">Portable light, layered warmth, and a little more room to linger.</p></div>
            <div className="absolute bottom-6 right-5 flex flex-col gap-3 sm:bottom-8 sm:right-8">{["LumaGo portable lamp", "Solar path light", "Woven privacy screen"].map((item, index) => <a href="#contact" key={item} className="group flex items-center gap-3 self-end rounded-full bg-[#f5f2eb] py-2 pl-2 pr-4 text-xs font-semibold text-[#19382f] shadow-lg"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8c58d] text-[10px]">0{index + 1}</span><span className="hidden sm:block">{item}</span><Icon name="plus" className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" /></a>)}</div>
          </div>
        </div>
      </section>

      <section id="planner" className="bg-[#dfd7c8] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]"><Icon name="spark" className="h-4 w-4" />The outdoor planner</p><h2 className="mt-4 max-w-md font-[family-name:var(--font-display)] text-4xl leading-[1.03] tracking-[-0.04em] text-[#19382f] sm:text-5xl">Your space, considered.</h2><p className="mt-6 max-w-md text-sm leading-7 text-[#536058]">Tell us a little about the way you live outside. We&apos;ll help you take the first step toward a space that feels entirely yours.</p><div className="mt-8"><ArrowLink>Start planning</ArrowLink></div></div>
          <div className="border-t border-[#19382f]/20 pt-7 lg:border-l lg:border-t-0 lg:pl-15 lg:pt-0"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#19382f]/65">01 / Where are you making room?</p><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{spaces.map((space) => <button onClick={() => setSelectedSpace(space.title)} key={space.title} className={`border px-3 py-4 text-left text-sm transition-colors ${selectedSpace === space.title ? "border-[#19382f] bg-[#19382f] text-white" : "border-[#19382f]/25 text-[#19382f] hover:border-[#19382f]"}`}><Icon name="pin" className="mb-4 h-4 w-4" />{space.title}</button>)}</div><p className="mt-9 text-[10px] font-bold uppercase tracking-[0.18em] text-[#19382f]/65">02 / What matters most?</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{["More warmth after sunset", "A little more privacy", "A place to gather", "A garden to linger in"].map((need) => <button key={need} className="flex items-center justify-between border border-[#19382f]/25 px-4 py-4 text-left text-sm text-[#19382f] transition hover:border-[#19382f] hover:bg-[#f5f2eb]"><span>{need}</span><Icon name="plus" className="h-4 w-4" /></button>)}</div><a href="#contact" className="mt-7 inline-flex min-h-12 items-center bg-[#19382f] px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0e2821]">Create my outdoor plan <Icon name="arrow" className="ml-3 h-4 w-4" /></a></div>
        </div>
      </section>

      <section className="bg-[#2b4739] px-5 py-18 text-[#f5f2eb] sm:px-8 md:py-22 lg:px-14">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-4">{[{ icon: "sun" as IconName, title: "Sun-led", text: "Solar light that welcomes you home." }, { icon: "bolt" as IconName, title: "Ready when you are", text: "USB-C backup for every kind of weather." }, { icon: "drop" as IconName, title: "Made for weather", text: "Built to live beautifully outdoors." }, { icon: "leaf" as IconName, title: "Less, but better", text: "Pieces chosen to last beyond the season." }].map((value) => <div key={value.title} className="border-t border-white/20 pt-5"><Icon name={value.icon} className="h-6 w-6 text-[#e8c58d]" /><h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl">{value.title}</h3><p className="mt-2 max-w-45 text-sm leading-6 text-white/65">{value.text}</p></div>)}</div>
      </section>

      <section id="ideas" className="bg-[#f5f2eb] px-5 py-22 sm:px-8 md:py-30 lg:px-14"><div className="mx-auto max-w-[1440px]"><div className="mb-11 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">For the way you live outside</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">A little inspiration.</h2></div><ArrowLink>Read the journal</ArrowLink></div><div className="grid gap-7 md:grid-cols-3">{ideas.map((idea) => <article key={idea.title} className="group"><a href="#contact" className="relative block aspect-[1.3] overflow-hidden bg-[#78856e]"><Image src={idea.image} alt={idea.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></a><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#927141]">{idea.category}</p><h3 className="mt-2 max-w-sm font-[family-name:var(--font-display)] text-2xl leading-tight text-[#19382f]">{idea.title}</h3><a href="#contact" className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#19382f]">Read more <Icon name="arrow" className="h-3.5 w-3.5" /></a></article>)}</div></div></section>

      <section id="contact" className="bg-[#c99759] px-5 py-18 sm:px-8 md:py-22 lg:px-14"><div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#294238]">Make it yours</p><h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.03] tracking-[-0.035em] text-[#17362e] sm:text-5xl">Have a project in mind?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[#294238]/80">From a single light to a complete backyard plan, tell us what you&apos;re creating. We&apos;ll help make it happen.</p></div><a href="mailto:hello@lumayard.com?subject=My%20outdoor%20project" className="inline-flex min-h-13 items-center bg-[#19382f] px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#102c25]">Start a conversation <Icon name="arrow" className="ml-3 h-4 w-4" /></a></div></section>

      <footer className="bg-[#102c25] px-5 pb-7 pt-16 text-[#f5f2eb] sm:px-8 lg:px-14"><div className="mx-auto max-w-[1440px]"><div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.3fr_1fr_1fr_1.15fr]"><div><a href="/" className="font-[family-name:var(--font-display)] text-4xl">Luma<span className="italic">Yard</span></a><p className="mt-5 max-w-xs text-sm leading-6 text-white/65">Beautifully considered pieces for the life you live outside.</p></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Explore</h3><div className="mt-5 flex flex-col gap-3 text-sm text-white/70"><a href="#shop">Shop all</a><a href="#spaces">Spaces</a><a href="#look">Shop the look</a><a href="#planner">Outdoor planner</a></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Help</h3><div className="mt-5 flex flex-col gap-3 text-sm text-white/70"><a href="/contact">Contact us</a><a href="#ideas">Ideas & guides</a><a href="/shipping">Shipping & returns</a><a href="/returns">Returns</a></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">A little more light</h3><p className="mt-5 text-sm leading-6 text-white/65">New arrivals, outdoor notes, and good reasons to stay out later.</p><form className="mt-5 flex border-b border-white/45 pb-2"><input type="email" aria-label="Email address" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/45" /><button className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c58d]">Join</button></form></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex-row"><span>© 2026 LumaYard. Made for long nights outside.</span><span><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span></div></div></footer>
    </main>
  );
}
