import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

// Import all providers
import { callOpenAI } from './providers/openai.js';
import { callGroq } from './providers/groq.js';
import { callMistral } from './providers/mistral.js';
import { callAnthropic } from './providers/anthropic.js';
import { callGemini } from './providers/gemini.js';
import { callXAI } from './providers/xai.js';

dotenv.config();
const app = express();

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.static('public'));

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Chat endpoint
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

// Server listen / Vercel export
const port = process.env.PORT || 3000;
if (process.env.VERCEL) {
  export default app;
} else {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
