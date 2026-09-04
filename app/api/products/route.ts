import { NextResponse } from "next/server";
import { readDatabase } from "@/lib/database";

// GET /api/products - 公开接口，只返回已发布的产品
export async function GET() {
  const database = readDatabase();
  const publishedProducts = database.products.filter(
    (product) => product.status === "published"
  );

  return NextResponse.json({
    products: publishedProducts,
    categories: database.categories,
  });
}
