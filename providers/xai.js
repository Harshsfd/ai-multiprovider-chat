import fetch from 'node-fetch';
import { toOpenAIMsgs } from './openai.js';

export async function callXAI({ model, messages, system, temperature, max_tokens }) {
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

