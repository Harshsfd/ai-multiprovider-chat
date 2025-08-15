import fetch from 'node-fetch';

export async function callGemini({ model, messages, system, temperature, max_tokens }) {
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
