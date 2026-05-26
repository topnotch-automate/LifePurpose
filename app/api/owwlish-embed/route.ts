import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

const PRODUCTION_OWW_HOST = "www.albertblibo.com";

/** Server-side proxy so local/preview builds can load course HTML (Owwlish blocks other hostnames). */
export async function GET() {
  const params = new URLSearchParams({
    owwlish_id: siteConfig.course.owwlishId,
    cview: "overview",
    oww_integration: "true",
    oww_host: PRODUCTION_OWW_HOST,
    singleCourseIdAttr: siteConfig.course.embedElementId,
  });

  const res = await fetch(
    `https://app.owwlish.com/api/embed/allcourses?${params.toString()}`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
