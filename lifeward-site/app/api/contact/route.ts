import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Send email (with graceful fallback)
    const emailResult = await sendContactEmail(formData);

    if (!emailResult.success) {
      // If email service is not configured, still return success in development
      // but log the issue
      if (config.email.fallbackToConsole && !config.email.enabled) {
        console.warn("Email service not configured. Message logged to console.");
        return NextResponse.json(
          {
            success: true,
            message: "Thank you for your message. We will respond soon.",
            note: "Email service not configured - message logged to console",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          error: emailResult.error || "Failed to send message",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We will respond within 2-3 business days.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

