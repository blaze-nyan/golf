// app/api/profile/image/route.ts
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
    const { Client_Info } = await request.json();
    const response = await axios.post(
      `${BASE_URL}/set_client_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Client ID": Client_Info["Client ID"],
          Title: Client_Info.Title,
          Gender: Client_Info.Gender,
          "First Name": Client_Info["First Name"],
          Surname: Client_Info.Surname,
          "Given Name": Client_Info["Given Name"],
          Company: Client_Info.Company,
          "Communication List": Client_Info["Communication List"],
        },
      },
      { headers }
    );
    logger.log(response);
    logger.log(Client_Info["Communication List"]);
    return NextResponse.json({
      success: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Image upload error:", error.response?.data || error);
    return NextResponse.json(
      { error: "Failed to set up image" },
      { status: 500 }
    );
  }
}
