/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logger } from "@/app/lib/logger";
// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Store OTPs temporarily (in production, use a database)
const otpStore: Record<string, { otp: string; expires: number }> = {};

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate OTP and store it with expiration (15 minutes)
    const otp = generateOTP();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    otpStore[email] = { otp, expires: expiresAt };

    // Log OTP in development for easier testing
    if (process.env.NODE_ENV === "development") {
      logger.log(`🔐 VERIFICATION CODE for ${email}: ${otp}`);
    }

    try {
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: "Splash Golf Club <verify@splashgolfclub.site>", // Use your verified domain
        to: [email],
        subject: "Verify Your Email - Splash Golf Club",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #0E793C; text-align: center;">Splash Golf Club</h2>
            <h3 style="text-align: center;">Email Verification</h3>
            <p>Thank you for registering with Splash Golf Club. To complete your registration, please use the following verification code:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
              &copy; ${new Date().getFullYear()} Splash Golf Club. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        logger.error("Email sending error:", error);
        return NextResponse.json(
          {
            error: "Failed to send verification email",
            details: error.message,
          },
          { status: 500 }
        );
      }

      logger.log("Email sent successfully, ID:", data?.id);
      return NextResponse.json({
        success: true,
        message: "Verification code sent",
        // Include OTP in development mode for easier testing
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    } catch (emailError: any) {
      logger.error("Email API error:", emailError);
      return NextResponse.json(
        {
          error: "Failed to send verification email",
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

export async function PUT(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Check if OTP exists and is valid
    const otpData = otpStore[email];
    if (!otpData) {
      return NextResponse.json(
        { error: "No verification code found for this email" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expires) {
      delete otpStore[email]; // Clean up expired OTP
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // If we get here, OTP is valid
    delete otpStore[email]; // Clean up used OTP

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    logger.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
