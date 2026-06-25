import { NextRequest, NextResponse } from "next/server";
import { KIT_FORM_ID } from "@/lib/kit";
import { subscribeToKit } from "@/lib/kit-subscribe";
import { siteConfig } from "@/lib/site-config";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

function resolveKitFormId(requested?: string): string {
  const trimmed = requested?.trim();
  if (trimmed) return trimmed;
  return KIT_FORM_ID || siteConfig.kitFormId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "newsletter";
    const adminOnly = body.adminOnly === true;
    const pageUrl =
      typeof body.pageUrl === "string"
        ? body.pageUrl.trim()
        : request.headers.get("referer") || undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Always capture in admin first — even if Kit is slow or fails later.
    await storage.upsertSubscriber({ email, source, pageUrl, synced: false });

    if (adminOnly) {
      return NextResponse.json({ success: true, stored: true });
    }

    const formId = resolveKitFormId(
      typeof body.formId === "string" ? body.formId : undefined
    );

    const kitResult = await subscribeToKit(email, formId);
    if (!kitResult.ok) {
      return NextResponse.json({ error: kitResult.error, stored: true }, { status: kitResult.status });
    }

    await storage.upsertSubscriber({ email, source, pageUrl, synced: true });

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
