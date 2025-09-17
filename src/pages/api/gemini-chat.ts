import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-1.5-flash"; // fast; switch to gemini-1.5-pro for higher quality

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { messages, systemPrompt } = (req.body || {}) as {
      messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      systemPrompt?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: MODEL });

    const historyText = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    const prompt = `${systemPrompt ?? "You are a helpful teaching assistant for GraamGyaan."}\n\n${historyText}\nASSISTANT:`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ text });
  } catch (err: any) {
    console.error("Gemini error:", err?.message || err);
    return res.status(500).json({ error: "Gemini request failed" });
  }
}
