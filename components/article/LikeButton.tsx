"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LikeButtonProps {
  contentType: "article" | "video" | "book";
  contentId: string;
  section?: "esoteriment" | "lifeward";
}

export function LikeButton({ contentType, contentId, section }: LikeButtonProps) {
  const pathname = usePathname();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user's like status
    const likedItems = JSON.parse(localStorage.getItem("likedItems") || "{}");
    const itemKey = `${contentType}-${contentId}`;
    setIsLiked(likedItems[itemKey] || false);

    // Fetch current like count
    fetch(`/api/likes?type=${contentType}&id=${contentId}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.likes || 0);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [contentType, contentId]);

  const handleLike = async () => {
    const itemKey = `${contentType}-${contentId}`;
    const likedItems = JSON.parse(localStorage.getItem("likedItems") || "{}");
    const currentlyLiked = likedItems[itemKey] || false;

    // Optimistic update
    setIsLiked(!currentlyLiked);
    setLikes((prev) => (currentlyLiked ? prev - 1 : prev + 1));

    // Update localStorage
    likedItems[itemKey] = !currentlyLiked;
    localStorage.setItem("likedItems", JSON.stringify(likedItems));

    // Update server
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          id: contentId,
          action: currentlyLiked ? "unlike" : "like",
        }),
      });
    } catch (error) {
      // Revert on error
      setIsLiked(currentlyLiked);
      setLikes((prev) => (currentlyLiked ? prev + 1 : prev - 1));
      console.error("Failed to update like:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-sm">...</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors group"
      aria-label={isLiked ? "Unlike this content" : "Like this content"}
    >
      <svg
        className={`w-5 h-5 transition-all ${
          isLiked
            ? "fill-red-500 text-red-500"
            : "text-gray-600 group-hover:text-red-500"
        }`}
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className={`text-sm font-medium ${isLiked ? "text-red-600" : "text-gray-700"}`}>
        {likes}
      </span>
    </button>
  );
}

