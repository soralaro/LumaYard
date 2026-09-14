import { prisma } from "@/lib/prisma";

export type PublicContentType = "GUIDE" | "INSPIRATION" | "JOURNAL" | "CASE_STUDY" | "LOOKBOOK" | "DOWNLOAD";

export async function listPublishedContent(options: { type?: PublicContentType; featured?: boolean } = {}) {
  return prisma.contentItem.findMany({
    where: { status: "PUBLISHED", ...(options.type ? { type: options.type } : {}), ...(options.featured === undefined ? {} : { featured: options.featured }) },
    include: { assets: { orderBy: [{ pageNumber: "asc" }, { createdAt: "asc" }] }, products: { include: { product: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export async function findPublishedContent(slug: string) {
  return prisma.contentItem.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { assets: { orderBy: [{ pageNumber: "asc" }, { createdAt: "asc" }] }, products: { include: { product: true }, orderBy: { sortOrder: "asc" } } },
  });
}

export function contentTypeLabel(type: string) {
  return type.toLowerCase().replace("_", " ");
}
