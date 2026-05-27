import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ArticleInput,
  ArticleSection,
  slugify,
  validateArticleInput,
} from "@/lib/content-files";
import { createArticle, listArticles } from "@/lib/content-storage";

function parseArticleBody(body: Record<string, unknown>): ArticleInput {
  const tags = Array.isArray(body.tags)
    ? body.tags.map(String)
    : typeof body.tags === "string"
      ? body.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const funnelBook =
    typeof body.funnelBook === "string" ? body.funnelBook.trim() : undefined;
  const funnelCtaType =
    body.funnelCtaType === "soft" || body.funnelCtaType === "standard"
      ? body.funnelCtaType
      : undefined;

  return {
    title: String(body.title || ""),
    description: typeof body.description === "string" ? body.description : undefined,
    date: typeof body.date === "string" ? body.date : undefined,
    section: (body.section === "lifeward" ? "lifeward" : "esoteriment") as ArticleSection,
    category: typeof body.category === "string" ? body.category : undefined,
    tags,
    image: typeof body.image === "string" ? body.image : undefined,
    foundational: Boolean(body.foundational),
    funnel: funnelBook
      ? {
          book: funnelBook,
          ctaType: funnelCtaType,
        }
      : undefined,
    body: String(body.body || ""),
  };
}

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articles = listArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error listing articles:", error);
    return NextResponse.json({ error: "Failed to list articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const input = parseArticleBody(body);
    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug.trim())
        : slugify(input.title);

    const issues = validateArticleInput(input, { slug });
    if (issues.length > 0) {
      return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
    }

    const result = await createArticle(slug, input);

    return NextResponse.json({
      success: true,
      slug,
      section: input.section,
      backend: result.backend,
      path: result.path,
      message:
        result.backend === "github"
          ? "Article saved to GitHub. Site will redeploy shortly."
          : "Article saved locally.",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    const message = error instanceof Error ? error.message : "Failed to create article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
