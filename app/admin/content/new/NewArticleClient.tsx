"use client";

import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  ArticleEditor,
  getEmptyArticleValues,
  submitNewArticle,
} from "@/components/admin/ArticleEditor";

export function NewArticleClient() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">New article</h1>
              <p className="text-sm text-gray-600 mt-1">
                Saved as MDX in your content folder (local dev) or GitHub (production).
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
            <ArticleEditor
              mode="create"
              initialValues={getEmptyArticleValues()}
              onSubmit={submitNewArticle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
