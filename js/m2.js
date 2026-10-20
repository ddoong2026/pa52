'use strict';
/* 미션 2: 방향을 바꿔 날아가는 종이비행기 (교과서 66~67쪽) */

const PLAN_Q = [
  { id: 'straight', q: '정면으로 날게 하려면?', cat: 'steer', right: 'center',
    opts: [['center', '꼬리 날개를 접지 않고 가운데로 둬요'], ['left', '꼬리 날개를 왼쪽으로 접어요'], ['right', '꼬리 날개를 오른쪽으로 접어요']],
    why: '방향타(꼬리 날개)를 가운데에 두면 비행기가 곧게 날아가요.' },
  { id: 'turn', q: '왼쪽으로 방향을 바꿔 날게 하려면?', cat: 'steer', right: 'left',
    opts: [['left', '꼬리 날개를 왼쪽으로 접어요'], ['right', '꼬리 날개를 오른쪽으로 접어요'], ['wing', '날개 뒤쪽을 위로 접어요']],
    why: '방향타를 가고 싶은 쪽으로 돌리면 그쪽으로 방향을 바꿔요. 오른쪽도 마찬가지예요!' },
  { id: 'brake', q: '더 빠르게 착륙하게 하려면?', cat: 'brake', right: 'spoiler',
    opts: [['spoiler', '날개 뒤쪽을 위로 접어요 (스포일러)'], ['power', '더 세게 던져요'], ['tail', '꼬리 날개를 크게 접어요']],
    why: '날개 뒤쪽을 위로 접으면 공기 저항이 커져 속도가 줄고 빨리 내려앉아요. 스포일러와 같은 원리예요.' }
];

const MAP_ROWS = [
  { cat: 'drive', real: '엔진', right: 'hand', opts: [['hand', '손으로 던지는 힘'], ['tail', '꼬리 날개'], ['flap', '날개 뒤쪽 접기']] },
  { cat: 'steer', real: '방향타', right: 'tail', opts: [['hand', '손으로 던지는 힘'], ['tail', '꼬리 날개'], ['flap', '날개 뒤쪽 접기']] },
  { cat: 'brake', real: '스포일러', right: 'flap', opts: [['hand', '손으로 던지는 힘'], ['tail', '꼬리 날개'], ['flap', '날개 뒤쪽 접기']] }
];

const BUILD_STEPS = [
  '부록 6에서 각 부품을 뜯어낸 후 ❶, ❷, ❸을 접어요.',
  '❶, ❷, ❸을 각각 풀칠한 후 연결하여 몸체를 만들어요.',
  '몸체에 꼬리 날개 ❹를 끼우고, ❺와 ❻을 각각 풀칠하여 몸체와 꼬리 날개를 연결해요.',
  '❼에 ❽을 붙여 날개를 만들어요.',
  '몸체의 화살표와 날개의 화살표를 맞춘 다음, 뒤집어 ❾와 ❿을 각각 풀칠하여 몸체와 날개를 연결해 완성해요.',
  '내가 만든 종이비행기를 원하는 방향으로 날려 보고, 그 결과를 친구와 공유해요.'
];

function planAnswer(id) { const p = Store.d.best.m2plan || {}; return p[id]; }

/* ======================== 화면 ======================== */
function renderM2(app) {
  app.append(h('div', { class: 'page-head', style: { '--c': '#2a8cff' } },
    h('div', { class: 'ph-emoji' }, '✈️'),
    h('div', null, h('h1', null, '방향을 바꿔 날아가는 종이비행기'),
      h('p', null, '수송 수단 기본 요소의 특징을 적용한 종이비행기를 설계하고, 가상 비행장에서 날려 봐요.'))));
  const root = h('div', { class: 'wiz' });
  app.append(root);

  wizard(root, 'm2', [
    { label: '문제 확인', icon: '🧐', title: '문제 확인하기', gate: '해결할 문제 두 가지를 모두 찾으면 열려요.', build: m2Problem },
    { label: '아이디어', icon: '💡', title: '아이디어 탐색 및 구체화하기', gate: '① 연결하기와 ② 계획 세우기를 마치면 열려요.', build: m2Ideas },
    { label: '실행하기', icon: '🛠️', title: '실행하기 — 만들고 날려 보기', gate: '비행 미션 4개 중 3개 이상 성공하면 열려요.', build: m2Run },
    { label: '평가하기', icon: '⭐', title: '평가하기', build: m2Eval }
  ]);
}

/* ---------- 1. 문제 확인 ---------- */
function m2Problem(body, api) {
  body.append(h('p', { class: 'lead' }, '두 친구의 대화를 읽고, 종이비행기를 만들 때 어떤 문제를 해결해야 할지 찾아봅시다.'));
  body.append(h('div', { class: 'talk' },
    bubble('👧', '보통의 종이비행기는 날아가는 방향을 바꾸지 못하여 아쉬워.', 'left'),
    bubble('👦', '종이비행기가 착륙하는 속도를 조절하고 싶어.', 'right')));
  const choices = [
    ['종이비행기가 날아가는 방향을 바꿀 수 있게 하기', true],
    ['종이비행기가 착륙하는 속도를 조절할 수 있게 하기', true],
    ['종이비행기를 더 크고 무겁게 만들기', false],
    ['종이비행기에 건전지를 넣어 불 켜기', false]
  ];
  const picked = new Set();
  const list = h('div', { class: 'opts col check' });
  const msg = h('p', { class: 'feedback', 'aria-live': 'polite' }, '해결해야 할 문제를 모두 골라 보세요. (2개)');
  const draw = function () {
    list.replaceChildren.apply(list, choices.map(function (c, i) {
      return h('button', {
        type: 'button', role: 'checkbox', 'aria-checked': picked.has(i) ? 'true' : 'false', class: 'opt big-opt' + (picked.has(i) ? ' sel' : ''),
        onClick: function () { if (picked.has(i)) picked.delete(i); else picked.add(i); Sound.click(); draw(); }
      }, h('span', { class: 'box' }, picked.has(i) ? '☑' : '☐'), c[0]);
    }));
  };
  draw();
  const check = h('button', {
    class: 'btn btn-primary', type: 'button', onClick: function () {
      const ok = choices.every(function (c, i) { return picked.has(i) === c[1]; });
      if (ok) { msg.textContent = '✅ 맞아요! 방향을 바꾸는 것(조향)과 착륙 속도를 조절하는 것(제동)이 우리가 해결할 문제예요.'; api.unlock(); }
      else { msg.textContent = '🤔 대화를 다시 읽어 보세요. 두 친구가 아쉬워한 점과 바라는 점은 무엇이었나요?'; Sound.bad(); }
    }
  }, '확인하기');
  body.append(list, h('div', { class: 'row' }, check), msg);
  body.append(noteBox('m2.problem', '✏️ 내가 해결할 문제를 한 문장으로 써 봐요', '예) 방향을 바꾸고 착륙 속도를 조절할 수 있는 종이비행기를 만든다.', 2));
  if (api.isUnlocked()) msg.textContent = '✅ 이미 해결할 문제를 찾았어요. 다음 단계로 가요!';
}

/* ---------- 2. 아이디어 ---------- */
function m2Ideas(body, api) {
  const state = { map: {}, plan: Object.assign({}, Store.d.best.m2plan || {}) };
  const checkDone = function () {
    if (Object.keys(state.map).length === 3 && Object.keys(state.plan).length === 3) api.unlock();
  };
  if (api.isUnlocked()) { MAP_ROWS.forEach(function (r) { state.map[r.cat] = r.right; }); }

  /* (1) 조사 */
  body.append(h('div', { class: 'activity' },
    h('h3', null, '① 비행기의 기본 요소를 종이비행기와 연결하기'),
    h('p', null, '비행기의 기본 요소는 종이비행기에서 어느 부분과 같은 역할을 할까요?')));
  const mapBox = h('div', { class: 'mapping' });
  const drawMap = function () {
    mapBox.replaceChildren.apply(mapBox, MAP_ROWS.map(function (r) {
      const c = CAT[r.cat];
      const done = state.map[r.cat] === r.right;
      return h('div', { class: 'map-row', style: { '--c': c.color } },
        h('div', { class: 'map-left' }, h('b', null, c.icon + ' ' + c.name), h('span', null, '비행기의 ' + r.real)),
        h('div', { class: 'map-arrow' }, '➜'),
        h('div', { class: 'opts' }, r.opts.map(function (o) {
          const on = state.map[r.cat] === o[0];
          return h('button', {
            type: 'button', disabled: done, class: 'opt' + (on && done ? ' right' : '') + (on && !done ? ' wrong' : ''),
            onClick: function () {
              state.map[r.cat] = o[0];
              if (o[0] === r.right) Sound.ok(); else Sound.bad();
              drawMap(); checkDone();
            }
          }, o[1]);
        })));
    }));
  };
  drawMap();
  body.lastChild.append(mapBox);

  /* (2) 계획 */
  const plan = h('div', { class: 'activity' },
    h('h3', null, '② 계획 세우기 — 나는 이렇게 될 거라고 예상해요'),
    h('p', null, '어떻게 하면 될지 예상해서 골라 보세요. 정답은 시뮬레이션에서 직접 실험하며 확인해요!'));
  const qBox = h('div', { class: 'plan-q' });
  const drawPlan = function () {
    qBox.replaceChildren.apply(qBox, PLAN_Q.map(function (q) {
      const c = CAT[q.cat];
      return h('div', { class: 'plan-item', style: { '--c': c.color } },
        h('div', { class: 'plan-h' }, h('b', null, q.q), catChip(q.cat)),
        h('div', { class: 'opts' }, q.opts.map(function (o) {
          const on = state.plan[q.id] === o[0];
          return h('button', {
            type: 'button', class: 'opt' + (on ? ' sel' : ''),
            onClick: function () {
              state.plan[q.id] = o[0]; Store.d.best.m2plan = state.plan; Store.save(); Sound.click();
              drawPlan(); checkDone();
            }
          }, o[1]);
        })));
    }));
  };
  drawPlan();
  plan.append(qBox);
  body.append(plan);

  /* (3) 스케치 */
  body.append(h('div', { class: 'activity' },
    h('h3', null, '③ 내가 만들 종이비행기를 스케치하고, 특징을 써 봐요'),
    sketchPad('m2'),
    noteBox('m2.sketch', '✏️ 내 종이비행기의 특징', '예) 꼬리 날개를 왼쪽으로 접어 방향을 바꾸고, 날개 뒤쪽을 접어 속도를 줄인다.', 2)));
  checkDone();
}

/* ---------- 3. 실행하기 ---------- */
function m2Run(body, api) {
  /* 실제 만들기 안내 */
  const det = h('details', { class: 'build-guide' },
    h('summary', null, '✂️ 실제 종이비행기 만들기 안내 (부록 6)'),
    h('p', { class: 'muted' }, '준비물: 풀, 가위, 그림 도구, 부록 6'),
    h('ol', { class: 'checks' }, BUILD_STEPS.map(function (s, i) {
      return h('li', null, h('label', null, h('input', { type: 'checkbox' }), h('span', null, s)));
    })),
    tip('🎨', '그림 도구로 나만의 종이비행기로 꾸며 봐요. 날개와 꼬리 부분의 주황색 선을 오리고 파란색 선을 따라 접어 날려 보고, 이전과 어떻게 다르게 나는지 비교해 보아요.'),
    h('div', { class: 'safety' }, h('b', null, '🦺 안전하게 날려요'),
      h('ul', null,
        h('li', null, '종이비행기는 장애물이 없는 넓은 공간에서 날려요.'),
        h('li', null, '사람이 있는 쪽으로 날리지 않아요.'),
        h('li', null, '종이비행기가 날아가는 방향 앞으로 이동하지 않아요.'))));
  body.append(det);

  body.append(h('h3', { class: 'sub-title' }, '🛩️ 가상 비행장에서 실험하기'));
  const lab = h('div', { class: 'lab' });
  body.append(lab);
  buildPlaneLab(lab, api);
}

function buildPlaneLab(box, api) {
  const M = Sim.PLANE_MISSIONS;
  const cleared = (Store.d.best.m2cleared = Store.d.best.m2cleared || {});
  const S = { mi: 0, power: 5, angle: 10, rudder: 0, spoiler: 0, running: false, raf: 0, ghosts: [], logs: [], res: null };
  /* --- 3D 무대 --- */
  const stageBox = h('div', { class: 'stage3d' });
  const viewBtns = h('div', { class: 'stage-views', role: 'group', 'aria-label': '카메라 보기' });
  stageBox.append(viewBtns);
  let stage = null;
  const VIEWS = [['chase', '🎥 따라가기'], ['top', '🛰️ 위에서'], ['side', '👀 옆에서']];
  function drawViews() {
    viewBtns.replaceChildren.apply(viewBtns, VIEWS.map(function (v) {
      const on = stage && stage.getView() === v[0];
      return h('button', { type: 'button', class: 'vbtn' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onClick: function () { stage.setView(v[0]); drawViews(); } }, v[1]);
    }));
  }

  /* --- 설계도 미리보기 --- */
  const preview = h('div', { class: 'plane-preview', 'aria-hidden': 'true' });
  function drawPreview() {
    const w = 10 * S.spoiler;
    preview.replaceChildren(svgEl(
      '<svg viewBox="0 0 250 150"><rect width="250" height="150" rx="12" fill="#f1f7ff"/>' +
      '<polygon points="228,75 56,16 90,75 56,134" fill="#fff" stroke="#1d2b4f" stroke-width="3" stroke-linejoin="round"/>' +
      '<line x1="228" y1="75" x2="90" y2="75" stroke="#9aa7b8" stroke-width="2"/>' +
      (S.spoiler ? '<polygon points="56,16 90,75 ' + (90 + w) + ',75 ' + (56 + w) + ',16" fill="#ff7a2f" stroke="#b34a0b" stroke-width="2"/>' +
        '<polygon points="56,134 90,75 ' + (90 + w) + ',75 ' + (56 + w) + ',134" fill="#ff7a2f" stroke="#b34a0b" stroke-width="2"/>' : '') +
      '<line x1="90" y1="75" x2="62" y2="75" stroke="#5b6b82" stroke-width="7" stroke-linecap="round"/>' +
      '<g transform="rotate(' + (S.rudder * 32) + ' 62 75)"><line x1="62" y1="75" x2="36" y2="75" stroke="#2a8cff" stroke-width="7" stroke-linecap="round"/></g>' +
      '<text x="236" y="38" text-anchor="end" font-size="12" fill="#41557a">▲ 왼쪽</text><text x="236" y="136" text-anchor="end" font-size="12" fill="#41557a">▼ 오른쪽</text>' +
      '<text x="30" y="108" font-size="12" fill="#2a8cff" font-weight="700">꼬리 날개</text>' +
      (S.spoiler ? '<text x="150" y="56" font-size="12" fill="#b34a0b" font-weight="700">날개 뒤쪽 접기</text>' : '') +
      '</svg>'));
  }

  /* --- 컨트롤 --- */
  const RUD = [[1, '◀◀', '왼쪽 크게'], [0.5, '◀', '왼쪽 조금'], [0, '■', '가운데'], [-0.5, '▶', '오른쪽 조금'], [-1, '▶▶', '오른쪽 크게']];
  const SPO = [[0, '없음'], [1, '조금'], [2, '많이']];
  const missionsBox = h('div', { class: 'lab-missions', role: 'tablist' });
  const brief = h('div', { class: 'lab-brief' });
  const ctrl = h('div', { class: 'lab-ctrl' });
  const resultBox = h('div', { class: 'lab-result', 'aria-live': 'polite' });
  const logBox = h('div', { class: 'lab-log' });
  const progress = h('div', { class: 'lab-progress' });

  function drawMissions() {
    const chips = M.map(function (m, i) {
      const st = cleared[m.id] || 0;
      return h('button', {
        type: 'button', role: 'tab', 'aria-selected': S.mi === i ? 'true' : 'false', class: 'mchip' + (S.mi === i ? ' on' : '') + (st >= 2 ? ' ok' : ''),
        disabled: S.running,
        onClick: function () { S.mi = i; S.res = null; if (stage) stage.clearGhosts(); resultBox.replaceChildren(); refresh(); }
      }, h('span', { class: 'mchip-ico' }, m.icon), h('span', null, m.name), h('span', { class: 'stars' }, st ? '★'.repeat(st) : ''));
    });
    chips.push(h('button', {
      type: 'button', role: 'tab', 'aria-selected': S.mi === -1 ? 'true' : 'false', class: 'mchip' + (S.mi === -1 ? ' on' : ''), disabled: S.running,
      onClick: function () { S.mi = -1; S.res = null; if (stage) stage.clearGhosts(); resultBox.replaceChildren(); refresh(); }
    }, h('span', { class: 'mchip-ico' }, '🔬'), h('span', null, '자유 실험')));
    missionsBox.replaceChildren.apply(missionsBox, chips);
    const n = M.filter(function (m) { return (cleared[m.id] || 0) >= 2; }).length;
    progress.replaceChildren(h('b', null, '성공한 미션 ' + n + ' / 4'), h('span', { class: 'muted' }, ' (3개 이상 성공하면 다음 단계로!)'),
      h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: n / 4 * 100 + '%' } })));
    if (n >= 3) api.unlock();
  }
  function drawBrief() {
    const m = S.mi >= 0 ? M[S.mi] : null;
    brief.replaceChildren(m ? h('div', null, h('b', null, m.icon + ' ' + m.name + ' — '), m.brief)
      : h('div', null, h('b', null, '🔬 자유 실험 — '), '과녁 없이 마음껏 바꿔 날려 보세요. 꼬리 날개, 날개 뒤쪽 접기, 던지는 힘을 바꾸면 비행이 어떻게 달라질까요?'));
  }
  function slider(label, key, min, max, unit, icon) {
    const out = h('output', null, S[key] + unit);
    const inp = h('input', {
      type: 'range', min: min, max: max, step: 1, value: S[key], 'aria-label': label, disabled: S.running,
      onInput: function () { S[key] = +inp.value; out.textContent = S[key] + unit; }
    });
    return h('label', { class: 'ctl' }, h('span', { class: 'ctl-l' }, icon + ' ' + label), inp, out);
  }
  function drawCtrl() {
    ctrl.replaceChildren(
      h('div', { class: 'ctl-group', style: { '--c': CAT.drive.color } },
        h('div', { class: 'ctl-h' }, CAT.drive.icon + ' 구동 장치 — 던지는 힘'),
        slider('던지는 힘', 'power', 1, 10, '단계', '💪'),
        slider('던지는 각도', 'angle', 0, 30, '°', '↗️')),
      h('div', { class: 'ctl-group', style: { '--c': CAT.steer.color } },
        h('div', { class: 'ctl-h' }, CAT.steer.icon + ' 조향 장치 — 꼬리 날개 접기'),
        h('div', { class: 'seg five' }, RUD.map(function (r) {
          return h('button', {
            type: 'button', disabled: S.running, class: 'segb' + (S.rudder === r[0] ? ' on' : ''), 'aria-pressed': S.rudder === r[0] ? 'true' : 'false',
            onClick: function () { S.rudder = r[0]; Sound.click(); drawCtrl(); drawPreview(); }
          }, h('span', { class: 'segb-i' }, r[1]), h('span', { class: 'segb-t' }, r[2]));
        }))),
      h('div', { class: 'ctl-group', style: { '--c': CAT.brake.color } },
        h('div', { class: 'ctl-h' }, CAT.brake.icon + ' 제동 장치 — 날개 뒤쪽 위로 접기'),
        h('div', { class: 'seg three' }, SPO.map(function (r) {
          return h('button', {
            type: 'button', disabled: S.running, class: 'segb' + (S.spoiler === r[0] ? ' on' : ''), 'aria-pressed': S.spoiler === r[0] ? 'true' : 'false',
            onClick: function () { S.spoiler = r[0]; Sound.click(); drawCtrl(); drawPreview(); }
          }, h('span', { class: 'segb-t' }, r[1]));
        }))),
      h('div', { class: 'lab-actions' },
        h('button', { class: 'btn btn-primary btn-big', type: 'button', disabled: S.running, onClick: launch }, S.running ? '✈️ 날아가는 중…' : '🛫 날리기!'),
        h('label', { class: 'slowchk' }, h('input', { type: 'checkbox', id: 'slow', checked: true }), ' 🐢 천천히 보기')),
      h('p', { class: 'muted small' }, '💡 한 번에 한 가지씩만 바꿔서 날려 보면 무엇 때문에 달라졌는지 알 수 있어요.'));
  }
  function refresh() {
    drawMissions(); drawBrief(); drawCtrl(); drawPreview();
    if (stage) {
      stage.setMission(S.mi >= 0 ? M[S.mi] : null); stage.setConfig(S.rudder, S.spoiler);
      if (!S.res) stage.reset();
    }
  }

  /* --- 날리기 --- */
  function launch() {
    if (S.running) return;
    const params = { power: S.power, angle: S.angle, rudder: S.rudder, spoiler: S.spoiler };
    const res = Sim.flyPlane(params);
    res.rud = S.rudder; res.spo = S.spoiler; res.params = params;
    S.res = res; S.running = true;
    resultBox.replaceChildren();
    drawMissions(); drawCtrl();
    Sound.whoosh();
    const speed = (document.getElementById('slow') || { checked: true }).checked ? 0.5 : 1;
    stage.play(res, speed, function () { finish(res); });
  }

  function finish(res) {
    S.running = false;
    const m = S.mi >= 0 ? M[S.mi] : null;
    const sc = Sim.scorePlane(m, res);
    stage.addGhost(res);
    const latDir = Math.abs(res.endY) < 0.4 ? '거의 곧게' : (res.endY > 0 ? '왼쪽으로 ' + res.endY.toFixed(1) + ' m' : '오른쪽으로 ' + (-res.endY).toFixed(1) + ' m');
    const lines = [
      h('div', { class: 'rs-grid' },
        h('div', null, h('span', null, '비행 시간'), h('b', null, res.time.toFixed(1) + '초')),
        h('div', null, h('span', null, '날아간 거리'), h('b', null, res.endX.toFixed(1) + ' m')),
        h('div', null, h('span', null, '방향 변화'), h('b', null, latDir)),
        h('div', null, h('span', null, '착륙 속도'), h('b', null, res.landingSpeed.toFixed(1) + ' m/s')))
    ];
    if (sc) {
      if (sc.success) {
        if (!cleared[m.id] || cleared[m.id] < sc.stars) cleared[m.id] = sc.stars;
        Store.save(); Sound.win(); celebrate(['⭐', '✨']);
        lines.unshift(h('div', { class: 'rs-top good' }, '🎯 성공! ' + '★'.repeat(sc.stars) + '☆'.repeat(3 - sc.stars)));
      } else {
        Sound.bad();
        lines.unshift(h('div', { class: 'rs-top' }, sc.stars === 1 ? '😮 아깝다! 과녁 근처에 떨어졌어요.' : '🤔 과녁에서 많이 벗어났어요.'));
        lines.push(h('p', { class: 'hint' }, '💡 ' + planeHint(m, res, sc)));
      }
    } else {
      Sound.ok();
      lines.unshift(h('div', { class: 'rs-top' }, '📋 실험 결과'));
      lines.push(h('p', { class: 'hint' }, '💡 ' + freeHint(res)));
    }
    resultBox.replaceChildren.apply(resultBox, lines);
    S.logs.unshift({
      power: S.power, rud: S.rudder, spo: S.spoiler, dist: res.endX, lat: res.endY, v: res.landingSpeed,
      mission: m ? m.name : '자유', result: sc ? (sc.success ? '성공 ' + '★'.repeat(sc.stars) : '실패') : '-'
    });
    S.logs = S.logs.slice(0, 6);
    drawLog(); drawMissions(); drawCtrl();
  }

  function planeHint(m, res, sc) {
    const out = [];
    const dy = res.endY - m.ty, dx = res.endX - m.tx;
    if (m.maxSpeed && res.landingSpeed > m.maxSpeed) {
      out.push('착륙 속도가 ' + res.landingSpeed.toFixed(1) + ' m/s예요. ' + m.maxSpeed + ' m/s 이하가 되어야 해요. 날개 뒤쪽을 접어 속도를 줄이고, 줄어든 거리는 던지는 힘으로 채워 보세요.');
    }
    if (Math.abs(dy) > m.r * 0.6) {
      if (m.ty > 0.5 || m.ty < -0.5) {
        const wantLeft = m.ty > 0;
        const wentLeft = dy < 0 ? false : true;
        if ((wantLeft && !wentLeft) || (!wantLeft && wentLeft)) out.push('방향이 부족해요. 꼬리 날개를 ' + (wantLeft ? '왼쪽' : '오른쪽') + '으로 더 접어 보세요.');
        else out.push('방향을 너무 많이 바꿨어요. 꼬리 날개를 덜 접어 보세요.');
      } else {
        out.push(dy > 0 ? '비행기가 왼쪽으로 휘었어요. 꼬리 날개를 가운데로 맞춰 보세요.' : '비행기가 오른쪽으로 휘었어요. 꼬리 날개를 가운데로 맞춰 보세요.');
      }
    }
    if (Math.abs(dx) > m.r * 0.6 && !(m.maxSpeed && res.landingSpeed > m.maxSpeed && dx > 0)) {
      out.push(dx < 0 ? '과녁보다 짧게 떨어졌어요. 던지는 힘을 키우거나 날개 뒤쪽 접기를 줄여 보세요.' : '과녁보다 멀리 갔어요. 던지는 힘을 줄이거나 날개 뒤쪽을 접어 보세요.');
    }
    return out.length ? out.join(' ') : '조금만 더 다듬으면 성공할 거예요!';
  }
  function freeHint(res) {
    if (Math.abs(res.endY) > 1.5) return '꼬리 날개(조향 장치)가 비행 방향을 바꿨어요!';
    if (res.landingSpeed < 3) return '날개 뒤쪽을 접어(제동 장치) 속도를 많이 줄였어요!';
    return '꼬리 날개를 가운데 두면 곧게 날아가요. 이제 다른 값도 바꿔 볼까요?';
  }

  function drawLog() {
    if (!S.logs.length) { logBox.replaceChildren(h('p', { class: 'muted' }, '아직 날린 기록이 없어요. 🛫 날리기를 눌러 보세요!')); return; }
    const rl = { 1: '왼쪽 크게', 0.5: '왼쪽 조금', 0: '가운데', '-0.5': '오른쪽 조금', '-1': '오른쪽 크게' };
    const sl = ['없음', '조금', '많이'];
    logBox.replaceChildren(h('h4', null, '📒 내 실험 기록 (최근 6번)'),
      h('div', { class: 'tbl-wrap' }, h('table', null,
        h('thead', null, h('tr', null, ['미션', '힘', '꼬리 날개', '날개 접기', '거리', '방향', '착륙 속도', '결과'].map(function (t) { return h('th', null, t); }))),
        h('tbody', null, S.logs.map(function (l) {
          return h('tr', null, [l.mission, l.power, rl[l.rud], sl[l.spo], l.dist.toFixed(1) + ' m',
            Math.abs(l.lat) < 0.4 ? '직진' : (l.lat > 0 ? '왼쪽 ' : '오른쪽 ') + Math.abs(l.lat).toFixed(1) + ' m', l.v.toFixed(1) + ' m/s', l.result].map(function (t) { return h('td', null, String(t)); }));
        })))));
  }

  const left = h('div', { class: 'lab-views' }, stageBox, resultBox);
  const right = h('div', { class: 'lab-side' }, preview, ctrl);
  box.append(progress, missionsBox, brief, h('div', { class: 'lab-main' }, left, right), logBox);
  stage = T3.make('plane', stageBox);
  Cleanup.add(function () { stage.dispose(); });
  drawViews(); refresh(); drawLog();
}

/* ---------- 4. 평가 ---------- */
function m2Eval(body) {
  const cl = Store.d.best.m2cleared || {};
  const n = Sim.PLANE_MISSIONS.filter(function (m) { return (cl[m.id] || 0) >= 2; }).length;
  const total = Object.keys(cl).reduce(function (a, k) { return a + (cl[k] || 0); }, 0);

  body.append(h('div', { class: 'summary-card' },
    h('div', { class: 'big' }, n >= 3 ? '🏆' : '✈️'),
    h('div', null, h('h3', null, '내 비행 결과'), h('p', null, '성공한 미션 ' + n + '개 · 별 ' + total + '개 ⭐'))));

  /* 예상 점검 */
  const plan = Store.d.best.m2plan || {};
  body.append(h('div', { class: 'activity' }, h('h3', null, '🔍 나의 예상, 맞았을까요?'),
    h('div', { class: 'predict' }, PLAN_Q.map(function (q) {
      const mine = plan[q.id];
      const label = (q.opts.filter(function (o) { return o[0] === mine; })[0] || ['', '(고르지 않았어요)'])[1];
      const ok = mine === q.right;
      return h('div', { class: 'pred ' + (ok ? 'ok' : 'redo') },
        h('div', { class: 'pred-q' }, q.q), h('div', null, '내 예상: ' + label),
        h('div', { class: 'pred-r' }, (ok ? '✅ 맞았어요! ' : '🔁 실험해 보니 달라요. ') + q.why));
    }))));

  body.append(h('div', { class: 'activity' }, h('h3', null, '내가 만든 종이비행기를 평가해 봅시다.'),
    ratingRow('m2.r1', '문제를 해결하기 위해 세운 계획대로 만들었나요?'),
    ratingRow('m2.r2', '수송 수단 기본 요소의 특징을 적용하여 만들었나요?'),
    ratingRow('m2.r3', '종이비행기를 원하는 대로 날리거나 착륙하게 할 수 있나요?'),
    noteBox('m2.reflect', '✏️ 더 좋게 만들려면 어떻게 하면 좋을까요?', '예) 날개 뒤쪽을 더 길게 접으면 더 천천히 내려올 것 같아요.', 2)));

  body.append(h('div', { class: 'row center' }, h('button', {
    class: 'btn btn-primary btn-big', type: 'button',
    onClick: function () {
      if (!Store.d.rating['m2.r1'] || !Store.d.rating['m2.r2'] || !Store.d.rating['m2.r3']) { toast('세 가지 평가를 모두 눌러 주세요 🙂'); Sound.bad(); return; }
      completeMission('m2', '방향도 바꾸고 속도도 조절하는 종이비행기를 설계했어요!');
    }
  }, '🏅 미션 완료하기')));
}
