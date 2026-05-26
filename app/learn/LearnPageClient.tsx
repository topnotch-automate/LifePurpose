"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LearnItemCard } from "@/components/lifeward/LearnItemCard";
import { LearnSearchBar } from "@/components/lifeward/LearnSearchBar";
import {
  filterLearnItemsWithSearch,
  LearnFilter,
  LearnItem,
  learnPageHref,
  parseLearnFilter,
} from "@/lib/learn-items";

const filters: { key: LearnFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "understanding", label: "Understanding" },
  { key: "practice", label: "Practice" },
  { key: "books", label: "Books" },
  { key: "videos", label: "Videos" },
];

const emptyMessages: Record<LearnFilter, string> = {
  all: "No content available yet.",
  understanding: "No Understanding articles yet.",
  practice: "No Practice articles yet.",
  books: "No mini-books yet.",
  videos: "No videos yet — teachings will appear here when added.",
};

interface LearnPageClientProps {
  items: LearnItem[];
}

function LearnPageContent({ items }: LearnPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterFromUrl = parseLearnFilter(searchParams.get("filter"));
  const queryFromUrl = searchParams.get("q") ?? "";

  const [filter, setFilter] = useState<LearnFilter>(filterFromUrl);
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  useEffect(() => {
    setFilter(filterFromUrl);
  }, [filterFromUrl]);

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  const syncUrl = useCallback(
    (nextFilter: LearnFilter, nextQuery: string) => {
      router.replace(learnPageHref(nextFilter, nextQuery), { scroll: false });
    },
    [router]
  );

  const setActiveFilter = useCallback(
    (key: LearnFilter) => {
      setFilter(key);
      syncUrl(key, searchQuery);
    },
    [searchQuery, syncUrl]
  );

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => syncUrl(filter, value), 300);
    },
    [filter, syncUrl]
  );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const filtered = useMemo(
    () => filterLearnItemsWithSearch(items, filter, searchQuery),
    [items, filter, searchQuery]
  );

  const isSearching = searchQuery.trim().length > 0;
  const searchBlockedByFilter =
    isSearching && (filter === "books" || filter === "videos");

  const counts = useMemo(() => {
    return {
      all: items.length,
      understanding: items.filter((i) => i.type === "understanding").length,
      practice: items.filter((i) => i.type === "practice").length,
      books: items.filter((i) => i.type === "book").length,
      videos: items.filter((i) => i.type === "video").length,
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-[var(--cream)] py-12 md:py-16 lg:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light text-[var(--navy)] mb-4">
            Explore the Writing
          </h1>
          <p className="text-[var(--mid)] max-w-2xl mx-auto mb-8">
            Articles, mini-books, and video teachings — one library for
            understanding and practice.
          </p>

          <LearnSearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            resultCount={isSearching ? filtered.length : undefined}
            isSearching={isSearching}
          />

          <div className="inline-flex flex-wrap gap-3 justify-center">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={filter === key ? activeBtn : inactiveBtn}
              >
                {label}
                {!isSearching && counts[key] > 0 ? (
                  <span className="ml-1.5 opacity-70">({counts[key]})</span>
                ) : null}
              </button>
            ))}
          </div>
        </header>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <LearnItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-[var(--mid)] bg-white/50 rounded-2xl border border-[var(--light)] py-12 px-6">
            {searchBlockedByFilter ? (
              <>
                <p className="font-medium text-[var(--navy)]">
                  Search applies to articles only
                </p>
                <p className="mt-2">
                  Switch to All, Understanding, or Practice — or clear your search
                  to browse {filter === "books" ? "mini-books" : "videos"}.
                </p>
              </>
            ) : isSearching ? (
              <p className="font-medium">
                No articles match &ldquo;{searchQuery.trim()}&rdquo;. Try another
                title, keyword, or phrase.
              </p>
            ) : (
              <p className="font-medium">{emptyMessages[filter]}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function LearnPageClient(props: LearnPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--cream)] py-16 px-4 text-center text-[var(--mid)]">
          Loading library…
        </div>
      }
    >
      <LearnPageContent {...props} />
    </Suspense>
  );
}

const activeBtn =
  "px-4 py-2 rounded-full bg-[var(--gold)] text-white font-medium transition-colors";

const inactiveBtn =
  "px-4 py-2 rounded-full bg-white/60 border border-[var(--light)] text-[var(--navy)] hover:bg-[var(--sky)] transition-colors font-medium";
