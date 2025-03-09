// app/api/profile/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { logger } from "@/app/lib/logger";
const BASE_URL = "https://ixschool.cimso.xyz";
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": "CiMSO.dev",
    "Client Password": "CiMSO.dev",
    hg_pass: "nGXUF1i^57I^ao^o",
  }),
  "Content-Type": "application/json",
};

export async function POST(request: Request) {
  try {
    // const { searchParams } = new URL(request.url);
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${BASE_URL}/get_client_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Client ID": parseInt(clientId), // Make sure we're sending as number
        },
      },
      { headers }
    );

    // Response will have the same structure as your Postman response

    logger.log(response.data);
    // It includes Title, First Name, Surname, Given Name, Company, Gender, etc.
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Profile fetch error:", error.response?.data || error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
