'use strict';
/* 공통 도구: DOM 만들기, 저장소, 소리, 모달, 단계 마법사, 스케치 판, 평가 버튼, 라우터 */

/* ---------- DOM 도우미 ---------- */
function h(tag, props) {
  const el = document.createElement(tag);
  if (props) {
    for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') {
        for (const s in v) { if (s.slice(0, 2) === '--') el.style.setProperty(s, v[s]); else el.style[s] = v[s]; }
      }
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (let i = 2; i < arguments.length; i++) appendKids(el, arguments[i]);
  return el;
}
function appendKids(el, kid) {
  if (kid == null || kid === false) return;
  if (Array.isArray(kid)) { kid.forEach(function (k) { appendKids(el, k); }); return; }
  el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
}
/** SVG 문자열 -> SVG 요소 */
function svgEl(str) {
  const t = document.createElement('div');
  t.innerHTML = str.trim();
  return t.firstElementChild;
}
const $ = function (sel, root) { return (root || document).querySelector(sel); };
const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/* ---------- 저장소 (localStorage가 막혀도 동작) ---------- */
const Store = {
  KEY: 'transport-explorer-v1',
  d: { done: {}, stars: {}, rating: {}, notes: {}, sketch: {}, prog: {}, best: {}, name: '', mute: false },
  load: function () {
    try {
      const r = localStorage.getItem(this.KEY);
      if (r) {
        const o = JSON.parse(r);
        for (const k in this.d) if (o[k] !== undefined) this.d[k] = o[k];
      }
    } catch (e) { /* 저장 불가 환경에서도 앱은 동작 */ }
  },
  save: function () {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.d)); } catch (e) { }
  },
  reset: function () {
    try { localStorage.removeItem(this.KEY); } catch (e) { }
    this.d = { done: {}, stars: {}, rating: {}, notes: {}, sketch: {}, prog: {}, best: {}, name: '', mute: false };
  }
};

/* ---------- 소리 ---------- */
const Sound = {
  ctx: null,
  tone: function (freq, dur, type, gain, when) {
    if (Store.d.mute) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const c = this.ctx, o = c.createOscillator(), g = c.createGain();
      const t0 = c.currentTime + (when || 0);
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.07, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.12));
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + (dur || 0.12) + 0.03);
    } catch (e) { }
  },
  ok: function () { this.tone(660, 0.1); this.tone(880, 0.14, 'sine', 0.07, 0.09); },
  bad: function () { this.tone(190, 0.22, 'square', 0.04); },
  click: function () { this.tone(520, 0.05, 'sine', 0.04); },
  win: function () { [523, 659, 784, 1047].forEach(function (f, i) { Sound.tone(f, 0.18, 'triangle', 0.08, i * 0.12); }); },
  whoosh: function () { this.tone(300, 0.35, 'sawtooth', 0.02); this.tone(500, 0.3, 'sine', 0.02, 0.1); }
};

/* ---------- 정리(애니메이션 중단 등) ---------- */
const Cleanup = {
  fns: [],
  add: function (f) { this.fns.push(f); },
  run: function () {
    const a = this.fns; this.fns = [];
    a.forEach(function (f) { try { f(); } catch (e) { } });
  }
};

/* ---------- 토스트 / 모달 / 축하 ---------- */
function toast(msg, kind) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = h('div', { class: 'toast ' + (kind || ''), role: 'status' }, msg);
  document.body.append(t);
  setTimeout(function () { t.classList.add('out'); }, 2200);
  setTimeout(function () { t.remove(); }, 2700);
}

function modal(opts) {
  const ov = document.getElementById('overlay');
  const close = function () { ov.replaceChildren(); ov.classList.remove('show'); document.removeEventListener('keydown', onKey); };
  const onKey = function (e) { if (e.key === 'Escape') close(); };
  const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' },
    opts.emoji ? h('div', { class: 'modal-emoji' }, opts.emoji) : null,
    h('h2', null, opts.title),
    h('div', { class: 'modal-body' }, opts.body),
    h('div', { class: 'modal-actions' }, (opts.actions || [{ label: '확인', primary: true }]).map(function (a) {
      return h('button', {
        class: 'btn ' + (a.primary ? 'btn-primary' : 'btn-ghost'), type: 'button',
        onClick: function () { close(); if (a.onClick) a.onClick(); }
      }, a.label);
    })));
  ov.replaceChildren(box);
  ov.classList.add('show');
  document.addEventListener('keydown', onKey);
  const first = box.querySelector('button');
  if (first) first.focus();
  return close;
}

function celebrate(emojis) {
  const list = emojis || ['⭐', '🎉', '✨', '🏅', '🌟'];
  for (let i = 0; i < 34; i++) {
    const s = h('span', { class: 'confetti', 'aria-hidden': 'true' }, list[i % list.length]);
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * 0.7 + 's';
    s.style.fontSize = (18 + Math.random() * 22) + 'px';
    document.body.append(s);
    setTimeout(function () { s.remove(); }, 3600);
  }
}

/* ---------- 미션 완료 처리 ---------- */
const MISSIONS = [
  { id: 'm1', icon: '🔍', short: '구성 요소', title: '수송 수단의 구성 요소', color: '#ff8a3d' },
  { id: 'm2', icon: '✈️', short: '종이비행기', title: '방향을 바꿔 날아가는 종이비행기', color: '#2a8cff' },
  { id: 'm3', icon: '🌞', short: '친환경 자동차', title: '나만의 친환경 자동차', color: '#12a05f' },
  { id: 'm4', icon: '🏅', short: '마무리', title: '탐험 마무리', color: '#8b5cf6' }
];
function completeMission(id, msg) {
  const first = !Store.d.done[id];
  Store.d.done[id] = true; Store.save();
  renderTop();
  if (first) {
    Sound.win(); celebrate();
    const m = MISSIONS.filter(function (x) { return x.id === id; })[0];
    modal({
      emoji: m.icon, title: '미션 완료! 🎉',
      body: [h('p', null, msg || ('“' + m.title + '” 미션을 해냈어요!')), h('p', { class: 'muted' }, '탐험 지도에 배지가 붙었어요.')],
      actions: [{ label: '탐험 지도로', primary: true, onClick: function () { location.hash = '#/home'; } }, { label: '계속 둘러보기' }]
    });
  } else {
    toast('이미 완료한 미션이에요. 다시 해도 멋져요! 👍', 'good');
  }
}

/* ---------- 단계 마법사 (문제 확인 → 아이디어 → 실행 → 평가) ---------- */
function wizard(root, key, steps) {
  let cur = 0;
  const bar = h('ol', { class: 'stepper' });
  const body = h('section', { class: 'step-body' });
  const foot = h('div', { class: 'step-foot' });
  root.append(bar, body, foot);

  const pk = function (i) { return key + '.' + i; };
  const unlocked = function (i) { return !!Store.d.prog[pk(i)]; };
  const reach = function () { let i = 0; while (i < steps.length - 1 && unlocked(i)) i++; return i; };

  function renderBar() {
    const r = reach();
    bar.replaceChildren.apply(bar, steps.map(function (s, i) {
      return h('li', { class: 'step' + (i === cur ? ' cur' : '') + (unlocked(i) ? ' done' : '') + (i > r ? ' locked' : '') },
        h('button', {
          type: 'button', disabled: i > r, 'aria-current': i === cur ? 'step' : null,
          onClick: function () { cur = i; draw(); }
        }, h('span', { class: 'dot' }, unlocked(i) ? '✓' : String(i + 1)), h('span', { class: 'lbl' }, s.label)));
    }));
  }
  function renderFoot() {
    foot.replaceChildren();
    if (cur > 0) foot.append(h('button', { class: 'btn btn-ghost', type: 'button', onClick: function () { cur--; draw(); } }, '◀ 이전'));
    foot.append(h('span', { class: 'spacer' }));
    if (cur < steps.length - 1) {
      const ok = unlocked(cur);
      if (!ok) foot.append(h('span', { class: 'gate-hint' }, '🔒 ' + (steps[cur].gate || '활동을 마치면 다음으로 갈 수 있어요.')));
      foot.append(h('button', {
        class: 'btn btn-primary' + (ok ? ' pulse' : ''), type: 'button', disabled: !ok,
        onClick: function () { cur++; draw(); }
      }, '다음: ' + steps[cur + 1].label + ' ▶'));
    }
  }
  function draw() {
    Cleanup.run();
    renderBar(); body.replaceChildren(); renderFoot();
    const s = steps[cur];
    const idx = cur;
    const api = {
      unlock: function () {
        if (!unlocked(idx)) { Store.d.prog[pk(idx)] = 1; Store.save(); Sound.ok(); toast('좋아요! 다음 단계가 열렸어요 ✨', 'good'); }
        if (cur === idx) { renderBar(); renderFoot(); }
      },
      isUnlocked: function () { return unlocked(idx); }
    };
    body.append(h('h2', { class: 'step-title' }, h('span', { class: 'step-ico' }, s.icon || ''), s.title || s.label));
    s.build(body, api);
    const top = root.getBoundingClientRect().top + window.scrollY - 70;
    if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  draw();
}

/* ---------- 스케치 판 ---------- */
function sketchPad(key) {
  const W = 640, H = 340;
  const cv = h('canvas', { width: W, height: H, class: 'sketch-canvas', 'aria-label': '스케치를 그리는 판' });
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const saved = Store.d.sketch[key];
  if (saved) { const img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0); }; img.src = saved; }
  let color = '#1d2b4f', size = 4, drawing = false, last = null;
  const colors = ['#1d2b4f', '#e63946', '#ff8a3d', '#ffc93c', '#12a05f', '#2a8cff', '#8b5cf6'];

  const pos = function (e) {
    const r = cv.getBoundingClientRect();
    return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  };
  const seg = function (a, b) {
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  };
  const persist = function () { try { Store.d.sketch[key] = cv.toDataURL('image/png'); Store.save(); } catch (e) { } };
  cv.addEventListener('pointerdown', function (e) { drawing = true; last = pos(e); seg(last, { x: last.x + 0.01, y: last.y }); try { cv.setPointerCapture(e.pointerId); } catch (x) { } });
  cv.addEventListener('pointermove', function (e) { if (!drawing) return; const p = pos(e); seg(last, p); last = p; });
  const end = function () { if (drawing) { drawing = false; persist(); } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);

  const swatches = h('div', { class: 'swatches' });
  const drawSwatches = function () {
    swatches.replaceChildren.apply(swatches, colors.map(function (c) {
      return h('button', {
        type: 'button', class: 'swatch' + (c === color ? ' on' : ''), style: { background: c }, 'aria-label': '색 ' + c,
        onClick: function () { color = c; size = 4; drawSwatches(); }
      });
    }).concat([
      h('button', { type: 'button', class: 'btn btn-small btn-ghost' + (color === '#ffffff' ? ' on' : ''), onClick: function () { color = '#ffffff'; size = 18; drawSwatches(); } }, '🧽 지우개'),
      h('button', {
        type: 'button', class: 'btn btn-small btn-ghost', onClick: function () {
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); persist();
        }
      }, '🗑️ 모두 지우기')
    ]));
  };
  drawSwatches();
  return h('div', { class: 'sketch' }, swatches, cv);
}

/* ---------- 메모(텍스트 상자) ---------- */
function noteBox(key, label, placeholder, rows) {
  const ta = h('textarea', {
    rows: rows || 3, placeholder: placeholder || '', 'aria-label': label,
    onInput: function () { Store.d.notes[key] = ta.value; Store.save(); }
  });
  ta.value = Store.d.notes[key] || '';
  return h('label', { class: 'note' }, h('span', { class: 'note-label' }, label), ta);
}

/* ---------- 평가 (잘함 / 보통 / 노력 요함) ---------- */
function ratingRow(key, text, onChange) {
  const opts = [['great', '😄', '잘함'], ['ok', '🙂', '보통'], ['try', '💪', '노력 요함']];
  const btns = h('div', { class: 'rate-btns', role: 'radiogroup', 'aria-label': text });
  const draw = function () {
    btns.replaceChildren.apply(btns, opts.map(function (o) {
      const on = Store.d.rating[key] === o[0];
      return h('button', {
        type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: 'rate' + (on ? ' on ' + o[0] : ''),
        onClick: function () { Store.d.rating[key] = o[0]; Store.save(); Sound.click(); draw(); if (onChange) onChange(); }
      }, h('span', { class: 'rate-emo' }, o[1]), o[2]);
    }));
  };
  draw();
  return h('div', { class: 'rate-row' }, h('p', { class: 'rate-q' }, text), btns);
}

/* ---------- 상단 메뉴 ---------- */
function renderTop() {
  const top = document.getElementById('topbar');
  const active = (location.hash.replace('#/', '') || 'home');
  const done = Object.keys(Store.d.done).filter(function (k) { return Store.d.done[k]; }).length;
  top.replaceChildren(
    h('div', { class: 'top-inner' },
      h('a', { class: 'brand', href: '#/home' }, h('span', { class: 'brand-ico' }, '🚀'), h('span', null, '수송 기술 탐험대')),
      h('nav', { class: 'topnav', 'aria-label': '미션 메뉴' }, MISSIONS.map(function (m, i) {
        return h('a', {
          href: '#/' + m.id, class: 'navchip' + (active === m.id ? ' on' : '') + (Store.d.done[m.id] ? ' done' : ''),
          style: { '--c': m.color }, 'aria-label': m.title
        }, h('span', null, m.icon), h('span', { class: 'navtxt' }, m.short), Store.d.done[m.id] ? h('span', { class: 'tick' }, '✓') : null);
      })),
      h('div', { class: 'top-tools' },
        h('span', { class: 'pill', title: '완료한 미션' }, '🏅 ' + done + '/4'),
        h('button', {
          class: 'icon-btn', type: 'button', 'aria-label': Store.d.mute ? '소리 켜기' : '소리 끄기', title: '소리',
          onClick: function () { Store.d.mute = !Store.d.mute; Store.save(); renderTop(); if (!Store.d.mute) Sound.click(); }
        }, Store.d.mute ? '🔇' : '🔊'))));
}

/* ---------- 라우터 ---------- */
const Router = {
  routes: {},
  render: function () {
    Cleanup.run();
    const name = location.hash.replace('#/', '') || 'home';
    const fn = this.routes[name] || this.routes.home;
    const app = document.getElementById('app');
    app.replaceChildren();
    app.dataset.page = name;
    fn(app);
    renderTop();
    window.scrollTo(0, 0);
    document.title = '수송 기술 탐험대';
  }
};
window.addEventListener('hashchange', function () { Router.render(); });

/* ---------- 말풍선 / 정보 카드 ---------- */
function bubble(who, text, side) {
  return h('div', { class: 'bubble-row ' + (side || 'left') },
    h('div', { class: 'avatar' }, who),
    h('div', { class: 'bubble' }, text));
}
function tip(icon, text, cls) {
  return h('div', { class: 'tip ' + (cls || '') }, h('span', { class: 'tip-ico' }, icon), h('div', null, text));
}

/* 분류 이름과 색 (모든 미션에서 같은 색·아이콘 사용) */
const CAT = {
  drive: { name: '구동 장치', icon: '⚙️', color: '#ff7a2f', desc: '움직이는 힘을 만들어요' },
  steer: { name: '조향 장치', icon: '🧭', color: '#2a8cff', desc: '가는 방향을 조종해요' },
  brake: { name: '제동 장치', icon: '🛑', color: '#e5446d', desc: '속도를 줄이거나 멈춰요' },
  other: { name: '그 밖의 구성 요소', icon: '🔩', color: '#6b7a99', desc: '꼭 필요한 다른 부품들이에요' }
};
function catChip(cat) {
  const c = CAT[cat];
  return h('span', { class: 'cat-chip', style: { '--c': c.color } }, c.icon + ' ' + c.name);
}
