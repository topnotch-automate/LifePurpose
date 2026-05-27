"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { SECTION_LABELS, type ArticleSection } from "@/lib/content-files";

interface ArticleListItem {
  slug: string;
  title: string;
  section: ArticleSection;
  date: string;
  description: string;
  category?: string;
}

export function AdminContentClient() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [filter, setFilter] = useState<"all" | ArticleSection>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/content", { credentials: "same-origin" })
      .then(async (response) => {
        if (response.status === 401) {
          router.push("/admin");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data?.articles) {
          setArticles(data.articles);
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles
      .filter((article) => filter === "all" || article.section === filter)
      .filter((article) => {
        if (!query) return true;
        return (
          article.title.toLowerCase().includes(query) ||
          article.slug.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, filter, search]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Content</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create and edit Understanding and Practice articles.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/content/new"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                New article
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or slug..."
                className="flex-1 min-w-[220px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | ArticleSection)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All sections</option>
                <option value="esoteriment">{SECTION_LABELS.esoteriment}</option>
                <option value="lifeward">{SECTION_LABELS.lifeward}</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading articles...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <p>No articles found.</p>
                <Link
                  href="/admin/content/new"
                  className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Create your first article →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-600">
                      <th className="py-3 pr-4 font-medium">Title</th>
                      <th className="py-3 pr-4 font-medium">Section</th>
                      <th className="py-3 pr-4 font-medium">Date</th>
                      <th className="py-3 pr-4 font-medium">Category</th>
                      <th className="py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={`${article.section}-${article.slug}`} className="border-b border-gray-100">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{article.title}</div>
                          <div className="text-xs text-gray-500 font-mono">{article.slug}</div>
                        </td>
                        <td className="py-3 pr-4">{SECTION_LABELS[article.section]}</td>
                        <td className="py-3 pr-4 whitespace-nowrap">{article.date.split("T")[0]}</td>
                        <td className="py-3 pr-4">{article.category || "—"}</td>
                        <td className="py-3 whitespace-nowrap">
                          <Link
                            href={`/admin/content/${article.section}/${article.slug}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <span className="mx-2 text-gray-300">|</span>
                          <a
                            href={`/${article.section}/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
