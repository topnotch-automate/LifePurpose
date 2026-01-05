import Link from "next/link";
import { getAuthorDisplayName } from "@/lib/author";

export function AuthorBio() {
  const authorName = getAuthorDisplayName();

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-2xl font-serif font-bold text-white">
              {authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
            {authorName}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            I write to awaken clarity, discipline, and life. Through <strong>Esoteriment</strong>, 
            I simplify the unseen—making esoteric, metaphysical, and mystical concepts clear and accessible. 
            Through <strong>Lifeward</strong>, I focus on living the truth—applying God's timeless principles 
            in daily life for a more ordered and abundant life.
          </p>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
          >
            Learn more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

