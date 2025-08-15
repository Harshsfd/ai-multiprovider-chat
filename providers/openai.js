import fetch from 'node-fetch';

export function toOpenAIMsgs(messages, system) {
  const out = [];
  if (system) out.push({ role: 'system', content: system });
  for (const m of messages) out.push({ role: m.role, content: m.content });
  return out;
}

export async function callOpenAI({ model, messages, system, temperature, max_tokens }) {
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
