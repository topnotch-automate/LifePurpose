import { notFound } from "next/navigation";
import { getArticleSlugs, getArticleBySlug } from "@/lib/mdx";
import { ArticleContent } from "@/components/article/ArticleContent";
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
    };
  }

  return {
    title: `${article.title} | Lifeward`,
    description: article.description,
  };
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

  return <ArticleContent article={article} />;
}

