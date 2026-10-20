'use strict';
/* 미션 4: 탐험 마무리 — 진로 찾기 · 생각 넓히기 · 수료증 (교과서 69쪽) */

const REPAIR_CASES = [
  { sym: '🚗 핸들을 돌려도 자동차가 방향을 바꾸지 않아요.', a: 'steer', fix: '핸들과 바퀴를 이어 주는 조향 부품을 점검해요.' },
  { sym: '🚗 브레이크를 밟아도 자동차가 잘 멈추지 않아요.', a: 'brake', fix: '브레이크의 닳은 부품을 새것으로 교체해요.' },
  { sym: '🔌 전기 자동차인데 출발 버튼을 눌러도 바퀴가 돌지 않아요.', a: 'drive', fix: '전기 모터와 배터리가 잘 연결되어 있는지 확인해요.' },
  { sym: '🚢 배가 닻을 내렸는데도 계속 떠내려가요.', a: 'brake', fix: '닻줄과 닻의 상태를 확인하고 고쳐요.' },
  { sym: '✈️ 비행기가 착륙할 때 속도가 줄지 않아요.', a: 'brake', fix: '날개 위 스포일러가 잘 펴지는지 점검해요.' },
  { sym: '☀️ 태양광 자동차가 햇빛이 있는데도 전혀 달리지 않아요.', a: 'drive', fix: '태양 전지판과 모터의 전선이 같은 색끼리 연결됐는지 확인해요.' }
];

const WHY_ECO = [
  ['공기를 깨끗하게 지킬 수 있어요. (배기가스·미세 먼지 줄이기)', true],
  ['지구 온난화를 늦출 수 있어요. (이산화 탄소 줄이기)', true],
  ['석유 같은 한정된 자원을 아낄 수 있어요.', true],
  ['우리와 미래 세대가 건강하게 살 수 있어요.', true],
  ['자동차가 소리를 크게 내면 더 멋있어요.', false]
];

function renderM4(app) {
  app.append(h('div', { class: 'page-head', style: { '--c': '#8b5cf6' } },
    h('div', { class: 'ph-emoji' }, '🏅'),
    h('div', null, h('h1', null, '탐험 마무리'), h('p', null, '진로를 살펴보고, 생각을 넓히고, 수료증을 받아요!'))));
  const flags = (Store.d.best.m4 = Store.d.best.m4 || {});
  const root = h('div', { class: 'wiz' });
  app.append(root);
  const bar = h('div', { class: 'vtabs', role: 'tablist' });
  const pane = h('div', { class: 'run-pane' });
  let cur = 'job';
  const T = [['job', '🔧', '진로 찾기'], ['think', '💭', '생각 넓히기'], ['cert', '🏆', '수료증']];
  const drawBar = function () {
    bar.replaceChildren.apply(bar, T.map(function (t) {
      return h('button', {
        type: 'button', role: 'tab', 'aria-selected': cur === t[0] ? 'true' : 'false', class: 'vtab' + (cur === t[0] ? ' on' : ''),
        onClick: function () { cur = t[0]; drawBar(); drawPane(); }
      }, h('span', { class: 'vtab-ico' }, t[1]), t[2], flags[t[0]] ? ' ✅' : '');
    }));
  };
  const drawPane = function () {
    pane.replaceChildren();
    if (cur === 'job') jobPane(pane, flags, drawBar);
    else if (cur === 'think') thinkPane(pane, flags, drawBar);
    else certPane(pane, flags);
  };
  root.append(bar, pane);
  drawBar(); drawPane();
}

/* ---------- 진로 찾기: 친환경 자동차 정비사 ---------- */
function jobPane(box, flags, drawBar) {
  box.append(h('div', { class: 'job-card' }, h('div', { class: 'big' }, '🧑‍🔧'),
    h('div', null, h('h3', null, '진로 찾기 · 친환경 자동차 정비사'), h('p', null, '친환경 자동차의 고장 난 부품을 교체하거나 고쳐 줍니다.'),
      h('p', { class: 'muted' }, '정비사가 되려면 구동·조향·제동 장치가 각각 무슨 일을 하는지 잘 알아야 해요. 고장 신고를 보고 어떤 장치가 문제인지 찾아 주세요!'))));
  let idx = 0, score = 0;
  const cases = shuffle(REPAIR_CASES).slice(0, 5);
  const play = h('div', { class: 'quiz' });
  box.append(play);
  const show = function () {
    if (idx >= cases.length) {
      const pass = score >= 4;
      play.replaceChildren(h('div', { class: 'quiz-end' }, h('div', { class: 'big' }, pass ? '🛠️' : '📚'), h('h3', null, '수리 성공 ' + score + ' / ' + cases.length),
        h('p', null, pass ? '훌륭한 정비사예요! 고장 난 장치를 정확히 찾아냈어요.' : '구동 · 조향 · 제동 장치를 한 번 더 떠올려 보고 다시 도전해요.'),
        h('div', { class: 'row' }, h('button', { class: 'btn btn-ghost', type: 'button', onClick: function () { idx = 0; score = 0; show(); } }, '🔁 다시 하기'))));
      if (pass) { flags.job = 1; Store.save(); drawBar(); }
      return;
    }
    const c = cases[idx];
    const fb = h('p', { class: 'feedback' });
    const next = h('button', { class: 'btn btn-primary', type: 'button', hidden: true, onClick: function () { idx++; show(); } }, idx === cases.length - 1 ? '결과 보기' : '다음 고장 ▶');
    let answered = false;
    play.replaceChildren(h('div', { class: 'quiz-n' }, '고장 신고 ' + (idx + 1) + ' / ' + cases.length), h('h3', { class: 'quiz-q' }, c.sym),
      h('p', null, '어느 장치가 고장 났을까요?'),
      h('div', { class: 'opts' }, ['drive', 'steer', 'brake'].map(function (k) {
        const cat = CAT[k];
        const b = h('button', {
          type: 'button', class: 'opt big-opt', style: { '--c': cat.color }, onClick: function () {
            if (answered) return; answered = true;
            if (k === c.a) { b.classList.add('right'); score++; fb.textContent = '✅ 맞아요! ' + c.fix; Sound.ok(); }
            else { b.classList.add('wrong'); fb.textContent = '❌ 아니에요. 정답은 ' + CAT[c.a].name + '예요. ' + c.fix; Sound.bad(); }
            play.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
            next.hidden = false;
          }
        }, cat.icon + ' ' + cat.name);
        return b;
      })), fb, next);
  };
  show();
}

/* ---------- 생각 넓히기 ---------- */
function thinkPane(box, flags, drawBar) {
  box.append(h('div', { class: 'job-card' }, h('div', { class: 'big' }, '🌍'),
    h('div', null, h('h3', null, '생각 넓히기'), h('p', { class: 'big-q' }, '친환경 수송 수단이 필요한 까닭은 무엇일까요?'))));
  const pick = new Set(Store.d.best.m4why || []);
  const list = h('div', { class: 'opts col check' });
  const msg = h('p', { class: 'feedback', 'aria-live': 'polite' }, '알맞은 까닭을 모두 골라 보세요.');
  const draw = function () {
    list.replaceChildren.apply(list, WHY_ECO.map(function (w, i) {
      return h('button', {
        type: 'button', role: 'checkbox', 'aria-checked': pick.has(i) ? 'true' : 'false', class: 'opt big-opt' + (pick.has(i) ? ' sel' : ''),
        onClick: function () { if (pick.has(i)) pick.delete(i); else pick.add(i); Sound.click(); draw(); }
      }, h('span', { class: 'box' }, pick.has(i) ? '☑' : '☐'), w[0]);
    }));
  };
  draw();
  box.append(list, h('div', { class: 'row' }, h('button', {
    class: 'btn btn-primary', type: 'button', onClick: function () {
      const wrong = WHY_ECO.some(function (w, i) { return pick.has(i) && !w[1]; });
      const good = WHY_ECO.filter(function (w, i) { return pick.has(i) && w[1]; }).length;
      if (wrong) { msg.textContent = '🤔 그 중에 친환경과 관계없는 까닭이 섞여 있어요. 다시 살펴보세요.'; Sound.bad(); return; }
      if (good < 2) { msg.textContent = '🙂 좋아요! 까닭을 두 가지 이상 골라 보세요.'; Sound.bad(); return; }
      Store.d.best.m4why = Array.from(pick); flags.think = 1; Store.save(); drawBar(); Sound.ok();
      msg.textContent = '✅ 훌륭해요! 친환경 수송 수단은 우리 모두의 건강과 지구를 위해 꼭 필요해요.';
    }
  }, '확인하기')), msg,
    noteBox('m4.think', '✏️ 내 생각을 나만의 말로 써 봐요', '예) 내가 어른이 되었을 때도 파란 하늘을 보고 싶어서, 친환경 자동차가 더 많아졌으면 좋겠어요.', 3));
}

/* ---------- 수료증 ---------- */
function certPane(box, flags) {
  const ready = Store.d.done.m1 && Store.d.done.m2 && Store.d.done.m3 && flags.job && flags.think;
  const items = [
    ['m1', '🔍 수송 수단의 구성 요소', !!Store.d.done.m1], ['m2', '✈️ 종이비행기 설계', !!Store.d.done.m2], ['m3', '🌞 친환경 자동차', !!Store.d.done.m3],
    ['job', '🔧 진로 찾기', !!flags.job], ['think', '💭 생각 넓히기', !!flags.think]
  ];
  box.append(h('div', { class: 'checklist' }, items.map(function (i) {
    return h('div', { class: 'cl ' + (i[2] ? 'ok' : '') }, (i[2] ? '✅ ' : '⬜ ') + i[1]);
  })));
  if (!ready) {
    box.append(tip('🔒', '위의 활동을 모두 마치면 수료증이 열려요. 미션 1~3은 위쪽 메뉴에서 이어서 할 수 있어요.'));
    return;
  }
  const nameIn = h('input', { type: 'text', maxlength: 12, placeholder: '이름을 써 주세요', 'aria-label': '이름', value: Store.d.name || '' });
  const cert = h('div', { class: 'certificate', id: 'certificate' });
  const draw = function () {
    const d = new Date();
    cert.replaceChildren(h('div', { class: 'cert-in' },
      h('div', { class: 'cert-emoji' }, '🏅'), h('h2', null, '수 료 증'),
      h('div', { class: 'cert-name' }, (Store.d.name || '이름을 써 주세요')),
      h('p', null, '위 어린이는 「수송 기술 탐험대」에서'), h('p', null, '수송 수단의 구성 요소를 알아보고,'),
      h('p', null, '방향을 바꿔 날아가는 종이비행기와'), h('p', null, '나만의 친환경 자동차를 설계하며'), h('p', null, '문제를 해결하는 힘을 길렀기에 이 증서를 드립니다.'),
      h('div', { class: 'cert-date' }, d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일'),
      h('div', { class: 'cert-icons' }, '🚗 ✈️ 🚢 🚲 ☀️')));
  };
  nameIn.addEventListener('input', function () { Store.d.name = nameIn.value; Store.save(); draw(); });
  draw();
  box.append(h('label', { class: 'name-in' }, h('span', null, '✏️ 수료증에 들어갈 이름'), nameIn), cert,
    h('div', { class: 'row center' },
      h('button', { class: 'btn btn-ghost', type: 'button', onClick: function () { window.print(); } }, '🖨️ 인쇄하기'),
      h('button', {
        class: 'btn btn-primary btn-big', type: 'button',
        onClick: function () { if (!Store.d.name) { toast('이름을 먼저 써 주세요 🙂'); return; } completeMission('m4', '모든 탐험을 마쳤어요. 정말 멋진 탐험대원이에요!'); }
      }, '🎉 탐험 마치기')));
}
