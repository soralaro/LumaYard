import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumayard.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/contact", "/about", "/shipping", "/returns", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.handle}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
