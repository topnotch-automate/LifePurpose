import { NextRequest, NextResponse } from "next/server";
import { getSubstackFreeSubscribeUrl } from "@/lib/substack";

export const dynamic = "force-dynamic";

/**
 * Proxy Substack free subscribe (browser iframe POST is unreliable on some hosts).
 * Falls back to client opening the public subscribe page if this returns an error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "website";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.albertblibo.com";
    const referer = request.headers.get("referer") || siteUrl;

    const params = new URLSearchParams({
      email,
      source: source || "website",
      first_url: referer,
      referrer: referer,
    });

    const substackResponse = await fetch(getSubstackFreeSubscribeUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Origin: new URL(getSubstackFreeSubscribeUrl()).origin,
        Referer: referer,
      },
      body: params.toString(),
      redirect: "manual",
    });

    // Substack returns 200 HTML or occasionally a redirect on success
    if (substackResponse.ok || substackResponse.status === 302 || substackResponse.status === 303) {
      return NextResponse.json({ success: true });
    }

    console.error("Substack subscribe failed:", substackResponse.status, await substackResponse.text());
    return NextResponse.json(
      { error: "Could not subscribe via Substack. Try the subscribe page instead." },
      { status: 502 }
    );
  } catch (error) {
    console.error("Substack subscribe error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
