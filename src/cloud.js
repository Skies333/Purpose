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
    CL.sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'purpose-auth' } });
    const { data } = await CL.sb.auth.getSession();
    CL.user = data.session ? data.session.user : null;
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
async function signOut() { try { await CL.sb.auth.signOut(); } catch (e) {} CL.user = null; CL.status = 'idle'; refreshCloudUI(); }

/* interface */
function cloudCard() {
  const icCloud = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z"/></svg>';
  if (CL.unavailable) return `<section class="card cloud" id="cloud"><div class="cl-h">${icCloud}<h3>Conta</h3></div><p class="muted small">A conta só funciona no site <b>skies333.github.io/purpose</b>. Aqui o progresso fica só neste navegador.</p></section>`;
  if (!CL.sb) return `<section class="card cloud" id="cloud"><div class="cl-h">${icCloud}<h3>Conta</h3></div><p class="muted small">A ligar…</p></section>`;
  if (CL.user) {
    const st = { sync: 'A sincronizar…', ok: CL.lastSync ? 'Guardado às ' + CL.lastSync.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : 'Guardado na nuvem', error: 'Não foi possível sincronizar', offline: 'Sem internet: guarda quando voltar a ligação', idle: 'Guardado na nuvem' }[CL.status] || '';
    return `<section class="card cloud on" id="cloud"><div class="cl-h">${icCloud}<div><h3>Progresso na nuvem</h3><p class="muted small">${esc(CL.user.email || '')}</p></div><span class="cl-dot ${CL.status}"></span></div>
      <p class="cl-st">${st}</p>
      <div class="row-btns"><button class="btn ghost sm" data-clsync>Sincronizar agora</button><button class="btn ghost sm" data-clout>Terminar sessão</button></div></section>`;
  }
  const sending = CL.status === 'sending';
  return `<section class="card cloud" id="cloud"><div class="cl-h">${icCloud}<div><h3>Guarda o teu progresso</h3><p class="muted small">Entra com o email para não perderes o histórico, as medalhas e as cargas, e para os teres em qualquer aparelho.</p></div></div>
    ${CL.step === 'email'
      ? `<form class="inline" id="cl-email-f"><label for="cl-email" class="sr">Email</label><input id="cl-email" type="email" autocomplete="email" inputmode="email" placeholder="o.teu@email.com" value="${esc(CL.email)}"><button class="btn lime sm" type="submit" ${sending ? 'disabled' : ''}>${sending ? 'A enviar…' : 'Enviar código'}</button></form>`
      : `<p class="small">Enviámos um código de 6 dígitos para <b>${esc(CL.email)}</b>.</p>
         <form class="inline" id="cl-code-f"><label for="cl-code" class="sr">Código</label><input id="cl-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" class="cl-code"><button class="btn lime sm" type="submit" ${sending ? 'disabled' : ''}>${sending ? 'A entrar…' : 'Entrar'}</button></form>
         <button class="link" data-clback>Usar outro email</button>`}
    ${CL.msg ? `<p class="cl-msg">${esc(CL.msg)}</p>` : ''}</section>`;
}
function refreshCloudUI() {
  const c = document.getElementById('cloud'); if (c) { const f = document.activeElement && document.activeElement.id; const v = f && document.getElementById(f) ? document.getElementById(f).value : null; c.outerHTML = cloudCard(); if (f && document.getElementById(f)) { const n = document.getElementById(f); if (v !== null) n.value = v; n.focus(); } }
  const b = document.getElementById('cl-badge'); if (b) b.outerHTML = cloudBadge();
}
function cloudBadge() {
  if (CL.unavailable || !CL.sb) return '<span id="cl-badge"></span>';
  if (CL.user) return `<button id="cl-badge" class="cl-badge on" data-go="progresso" aria-label="Progresso guardado na nuvem"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z"/><path d="M9.5 13.5l2 2 3.5-3.5"/></svg></button>`;
  return `<button id="cl-badge" class="cl-badge" data-go="progresso">Guardar progresso</button>`;
}
document.addEventListener('submit', ev => {
  if (ev.target.id === 'cl-email-f') { ev.preventDefault(); sendCode($('#cl-email').value); }
  if (ev.target.id === 'cl-code-f') { ev.preventDefault(); verifyCode($('#cl-code').value); }
});
document.addEventListener('input', ev => { if (ev.target.id === 'cl-code' && ev.target.value.replace(/\D/g, '').length === 6) verifyCode(ev.target.value); });
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-clsync],[data-clout],[data-clback]'); if (!t) return;
  if ('clsync' in t.dataset) pullMerge();
  if ('clout' in t.dataset) signOut();
  if ('clback' in t.dataset) { CL.step = 'email'; CL.msg = ''; refreshCloudUI(); }
});
setTimeout(cloudInit, 0);
