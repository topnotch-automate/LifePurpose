import Link from "next/link";
import { getAllBooks } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books - Mini-Books Library",
  description: "Digital bookshelf of self-help mini-books. Practical wisdom in digestible formats.",
};

export default function BooksPage() {
  const books = getAllBooks();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Mini-Books Library
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Practical wisdom in digestible formats. Each book explores core themes 
            and provides actionable insights for transformation.
          </p>
        </header>

        {books.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.slug}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {book.cover && (
                  <div className="aspect-[3/4] bg-gray-100">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {book.description}
                  </p>
                  {book.themes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.themes.map((theme) => (
                        <span
                          key={theme}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Link
                      href={`/books/${book.slug}`}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                    {book.downloadLink && (
                      <Link
                        href={book.downloadLink}
                        className="px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </Link>
                    )}
                    {book.purchaseLink && (
                      <Link
                        href={book.purchaseLink}
                        className="px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Purchase
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-lg">Books coming soon...</p>
            <p className="mt-2 text-sm">Mini-books will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

