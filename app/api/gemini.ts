import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAZjwBN81P1G0TVIvXUFvwdVKJctuuUFb0"; 
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function getAiResponse(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Hello! How can I assist you today?" }] },
      ],
    });

    const result = await chat.sendMessage(message);
    console.log("AI Response:", result.response.text()); // Debugging
    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI." });
  }
}
