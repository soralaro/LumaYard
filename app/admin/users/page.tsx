"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "OWNER" | "EDITOR";
  status: "ACTIVE" | "DISABLED";
  lastLoginAt: string | null;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    const response = await fetch("/api/admin/users");
    if (!response.ok) {
      setMessage("Only the account owner can manage administrators.");
      return;
    }
    setUsers((await response.json() as { users: AdminUser[] }).users);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadUsers(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json() as { user?: AdminUser; error?: string };
    if (!response.ok || !data.user) {
      setMessage(data.error || "Unable to add administrator.");
      return;
    }
    event.currentTarget.reset();
    setUsers((current) => [...current, data.user!]);
    setMessage("Administrator added.");
  };

  const updateUser = async (user: AdminUser, action: "disable" | "enable" | "revoke-sessions" | "reset-password") => {
    const password = action === "reset-password" ? window.prompt(`New password for ${user.email} (12+ characters):`) : undefined;
    if (action === "reset-password" && !password) return;
    if (action === "disable" && !window.confirm(`Disable ${user.email}? Their active sessions will be ended.`)) return;
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, password }),
    });
    const data = await response.json() as { error?: string };
    if (!response.ok) { setMessage(data.error || "Unable to update administrator."); return; }
    setMessage(action === "revoke-sessions" ? "All active sessions revoked." : "Administrator updated.");
    await loadUsers();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div><p className="text-sm text-gray-500">LumaYard admin</p><h1 className="text-2xl font-bold">Administrators</h1></div>
          <Link href="/admin" className="text-sm text-blue-700 hover:text-blue-900">Back to dashboard</Link>
        </div>
        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add editor</h2>
          <form onSubmit={createUser} className="grid gap-3 md:grid-cols-3">
            <input name="name" className="rounded border px-3 py-2" placeholder="Name" />
            <input name="email" type="email" required className="rounded border px-3 py-2" placeholder="editor@example.com" />
            <input name="password" type="password" required minLength={12} className="rounded border px-3 py-2" placeholder="Temporary password (12+ characters)" />
            <button className="w-fit rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Add editor</button>
          </form>
          {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
        </section>
        <section className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3">Account</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Last sign-in</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => <tr key={user.id}><td className="px-5 py-4"><p className="font-medium">{user.name || "Unnamed"}</p><p className="text-gray-500">{user.email}</p></td><td className="px-5 py-4">{user.role}<p className="text-xs text-gray-500">{user.status}</p></td><td className="px-5 py-4 text-gray-600">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td><td className="px-5 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-5 py-4"><div className="flex flex-wrap gap-2 text-xs">{user.role === "EDITOR" && <button onClick={() => void updateUser(user, user.status === "ACTIVE" ? "disable" : "enable")} className="text-red-700 hover:text-red-900">{user.status === "ACTIVE" ? "Disable" : "Enable"}</button>}<button onClick={() => void updateUser(user, "reset-password")} className="text-blue-700 hover:text-blue-900">Reset password</button><button onClick={() => void updateUser(user, "revoke-sessions")} className="text-gray-700 hover:text-gray-900">Revoke sessions</button></div></td></tr>)}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
