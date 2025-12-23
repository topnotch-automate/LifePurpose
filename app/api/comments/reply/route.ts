import { NextRequest, NextResponse } from "next/server";
import { storage, CommentRecord } from "@/lib/storage";
import { getAuthorDisplayName } from "@/lib/author";

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

    const allComments = await storage.getComments();
    
    // Find parent comment
    const parentComment = allComments.find((c) => c.id === commentId);
    if (!parentComment) {
      return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
    }

    // Create reply (stored flat with parentId, replies array is reconstructed in GET)
    const reply: CommentRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      type,
      contentId,
      parentId: commentId,
      authorLiked: false,
    };

    // Add reply to allComments array
    allComments.push(reply);
    await storage.saveComments(allComments);

    // Return reply without internal fields
    const { type: _, contentId: __, parentId: ___, ...replyResponse } = reply;

    return NextResponse.json(replyResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}

