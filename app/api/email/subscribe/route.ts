import { NextRequest, NextResponse } from "next/server";

// This is a basic implementation
// Later, integrate with ConvertKit, Buttondown, Resend, or your email provider

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, bookSlug, bookTitle } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email provider
    // Example with ConvertKit:
    // const response = await fetch(
    //   `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       api_key: process.env.CONVERTKIT_API_KEY,
    //       email,
    //       tags: [bookSlug], // Tag subscribers by book
    //     }),
    //   }
    // );

    // For now, just log the subscription
    // In production, you should:
    // 1. Store in your database
    // 2. Send to email provider
    // 3. Send welcome email with free resource
    console.log("Email subscription:", {
      email,
      bookSlug,
      bookTitle,
      timestamp: new Date().toISOString(),
    });

    // Simulate success
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing. You will receive the companion reflection shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}

