"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FeaturedImageFieldProps {
  value: string;
  slug: string;
  onChange: (path: string) => void;
}

export function FeaturedImageField({ value, slug, onChange }: FeaturedImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    if (slug.trim()) {
      formData.append("slug", slug.trim());
    }

    try {
      const response = await fetch("/api/admin/content/images", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const data = (await response.json()) as {
        path?: string;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.path) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      onChange(data.path);
      setUploadMessage(data.message || "Image uploaded.");
    } catch {
      setUploadError("Network error while uploading image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {isUploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUploadMessage(null);
              setUploadError(null);
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Remove
          </button>
        ) : null}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/articles/my-article.png"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
      />
      <p className="text-xs text-gray-500">
        Upload sets the path automatically (named from the article slug). PNG, JPEG, WebP, or GIF,
        max 5 MB. In production, images are saved to GitHub and deploy with the site.
      </p>

      {uploadError ? <p className="text-sm text-red-700">{uploadError}</p> : null}
      {uploadMessage ? <p className="text-sm text-green-700">{uploadMessage}</p> : null}

      {value ? (
        <div
          className={cn(
            "relative aspect-[16/9] w-full max-w-xl overflow-hidden rounded-lg border border-gray-200 bg-gray-50",
            isUploading && "opacity-60"
          )}
        >
          <Image
            src={value}
            alt="Featured image preview"
            fill
            className="object-cover"
            sizes="512px"
            unoptimized
          />
        </div>
      ) : null}
    </div>
  );
}
