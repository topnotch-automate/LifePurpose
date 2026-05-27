"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  ArticleEditor,
  ArticleFormValues,
  submitArticleUpdate,
} from "@/components/admin/ArticleEditor";
import { isValidSection, isValidSlug, type ArticleSection } from "@/lib/content-files";

export function EditArticleClient() {
  const params = useParams<{ section: string; slug: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ArticleFormValues | null>(null);
  const [error, setError] = useState("");

  const section = params.section;
  const slug = params.slug;

  useEffect(() => {
    if (!isValidSection(section) || !isValidSlug(slug)) {
      setError("Invalid article URL");
      return;
    }

    fetch(`/api/admin/content/${section}/${slug}`)
      .then(async (response) => {
        if (response.status === 401) {
          router.push("/admin");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!data?.article) {
          setError("Article not found");
          return;
        }

        const article = data.article;
        setInitialValues({
          title: article.title,
          slug,
          description: article.description || "",
          date: article.date?.split("T")[0] || "",
          section: article.section as ArticleSection,
          category: article.category || "",
          tags: (article.tags || []).join(", "),
          image: article.image || "",
          foundational: Boolean(article.foundational),
          funnelBook: article.funnel?.book || "",
          funnelCtaType: article.funnel?.ctaType || "soft",
          body: article.body || "",
        });
      })
      .catch(() => setError("Failed to load article"));
  }, [section, slug, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Edit article</h1>
              <p className="text-sm text-gray-500 font-mono mt-1">
                {section}/{slug}
              </p>
            </div>
            <Link
              href="/admin/content"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to list
            </Link>
          </div>

          <div className="p-6">
            {error && (
              <div className="rounded-lg px-4 py-3 text-sm bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}
            {!error && !initialValues && (
              <div className="text-center py-12 text-gray-500">Loading article...</div>
            )}
            {initialValues && isValidSection(section) && (
              <ArticleEditor
                mode="edit"
                initialValues={initialValues}
                onSubmit={(values) => submitArticleUpdate(section, slug, values)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
