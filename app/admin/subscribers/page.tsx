import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminSubscribersClient } from "./AdminSubscribersClient";

export default async function AdminSubscribersPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  return <AdminSubscribersClient />;
}
