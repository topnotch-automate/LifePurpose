import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  type: string;
  contentId: string;
  parentId?: string;
  replies?: Comment[];
  authorLiked?: boolean;
}

// Use /tmp in serverless environments (Vercel), fallback to local data directory for development
const commentsFilePath = process.env.VERCEL 
  ? path.join("/tmp", "comments.json")
  : path.join(process.cwd(), "data", "comments.json");

function ensureDataDir() {
  const dataDir = path.dirname(commentsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function initCommentsFile() {
  ensureDataDir();
  if (!fs.existsSync(commentsFilePath)) {
    fs.writeFileSync(commentsFilePath, JSON.stringify([]), "utf8");
  }
}

function getComments(): Comment[] {
  initCommentsFile();
  try {
    const data = fs.readFileSync(commentsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveComments(comments: Comment[]) {
  ensureDataDir();
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, contentId, commentId } = body;

    if (!type || !contentId || !commentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const allComments = getComments();

    // Find and toggle like on comment
    const updatedComments = allComments.map((comment) => {
      if (comment.id === commentId && comment.type === type && comment.contentId === contentId) {
        return {
          ...comment,
          authorLiked: !comment.authorLiked,
        };
      }
      return comment;
    });

    saveComments(updatedComments);

    const updatedComment = updatedComments.find(
      (c) => c.id === commentId && c.type === type && c.contentId === contentId
    );

    return NextResponse.json({
      success: true,
      authorLiked: updatedComment?.authorLiked || false,
    });
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

