/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/signup/route.ts (replace your existing implementation)
import { NextResponse } from "next/server";
// import axios from "axios";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";

const BASE_URL = "https://ixschool.cimso.xyz";
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": "CiMSO.dev",
    "Client Password": "CiMSO.dev",
    hg_pass: "nGXUF1i^57I^ao^o",
  }),
  "Content-Type": "application/json",
};

// Store verification tokens temporarily (use a database in production)
export const verificationTokens = new Map<
  string,
  {
    email: string;
    expires: Date;
    userData: any;
  }
>();

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hour expiration

    // Store the user data along with the token
    verificationTokens.set(token, {
      email: userData.email,
      expires,
      userData,
    });

    // Get the base URL for verification link
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Send verification email
    const emailSent = await sendVerificationEmail(
      userData.email,
      token,
      baseUrl
    );

    if (!emailSent) {
      return NextResponse.json(
        {
          error: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
