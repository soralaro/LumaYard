"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SocialLinks } from "@/components/social-links";

type Product = {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  descriptionEn?: string;
  features?: string[];
  specs?: Record<string, string>;
  pdfUrl?: string;
  status: string;
};

const categoryNames: Record<string, { name: string; nameEn: string }> = {
  fences: { name: "Fences & Privacy", nameEn: "Fences & Privacy" },
  lighting: { name: "Garden Lighting", nameEn: "Garden Lighting" },
  robotics: { name: "Garden Robotics & Tools", nameEn: "Garden Robotics & Tools" },
  energy: { name: "Home & Garden Energy", nameEn: "Home & Garden Energy" },
};

export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${handle}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product.status === "published") {
            setProduct(data.product);
          } else {
            notFound();
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const categoryInfo = categoryNames[product.category] || { name: product.category, nameEn: product.category };

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
          <Link href="/shop" className="text-base font-bold uppercase tracking-[0.08em] text-[#19382f] hover:opacity-65">
            Back to shop
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 lg:px-14">
        <div className="mb-6">
          <Link href="/shop" className="text-sm text-gray-600 hover:text-[#19382f]">
            ← Back to all products
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* 图片画廊 */}
          <div>
            <div className="mb-4 overflow-hidden rounded-lg bg-white">
              <Image
                src={product.images[selectedImage] || "/placeholder.jpg"}
                alt={product.titleEn}
                width={800}
                height={800}
                className="aspect-square w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`overflow-hidden rounded-lg ${
                      selectedImage === idx ? "ring-2 ring-[#927141]" : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.titleEn} - ${idx + 1}`}
                      width={200}
                      height={200}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div>
            <div className="mb-3">
              <Link
                href={`/shop?category=${product.category}`}
                className="text-xs uppercase tracking-wider text-[#927141] hover:underline"
              >
                {categoryInfo.name}
              </Link>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em] text-[#19382f] md:text-5xl">
              {product.titleEn}
            </h1>
            <p className="mt-2 text-xl text-[#536058]">{product.title}</p>

            <div className="mt-6 border-t border-[#19382f]/15 pt-6">
              <div className="text-4xl font-bold text-[#927141]">
                ${product.price.toLocaleString()}
              </div>
            </div>

            {product.descriptionEn && (
              <div className="mt-6 border-t border-[#19382f]/15 pt-6">
                <p className="text-base leading-7 text-[#19382f]">{product.descriptionEn}</p>
                {product.description && (
                  <p className="mt-3 text-sm leading-6 text-[#536058]">{product.description}</p>
                )}
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mt-6 border-t border-[#19382f]/15 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#19382f]">
                  Key features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#536058]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#927141]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-6 border-t border-[#19382f]/15 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#19382f]">
                  Technical specifications
                </h3>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-[#19382f]/10 pb-2">
                      <dt className="text-sm font-medium text-[#536058]">{key}</dt>
                      <dd className="text-sm font-semibold text-[#19382f]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.pdfUrl && (
              <div className="mt-6 border-t border-[#19382f]/15 pt-6">
                <a
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#927141] hover:underline"
                >
                  Download PDF specification →
                </a>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center justify-center bg-[#19382f] px-8 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#102c25]"
              >
                Contact us
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-13 items-center justify-center border-2 border-[#19382f] px-8 text-xs font-bold uppercase tracking-[0.16em] text-[#19382f] transition hover:bg-[#19382f] hover:text-white"
              >
                View more products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#102c25] px-5 pb-7 pt-16 text-[#f5f2eb] sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-col gap-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c89957]">Stay connected</p><SocialLinks compact colored /></div>
          <div className="flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex-row">
            <span>© 2026 LumaYard. Professional outdoor products.</span>
            <Link href="/" className="hover:text-white/70">Back to home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
