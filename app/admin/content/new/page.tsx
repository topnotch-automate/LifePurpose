import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { NewArticleClient } from "./NewArticleClient";

export default async function NewArticlePage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  return <NewArticleClient />;
}
