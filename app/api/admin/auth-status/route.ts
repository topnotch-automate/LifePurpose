import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

/**
 * GET /api/admin/auth-status
 * Check if user is authenticated as admin (for client-side checks)
 */
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error("Auth status check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

