"use client";

import { useCallback, useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { id: "fences", name: "栅栏与围栏", nameEn: "Fences & Privacy" },
  { id: "lighting", name: "庭院灯具", nameEn: "Garden Lighting" },
  { id: "robotics", name: "庭院剪草工具", nameEn: "Garden Robotics & Tools" },
  { id: "energy", name: "户储能源", nameEn: "Home & Garden Energy" },
];

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    price: "",
    category: "fences",
    status: "draft" as "draft" | "published" | "archived",
    description: "",
    descriptionEn: "",
    features: "",
    images: "",
    specs: "",
    pdfUrl: "",
  });

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    kind: "image" | "document"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const upload = new FormData();
    upload.append("file", file);
    upload.append("type", "products");
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: upload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setFormData((current) => kind === "image"
        ? { ...current, images: [current.images, data.url].filter(Boolean).join("\n") }
        : { ...current, pdfUrl: data.url });
      event.target.value = "";
    } catch (error) {
      alert(`上传失败：${error instanceof Error ? error.message : "请重试"}`);
    }
  };

  const loadProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        const product = data.product;
        setFormData({
          title: product.title || "",
          titleEn: product.titleEn || "",
          price: product.price?.toString() || "",
          category: product.category || "fences",
          status: product.status || "draft",
          description: product.description || "",
          descriptionEn: product.descriptionEn || "",
          features: (product.features || []).join("\n"),
          images: (product.images || []).join("\n"),
          specs: product.specs ? JSON.stringify(product.specs, null, 2) : "",
          pdfUrl: product.pdfUrl || "",
        });
      } else {
        alert("加载产品失败");
      }
    } catch (error) {
      console.error("Load error:", error);
      alert("加载失败");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProduct();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        titleEn: formData.titleEn,
        price: parseFloat(formData.price),
        category: formData.category,
        status: formData.status,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        features: formData.features.split("\n").filter(f => f.trim()),
        images: formData.images.split("\n").filter(i => i.trim()),
        specs: formData.specs ? JSON.parse(formData.specs) : {},
        pdfUrl: formData.pdfUrl || null,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("保存失败");
      }
    } catch (error) {
      alert("保存失败：" + error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">编辑产品</h1>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回列表
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品名称（中文）*
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品名称（英文）*
            </label>
            <input
              type="text"
              required
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                价格（美元）*
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                产品分类*
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} - {cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              发布状态
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品描述（中文）
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品描述（英文）
            </label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品特点（每行一个）
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => void handleMediaUpload(event, "image")} className="mt-3 block w-full text-sm" />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              产品图片 URL（每行一个）*
            </label>
            <textarea
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              技术规格（JSON 格式）
            </label>
            <textarea
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              rows={8}
              className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              PDF 规格书 URL（可选）
            </label>
            <input
              type="text"
              value={formData.pdfUrl}
              onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <input type="file" accept="application/pdf" onChange={(event) => void handleMediaUpload(event, "document")} className="mt-3 block w-full text-sm" />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存更改"}
            </button>
            <Link
              href="/admin"
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
