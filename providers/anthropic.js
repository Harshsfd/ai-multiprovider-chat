import fetch from 'node-fetch';

export async function callAnthropic({ model, messages, system, temperature, max_tokens }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const systemMsg = system ? [{ type: 'text', text: system }] : undefined;
  const input = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: [{ type: 'text', text: m.content }]
  }));

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
