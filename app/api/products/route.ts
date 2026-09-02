import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "database.json");

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { products: [], categories: [] };
  }
}

// GET /api/products - 公开接口，只返回已发布的产品
export async function GET() {
  const db = readDB();
  const publishedProducts = (db.products || []).filter(
    (p: any) => p.status === "published"
  );

  return NextResponse.json({
    products: publishedProducts,
    categories: db.categories || []
  });
}
