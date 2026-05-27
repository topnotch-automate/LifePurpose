import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { EditArticleClient } from "./EditArticleClient";

export default async function EditArticlePage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  return <EditArticleClient />;
}
