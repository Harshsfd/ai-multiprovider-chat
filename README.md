# ⚡ Multi-Provider AI Chat – Multi-Bot Fawn

<p align="center">
  <a href="https://multi-bot-fawn.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-View%20App-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/Harshsfd/your-repo-name" target="_blank">
    <img src="https://img.shields.io/badge/Source-Code-GitHub-black?style=for-the-badge&logo=github" alt="GitHub Repo" />
  </a>
</p>

**Live link of the app:** [ multi-bot-fawn.vercel.app ](https://multi-bot-fawn.vercel.app/) ([Multi-Provider AI Chat][1])

A sleek, lightweight full-stack chat UI that lets you **chat with multiple AI providers**—including OpenAI, Groq, Anthropic, Gemini, Mistral, and xAI—through a unified `/api/chat` endpoint, keeping all API keys safe on the server via `.env`.

---

## Features

* **Unified Chat Interface** — Choose provider & model, then chat.
* **API Key Security** — Keys are securely stored on the server; no exposure in browser.
  *Note: Providers are disabled until you configure keys via `.env`* ([Multi-Provider AI Chat][1])
* **Minimalist Backend** — Lightweight Express server using native `fetch` (no heavy SDKs).
* **Ready for Local or Vercel Deployment** — Simple local setup and zero-config Vercel deployment.
* **Future-Proof Extensibility** — Easily add more providers by creating new functions and mapping them in `server.js`.

---

## Quick Start (Local)

```bash
# Clone and install
git clone https://github.com/Harshsfd/your-repo-name.git
cd your-repo-name
npm install

# Set up API keys
cp .env.example .env
# Populate .env with your provider keys: OPENAI_API_KEY, GROQ_API_KEY, etc.

# Launch the dev server
npm run dev

# Open in your browser
http://localhost:3000
```

---

## Deploy to Vercel

1. Push your repository to GitHub.
2. Import into [Vercel](https://vercel.com) via the dashboard.
3. Add environment variables in **Project Settings → Environment Variables**, such as:

```
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
ANTHROPIC_API_KEY=your_anthropic_key
MISTRAL_API_KEY=your_mistral_key
GEMINI_API_KEY=your_gemini_key
XAI_API_KEY=your_xai_key
CORS_ORIGIN=https://your-domain.vercel.app (optional)
PORT=5000 (optional)
```

4. Deploy and you're live!  Ready to chat with any configured provider.

---

## Security Tips

* Never expose API keys in frontend code or `localStorage`.
* Use `.env` to store keys securely server-side.
* In production, restrict origins via `CORS_ORIGIN` to enhance security.

---

## Message Format

**Request (from frontend):**

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

**Response (from server):**

```json
{
  "provider": "groq",
  "model": "llama-3.1-70b-versatile",
  "text": "Hi!"
}
```

---

## Adding More Providers

1. Write a new function, say:

   ```js
   async function callFoo(payload) {
     // logic to call Foo AI
     return { text: "Hello from Foo AI" };
   }
   ```
2. Register it in `routeMap` inside `server.js`:

   ```js
   const routeMap = {
     foo: callFoo,
     openai: callOpenAI,
     groq: callGroq,
     // ...others
   };
   ```

---

## Default Model Suggestions

| Provider   | Default Model                |
| ---------- | ---------------------------- |
| OpenAI     | `gpt-4o-mini`                |
| Groq       | `llama-3.1-70b-versatile`    |
| Anthropic  | `claude-3-5-sonnet-20240620` |
| Gemini     | `gemini-1.5-pro`             |
| Mistral    | `mistral-large-latest`       |
| xAI (Grok) | `grok-2-latest`              |

*(Defaults configurable in `public/app.js`.)*

---

## Author

**Harsh Bhardwaj**

* Email: [harshbhardwajsfd@gmail.com](mailto:harshbhardwajsfd@gmail.com)
* GitHub: [@Harshsfd](https://github.com/Harshsfd)
* LinkedIn: [Harsh Bhardwaj](https://linkedin.com/in/harshbhardwaj)

---
