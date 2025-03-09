/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/check-email-exists/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { logger } from "@/app/lib/logger";
const BASE_URL = process.env.NEXT_PUBLIC_CIMSO_BASE_URL;
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": process.env.NEXT_PUBLIC_CIMSO_CLIENT_LOGIN_ID,
    "Client Password": process.env.NEXT_PUBLIC_CIMSO_CLIENT_PASSWORD,
    hg_pass: process.env.NEXT_PUBLIC_CIMSO_HG_PASS,
  }),
  "Content-Type": "application/json",
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Try to authenticate with the email (without a password)
    // This helps determine if the email exists in the system
    const authResponse = await axios.post(
      `${BASE_URL}/authenticate_user_request`,
      {
        hg_code: "ixschool",
        payload: {
          Email: email,
          Password: "dummy_password_for_check", // Using a dummy password
        },
      },
      { headers }
    );

    // Check if the response indicates the email exists
    // Error code -104 usually means "Invalid password" which confirms email exists
    // Error code -101 usually means "Email not found"
    const errorCode = authResponse.data.error_code;

    if (errorCode === -104) {
      // Email exists but wrong password (expected)
      return NextResponse.json({ exists: true });
    } else if (errorCode === -101) {
      // Email doesn't exist
      return NextResponse.json({ exists: false });
    } else if (
      authResponse.data.payload &&
      authResponse.data.payload["Client ID"]
    ) {
      // If we somehow got a valid login response, email definitely exists
      return NextResponse.json({ exists: true });
    }

    // Alternative method - search communications for this email
    const commsResponse = await axios.post(
      `${BASE_URL}/search_client_communications_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Search Communication Detail": email,
          "Communication Type": "M", // M for email communications
        },
      },
      { headers }
    );

    // If there are any communications with this email, it exists
    if (
      commsResponse.data.payload &&
      commsResponse.data.payload["Client Communications"] &&
      commsResponse.data.payload["Client Communications"].length > 0
    ) {
      // Find the communication with exact matching email
      const matchingComm = commsResponse.data.payload[
        "Client Communications"
      ].find(
        (comm: any) =>
          comm["Communication Detail"].toLowerCase() === email.toLowerCase()
      );

      if (matchingComm) {
        return NextResponse.json({ exists: true });
      }
    }

    // If we reach here, no matching client was found
    return NextResponse.json({ exists: false });
  } catch (error: any) {
    logger.error("Error checking email:", error.response?.data || error);
    return NextResponse.json(
      { error: "Error checking email" },
      { status: 500 }
    );
  }
}
