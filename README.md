# My Own AI Bot

A simple chat bot with image generation, powered by Google's free-tier
Gemini API. You control its personality and rules — no coding required
beyond editing one text file.

## What's free here (read this first)

- **Google Gemini API** has a free tier (limited requests per day, no
  credit card needed to start). This project uses it for both chat and
  image generation.
- **Vercel** hosting is free for personal projects.
- "Free to use all the time" only works within Gemini's free-tier
  limits. If your bot gets heavy traffic, Google may rate-limit or ask
  for billing. There's no way around this — every AI chat app costs
  someone money to run per message; Gemini's free tier is just the
  most generous option that also does images.

## Step 1 — Get a free Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account.
3. Click "Create API key" and copy it somewhere safe.

## Step 2 — Put this project on GitHub

1. Create a free account at https://github.com if you don't have one.
2. Create a new repository (any name, e.g. `my-ai-bot`).
3. Upload every file in this folder to that repository (GitHub's
   website lets you drag-and-drop files with "Add file → Upload
   files").

## Step 3 — Deploy on Vercel

1. Go to https://vercel.com and sign in with your GitHub account.
2. Click "Add New → Project" and pick the repository you just created.
3. Before clicking Deploy, open "Environment Variables" and add:
   - Name: `GEMINI_API_KEY`
   - Value: (paste the key from Step 1)
4. Click Deploy. Wait about a minute — Vercel gives you a live URL
   like `my-ai-bot.vercel.app`. That's your bot, live, for anyone with
   the link.

## Step 4 — Set your bot's rules

Open `lib/guidelines.js` in GitHub (click the file, then the pencil
icon to edit). Change:

- `BOT_NAME` — what your bot calls itself.
- `SYSTEM_PROMPT` — the rules it always follows. Add your own lines in
  plain English, e.g. "Only talk about cooking" or "Always reply in
  Urdu."
- `WELCOME_MESSAGE` — the first thing users see.

Save the change (commit it) and Vercel will automatically redeploy
your bot with the new rules within a minute or two. You never touch
any other file for day-to-day changes.

## About restrictions

Google's Gemini API has two layers of filtering:

1. **Configurable filters** (harassment, hate speech, sexual content,
   dangerous content) — this project sets all of these to the most
   permissive option Google allows (`BLOCK_NONE`) in `lib/safety.js`.
   That means your own rules in `lib/guidelines.js` are effectively
   the only rules your bot follows for these categories.
2. **Non-configurable protections** — a small set of protections
   (mainly around child safety) that Google enforces on every app
   built on their API, with no setting anywhere that turns them off.
   This isn't specific to this project; it's true for every developer
   using Gemini, and it isn't something I can build around.

If you outgrow what Gemini's configurable filters allow, that's a
sign you need a different provider with its own (different) limits —
there's no version of "no restrictions at all" that any hosted AI API
offers.

## How it works (for your own understanding)

- `app/page.js` — the chat screen people see and type into.
- `app/api/chat/route.js` — sends the conversation to Gemini and gets
  a text reply back.
- `app/api/image/route.js` — sends a text prompt to Gemini's image
  model and gets a picture back.
- `lib/guidelines.js` — the only file you should need to edit.

Your API key is never visible to users; it lives only in Vercel's
environment variables and is used on the server side.

## Local testing (optional, needs Node.js installed)

```
npm install
npm run dev
```

Then open http://localhost:3000, after creating a `.env.local` file
with `GEMINI_API_KEY=your-key-here`.

## If something breaks

- "Missing GEMINI_API_KEY" — you forgot Step 3.3, or mistyped the
  variable name. It must be exactly `GEMINI_API_KEY`.
- Image generation errors — Gemini's image model name changes
  occasionally; check https://ai.google.dev/gemini-api/docs/models
  for the current image-capable model name and update `IMAGE_MODEL` in
  `app/api/image/route.js` if needed.
- Rate limit errors — you've hit the free tier's daily/per-minute
  cap; wait and try again, or add billing in Google AI Studio.
