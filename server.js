import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.static('public'));

// Health
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Core chat endpoint (non-streaming for simplicity)
app.post('/api/chat', async (req, res) => {
  try {
    const { provider, model, messages, system, temperature = 0.7, max_tokens = 1024 } = req.body || {};
    if (!provider || !model || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'provider, model, messages are required' });
    }

    const routeMap = {
      openai: callOpenAI,
      groq: callGroq,
      mistral: callMistral,
      anthropic: callAnthropic,
      gemini: callGemini,
      xai: callXAI
    };

    const fn = routeMap[provider];
    if (!fn) return res.status(400).json({ error: `Unsupported provider: ${provider}` });

    const result = await fn({ model, messages, system, temperature, max_tokens });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// —— Provider Implementations —— //

function toOpenAIMsgs(messages, system) {
  const out = [];
  if (system) out.push({ role: 'system', content: system });
  for (const m of messages) out.push({ role: m.role, content: m.content });
  return out;
}

async function callOpenAI({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: toOpenAIMsgs(messages, system),
      temperature,
      max_tokens
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'OpenAI error');
  return { provider: 'openai', model, text: j.choices?.[0]?.message?.content || '' };
}

async function callGroq({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: toOpenAIMsgs(messages, system),
      temperature,
      max_tokens
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Groq error');
  return { provider: 'groq', model, text: j.choices?.[0]?.message?.content || '' };
}

async function callMistral({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('Missing MISTRAL_API_KEY');
  const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: toOpenAIMsgs(messages, system),
      temperature,
      max_tokens
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Mistral error');
  return { provider: 'mistral', model, text: j.choices?.[0]?.message?.content || '' };
}

async function callAnthropic({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const systemMsg = system ? [{ type: 'text', text: system }] : undefined;
  const input = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: [{ type: 'text', text: m.content }] }));

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model,
      max_tokens,
      temperature,
      messages: input,
      system: systemMsg ? system : undefined
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Anthropic error');
  const text = j.content?.[0]?.text || '';
  return { provider: 'anthropic', model, text };
}

async function callGemini({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  const parts = [];
  if (system) parts.push({ text: `SYSTEM: ${system}` });
  for (const m of messages) parts.push({ text: `${m.role.toUpperCase()}: ${m.content}` });

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature, maxOutputTokens: max_tokens }
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Gemini error');
  const text = j.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  return { provider: 'gemini', model, text };
}

async function callXAI({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('Missing XAI_API_KEY');
  const r = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: toOpenAIMsgs(messages, system),
      temperature,
      max_tokens
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'xAI error');
  return { provider: 'xai', model, text: j.choices?.[0]?.message?.content || '' };
}

const port = process.env.PORT || 3000;
if (process.env.VERCEL) {
  // Export for Vercel serverless
  export default app;
} else {
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
                             }
