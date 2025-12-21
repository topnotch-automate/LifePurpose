"use client";

import { useState, FormEvent } from "react";
import { Book } from "@/lib/types";

interface BookEmailCaptureProps {
  book: Book;
}

export function BookEmailCapture({ book }: BookEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // For now, we'll use a simple API route
      // Later, integrate with ConvertKit, Buttondown, or Resend
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          bookSlug: book.slug,
          bookTitle: book.title,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
      console.error("Email subscription error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800 text-sm">
            Thank you. You will receive the companion reflection shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="bg-gray-50 rounded-lg p-6 md:p-8">
        <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">
          If you would like a free companion reflection to this guide, you may receive it by email.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2.5 border-2 border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Subscribing..." : "Receive the reflection"}
          </button>
        </form>

        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}

        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          No noise. Only clarity. You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}

