/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/welcome-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logger } from "@/app/lib/logger";
// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    try {
      // Send welcome email using Resend
      const { data, error } = await resend.emails.send({
        from: "Splash Golf Club <welcome@splashgolfclub.site>",
        to: [email],
        subject: "Welcome to Splash Golf Club",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #0E793C; text-align: center;">Welcome to Splash Golf Club!</h2>
            <p style="text-align: center;">Hi ${name},</p>
            <p>We're thrilled to have you as part of our community! You’ve successfully registered with Splash Golf Club. Your account is now ready to explore all our features.</p>
            <p>If you have any questions or need help getting started, feel free to reach out to our support team at any time.</p>
            <p style="text-align: center;">We look forward to seeing you enjoy our services!</p>
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
              &copy; ${new Date().getFullYear()} Splash Golf Club. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        logger.error("Error sending welcome email:", error);
        return NextResponse.json(
          {
            error: "Failed to send welcome email",
            details: error.message,
          },
          { status: 500 }
        );
      }

      logger.log("Welcome email sent successfully, ID:", data?.id);
      return NextResponse.json({
        success: true,
        message: "Welcome email sent",
      });
    } catch (emailError: any) {
      logger.error("Email API error:", emailError);
      return NextResponse.json(
        {
          error: "Failed to send welcome email",
          details: emailError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error("Server error:", error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
