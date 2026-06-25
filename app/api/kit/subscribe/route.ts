import { NextRequest, NextResponse } from "next/server";
import { subscribeToKit } from "@/lib/kit-subscribe";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "kit";
    const pageUrl =
      typeof body.pageUrl === "string"
        ? body.pageUrl.trim()
        : request.headers.get("referer") || undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const kitResult = await subscribeToKit(email);
    if (!kitResult.ok) {
      return NextResponse.json({ error: kitResult.error }, { status: kitResult.status });
    }

    await storage.upsertSubscriber({ email, source, pageUrl });
    return NextResponse.json({
      success: true,
      requiresConfirmation: kitResult.requiresConfirmation,
      state: kitResult.state,
    });
  } catch (error) {
    console.error("Kit subscribe route error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
