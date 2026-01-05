import { notFound } from "next/navigation";
import { getArticleSlugs, getArticleBySlug } from "@/lib/mdx";
import { ArticleContent } from "@/components/article/ArticleContent";
import { generateArticleMetadata, generateStructuredData } from "@/lib/metadata";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// Temporarily disabled to ensure fully dynamic rendering
// export async function generateStaticParams() {
//   const slugs = getArticleSlugs("lifeward");
//   return slugs.map((slug) => ({ slug }));
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("lifeward", slug);
  
  if (!article) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateArticleMetadata(article);
}

export default async function LifewardArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug("lifeward", slug);

  if (!article) {
    notFound();
  }

  const structuredData = generateStructuredData("Article", article);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ArticleContent article={article} />
    </>
  );
}

