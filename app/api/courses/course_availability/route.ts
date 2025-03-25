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
    const requestData = await request.json();
    logger.log("Sending golf request with:", {
      Day: Number(requestData.Day),
      "Golf Course ID": Number(requestData["Golf Course ID"]),
      headers: headers,
    });

    const response = await axios.post(
      `${BASE_URL}/get_golf_course_availability_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Golf Course ID": Number(requestData["Golf Course ID"]),
          Day: Number(requestData.Day),
        },
      },
      { headers }
    );
    logger.log("Login response:", response.data);

    const availabilities = response.data.payload["Golf Course Availabilities"];

    return NextResponse.json({
      success: true,
      availabilities,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Login error:", error.response?.data || error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
