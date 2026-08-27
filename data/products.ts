import { readFileSync } from "node:fs";
import path from "node:path";

export type Product = { handle: string; title: string; price: number; image: string; collection: "solar" | "portable" | "privacy"; spaces: string[]; description: string; features: string[]; stripePaymentLink?: string; whatsappInquiry?: boolean };
export function getProducts(): Product[] { try { return JSON.parse(readFileSync(path.join(process.cwd(), "data/products.json"), "utf8")) as Product[]; } catch { return []; } }
export const products = getProducts();
export function getProduct(handle: string) { return getProducts().find((product) => product.handle === handle); }
