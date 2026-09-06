import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import type { CategoryRecord } from "../lib/database";

async function main() {
  const source = JSON.parse(
    await readFile(path.join(process.cwd(), "data", "database.json"), "utf8")
  ) as { categories: CategoryRecord[] };

  for (const [sortOrder, category] of source.categories.entries()) {
    await prisma.collection.upsert({
      where: { handle: category.id },
      update: {
        name: category.name,
        nameEn: category.nameEn,
        description: category.description,
        coverImage: category.coverImage || null,
        sortOrder,
      },
      create: {
        handle: category.id,
        name: category.name,
        nameEn: category.nameEn,
        description: category.description,
        coverImage: category.coverImage || null,
        sortOrder,
      },
    });
  }
  console.log(`Imported ${source.categories.length} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
