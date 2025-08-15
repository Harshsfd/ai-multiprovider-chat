import fetch from 'node-fetch';
import { toOpenAIMsgs } from './openai.js';

export async function callMistral({ model, messages, system, temperature, max_tokens }) {
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
