import { SYSTEM_PROMPT } from "../../../lib/guidelines";
import { SAFETY_SETTINGS } from "../../../lib/safety";

// This route talks to Google's Gemini API (it has a free tier).
// The key is read from an environment variable, never hard-coded.
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash"; // fast + free-tier friendly

export async function POST(req) {
  try {
    if (!API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY. Add it in your Vercel project settings." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    // messages: [{ role: "user" | "assistant", content: "..." }, ...]

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data?.error?.message || "Something went wrong calling Gemini." },
        { status: res.status }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Sorry, I couldn't generate a response.";

    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
