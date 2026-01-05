import { VideoCard } from "@/components/video/VideoCard";
import { getAllVideos } from "@/lib/mdx";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos - Curated Teachings",
  description: "Video teachings from Esoteriment and Lifeward. Curated wisdom, not just content.",
};

export default function VideosPage() {
  const videos = getAllVideos();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Curated Teachings
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Here, each video is carefully selected and contextualized.
            Every teaching is anchored to written wisdom, ensuring short-form content becomes a lasting source of insight and guidance.

            We do not just share videos — we connect them to a deeper framework for understanding and practice.
          </p>
        </header>

        {videos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-lg">Videos coming soon...</p>
            <p className="mt-2 text-sm">Teaching videos will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

