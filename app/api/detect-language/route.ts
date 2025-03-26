// app/api/detect-language/route.ts
import type { NextRequest } from "next/server";
import { franc } from "franc";

interface LanguageResponse {
  language: string;
}

interface ErrorResponse {
  error: string;
}

const languageMap: Record<string, string> = {
  eng: "en-US",
  tha: "th-TH",
  spa: "es-ES",
  fra: "fr-FR",
  deu: "de-DE",
  ita: "it-IT",
  por: "pt-PT",
  jpn: "ja-JP",
  zho: "zh-CN",
  kor: "ko-KR",
  rus: "ru-RU",
  ara: "ar-SA",
  hin: "hi-IN",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Request received:", req.method, body);

  const { text } = body as { text?: string };
  console.log("Request body text:", text);

  if (!text) {
    console.error("Text is required but not provided");
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const langCode = franc(text);
    console.log("Detected language code:", langCode);
    const language = languageMap[langCode] || "en-US";
    console.log("Mapped language:", language);
    return new Response(JSON.stringify({ language }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in language detection:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}