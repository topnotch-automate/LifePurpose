import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

/**
 * GET /api/admin/check
 * Check if user is authenticated as admin
 * @deprecated Use /api/admin/auth-status instead
 */
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

