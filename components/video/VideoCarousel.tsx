"use client";

import { useState } from "react";
import { Video } from "@/lib/types";
import { VideoCard } from "./VideoCard";

interface VideoCarouselProps {
  videos: Video[];
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (videos.length === 0) return null;
  if (videos.length === 1) {
    return <VideoCard video={videos[0]} />;
  }

  const visibleCount = 2; // Show 2 videos at a time on desktop
  const maxIndex = Math.max(0, videos.length - visibleCount);

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleVideos = videos.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 gap-6">
        {visibleVideos.map((video) => (
          <VideoCard key={video.slug} video={video} />
        ))}
      </div>

      {videos.length > visibleCount && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center z-10"
            aria-label="Previous videos"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center z-10"
            aria-label="Next videos"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-gray-900 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

