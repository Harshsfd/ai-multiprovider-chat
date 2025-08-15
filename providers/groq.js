import fetch from 'node-fetch';
import { toOpenAIMsgs } from './openai.js';

export async function callGroq({ model, messages, system, temperature, max_tokens }) {
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
