import fs from "fs";
import path from "path";

const databasePath = path.join(process.cwd(), "data", "database.json");

export type ProductStatus = "draft" | "published" | "archived";

export type ProductRecord = {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  category: string;
  status: ProductStatus;
  sortOrder?: number;
  description: string;
  descriptionEn: string;
  features: string[];
  images: string[];
  specs: Record<string, unknown>;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryRecord = {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  coverImage?: string;
};

export type Database = {
  products: ProductRecord[];
  categories: CategoryRecord[];
};

const emptyDatabase = (): Database => ({ products: [], categories: [] });

export function readDatabase(): Database {
  try {
    return JSON.parse(fs.readFileSync(databasePath, "utf-8")) as Database;
  } catch {
    return emptyDatabase();
  }
}

export function writeDatabase(database: Database) {
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), "utf-8");
}
