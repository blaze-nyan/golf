// app/api/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

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

    const clientId = response.data.payload.Client_ID;
    if (clientId === 0) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({ clientId, success: true });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
