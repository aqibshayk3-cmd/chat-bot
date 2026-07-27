// ============================================================
// This sets Gemini's *configurable* content filters to the most
// permissive level Google allows ("BLOCK_NONE"), for each category
// they let developers turn down. That means your rules in
// guidelines.js become the main thing shaping what the bot will and
// won't do — not Google's default filtering.
//
// Important: this does NOT disable Google's small set of hard-coded,
// non-configurable protections (mainly around child safety), which
// apply to every app built on their API and cannot be turned off by
// anyone, including Google's own products. That's not a setting in
// this file — it happens on Google's servers regardless.
// ============================================================

export const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];
