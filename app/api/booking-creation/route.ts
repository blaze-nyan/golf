/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/welcome-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logger } from "@/app/lib/logger";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, bookingData } = await request.json();

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
        from: "Splash Golf Club <booking@splashgolfclub.site>",
        to: [email],
        subject: "Thank you for Booking At Splash Golf Club",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #0E793C; text-align: center;">${bookingData.courseName} Golf Course Booking Confirmation</h2>
            <p style="text-align: center;">Thank you for your booking with Splash Golf Club! Below are the details of your reservation:</p>

            <table style="width: 100%; margin-top: 20px;">
              <tr>
                <td><strong>Course Name:</strong></td>
                <td>${bookingData.courseName}</td>
              </tr>
              <tr>
                <td><strong>Location:</strong></td>
                <td>${bookingData.courseLocation}</td>
              </tr>
              <tr>
                <td><strong>Booking Type:</strong></td>
                <td>${bookingData.bookingType === 1 ? '9 Hole' : '18 Hole'}</td>
              </tr>
              <tr>
                <td><strong>Date:</strong></td>
                <td>${new Date(( bookingData.teeDate - 25569) * 86400 * 1000).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td><strong>Time:</strong></td>
                <td>${`${((h => h > 12 ? h - 12 : h === 0 ? 12 : h)(Math.floor(bookingData.teeTime / 60)))}:${(bookingData.teeTime % 60).toString().padStart(2, "0")} ${Math.floor(bookingData.teeTime / 60) >= 12 ? "PM" : "AM"}`}</td>
              </tr>
              <tr>
                <td><strong>Number of Golfers:</strong></td>
                <td>${bookingData.numberOfGolfers}</td>
              </tr>
              <tr>
                <td><strong>Number of Non-Players:</strong></td>
                <td>${bookingData.numberOfnonPlayers}</td>
              </tr>
              <tr>
                <td><strong>Golf Cart:</strong></td>
                <td>${bookingData["Golf Cart"]}</td>
              </tr>
              <tr>
                <td><strong>Caddies:</strong></td>
                <td>${bookingData["Caddies"]}</td>
              </tr>
              <tr>
                <td><strong>Food & Drinks:</strong></td>
                <td>${bookingData["Food & Drinks"]}</td>
              </tr>
              <tr>
                <td><strong>Total Price:</strong></td>
                <td>${bookingData.price} THB </td>
              </tr>
              <tr>
                <td><strong>Paid:</strong></td>
                <td>${bookingData.paid} THB </td>
              </tr>
            </table>

            <p style="margin-top: 20px;">If you have any questions or need to make changes to your booking, please feel free to contact us.</p>

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
