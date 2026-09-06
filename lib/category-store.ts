import { prisma } from "@/lib/prisma";
import type { CategoryRecord } from "@/lib/database";

export function toStoreCategory(category: {
  handle: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  coverImage: string | null;
}) : CategoryRecord {
  return {
    id: category.handle,
    slug: category.handle,
    name: category.name,
    nameEn: category.nameEn || category.name,
    description: category.description || "",
    coverImage: category.coverImage || undefined,
  };
}

export async function listCategories() {
  return (await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } })).map(toStoreCategory);
}

export async function updateCategory(input: CategoryRecord) {
  const category = await prisma.collection.update({
    where: { handle: input.id },
    data: {
      name: input.name,
      nameEn: input.nameEn,
      description: input.description,
      coverImage: input.coverImage || null,
    },
  });
  return toStoreCategory(category);
}
