import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use /tmp in serverless environments (Vercel), fallback to local data directory for development
const likesFilePath = process.env.VERCEL 
  ? path.join("/tmp", "likes.json")
  : path.join(process.cwd(), "data", "likes.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(likesFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize likes file if it doesn't exist
function initLikesFile() {
  ensureDataDir();
  if (!fs.existsSync(likesFilePath)) {
    fs.writeFileSync(likesFilePath, JSON.stringify({}), "utf8");
  }
}

function getLikes() {
  initLikesFile();
  try {
    const data = fs.readFileSync(likesFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function saveLikes(likes: Record<string, number>) {
  ensureDataDir();
  fs.writeFileSync(likesFilePath, JSON.stringify(likes, null, 2), "utf8");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const likes = getLikes();
  const key = `${type}-${id}`;
  const likeCount = likes[key] || 0;

  return NextResponse.json({ likes: likeCount });
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

    const likes = getLikes();
    const key = `${type}-${id}`;
    const currentLikes = likes[key] || 0;

    likes[key] = action === "like" ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    saveLikes(likes);

    return NextResponse.json({ likes: likes[key], success: true });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}

