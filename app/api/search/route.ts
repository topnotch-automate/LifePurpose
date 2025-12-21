import { getAllArticles } from "@/lib/mdx";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  const allArticles = getAllArticles();

  if (!query) {
    return NextResponse.json({ articles: [] });
  }

  const filtered = allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      article.category?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return NextResponse.json({ articles: filtered });
}

