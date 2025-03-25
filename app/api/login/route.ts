// app/api/login/route.ts
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
    const userData = await request.json();
    logger.log("Sending login request with:", {
      email: userData.email,
      headers: headers,
    });

    const response = await axios.post(
      `${BASE_URL}/authenticate_user_request`,
      {
        hg_code: "ixschool",
        payload: {
          Email: userData.email,
          Password: userData.password,
        },
      },
      { headers }
    );
    logger.log("Login response:", response.data);
    // In app/api/login/route.ts
    logger.log("Full API response:", JSON.stringify(response.data, null, 2));
    logger.log("Authentication result:", response.data.payload);

    // Check the response structure and get Client ID
    const clientId = response.data.payload["Client ID"];
    const errorCode = response.data["error_code"];

    if (!clientId || clientId === 0) {
      return NextResponse.json(
        { error: "Make sure your password and emails are correct." },
        { status: 401 }
      );
    }

    if (errorCode !== 0) {
      return NextResponse.json(
        { error: "Make sure your password and emails are correct." },
        { status: 401 }
      );
    }

    // Now we're using the clientId in the response
    return NextResponse.json({
      success: true,
      clientId, // Include the clientId in the response
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Login error:", error.response?.data || error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
