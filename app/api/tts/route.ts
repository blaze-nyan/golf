import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, languageCode } = (await req.json()) as {
      text?: string;
      languageCode?: string;
    };
    console.log("Received request:", { text, languageCode });

    if (!text || !languageCode) {
      return NextResponse.json(
        { error: "Text and languageCode are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    console.log("API Key:", apiKey ? "Loaded" : "Not loaded");
    if (!apiKey) {
      throw new Error("API key not configured in environment variables");
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const payload = {
      input: { text },
      voice: {
        languageCode,
        name:
          languageCode === "th-TH"
            ? "th-TH-Standard-A"
            : languageCode === "my-MM"
            ? "my-MM-Standard-A"
            : undefined,
      },
      audioConfig: { audioEncoding: "MP3" },
    };
    console.log("Payload to Google TTS:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google TTS API error: ${response.status} - ${errorText}`
      );
    }

    const data = (await response.json()) as { audioContent: string };
    return NextResponse.json(
      { audioContent: data.audioContent },
      { status: 200 }
    );
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: "Failed to synthesize speech" },
      { status: 500 }
    );
  }
}
