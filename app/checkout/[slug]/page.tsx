import { notFound } from "next/navigation";
import { getBookSlugs, getBookBySlug } from "@/lib/mdx";
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
    title: `Purchase ${book.title} | Checkout`,
    description: `Purchase ${book.title} - ${book.description}`,
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book || book.status !== "paid") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
          Purchase {book.title}
        </h1>

        <div className="bg-gray-50 rounded-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">{book.title}</span>
            <span className="text-xl font-semibold text-gray-900">
              {book.price ? `$${book.price.toFixed(2)}` : "Price TBD"}
            </span>
          </div>
          {book.subtitle && (
            <p className="text-sm text-gray-600 italic mb-4">{book.subtitle}</p>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a placeholder checkout page. To complete the purchase flow, integrate with:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-yellow-800 space-y-1">
            <li><strong>Stripe</strong> - For payment processing</li>
            <li><strong>Gumroad</strong> - For quick digital product sales</li>
            <li><strong>Lemon Squeezy</strong> - For all-in-one solution</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Set up your payment provider (Stripe recommended)</li>
            <li>Create a checkout session or payment link</li>
            <li>Handle successful payments and deliver the book</li>
            <li>Set up access control for paid content</li>
          </ol>
        </div>

        {book.purchaseLink && (
          <div className="mt-8">
            <a
              href={book.purchaseLink}
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Continue to External Purchase →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

