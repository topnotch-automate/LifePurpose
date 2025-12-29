import { NextRequest, NextResponse } from "next/server";
import { bookingIntakeSchema } from "@/lib/validation";
import { sendBookingConfirmation } from "@/lib/email";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = bookingIntakeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const intakeData = validationResult.data;

    // Store intake data (in production, save to database)
    // For now, we'll just log it and send confirmation
    console.log("Booking intake received:", {
      ...intakeData,
      timestamp: new Date().toISOString(),
    });

    // Send confirmation email
    const sessionTypes: Record<string, { type: string; duration: string }> = {
      "30": { type: "Clarity Session", duration: "30-minute" },
      "60": { type: "Coaching Session", duration: "60-minute" },
      "90": { type: "Deep Practice Session", duration: "90-minute" },
    };

    const sessionDetails = sessionTypes[intakeData.sessionType] || {
      type: "Session",
      duration: `${intakeData.sessionType}-minute`,
    };

    const emailResult = await sendBookingConfirmation(intakeData.email, sessionDetails);

    // Even if email fails, return success (intake was received)
    // In production, you'd want to handle this more carefully
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your booking request. We will confirm the details shortly.",
        intakeId: `intake-${Date.now()}`, // In production, use a real ID from database
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking intake error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

