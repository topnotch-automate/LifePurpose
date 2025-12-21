import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthorDisplayName } from "@/lib/author";

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

const commentsFilePath = path.join(process.cwd(), "data", "comments.json");

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
    const { type, contentId, commentId, author, content } = body;

    if (!type || !contentId || !commentId || !author || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validation
    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: "Reply must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (content.trim().length > 500) {
      return NextResponse.json(
        { error: "Reply is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    const allComments = getComments();
    
    // Find parent comment
    const parentComment = allComments.find((c) => c.id === commentId);
    if (!parentComment) {
      return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
    }

    // Create reply
    const reply: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      type,
      contentId,
      parentId: commentId,
    };

    // Add reply to parent's replies array
    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    parentComment.replies.push(reply);

    // Update in allComments array
    const updatedComments = allComments.map((c) =>
      c.id === commentId ? parentComment : c
    );

    saveComments(updatedComments);

    // Return reply without internal fields
    const { type: _, contentId: __, parentId: ___, ...replyResponse } = reply;

    return NextResponse.json(replyResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}

