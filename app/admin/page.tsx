import { isAdmin } from "@/lib/admin-auth";
import AdminPanel from "./panel";
export const dynamic = "force-dynamic";
export default async function AdminPage() { return <AdminPanel authenticated={await isAdmin()} />; }
