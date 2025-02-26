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
    const requestData = await request.json();
    console.log("Sending golf request with:", {
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
    console.log("Login response:", response.data);

    const availabilities = response.data.payload["Golf Course Availabilities"];

    return NextResponse.json({
      success: true,
      availabilities,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
