/* ===== Conta e sincronização (Supabase) ===== */
const SB_URL = 'https://dkhqjvdilarcmbjxohia.supabase.co';
// Chave pública (anon): pode estar no site. As regras de segurança da base de dados protegem os dados de cada pessoa.
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRraHFqdmRpbGFyY21ianhvaGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMzQwNzEsImV4cCI6MjExMDYxMDA3MX0.zjS4m7KUIMXnFuDXaRPmDMHGHq4820Ii4QMXBuIVgDI';
const SB_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
const LOCAL_ONLY = ['voiceName', 'sound', 'voice'];

const CL = { sb: null, user: null, status: 'idle', step: 'email', email: '', msg: '', lastSync: null, timer: null, busy: false, unavailable: false };

function loadLib() {
  return new Promise((res, rej) => {
    if (window.supabase && window.supabase.createClient) return res();
    const s = document.createElement('script'); s.src = SB_LIB; s.async = true;
    s.onload = () => res(); s.onerror = () => rej(new Error('lib')); document.head.appendChild(s);
  });
}
async function cloudInit() {
  // dentro do Claude o site não pode falar com o Supabase: a conta só funciona no site próprio
  if (/claude|anthropic/i.test(location.hostname) || location.protocol === 'file:') { CL.unavailable = true; refreshCloudUI(); return; }
  try {
    await loadLib();
    CL.sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'purpose-auth' } });
    // erro devolvido pelo Google (ex.: esta conta Google já tem progresso noutro aparelho)
    const qs = new URLSearchParams(location.search), err = qs.get('error_code') || qs.get('error');
    if (err) {
      history.replaceState(null, '', location.pathname + location.hash);
      if (/identity_already_exists|already/i.test(err + (qs.get('error_description') || ''))) { CL.msg = ''; return void googleSignIn(); }
      CL.msg = 'Não foi possível entrar com o Google. Tenta outra vez.';
    }
    const { data } = await CL.sb.auth.getSession();
    CL.user = data.session ? data.session.user : null;
    if (location.search.includes('code=')) history.replaceState(null, '', location.pathname + location.hash);
    // sem sessão: cria uma conta anónima para o progresso já ficar guardado na nuvem
    if (!CL.user) { const r = await CL.sb.auth.signInAnonymously(); if (!r.error) CL.user = r.data.user; }
    CL.sb.auth.onAuthStateChange((_e, session) => { const was = CL.user && CL.user.id; CL.user = session ? session.user : null; if (CL.user && CL.user.id !== was) pullMerge(); refreshCloudUI(); });
    if (CL.user) await pullMerge();
    refreshCloudUI();
  } catch (e) { CL.unavailable = true; refreshCloudUI(); }
}
window.addEventListener('online', () => { if (CL.user && S._dirty) pushNow(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && CL.user && S._dirty) pushNow(); });

/* junta o progresso de dois aparelhos sem perder nada */
function hKey(h) { return h.id || [h.d, h.w, h.min, h.h ?? '', h.lv || h.lvl || ''].join('|'); }
function mergeStates(a, b) {
  const newer = (a._t || 0) >= (b._t || 0) ? a : b, older = newer === a ? b : a;
  const out = Object.assign({}, older, newer);
  const hist = new Map(); [...(older.history || []), ...(newer.history || [])].forEach(h => hist.set(hKey(h), h));
  out.history = [...hist.values()].sort((x, y) => (x.d + (x.h ?? 0)).localeCompare(y.d + (y.h ?? 0)));
  const w = new Map(); [...(older.weights || []), ...(newer.weights || [])].forEach(x => w.set(x.d, x));
  out.weights = [...w.values()].sort((x, y) => x.d.localeCompare(y.d));
  out.unlocked = [...new Set([...(a.unlocked || []), ...(b.unlocked || [])])];
  out.loads = Object.assign({}, older.loads || {}, newer.loads || {});
  out.best = {}; for (const s of [a.best || {}, b.best || {}]) for (const k in s) out.best[k] = Math.max(out.best[k] || 0, s[k]);
  out.prs = Math.max(a.prs || 0, b.prs || 0);
  const mx = (p, q) => { const r = Object.assign({}, p); for (const k in q) r[k] = Math.max(r[k] || 0, q[k]); return r; };
  out.totals = { reps: mx((a.totals || {}).reps || {}, (b.totals || {}).reps || {}), sec: mx((a.totals || {}).sec || {}, (b.totals || {}).sec || {}) };
  return out;
}
function cloudPayload() { const o = Object.assign({}, S); LOCAL_ONLY.forEach(k => delete o[k]); delete o._dirty; return o; }

async function pullMerge() {
  if (!CL.sb || !CL.user || CL.busy) return; CL.busy = true; CL.status = 'sync'; refreshCloudUI();
  try {
    const { data, error } = await CL.sb.from('user_state').select('state, updated_at').eq('user_id', CL.user.id).maybeSingle();
    if (error) throw error;
    if (data && data.state) {
      const keep = {}; LOCAL_ONLY.forEach(k => { if (k in S) keep[k] = S[k]; });
      const merged = mergeStates(data.state, S);
      Object.keys(S).forEach(k => delete S[k]); Object.assign(S, merged, keep);
      S.totals = S.totals || { reps: {}, sec: {} }; S.unlocked = S.unlocked || []; S.loads = S.loads || {}; S.best = S.best || {};
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    }
    CL.busy = false; await pushNow(true);
    if ($('#main') && $('#player').hidden) render();
  } catch (e) { CL.status = 'error'; CL.busy = false; refreshCloudUI(); }
}
function cloudQueue() {
  S._dirty = true;
  if (!CL.user) return;
  clearTimeout(CL.timer); CL.timer = setTimeout(pushNow, 1500);
}
async function pushNow(force) {
  if (!CL.sb || !CL.user || (CL.busy && !force)) return;
  if (!navigator.onLine) { CL.status = 'offline'; refreshCloudUI(); return; }
  CL.busy = true; CL.status = 'sync'; refreshCloudUI();
  try {
    const { error } = await CL.sb.from('user_state').upsert({ user_id: CL.user.id, state: cloudPayload(), updated_at: new Date().toISOString() });
    if (error) throw error;
    S._dirty = false; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    CL.status = 'ok'; CL.lastSync = new Date();
  } catch (e) { CL.status = 'error'; }
  CL.busy = false; refreshCloudUI();
}

/* login com código por email */
async function sendCode(email) {
  CL.msg = ''; CL.email = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CL.email)) { CL.msg = 'Escreve um email válido.'; return refreshCloudUI(); }
  CL.status = 'sending'; refreshCloudUI();
  const { error } = await CL.sb.auth.signInWithOtp({ email: CL.email, options: { shouldCreateUser: true } });
  CL.status = 'idle';
  if (error) {
    CL.msg = /rate|seconds/i.test(error.message) ? 'Pediste um código há pouco. Espera um minuto e tenta outra vez.'
      : /not authorized|not_authorized/i.test(error.message + (error.code || '')) ? 'Este email ainda não pode receber códigos. O dono da app tem de ativar o envio de emails.'
      : 'Não foi possível enviar o código. Tenta outra vez.';
  } else { CL.step = 'code'; CL.msg = ''; }
  refreshCloudUI();
  if (CL.step === 'code') setTimeout(() => { const i = $('#cl-code'); if (i) i.focus(); }, 50);
}
async function verifyCode(code) {
  if (CL.status === 'sending') return;
  CL.msg = ''; code = code.replace(/\D/g, '');
  if (code.length < 6) { CL.msg = 'O código tem 6 dígitos.'; return refreshCloudUI(); }
  CL.status = 'sending'; refreshCloudUI();
  const { data, error } = await CL.sb.auth.verifyOtp({ email: CL.email, token: code, type: 'email' });
  CL.status = 'idle';
  if (error) { CL.msg = 'Código errado ou expirado. Confirma o email ou pede um novo.'; return refreshCloudUI(); }
  CL.user = data.user; CL.step = 'email'; await pullMerge();
}
const isAnon = () => !!(CL.user && CL.user.is_anonymous);
const redirectURL = () => location.origin + location.pathname;
async function googleLink() {
  CL.msg = ''; CL.status = 'sending'; refreshCloudUI();
  if (S._dirty) await pushNow(true);
  const r = isAnon() ? await CL.sb.auth.linkIdentity({ provider: 'google', options: { redirectTo: redirectURL() } })
                     : await CL.sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectURL() } });
  if (r.error) { if (isAnon()) return googleSignIn(); CL.status = 'idle'; CL.msg = 'Não foi possível abrir o Google. Tenta outra vez.'; refreshCloudUI(); }
}
async function googleSignIn() {
  const r = await CL.sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectURL(), queryParams: { prompt: 'select_account' } } });
  if (r.error) { CL.status = 'idle'; CL.msg = 'Não foi possível abrir o Google. Tenta outra vez.'; refreshCloudUI(); }
}
async function signOut() {
  if (S._dirty) await pushNow(true);
  try { await CL.sb.auth.signOut(); } catch (e) {}
  CL.user = null; CL.status = 'idle'; CL.step = 'email';
  const r = await CL.sb.auth.signInAnonymously(); if (!r.error) CL.user = r.data.user;
  refreshCloudUI();
}

/* interface */
const G_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.9z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/></svg>';
function cloudCard() {
  const icCloud = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z"/></svg>';
  if (CL.unavailable) return `<section class="card cloud" id="cloud"><div class="cl-h">${icCloud}<h3>Conta</h3></div><p class="muted small">A conta só funciona no site <b>skies333.github.io/purpose</b>. Aqui o progresso fica só neste navegador.</p></section>`;
  if (!CL.sb) return `<section class="card cloud" id="cloud"><div class="cl-h">${icCloud}<h3>Conta</h3></div><p class="muted small">A ligar…</p></section>`;
  const st = { sync: 'A sincronizar…', ok: CL.lastSync ? 'Guardado às ' + CL.lastSync.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : 'Guardado na nuvem', error: 'Não foi possível sincronizar', offline: 'Sem internet: guarda quando voltar a ligação', idle: 'Guardado na nuvem', sending: 'A abrir…' }[CL.status] || '';
  const msg = CL.msg ? `<p class="cl-msg">${esc(CL.msg)}</p>` : '';
  if (CL.user && !isAnon()) {
    const viaG = (CL.user.app_metadata && (CL.user.app_metadata.providers || [CL.user.app_metadata.provider]) || []).includes('google');
    return `<section class="card cloud on" id="cloud"><div class="cl-h">${viaG ? `<span class="g-ic">${G_ICON}</span>` : icCloud}<div><h3>Progresso na nuvem</h3><p class="muted small">${esc(CL.user.email || '')}</p></div><span class="cl-dot ${CL.status}"></span></div>
      <p class="cl-st">${st}. Entra com a mesma conta noutro telemóvel e o progresso aparece lá.</p>
      <div class="row-btns"><button class="btn ghost sm" data-clsync>Sincronizar agora</button><button class="btn ghost sm" data-clout>Terminar sessão</button></div>${msg}</section>`;
  }
  const sending = CL.status === 'sending';
  const anonNote = isAnon() ? `<p class="cl-st"><span class="cl-dot ${CL.status} inl"></span>${CL.status === 'error' ? st : 'O teu progresso já está guardado na nuvem, mas só neste aparelho.'}</p>` : '';
  return `<section class="card cloud" id="cloud"><div class="cl-h">${icCloud}<div><h3>Não percas o teu progresso</h3><p class="muted small">Liga a tua conta Google para recuperares o histórico, as medalhas e as cargas em qualquer telemóvel.</p></div></div>
    ${anonNote}
    <button class="btn gbtn full" data-clgoogle ${sending ? 'disabled' : ''}>${G_ICON}<span>${sending ? 'A abrir o Google…' : 'Continuar com Google'}</span></button>
    ${CL.showEmail ? (CL.step === 'email'
      ? `<form class="inline" id="cl-email-f"><label for="cl-email" class="sr">Email</label><input id="cl-email" type="email" autocomplete="email" inputmode="email" placeholder="o.teu@email.com" value="${esc(CL.email)}"><button class="btn ghost sm" type="submit" ${sending ? 'disabled' : ''}>Enviar código</button></form>`
      : `<p class="small">Enviámos um código de 6 dígitos para <b>${esc(CL.email)}</b>.</p>
         <form class="inline" id="cl-code-f"><label for="cl-code" class="sr">Código</label><input id="cl-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" class="cl-code"><button class="btn lime sm" type="submit" ${sending ? 'disabled' : ''}>${sending ? 'A entrar…' : 'Entrar'}</button></form>
         <button class="link" data-clback>Usar outro email</button>`)
      : `<button class="link cl-alt" data-clemail>Prefiro usar o email</button>`}
    ${msg}</section>`;
}
function refreshCloudUI() {
  const c = document.getElementById('cloud'); if (c) { const f = document.activeElement && document.activeElement.id; const v = f && document.getElementById(f) ? document.getElementById(f).value : null; c.outerHTML = cloudCard(); if (f && document.getElementById(f)) { const n = document.getElementById(f); if (v !== null) n.value = v; n.focus(); } }
  const b = document.getElementById('cl-badge'); if (b) b.outerHTML = cloudBadge();
}
function cloudBadge() {
  if (CL.unavailable || !CL.sb) return '<span id="cl-badge"></span>';
  if (CL.user && !isAnon()) return `<button id="cl-badge" class="cl-badge on" data-go="progresso" aria-label="Progresso guardado na nuvem"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z"/><path d="M9.5 13.5l2 2 3.5-3.5"/></svg></button>`;
  return `<button id="cl-badge" class="cl-badge" data-go="progresso">Guardar progresso</button>`;
}
document.addEventListener('submit', ev => {
  if (ev.target.id === 'cl-email-f') { ev.preventDefault(); sendCode($('#cl-email').value); }
  if (ev.target.id === 'cl-code-f') { ev.preventDefault(); verifyCode($('#cl-code').value); }
});
document.addEventListener('input', ev => { if (ev.target.id === 'cl-code' && ev.target.value.replace(/\D/g, '').length === 6) verifyCode(ev.target.value); });
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-clsync],[data-clout],[data-clback],[data-clgoogle],[data-clemail]'); if (!t) return;
  if ('clgoogle' in t.dataset) googleLink();
  if ('clemail' in t.dataset) { CL.showEmail = true; refreshCloudUI(); setTimeout(() => { const i = $('#cl-email'); if (i) i.focus(); }, 30); }
  if ('clsync' in t.dataset) pullMerge();
  if ('clout' in t.dataset) signOut();
  if ('clback' in t.dataset) { CL.step = 'email'; CL.msg = ''; refreshCloudUI(); }
});
setTimeout(cloudInit, 0);
