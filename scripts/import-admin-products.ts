import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

type LegacyProduct = {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  category: string;
  status: "draft" | "published" | "archived";
  description: string;
  descriptionEn: string;
  features: string[];
  images: string[];
  specs: Record<string, unknown>;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type LegacyDatabase = { products: LegacyProduct[] };

async function main() {
  const source = JSON.parse(
    await readFile(path.join(process.cwd(), "data", "database.json"), "utf8")
  ) as LegacyDatabase;

  for (const item of source.products) {
    const status = item.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    await prisma.product.upsert({
    where: { legacyId: item.id },
    update: {
      title: item.titleEn || item.title,
      summary: item.title,
      description: item.descriptionEn || item.description || "",
      legacyCategory: item.category,
      legacyImages: item.images,
      legacyFeatures: item.features,
      legacySpecs: item.specs as Prisma.InputJsonValue,
      legacyPdfUrl: item.pdfUrl,
      price: item.price,
      status,
      publishedAt: status === "PUBLISHED" ? new Date(item.updatedAt) : null,
    },
    create: {
      legacyId: item.id,
      handle: item.id,
      title: item.titleEn || item.title,
      summary: item.title,
      description: item.descriptionEn || item.description || "",
      legacyCategory: item.category,
      legacyImages: item.images,
      legacyFeatures: item.features,
      legacySpecs: item.specs as Prisma.InputJsonValue,
      legacyPdfUrl: item.pdfUrl,
      price: item.price,
      status,
      publishedAt: status === "PUBLISHED" ? new Date(item.updatedAt) : null,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    },
    });
  }

  console.log(`Imported ${source.products.length} storefront products.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
