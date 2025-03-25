// app/api/profile/image/binary/route.ts
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
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const imageUID = formData.get("imageUID");

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString("base64");
    const uint8Array = new Uint8Array(buffer);

    // Read 4 bytes at offset 20 (little-endian format)
    const binaryObjectSize =
      uint8Array[20] |
      (uint8Array[21] << 8) |
      (uint8Array[22] << 16) |
      (uint8Array[23] << 24);

    const response = await axios.post(
      `${BASE_URL}/set_binary_object_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Binary Object UID": imageUID,
          "Binary Object Data": base64String, // Send as base64
          "Binary Object Type ID": 2,
          "Binary Object Size": binaryObjectSize,
        },
      },
      { headers }
    );

    logger.log(response.data);

    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Binary upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image data" },
      { status: 500 }
    );
  }
}
