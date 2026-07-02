"use client";

import Link from "next/link";
import { useState } from "react";
import { buildYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/video-embed";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  embedUrl: string;
  title: string;
  /** Link to the full video page */
  href?: string;
  className?: string;
}

export function VideoPreview({ embedUrl, title, href, className }: VideoPreviewProps) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = getYouTubeThumbnail(embedUrl);

  return (
    <div className={cn("relative aspect-video overflow-hidden bg-[var(--navy)]", className)}>
      {playing ? (
        <iframe
          src={buildYouTubeEmbedUrl(embedUrl, true)}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
        />
      ) : (
        <>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--light)]" aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
            aria-label={`Play ${title}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/65 text-white shadow-lg transition-transform hover:scale-105 sm:h-16 sm:w-16">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-1 h-7 w-7 sm:h-8 sm:w-8"
                aria-hidden="true"
              >
                <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l12.01-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
              </svg>
            </span>
          </button>

          {href ? (
            <Link
              href={href}
              className="absolute right-2 top-2 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--navy)] shadow-sm hover:bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              Open
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
}
