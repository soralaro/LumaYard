"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

type IconName =
  | "arrow"
  | "menu"
  | "close"
  | "sun"
  | "shield"
  | "zap"
  | "leaf";

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
  if (name === "sun") return <svg {...shared}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
  if (name === "shield") return <svg {...shared}><path d="M12 2 3 7v5c0 6 4 10 9 11 5-1 9-5 9-11V7l-9-5Z" /></svg>;
  if (name === "zap") return <svg {...shared}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>;
  if (name === "leaf") return <svg {...shared}><path d="M20.5 3.5C12 3.5 5 7.2 5 14c0 3.7 2.7 6.5 6.2 6.5 6.8 0 9.3-8.7 9.3-17Z" /><path d="M3.5 20.5c3-5 6.5-7.6 11.5-10" /></svg>;
  return <svg {...shared}><path d="M12 5v14M5 12h14" /></svg>;
}

const productCategories = [
  {
    id: "fences",
    title: "Fences & Privacy",
    titleEn: "Fences & Privacy",
    description: "Define boundaries, protect privacy, and enhance your yard's beauty",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    icon: "shield" as IconName,
  },
  {
    id: "lighting",
    title: "Garden Lighting",
    titleEn: "Garden Lighting",
    description: "Solar and rechargeable lights to illuminate your outdoor evenings",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85",
    icon: "sun" as IconName,
  },
  {
    id: "robotics",
    title: "Garden Robotics",
    titleEn: "Garden Robotics",
    description: "Robotic mowers and smart tools for hands-free yard maintenance",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85",
    icon: "leaf" as IconName,
  },
  {
    id: "energy",
    title: "Home Energy",
    titleEn: "Home Energy",
    description: "Solar + storage systems to power your outdoor living",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
    icon: "zap" as IconName,
  },
];

type Product = {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  features?: string[];
  status: string;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        const published = (data.products || []).filter((p: Product) => p.status === "published");
        setProducts(published);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredProducts = products.slice(0, 6);

  return (
    <main className="overflow-hidden">
      <div className="bg-[#1e3b33] px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f8f3e9] sm:text-xs">
        Professional outdoor products <span className="mx-2 text-[#c89957]">·</span> Fences · Lighting · Robotics · Energy
      </div>

      <header className="absolute inset-x-0 top-[39px] z-30 text-white">
        <div className="mx-auto flex h-22 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-14">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] sm:text-3xl">
            Luma<span className="italic">Yard</span>
          </Link>
          <nav className="hidden items-center gap-8 text-base font-bold uppercase tracking-[0.08em] lg:flex">
            <Link href="#categories" className="transition-opacity hover:opacity-65">Categories</Link>
            <Link href="/shop" className="transition-opacity hover:opacity-65">Shop All</Link>
            <Link href="#about" className="transition-opacity hover:opacity-65">About</Link>
            <Link href="/contact" className="transition-opacity hover:opacity-65">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="hidden text-base font-bold uppercase tracking-[0.08em] sm:block">Shop</Link>
            <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white/15 lg:hidden"><Icon name="menu" /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#17362e] px-6 py-6 text-white lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-display)] text-3xl">Luma<span className="italic">Yard</span></span>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/35"><Icon name="close" /></button>
          </div>
          <nav className="mt-18 flex flex-col gap-7 text-3xl font-[family-name:var(--font-display)]">
            <a onClick={() => setMenuOpen(false)} href="#categories">Categories</a>
            <a onClick={() => setMenuOpen(false)} href="/shop">Shop All</a>
            <a onClick={() => setMenuOpen(false)} href="#about">About</a>
            <a onClick={() => setMenuOpen(false)} href="/contact">Contact</a>
          </nav>
        </div>
      )}

      <section className="relative flex min-h-[740px] items-end bg-[#283f32] md:min-h-[820px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=90')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102c25]/88 via-[#102c25]/42 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#102c25]/68 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-18 pt-48 text-white md:px-10 md:pb-24 lg:px-14">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#edce9b]">
            <span className="h-px w-8 bg-[#edce9b]" />Professional outdoor products
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-8xl">
            Transform your<br /><em className="font-normal">outdoor space.</em>
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/80 md:text-lg">
            Fences, lighting, robotics, and energy systems—making your yard more beautiful, secure, and easier to maintain.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="inline-flex min-h-13 items-center justify-center bg-[#e8c58d] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[#18372f] transition-transform hover:-translate-y-0.5">
              Shop all products
            </Link>
            <Link href="#categories" className="inline-flex min-h-13 items-center justify-center border border-white/55 px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#18372f]">
              Browse by category
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="bg-[#f5f2eb] px-5 py-16 sm:px-8 md:py-20 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Product categories</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">
              Professional outdoor solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#536058]">
              From fences to lighting, from automation to energy—complete product lines for your outdoor space
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="group overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.titleEn}
                    width={1200}
                    height={800}
                    className="aspect-[1.5] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8c58d]">
                      <Icon name={category.icon} className="h-5 w-5 text-[#19382f]" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#19382f]">
                        {category.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-[#927141]">
                        {category.titleEn}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#536058]">{category.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#19382f] transition group-hover:gap-3">
                    View products <Icon name="arrow" className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!loading && featuredProducts.length > 0 && (
        <section className="bg-[#eae4d9] px-5 py-22 sm:px-8 md:py-30 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b7e57]">Featured products</p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] text-[#19382f] sm:text-5xl">
                  Best sellers
                </h2>
              </div>
              <Link href="/shop" className="hidden text-sm font-bold uppercase tracking-wider text-[#19382f] hover:text-[#927141] md:block">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.titleEn}
                      width={600}
                      height={600}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-wider text-[#927141]">
                      {product.category}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-[#19382f]">
                      {product.titleEn}
                    </h3>
                    <p className="mt-1 text-sm text-[#536058]">{product.title}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#927141]">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#19382f] group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="about" className="bg-[#2b4739] px-5 py-18 text-[#f5f2eb] sm:px-8 md:py-22 lg:px-14">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-4">
          {[
            { icon: "shield" as IconName, title: "Built to last", text: "Weather-resistant materials with 10-year warranties" },
            { icon: "sun" as IconName, title: "Solar first", text: "Harness the sun for lighting and energy savings" },
            { icon: "zap" as IconName, title: "Smart automation", text: "Robotic mowing and app-controlled convenience" },
            { icon: "leaf" as IconName, title: "Eco-conscious", text: "Less waste, more efficiency, better for the planet" },
          ].map((value) => (
            <div key={value.title} className="border-t border-white/20 pt-5">
              <Icon name={value.icon} className="h-6 w-6 text-[#e8c58d]" />
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#c99759] px-5 py-18 sm:px-8 md:py-22 lg:px-14">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#294238]">Need help?</p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.03] tracking-[-0.035em] text-[#17362e] sm:text-5xl">
              Contact us for expert advice
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#294238]/80">
              Whether you need product guidance or installation advice, we're here to help
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-13 items-center bg-[#19382f] px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#102c25]"
          >
            Get in touch <Icon name="arrow" className="ml-3 h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="bg-[#102c25] px-5 pb-7 pt-16 text-[#f5f2eb] sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.3fr_1fr_1fr_1.15fr]">
            <div>
              <Link href="/" className="font-[family-name:var(--font-display)] text-4xl">
                Luma<span className="italic">Yard</span>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
                Professional outdoor products: fences, lighting, robotics, and energy systems
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Categories</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
                <Link href="/shop?category=fences">Fences & Privacy</Link>
                <Link href="/shop?category=lighting">Garden Lighting</Link>
                <Link href="/shop?category=robotics">Robotics & Tools</Link>
                <Link href="/shop?category=energy">Home Energy</Link>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Support</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
                <Link href="/contact">Contact us</Link>
                <Link href="/shop">All products</Link>
                <Link href="/admin">Admin</Link>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c58d]">Stay updated</h3>
              <p className="mt-5 text-sm leading-6 text-white/65">
                Get the latest products and offers
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex-row">
            <span>© 2026 LumaYard. Professional outdoor products.</span>
            <span>Privacy · Terms</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
