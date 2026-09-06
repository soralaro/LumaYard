import { NextResponse } from "next/server";
import { listPublishedProducts } from "@/lib/product-store";
import { listCategories } from "@/lib/category-store";

// GET /api/products - 公开接口，只返回已发布的产品
export async function GET() {
  const [publishedProducts, categories] = await Promise.all([listPublishedProducts(), listCategories()]);

  return NextResponse.json({
    products: publishedProducts,
    categories,
  });
}
