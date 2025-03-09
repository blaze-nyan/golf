/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/reset-password/route.ts
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
    const { clientId, password } = await request.json();

    // Validate inputs
    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Call the Reset User Request API
    const response = await axios.post(
      `${BASE_URL}/reset_user_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Client ID": parseInt(clientId),
          Password: password,
        },
      },
      { headers }
    );

    // Check for errors based on documentation
    const errorCode = response.data.error_code;

    if (errorCode === 0) {
      return NextResponse.json({ success: true });
    } else if (errorCode === -101) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    } else if (errorCode === -102) {
      return NextResponse.json(
        { success: false, error: "Password not specified" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to reset password" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error("Password reset error:", error.response?.data || error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
