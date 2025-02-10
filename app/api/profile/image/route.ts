// app/api/profile/image/route.ts
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
    const { Client_ID } = await request.json();

    // First, create/get image record
    const imageResponse = await axios.post(
      `${BASE_URL}/set_client_image_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Client ID": Client_ID,
          "Image ID": 0, // New image
          "Image UID": "", // Will get new UID
          Description: "Profile Picture",
          "Image Usage": 1, // Main profile
          "Record Marked Deleted": false,
        },
      },
      { headers }
    );

    // Get the Image UID from response
    const imageUID = imageResponse.data.payload["Image UID"];

    return NextResponse.json({
      success: true,
      imageUID: imageUID,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Image upload error:", error.response?.data || error);
    return NextResponse.json(
      { error: "Failed to set up image" },
      { status: 500 }
    );
  }
}
