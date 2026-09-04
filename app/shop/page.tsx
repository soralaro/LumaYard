"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  status: string;
};

const categories = [
  { id: "all", name: "All Products", nameEn: "All Products" },
  { id: "fences", name: "Fences & Privacy", nameEn: "Fences & Privacy" },
  { id: "lighting", name: "Garden Lighting", nameEn: "Garden Lighting" },
  { id: "robotics", name: "Garden Robotics & Tools", nameEn: "Garden Robotics & Tools" },
  { id: "energy", name: "Home & Garden Energy", nameEn: "Home & Garden Energy" },
];

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCategory = categories.some(
    (category) => category.id === searchParams.get("category")
  )
    ? searchParams.get("category")!
    : "all";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10 lg:px-14">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] text-[#19382f] sm:text-3xl">
            Luma<span className="italic">Yard</span>
          </Link>
          <nav className="hidden items-center gap-8 text-base font-bold uppercase tracking-[0.08em] text-[#19382f] lg:flex">
            <Link href="/#categories" className="transition-opacity hover:opacity-65">Categories</Link>
            <Link href="/shop" className="transition-opacity hover:opacity-65">Shop All</Link>
            <Link href="/contact" className="transition-opacity hover:opacity-65">Contact</Link>
          </nav>
          <Link href="/admin" className="text-base font-bold uppercase tracking-[0.08em] text-gray-500 hover:text-[#19382f]">
            Admin
          </Link>
        </div>
      </header>

      <section className="bg-[#19382f] px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.035em] sm:text-5xl md:text-6xl">
            All Products
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75">
            Browse our complete catalog of outdoor products
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 lg:px-14">
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.replace(cat.id === "all" ? "/shop" : `/shop?category=${cat.id}`)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition ${
                selectedCategory === cat.id
                  ? "bg-[#19382f] text-white"
                  : "bg-white text-[#19382f] hover:bg-[#e8c58d]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-600">No products in this category yet</p>
            <Link href="/admin/products/new" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              Add products in admin panel →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white shadow-sm transition-shadow hover:shadow-lg"
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
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-[#927141]">
                    {categories.find(c => c.id === product.category)?.name || product.category}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg text-[#19382f] line-clamp-2">
                    {product.titleEn}
                  </h3>
                  <p className="mt-1 text-sm text-[#536058] line-clamp-1">{product.title}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-[#927141]">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#19382f] group-hover:underline">
                      Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#102c25] px-5 pb-7 pt-16 text-[#f5f2eb] sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex-row">
            <span>© 2026 LumaYard. Professional outdoor products.</span>
            <Link href="/" className="hover:text-white/70">Back to home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
