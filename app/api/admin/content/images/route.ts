import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  sanitizeUploadSlug,
  uploadArticleFeaturedImage,
} from "@/lib/article-image-upload";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const fileEntry = formData.get("file");
    const slug = sanitizeUploadSlug(formData.get("slug")?.toString());

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    const result = await uploadArticleFeaturedImage(buffer, fileEntry.type, slug);

    return NextResponse.json({
      success: true,
      path: result.path,
      backend: result.backend,
      message:
        result.backend === "github"
          ? "Image saved to GitHub. Site will redeploy shortly."
          : "Image saved locally.",
    });
  } catch (error) {
    console.error("Featured image upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
