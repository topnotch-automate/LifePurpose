import { NextRequest, NextResponse } from "next/server";
import { subscribeToSubstack } from "@/lib/substack-subscribe";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "substack";
    const pageUrl =
      typeof body.pageUrl === "string"
        ? body.pageUrl.trim()
        : request.headers.get("referer") || undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const substackResult = await subscribeToSubstack(email, source, pageUrl);
    if (!substackResult.ok) {
      return NextResponse.json({ error: substackResult.error }, { status: substackResult.status });
    }

    await storage.upsertSubscriber({ email, source, pageUrl });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Substack subscribe route error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
