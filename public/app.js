const $ = sel => document.querySelector(sel);
const chatEl = $('#chat');
const form = $('#composer');
const providerEl = $('#provider');
const modelEl = $('#model');
const systemEl = $('#system');
const tempEl = $('#temp');
const maxEl = $('#max');
const msgEl = $('#msg');

const defaultModels = {
  openai: 'gpt-4o-mini',
  groq: 'llama-3.1-70b-versatile',
  anthropic: 'claude-3-5-sonnet-20240620',
  gemini: 'gemini-1.5-pro',
  mistral: 'mistral-large-latest',
  xai: 'grok-2-latest'
};

providerEl.addEventListener('change', () => {
  modelEl.value = defaultModels[providerEl.value] || '';
});
modelEl.value = defaultModels[providerEl.value];

const state = { messages: [] };

function push(role, content) {
  state.messages.push({ role, content });
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.textContent = content;
  chatEl.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = msgEl.value.trim();
  if (!content) return;
  push('user', content);
  msgEl.value = '';

  const loading = document.createElement('div');
  loading.className = 'msg assistant';
  loading.textContent = 'Thinking…';
  chatEl.appendChild(loading);

  try {
    const body = {
      provider: providerEl.value,
      model: modelEl.value.trim(),
      system: systemEl.value.trim() || undefined,
      temperature: Number(tempEl.value),
      max_tokens: Number(maxEl.value),
      messages: state.messages
    };

    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Request failed');

    loading.remove();
    push('assistant', j.text || '[empty]');
  } catch (err) {
    loading.remove();
    push('assistant', '⚠️ ' + err.message);
  }
});
