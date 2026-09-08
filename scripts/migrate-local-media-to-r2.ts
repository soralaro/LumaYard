import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { mediaUrl, storageConfigured, uploadObject } from "../lib/storage";

const localPrefixes = ["/uploads/", "/products/", "/categories/", "/category-cover/"];
const mimeTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
};

function localPath(url: string) {
  if (!localPrefixes.some((prefix) => url.startsWith(prefix))) return null;
  const relative = url.slice(1);
  const filename = path.resolve(process.cwd(), "public", relative);
  const publicRoot = `${path.resolve(process.cwd(), "public")}${path.sep}`;
  return filename.startsWith(publicRoot) ? filename : null;
}

async function migrateUrl(url: string) {
  const filename = localPath(url);
  if (!filename) return url;
  const body = await readFile(filename);
  const extension = path.extname(filename).toLowerCase();
  const mimeType = mimeTypes[extension];
  if (!mimeType) throw new Error(`Unsupported media type: ${filename}`);
  const digest = createHash("sha256").update(body).digest("hex");
  const key = `legacy/${digest.slice(0, 2)}/${digest}${extension}`;
  await uploadObject({ body, key, originalName: path.basename(filename), mimeType });
  return mediaUrl(key);
}

async function main() {
  if (!storageConfigured()) throw new Error("Set S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY before migrating media.");
  let changedProducts = 0;
  let changedCollections = 0;
  const products = await prisma.product.findMany({ select: { id: true, legacyImages: true } });
  for (const product of products) {
    const images = Array.isArray(product.legacyImages) ? product.legacyImages.filter((item): item is string => typeof item === "string") : [];
    const migrated = await Promise.all(images.map(migrateUrl));
    if (JSON.stringify(images) !== JSON.stringify(migrated)) {
      await prisma.product.update({ where: { id: product.id }, data: { legacyImages: migrated } });
      changedProducts += 1;
    }
  }

  const collections = await prisma.collection.findMany({ select: { id: true, coverImage: true } });
  for (const collection of collections) {
    if (!collection.coverImage) continue;
    const migrated = await migrateUrl(collection.coverImage);
    if (migrated !== collection.coverImage) {
      await prisma.collection.update({ where: { id: collection.id }, data: { coverImage: migrated } });
      changedCollections += 1;
    }
  }
  console.log(`Migrated local media references for ${changedProducts} products and ${changedCollections} collections.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
