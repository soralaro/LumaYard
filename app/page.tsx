"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type IconName = "arrow" | "menu" | "close";
type Product = { id: string; title: string; titleEn: string; price: number; category: string; images: string[]; status: string };
type CategoryData = { id: string; name: string; nameEn: string; description: string; slug: string; coverImage?: string };
type ProductCategory = { id: string; title: string; description: string };

const productCategories: ProductCategory[] = [
  { id: "fences", title: "Fences & Privacy", description: "Define your boundary beautifully." },
  { id: "lighting", title: "Garden Lighting", description: "Extend every evening outdoors." },
  { id: "robotics", title: "Garden Robotics", description: "More time in your garden, less upkeep." },
  { id: "energy", title: "Home Energy", description: "Thoughtful power for outdoor living." },
];

const heroImage = "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2400&q=90";
const storyImage = "https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1800&q=85";
const categorySceneImages: Record<string, string> = {
  robotics: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=85",
  energy: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
};

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const shared = { className: `h-5 w-5 ${className}`, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };
  if (name === "arrow") return <svg {...shared}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
  if (name === "menu") return <svg {...shared}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
  return <svg {...shared}><path d="M6 6l12 12M18 6 6 18" /></svg>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const loadStorefront = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) return;
        const data = await response.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load storefront data:", error);
      }
    };
    void loadStorefront();
  }, []);

  const featuredProducts = products.slice(0, 4);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="overflow-x-clip bg-[var(--paper)] text-[var(--forest)]">
      <section className="relative isolate overflow-hidden bg-[var(--paper)] md:min-h-[68svh]">
        <div className="relative h-[43svh] min-h-76 md:absolute md:inset-0 md:h-auto md:min-h-0">
          <Image src={heroImage} alt="A sunlit outdoor living space" fill priority sizes="100vw" className="object-cover object-[64%_center]" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,38,31,.9)_0%,rgba(10,38,31,.72)_35%,rgba(10,38,31,.2)_62%,transparent_82%)] md:block" />
        </div>
        <div className="relative z-20 bg-[var(--forest-deep)] px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--cream)] md:bg-transparent md:text-white">
          Outdoor living, beautifully considered <span className="mx-2 text-[var(--gold)]">·</span> Built for every season
        </div>
        <header className="relative z-20 bg-[var(--paper)]/95 text-[var(--forest)] backdrop-blur-sm md:border-b md:border-white/20 md:bg-transparent md:text-[var(--cream)] md:backdrop-blur-none">
          <div className="mx-auto flex h-18 max-w-[1800px] items-center justify-between px-5 sm:px-8 lg:h-21 lg:px-12 xl:px-16">
            <Link href="/" className="font-[family-name:var(--font-display)] text-3xl tracking-[0.02em]" aria-label="LumaYard home">Luma<span className="italic">Yard</span></Link>
            <nav aria-label="Primary navigation" className="hidden items-center gap-7 font-[family-name:var(--font-display)] text-3xl leading-none xl:flex">
              <Link href="#categories" className="homepage-link">Collections</Link><Link href="/shop" className="homepage-link">Shop</Link><Link href="#about" className="homepage-link">Our approach</Link><Link href="/contact" className="homepage-link">Contact</Link>
            </nav>
            <button type="button" aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((isOpen) => !isOpen)} className="grid h-10 w-10 place-items-center border border-[var(--forest)]/25 md:border-white/40 xl:hidden"><Icon name={menuOpen ? "close" : "menu"} /></button>
            <Link href="/contact" className="hidden border-b border-current pb-1 font-[family-name:var(--font-display)] text-3xl leading-none xl:block">Plan your space</Link>
          </div>
        </header>
        <div className="relative z-10 flex md:min-h-[calc(68svh-6.75rem)] md:items-end">
          <div className="w-full bg-[var(--paper)] px-6 py-12 sm:px-10 md:mb-10 md:ml-[max(2.5rem,calc((100vw-1700px)/2))] md:max-w-[680px] md:bg-transparent md:px-12 md:py-10 md:text-[var(--cream)] lg:mb-14 lg:px-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--moss)] md:text-[var(--gold)]">Outdoor essentials, reimagined</p>
            <h1 className="mt-5 max-w-[16ch] font-[family-name:var(--font-display)] text-5xl leading-[.9] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-8xl">Make room for life outside.</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[var(--ink)]/75 sm:text-lg md:text-white/85">Thoughtful fencing, lighting, automation, and energy solutions for outdoor spaces that feel entirely your own.</p>
            <Link href="/shop" className="homepage-button mt-9 bg-[var(--cream)] text-[var(--forest)] hover:bg-[var(--gold)]">Shop all products <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="absolute bottom-7 right-10 z-10 hidden items-center gap-3 text-[9px] font-bold uppercase tracking-[0.17em] text-white lg:flex"><span className="h-px w-12 bg-white/75" /> Scroll to explore</div>
      </section>

      {menuOpen && <div id="mobile-navigation" className="fixed inset-0 z-50 bg-[var(--forest-deep)] px-6 py-6 text-[var(--cream)] xl:hidden">
        <div className="flex items-center justify-between"><Link href="/" onClick={closeMenu} className="font-[family-name:var(--font-display)] text-3xl" aria-label="LumaYard home">Luma<span className="italic">Yard</span></Link><button type="button" aria-label="Close menu" onClick={closeMenu} className="grid h-11 w-11 place-items-center border border-white/35"><Icon name="close" /></button></div>
        <nav aria-label="Mobile navigation" className="mt-20 flex flex-col gap-7 font-[family-name:var(--font-display)] text-4xl"><Link href="#categories" onClick={closeMenu}>Collections</Link><Link href="/shop" onClick={closeMenu}>Shop</Link><Link href="#about" onClick={closeMenu}>Our approach</Link><Link href="/contact" onClick={closeMenu}>Contact</Link></nav>
      </div>}

      <section id="categories" className="bg-[var(--collection)] text-[var(--forest)]">
        <div className="flex flex-col items-center gap-4 px-6 pb-8 pt-16 text-center sm:pt-20 lg:pb-10"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--moss)]">Explore by need</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] sm:text-5xl">Shape your outdoors.</h2></div><Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--forest)]/70 hover:text-[var(--forest)] sm:inline-flex">View all products <Icon name="arrow" className="ml-2 h-4 w-4" /></Link></div>
        <div className="px-6 pb-12 sm:px-10 lg:px-14 lg:pb-14 xl:px-16"><div className="mx-auto flex max-w-[2100px] snap-x snap-mandatory gap-4 overflow-x-auto bg-[var(--collection)] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-7 lg:overflow-visible">
          {productCategories.map((category, index) => {
            const categoryData = categories.find((item) => item.id === category.id);
            const fallbackProduct = products.find((product) => product.category === category.id);
            const savedCover = categoryData?.coverImage;
            const image = savedCover && !savedCover.startsWith("data:image/svg+xml") ? savedCover : categorySceneImages[category.id] || fallbackProduct?.images?.[0] || heroImage;
            return <Link key={category.id} href={`/shop?category=${category.id}`} className="group relative block aspect-[.78] w-[78vw] shrink-0 snap-start overflow-hidden rounded-t-md bg-[var(--forest-deep)] lg:w-auto">
              <Image src={image} alt={category.title} fill sizes="(min-width: 1024px) 25vw, 78vw" className={`homepage-image object-cover ${index === 1 ? "object-[60%_center]" : "object-center"}`} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,29,23,.05)_26%,rgba(8,29,23,.84)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-[var(--cream)] sm:p-6"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/70">0{index + 1}</p><div className="mt-2 flex items-end justify-between gap-3"><div><h3 className="font-[family-name:var(--font-display)] text-3xl leading-none sm:text-4xl">{category.title}</h3><p className="mt-2 max-w-xs text-sm leading-5 text-white/78">{category.description}</p></div><Icon name="arrow" className="mb-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" /></div></div>
            </Link>;
          })}
        </div></div>
      </section>

      <section className="homepage-paper px-6 py-14 sm:px-10 sm:py-18 lg:px-14 lg:py-20 xl:px-16"><div className="mx-auto max-w-[2100px]"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--moss)]">Selected for the season</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-none tracking-[-0.045em] sm:text-6xl">The outdoor edit.</h2></div><Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.16em] hover:text-[var(--clay)]">Shop the full collection <Icon name="arrow" className="ml-2 inline h-4 w-4" /></Link></div>
        {featuredProducts.length ? <div className="grid gap-x-5 gap-y-11 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7">{featuredProducts.map((product) => <Link key={product.id} href={`/products/${product.id}`} className="group"><div className="relative aspect-[4/3] overflow-hidden bg-[var(--sand)]"><Image src={product.images[0] || heroImage} alt={product.titleEn} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="homepage-image object-cover" /></div><p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--moss)]">{productCategories.find((category) => category.id === product.category)?.title || product.category}</p><div className="mt-2 flex items-start justify-between gap-3"><h3 className="font-[family-name:var(--font-display)] text-xl leading-tight">{product.titleEn}</h3><span className="shrink-0 text-sm">${product.price.toLocaleString()}</span></div></Link>)}</div> : <p className="border-y border-[var(--forest)]/15 py-12 text-sm text-[var(--ink)]/65">Our product selection is being prepared. Please check back soon.</p>}</div></section>

      <section id="about" className="grid bg-[var(--clay)] md:grid-cols-[1.1fr_.9fr]"><div className="relative min-h-[410px] md:min-h-[660px]"><Image src={storyImage} alt="An inviting garden ready for the evening" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" /></div><div className="flex items-center bg-[var(--clay)] px-6 py-16 text-[var(--paper)] sm:px-10 md:px-14 lg:px-18"><div className="max-w-md"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Practical by nature</p><h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[.92] tracking-[-0.05em] sm:text-6xl">A yard that works as beautifully as it looks.</h2><p className="mt-7 text-base leading-7 text-white/80">Durable materials, approachable technology, and straightforward guidance for outdoor spaces made to be lived in every day.</p><Link href="/contact" className="mt-9 inline-flex items-center gap-3 border border-white/60 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] transition hover:bg-[var(--paper)] hover:text-[var(--clay)]">Talk with our team <Icon name="arrow" className="h-4 w-4" /></Link></div></div></section>

      <section className="bg-[var(--sand)] px-6 py-14 sm:px-10 lg:px-14 xl:px-16"><div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-7 md:flex-row md:items-center"><h2 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] sm:text-5xl">Tell us what your outdoor space needs.</h2><Link href="/contact" className="homepage-button shrink-0">Start a conversation <Icon name="arrow" className="h-4 w-4" /></Link></div></section>

      <footer className="bg-[var(--forest-deep)] px-6 pb-7 pt-14 text-[var(--cream)] sm:px-10 lg:px-14 xl:px-16"><div className="mx-auto max-w-[1800px]"><div className="grid gap-10 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]"><div><Link href="/" className="font-[family-name:var(--font-display)] text-4xl" aria-label="LumaYard home">Luma<span className="italic">Yard</span></Link><p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Professional outdoor products for a more beautiful, useful yard.</p></div><div><h3 className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Shop</h3><div className="mt-4 flex flex-col gap-2.5 text-sm text-white/70">{productCategories.map((category) => <Link key={category.id} href={`/shop?category=${category.id}`} className="hover:text-white">{category.title}</Link>)}</div></div><div><h3 className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Support</h3><div className="mt-4 flex flex-col gap-2.5 text-sm text-white/70"><Link href="/contact" className="hover:text-white">Contact us</Link><Link href="/shop" className="hover:text-white">All products</Link><Link href="/shipping" className="hover:text-white">Shipping</Link><Link href="/returns" className="hover:text-white">Returns</Link></div></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex-row"><span>© 2026 LumaYard. Outdoor living, beautifully considered.</span><span><Link href="/privacy" className="hover:text-white/70">Privacy</Link><span className="mx-2">·</span><Link href="/terms" className="hover:text-white/70">Terms</Link></span></div></div></footer>
    </main>
  );
}
