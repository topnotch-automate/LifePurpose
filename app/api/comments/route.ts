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

const commentsFilePath = path.join(process.cwd(), "data", "comments.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(commentsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize comments file if it doesn't exist
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const allComments = getComments();
  // Get top-level comments (no parentId) and include their replies
  const comments = allComments
    .filter((comment) => comment.type === type && comment.contentId === id && !comment.parentId)
    .map((comment) => {
      // Find all replies for this comment
      const replies = allComments.filter(
        (c) => c.parentId === comment.id && c.type === type && c.contentId === id
      );
      return {
        ...comment,
        replies: replies.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Remove internal fields from response
  const cleanComments = comments.map(({ type: _, contentId: __, parentId: ___, ...comment }) => comment);

  return NextResponse.json({ comments: cleanComments });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, author, content } = body;

    if (!type || !id || !author || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic validation
    if (author.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: "Comment must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: "Comment is too long (max 1000 characters)" }, { status: 400 });
    }

    const comments = getComments();
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      type,
      contentId: id,
      replies: [],
      authorLiked: false,
    };

    comments.push(newComment);
    saveComments(comments);

    // Return comment without type/contentId for client
    const { type: _, contentId: __, ...commentResponse } = newComment;

    return NextResponse.json(commentResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

