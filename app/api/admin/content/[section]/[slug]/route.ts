import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ArticleInput,
  ArticleSection,
  isValidSection,
  isValidSlug,
  validateArticleInput,
} from "@/lib/content-files";
import { getArticle, updateArticle } from "@/lib/content-storage";

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

type RouteParams = { section: string; slug: string };

export async function GET(
  _request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, slug } = await context.params;
    if (!isValidSection(section) || !isValidSlug(slug)) {
      return NextResponse.json({ error: "Invalid article path" }, { status: 400 });
    }

    const article = getArticle(section, slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, slug } = await context.params;
    if (!isValidSection(section) || !isValidSlug(slug)) {
      return NextResponse.json({ error: "Invalid article path" }, { status: 400 });
    }

    const body = await request.json();
    const input = parseArticleBody(body);

    const issues = validateArticleInput(input, { slug, isUpdate: true });
    if (issues.length > 0) {
      return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
    }

    const result = await updateArticle(section, slug, input);

    return NextResponse.json({
      success: true,
      slug,
      section,
      backend: result.backend,
      path: result.path,
      message:
        result.backend === "github"
          ? "Article updated on GitHub. Site will redeploy shortly."
          : "Article updated locally.",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    const message = error instanceof Error ? error.message : "Failed to update article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
