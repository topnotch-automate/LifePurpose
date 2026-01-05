"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  type: string;
  contentId: string;
  parentId?: string;
}

export function AdminDashboardClient() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/admin/comments");
      if (response.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(commentId);
    try {
      const response = await fetch(`/api/admin/comments?id=${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId && c.parentId !== commentId));
      } else {
        alert("Failed to delete comment. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContentLink = (type: string, contentId: string) => {
    if (type === "article") {
      // Articles could be in esoteriment or lifeward - we'll link to a search or show the slug
      // For now, try esoteriment first, user can navigate from there
      return `/esoteriment/${contentId}`;
    } else if (type === "video") {
      return `/videos/${contentId}`;
    }
    return "#";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Comment Management</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <p>No comments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4 text-sm text-gray-600">
                  Total comments: {comments.length}
                </div>
                {comments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">{comment.author}</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {comment.type}
                            </span>
                            {comment.parentId && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                Reply
                              </span>
                            )}
                          </div>
                          <time className="text-sm text-gray-500">{formatDate(comment.date)}</time>
                          <div className="mt-2">
                            <a
                              href={getContentLink(comment.type, comment.contentId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View on: {comment.type} / {comment.contentId} →
                            </a>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={isDeleting === comment.id}
                          className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === comment.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      <p className="text-gray-700 mt-3 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

