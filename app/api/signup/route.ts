// app/api/auth/signup/route.ts
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
    const userData = await request.json();

    const response = await axios.post(
      `${BASE_URL}/new_user_request`,
      {
        hg_code: "ixschool",
        payload: {
          Email: userData.email,
          Password: userData.password,
          "First Name": userData.firstName,
          Surname: userData.surname,
        },
      },
      { headers }
    );

    const clientId = response.data.payload.Client_ID;
    if (clientId === 0) {
      return NextResponse.json({ error: "Signup failed" }, { status: 400 });
    }

    return NextResponse.json({ clientId, success: true });
  } catch (error) {
    logger.error("Error in signup:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
