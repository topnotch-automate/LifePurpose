"use client";

import { useState, useEffect, FormEvent } from "react";
import { CommentItem } from "./CommentItem";
import { getAuthorDisplayName } from "@/lib/author";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: Comment[];
  authorLiked?: boolean;
}

interface CommentsSectionProps {
  contentType: "article" | "video" | "book";
  contentId: string;
}

export function CommentsSection({ contentType, contentId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ author: "", content: "" });

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?type=${contentType}&id=${contentId}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          id: contentId,
          author: formData.author.trim(),
          content: formData.content.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setFormData({ author: "", content: "" });
        setShowForm(false);
        fetchComments(); // Refresh to get updated data
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string, reply: Comment) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      })
    );
    fetchComments(); // Refresh to get updated data
  };

  const handleAuthorLike = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            authorLiked: !comment.authorLiked,
          };
        }
        return comment;
      })
    );
    fetchComments(); // Refresh to get updated data
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-semibold text-gray-900">
          Comments ({comments.length})
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add Comment
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-vertical"
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Post Comment"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ author: "", content: "" });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              contentType={contentType}
              contentId={contentId}
              onReply={handleReply}
              onAuthorLike={handleAuthorLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}

