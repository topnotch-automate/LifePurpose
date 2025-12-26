import { NextRequest, NextResponse } from "next/server";
import { storage, CommentRecord } from "@/lib/storage";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for author likes
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, contentId, commentId } = body;

    if (!type || !contentId || !commentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const allComments = await storage.getComments();

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

    await storage.saveComments(updatedComments);

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

