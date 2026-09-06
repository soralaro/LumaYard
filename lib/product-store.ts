import type { Prisma, Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductRecord } from "@/lib/database";

type ProductInput = Omit<ProductRecord, "id" | "createdAt" | "updatedAt">;

function stringArray(value: Prisma.JsonValue | null) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function objectValue(value: Prisma.JsonValue | null): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function toStoreProduct(product: Product): ProductRecord {
  return {
    id: product.legacyId || product.id,
    title: product.summary || product.title,
    titleEn: product.title,
    price: product.price.toNumber(),
    category: product.legacyCategory || "other",
    status: product.status.toLowerCase() as ProductRecord["status"],
    description: product.summary ? "" : product.description,
    descriptionEn: product.description,
    features: stringArray(product.legacyFeatures),
    images: stringArray(product.legacyImages),
    specs: objectValue(product.legacySpecs),
    pdfUrl: product.legacyPdfUrl,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function toProductData(input: ProductInput, legacyId: string): Prisma.ProductUncheckedCreateInput {
  return {
    handle: legacyId,
    legacyId,
    title: input.titleEn || input.title,
    summary: input.title,
    description: input.descriptionEn || input.description || "",
    legacyCategory: input.category,
    legacyImages: input.images,
    legacyFeatures: input.features,
    legacySpecs: input.specs as Prisma.InputJsonValue,
    legacyPdfUrl: input.pdfUrl,
    price: input.price,
    status: input.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    publishedAt: input.status === "published" ? new Date() : null,
  };
}

function toProductUpdate(input: ProductInput): Prisma.ProductUncheckedUpdateInput {
  return {
    title: input.titleEn || input.title,
    summary: input.title,
    description: input.descriptionEn || input.description || "",
    legacyCategory: input.category,
    legacyImages: input.images,
    legacyFeatures: input.features,
    legacySpecs: input.specs as Prisma.InputJsonValue,
    legacyPdfUrl: input.pdfUrl,
    price: input.price,
    status: input.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    publishedAt: input.status === "published" ? new Date() : null,
  };
}

export async function listAdminProducts() {
  return (await prisma.product.findMany({ orderBy: { updatedAt: "desc" } })).map(toStoreProduct);
}

export async function listPublishedProducts() {
  return (await prisma.product.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } })).map(toStoreProduct);
}

export async function findProduct(identifier: string, publishedOnly = false) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: identifier }, { legacyId: identifier }, { handle: identifier }],
      ...(publishedOnly ? { status: "PUBLISHED" } : {}),
    },
  });
  return product ? toStoreProduct(product) : null;
}

export async function createProduct(input: ProductInput) {
  const legacyId = `prod_${Date.now()}`;
  const product = await prisma.product.create({ data: toProductData(input, legacyId) });
  return toStoreProduct(product);
}

export async function updateProduct(identifier: string, input: ProductInput) {
  const current = await prisma.product.findFirst({ where: { OR: [{ id: identifier }, { legacyId: identifier }] } });
  if (!current) return null;
  const product = await prisma.product.update({ where: { id: current.id }, data: toProductUpdate(input) });
  return toStoreProduct(product);
}

export async function deleteProduct(identifier: string) {
  const current = await prisma.product.findFirst({ where: { OR: [{ id: identifier }, { legacyId: identifier }] } });
  if (!current) return null;
  const product = await prisma.product.delete({ where: { id: current.id } });
  return toStoreProduct(product);
}
