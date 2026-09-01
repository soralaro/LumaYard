import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";

type LegacyProduct = { handle: string; title: string; price: number; image: string; collection: string; spaces: string[]; description: string; features: string[]; stripePaymentLink?: string; whatsappInquiry?: boolean };
const source = JSON.parse(await readFile(path.join(process.cwd(), "data/products.json"), "utf8")) as LegacyProduct[];
for (const item of source) {
  const collection = await prisma.collection.upsert({ where: { handle: item.collection }, update: { name: item.collection }, create: { handle: item.collection, name: item.collection } });
  const spaces = await Promise.all(item.spaces.map((handle) => prisma.space.upsert({ where: { handle }, update: { name: handle }, create: { handle, name: handle } })));
  const product = await prisma.product.upsert({ where: { handle: item.handle }, update: { title: item.title, description: item.description, price: item.price, stripePaymentLink: item.stripePaymentLink, whatsappInquiry: item.whatsappInquiry ?? false }, create: { handle: item.handle, title: item.title, description: item.description, price: item.price, stripePaymentLink: item.stripePaymentLink, whatsappInquiry: item.whatsappInquiry ?? false, status: "PUBLISHED", publishedAt: new Date() } });
  await prisma.productCollection.upsert({ where: { productId_collectionId: { productId: product.id, collectionId: collection.id } }, update: {}, create: { productId: product.id, collectionId: collection.id } });
  for (const space of spaces) await prisma.productSpace.upsert({ where: { productId_spaceId: { productId: product.id, spaceId: space.id } }, update: {}, create: { productId: product.id, spaceId: space.id } });
  await prisma.productSpecification.deleteMany({ where: { productId: product.id } });
  await prisma.productSpecification.createMany({ data: item.features.map((value, sortOrder) => ({ productId: product.id, label: "Feature", value, sortOrder })) });
}
console.log(`Imported ${source.length} products.`);
await prisma.$disconnect();
