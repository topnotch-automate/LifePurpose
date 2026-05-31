"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArticleSection,
  getArticleCategories,
  SECTION_LABELS,
  slugify,
} from "@/lib/content-files";

export interface ArticleFormValues {
  title: string;
  slug: string;
  description: string;
  date: string;
  section: ArticleSection;
  category: string;
  tags: string;
  image: string;
  foundational: boolean;
  funnelBook: string;
  funnelCtaType: "soft" | "standard";
  body: string;
}

interface ArticleEditorProps {
  mode: "create" | "edit";
  initialValues: ArticleFormValues;
  onSubmit: (values: ArticleFormValues) => Promise<{ message?: string; error?: string }>;
}

const emptyValues: ArticleFormValues = {
  title: "",
  slug: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  section: "esoteriment",
  category: "",
  tags: "",
  image: "",
  foundational: false,
  funnelBook: "",
  funnelCtaType: "soft",
  body: "",
};

export function getEmptyArticleValues(): ArticleFormValues {
  return { ...emptyValues };
}

export function ArticleEditor({ mode, initialValues, onSubmit }: ArticleEditorProps) {
  const [values, setValues] = useState<ArticleFormValues>(initialValues);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const router = useRouter();

  const categories = getArticleCategories(values.section);
  const previewSlug =
    mode === "edit" ? values.slug : slugTouched ? values.slug : slugify(values.title);

  const updateField = <K extends keyof ArticleFormValues>(
    key: K,
    value: ArticleFormValues[K]
  ) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugTouched && mode === "create") {
        next.slug = slugify(String(value));
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const result = await onSubmit({
      ...values,
      slug: previewSlug,
    });

    if (result.error) {
      setStatus({ type: "error", text: result.error });
    } else {
      setStatus({
        type: "success",
        text: result.message || "Saved successfully.",
      });
      if (mode === "create" && previewSlug) {
        router.push(`/admin/content/${values.section}/${previewSlug}`);
      }
    }

    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={values.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select
            value={values.section}
            onChange={(e) => updateField("section", e.target.value as ArticleSection)}
            disabled={mode === "edit"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="esoteriment">{SECTION_LABELS.esoteriment}</option>
            <option value="lifeward">{SECTION_LABELS.lifeward}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={values.date}
            onChange={(e) => updateField("date", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
        </div>

        {mode === "create" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={slugTouched ? values.slug : previewSlug}
              onChange={(e) => {
                setSlugTouched(true);
                updateField("slug", slugify(e.target.value));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL: /{values.section}/{previewSlug || "your-slug"}
            </p>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={2}
            placeholder="Leave blank to auto-generate from the first paragraph"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={values.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={values.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured image path (optional)
          </label>
          <input
            type="text"
            value={values.image}
            onChange={(e) => updateField("image", e.target.value)}
            placeholder="/images/articles/example.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Path under <code className="text-xs">public/</code>, e.g.{" "}
            <code className="text-xs">/images/articles/my-image.png</code>. Include the file
            extension and commit the image to the repo.
          </p>
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="foundational"
            type="checkbox"
            checked={values.foundational}
            onChange={(e) => updateField("foundational", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="foundational" className="text-sm text-gray-700">
            Foundational message (Start Here section)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funnel book slug (optional)
          </label>
          <input
            type="text"
            value={values.funnelBook}
            onChange={(e) => updateField("funnelBook", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Funnel CTA type</label>
          <select
            value={values.funnelCtaType}
            onChange={(e) =>
              updateField("funnelCtaType", e.target.value as "soft" | "standard")
            }
            disabled={!values.funnelBook}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="soft">Soft</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body (Markdown)</label>
        <textarea
          value={values.body}
          onChange={(e) => updateField("body", e.target.value)}
          rows={24}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Write your article in Markdown..."
        />
      </div>

      {status && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : mode === "create" ? "Publish article" : "Save changes"}
        </button>
        {mode === "edit" && previewSlug && (
          <a
            href={`/${values.section}/${previewSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View live →
          </a>
        )}
      </div>
    </form>
  );
}

function articleToFormPayload(values: ArticleFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    description: values.description,
    date: values.date,
    section: values.section,
    category: values.category || undefined,
    tags: values.tags,
    image: values.image || undefined,
    foundational: values.foundational,
    funnelBook: values.funnelBook || undefined,
    funnelCtaType: values.funnelCtaType,
    body: values.body,
  };
}

export async function submitNewArticle(values: ArticleFormValues) {
  const response = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(articleToFormPayload(values)),
  });
  const data = await response.json();
  if (!response.ok) {
    const issueText = Array.isArray(data.issues)
      ? data.issues.map((issue: { message: string }) => issue.message).join(" ")
      : "";
    return { error: data.error + (issueText ? `: ${issueText}` : "") };
  }
  return { message: data.message };
}

export async function submitArticleUpdate(
  section: ArticleSection,
  slug: string,
  values: ArticleFormValues
) {
  const response = await fetch(`/api/admin/content/${section}/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(articleToFormPayload(values)),
  });
  const data = await response.json();
  if (!response.ok) {
    const issueText = Array.isArray(data.issues)
      ? data.issues.map((issue: { message: string }) => issue.message).join(" ")
      : "";
    return { error: data.error + (issueText ? `: ${issueText}` : "") };
  }
  return { message: data.message };
}
