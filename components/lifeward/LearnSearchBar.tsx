"use client";

interface LearnSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  isSearching: boolean;
}

export function LearnSearchBar({
  value,
  onChange,
  resultCount,
  isSearching,
}: LearnSearchBarProps) {
  return (
    <div className="max-w-xl mx-auto w-full mb-8">
      <label htmlFor="learn-search" className="sr-only">
        Search articles
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--mid)]"
          aria-hidden
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          id="learn-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search articles by title, keyword, or phrase…"
          className="w-full rounded-full border border-[var(--light)] bg-white/90 py-3 pl-12 pr-11 text-[var(--charcoal)] placeholder:text-[var(--mid)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
          autoComplete="off"
          enterKeyHint="search"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--mid)] hover:text-[var(--navy)] hover:bg-[var(--sky)] transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}
      </div>
      {isSearching ? (
        <p className="mt-2 text-center text-sm text-[var(--mid)]" role="status">
          {resultCount === 0
            ? "No articles match your search."
            : `${resultCount} article${resultCount === 1 ? "" : "s"} found`}
        </p>
      ) : null}
    </div>
  );
}
