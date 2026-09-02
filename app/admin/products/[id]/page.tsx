"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { id: "fences", name: "栅栏与围栏", nameEn: "Fences & Privacy" },
  { id: "lighting", name: "庭院灯具", nameEn: "Garden Lighting" },
  { id: "robotics", name: "庭院剪草工具", nameEn: "Garden Robotics & Tools" },
  { id: "energy", name: "户储能源", nameEn: "Home & Garden Energy" },
];

export default function EditProduct({ params }: { params: { id: string } }) {
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

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.product;
        setFormData({
          title: p.title || "",
          titleEn: p.titleEn || "",
          price: p.price?.toString() || "",
          category: p.category || "fences",
          status: p.status || "draft",
          description: p.description || "",
          descriptionEn: p.descriptionEn || "",
          features: (p.features || []).join("\n"),
          images: (p.images || []).join("\n"),
          specs: p.specs ? JSON.stringify(p.specs, null, 2) : "",
          pdfUrl: p.pdfUrl || "",
        });
      }
    } catch (error) {
      alert("加载失败");
    } finally {
      setLoading(false);
    }
  };

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

      const res = await fetch(`/api/admin/products/${params.id}`, {
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
