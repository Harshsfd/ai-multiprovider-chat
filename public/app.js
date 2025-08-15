const $ = (sel) => document.querySelector(sel);

const chatEl = $('#chat');
const form = $('#composer');
const providerEl = $('#provider');
const modelEl = $('#model');
const systemEl = $('#system');
const tempEl = $('#temp');
const maxEl = $('#max');
const msgEl = $('#msg');
const sendBtn = $('#sendBtn');
const clearBtn = $('#clearChat');
const copyBtn = $('#copyChat');

const defaultModels = {
  openai: 'gpt-4o-mini',
  groq: 'llama-3.1-70b-versatile',
  anthropic: 'claude-3-5-sonnet-20240620',
  gemini: 'gemini-1.5-pro',
  mistral: 'mistral-large-latest',
  xai: 'grok-2-latest',
};

// ---- state & persistence ----
const state = {
  messages: [],
  provider: localStorage.getItem('provider') || 'openai',
  model: localStorage.getItem('model') || defaultModels['openai'],
  system: localStorage.getItem('system') || '',
  temperature: Number(localStorage.getItem('temperature') || 0.7),
  max_tokens: Number(localStorage.getItem('max_tokens') || 1024),
};

function persist() {
  localStorage.setItem('provider', providerEl.value);
  localStorage.setItem('model', modelEl.value.trim());
  localStorage.setItem('system', systemEl.value.trim());
  localStorage.setItem('temperature', tempEl.value);
  localStorage.setItem('max_tokens', maxEl.value);
}

// ---- UI init ----
providerEl.value = state.provider;
modelEl.value = state.model || defaultModels[state.provider];
systemEl.value = state.system;
tempEl.value = state.temperature;
maxEl.value = state.max_tokens;

providerEl.addEventListener('change', () => {
  const def = defaultModels[providerEl.value] || '';
  if (!modelEl.value || modelEl.value === state.model) {
    modelEl.value = def;
  }
  persist();
});
modelEl.addEventListener('input', persist);
systemEl.addEventListener('input', persist);
tempEl.addEventListener('input', persist);
maxEl.addEventListener('input', persist);

// ---- helpers ----
function push(role, content) {
  state.messages.push({ role, content });

  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;
  wrap.textContent = content;

  chatEl.appendChild(wrap);
  wrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function addMeta() {
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `
    <span class="chip">Provider: ${providerEl.value}</span>
    <span class="chip">Model: ${modelEl.value || '—'}</span>
    <span class="chip">Temp: ${tempEl.value}</span>
    <span class="chip">Max: ${maxEl.value}</span>
  `;
  chatEl.appendChild(meta);
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  msgEl.disabled = isLoading;
  sendBtn.textContent = isLoading ? 'Sending…' : 'Send';
}

function showError(message) {
  const el = document.createElement('div');
  el.className = 'msg assistant';
  el.textContent = '⚠️ ' + message;
  chatEl.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// ---- clear & copy ----
clearBtn.addEventListener('click', () => {
  state.messages = [];
  chatEl.innerHTML = '';
  msgEl.focus();
});

copyBtn.addEventListener('click', async () => {
  const lines = state.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`);
  const txt = lines.join('\n\n');
  try {
    await navigator.clipboard.writeText(txt);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy chat'), 900);
  } catch {
    showError('Copy failed. Select and copy manually.');
  }
});

// ---- enter to send (shift+enter for newline) ----
msgEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

// ---- submit handler ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = msgEl.value.trim();
  if (!content) return;

  // show meta once per session (first message)
  if (state.messages.length === 0) addMeta();

  push('user', content);
  msgEl.value = '';
  setLoading(true);

  // placeholder while waiting
  const thinking = document.createElement('div');
  thinking.className = 'msg assistant';
  thinking.textContent = 'Thinking…';
  chatEl.appendChild(thinking);

  try {
    const body = {
      provider: providerEl.value,
      model: modelEl.value.trim(),
      system: systemEl.value.trim() || undefined,
      temperature: Number(tempEl.value),
      max_tokens: Number(maxEl.value),
      messages: state.messages,
    };

    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // try to parse JSON; if HTML/text error came back, this will throw
    const text = await r.text();
    let j;
    try {
      j = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Server did not return JSON:\n${text.slice(0, 300)}…`);
    }

    if (!r.ok) {
      throw new Error(j.error || 'Request failed');
    }

    thinking.remove();
    push('assistant', j.text || j.result || '[empty]');
  } catch (err) {
    thinking.remove();
    showError(err.message);
  } finally {
    setLoading(false);
  }
});
               
