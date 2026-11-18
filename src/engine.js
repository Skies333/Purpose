/* ===== Motor de animação dos bonecos ===== */
const FLOOR = 166, SW = 4;           // chão e meia-espessura do traço
const BN = { T: 44, N: 15, R: 10, UA: 24, FA: 22, TH: 32, SH: 32 };
const D2R = Math.PI / 180;
const dir = a => [Math.sin(a * D2R), Math.cos(a * D2R)];
const ang = (x, y) => Math.atan2(x, y) / D2R;
const lerp = (a, b, t) => a + (b - a) * t;
const lerpA = (a, b, t) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;
const G = FLOOR - SW;

function ik(root, tg, L1, L2, k) {
  const dx = tg[0] - root[0], dy = tg[1] - root[1];
  let d = Math.hypot(dx, dy);
  d = Math.min(Math.max(d, Math.abs(L1 - L2) + .01), L1 + L2 - .01);
  const c = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const a1 = ang(dx, dy) + k * Math.acos(Math.max(-1, Math.min(1, c))) / D2R;
  const e = [root[0] + L1 * Math.sin(a1 * D2R), root[1] + L1 * Math.cos(a1 * D2R)];
  const a2 = ang(tg[0] - e[0], tg[1] - e[1]);
  return [e, [e[0] + L2 * Math.sin(a2 * D2R), e[1] + L2 * Math.cos(a2 * D2R)]];
}

function mixPose(A, B, s) {
  const o = { t: lerpA(A.t, B.t, s), h: lerpA(A.h ?? A.t, B.h ?? B.t, s), lift: lerp(A.lift || 0, B.lift || 0, s), sx: lerp(A.sx || 0, B.sx || 0, s) };
  for (const k of ['a1', 'a2', 'l1', 'l2']) {
    const p = A[k], q = B[k];
    o[k] = Array.isArray(p) ? [lerpA(p[0], q[0], s), lerpA(p[1], q[1], s)]
      : { w: [lerp(p.w[0], q.w[0], s), lerp(p.w[1], q.w[1], s)], k: p.k };
  }
  return o;
}

const LIMBS = [['a1', 'sh1', 'e1', 'w1', 'UA', 'FA'], ['a2', 'sh2', 'e2', 'w2', 'UA', 'FA'],
               ['l1', 'hp1', 'k1', 'f1', 'TH', 'SH'], ['l2', 'hp2', 'k2', 'f2', 'TH', 'SH']];

function solve(ex, P) {
  const front = ex.view === 'front';
  const td = dir(P.t), pp = [-td[1], td[0]];
  const p = { hip: [0, 0] };
  p.neck = [td[0] * BN.T, td[1] * BN.T];
  const so = front ? 12 : 0, ho = front ? 7 : 0;
  p.sh1 = [p.neck[0] + pp[0] * so, p.neck[1] + pp[1] * so + (front ? 3 : 0)];
  p.sh2 = [p.neck[0] - pp[0] * so, p.neck[1] - pp[1] * so + (front ? 3 : 0)];
  p.hp1 = [pp[0] * ho, pp[1] * ho]; p.hp2 = [-pp[0] * ho, -pp[1] * ho];
  const hd = dir(P.h); p.head = [p.neck[0] + hd[0] * BN.N, p.neck[1] + hd[1] * BN.N];
  const fkNames = ['hip', 'neck'];
  for (const [k, r, m, e, L1, L2] of LIMBS) {
    const lim = P[k]; if (!Array.isArray(lim)) continue;
    const u = dir(lim[0]), l = dir(lim[1]);
    p[m] = [p[r][0] + u[0] * BN[L1], p[r][1] + u[1] * BN[L1]];
    p[e] = [p[m][0] + l[0] * BN[L2], p[m][1] + l[1] * BN[L2]];
    fkNames.push(m, e);
  }
  if (ex.fixHip) { var dx = ex.fixHip[0] + (P.sx || 0), dy = ex.fixHip[1] - (P.lift || 0); }
  else {
    const cand = ex.ground || fkNames.concat('head');
    let maxY = -1e9;
    for (const n of cand) { if (!p[n]) continue; const y = n === 'head' ? p.head[1] + BN.R - SW : p[n][1]; if (y > maxY) maxY = y; }
    var dy = G - (ex.gy || 0) - (P.lift || 0) - maxY;
    const an = p[ex.anchor || 'hip'];
    var dx = (ex.ax ?? 120) - an[0];
  }
  for (const n in p) p[n] = [p[n][0] + dx, p[n][1] + dy];
  for (const [k, r, m, e, L1, L2] of LIMBS) {
    const lim = P[k]; if (Array.isArray(lim)) continue;
    const [mm, ee] = ik(p[r], lim.w, BN[L1], BN[L2], lim.k); p[m] = mm; p[e] = ee;
  }
  return p;
}

const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) { const n = document.createElementNS(NS, tag); for (const a in attrs) n.setAttribute(a, attrs[a]); parent && parent.appendChild(n); return n; }

/* Cria um boneco animado dentro de um contentor */
function makeFigure(container, exId, opts = {}) {
  const ex = EX[exId]; if (!ex) return null;
  const svg = el('svg', { viewBox: '0 0 240 180', class: 'fig', 'aria-label': 'Animação: ' + ex.name, role: 'img' });
  // chão
  el('line', { x1: -200, x2: 440, y1: FLOOR, y2: FLOOR, class: 'f-floor' }, svg);
  const shadow = el('ellipse', { cx: 120, cy: FLOOR + 2, rx: 40, ry: 3, class: 'f-shadow' }, svg);
  for (const pr of ex.props || []) {
    if (pr.type === 'box') el('rect', { x: pr.x, y: FLOOR - pr.h, width: pr.w, height: pr.h, rx: 3, class: 'f-prop' }, svg);
    if (pr.type === 'wall') el('rect', { x: pr.x, y: -100, width: pr.w || 12, height: FLOOR + 100, class: 'f-prop' }, svg);
    if (pr.type === 'line') el('line', { x1: pr.x1, y1: pr.y1, x2: pr.x2, y2: pr.y2, class: 'f-prop-l', 'stroke-width': pr.w || 8 }, svg);
    if (pr.type === 'rect') el('rect', { x: pr.x, y: pr.y, width: pr.w, height: pr.h, rx: pr.rx ?? 4, class: 'f-prop' }, svg);
    if (pr.type === 'table') { el('rect', { x: pr.x, y: FLOOR - pr.h - 6, width: pr.w, height: 6, rx: 2, class: 'f-prop' }, svg);
      el('rect', { x: pr.x + pr.w - 10, y: FLOOR - pr.h, width: 6, height: pr.h, class: 'f-prop' }, svg); }
  }
  const front = ex.view === 'front';
  const far = el('g', { class: front ? 'f-near' : 'f-far' }, svg);
  const body = el('g', { class: 'f-body' }, svg);
  const eq = el('g', { class: 'f-eq' }, svg);
  const near = el('g', { class: 'f-near' }, svg);
  // equipamento dinâmico
  const E = {};
  if (ex.cable) { E.cable = el('line', { class: 'f-cable' }, svg); svg.insertBefore(E.cable, far);
    el('circle', { cx: ex.cable[0], cy: ex.cable[1], r: 6, class: 'f-pulley' }, svg); }
  const H = ex.hold;
  if (H === 'bar') { E.plate = el('circle', { r: 12, class: 'f-plate' }, eq); E.hub = el('circle', { r: 3, class: 'f-hub' }, eq); }
  if (H === 'db') { E.d2 = el('circle', { r: 6, class: 'f-plate dim' }, svg); svg.insertBefore(E.d2, body); E.d1 = el('circle', { r: 6, class: 'f-plate' }, svg); }
  if (H === 'bar-front') { E.bar = el('line', { class: 'f-bar' }, eq); E.p1 = el('line', { class: 'f-platel' }, eq); E.p2 = el('line', { class: 'f-platel' }, eq); }
  if (H === 'db-front') { E.d1 = el('line', { class: 'f-platel sm' }, svg); E.d2 = el('line', { class: 'f-platel sm' }, svg); }
  if (ex.sled) E.sled = el('line', { class: 'f-bar thick' }, eq);
  if (ex.pad) E.pad = el('circle', { r: 7, class: 'f-plate' }, eq);
  const pl = g => el('polyline', { fill: 'none' }, g);
  const parts = { l2: pl(far), a2: pl(far), torso: pl(body), l1: pl(near), a1: pl(near) };
  parts.head = el('circle', { r: BN.R, class: 'f-head' }, body);
  container.appendChild(svg);
  const frames = ex.frames, K = frames.length, seg = (ex.speed || 1) * 1000;
  // enquadramento automático
  let x0 = 1e9, x1 = -1e9, y0 = 1e9;
  for (let i = 0; i < K; i++) for (let j = 0; j < 6; j++) {
    const q = solve(ex, K === 1 ? frames[0] : mixPose(frames[i], frames[(i + 1) % K], j / 6));
    for (const n in q) { const r = n === 'head' ? BN.R : 0; x0 = Math.min(x0, q[n][0] - r); x1 = Math.max(x1, q[n][0] + r); y0 = Math.min(y0, q[n][1] - r); }
  }
  for (const pr of ex.props || []) {
    if (pr.type === 'line') { x0 = Math.min(x0, pr.x1, pr.x2); x1 = Math.max(x1, pr.x1, pr.x2); y0 = Math.min(y0, pr.y1, pr.y2); continue; }
    if (pr.type === 'rect') { x0 = Math.min(x0, pr.x); x1 = Math.max(x1, pr.x + pr.w); y0 = Math.min(y0, pr.y); continue; }
    x0 = Math.min(x0, pr.x); x1 = Math.max(x1, pr.x + (pr.w || 12)); if (pr.type !== 'wall') y0 = Math.min(y0, FLOOR - pr.h - 8); }
  if (ex.cable) { x0 = Math.min(x0, ex.cable[0] - 8); x1 = Math.max(x1, ex.cable[0] + 8); y0 = Math.min(y0, ex.cable[1] - 8); }
  if (H === 'bar' || H === 'bar-front') y0 -= 12;
  const pad = 14, yb = FLOOR + 10;
  let vw = x1 - x0 + pad * 2, vh = yb - (y0 - pad);
  if (vh < 110) vh = 110; if (vw < vh * 1.25) vw = vh * 1.25; if (vh < vw / 1.6) vh = vw / 1.6;
  const cx = (x0 + x1) / 2;
  svg.setAttribute('viewBox', `${(cx - vw / 2).toFixed(1)} ${(yb - vh).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
  const fig = {
    svg, ex, t0: performance.now() - (opts.phase || 0) * seg, still: !!opts.still,
    draw(now) {
      let P;
      if (K === 1) P = frames[0];
      else {
        const tt = this.still ? (opts.frame || 0) * seg : (now - this.t0);
        const u = (((tt / seg) % K) + K) % K, i = Math.floor(u), f = u - i;
        const s = .5 - .5 * Math.cos(Math.PI * f);
        P = mixPose(frames[i], frames[(i + 1) % K], s);
      }
      const p = solve(ex, P);
      const pts = (...n) => n.map(k => p[k][0].toFixed(1) + ',' + p[k][1].toFixed(1)).join(' ');
      parts.l1.setAttribute('points', pts('hp1', 'k1', 'f1'));
      parts.l2.setAttribute('points', pts('hp2', 'k2', 'f2'));
      parts.a1.setAttribute('points', pts('sh1', 'e1', 'w1'));
      parts.a2.setAttribute('points', pts('sh2', 'e2', 'w2'));
      parts.torso.setAttribute('points', front ? pts('hp1', 'hp2', 'hip', 'neck', 'sh1', 'sh2') : pts('hip', 'neck'));
      parts.head.setAttribute('cx', p.head[0].toFixed(1)); parts.head.setAttribute('cy', p.head[1].toFixed(1));
      shadow.setAttribute('cx', p.hip[0].toFixed(1));
      const A = (n, k, v) => n.setAttribute(k, v.toFixed(1));
      const mid = [(p.w1[0] + p.w2[0]) / 2, (p.w1[1] + p.w2[1]) / 2];
      if (E.cable) { A(E.cable, 'x1', ex.cable[0]); A(E.cable, 'y1', ex.cable[1]); A(E.cable, 'x2', mid[0]); A(E.cable, 'y2', mid[1]); }
      if (E.plate) { for (const n of [E.plate, E.hub]) { A(n, 'cx', mid[0]); A(n, 'cy', mid[1]); } }
      if (H === 'db') { A(E.d1, 'cx', p.w1[0]); A(E.d1, 'cy', p.w1[1]); A(E.d2, 'cx', p.w2[0]); A(E.d2, 'cy', p.w2[1]); }
      if (E.bar) { const vx = p.w1[0] - p.w2[0], vy = p.w1[1] - p.w2[1], L = Math.hypot(vx, vy) || 1, ux = vx / L, uy = vy / L, ext = 26;
        A(E.bar, 'x1', p.w2[0] - ux * ext); A(E.bar, 'y1', p.w2[1] - uy * ext); A(E.bar, 'x2', p.w1[0] + ux * ext); A(E.bar, 'y2', p.w1[1] + uy * ext);
        const pe = (n, q, sgn) => { const cx = q[0] + sgn * ux * 18, cy = q[1] + sgn * uy * 18; A(n, 'x1', cx - uy * 12); A(n, 'y1', cy + ux * 12); A(n, 'x2', cx + uy * 12); A(n, 'y2', cy - ux * 12); };
        pe(E.p1, p.w1, 1); pe(E.p2, p.w2, -1); }
      if (H === 'db-front') for (const [n, q] of [[E.d1, p.w1], [E.d2, p.w2]]) { A(n, 'x1', q[0] - 7); A(n, 'y1', q[1]); A(n, 'x2', q[0] + 7); A(n, 'y2', q[1]); }
      if (E.sled) { const vx = p.f1[0] - p.hip[0], vy = p.f1[1] - p.hip[1], L = Math.hypot(vx, vy) || 1, ux = ex.sled[0], uy = ex.sled[1];
        const c = [p.f1[0] + ux * 5, p.f1[1] + uy * 5]; A(E.sled, 'x1', c[0] - uy * 24); A(E.sled, 'y1', c[1] + ux * 24); A(E.sled, 'x2', c[0] + uy * 24); A(E.sled, 'y2', c[1] - ux * 24); }
      if (E.pad) { A(E.pad, 'cx', p.f1[0] + 2); A(E.pad, 'cy', p.f1[1] - 7); }
    }
  };
  if (front) parts.torso.setAttribute('stroke-linejoin', 'round');
  fig.draw(performance.now());
  FIGS.add(fig);
  return fig;
}
const FIGS = new Set();
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function figLoop(now) {
  for (const f of FIGS) { if (!f.svg.isConnected) { FIGS.delete(f); continue; } if (!reduceMotion) f.draw(now); }
  requestAnimationFrame(figLoop);
}
requestAnimationFrame(figLoop);

/* ===== Biblioteca de exercícios ===== */
const ST = { t: 180, a1: [8, 14], a2: [-6, 4], l1: [2, 0], l2: [-3, -3] };
const PU_TOP = { t: 115, l1: [-65, -65], l2: [-65, -65], a1: { w: [150, G], k: -1 }, a2: { w: [146, G], k: -1 } };
const PU_BOT = { t: 97, l1: [-83, -83], l2: [-83, -83], a1: { w: [150, G], k: -1 }, a2: { w: [146, G], k: -1 } };
const pushCfg = { anchor: 'f1', ax: 52, ground: ['f1', 'f2'] };

const EX = {
  pushup: { name: 'Flexões', group: 'Peito', muscles: 'Peito, tríceps, ombros', ...pushCfg, frames: [PU_TOP, PU_BOT], speed: 1,
    cues: ['Corpo em linha reta, abdominal contraído', 'Mãos um pouco mais abertas que os ombros', 'Desce até o peito quase tocar no chão'],
    easier: 'Joelhos no chão', harder: 'Desce em 3 segundos e pausa 1 s em baixo' },
  wide: { name: 'Flexões abertas', group: 'Peito', muscles: 'Peito (foco), ombros', ...pushCfg, frames: [PU_TOP, PU_BOT], speed: 1.1,
    cues: ['Mãos bem mais abertas que os ombros', 'Cotovelos para fora a ~60°', 'Sente o alongamento no peito em baixo'],
    easier: 'Joelhos no chão', harder: 'Pausa de 2 s em baixo' },
  diamond: { name: 'Flexões diamante', group: 'Tríceps', muscles: 'Tríceps, peito interno', ...pushCfg, frames: [PU_TOP, PU_BOT], speed: 1.1,
    cues: ['Polegares e indicadores juntos em losango', 'Cotovelos colados ao corpo', 'Empurra o chão para longe no topo'],
    easier: 'Mãos juntas mas com joelhos no chão', harder: 'Descida lenta de 4 segundos' },
  decline: { name: 'Flexões declinadas', group: 'Peito', muscles: 'Peito superior, ombros', anchor: 'f1', ax: 46, ground: ['f1', 'f2'], gy: 34, speed: 1.1,
    props: [{ type: 'box', x: 20, w: 46, h: 34 }],
    frames: [{ t: 99, l1: [-81, -81], l2: [-81, -81], a1: { w: [154, G], k: -1 }, a2: { w: [150, G], k: -1 } },
             { t: 82, l1: [-98, -98], l2: [-98, -98], a1: { w: [154, G], k: -1 }, a2: { w: [150, G], k: -1 } }],
    cues: ['Pés em cima de uma cadeira ou sofá', 'Não deixes a anca cair', 'Quanto mais alto os pés, mais difícil'],
    easier: 'Usa um degrau baixo', harder: 'Pés mais altos ou pausa em baixo' },
  pike: { name: 'Flexões pike', group: 'Ombros', muscles: 'Ombros, tríceps', anchor: 'f1', ax: 68, ground: ['f1', 'f2'], speed: 1.1,
    frames: [{ t: 72, h: 30, l1: [-25, -25], l2: [-25, -25], a1: { w: [136, G], k: -1 }, a2: { w: [132, G], k: -1 } },
             { t: 38, h: 55, l1: [-25, -25], l2: [-25, -25], a1: { w: [136, G], k: -1 }, a2: { w: [132, G], k: -1 } }],
    cues: ['Anca bem alta, corpo em V invertido', 'Leva a cabeça à frente das mãos', 'Cotovelos a apontar para trás'],
    easier: 'Mãos mais longe dos pés', harder: 'Pés em cima de uma cadeira' },
  dips: { name: 'Dips na cadeira', group: 'Tríceps', muscles: 'Tríceps, peito inferior', anchor: 'f1', ax: 196, ground: ['f1', 'f2'], speed: 1,
    props: [{ type: 'box', x: 102, w: 48, h: 42 }],
    frames: [{ t: 180, l1: [65, 0], l2: [63, -2], a1: { w: [149, G - 38], k: 1 }, a2: { w: [145, G - 38], k: 1 } },
             { t: 172, l1: [102, 0], l2: [100, -2], a1: { w: [149, G - 38], k: 1 }, a2: { w: [145, G - 38], k: 1 } }],
    cues: ['Mãos na beira de uma cadeira estável', 'Desce até os cotovelos fazerem 90°', 'Ombros longe das orelhas'],
    easier: 'Joelhos mais dobrados', harder: 'Pernas esticadas ou pés elevados' },
  row: { name: 'Remada na mesa', group: 'Costas', muscles: 'Dorsais, bíceps, trapézio', anchor: 'f1', ax: 40, ground: ['f1', 'f2'], speed: 1.1,
    props: [{ type: 'table', x: 140, w: 96, h: 72 }],
    frames: [{ t: 104, h: 100, l1: [-76, -76], l2: [-76, -76], a1: { w: [147, FLOOR - 75], k: -1 }, a2: { w: [143, FLOOR - 75], k: -1 } },
             { t: 117, h: 96, l1: [-63, -63], l2: [-60, -60], a1: { w: [147, FLOOR - 75], k: -1 }, a2: { w: [143, FLOOR - 75], k: -1 } }],
    cues: ['Deita-te debaixo de uma mesa robusta', 'Agarra a borda e puxa o peito até ela', 'Aperta as omoplatas no topo'],
    easier: 'Dobra os joelhos', harder: 'Pausa 2 s no topo, descida lenta' },
  superman: { name: 'Super-homem', group: 'Costas', muscles: 'Lombar, glúteos, costas', ax: 110, speed: 1.2,
    frames: [{ t: 90, h: 92, a1: [92, 92], a2: [90, 90], l1: [-90, -90], l2: [-90, -90] },
             { t: 101, h: 104, a1: [108, 110], a2: [106, 108], l1: [-101, -103], l2: [-99, -101] }],
    cues: ['Deitado de barriga para baixo', 'Levanta braços, peito e pernas ao mesmo tempo', 'Segura 1–2 s no topo'],
    easier: 'Levanta só braços ou só pernas', harder: 'Segura 3 s em cima' },
  yraise: { name: 'Elevações em Y', group: 'Costas', muscles: 'Trapézio inferior, ombros', ax: 105, speed: 1,
    frames: [{ t: 93, h: 94, a1: [95, 95], a2: [93, 93], l1: [-90, -90], l2: [-90, -90] },
             { t: 99, h: 102, a1: [122, 122], a2: [120, 120], l1: [-90, -90], l2: [-90, -90] }],
    cues: ['Braços à frente em forma de Y, polegares para cima', 'Levanta os braços sem arquear a lombar', 'Controla a descida'],
    easier: 'Menor amplitude', harder: 'Segura 3 s no topo' },
  squat: { name: 'Agachamento', group: 'Pernas', muscles: 'Quadríceps, glúteos', anchor: 'f1', ax: 112, speed: 1,
    frames: [{ t: 180, a1: [88, 90], a2: [86, 88], l1: [0, 0], l2: [-2, -2] },
             { t: 145, a1: [96, 96], a2: [94, 94], l1: [80, -20], l2: [78, -22] }],
    cues: ['Pés à largura dos ombros', 'Anca para trás e para baixo', 'Joelhos na direção dos pés'],
    easier: 'Agacha até uma cadeira', harder: 'Desce em 4 s ou pausa 2 s em baixo' },
  sumo: { name: 'Agachamento sumo', group: 'Pernas', muscles: 'Adutores, glúteos, quadríceps', view: 'front', ax: 120, speed: 1,
    frames: [{ t: 180, a1: [30, -120], a2: [-30, 120], l1: [24, 22], l2: [-24, -22] },
             { t: 180, a1: [30, -120], a2: [-30, 120], l1: [62, 8], l2: [-62, -8] }],
    cues: ['Pés bem abertos, pontas para fora', 'Tronco direito', 'Empurra os joelhos para fora'],
    easier: 'Menos profundidade', harder: 'Pulsos de 3 em baixo em cada rep' },
  jumpsquat: { name: 'Agachamento com salto', group: 'Pernas', muscles: 'Pernas, explosividade', anchor: 'f1', ax: 112, speed: .55,
    frames: [{ t: 145, a1: [-40, -25], a2: [-42, -27], l1: [80, -20], l2: [78, -22] },
             { t: 180, a1: [170, 175], a2: [168, 173], l1: [4, 2], l2: [2, 0], lift: 24 }],
    cues: ['Agacha e salta o mais alto possível', 'Aterra suave com joelhos fletidos', 'Usa os braços para impulsionar'],
    easier: 'Agachamento sem salto, rápido', harder: 'Salta até ao peito (tuck jump)' },
  lunges: { name: 'Afundos alternados', group: 'Pernas', muscles: 'Quadríceps, glúteos', ax: 112, speed: .8,
    frames: [ST, { t: 180, a1: [6, 10], a2: [-4, 0], l1: [88, 0], l2: [-15, -85] }, ST, { t: 180, a1: [6, 10], a2: [-4, 0], l1: [-15, -85], l2: [88, 0] }],
    cues: ['Passo largo à frente', 'Joelho de trás quase toca no chão', 'Tronco direito, empurra com o calcanhar'],
    easier: 'Afundo parado sem alternar', harder: 'Afundo com salto' },
  lateral: { name: 'Afundo lateral', group: 'Pernas', muscles: 'Adutores, glúteos, quadríceps', view: 'front', ax: 120, speed: .9,
    frames: [{ t: 180, a1: [30, -120], a2: [-30, 120], l1: [6, 4], l2: [-6, -4] },
             { t: 168, a1: [30, -120], a2: [-30, 120], l1: [55, 0], l2: [-58, -58] },
             { t: 180, a1: [30, -120], a2: [-30, 120], l1: [6, 4], l2: [-6, -4] },
             { t: 192, a1: [30, -120], a2: [-30, 120], l1: [58, 58], l2: [-55, 0] }],
    cues: ['Passo largo para o lado', 'Dobra a perna do passo, a outra fica esticada', 'Anca para trás'],
    easier: 'Passo mais curto', harder: 'Segura 2 s em baixo' },
  bulgarian: { name: 'Agachamento búlgaro', group: 'Pernas', muscles: 'Quadríceps, glúteos', anchor: 'f1', ax: 150, ground: ['f1'], speed: 1.2,
    props: [{ type: 'box', x: 64, w: 40, h: 34 }],
    frames: [{ t: 178, a1: [8, 14], a2: [-6, 4], l1: [12, 0], l2: { w: [96, G - 34], k: 1 } },
             { t: 165, a1: [14, 20], a2: [0, 8], l1: [80, -12], l2: { w: [96, G - 34], k: 1 } }],
    cues: ['Pé de trás numa cadeira ou sofá', 'Desce na vertical até a coxa da frente ficar paralela', 'Faz todas as reps de uma perna e troca'],
    easier: 'Afundo normal sem apoio', harder: 'Descida em 4 s, pausa em baixo' },
  bridge: { name: 'Ponte de glúteos', group: 'Glúteos', muscles: 'Glúteos, isquiotibiais', anchor: 'f1', ax: 158, speed: 1,
    frames: [{ t: -90, h: -90, a1: [90, 90], a2: [90, 90], l1: [148, 22], l2: [150, 24] },
             { t: -70, h: -92, a1: [86, 92], a2: [86, 92], l1: [106, 4], l2: [108, 6] }],
    cues: ['Deitado de costas, pés perto do rabo', 'Empurra com os calcanhares e sobe a anca', 'Aperta os glúteos 1 s no topo'],
    easier: 'Menor amplitude', harder: 'Versão a uma perna' },
  bridge1: { name: 'Ponte a uma perna', group: 'Glúteos', muscles: 'Glúteos, isquiotibiais', anchor: 'f1', ax: 158, ground: ['f1', 'neck', 'w1'], speed: 1.1,
    frames: [{ t: -90, h: -90, a1: [90, 90], a2: [90, 90], l1: [148, 22], l2: [148, 148] },
             { t: -70, h: -92, a1: [86, 92], a2: [86, 92], l1: [106, 4], l2: [108, 108] }],
    cues: ['Uma perna esticada no ar', 'Sobe a anca sem rodar a bacia', 'Faz todas as reps de um lado e troca'],
    easier: 'Ponte com as duas pernas', harder: 'Pé de apoio num sofá' },
  calf: { name: 'Elevação de gémeos', group: 'Pernas', muscles: 'Gémeos', ax: 120, speed: .7,
    frames: [{ ...ST }, { ...ST, a1: [6, 10], lift: 8 }],
    cues: ['Sobe na ponta dos pés o máximo possível', 'Pausa 1 s em cima', 'Faz num degrau para mais amplitude'],
    easier: 'Apoia-te numa parede', harder: 'Uma perna de cada vez' },
  wallsit: { name: 'Cadeira na parede', group: 'Pernas', muscles: 'Quadríceps (isometria)', fixHip: [86, G - 32], speed: 2,
    props: [{ type: 'wall', x: 66, w: 12 }],
    frames: [{ t: 180, a1: [70, 85], a2: [68, 83], l1: [90, 0], l2: [88, -2] }, { t: 180, a1: [72, 87], a2: [70, 85], l1: [90, 0], l2: [88, -2] }],
    cues: ['Costas encostadas à parede', 'Coxas paralelas ao chão, joelhos a 90°', 'Respira, não seguras a respiração'],
    easier: 'Menos profundo', harder: 'Levanta um pé do chão alternadamente' },
  plank: { name: 'Prancha', group: 'Core', muscles: 'Abdominais, core completo', anchor: 'f1', ax: 48, speed: 2.4,
    frames: [{ t: 103, l1: [-77, -77], l2: [-77, -77], a1: [0, 90], a2: [-2, 88] }, { t: 102, l1: [-78, -78], l2: [-78, -78], a1: [1, 90], a2: [-1, 88] }],
    cues: ['Antebraços no chão, cotovelos sob os ombros', 'Aperta glúteos e abdominal', 'Não deixes a anca cair nem subir'],
    easier: 'Joelhos no chão', harder: 'Levanta um braço ou perna alternadamente' },
  crunch: { name: 'Abdominais crunch', group: 'Core', muscles: 'Reto abdominal', ax: 120, speed: .9,
    frames: [{ t: -90, h: -90, a1: [90, 90], a2: [90, 90], l1: [150, 24], l2: [152, 26] },
             { t: -122, h: -112, a1: [100, 100], a2: [98, 98], l1: [150, 24], l2: [152, 26] }],
    cues: ['Joelhos fletidos, pés no chão', 'Sobe os ombros a enrolar a coluna', 'Expira ao subir'],
    easier: 'Menor amplitude', harder: 'Mãos atrás da cabeça e pausa em cima' },
  legraise: { name: 'Elevação de pernas', group: 'Core', muscles: 'Abdominal inferior', ax: 120, speed: 1.2,
    frames: [{ t: -90, h: -90, a1: [90, 90], a2: [90, 90], l1: [96, 96], l2: [98, 98] },
             { t: -90, h: -90, a1: [90, 90], a2: [90, 90], l1: [176, 176], l2: [178, 178] }],
    cues: ['Lombar colada ao chão', 'Pernas esticadas, sobe até 90°', 'Desce devagar sem tocar no chão'],
    easier: 'Joelhos fletidos', harder: 'Sobe a anca no fim (reverse crunch)' },
  climbers: { name: 'Mountain climbers', group: 'Core', muscles: 'Core, cardio, ombros', fixHip: [96, G - 27], speed: .32,
    frames: [{ t: 115, a1: { w: [138, G], k: -1 }, a2: { w: [134, G], k: -1 }, l1: [50, -70], l2: [-65, -65] },
             { t: 115, a1: { w: [138, G], k: -1 }, a2: { w: [134, G], k: -1 }, l1: [-65, -65], l2: [50, -70] }],
    cues: ['Posição de flexão, braços esticados', 'Leva os joelhos ao peito alternadamente', 'Anca baixa, ritmo rápido'],
    easier: 'Mais devagar, passo a passo', harder: 'Cruza o joelho ao cotovelo oposto' },
  hollow: { name: 'Hollow hold', group: 'Core', muscles: 'Core completo (isometria)', ax: 120, ground: ['hip'], speed: 2.2,
    frames: [{ t: -106, h: -110, a1: [-100, -100], a2: [-98, -98], l1: [100, 100], l2: [101, 101] },
             { t: -104, h: -108, a1: [-98, -98], a2: [-96, -96], l1: [98, 98], l2: [99, 99] }],
    cues: ['Lombar colada ao chão', 'Ombros e pernas levantados, corpo em "banana"', 'Braços esticados atrás da cabeça'],
    easier: 'Joelhos fletidos e braços ao lado', harder: 'Balança suavemente (hollow rocks)' },
  burpee: { name: 'Burpees', group: 'Cardio', muscles: 'Corpo inteiro, cardio', ax: 112, speed: .45,
    frames: [{ ...ST },
             { t: 112, h: 120, a1: [2, 0], a2: [0, -2], l1: [80, -30], l2: [78, -32] },
             { t: 115, a1: [0, 0], a2: [-2, -2], l1: [-65, -65], l2: [-65, -65] },
             { t: 112, h: 120, a1: [2, 0], a2: [0, -2], l1: [80, -30], l2: [78, -32] },
             { t: 180, a1: [172, 176], a2: [170, 174], l1: [4, 2], l2: [2, 0], lift: 22 }],
    cues: ['Agacha, mãos no chão', 'Pés para trás em prancha (e flexão, se aguentares)', 'Volta e salta com os braços em cima'],
    easier: 'Sem salto e sem flexão', harder: 'Com flexão e salto com joelhos ao peito' },
  jacks: { name: 'Polichinelos', group: 'Cardio', muscles: 'Cardio, ombros, pernas', view: 'front', ax: 120, speed: .38,
    frames: [{ t: 180, a1: [12, 6], a2: [-12, -6], l1: [4, 3], l2: [-4, -3] },
             { t: 180, a1: [140, 158], a2: [-140, -158], l1: [20, 20], l2: [-20, -20], lift: 6 }],
    cues: ['Salta abrindo pernas e braços', 'Aterra na ponta dos pés', 'Mantém um ritmo constante'],
    easier: 'Sem salto, um pé de cada vez', harder: 'Agachamento ao abrir (squat jacks)' },
  highknees: { name: 'Joelhos altos', group: 'Cardio', muscles: 'Cardio, flexores da anca', ax: 115, speed: .28,
    frames: [{ t: 182, a1: [-35, 20], a2: [40, 150], l1: [95, 0], l2: [0, 0], lift: 4 },
             { t: 182, a1: [40, 150], a2: [-35, 20], l1: [0, 0], l2: [95, 0], lift: 4 }],
    cues: ['Corre no lugar', 'Joelhos à altura da anca', 'Braços a acompanhar o ritmo'],
    easier: 'Marcha rápida', harder: 'Máxima velocidade 20 s / 10 s' },
  dog: { name: 'Cão a olhar para baixo', group: 'Mobilidade', muscles: 'Isquiotibiais, gémeos, ombros', anchor: 'f1', ax: 62, ground: ['f1', 'f2'], speed: 2.2,
    frames: [{ t: 45, h: 25, l1: [-30, -30], l2: [-30, -30], a1: { w: [166, G], k: 1 }, a2: { w: [162, G], k: 1 } },
             { t: 50, h: 28, l1: [-28, -28], l2: [-28, -28], a1: { w: [166, G], k: 1 }, a2: { w: [162, G], k: 1 } }],
    cues: ['Anca para cima e para trás', 'Calcanhares em direção ao chão', 'Respira fundo e devagar'],
    easier: 'Joelhos ligeiramente fletidos', harder: 'Pedala os pés alternadamente' },
  hipflex: { name: 'Alongamento flexor da anca', group: 'Mobilidade', muscles: 'Flexores da anca, quadríceps', ax: 112, ground: ['f1', 'k2'], speed: 2,
    frames: [{ t: 180, a1: [8, 14], a2: [-6, 4], l1: [82, 0], l2: [-20, -88] }, { t: 186, a1: [10, 16], a2: [-4, 6], l1: [72, 4], l2: [-30, -88] }],
    cues: ['Joelho de trás no chão (põe uma almofada)', 'Empurra a anca à frente', 'Aperta o glúteo da perna de trás'],
    easier: 'Menor amplitude', harder: 'Braço do lado de trás esticado em cima' },
  cobra: { name: 'Cobra', group: 'Mobilidade', muscles: 'Abdominais, coluna', ax: 105, ground: ['hip', 'f1', 'k1'], speed: 2,
    frames: [{ t: 98, h: 100, l1: [-90, -90], l2: [-90, -90], a1: { w: [146, G], k: -1 }, a2: { w: [142, G], k: -1 } },
             { t: 132, h: 150, l1: [-90, -90], l2: [-90, -90], a1: { w: [146, G], k: -1 }, a2: { w: [142, G], k: -1 } }],
    cues: ['Deitado de barriga para baixo', 'Empurra o chão e levanta o peito', 'Anca fica no chão, ombros relaxados'],
    easier: 'Apoia-te nos antebraços', harder: 'Segura 5 respirações em cima' },
  armcircles: { name: 'Rotação de braços', group: 'Mobilidade', muscles: 'Ombros (aquecimento)', ax: 120, speed: .45,
    frames: [{ ...ST, a1: [0, 0], a2: [180, 180] }, { ...ST, a1: [90, 90], a2: [-90, -90] }, { ...ST, a1: [180, 180], a2: [0, 0] }, { ...ST, a1: [-90, -90], a2: [90, 90] }],
    cues: ['Braços esticados, círculos grandes', 'Metade do tempo para a frente, metade para trás', 'Ombros relaxados'],
    easier: 'Círculos mais pequenos', harder: 'Mais rápido e mais amplo' },
  child: { name: 'Posição da criança', group: 'Mobilidade', muscles: 'Lombar, ombros, ancas', ax: 100, ground: ['k1', 'f1', 'k2', 'f2'], speed: 2.2,
    frames: [{ t: 74, h: 92, l1: [51, -90], l2: [50, -91], a1: [93, 92], a2: [92, 91] }, { t: 71, h: 89, l1: [51, -90], l2: [50, -91], a1: [92, 91], a2: [91, 90] }],
    cues: ['Senta-te sobre os calcanhares', 'Estica os braços à frente e encosta o peito às coxas', 'Respira devagar pela barriga'],
    easier: 'Joelhos mais afastados', harder: 'Leva as mãos para um lado para alongar o dorsal' },
};
