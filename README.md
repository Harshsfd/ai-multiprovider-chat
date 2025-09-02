# ⚡ Multi-Provider AI Chat – Multi-Bot Fawn

<p align="center">
  <a href="https://multi-bot-fawn.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-00C7B7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/Harshsfd/multi-bot-fawn" target="_blank">
    <img src="https://img.shields.io/badge/Source-Code-181717?style=for-the-badge&logo=github" alt="GitHub Repo" />
  </a>
</p>

🌐 **Live App:** [multi-bot-fawn.vercel.app](https://multi-bot-fawn.vercel.app/)

💬 Chat with **OpenAI**, **Groq**, **Anthropic**, **Gemini**, **Mistral**, and **xAI** through a **single unified endpoint** – `/api/chat`.
🔐 API keys stay safe on the **server via `.env`**, never exposed in the browser.

---

## ✨ Features

✅ **Unified Chat Interface** – Pick a provider & model, start chatting instantly.
🔒 **API Key Security** – No keys in browser/localStorage, only `.env`.
⚡ **Minimal Backend** – Simple **Express + fetch**, no heavy SDKs.
☁️ **Deploy Anywhere** – Works locally & deploys easily on **Vercel**.
🛠️ **Extensible** – Add new AI providers with a few lines of code.

---

## 🚀 Quick Start (Local)

```bash
# Clone and install
git clone https://github.com/Harshsfd/multi-bot-fawn.git
cd multi-bot-fawn
npm install

# Setup environment
cp .env.example .env
# Add your API keys (OPENAI_API_KEY, GROQ_API_KEY, etc.)

# Start server
npm run dev

# Open app
http://localhost:3000
```

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import into [Vercel](https://vercel.com).
3. Add **Environment Variables** in Project → Settings → Environment Variables:

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

4. Deploy → 🎉 You’re live!

---

## 🔐 Security Notes

⚠️ Never put keys in frontend code or `localStorage`.
⚠️ Always use `.env` for server-only storage.
⚠️ Restrict origins in production via `CORS_ORIGIN`.

---

## 📡 Message Format

**Frontend → Request:**

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

**Server → Response:**

```json
{
  "provider": "groq",
  "model": "llama-3.1-70b-versatile",
  "text": "Hi!"
}
```

---

## 🧩 Adding More Providers

1. Create a new function:

```js
async function callFoo(payload) {
  // logic to call Foo AI
  return { text: "Hello from Foo AI" };
}
```

2. Register inside `routeMap` in `server.js`:

```js
const routeMap = {
  foo: callFoo,
  openai: callOpenAI,
  groq: callGroq,
  // ...others
};
```

---

## 📌 Default Model Suggestions

| 🌐 Provider   | ⚡ Default Model              |
| ------------- | ---------------------------- |
| 🤖 OpenAI     | `gpt-4o-mini`                |
| 🦙 Groq       | `llama-3.1-70b-versatile`    |
| 🧠 Anthropic  | `claude-3-5-sonnet-20240620` |
| 🔮 Gemini     | `gemini-1.5-pro`             |
| 🌊 Mistral    | `mistral-large-latest`       |
| 🚀 xAI (Grok) | `grok-2-latest`              |

*(Defaults can be changed in `public/app.js`)*

---

## 👨‍💻 Author

**Harsh Bhardwaj**

📧 [harshbhardwajsfd@gmail.com](mailto:harshbhardwajsfd@gmail.com)
💻 GitHub: [@Harshsfd](https://github.com/Harshsfd)
🔗 LinkedIn: [Harsh Bhardwaj](https://linkedin.com/in/harshbhardwaj)

---

⭐ If you like this project, don’t forget to **star the repo** & try the [Live Demo](https://multi-bot-fawn.vercel.app/)!

---
