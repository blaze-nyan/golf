// app/api/verify/route.ts (new file)
import { NextResponse } from "next/server";
import axios from "axios";
import { verificationTokens } from "@/app/api/signup/route";

const BASE_URL = "https://ixschool.cimso.xyz";
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": "CiMSO.dev",
    "Client Password": "CiMSO.dev",
    hg_pass: "nGXUF1i^57I^ao^o",
  }),
  "Content-Type": "application/json",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Get the token data
    const tokenData = verificationTokens.get(token);

    if (!tokenData) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (new Date() > tokenData.expires) {
      verificationTokens.delete(token);
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Create the user now that email is verified
    const response = await axios.post(
      `${BASE_URL}/new_user_request`,
      {
        hg_code: "ixschool",
        payload: {
          Email: tokenData.userData.email,
          Password: tokenData.userData.password,
          "First Name": tokenData.userData.firstName,
          Surname: tokenData.userData.surname,
        },
      },
      { headers }
    );

    const clientId = response.data.payload.Client_ID;
    if (clientId === 0) {
      return NextResponse.json(
        { error: "Account creation failed" },
        { status: 400 }
      );
    }

    // Clean up the token
    verificationTokens.delete(token);

    return NextResponse.json({ clientId, success: true });
  } catch (error) {
    console.error("Error in verification:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
