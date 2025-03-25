// app/api/profile/route.ts
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

// interface AxiosResponse<T = any> {
//   data: T;
//   status: number;
//   statusText: string;
//   headers: any;
//   config: any;
//   request?: any;
// }

export async function GET() {
  try {
    const response = await axios.post(
      `${BASE_URL}/get_golf_courses_request`,
      {
        hg_code: "ixschool",
        payload: {},
      },
      { headers }
    );

    // Response will have the same structure as your Postman response
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
