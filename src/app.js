// campos de perfil/definições: guardamos a hora de cada alteração para a sincronização não apagar o que mudaste
const FIELDS = ['name', 'height', 'aim', 'goal', 'level', 'mode', 'warm', 'cool', 'plans'];
let SNAP = {};
function snapFields() { SNAP = {}; FIELDS.forEach(k => SNAP[k] = JSON.stringify(S[k] ?? null)); }
/* ===== Estado ===== */
const KEY = 'forjaCasa.v1';
const DEF_S = () => ({ name: '', history: [], weights: [], goal: 5, level: 'av', sound: true, voice: true, mode: 'casa', loads: {}, best: {}, prs: 0, warm: true, cool: true, totals: { reps: {}, sec: {} }, unlocked: [] });
let S = DEF_S();
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
S._f = S._f || {}; S.totals = S.totals || { reps: {}, sec: {} }; S.totals.reps = S.totals.reps || {}; S.totals.sec = S.totals.sec || {}; S.unlocked = S.unlocked || []; S.loads = S.loads || {}; S.best = S.best || {}; S.prs = S.prs || 0; S.mode = S.mode || 'casa'; snapFields();
function save() {
  const now = Date.now(); S._t = now; S._f = S._f || {};
  FIELDS.forEach(k => { if (SNAP[k] !== undefined && JSON.stringify(S[k] ?? null) !== SNAP[k]) S._f[k] = now; });
  snapFields();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (typeof cloudQueue === 'function') cloudQueue();
  if (typeof pushQueue === 'function') pushQueue();
}

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dkey = d => { const z = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); };
const today = () => dkey(new Date());

/* ===== Ícones ===== */
const IC = {
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  chart: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  play: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  fire: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
  sound: '<path d="M5 10v4h3l4 4V6L8 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M5 10v4h3l4 4V6L8 10zM16 10l5 5M21 10l-5 5"/>',
  voice: '<path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v3"/>',
  layers: '<path d="M12 4l8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M9 17h6v3H9z"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/>',
  leg: '<path d="M10 3v8l-3 9h4l2-6 2 6h4l-3-9V3z"/>',
  dumb: '<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>',
  house: '<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  grip: '<circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/>',
  up: '<path d="M6 15l6-6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};
const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;

/* ===== Modo casa / ginásio ===== */
const isGym = () => S.mode === 'gym';
const myWorkouts = () => WORKOUTS.filter(w => w.place === S.mode);
const myCats = () => isGym() ? CATS_GYM : CATS;
const PLAN_ORDER = [1, 2, 3, 4, 5, 6, 0];
// plano personalizado (guardado em S.plans[modo]); senão o plano de origem
const myPlan = () => {
  const base = isGym() ? PLAN_GYM : PLAN, cust = S.plans && S.plans[S.mode];
  if (!cust) return base;
  const out = {}; PLAN_ORDER.forEach(d => { const c = cust[d] || {}; out[d] = { w: c.w && WMAP[c.w] ? c.w : null, extra: c.extra && WMAP[c.extra] ? c.extra : null, focus: c.w && WMAP[c.w] ? WMAP[c.w].cat : 'Descanso' }; });
  return out;
};
const planDay = d => { const pd = myPlan()[d]; return pd.w ? pd : { w: 'mobility', focus: 'Dia de descanso', rest: true }; };
const ZONE_FIG_GYM = { 'Corpo inteiro': 'bbsquat', 'Parte de cima': 'barrow', 'Peito & Tríceps': 'bench', 'Costas & Bíceps': 'pulldown', 'Ombros & Braços': 'lateralraise', 'Pernas': 'legpress' };
const hasLoad = id => EX[id].place === 'gym' && !BODYWEIGHT.includes(id);
const loadStep = id => ['db', 'db-front'].includes(EX[id].hold) ? 1 : 2.5;
const kg = v => (Math.round(v * 10) / 10).toLocaleString('pt-PT');
function modeSwitch(compact) {
  return `<div class="mode ${compact ? 'compact' : ''}" role="tablist" aria-label="Onde vais treinar">
    <span class="mode-ind ${isGym() ? 'r' : ''}"></span>
    <button role="tab" aria-selected="${!isGym()}" class="${isGym() ? '' : 'on'}" data-mode="casa">${ic('house')} Em casa</button>
    <button role="tab" aria-selected="${isGym()}" class="${isGym() ? 'on' : ''}" data-mode="gym">${ic('dumb')} Ginásio</button></div>`;
}

/* ===== Cálculos ===== */
const lvl = () => LEVELS.find(l => l.id === S.level) || LEVELS[1];
function scaled(item, L) {
  const [ex, mode, amt, side, sets] = item;
  if (sets) return { ex, mode, amt, side, sets: Math.max(2, sets + L.dr) };
  if (amt === 'MÁX') return { ex, mode, amt, side };
  let v = amt * L.k;
  v = mode === 't' ? Math.round(v / 5) * 5 : Math.round(v);
  return { ex, mode, amt: Math.max(mode === 't' ? 15 : 5, v), side };
}
function plan(w, L = lvl()) {
  const rounds = Math.max(1, w.rounds + L.dr), rest = Math.round(w.rest * L.rk / 5) * 5, rr = Math.round(w.roundRest * L.rk / 5) * 5;
  const items = w.items.map(i => scaled(i, L));
  let sec = 0;
  if (w.mode === 'sets') {
    items.forEach(i => sec += i.sets * ((i.amt === 'MÁX' ? 10 : i.amt) * 3.5 * (i.side ? 2 : 1)) + (i.sets - 1) * rest);
    sec += rr * (items.length - 1);
  } else {
  items.forEach(i => sec += (i.mode === 't' ? i.amt : (i.amt === 'MÁX' ? 15 : i.amt) * 3.2) * (i.side ? 2 : 1));
  sec = sec * rounds + rest * (items.length - 1) * rounds + rr * (rounds - 1);
  }
  const extras = w.id === 'mobility' ? 0 : (S.warm ? WARMUP.reduce((s, x) => s + x[1], 0) : 0) + (S.cool ? COOLDOWN.reduce((s, x) => s + x[1], 0) : 0);
  const min = Math.round((sec + extras) / 60);
  const sets = items.reduce((s, i) => s + (i.sets || rounds), 0);
  return { rounds: w.mode === 'sets' ? 1 : rounds, rest, rr, items, min, kcal: Math.round(min * w.rate), sets, gym: w.mode === 'sets' };
}
const amtTxt = i => i.sets ? `${i.sets} × ${i.amt === 'MÁX' ? 'máx.' : i.amt + (i.side ? ' / perna' : '')}${hasLoad(i.ex) && S.loads[i.ex] ? ` · ${kg(S.loads[i.ex])} kg` : ''}` : i.mode === 't' ? `${i.amt} s${i.side ? ' / lado' : ''}` : (i.amt === 'MÁX' ? 'Máx. reps' : `${i.amt} reps${i.side ? ' / perna' : ''}`);

function streak() {
  const days = new Set(S.history.map(h => h.d));
  let n = 0; const d = new Date();
  if (!days.has(dkey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dkey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function weekDays() { // segunda a domingo da semana atual
  const d = new Date(); const off = (d.getDay() + 6) % 7; d.setDate(d.getDate() - off);
  return Array.from({ length: 7 }, (_, i) => { const x = new Date(d); x.setDate(d.getDate() + i); return x; });
}

/* ===== Router ===== */
const ROUTES = ['inicio', 'treinos', 'plano', 'progresso', 'dicas', 'conta'];
let route = 'inicio', filterCat = 'Todos', libTab = 'treinos', medalsOpen = false;
function go(r) { if (location.hash !== '#' + r) location.hash = r; else render(true); }
window.addEventListener('hashchange', () => { planEdit = false; PDRAFT = null; render(true); });

function render(anim) {
  const h = (location.hash || '').slice(1);
  const prev = route;
  route = ROUTES.includes(h) ? h : 'inicio';
  const main = $('#main');
  const y = window.scrollY;
  main.innerHTML = VIEWS[route]();
  main.querySelectorAll('[data-fig]').forEach(n => makeFigure(n, n.dataset.fig, { phase: +n.dataset.phase || 0 }));
  document.querySelectorAll('.nav [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === (route === 'conta' ? 'progresso' : route)));
  moveNavInd();
  if (anim) {
    animateIn(main);
    if (prev !== route) window.scrollTo(0, 0);
  } else window.scrollTo(0, y);
  if (route === 'dicas') calc();
}
/* ===== Logo purpose (o “o” é um anel de progresso) ===== */
function logo(mode = '') {
  return `<span class="logo ${mode}" role="img" aria-label="purpose"><span aria-hidden="true">purp</span><span class="logo-o" aria-hidden="true"><svg viewBox="0 0 100 100"><circle class="lo-t" cx="50" cy="50" r="39"></circle><circle class="lo-a" cx="50" cy="50" r="39" pathLength="100" transform="rotate(-90 50 50)"></circle></svg></span><span aria-hidden="true">se</span></span>`;
}
/* ===== Animações ===== */
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateIn(root) {
  if (RM) return;
  [...root.children].forEach((c, i) => { c.style.setProperty('--i', Math.min(i, 10)); c.classList.remove('rise'); void c.offsetWidth; c.classList.add('rise'); });
  root.querySelectorAll('.grid,.hscroll,.list,.zones,.ach-grid,.tips,.stats,.chipbar,.calc-out,.dots,.facts').forEach(g =>
    [...g.children].forEach((c, j) => { c.style.setProperty('--j', Math.min(j, 14)); c.classList.add('pop-in'); }));
  root.querySelectorAll('.heat span').forEach((c, j) => c.style.setProperty('--j', j));
  root.querySelectorAll('.heat').forEach(hh => hh.classList.add('heat-in'));
  countUp(root);
}
function countUp(root) {
  root.querySelectorAll('[data-count]').forEach(n => {
    const end = +n.dataset.count; if (!end || RM) return;
    const t0 = performance.now(), dur = 900;
    const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      n.textContent = Math.round(end * e).toLocaleString('pt-PT'); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
function moveNavInd() {
  const ind = $('.nav-ind'), on = $('.nav [data-go].on'); if (!ind) return;
  if (!on) { ind.style.opacity = 0; return; }
  ind.style.opacity = 1; ind.style.width = on.offsetWidth + 'px'; ind.style.transform = `translateX(${on.offsetLeft}px)`;
  on.classList.remove('bounce'); void on.offsetWidth; on.classList.add('bounce');
}
window.addEventListener('resize', moveNavInd);
function animClose(el, cls, done) {
  if (RM) return done();
  el.classList.add(cls); setTimeout(() => { el.classList.remove(cls); done(); }, 220);
}
function confetti() {
  if (RM) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const dpr = window.devicePixelRatio || 1, W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr, x = c.getContext('2d');
  const cols = ['#d6f53d', '#f1f4e8', '#a8c92a', '#ffffff', '#eaff8a'];
  const P = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 18 * dpr, vy: (-Math.random() * 16 - 6) * dpr,
    r: (4 + Math.random() * 5) * dpr, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }));
  const t0 = performance.now();
  (function f(now) {
    x.clearRect(0, 0, W, H);
    for (const p of P) { p.vy += .45 * dpr; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); }
    if (now - t0 < 3200) requestAnimationFrame(f); else c.remove();
  })(t0);
}

/* ===== Componentes ===== */
function wCard(w, i = 0, big = false) {
  const p = plan(w);
  return `<button class="wcard ${big ? 'big' : ''}" data-open="${w.id}">
    <div class="wfig" data-fig="${w.items[0][0]}" data-phase="${i * .37}"></div>
    <div class="wmeta"><span class="tag">${esc(w.cat)}</span><b>${esc(w.name)}</b><small>${p.min} min · ${w.items.length} exercícios</small></div>
  </button>`;
}
function exRow(id, sub, i = 0) {
  const e = EX[id];
  return `<button class="exrow" data-ex="${id}"><div class="exfig" data-fig="${id}" data-phase="${i * .29}"></div>
    <div><b>${esc(e.name)}</b><small>${esc(sub || e.muscles)}</small></div>${ic('next', 'chev')}</button>`;
}
function ring(v, max, size = 84) {
  const r = size / 2 - 7, c = 2 * Math.PI * r, f = Math.min(1, v / max);
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" style="--c:${c}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - f)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}

const ZONE_FIG = { 'Corpo inteiro': 'burpee', 'Parte de cima': 'pushup', 'Pernas': 'squat', 'Core': 'climbers', 'HIIT': 'jacks', 'Mobilidade': 'dog' };
/* ===== Definições ===== */
function remindBlock() {
  const r = S.remind || { on: false, time: '18:00' }, st = typeof pushStatus === 'function' ? pushStatus() : 'site';
  const note = {
    site: 'Os lembretes funcionam na app em <b>skies333.github.io/purpose</b>.',
    install: 'No iPhone, primeiro adiciona a purpose ao ecrã principal (Safari › Partilhar › Adicionar ao ecrã principal) e abre-a pelo ícone. Depois ativa aqui.',
    unsupported: 'Este navegador não suporta notificações. Experimenta o Chrome, o Edge ou a app no ecrã principal do iPhone.',
    denied: 'As notificações estão bloqueadas para a purpose. Ativa-as nas definições do aparelho (no iPhone: Definições › Notificações › purpose) e volta aqui.'
  }[st];
  if (note) return `<div class="card remind off"><div class="rm-h">${ic('bell')}<div><b>Lembrete de treino</b><small>${note}</small></div></div></div>`;
  return `<div class="card remind ${r.on ? 'on' : ''}" id="remind">
    <label class="tg plain"><input type="checkbox" id="tg-remind" ${r.on ? 'checked' : ''}><span class="sw"></span><div><b>Lembrete de treino</b><small>Nos dias com treino no teu plano, se ainda não treinaste.</small></div></label>
    <div class="rm-row ${r.on ? '' : 'dis'}"><label for="remind-time">Hora do lembrete</label><input type="time" id="remind-time" value="${r.time || '18:00'}" ${r.on ? '' : 'disabled'}></div>
    <p class="rm-msg" id="remind-msg">${r.on ? 'Ativo neste aparelho.' : ''}</p>
    ${r.on ? '<button class="btn ghost sm" data-ptest>Enviar notificação de teste</button>' : ''}
  </div>`;
}
function redrawRemind(msg, ok) { const el = $('#remind'); if (!el) return; el.outerHTML = remindBlock(); const m = $('#remind-msg'); if (m && msg) { m.textContent = msg; m.className = 'rm-msg ' + (ok ? 'ok' : 'err'); } }
function openSettings() {
  const tg = (id, on, t, s) => `<label class="tg"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><span class="sw"></span><div><b>${t}</b><small>${s}</small></div></label>`;
  const m = $('#modal');
  m.innerHTML = `<div class="modal-in settings" role="dialog" aria-modal="true" aria-labelledby="st-t">
    <button class="icon-btn mclose" data-mclose aria-label="Fechar">${ic('x')}</button>
    <h2 id="st-t">Definições</h2>
    <div class="sec-h"><h3>Lembretes</h3></div>
    ${remindBlock()}
    <div class="sec-h"><h3>Som e voz</h3></div>
    <div class="toggles">
      ${tg('tg-sound', S.sound, 'Sons', 'Contagem 3-2-1 e som de fim de exercício')}
      ${tg('tg-voice', S.voice, 'Voz do treinador', 'Anuncia exercícios, descansos e recordes')}
    </div>
    ${voiceCard()}
    <div class="sec-h"><h3>Treino</h3></div>
    <div class="toggles">
      ${tg('tg-warm', S.warm, 'Aquecimento automático', '2 min antes de cada treino')}
      ${tg('tg-cool', S.cool, 'Alongamento final', '2 min no fim de cada treino')}
    </div>
  </div>`;
  m.hidden = false;
}
/* ===== Editar plano ===== */
let planEdit = false, PDRAFT = null;
function startPlanEdit() { const mp = myPlan(); PDRAFT = PLAN_ORDER.map(d => ({ w: mp[d].w || null, extra: mp[d].extra || null })); planEdit = true; render(true); }
function planEditor() {
  return `<div class="pe-head"><div><h3>Editar plano</h3><p class="muted small">Arrasta pelo ${'<span class="pe-gi">' + ic('grip') + '</span>'} para mudar o dia. Toca no treino para o trocar.</p></div></div>
  <div class="pe-list" id="pe-list">${PDRAFT.map((it, i) => { const d = PLAN_ORDER[i], w = it.w ? WMAP[it.w] : null, x = it.extra ? WMAP[it.extra] : null;
    return `<div class="pe-row" data-i="${i}">
      <span class="pday"><b>${DAYS[d].slice(0, 3)}</b></span>
      <div class="pe-card ${w ? '' : 'rest'}">
        <button class="pe-grip" data-grip="${i}" aria-label="Arrastar ${w ? esc(w.name) : 'descanso'}">${ic('grip')}</button>
        <button class="pe-pick" data-pick="${i}"><span class="eyebrow">${w ? esc(w.cat) : 'Descanso'}</span><b>${w ? esc(w.name) : 'Dia de descanso'}</b>${x ? `<small>+ ${esc(x.name)}</small>` : ''}<span class="pe-change">Trocar ›</span></button>
        <span class="pe-arrows"><button data-pmove="${i}:-1" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${ic('up')}</button><button data-pmove="${i}:1" aria-label="Descer" ${i === 6 ? 'disabled' : ''}>${ic('down')}</button></span>
      </div></div>`; }).join('')}</div>
  <div class="pe-actions"><button class="btn ghost" data-pcancel>Cancelar</button><button class="btn lime" data-psave>${ic('check')} Guardar plano</button></div>
  ${S.plans && S.plans[S.mode] ? '<button class="link danger pe-reset" data-preset>Repor o plano original</button>' : ''}`;
}
function planPicker(i) {
  const cur = PDRAFT[i], m = $('#modal'), list = myWorkouts().concat(isGym() ? [WMAP.mobility] : []);
  m.innerHTML = `<div class="modal-in" role="dialog" aria-modal="true" aria-label="Escolher treino">
    <button class="icon-btn mclose" data-mclose aria-label="Fechar">${ic('x')}</button>
    <h2>${DAYS[PLAN_ORDER[i]]}</h2><p class="muted">Escolhe o treino deste dia.</p>
    <div class="pk-list">${list.map(w => { const p = plan(w); return `<button class="pk ${cur.w === w.id ? 'on' : ''}" data-pset="${i}:${w.id}"><span class="pk-fig" data-fig="${w.items[0][0]}"></span><span class="pk-t"><b>${esc(w.name)}</b><small>${esc(w.cat)} · ${p.min} min</small></span>${cur.w === w.id ? ic('check') : ''}</button>`; }).join('')}
      <button class="pk ${!cur.w ? 'on' : ''}" data-pset="${i}:"><span class="pk-fig pk-rest">${ic('moon')}</span><span class="pk-t"><b>Dia de descanso</b><small>Sem treino marcado</small></span>${!cur.w ? ic('check') : ''}</button>
    </div>
    ${cur.extra ? `<button class="link danger" data-pnoextra="${i}">Tirar o treino extra (${esc(WMAP[cur.extra].name)})</button>` : ''}
  </div>`;
  m.hidden = false; m.querySelectorAll('[data-fig]').forEach(n => makeFigure(n, n.dataset.fig, { still: true, frame: 0 }));
}
function movePlan(from, to) {
  if (to < 0 || to > 6 || from === to) return;
  const it = PDRAFT.splice(from, 1)[0]; PDRAFT.splice(to, 0, it);
}
function redrawEditor() { const l = $('#main'); const y = window.scrollY; l.innerHTML = VIEWS.plano(); l.querySelectorAll('[data-fig]').forEach(n => makeFigure(n, n.dataset.fig)); window.scrollTo(0, y); }
// arrastar com o dedo ou o rato
document.addEventListener('pointerdown', ev => {
  const g = ev.target.closest('[data-grip]'); if (!g || !planEdit) return;
  ev.preventDefault();
  const rows = [...document.querySelectorAll('.pe-row')], from = +g.dataset.grip, row = rows[from], card = row.querySelector('.pe-card');
  const rects = rows.map(r => r.getBoundingClientRect()), step = rects.length > 1 ? rects[1].top - rects[0].top : rects[0].height;
  const y0 = ev.clientY; let to = from;
  card.classList.add('dragging'); document.body.classList.add('noselect');
  try { g.setPointerCapture(ev.pointerId); } catch (e) {}
  const move = e => {
    const dy = e.clientY - y0; card.style.transform = `translateY(${dy}px) scale(1.02)`;
    to = Math.max(0, Math.min(6, Math.round(from + dy / step)));
    rows.forEach((r, i) => { if (i === from) return; const c = r.querySelector('.pe-card'); let s = 0;
      if (from < to && i > from && i <= to) s = -step; if (from > to && i < from && i >= to) s = step;
      c.style.transform = s ? `translateY(${s}px)` : ''; });
  };
  const up = () => {
    g.removeEventListener('pointermove', move); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up);
    document.body.classList.remove('noselect'); movePlan(from, to); redrawEditor();
    try { navigator.vibrate && navigator.vibrate(15); } catch (e) {}
  };
  g.addEventListener('pointermove', move); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
});
/* ===== Conta: avatar e estado ===== */
let PL_AIM = null;
function avatar(sz) {
  const ini = (S.name || '').trim().charAt(0).toUpperCase();
  const linked = typeof CL !== 'undefined' && CL.user && !CL.user.is_anonymous;
  return `<span class="avatar ${linked ? 'linked' : ''}" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz * .44)}px" aria-hidden="true">${ini || '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'}</span>`;
}
function accountLine() {
  if (typeof CL === 'undefined' || CL.unavailable) return 'Progresso guardado neste aparelho';
  if (CL.user && !CL.user.is_anonymous) return 'Ligada a ' + (CL.user.email || 'conta');
  return 'Ainda não ligada: o progresso só está neste aparelho';
}
/* ===== Medalhas & conquistas ===== */
function maxStreak() {
  const ds = [...new Set(S.history.map(h => h.d))].sort(); let best = 0, cur = 0, prev = null;
  for (const d of ds) { const t = new Date(d + 'T12:00'); cur = prev && (t - prev) / 864e5 < 1.5 ? cur + 1 : 1; best = Math.max(best, cur); prev = t; }
  return best;
}
function perfectWeeks() {
  const wk = {};
  S.history.forEach(h => { const t = new Date(h.d + 'T12:00'); t.setDate(t.getDate() - (t.getDay() + 6) % 7); const k = dkey(t); (wk[k] = wk[k] || new Set()).add(h.d); });
  return Object.values(wk).filter(s => s.size >= S.goal).length;
}
const sumOf = (o, ids) => ids.reduce((s, k) => s + (o[k] || 0), 0);
function achievements() {
  const H = S.history, n = H.length, mins = H.reduce((s, h) => s + h.min, 0), ms = maxStreak();
  const R = S.totals.reps, T = S.totals.sec;
  const kinds = new Set(H.map(h => h.w));
  const A = [
    ['first', 'Primeiro passo', 'Termina o teu primeiro treino', 'star', n, 1],
    ['t10', 'Ritmo certo', 'Completa 10 treinos', 'check', n, 10],
    ['t50', 'Máquina', 'Completa 50 treinos', 'bolt', n, 50],
    ['t100', 'Centurião', 'Completa 100 treinos', 'trophy', n, 100],
    ['s3', 'Aquecer motores', '3 dias seguidos a treinar', 'fire', ms, 3],
    ['s7', 'Semana de ferro', '7 dias seguidos a treinar', 'fire', ms, 7],
    ['s30', 'Imparável', '30 dias seguidos a treinar', 'fire', ms, 30],
    ['wk', 'Semana perfeita', 'Cumpre o teu objetivo semanal', 'shield', perfectWeeks(), 1],
    ['wk4', 'Mês perfeito', 'Cumpre o objetivo semanal 4 vezes', 'shield', perfectWeeks(), 4],
    ['push1k', 'Mil flexões', '1000 flexões no total (todas as variantes)', 'bolt', sumOf(R, PUSH_EX), 1000],
    ['leg1k', 'Pernas de aço', '1000 reps de agachamentos e afundos', 'leg', sumOf(R, LEG_EX), 1000],
    ['legday', 'Nunca falho pernas', '10 treinos de pernas', 'leg', H.filter(h => h.w === 'legs' || h.w === 'legsx').length, 10],
    ['plank', 'Core de pedra', '10 minutos de prancha no total', 'shield', Math.floor((T.plank || 0) / 60), 10],
    ['brutal', 'Modo Brutal', 'Termina um treino no nível Brutal', 'bolt', H.filter(h => h.lv === 'br').length, 1],
    ['all', 'Explorador', 'Experimenta os 10 treinos em casa', 'compass', [...kinds].filter(k => WMAP[k] && WMAP[k].place === 'casa').length, WORKOUTS.filter(w => w.place === 'casa').length],
    ['hours', '10 horas', 'Acumula 10 horas de treino', 'clock', Math.floor(mins / 60), 10],
    ['early', 'Madrugador', 'Treina antes das 8h', 'sun', H.filter(h => h.h !== undefined && h.h < 8).length, 1],
    ['gym1', 'Bem-vindo ao ginásio', 'Termina o primeiro treino no ginásio', 'dumb', H.filter(h => WMAP[h.w] && WMAP[h.w].place === 'gym').length, 1],
    ['gym25', 'Rato de ginásio', '25 treinos no ginásio', 'dumb', H.filter(h => WMAP[h.w] && WMAP[h.w].place === 'gym').length, 25],
    ['pr1', 'Recorde pessoal', 'Bate o teu recorde de carga num exercício', 'trophy', S.prs || 0, 1],
    ['pr10', 'Mais forte a cada semana', 'Bate 10 recordes de carga', 'trophy', S.prs || 0, 10],
    ['night', 'Coruja', 'Treina depois das 22h', 'moon', H.filter(h => h.h !== undefined && h.h >= 22).length, 1],
  ];
  return A.map(([id, name, desc, icn, cur, goal]) => ({ id, name, desc, ic: icn, cur: Math.min(cur, goal), goal, done: cur >= goal }));
}
function medal(a, sm) {
  return `<div class="medal ${a.done ? 'on' : ''} ${sm ? 'sm' : ''}"><svg viewBox="0 0 64 64" aria-hidden="true"><path class="m-hex" d="M32 3l25 14.5v29L32 61 7 46.5v-29z"/></svg>${ic(a.done ? a.ic : 'lock')}</div>`;
}

/* ===== Vistas ===== */
const VIEWS = {
  inicio() {
    const d = new Date(), hr = d.getHours();
    const hi = hr < 6 ? 'Boa noite' : hr < 13 ? 'Bom dia' : hr < 20 ? 'Boa tarde' : 'Boa noite';
    const pd = planDay(d.getDay()), w = WMAP[pd.w], p = plan(w);
    const done = S.history.some(h => h.d === today());
    const wk = weekDays(), set = new Set(S.history.map(h => h.d)), nWeek = wk.filter(x => set.has(dkey(x))).length;
    return `
    <div class="brandbar">${logo('loop')}<div class="bb-r"><div class="streak ${streak() ? 'hot' : ''}" title="Dias seguidos a treinar">${ic('fire')}<b data-count="${streak()}">${streak()}</b></div></div></div>
    <header class="top home"><div><h1>${hi}${S.name ? ', ' + esc(S.name) : ''}!</h1><p class="muted">Treina com propósito. Hoje é ${DAYS[d.getDay()].toLowerCase()}.</p></div></header>
    ${modeSwitch()}

    <section class="today">
      <div class="today-fig" data-fig="${w.items[0][0]}"></div>
      <div class="today-txt">
        <span class="eyebrow shim">Treino de hoje · ${esc(pd.focus)}</span>
        <h2>${esc(w.name)}</h2>
        <div class="chips"><span>${ic('clock')} ${p.min} min</span><span>${ic('fire')} ~${p.kcal} kcal</span><span>${ic('layers')} ${p.gym ? p.sets + ' séries' : p.rounds + ' voltas'}</span></div>
        ${done ? `<p class="done-note">${ic('check')} Já treinaste hoje. Boa!</p>` : ''}
        <div class="row-btns"><button class="btn lime" data-start="${w.id}">${ic('play')} Começar</button><button class="btn ghost" data-open="${w.id}">Detalhes ${ic('next')}</button></div>
      </div>
    </section>

    <section class="card week">
      <div class="week-l">${ring(nWeek, S.goal)}<div class="ring-n"><b data-count="${nWeek}">${nWeek}</b>/${S.goal}</div></div>
      <div class="week-r"><h3>Esta semana</h3><p class="muted">${nWeek >= S.goal ? 'Objetivo cumprido. Recupera bem.' : `Faltam ${S.goal - nWeek} treino${S.goal - nWeek > 1 ? 's' : ''} para o objetivo.`}</p>
        <div class="dots">${wk.map(x => `<span class="${set.has(dkey(x)) ? 'on' : ''} ${dkey(x) === today() ? 'now' : ''}">${DAYS_S[x.getDay()]}</span>`).join('')}</div></div>
    </section>

    ${(() => { const A = achievements(), got = A.filter(x => x.done), nextA = A.filter(x => !x.done).sort((x, y) => y.cur / y.goal - x.cur / x.goal)[0];
      return `<button class="card achcard" data-go="progresso"><div class="ach-medals">${(got.length ? got.slice(-3) : A.slice(0, 3)).map(x => medal(x, 1)).join('')}</div>
        <div class="ach-txt"><b>Conquistas ${got.length}/${A.length}</b>${nextA ? `<small>Próxima: ${esc(nextA.name)} · ${nextA.cur}/${nextA.goal}</small><div class="mini-bar"><i style="width:${nextA.cur / nextA.goal * 100}%"></i></div>` : '<small>Desbloqueaste todas. Lenda!</small>'}</div>${ic('next', 'chev')}</button>`; })()}

    <div class="sec-h"><h3>Escolhe a zona</h3><button class="link" data-go="treinos">Ver tudo</button></div>
    <div class="zones">${myCats().slice(1).map((c, i) => { const n = myWorkouts().filter(w => w.cat === c).length;
      return `<button class="zone" data-cat="${c}"><div class="zfig" data-fig="${(isGym() ? ZONE_FIG_GYM : ZONE_FIG)[c]}" data-phase="${i * .41}"></div><div class="ztxt"><b>${esc(c)}</b><small>${n} treino${n > 1 ? 's' : ''}</small></div><span class="zgo">${ic('next')}</span></button>`; }).join('')}</div>

    <div class="sec-h"><h3>Treinos populares</h3></div>
    <div class="hscroll">${(isGym() ? ['gpush', 'gpull', 'glegs', 'gfull', 'garms'] : ['brutal', 'push', 'legs', 'hiit', 'express']).map((id, i) => wCard(WMAP[id], i)).join('')}</div>

    <button class="card tipcard" data-go="dicas"><div><span class="eyebrow">Ganhar massa</span><h3>Calcula a tua proteína diária</h3><p class="muted">Sem comida suficiente não há músculo. Vê quanto precisas.</p></div>${ic('next', 'chev')}</button>`;
  },

  treinos() {
    if (!myCats().includes(filterCat)) filterCat = 'Todos';
    const list = myWorkouts().filter(w => filterCat === 'Todos' || w.cat === filterCat);
    const exIds = Object.keys(EX).filter(k => isGym() ? EX[k].place === 'gym' : !EX[k].place);
    const groups = [...new Set(exIds.map(k => EX[k].group))];
    return `
    <header class="top"><div><h1>Explorar</h1><p class="muted">${isGym() ? 'Barras, halteres e máquinas' : 'Zero equipamento, só o teu corpo'}</p></div></header>
    ${modeSwitch()}
    <div class="ex-tools">
      <div class="utabs" role="tablist">
        <button role="tab" aria-selected="${libTab === 'treinos'}" class="${libTab === 'treinos' ? 'on' : ''}" data-tab="treinos">Treinos <i>${myWorkouts().length}</i></button>
        <button role="tab" aria-selected="${libTab === 'ex'}" class="${libTab === 'ex' ? 'on' : ''}" data-tab="ex">Exercícios <i>${exIds.length}</i></button>
      </div>
      ${libTab === 'treinos' ? `<div class="chipwrap"><div class="chipbar">${myCats().map(c => { const n = c === 'Todos' ? myWorkouts().length : myWorkouts().filter(w => w.cat === c).length;
        return `<button class="chip ${c === filterCat ? 'on' : ''}" data-filter="${c}">${esc(c)}<i>${n}</i></button>`; }).join('')}</div></div>` : ''}
    </div>
    ${libTab === 'treinos' ? `
      <div class="grid">${list.map((w, i) => wCard(w, i)).join('')}</div>`
    : groups.map(g => `<div class="sec-h"><h3>${esc(g)}</h3></div><div class="list">${exIds.filter(k => EX[k].group === g).map((k, i) => exRow(k, null, i)).join('')}</div>`).join('')}`;
  },

  plano() {
    const td = new Date().getDay();
    const order = [1, 2, 3, 4, 5, 6, 0];
    return `
    <header class="top"><div><h1>Plano semanal</h1><p class="muted">${isGym() ? 'Push, pull, pernas, parte de cima e corpo inteiro: cada músculo 2× por semana, com descanso ativo pelo meio.' : 'Divisão para ganhar massa e definir: cada músculo 2× por semana, com 1 dia de recuperação.'}</p></div></header>
    ${modeSwitch()}
    ${planEdit ? planEditor() : `<div class="sec-h"><h3>A tua semana</h3><button class="btn ghost sm edit-plan" data-planedit>${ic('edit')} Editar plano</button></div>
    ${S.plans && S.plans[S.mode] ? '<p class="muted small plan-custom">Plano personalizado por ti.</p>' : ''}
    <div class="list plan">${order.map(d => {
      const pd = myPlan()[d];
      if (!pd.w) return `<div class="plan-row rest ${d === td ? 'now' : ''}"><span class="pday"><b>${DAYS[d].slice(0, 3)}</b>${d === td ? '<i>Hoje</i>' : ''}</span><span class="pinfo"><span class="eyebrow">Descanso</span><b>Dia de descanso</b><small>Recupera. Se quiseres, faz a Mobilidade.</small></span><button class="round-btn ghost-rb" data-open="mobility" aria-label="Ver mobilidade">${ic('next')}</button></div>`;
      const w = WMAP[pd.w], p = plan(w), x = pd.extra ? WMAP[pd.extra] : null;
      return `<div class="plan-row ${d === td ? 'now' : ''}">
        <button class="plan-open" data-open="${w.id}" aria-label="Ver detalhes de ${esc(w.name)}">
          <span class="pday"><b>${DAYS[d].slice(0, 3)}</b>${d === td ? '<i>Hoje</i>' : ''}</span>
          <span class="pinfo"><span class="eyebrow">${esc(pd.focus)}</span><b>${esc(w.name)}</b><small>${p.min} min · ${p.gym ? p.sets + ' séries' : p.rounds + ' voltas'}</small><span class="p-more">Ver detalhes ›</span></span>
        </button>
        <button class="round-btn" data-start="${w.id}" aria-label="Começar ${esc(w.name)}">${ic('play')}</button>
        ${x ? `<button class="plan-extra" data-open="${x.id}"><span>+ ${esc(x.name)}</span><small>${plan(x).min} min ›</small></button>` : ''}
      </div>`;
    }).join('')}</div>`}
    <section class="card">
      <h3>Como progredir</h3>
      ${isGym() ? `<ol class="steps">
        <li><b>Escolhe a carga certa.</b> Uma carga com que acabes cada série com 1–2 reps de reserva, sempre com boa técnica.</li>
        <li><b>Dupla progressão.</b> Quando fizeres as reps todas em todas as séries, sobe 2,5 kg (1 kg nos halteres). A app guarda a carga de cada exercício.</li>
        <li><b>Níveis.</b> Intermédio tira uma série a cada exercício; Brutal junta uma e encurta os descansos.</li>
      </ol>
      <p class="muted small">Regista sempre a carga no fim de cada série. Bater recordes conta para as medalhas.</p>` : `<ol class="steps">
        <li><b>Semanas 1–3 · Intermédio.</b> Aprende a técnica e cumpre todas as repetições.</li>
        <li><b>Semanas 4–8 · Avançado.</b> Quando acabares os treinos com 2–3 reps "de reserva", sobe de nível.</li>
        <li><b>Semana 9+ · Brutal.</b> Mais voltas, menos descanso. Usa as variantes "mais difícil" de cada exercício.</li>
      </ol>
      <p class="muted small">Sem pesos, o músculo cresce quando aumentas a dificuldade: mais reps, descida mais lenta (3–4 s), pausas em baixo ou variantes mais difíceis.</p>`}
    </section>`;
  },

  progresso() {
    const H = S.history, mins = H.reduce((a, h) => a + h.min, 0), kc = H.reduce((a, h) => a + h.kcal, 0);
    const set = {}; H.forEach(h => set[h.d] = (set[h.d] || 0) + 1);
    // heatmap 10 semanas
    const end = new Date(); const start = new Date(end); start.setDate(end.getDate() - ((end.getDay() + 6) % 7) - 63);
    let cells = '';
    for (let i = 0; i < 70; i++) { const x = new Date(start); x.setDate(start.getDate() + i); const k = dkey(x); const fut = x > end;
      cells += `<span class="${set[k] ? 'on' : ''} ${fut ? 'fut' : ''}" title="${k}${set[k] ? ' · treinou' : ''}"></span>`; }
    const W = S.weights.slice(-20);
    return `
    <header class="top"><div><h1>Progresso</h1><p class="muted">Constância vence motivação.</p></div></header>
    <button class="card acc-link" data-go="conta">${avatar(44)}<div><b>${S.name ? esc(S.name) : 'A tua conta'}</b><small>Nome, peso, histórico e sincronização</small></div>${ic('next', 'chev')}</button>
    <div class="stats">
      <div class="stat"><small>Treinos</small><b data-count="${H.length}">${H.length}</b></div>
      <div class="stat"><small>Minutos</small><b data-count="${mins}">${mins}</b></div>
      <div class="stat"><small>Sequência</small><b><span data-count="${streak()}">${streak()}</span><i> dias</i></b></div>
      <div class="stat"><small>kcal (est.)</small><b data-count="${kc}">${kc.toLocaleString('pt-PT')}</b></div>
    </div>
    ${(() => { const A = achievements().sort((x, y) => (y.done - x.done) || (y.cur / y.goal - x.cur / x.goal)), got = A.filter(x => x.done).length, N = 6;
      const cell = (x, i) => `<div class="ach ${x.done ? 'on' : ''}"${i >= N ? ` style="--k:${i - N}"` : ''}>${medal(x)}<b>${esc(x.name)}</b><small>${esc(x.desc)}</small>${x.done ? '<span class="ok">Conquistada</span>' : `<div class="mini-bar"><i style="width:${x.cur / x.goal * 100}%"></i></div><span class="pc">${x.cur}/${x.goal}</span>`}</div>`;
      return `<section class="card medals ${medalsOpen ? 'open' : ''}"><div class="sec-h in"><h3>Medalhas</h3><span class="muted small">${got} de ${A.length}</span></div>
        <div class="mbar"><i style="width:${got / A.length * 100}%"></i></div>
        <div class="ach-grid">${A.slice(0, N).map(cell).join('')}</div>
        <div class="ach-more" aria-hidden="${!medalsOpen}"><div class="ach-more-in"><div class="ach-grid">${A.slice(N).map((x, i) => cell(x, i + N)).join('')}</div></div></div>
        <button class="btn ghost full mtoggle" data-medals aria-expanded="${medalsOpen}">${medalsOpen ? 'Mostrar menos' : `Ver todas as medalhas <span class="mt-n">+${A.length - N}</span>`}<svg class="ic mchev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></section>`; })()}
    <section class="card"><div class="sec-h in"><h3>Últimas 10 semanas</h3><span class="muted small">cada coluna = 1 semana</span></div>
      <div class="heat">${cells}</div></section>
    <section class="card goal"><div><h3>Objetivo semanal</h3><p class="muted small">Para ganhar massa: 4–6 treinos por semana.</p></div>
      <div class="stepper"><button data-goal="-1" aria-label="Menos">−</button><b>${S.goal}</b><button data-goal="1" aria-label="Mais">+</button></div></section>`;
  },

  conta() {
    PL_AIM = null;
    return `
    <button class="link back-link" data-go="progresso">${ic('back')} Progresso</button>
    <header class="top acc-top"><div><h1>Conta</h1><p class="muted">O teu perfil, a sincronização e o histórico de treinos.</p></div><button class="icon-btn gear" data-settings aria-label="Definições">${ic('gear')}</button></header>
    <section class="card profile">
      <div class="pf-h">${avatar(72)}<div><b class="pf-name">${S.name ? esc(S.name) : 'O teu perfil'}</b><small class="muted">${accountLine()}</small></div></div>
      <form class="pf-form" id="name-f">
        <label class="fld" for="name-in"><span>Primeiro nome</span><input id="name-in" type="text" maxlength="20" autocomplete="given-name" placeholder="Ex.: Dinis" value="${esc(S.name || '')}"></label>
        <div class="fld-row">
          <label class="fld" for="pf-kg"><span>Peso atual (kg)</span><input id="pf-kg" type="number" step="0.1" min="30" max="200" inputmode="decimal" placeholder="72,5" value="${S.weights.length ? S.weights[S.weights.length - 1].kg : ''}"></label>
          <label class="fld" for="pf-cm"><span>Altura (cm)</span><input id="pf-cm" type="number" step="1" min="120" max="230" inputmode="numeric" placeholder="178" value="${S.height || ''}"></label>
        </div>
        <div class="fld"><span>Objetivo</span><div class="seg pf-goal" role="radiogroup">${[['massa','Ganhar massa'],['definir','Definir'],['manter','Manter']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${(S.aim || 'massa') === k}" class="${(S.aim || 'massa') === k ? 'on' : ''}" data-aim="${k}">${l}</button>`).join('')}</div></div>
        ${S.weights.length > 1 ? `<div class="pf-w">${sparkline(S.weights.slice(-20))}</div>` : ''}
        <button class="btn lime full" type="submit">Guardar perfil</button>
        <p class="muted small center" id="name-msg">Pesa-te 1× por semana, de manhã. Cada peso novo fica no gráfico. O objetivo ajusta a calculadora de calorias.</p>
      </form>
    </section>
    ${cloudCard()}
    <section class="card"><div class="sec-h in"><h3>Histórico</h3><span class="muted small">${S.history.length} treino${S.history.length === 1 ? '' : 's'}</span></div>
      ${S.history.length ? `<div class="hist">${S.history.slice().reverse().slice(0, 30).map(h => { const w = WMAP[h.w]; const dd = new Date(h.d + 'T12:00');
        return `<div class="hrow"><div><b>${esc(w ? w.name : h.w)}</b><small>${dd.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })} · ${esc(h.lvl || '')}</small></div><span>${h.min} min</span></div>`; }).join('')}</div>
        <button class="link danger" id="clear">${ic('trash')} Apagar histórico</button>`
      : `<p class="empty">Ainda não há treinos. O primeiro fica guardado aqui assim que o terminares.</p>`}
    </section>
    <p class="muted small center">purpose · treino em casa e no ginásio</p>`;
  },

  dicas() {
    const lastW = S.weights.length ? S.weights[S.weights.length - 1].kg : '';
    return `
    <header class="top"><div><h1>Dicas & nutrição</h1><p class="muted">O treino estimula o músculo. A comida e o sono constroem-no.</p></div></header>
    <section class="card calc">
      <h3>Calculadora · ${({ massa: 'ganhar massa', definir: 'definir', manter: 'manter o peso' })[S.aim || 'massa']}</h3>
      <form class="inline" id="cform"><label for="ckg" class="sr">Peso em kg</label><input id="ckg" type="number" step="0.5" min="35" max="200" value="${lastW || 70}" inputmode="decimal"><span>kg</span></form>
      <div class="calc-out" id="cout"></div>
      <p class="muted small">Estimativas para uma pessoa ativa. Muda o objetivo na tua conta (Progresso › A tua conta). Ajusta conforme a balança, a cada 3 semanas.</p>
    </section>
    <div class="tips">
      ${[
        ['Sobrecarga progressiva', 'Todas as semanas tenta fazer um pouco mais: +1–2 reps, descida mais lenta, menos descanso ou uma variante mais difícil. Sem pesos, é isto que faz crescer.'],
        ['Chega perto da falha', 'Para hipertrofia, as últimas 2–3 repetições de cada série devem custar a sério. Se acabas fresco, sobe o nível do treino.'],
        ['Proteína em todas as refeições', 'Ovos, frango, peru, atum, sardinha, iogurte grego, queijo fresco, leite, feijão, grão e lentilhas. Divide por 3–5 refeições.'],
        ['Come um pouco acima do que gastas', 'Um excedente pequeno (~250–300 kcal) ganha músculo com pouca gordura. Arroz, massa, batata, aveia, fruta e azeite ajudam a chegar lá.'],
        ['Dorme 7–9 horas', 'É a dormir que o músculo recupera e a hormona de crescimento sobe. Dormir mal estraga um plano perfeito.'],
        ['Aquece 5 minutos', 'Polichinelos, rotações de ombros e agachamentos leves antes de cada treino. Menos lesões, mais força.'],
        ['Técnica primeiro', 'Uma rep bem feita vale mais que três mal feitas. Abre um exercício para veres a animação e as dicas de execução.'],
        ['No ginásio: dupla progressão', 'Escolhe uma carga com que faças as reps com 1–2 de reserva. Quando completares todas as séries no topo das reps, sobe 2,5 kg. A app lembra-se da carga de cada exercício.'],
        ['Bebe água', 'Cerca de 35 ml por kg de peso por dia, mais nos dias de treino ou de calor.'],
      ].map(([t, d], i) => `<div class="tip"><span class="tip-n">${String(i + 1).padStart(2, '0')}</span><div><b>${t}</b><p>${d}</p></div></div>`).join('')}
    </div>`;
  },
};

function sparkline(W) {
  const w = 300, h = 90, ks = W.map(x => x.kg), mn = Math.min(...ks) - .5, mx = Math.max(...ks) + .5;
  const X = i => 8 + i * (w - 16) / (W.length - 1), Y = v => h - 14 - (v - mn) / (mx - mn) * (h - 28);
  const pts = W.map((x, i) => `${X(i).toFixed(1)},${Y(x.kg).toFixed(1)}`).join(' ');
  const last = W[W.length - 1], diff = (last.kg - W[0].kg);
  return `<div class="spark-h"><b>${last.kg.toLocaleString('pt-PT')} kg</b><span class="${diff >= 0 ? 'up' : 'down'}">${diff >= 0 ? '+' : ''}${diff.toFixed(1).replace('.', ',')} kg desde ${new Date(W[0].d + 'T12:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}</span></div>
  <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line x1="0" x2="${w}" y1="${h - 14}" y2="${h - 14}" class="grid"/>
  <polygon points="8,${h - 14} ${pts} ${X(W.length - 1)},${h - 14}" class="area"/><polyline points="${pts}" class="lineg"/>
  <circle cx="${X(W.length - 1)}" cy="${Y(last.kg)}" r="4" class="dot"/></svg>`;
}

function calc() {
  const kg = parseFloat(($('#ckg') || {}).value); const out = $('#cout'); if (!out) return;
  if (!kg || kg < 35 || kg > 200) { out.innerHTML = '<p class="muted">Escreve o teu peso entre 35 e 200 kg.</p>'; return; }
  const adj = { massa: 300, definir: -350, manter: 0 }[S.aim || 'massa'];
  const prot = [Math.round(kg * 1.6), Math.round(kg * 2.2)], kc = Math.round(kg * 33 / 50) * 50 + adj, water = (kg * .035).toFixed(1).replace('.', ',');
  out.innerHTML = `<div><small>Proteína / dia</small><b>${prot[0]}–${prot[1]} g</b></div><div><small>Calorias / dia</small><b>~${kc.toLocaleString('pt-PT')}</b></div><div><small>Água / dia</small><b>${water} L</b></div>`;
}

/* ===== Detalhe do treino ===== */
function openWorkout(id) {
  const w = WMAP[id]; if (!w) return;
  const sheet = $('#sheet');
  const draw = () => {
    const p = plan(w);
    sheet.innerHTML = `<div class="sheet-in">
      <div class="hero"><div class="hero-fig" data-fig="${w.items[0][0]}"></div>
        <button class="icon-btn back" data-close aria-label="Voltar">${ic('back')}</button>
        <div class="hero-txt"><span class="tag">${esc(w.cat)}</span><h2>${esc(w.name)}</h2>
        <div class="chips"><span>${ic('clock')} ${p.min} min</span><span>${ic('fire')} ~${p.kcal} kcal</span><span>${ic('layers')} ${p.gym ? p.sets + ' séries' : p.rounds + ' voltas'}</span></div></div></div>
      <div class="pad">
        <h3>Sobre</h3><p class="muted">${esc(w.desc)}</p>
        <h3>Nível</h3>
        <div class="seg lv">${LEVELS.map(l => `<button class="${l.id === S.level ? 'on' : ''}" data-level="${l.id}">${l.label}</button>`).join('')}</div>
        <div class="facts"><div><small>${p.gym ? 'Entre séries' : 'Descanso'}</small><b>${p.rest} s</b></div><div><small>${p.gym ? 'Entre exercícios' : 'Entre voltas'}</small><b>${p.rr} s</b></div><div><small>Equipamento</small><b>${w.place === 'gym' ? 'Ginásio' : w.items.some(i => ['row', 'dips', 'decline', 'bulgarian'].includes(i[0])) ? 'Cadeira/mesa' : 'Nenhum'}</b></div></div>
        ${w.id === 'mobility' ? '' : `<div class="toggles">
          <label class="tg"><input type="checkbox" id="tg-warm" ${S.warm ? 'checked' : ''}><span class="sw"></span><div><b>Aquecimento</b><small>${WARMUP.length} exercícios · 2 min</small></div></label>
          <label class="tg"><input type="checkbox" id="tg-cool" ${S.cool ? 'checked' : ''}><span class="sw"></span><div><b>Alongamento final</b><small>${COOLDOWN.length} exercícios · 2 min</small></div></label></div>`}
        <div class="sec-h"><h3>Exercícios</h3><span class="muted small">${p.gym ? `${p.items.length} exercícios · ${p.sets} séries` : `${p.items.length} exercícios × ${p.rounds} voltas`}</span></div>
        <div class="list tl">${p.items.map((it, i) => exRow(it.ex, amtTxt(it), i)).join('')}</div>
      </div>
      <div class="sticky"><button class="btn lime full" data-start="${w.id}">${ic('play')} Começar treino</button></div></div>`;
    sheet.querySelectorAll('[data-fig]').forEach(n => makeFigure(n, n.dataset.fig, { phase: +n.dataset.phase || 0 }));
  };
  draw(); sheet._redraw = draw;
  sheet.hidden = false; document.body.classList.add('lock');
  if (!RM) { sheet.classList.remove('sheet-open'); void sheet.offsetWidth; sheet.classList.add('sheet-open'); animateIn($('.pad', sheet)); }
  sheet.scrollTop = 0;
}
function closeSheet(instant) {
  const sh = $('#sheet'); if (sh.hidden) return;
  const done = () => { sh.hidden = true; sh.innerHTML = ''; if ($('#player').hidden) document.body.classList.remove('lock'); };
  instant ? done() : animClose(sh, 'sheet-close', done);
}

/* ===== Modal de exercício ===== */
function openEx(id) {
  const e = EX[id], m = $('#modal');
  m.innerHTML = `<div class="modal-in" role="dialog" aria-modal="true" aria-label="${esc(e.name)}">
    <button class="icon-btn mclose" data-mclose aria-label="Fechar">${ic('x')}</button>
    <div class="mfig" data-fig="${id}"></div>
    <span class="tag">${esc(e.group)}${e.place === 'gym' ? ' · Ginásio' : ''}</span><h2>${esc(e.name)}</h2><p class="muted">${esc(e.muscles)}</p>
    ${hasLoad(id) && S.loads[id] ? `<div class="ex-load">${ic('dumb')}<span>Última carga <b>${kg(S.loads[id])} kg</b>${S.best[id] ? ` · recorde <b>${kg(S.best[id])} kg</b>` : ''}</span><button class="link danger sm-link" data-delbest="${id}">Apagar</button></div>` : ''}
    <h3>Como fazer</h3><ol class="cues">${e.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ol>
    <div class="vars"><div><small>Mais fácil</small><p>${esc(e.easier)}</p></div><div class="hard"><small>Mais difícil</small><p>${esc(e.harder)}</p></div></div>
  </div>`;
  m.hidden = false; makeFigure($('.mfig', m), id);
}
function closeEx() { const m = $('#modal'); if (m.hidden) return; animClose(m, 'modal-close', () => { m.hidden = true; m.innerHTML = ''; }); }

/* ===== Player ===== */
let PL = null, AC = null, wakeLock = null;
function beep(f = 880, d = .12, v = .25) {
  if (!S.sound) return;
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain();
    o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(v, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + d);
    o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch (e) {}
}
// Som de fim de exercício: 3 notas a subir + vibração (diferente dos bips de contagem)
function tone(f, at, d, v, type) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(v, at + .015); g.gain.exponentialRampToValueAtTime(.0001, at + d);
  o.connect(g).connect(AC.destination); o.start(at); o.stop(at + d + .02);
}
function endChime() {
  try { navigator.vibrate && navigator.vibrate([220, 90, 220, 90, 400]); } catch (e) {}
  if (!S.sound) return;
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const t = AC.currentTime + .02;
    [[784, 0], [988, .13], [1318, .26]].forEach(([f, dt]) => { tone(f, t + dt, .22, .32, 'triangle'); tone(f * 2, t + dt, .18, .06, 'sine'); });
    tone(1568, t + .42, .7, .3, 'triangle'); tone(1975, t + .42, .7, .08, 'sine');
  } catch (e) {}
  if (PL) PL.chimeAt = performance.now();
}
/* Tempo-limite para exercícios por repetições */
const FAST = ['burpee', 'jumpsquat', 'jacks', 'highknees', 'climbers', 'calf', 'crunch'];
function repTime(s) {
  if (s.amt === 'MÁX') return EX[s.ex].place === 'gym' ? 45 : 50;
  const per = FAST.includes(s.ex) ? 2 : EX[s.ex].place === 'gym' ? 4 : 3;
  return Math.max(20, Math.ceil(s.amt * per * (s.side ? 2 : 1) / 5) * 5);
}
/* ===== Voz do treinador ===== */
let VOICES = [];
function scoreVoice(v) {
  const n = v.name.toLowerCase(), l = (v.lang || '').toLowerCase().replace('_', '-');
  let s = 0;
  if (l === 'pt-pt') s += 60; else if (l.startsWith('pt')) s += 25; else return -999;
  if (/natural|neural|online/.test(n)) s += 45;
  if (/premium|enhanced|melhorad|aprimorad|siri/.test(n)) s += 40;
  if (/google/.test(n)) s += 20;
  if (/espeak|compact|robot/.test(n)) s -= 50;
  if (!v.localService) s += 5;
  return s;
}
function loadVoices() {
  try { VOICES = speechSynthesis.getVoices().filter(v => scoreVoice(v) > -999).sort((x, y) => scoreVoice(y) - scoreVoice(x)); } catch (e) { VOICES = []; }
  const sel = document.getElementById('vsel'); if (sel) sel.outerHTML = voiceSelect();
}
try { speechSynthesis.onvoiceschanged = loadVoices; loadVoices(); } catch (e) {}
function pickVoice() { return VOICES.find(v => v.name === S.voiceName) || VOICES[0]; }
const isNatural = v => v && /natural|neural|online|premium|enhanced|melhorad|aprimorad|siri|google/i.test(v.name);
function voiceLabel(v) {
  let n = v.name.replace(/\(.*?\)/g, '').replace(/^(Microsoft|Apple)\s+/i, '').split(' - ')[0].trim();
  if (/^google/i.test(v.name) || /^portugu[eê]s/i.test(n)) n = 'Google';
  n = n.replace(/\s*Online.*$/i, '').replace(/\s*(Neural|Natural)$/i, '').trim();
  return n || v.name;
}
function voiceSelect() {
  if (!VOICES.length) return `<p class="muted small" id="vsel">O teu navegador não tem vozes em português. No Microsoft Edge ou no iPhone ficam muito melhores.</p>`;
  const cur = pickVoice();
  return `<div id="vsel" class="vlist" role="radiogroup" aria-label="Voz do treinador">${VOICES.map((v, i) => {
    const on = v === cur, br = /br/i.test(v.lang), name = esc(v.name);
    return `<div class="vrow ${on ? 'on' : ''}">
      <button class="vpick" role="radio" aria-checked="${on}" data-vpick="${name}">
        <span class="vradio">${ic('check')}</span>
        <span class="vinfo"><b>${esc(voiceLabel(v))}</b><span class="vtags"><i class="vflag">${br ? 'Brasil' : 'Portugal'}</i>${isNatural(v) ? '<i class="vnat">Natural</i>' : ''}${i === 0 ? '<i>Recomendada</i>' : ''}</span></span>
      </button>
      <button class="vprev" data-vprev="${name}" aria-label="Ouvir a voz ${esc(voiceLabel(v))}">${ic('play')}</button>
    </div>`; }).join('')}</div>`;
}
function voiceCard() {
  return `<section class="card voice-card"><div class="sec-h in"><h3>Voz do treinador</h3><span class="muted small">${VOICES.length} disponíve${VOICES.length === 1 ? 'l' : 'is'}</span></div>
    ${voiceSelect()}
    <p class="muted small">As vozes vêm do teu dispositivo. As mais naturais: “Online (Natural)” no Microsoft Edge, ou no iPhone em Definições › Acessibilidade › Conteúdo falado › Vozes › Português (Portugal), descarregando uma voz “Melhorada”.</p></section>`;
}
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function say(t, force) {
  if (!S.voice && !force) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t), v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'pt-PT';
    const nat = isNatural(v);
    u.rate = nat ? 1.0 : 0.95; u.pitch = nat ? 1.0 : 1.08; u.volume = 1;
    speechSynthesis.speak(u);
  } catch (e) {}
}
// Frases do treinador
function amtSpeech(s) {
  if (s.mode === 't') return `${s.amt} segundos${s.side ? ' de cada lado' : ''}`;
  if (s.amt === 'MÁX') return 'o máximo de repetições que conseguires';
  return `${s.amt} repetições${s.side ? ' por perna' : ''}`;
}
function lineWork(s) {
  const n = EX[s.ex].name, a = amtSpeech(s);
  if (s.sets) {
    const ld = hasLoad(s.ex) && PL.loads[s.ex] ? ` com ${String(PL.loads[s.ex]).replace('.', ',')} quilos` : '';
    if (s.set === 0) return pick([`${n}. ${s.sets} séries de ${a}${ld}. Primeira série, bora!`, `Agora ${n}. Primeira de ${s.sets} séries, ${a}${ld}.`]);
    if (s.set === s.sets - 1) return pick([`Última série de ${n}! Dá tudo.`, `Última série! ${a}, até ao fim.`]);
    return pick([`Série ${s.set + 1} de ${s.sets}. ${a}. Força!`, `Série ${s.set + 1}. Mantém a técnica.`]);
  }
  const lastRound = s.r === PL.p.rounds - 1 && s.i === 0 && PL.p.rounds > 1;
  if (lastRound) return pick([`Última volta! Dá tudo. ${n}, ${a}.`, `É a última volta, vamos acabar em grande! ${n}, ${a}.`]);
  return pick([`Bora! ${n}, ${a}.`, `Agora, ${n}. ${a}. Vamos lá!`, `${n}. ${a}. Força!`, `Vamos a isso: ${n}, ${a}.`, `${n}, ${a}. Foca-te na técnica.`]);
}
function lineRest(s, nx) {
  const n = EX[nx.ex].name;
  if (s.set !== undefined && !s.exEnd) return pick([`Boa série! Descansa ${s.dur} segundos.`, `Muito bem. Recupera, a seguir é a série ${s.set + 2}.`, `Isso! Respira fundo e prepara a próxima série.`]);
  if (s.exEnd) return pick([`${EX[s.ex || PL.steps[PL.idx - 1].ex].name} feito! A seguir, ${n}. Prepara a carga.`, `Exercício terminado. Agora vem ${n}, ajusta o peso.`]);
  if (s.roundEnd) return pick([`Volta ${s.r + 1} feita! Bebe um pouco de água. A seguir, ${n}.`, `Grande volta! Recupera bem. Depois vem ${n}.`]);
  return pick([`Boa! Respira. A seguir, ${n}.`, `Muito bem. Descansa um pouco, depois vem ${n}.`, `Isso mesmo! Agora recupera. Próximo: ${n}.`, `Bom trabalho. Respira fundo, a seguir temos ${n}.`]);
}
function startWorkout(id) {
  const w = WMAP[id], L = lvl(), p = plan(w, L);
  const extra = w.id !== 'mobility';
  const steps = [];
  if (extra && S.warm) {
    steps.push({ k: 'ready', dur: 6, label: 'Aquecimento' });
    WARMUP.forEach(([ex, s, side]) => steps.push({ k: 'work', ex, mode: 't', amt: side ? s / 2 : s, side: !!side, phase: 'warm' }));
    steps.push({ k: 'ready', dur: 12, label: 'Aquecido! Agora a sério', main: true });
  } else steps.push({ k: 'ready', dur: 10, main: true });
  if (p.gym) p.items.forEach((it, i) => {
    for (let s = 0; s < it.sets; s++) {
      steps.push({ k: 'work', ...it, r: 0, i, set: s });
      const lastSet = s === it.sets - 1, lastEx = i === p.items.length - 1;
      if (!(lastSet && lastEx)) steps.push({ k: 'rest', dur: lastSet ? p.rr : p.rest, r: 0, i, set: s, exEnd: lastSet });
    }
  });
  else for (let r = 0; r < p.rounds; r++) p.items.forEach((it, i) => {
    steps.push({ k: 'work', ...it, r, i });
    const last = i === p.items.length - 1;
    if (!(last && r === p.rounds - 1)) steps.push({ k: 'rest', dur: last ? p.rr : p.rest, r, i, roundEnd: last });
  });
  if (extra && S.cool) {
    steps.push({ k: 'rest', dur: 10, label: 'Treino feito! Vamos alongar', cool: true });
    COOLDOWN.forEach(([ex, s, side]) => steps.push({ k: 'work', ex, mode: 't', amt: side ? s / 2 : s, side: !!side, phase: 'cool' }));
  }
  PL = { w, L, p, steps, idx: 0, left: 0, el: 0, paused: false, t0: Date.now(), last: performance.now(), workCount: steps.filter(s => s.k === 'work' && !s.phase).length, done: { reps: {}, sec: {} }, loads: {}, prs: [] };
  closeSheet(true);
  $('#player').hidden = false; document.body.classList.add('lock');
  try { navigator.wakeLock && navigator.wakeLock.request('screen').then(l => wakeLock = l).catch(() => {}); } catch (e) {}
  beep(660, .05, .01);
  enter(0);
  if (!PL.timer) PL.timer = setInterval(tick, 200);
}
function nextWorkIdx(from) { for (let i = from; i < PL.steps.length; i++) if (PL.steps[i].k === 'work') return i; return -1; }
function countDone() {
  const s = PL.steps[PL.idx]; if (!s || s.k !== 'work' || s.phase || s.counted) return; s.counted = 1;
  if (s.mode === 'r') { const n = (s.amt === 'MÁX' ? 12 : s.amt) * (s.side ? 2 : 1); PL.done.reps[s.ex] = (PL.done.reps[s.ex] || 0) + n; }
  else { const n = Math.round(s.amt * (s.side ? 2 : 1) - Math.max(0, PL.left)); PL.done.sec[s.ex] = (PL.done.sec[s.ex] || 0) + n; }
}
function enter(i) {
  if (PL.steps[PL.idx] && i > PL.idx) countDone();
  if (i >= PL.steps.length) return finish();
  PL.idx = i; const s = PL.steps[i];
  if (s.k === 'work' && s.mode === 'r') s.tdur = repTime(s);
  PL.left = s.k === 'work' ? (s.mode === 't' ? s.amt * (s.side ? 2 : 1) : s.tdur) : s.dur; PL.el = 0; PL.beeped = {};
  drawPlayer();
  const nx = PL.steps[nextWorkIdx(i)];
  if (s.k === 'work') { const late = PL.chimeAt && performance.now() - PL.chimeAt < 1200; late ? setTimeout(() => beep(1046, .25), 900) : beep(1046, .25); say(s.phase ? `${EX[s.ex].name}. ${s.amt * (s.side ? 2 : 1)} segundos${s.side ? ', troca de lado a meio' : ''}. ${s.phase === 'warm' ? pick(['Com calma, só para aquecer.', 'Ritmo leve.', 'Solta o corpo.']) : pick(['Respira fundo e relaxa.', 'Devagar, sem forçar.', 'Deixa o corpo soltar.'])}` : lineWork(s)); }
  else if (s.k === 'rest') { say(s.cool ? pick(['Treino feito, mandaste bem! Agora vamos alongar dois minutos.', 'Acabaste a parte dura! Bora alongar para recuperar melhor.']) : lineRest(s, nx)); }
  else if (s.label === 'Aquecimento') say(pick(['Olá! Vamos começar com dois minutos de aquecimento.', 'Bora treinar! Primeiro, um aquecimento rápido.']));
  else if (i > 0) say(pick([`Corpo quente, boa! Agora começa o treino a sério. Primeiro: ${EX[nx.ex].name}.`, `Aquecimento feito. Prepara-te para ${EX[nx.ex].name}.`]));
  else say(pick([`Olá! Prepara-te, começamos com ${EX[nx.ex].name}.`, `Vamos treinar! Primeiro exercício: ${EX[nx.ex].name}. Põe-te em posição.`]));
}
function tick() {
  if (!PL) return; const now = performance.now(), dt = (now - PL.last) / 1000; PL.last = now;
  if (PL.paused) return;
  const s = PL.steps[PL.idx];
  PL.el += dt; PL.left -= dt; const c = Math.ceil(PL.left);
  if (c <= 3 && c > 0 && !PL.beeped[c]) { PL.beeped[c] = 1; beep(740, .1); }
  if (s.k === 'work' && s.mode === 't' && s.side && !PL.beeped.half && PL.left <= s.amt) { PL.beeped.half = 1; beep(880, .2); say(pick(['Troca de lado!', 'Agora o outro lado.'])); }
  if (s.k === 'work' && !s.side && !s.phase) {
    const tot = s.mode === 't' ? s.amt : s.tdur;
    if (tot >= 30 && !PL.beeped.mid && PL.left <= tot / 2) { PL.beeped.mid = 1; say(pick(['Metade feita, aguenta!', 'Já vais a meio, continua!', 'Boa, metade! Não pares.'])); }
    if (tot >= 25 && !PL.beeped.ten && PL.left <= 10.5) { PL.beeped.ten = 1; say(pick(['Últimos dez segundos!', 'Só mais dez, força!', 'Dez segundos, dá tudo!'])); }
  }
  if (s.k === 'rest' && !s.cool && !PL.beeped.go && PL.left <= 5.5 && s.dur > 8) { PL.beeped.go = 1; say(pick(['Prepara-te.', 'Em posição.', 'Vamos voltar.'])); }
  if (PL.left <= 0) { if (s.k === 'work') { endChime(); commitLoad(); } enter(PL.idx + 1); return; }
  updT();
}
const fmt = s => { s = Math.max(0, Math.ceil(s)); return s >= 60 ? Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') : String(s); };
function updT() {
  const s = PL.steps[PL.idx], n = $('#pl-num'); if (!n) return;
  if (s.k === 'work' && s.mode === 'r') { const t = $('#pl-time'), v = fmt(PL.left); if (t && t.textContent !== v) t.textContent = v.includes(':') ? v : '0:' + v.padStart(2, '0'); }
  else { const v = fmt(PL.left); if (n.textContent !== v) { n.textContent = v; if (!RM) { n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick'); } } }
  const bar = $('#pl-ring'); if (bar) { const tot = s.k === 'work' ? (s.mode === 'r' ? s.tdur : s.amt * (s.side ? 2 : 1)) : s.dur; bar.style.setProperty('--p', Math.max(0, PL.left / tot)); }
}
function drawPlayer() {
  const P = PL, s = P.steps[P.idx], root = $('#player');
  const doneWork = P.steps.slice(0, P.idx).filter(x => x.k === 'work').length;
  const wi = s.k === 'work' ? s : P.steps[nextWorkIdx(P.idx)];
  const phase = wi && wi.phase;
  const sub = phase === 'warm' ? 'Aquecimento' : phase === 'cool' ? 'Alongamento final' : wi && wi.sets ? `Exercício ${wi.i + 1}/${P.p.items.length} · Série ${wi.set + 1}/${wi.sets}` : `Volta ${(wi ? wi.r : 0) + 1}/${P.p.rounds}`;
  const head = `<div class="pl-top"><button class="icon-btn" data-quit aria-label="Sair do treino">${ic('x')}</button>
      <div class="pl-title"><b>${esc(P.w.name)}</b><small>${sub} · ${P.L.label}</small></div>
      <div class="pl-tog"><button class="icon-btn ${S.voice ? '' : 'off'}" data-voice aria-label="Voz">${ic('voice')}</button><button class="icon-btn ${S.sound ? '' : 'off'}" data-sound aria-label="Som">${ic(S.sound ? 'sound' : 'mute')}</button></div></div>
    <div class="pl-prog">${P.steps.filter(x => x.k === 'work').map((x, i) => `<span class="${x.phase ? 'ph ' : ''}${i < doneWork ? 'd' : i === doneWork && s.k === 'work' ? 'c' : ''}"></span>`).join('')}</div>`;
  const skipPhase = phase ? `<button class="link skip" data-skipphase>${phase === 'warm' ? 'Saltar aquecimento' : 'Terminar já'}</button>` : '';
  let body;
  if (s.k === 'work') {
    const e = EX[s.ex];
    body = `<div class="pl-stage" data-fig="${s.ex}"></div>
      <div class="pl-info"><span class="eyebrow">${esc(e.muscles)}</span><h2>${esc(e.name)}</h2>
      ${s.mode === 't' ? `<div class="pl-big"><span id="pl-num">${fmt(P.left)}</span><small>segundos${s.side ? ' · troca a meio' : ''}</small></div>
         <div class="pl-bar" id="pl-ring" style="--p:1"><i></i></div>`
        : `<div class="pl-big"><span id="pl-num">${s.amt === 'MÁX' ? 'MÁX' : s.amt}</span><small>${s.amt === 'MÁX' ? 'reps até à falha' : 'repetições'}${s.side ? ' por perna' : ''}</small><span class="pl-time">${ic('clock')}<b id="pl-time">${fmt(P.left).includes(':') ? fmt(P.left) : '0:' + fmt(P.left).padStart(2, '0')}</b></span></div>
         <div class="pl-bar" id="pl-ring" style="--p:1"><i></i></div><small class="pl-hint">Acabaste antes do tempo? Carrega em <b>Feito</b>.</small>`}
      ${s.sets ? `<div class="setdots">${Array.from({ length: s.sets }, (_, j) => `<span class="${j < s.set ? 'd' : j === s.set ? 'c' : ''}"></span>`).join('')}<small>Série ${s.set + 1} de ${s.sets}</small></div>` : ''}
      ${s.sets && hasLoad(s.ex) ? loadBox(s.ex) : `<p class="pl-cue">${esc(e.cues[0])}</p>`}</div>
      <div class="pl-ctrl"><button class="btn ghost" data-prev>${ic('back')} Anterior</button>
        ${s.mode === 'r' ? `<button class="btn lime" data-next>${ic('check')} Feito</button>` : `<button class="btn lime" data-pause>${P.paused ? ic('play') + ' Retomar' : ic('pause') + ' Pausa'}</button>`}
        ${s.mode === 'r' ? `<button class="btn ghost span2" data-pause>${P.paused ? ic('play') + ' Retomar tempo' : ic('pause') + ' Pausar tempo'}</button>` : ''}
      </div>${skipPhase || '<button class="link skip" data-skip>Passar exercício</button>'}`;
  } else {
    const n = P.steps[nextWorkIdx(P.idx)], e = EX[n.ex];
    body = `<div class="rest-box on-lime"><span class="eyebrow">${s.label || (s.k === 'ready' ? 'Prepara-te' : s.roundEnd ? 'Fim da volta ' + (s.r + 1) : s.exEnd ? 'Troca de exercício' : s.set !== undefined ? 'Descanso entre séries' : 'Descanso')}</span>
      <div class="rest-num" id="pl-num">${fmt(P.left)}</div>
      <div class="pl-bar dark" id="pl-ring" style="--p:1"><i></i></div>
      <div class="rest-btns"><button class="btn dark" data-add>+15 s</button><button class="btn dark" data-pause>${P.paused ? 'Retomar' : 'Pausa'}</button><button class="btn dark" data-next>Saltar</button></div></div>
      <div class="up-next"><div class="exfig" data-fig="${n.ex}"></div><div><small>A seguir</small><b>${esc(e.name)}</b><span>${amtTxt(n)}</span></div>
      <button class="link" data-exinfo="${n.ex}">Como fazer</button></div>${n.phase === 'warm' ? '<button class="link skip" data-skipphase>Saltar aquecimento</button>' : ''}`;
  }
  const same = root.dataset.step === String(P.idx); root.dataset.step = P.idx;
  root.innerHTML = `<div class="pl-in ${s.k} ${same ? '' : 'step-in'}">${head}${body}</div>`;
  root.querySelectorAll('[data-fig]').forEach(x => makeFigure(x, x.dataset.fig));
  updT();
}
function curLoad(id) { return PL.loads[id] ?? S.loads[id] ?? null; }
function loadBox(id) {
  const v = curLoad(id), last = S.loads[id], best = S.best[id];
  return `<div class="loadbox"><button class="ld-btn" data-load="-1" aria-label="Menos carga">−</button>
    <div class="ld-v"><label class="sr" for="ld-val">Carga em kg</label><input id="ld-val" type="text" inputmode="decimal" autocomplete="off" placeholder="—" value="${v == null ? '' : kg(v)}"><span>kg</span>
      <small>${last ? `Última vez: ${kg(last)} kg${best ? ` · recorde ${kg(best)} kg` : ''}` : 'Escreve a carga que vais usar'}</small></div>
    <button class="ld-btn" data-load="1" aria-label="Mais carga">+</button></div>`;
}
function commitLoad() {
  const s = PL && PL.steps[PL.idx]; if (!s || s.k !== 'work' || !s.sets || !hasLoad(s.ex)) return;
  const v = curLoad(s.ex); if (v == null || !(v > 0)) return; PL.loads[s.ex] = v;
  const prevBest = S.best[s.ex];
  if (prevBest !== undefined && v > prevBest && !PL.prs.includes(s.ex)) { PL.prs.push(s.ex); S.prs++; beep(1318, .2); say(pick([`Novo recorde em ${EX[s.ex].name}!`, `Recorde pessoal! ${String(v).replace('.', ',')} quilos.`])); }
  if (prevBest === undefined || v > prevBest) S.best[s.ex] = v;
  S.loads[s.ex] = v; save();
}
function finish() {
  clearInterval(PL.timer);
  const min = Math.max(1, Math.round((Date.now() - PL.t0) / 60000)), kcal = Math.round(min * PL.w.rate);
  countDone();
  for (const k in PL.done.reps) S.totals.reps[k] = (S.totals.reps[k] || 0) + PL.done.reps[k];
  for (const k in PL.done.sec) S.totals.sec[k] = (S.totals.sec[k] || 0) + PL.done.sec[k];
  S.history.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), d: today(), w: PL.w.id, min, kcal, lvl: PL.L.label, lv: PL.L.id, h: new Date().getHours() });
  const fresh = achievements().filter(a => a.done && !S.unlocked.includes(a.id));
  fresh.forEach(a => S.unlocked.push(a.id)); save();
  beep(1046, .15); setTimeout(() => beep(1318, .3), 160); say(pick(['Treino terminado! Mandaste muito bem.', 'Acabou! Excelente trabalho hoje.', 'Parabéns, treino feito! Cada dia conta.']) + (fresh.length ? ` E desbloqueaste ${fresh.length > 1 ? fresh.length + ' medalhas novas' : 'a medalha ' + fresh[0].name}!` : ''));
  const n = PL.workCount, prs = PL.prs;
  $('#player').innerHTML = `<div class="pl-in fin"><div class="fin-card on-lime">
    <div class="fin-check">${ic('check')}</div><h2>Parabéns!</h2><p>Terminaste <b>${esc(PL.w.name)}</b>. Continua assim, a constância é o que te vai definir.</p>
    <div class="fin-stats"><div><b>${min}</b><small>minutos</small></div><div><b>${n}</b><small>séries</small></div><div><b>~${kcal}</b><small>kcal</small></div></div>
    ${prs.length ? `<div class="fin-pr">${ic('trophy')}<span>${prs.length > 1 ? prs.length + ' recordes novos' : 'Recorde novo'}: ${prs.map(x => esc(EX[x].name) + ' ' + kg(S.best[x]) + ' kg').join(', ')}</span></div>` : ''}
    <button class="btn dark full" data-endclose>Fechar</button></div>
    ${fresh.length ? `<div class="newach"><span class="eyebrow">${fresh.length > 1 ? 'Novas medalhas' : 'Nova medalha'} desbloqueada${fresh.length > 1 ? 's' : ''}</span>${fresh.map(a => `<div class="na">${medal(a)}<div><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></div></div>`).join('')}</div>` : ''}
    <p class="muted small center">Agora: proteína nas próximas horas e 7–9 h de sono.</p></div>`;
  releaseWake(); PL = null; confetti();
}
function releaseWake() { try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }
function quitPlayer() { if (PL) clearInterval(PL.timer); PL = null; try { speechSynthesis.cancel(); } catch (e) {} releaseWake(); $('#player').hidden = true; $('#player').innerHTML = ''; document.body.classList.remove('lock'); render(); }

function confirmBox(o) {
  const c = $('#confirm');
  c.innerHTML = `<div class="confirm-in ${o.danger ? 'danger' : ''}" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" aria-describedby="cf-d">
    <div class="cf-icon">${ic(o.icon || 'x')}</div>
    <h3 id="cf-t">${esc(o.title)}</h3>
    <p id="cf-d">${esc(o.text)}</p>
    ${o.progress != null ? `<div class="cf-prog"><div class="cf-prog-h"><span>${esc(o.progLabel)}</span><b>${Math.round(o.progress * 100)}%</b></div><div class="mini-bar"><i style="width:${o.progress * 100}%"></i></div></div>` : ''}
    <div class="cf-btns"><button class="btn cf-yes" data-cyes>${esc(o.yes)}</button><button class="btn cf-no" data-cno>${esc(o.no || 'Cancelar')}</button></div>
  </div>`;
  c.hidden = false; c._yes = o.onYes; c._no = o.onNo; $('[data-cno]', c).focus();
}

/* ===== Eventos ===== */
document.addEventListener('click', ev => {
  const t = ev.target.closest('button, [data-ex]'); if (!t) { if (ev.target.id === 'modal') closeEx(); return; }
  const d = t.dataset;
  if (d.go) return go(d.go);
  if (d.mode) { if (S.mode !== d.mode) { S.mode = d.mode; planEdit = false; PDRAFT = null; save(); render(true); } return; }
  if (d.open) return openWorkout(d.open);
  if (d.start) return startWorkout(d.start);
  if (d.ex) return openEx(d.ex);
  if (d.exinfo) { if (PL) PL.paused = true; drawPlayer(); return openEx(d.exinfo); }
  if (d.cat !== undefined) { filterCat = d.cat; libTab = 'treinos'; return go('treinos'); }
  if (d.filter) { filterCat = d.filter; return render(true); }
  if (d.tab) { libTab = d.tab; return render(true); }
  if ('medals' in d) {
    medalsOpen = !medalsOpen; const sec = t.closest('.medals'); sec.classList.toggle('open', medalsOpen);
    t.setAttribute('aria-expanded', medalsOpen); sec.querySelector('.ach-more').setAttribute('aria-hidden', !medalsOpen);
    const n = sec.querySelectorAll('.ach-more .ach').length;
    t.innerHTML = (medalsOpen ? 'Mostrar menos' : `Ver todas as medalhas <span class="mt-n">+${n}</span>`) + '<svg class="ic mchev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    if (!medalsOpen) sec.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  if (d.delbest) { const id = d.delbest; return confirmBox({ title: 'Apagar a carga guardada?', text: `A última carga e o recorde de ${EX[id].name} voltam a ficar vazios. Útil se ficou registado um valor errado.`, yes: 'Apagar', no: 'Cancelar', icon: 'trash', danger: true, onYes: () => { delete S.loads[id]; delete S.best[id]; save(); closeEx(); render(); } }); }
  if ('settings' in d) return openSettings();
  if ('ptest' in d) { const m = $('#remind-msg'); if (m) { m.textContent = 'A enviar…'; m.className = 'rm-msg'; } testPush().then(ok => { const mm = $('#remind-msg'); if (mm) { mm.textContent = ok ? 'Enviada. Deve aparecer daqui a uns segundos.' : 'Não foi possível enviar o teste.'; mm.className = 'rm-msg ' + (ok ? 'ok' : 'err'); } }); return; }
  if ('planedit' in d) return startPlanEdit();
  if ('pcancel' in d) { planEdit = false; PDRAFT = null; return render(true); }
  if ('psave' in d) { S.plans = Object.assign({}, S.plans || {}); const o = {}; PLAN_ORDER.forEach((day, i) => o[day] = { w: PDRAFT[i].w, extra: PDRAFT[i].extra }); S.plans[S.mode] = o; save(); planEdit = false; PDRAFT = null; render(true); return; }
  if ('preset' in d) return confirmBox({ title: 'Repor o plano original?', text: 'O teu plano personalizado deste modo é apagado e volta o plano sugerido pela app.', yes: 'Repor', no: 'Cancelar', icon: 'cal', danger: true, onYes: () => { S.plans = Object.assign({}, S.plans || {}); delete S.plans[S.mode]; save(); planEdit = false; PDRAFT = null; render(true); } });
  if (d.pick) return planPicker(+d.pick);
  if (d.pmove) { const [i, s] = d.pmove.split(':').map(Number); movePlan(i, i + s); return redrawEditor(); }
  if (d.pset !== undefined) { const [i, id] = d.pset.split(':'); PDRAFT[+i].w = id || null; if (!id) PDRAFT[+i].extra = null; closeEx(); return redrawEditor(); }
  if (d.pnoextra) { PDRAFT[+d.pnoextra].extra = null; closeEx(); return redrawEditor(); }
  if (d.aim) { PL_AIM = d.aim; document.querySelectorAll('.pf-goal button').forEach(b => { const on = b.dataset.aim === d.aim; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); return; }
  if (d.level) { S.level = d.level; save(); return $('#sheet').hidden ? render() : $('#sheet')._redraw(); }
  if ('close' in d) return closeSheet();
  if (d.vpick !== undefined || d.vprev !== undefined) {
    const name = d.vpick ?? d.vprev, prevSel = S.voiceName;
    if (d.vpick !== undefined) {
      S.voiceName = name; save();
      document.querySelectorAll('.vrow').forEach(r => { const b = r.querySelector('.vpick'), on = b.dataset.vpick === name; r.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    } else S.voiceName = name;
    document.querySelectorAll('.vprev').forEach(b => b.classList.toggle('playing', b.dataset.vprev === name));
    say(pick(['Olá! Sou o teu treinador. Bora treinar!', 'Flexões, quinze repetições. Força!', 'Última série, dá tudo!']), true);
    if (d.vpick === undefined) S.voiceName = prevSel;
    setTimeout(() => document.querySelectorAll('.vprev.playing').forEach(b => b.classList.remove('playing')), 2200);
    return;
  }
  if ('mclose' in d) return closeEx();
  if (d.goal) { S.goal = Math.min(7, Math.max(1, S.goal + +d.goal)); save(); return render(); }
  if (t.id === 'clear') return confirmBox({ title: 'Apagar o histórico?', text: `Vais perder ${S.history.length === 1 ? 'o treino registado' : 'os ' + S.history.length + ' treinos registados'}. As medalhas já conquistadas mantêm-se. Isto não dá para desfazer.`, yes: 'Apagar tudo', no: 'Manter', icon: 'trash', danger: true, onYes: () => { S.history = []; save(); render(true); } });
  if ('cno' in d) { const c = $('#confirm'), fn = c._no; c._no = null; return animClose(c, 'modal-close', () => { c.hidden = true; fn && fn(); }); }
  if ('cyes' in d) { const c = $('#confirm'); c.hidden = true; c._yes && c._yes(); return; }
  // player
  if ('quit' in d) {
    if (PL) { PL.wasPaused = PL.paused; PL.paused = true; }
    const tot = PL ? PL.steps.filter(x => x.k === 'work').length : 0, dn = PL ? PL.steps.slice(0, PL.idx).filter(x => x.k === 'work').length : 0;
    return confirmBox({ title: 'Desistir já?', text: 'Se saíres agora, este treino não conta para o histórico nem para as medalhas.', yes: 'Continuar a treinar', no: 'Sair do treino', icon: 'fire',
      progress: tot ? dn / tot : null, progLabel: `${dn} de ${tot} exercícios feitos`, onYes: () => { if (PL) PL.paused = !!PL.wasPaused; }, onNo: quitPlayer });
  }
  if ('endclose' in d) return quitPlayer();
  if (!PL) return;
  if ('skipphase' in d) { const ph = (PL.steps[PL.idx].phase) || (PL.steps[nextWorkIdx(PL.idx)] || {}).phase;
    if (ph === 'cool') return finish();
    const j = PL.steps.findIndex(x => x.main); return enter(j > 0 ? j : PL.idx + 1); }
  if (d.load) { const s = PL.steps[PL.idx]; const v = Math.max(0, (curLoad(s.ex) ?? 0) + +d.load * loadStep(s.ex)); PL.loads[s.ex] = v || null; const n = $('#ld-val'); if (n) { n.value = v ? kg(v) : ''; if (!RM) { n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick'); } } return; }
  if ('skip' in d) { PL.steps[PL.idx].counted = 1; return enter(PL.idx + 1); }
  if ('next' in d) { const s = PL.steps[PL.idx]; if (s.k === 'work') endChime(); commitLoad(); return enter(PL.idx + 1); }
  if ('prev' in d) { let i = PL.idx - 1; while (i > 0 && PL.steps[i].k !== 'work') i--; return enter(Math.max(1, i)); }
  if ('pause' in d) { PL.paused = !PL.paused; return drawPlayer(); }
  if ('add' in d) { PL.left += 15; PL.steps[PL.idx].dur += 15; return updT(); }
  if ('sound' in d) { S.sound = !S.sound; save(); return drawPlayer(); }
  if ('voice' in d) { S.voice = !S.voice; save(); if (!S.voice) try { speechSynthesis.cancel(); } catch (e) {} return drawPlayer(); }
});
document.addEventListener('submit', ev => {
  ev.preventDefault();
  if (ev.target.id === 'name-f') {
    const v = $('#name-in').value.trim().split(/\s+/)[0] || '';
    S.name = v ? v.charAt(0).toUpperCase() + v.slice(1) : '';
    const kg = parseFloat(($('#pf-kg').value || '').replace(',', '.')), cm = parseInt($('#pf-cm').value, 10);
    const last = S.weights.length ? S.weights[S.weights.length - 1].kg : null;
    if (kg >= 30 && kg <= 200 && Math.round(kg * 10) / 10 !== last) { const k = today(); S.weights = S.weights.filter(w => w.d !== k); S.weights.push({ d: k, kg: Math.round(kg * 10) / 10 }); }
    S.height = cm >= 120 && cm <= 230 ? cm : (S.height || null);
    S.aim = PL_AIM || S.aim || 'massa';
    save(); render();
    const m = $('#name-msg'); if (m) { m.innerHTML = `Perfil guardado${S.name ? `, <b>${esc(S.name)}</b>` : ''}.`; m.classList.add('ok'); }
    return;
  }
});
document.addEventListener('change', ev => {
  if (ev.target.id === 'tg-remind') {
    const on = ev.target.checked; S.remind = Object.assign({ time: '18:00' }, S.remind || {});
    if (!on) { S.remind.on = false; save(); disablePush(); return redrawRemind('Lembretes desligados.', true); }
    const m = $('#remind-msg'); if (m) m.textContent = 'A ativar…';
    enablePush().then(res => {
      if (res === 'on') { S.remind.on = true; save(); redrawRemind(`Feito. Vais receber um lembrete às ${S.remind.time} nos dias de treino.`, true); }
      else { S.remind.on = false; save(); redrawRemind(res === 'denied' ? 'Não deste permissão para notificações. Ativa-as nas definições do aparelho.' : 'Não foi possível ativar. Tenta outra vez com internet.', false); }
    });
    return;
  }
  if (ev.target.id === 'remind-time') { S.remind = Object.assign({}, S.remind || {}, { time: ev.target.value || '18:00' }); save(); const m = $('#remind-msg'); if (m) { m.textContent = `Lembrete às ${S.remind.time}.`; m.className = 'rm-msg ok'; } return; }
  const TG = { 'tg-warm': 'warm', 'tg-cool': 'cool', 'tg-sound': 'sound', 'tg-voice': 'voice' };
  if (TG[ev.target.id]) { S[TG[ev.target.id]] = ev.target.checked; save(); const sh = $('#sheet'); if (!sh.hidden && sh._redraw) { const y = sh.scrollTop; sh._redraw(); sh.scrollTop = y; } return; }
});
document.addEventListener('input', ev => {
  if (ev.target.id === 'ld-val' && PL) { const s = PL.steps[PL.idx]; const v = parseFloat(ev.target.value.replace(',', '.')); PL.loads[s.ex] = v > 0 && v < 1000 ? Math.round(v * 10) / 10 : null; return; } if (ev.target.id === 'ckg') calc(); });
document.addEventListener('keydown', ev => {
  if (ev.key !== 'Escape') return;
  if (!$('#confirm').hidden) { const c = $('#confirm'); c.hidden = true; if (c._no && c._yes && PL) c._yes(); } else if (!$('#modal').hidden) closeEx(); else if (!$('#sheet').hidden) closeSheet();
});

render(true);
// ecrã de abertura
(function () {
  const sp = document.getElementById('splash'); if (!sp) return;
  if (RM) { sp.remove(); return; }
  sp.innerHTML = logo('once');
  setTimeout(() => sp.classList.add('out'), 1700);
  setTimeout(() => sp.remove(), 2200);
})();
