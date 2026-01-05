import { NextRequest, NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await destroyAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

