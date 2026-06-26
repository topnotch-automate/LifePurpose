import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_SITE_URL,
  isLifewardCoachingHost,
  LIFEWARD_COACHING_URL,
} from "@/lib/site-url";

const MAIN_SITE_ORIGIN = DEFAULT_SITE_URL.replace(/\/$/, "");
const COACHING_ORIGIN = LIFEWARD_COACHING_URL.replace(/\/$/, "");

function isStaticAsset(pathname: string): boolean {
  return /\.(?:ico|png|jpe?g|svg|webp|gif|txt|xml|woff2?)$/i.test(pathname);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (isLifewardCoachingHost(host)) {
    if (pathname === "/work-with-me" || pathname === "/work-with-me/") {
      return NextResponse.redirect(new URL("/", request.url), 308);
    }

    if (pathname === "/" || pathname === "") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = "/work-with-me";
      return NextResponse.rewrite(rewriteUrl);
    }

    const destination = new URL(
      `${pathname}${request.nextUrl.search}`,
      `${MAIN_SITE_ORIGIN}/`
    );
    return NextResponse.redirect(destination, 308);
  }

  if (pathname === "/work-with-me" || pathname === "/work-with-me/") {
    return NextResponse.redirect(new URL("/", `${COACHING_ORIGIN}/`), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
