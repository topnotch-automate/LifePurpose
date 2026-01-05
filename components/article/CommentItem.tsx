"use client";

import { useState, FormEvent } from "react";
import { isAuthor, getAuthorDisplayName } from "@/lib/author";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: Comment[];
  authorLiked?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  contentType: "article" | "video" | "book";
  contentId: string;
  onReply: (commentId: string, reply: Comment) => void;
  onAuthorLike: (commentId: string) => void;
}

export function CommentItem({
  comment,
  contentType,
  contentId,
  onReply,
  onAuthorLike,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const isAuthorComment = isAuthor(comment.author);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          contentId,
          commentId: comment.id,
          author: getAuthorDisplayName(),
          content: replyContent.trim(),
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        onReply(comment.id, newReply);
        setReplyContent("");
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
      alert("Failed to submit reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthorLike = async () => {
    setIsLiking(true);
    try {
      const response = await fetch("/api/comments/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          contentId,
          commentId: comment.id,
        }),
      });

      if (response.ok) {
        onAuthorLike(comment.id);
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Check if current user is authenticated as admin/author
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const isAuthorUser = isAdmin === true;

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{comment.author}</h3>
          {isAuthorComment && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[#9A7B4F] text-white rounded-full">
              Author
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <time className="text-sm text-gray-500">{formatDate(comment.date)}</time>
          {isAuthorUser && !isAuthorComment && (
            <button
              onClick={handleAuthorLike}
              disabled={isLiking}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label={comment.authorLiked ? "Unlike comment" : "Like comment"}
              title={comment.authorLiked ? "Unlike comment" : "Like comment as author"}
            >
              <svg
                className={`w-4 h-4 ${comment.authorLiked ? "fill-red-500 text-red-500" : ""}`}
                fill={comment.authorLiked ? "currentColor" : "none"}
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
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{comment.content}</p>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">{reply.author}</span>
                {isAuthor(reply.author) && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-[#9A7B4F] text-white rounded-full">
                    Author
                  </span>
                )}
                <time className="text-xs text-gray-500">{formatDate(reply.date)}</time>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form (only for author) */}
      {isAuthorUser && !isAuthorComment && (
        <div className="mt-4">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="text-sm text-[#9A7B4F] hover:text-[#7A5F3A] font-medium transition-colors"
            >
              Reply as author
            </button>
          ) : (
            <form onSubmit={handleReply} className="mt-3 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-vertical mb-3"
                placeholder="Write a reply..."
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="px-4 py-2 bg-[#9A7B4F] text-white rounded-lg text-sm font-medium hover:bg-[#7A5F3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

