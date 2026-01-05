import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  try {
    const likes = await storage.getLikes();
    const key = `${type}-${id}`;
    const likeCount = likes[key] || 0;

    return NextResponse.json({ likes: likeCount });
  } catch (error) {
    console.error("Error getting likes:", error);
    return NextResponse.json({ error: "Failed to get likes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, action } = body;

    if (!type || !id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (action !== "like" && action !== "unlike") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const likes = await storage.getLikes();
    const key = `${type}-${id}`;
    const currentLikes = likes[key] || 0;

    likes[key] = action === "like" ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    await storage.saveLikes(likes);

    return NextResponse.json({ likes: likes[key], success: true });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}

