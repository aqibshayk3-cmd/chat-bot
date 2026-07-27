import { SAFETY_SETTINGS } from "../../../lib/safety";

const API_KEY = process.env.GEMINI_API_KEY;
const IMAGE_MODEL = "gemini-2.5-flash-image";

export async function POST(req) {
  try {
    if (!API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY. Add it in your Vercel project settings." },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data?.error?.message || "Something went wrong generating the image." },
        { status: res.status }
      );
    }

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return Response.json({ error: "No image was returned. Try a different prompt." }, { status: 500 });
    }

    const base64 = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/png";

    return Response.json({ image: `data:${mimeType};base64,${base64}` });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
