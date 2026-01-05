"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      return;
    }

    const searchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Search error:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchArticles, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <p>Searching...</p>
              </div>
            ) : query && articles.length > 0 ? (
              <div className="p-2">
                {articles.map((article) => {
                  const sectionColor = article.section === "esoteriment" ? "text-[#7C8A9E]" : "text-[#9A7B4F]";
                  return (
                    <Link
                      key={article.slug}
                      href={`/${article.section}/${article.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-3 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs font-medium uppercase", sectionColor)}>
                          {article.section}
                        </span>
                        {article.readingTime && (
                          <span className="text-xs text-gray-500">• {article.readingTime} min</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                    </Link>
                  );
                })}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-500">
                <p>No articles found</p>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>Start typing to search...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

