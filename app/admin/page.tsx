"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  status: "draft" | "published" | "archived";
  images: string[];
  createdAt: string;
};

type AdminUser = { id: string; email: string; name: string | null; role: "OWNER" | "EDITOR" };

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }, []);

  useEffect(() => {
    void fetch("/api/admin/auth/me")
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as { user: AdminUser };
          setAdmin(data.user);
        }
      })
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!admin) return;

    const timer = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [admin, loadProducts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setLoginError("邮箱或密码不正确");
      return;
    }
    const data = (await response.json()) as { user: AdminUser };
    setPassword("");
    setAdmin(data.user);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setProducts([]);
    setAdmin(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个产品吗？")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch {
      alert("删除失败");
    }
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">LumaYard 管理后台</h1>
          <form onSubmit={handleLogin}>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              管理邮箱
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="admin@example.com"
              required
            />
            <label className="mb-2 block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="输入管理密码"
              required
            />
            {loginError && <p className="mb-4 text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">LumaYard 管理后台</h1>
          <div className="flex gap-4">
            {admin.role === "OWNER" && <Link href="/admin/users" className="text-sm text-gray-600 hover:text-gray-900">管理员</Link>}
            {admin.role === "OWNER" && <Link href="/admin/audit-log" className="text-sm text-gray-600 hover:text-gray-900">访客动态</Link>}
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              查看网站
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-blue-50 p-6 text-center hover:bg-blue-100"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">+</div>
            <h3 className="font-semibold text-gray-900">新增产品</h3>
            <p className="text-sm text-gray-600">添加新产品到系统</p>
          </Link>

          <Link
            href="/admin/categories"
            className="rounded-lg bg-green-50 p-6 text-center hover:bg-green-100"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">⚙️</div>
            <h3 className="font-semibold text-gray-900">分类管理</h3>
            <p className="text-sm text-gray-600">编辑分类封面和信息</p>
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-purple-50 p-6 text-center hover:bg-purple-100"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">👁️</div>
            <h3 className="font-semibold text-gray-900">查看网站</h3>
            <p className="text-sm text-gray-600">预览前台展示</p>
          </Link>

          <Link
            href="/admin/inquiries"
            className="rounded-lg bg-amber-50 p-6 text-center hover:bg-amber-100"
          >
            <div className="mb-2 text-3xl font-bold text-amber-700">@</div>
            <h3 className="font-semibold text-gray-900">客户询盘</h3>
            <p className="text-sm text-gray-600">查看和处理客户留言</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="rounded-lg bg-cyan-50 p-6 text-center hover:bg-cyan-100"
          >
            <div className="mb-2 text-3xl font-bold text-cyan-800">#</div>
            <h3 className="font-semibold text-gray-900">访问分析</h3>
            <p className="text-sm text-gray-600">页面、商品、来源和地区</p>
          </Link>

          {admin.role === "OWNER" && <Link href="/admin/settings" className="rounded-lg bg-rose-50 p-6 text-center hover:bg-rose-100"><div className="mb-2 text-3xl font-bold text-rose-700">@</div><h3 className="font-semibold text-gray-900">联系信息</h3><p className="text-sm text-gray-600">编辑邮箱、WhatsApp 和社交链接</p></Link>}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            产品列表 ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">还没有产品，点击上方按钮开始添加</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    产品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    价格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    状态
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt=""
                            width={40}
                            height={40}
                            className="mr-3 h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          product.status === "published"
                            ? "bg-green-100 text-green-800"
                            : product.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status === "published"
                          ? "已发布"
                          : product.status === "draft"
                          ? "草稿"
                          : "已归档"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="mr-4 text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
