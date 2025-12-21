import { getAllArticles } from "@/lib/mdx";
import { NextResponse } from "next/server";

export async function GET() {
  const articles = getAllArticles();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourname.com";

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Name - Writer, Teacher, Guide</title>
    <description>I write to awaken clarity, discipline, and life. Explore Esoteriment and Lifeward.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles
      .map(
        (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.description)}</description>
      <link>${siteUrl}/${article.section}/${article.slug}</link>
      <guid>${siteUrl}/${article.section}/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <category>${escapeXml(article.section)}</category>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

