import { notFound } from "next/navigation";
import { getBookSlugs, getBookBySlug } from "@/lib/mdx";
import Link from "next/link";
import { LikeButton } from "@/components/article/LikeButton";
import { CommentsSection } from "@/components/article/CommentsSection";
import { MarkdownContent } from "@/components/article/MarkdownContent";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = getBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  
  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: `${book.title} | Books`,
    description: book.description,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {book.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {book.description}
          </p>

          {book.cover && (
            <div className="mb-6 max-w-xs">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </header>

        <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm mb-8">
          {book.themes && book.themes.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Core Themes</h2>
              <div className="flex flex-wrap gap-2">
                {book.themes.map((theme) => (
                  <span
                    key={theme}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {book.sampleChapter && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sample Chapter</h2>
              <div className="prose max-w-none">
                <MarkdownContent content={book.sampleChapter} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {book.downloadLink && (
              <Link
                href={book.downloadLink}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
              >
                Download
              </Link>
            )}
            {book.purchaseLink && (
              <Link
                href={book.purchaseLink}
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Purchase
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LikeButton contentType="book" contentId={book.slug} />
        </div>

        <CommentsSection contentType="book" contentId={book.slug} />
      </div>
    </div>
  );
}

