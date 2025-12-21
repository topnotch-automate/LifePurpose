import { notFound } from "next/navigation";
import { getVideoSlugs, getVideoBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { MarkdownContent } from "@/components/article/MarkdownContent";
import { LikeButton } from "@/components/article/LikeButton";
import { CommentsSection } from "@/components/article/CommentsSection";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = getVideoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  
  if (!video) {
    return {
      title: "Video Not Found",
    };
  }

  return {
    title: `${video.title} | Videos`,
    description: video.description,
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const sectionColor = video.section === "esoteriment" ? "text-[#7C8A9E]" : "text-[#9A7B4F]";
  const sectionBg = video.section === "esoteriment" ? "bg-[#FAFAF9]" : "bg-[#FFFDF8]";

  return (
    <div className={`min-h-screen ${sectionBg} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm font-medium uppercase tracking-wide ${sectionColor}`}>
              {video.section}
            </span>
            <span className="text-gray-300">•</span>
            <time className="text-sm text-gray-600">{formatDate(video.date)}</time>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {video.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {video.description}
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={video.embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>
        </div>

        {video.content && (
          <div className="prose prose-lg max-w-none article-content bg-white rounded-lg p-8 md:p-12 shadow-sm mb-8">
            <MarkdownContent content={video.content} />
          </div>
        )}

        <div className="flex items-center gap-4 mt-8">
          <LikeButton contentType="video" contentId={video.slug} section={video.section} />
        </div>

        <CommentsSection contentType="video" contentId={video.slug} />

        {video.relatedArticle && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Related Article</h2>
            <Link
              href={`/${video.section}/${video.relatedArticle}`}
              className="text-[#9A7B4F] hover:underline font-medium"
            >
              Read the related article →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

