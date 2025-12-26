import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { storage, CommentRecord } from "@/lib/storage";

/**
 * GET /api/admin/comments
 * Get all comments (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allComments = await storage.getComments();
    return NextResponse.json({ comments: allComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/comments
 * Delete a comment (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const allComments = await storage.getComments();
    
    // Filter out the comment to delete and all its replies
    const filteredComments = allComments.filter(
      (comment) => comment.id !== commentId && comment.parentId !== commentId
    );

    await storage.saveComments(filteredComments);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}

