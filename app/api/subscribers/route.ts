import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

/** Capture newsletter sign-up attempts for admin backup (Substack may fail silently). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "website";
    const pageUrl =
      typeof body.pageUrl === "string"
        ? body.pageUrl.trim()
        : request.headers.get("referer") || undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    await storage.upsertSubscriber({ email, source, pageUrl });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscriber capture error:", error);
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }
}
