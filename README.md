# ⚡ Multi‑Provider AI Chat (OpenAI, Groq, Anthropic, Gemini, Mistral, xAI)

A minimal full‑stack chat UI with a single `/api/chat` endpoint that forwards your request to different AI providers. Keeps API keys safe on the server via `.env`.

## ✨ Features
- One clean UI, many providers
- Simple Express server with `fetch` (no heavy SDKs)
- Works locally and on Vercel

## 🚀 Quick Start (Local)
```bash
npm i
cp .env.example .env
# Paste the keys you want to use
npm run dev
# open http://localhost:3000
```

## ☁️ Deploy to Vercel
- Push this repo to GitHub
- Import into Vercel
- Add environment variables in Vercel → Project Settings → Environment Variables:
  - `OPENAI_API_KEY`, `GROQ_API_KEY`, `ANTHROPIC_API_KEY`, `MISTRAL_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`
  - Optional: `CORS_ORIGIN`, `PORT`
- Deploy

## 🔐 Security Notes
- Do **not** put keys in frontend code or localStorage. This server reads keys from environment variables only.
- Limit origins with `CORS_ORIGIN` in production.

## 🧠 Message Format
Frontend sends:
```json
{
  "provider": "groq",
  "model": "llama-3.1-70b-versatile",
  "system": "You are helpful",
  "temperature": 0.7,
  "max_tokens": 1024,
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

Server returns:
```json
{ "provider": "groq", "model": "llama-3.1-70b-versatile", "text": "Hi!" }
```

## 🧩 Add More Providers
Add a new function like `callFoo()` and register it in `routeMap` inside `server.js`.

## 📌 Tip: Model Names
Defaults are set in `public/app.js`. You can change them anytime.
```
- OpenAI: gpt-4o-mini
- Groq: llama-3.1-70b-versatile
- Anthropic: claude-3-5-sonnet-20240620
- Gemini: gemini-1.5-pro
- Mistral: mistral-large-latest
- xAI: grok-2-latest
```
