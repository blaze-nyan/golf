/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/get-client-by-email/route.ts
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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Let's debug the response structure
    logger.log("Searching for email:", email);

    // First try to authenticate with this email to get clientId directly
    // This is a more direct approach than searching
    const authResponse = await axios.post(
      `${BASE_URL}/authenticate_user_request`,
      {
        hg_code: "ixschool",
        payload: {
          Email: email,
          // We don't have the password, but the API might tell us if the email exists
          Password: "dummy_password_for_check",
        },
      },
      { headers }
    );

    logger.log(
      "Auth response for email check:",
      JSON.stringify(authResponse.data, null, 2)
    );

    // If we get a client ID from the auth response, even with wrong password
    // it means the email exists in the system
    if (authResponse.data.payload && authResponse.data.payload["Client ID"]) {
      const clientId = authResponse.data.payload["Client ID"];

      // Now fetch client details
      const clientResponse = await axios.post(
        `${BASE_URL}/get_client_request`,
        {
          hg_code: "ixschool",
          payload: {
            "Client ID": clientId,
          },
        },
        { headers }
      );

      logger.log(
        "Client details:",
        JSON.stringify(clientResponse.data, null, 2)
      );

      if (clientResponse.data.payload) {
        return NextResponse.json({
          success: true,
          clientId: clientId,
          clientInfo: {
            firstName: clientResponse.data.payload["First Name"] || "",
            surname: clientResponse.data.payload["Surname"] || "",
          },
        });
      }
    }

    // If the above method doesn't work, we can try an alternative approach
    // by searching communications
    const commsResponse = await axios.post(
      `${BASE_URL}/search_client_communications_request`,
      {
        hg_code: "ixschool",
        payload: {
          "Search Communication Detail": email,
          "Communication Type": "M", // M for email communications
        },
      },
      { headers }
    );

    logger.log(
      "Comms search response:",
      JSON.stringify(commsResponse.data, null, 2)
    );

    // Check if we got any results from the communication search
    if (
      commsResponse.data.payload &&
      commsResponse.data.payload["Client Communications"] &&
      commsResponse.data.payload["Client Communications"].length > 0
    ) {
      // Find the communication with matching email
      const matchingComm = commsResponse.data.payload[
        "Client Communications"
      ].find(
        (comm: any) =>
          comm["Communication Detail"].toLowerCase() === email.toLowerCase()
      );

      if (matchingComm) {
        const clientId = matchingComm["Client ID"];

        // Fetch client details
        const clientResponse = await axios.post(
          `${BASE_URL}/get_client_request`,
          {
            hg_code: "ixschool",
            payload: {
              "Client ID": clientId,
            },
          },
          { headers }
        );

        if (clientResponse.data.payload) {
          return NextResponse.json({
            success: true,
            clientId: clientId,
            clientInfo: {
              firstName: clientResponse.data.payload["First Name"] || "",
              surname: clientResponse.data.payload["Surname"] || "",
            },
          });
        }
      }
    }

    // If we reach here, no matching client was found
    return NextResponse.json(
      { success: false, error: "No account found with this email" },
      { status: 404 }
    );
  } catch (error: any) {
    logger.error("Error finding client:", error.response?.data || error);
    return NextResponse.json(
      { success: false, error: "Error finding account" },
      { status: 500 }
    );
  }
}
