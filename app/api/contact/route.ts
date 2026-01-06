import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get contact email from environment variable
    const contactEmail = process.env.CONTACT_EMAIL || process.env.AUTHOR_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Log the submission (always log for debugging)
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Send email if Resend is configured
    if (resend && contactEmail) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: contactEmail,
          replyTo: email,
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This message was sent from the contact form on albertblibo.com
            </p>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the contact form on albertblibo.com
          `.trim(),
        });

        console.log("Contact form email sent successfully");
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error("Failed to send contact form email:", emailError);
        // In development, we'll still return success
        // In production, you might want to handle this differently
      }
    } else {
      // Warn if email is not configured
      if (!process.env.RESEND_API_KEY) {
        console.warn(
          "Contact form submission received but RESEND_API_KEY is not configured. " +
          "Email will not be sent. Set RESEND_API_KEY in your environment variables."
        );
      }
      if (!contactEmail) {
        console.warn(
          "Contact form submission received but CONTACT_EMAIL or AUTHOR_EMAIL is not configured. " +
          "Email will not be sent. Set CONTACT_EMAIL in your environment variables."
        );
      }
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

