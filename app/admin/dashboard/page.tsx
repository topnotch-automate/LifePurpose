import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  
  if (!authenticated) {
    redirect("/admin");
  }

  return <AdminDashboardClient />;
}

