import Link from "next/link";
import { Video } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const sectionColor = video.section === "esoteriment" ? "text-[#7C8A9E]" : "text-[#9A7B4F]";
  
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="block group transition-all duration-200"
    >
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gray-100 relative">
          <iframe
            src={video.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-sm font-medium uppercase tracking-wide ${sectionColor}`}>
              {video.section}
            </span>
            <span className="text-gray-300">•</span>
            <time className="text-sm text-gray-600">{formatDate(video.date)}</time>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {video.title}
          </h2>
          <p className="text-gray-600 line-clamp-2">
            {video.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

