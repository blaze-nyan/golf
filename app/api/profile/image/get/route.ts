/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/profile/image/get/route.ts
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

    const response = await axios.post(
      `${BASE_URL}/get_clients_images_request`, // Updated endpoint
      {
        hg_code: "ixschool",
        payload: {
          "Client IDs": [Client_ID], // Send as array as per documentation
        },
      },
      { headers }
    );

    // Process the response according to the structure

    const clientImages = response.data.payload["Clients Images"];
    if (clientImages && clientImages.length > 0) {
      const clientImageInfo = clientImages[0]; // Get first client's images
      const mainProfileImage = clientImageInfo.Images.slice()
        .reverse()
        .find(
          (img: any) =>
            img["Image Usage"] === 1 && img["Record Marked Deleted"] === false
        );

      if (mainProfileImage) {
        const response = await axios.post(
          `${BASE_URL}/binary_object_request`, // Updated endpoint
          {
            hg_code: "ixschool",
            payload: {
              "Object Unique ID": mainProfileImage["Image UID"],
            },
          },
          { headers }
        );
        const clientImageBinary = response.data;
        return NextResponse.json({
          success: true,
          imageInfo: clientImageBinary,
        });
      }

      return NextResponse.json({
        success: true,
        imageInfo: mainProfileImage,
      });
    }

    return NextResponse.json({ success: true, imageInfo: null });
  } catch (error: any) {
    console.error(
      "Error getting client images:",
      error.response?.data || error
    );
    return NextResponse.json(
      { error: "Failed to get profile image" },
      { status: 500 }
    );
  }
}
