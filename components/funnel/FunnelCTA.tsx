import Link from "next/link";
import { getBookBySlug } from "@/lib/mdx";
import { FunnelMetadata } from "@/lib/types";

interface FunnelCTAProps {
  funnel: FunnelMetadata;
}

export function FunnelCTA({ funnel }: FunnelCTAProps) {
  const book = getBookBySlug(funnel.book);

  if (!book) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="bg-gray-50 rounded-lg p-6 md:p-8">
        <p className="text-gray-700 italic mb-4 text-base leading-relaxed">
          If this reflection resonates, these ideas are explored more fully and practically in my short guide:
        </p>

        <div className="mt-4">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="text-gray-600 italic mb-4">{book.subtitle}</p>
          )}
          {book.description && (
            <p className="text-gray-700 text-sm mb-4">{book.description}</p>
          )}
        </div>

        <Link
          href={`/books/${book.slug}`}
          className="inline-block mt-4 text-[#9A7B4F] hover:text-[#7A5F3A] underline underline-offset-2 font-medium transition-colors"
        >
          View the guide →
        </Link>
      </div>
    </div>
  );
}

