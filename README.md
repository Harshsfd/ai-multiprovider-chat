# ⚡ Multi-Provider AI Chat

Chat with **OpenAI, Groq, Anthropic, Gemini, Mistral, and xAI** – all from a single, minimal UI.

🔗 **Live Demo:** 👉 [Multi-Bot](https://multi-bot-fawn.vercel.app/)

---

## ✨ Features

* 🌐 **One Clean UI** – chat with multiple AI providers in one place
* ⚡ **Lightweight Server** – Express + `fetch` (no heavy SDKs)
* 🔐 **Secure** – API keys stored safely in `.env` (never exposed to frontend)
* 🚀 **Deploy Anywhere** – works locally and on Vercel
* 🛠 **Extensible** – add more providers easily via `server.js`

---

## 🚀 Quick Start (Local)

```bash
# Clone the repo
git clone https://github.com/yourusername/multi-provider-ai-chat.git
cd multi-provider-ai-chat

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your API keys in .env

# Start development server
npm run dev
# Open http://localhost:3000
```

---

## ☁️ Deploy on Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variables in **Vercel → Project Settings → Environment Variables**:

   * `OPENAI_API_KEY`
   * `GROQ_API_KEY`
   * `ANTHROPIC_API_KEY`
   * `MISTRAL_API_KEY`
   * `GEMINI_API_KEY`
   * `XAI_API_KEY`
   * Optional: `CORS_ORIGIN`, `PORT`
4. Click **Deploy**

---

## 🔐 Security Notes

* 🚫 **Never** store API keys in frontend code or localStorage
* ✅ All keys are read from `.env` only
* 🌍 Use `CORS_ORIGIN` to restrict origins in production

---

## 🧠 Message Format

**Request:**

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

**Response:**

```json
{
  "provider": "groq",
  "model": "llama-3.1-70b-versatile",
  "text": "Hi!"
}
```

---

## 🧩 Add More Providers

1. Add a new function like `callFoo()`
2. Register it in `routeMap` inside `server.js`
3. Update frontend dropdowns in `public/app.js` if needed

---

## 📌 Default Models

| Provider  | Default Model              |
| --------- | -------------------------- |
| OpenAI    | gpt-4o-mini                |
| Groq      | llama-3.1-70b-versatile    |
| Anthropic | claude-3-5-sonnet-20240620 |
| Gemini    | gemini-1.5-pro             |
| Mistral   | mistral-large-latest       |
| xAI       | grok-2-latest              |

---

## 👨‍💻 Author

Made with ❤️ by **Harsh Bhardwaj**

* 🌍 [Portfolio](https://harshbhardwaj-portfolio.vercel.app/)
* 🐙 [GitHub](https://github.com/in/harshsfd/)
* 💼 [LinkedIn](https://linkedin.com/in/harshsfd/)

---

