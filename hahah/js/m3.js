'use strict';
/* 미션 3: 나만의 친환경 자동차 만들기 (교과서 68~69쪽) */

const ECO_CARS = [
  { id: 'ev', icon: '🔌', name: '전기 자동차', energy: '배터리에 저장한 전기', how: '전기 모터가 바퀴를 돌려요.', good: '달리는 동안 배기가스가 나오지 않아요. 소리도 조용해요.', limit: '충전하는 시간이 필요하고 충전소가 있어야 해요.', gas: 0 },
  { id: 'solar', icon: '☀️', name: '태양광 자동차', energy: '햇빛', how: '태양 전지판이 햇빛을 전기로 바꿔 모터를 돌려요.', good: '연료가 필요 없고 배기가스도 나오지 않아요.', limit: '밤이나 흐린 날에는 힘이 약해져요.', gas: 0 },
  { id: 'h2', icon: '💧', name: '수소 연료 전지 자동차', energy: '수소', how: '수소와 산소가 만나 전기를 만들고, 그 전기로 모터를 돌려요.', good: '달리면서 나오는 것은 깨끗한 물뿐이에요.', limit: '수소 충전소가 아직 적고, 수소를 안전하게 보관해야 해요.', gas: 0 },
  { id: 'hybrid', icon: '🔋', name: '하이브리드 자동차', energy: '연료 + 전기', how: '엔진과 전기 모터를 함께 써서 연료를 아껴요.', good: '휘발유 자동차보다 연료를 덜 쓰고 배기가스도 줄어들어요.', limit: '엔진이 있어서 배기가스가 완전히 없어지지는 않아요.', gas: 2 }
];

const SUPPLIES = [
  ['🛞', '바퀴 4개', true], ['📏', '바퀴 축 2개', true], ['🥤', '빨대', true], ['⚙️', '기어(큰 것·작은 것)', true],
  ['📦', '재활용품', true], ['✂️', '가위', true], ['🩹', '테이프', true], ['🔖', '양면테이프', true],
  ['🌀', '모터', true], ['☀️', '태양 전지판', true], ['🖍️', '꾸미기 도구', true],
  ['⛽', '휘발유', false], ['🔋', '건전지', false], ['🎈', '풍선', false], ['🧲', '자석', false]
];

const CAR_BUILD = [
  { t: '바퀴 축을 빨대에 끼우고 바퀴를 연결한 뒤, 4개의 바퀴 가운데 하나의 바퀴와 축 사이에 큰 기어를 연결해요.', tip: '4개의 바퀴가 모두 바닥에 닿아야 하고, 앞바퀴 축과 뒷바퀴 축이 서로 평행해야 해요.' },
  { t: '재활용 상자에서 오려 낸 두꺼운 종이에 바퀴와 연결한 바퀴 축을 테이프로 각각 붙여 바퀴 판을 만들어요.', tip: '바퀴 축, 가위 등 뾰족한 부품이나 도구를 사용할 때에는 손을 다치지 않도록 조심해요.' },
  { t: '모터의 축에 작은 기어를 연결해요.', tip: '' },
  { t: '큰 기어와 작은 기어를 맞물린 다음, 모터를 양면테이프로 바퀴 판에 붙여요.', tip: '두 기어의 이빨이 서로 맞물려야 힘이 전달돼요.' },
  { t: '두꺼운 종이로 모터 높이에 맞게 덮개를 만들어서 바퀴 판을 덮고 테이프로 붙여요.', tip: '' },
  { t: '재활용품으로 자동차 몸체를 만들어 꾸며요.', tip: '택배 상자, 우유갑 등 다양한 재활용품을 활용해요.' },
  { t: '자동차 몸체를 덮개 위에 붙이고, 태양 전지판과 모터의 전선을 같은 색끼리 연결해요.', tip: '' },
  { t: '햇빛이 비추는 곳에서 태양광 자동차가 잘 움직이는지 확인해요.', tip: '햇빛이 들어오는 각도에 맞게 태양 전지판을 조절해요.' }
];

function m3flags() { return (Store.d.best.m3 = Store.d.best.m3 || {}); }

/* ======================== 화면 ======================== */
function renderM3(app) {
  app.append(h('div', { class: 'page-head', style: { '--c': '#12a05f' } },
    h('div', { class: 'ph-emoji' }, '🌞'),
    h('div', null, h('h1', null, '나만의 친환경 자동차 만들기'),
      h('p', null, '재활용품을 이용하여 친환경 에너지로 움직이는 자동차를 설계하고 달려 봐요.'))));
  const root = h('div', { class: 'wiz' });
  app.append(root);
  wizard(root, 'm3', [
    { label: '문제 확인', icon: '🏭', title: '문제 확인하기', gate: '해결할 문제를 찾으면 열려요.', build: m3Problem },
    { label: '아이디어', icon: '💡', title: '아이디어 탐색 및 구체화하기', gate: '카드 4장을 모두 뒤집고 특징을 고르면 열려요.', build: m3Ideas },
    { label: '실행하기', icon: '🛠️', title: '실행하기 — 태양광 자동차 만들기', gate: '준비물 · 조립 · 달리기 실험을 모두 마치면 열려요.', build: m3Run },
    { label: '평가하기', icon: '⭐', title: '평가하기', build: m3Eval }
  ]);
}

/* ---------- 1. 문제 확인 ---------- */
function m3Problem(body, api) {
  body.append(h('p', { class: 'lead' }, '그림을 보고, 어떤 문제를 해결해야 할지 생각해 봅시다. 도로 위의 자동차 수를 바꿔 보세요!'));
  const st = { cars: 14, eco: 0 };
  const sky = h('div', { class: 'smog' });
  const road = h('div', { class: 'road' });
  const face = h('div', { class: 'smog-face' });
  const gauge = h('div', { class: 'bar big' }, h('div', { class: 'bar-fill smogfill' }));
  const msg = h('p', { class: 'feedback', 'aria-live': 'polite' });
  const draw = function () {
    const gasN = Math.round(st.cars * (1 - st.eco / 100));
    const level = gasN / 20;
    sky.style.opacity = (0.08 + level * 0.8).toFixed(2);
    road.replaceChildren.apply(road, Array.from({ length: st.cars }, function (_, i) {
      const isGas = i < gasN;
      return h('span', { class: 'rcar ' + (isGas ? 'gas' : 'eco') }, isGas ? h('i', { class: 'puff' }, '💨') : h('i', { class: 'leaf' }, '🌿'), '🚗');
    }));
    gauge.firstChild.style.width = Math.min(100, level * 100) + '%';
    gauge.firstChild.style.background = level < 0.3 ? '#12a05f' : (level < 0.6 ? '#f4a300' : '#e5446d');
    const f = level < 0.15 ? ['😀', '공기가 맑아요!'] : level < 0.4 ? ['🙂', '조금 뿌옇네요.'] : level < 0.7 ? ['😷', '숨쉬기가 불편해요.'] : ['🤢', '스모그 경보! 공기가 너무 나빠요.'];
    face.replaceChildren(h('span', { class: 'big' }, f[0]), h('b', null, f[1]));
  };
  const s1 = h('label', { class: 'ctl' }, h('span', { class: 'ctl-l' }, '🚗 도로 위 자동차 수'),
    h('input', { type: 'range', min: 1, max: 20, value: st.cars, 'aria-label': '자동차 수', onInput: function (e) { st.cars = +e.target.value; o1.textContent = st.cars + '대'; draw(); } }));
  const o1 = h('output', null, st.cars + '대'); s1.append(o1);
  const s2 = h('label', { class: 'ctl' }, h('span', { class: 'ctl-l' }, '🌿 친환경 자동차 비율'),
    h('input', { type: 'range', min: 0, max: 100, step: 10, value: st.eco, 'aria-label': '친환경 자동차 비율', onInput: function (e) { st.eco = +e.target.value; o2.textContent = st.eco + '%'; draw(); } }));
  const o2 = h('output', null, '0%'); s2.append(o2);

  body.append(h('div', { class: 'city' }, sky, h('div', { class: 'skyline', 'aria-hidden': 'true' }, '🏢🏬🏭🏢🏬🏢🏭🏬'), road),
    h('div', { class: 'city-ctl' }, s1, s2, face, gauge));
  draw();

  body.append(h('div', { class: 'activity' },
    h('h3', null, '💨 자동차가 달릴 때 나오는 물질'),
    h('div', { class: 'facts' },
      h('div', { class: 'fact' }, h('b', null, '이산화 탄소'), h('span', null, '지구가 점점 더워지는 지구 온난화의 원인이 돼요.')),
      h('div', { class: 'fact' }, h('b', null, '미세 먼지 · 질소 산화물'), h('span', null, '공기를 더럽혀 숨쉬기 힘들게 하고 건강에 해로워요.')))));

  const opts = [
    ['자동차가 달릴 때 나오는 물질이 환경 오염을 일으켜요. 오염 물질이 나오지 않는 자동차가 필요해요.', true],
    ['자동차가 너무 느려서 목적지에 늦게 도착해요.', false],
    ['자동차 색깔이 다양하지 않아서 심심해요.', false]
  ];
  const fb = h('p', { class: 'feedback', 'aria-live': 'polite' }, '🧐 해결해야 할 문제는 무엇일까요? 하나를 골라 보세요.');
  body.append(h('div', { class: 'opts col' }, opts.map(function (o) {
    const b = h('button', {
      type: 'button', class: 'opt big-opt', onClick: function () {
        if (o[1]) { b.classList.add('right'); fb.textContent = '✅ 맞아요! 배기가스가 나오지 않는 친환경 자동차를 만들어 문제를 해결해 봐요.'; api.unlock(); }
        else { b.classList.add('wrong'); b.disabled = true; fb.textContent = '🤔 그림을 다시 보세요. 도로 위 공기가 어떻게 변했나요?'; Sound.bad(); }
      }
    }, o[0]);
    return b;
  })), fb);
  body.append(noteBox('m3.problem', '✏️ 내 말로 문제를 써 봐요', '예) 자동차에서 나오는 매연 때문에 공기가 더러워지는 문제', 2));
  if (api.isUnlocked()) fb.textContent = '✅ 이미 문제를 찾았어요. 다음 단계로 가요!';
}

/* ---------- 2. 아이디어 ---------- */
function m3Ideas(body, api) {
  const flags = m3flags();
  const flipped = new Set(flags.flipped || []);
  let chosen = flags.chosen || null;
  const check = function () { if (flipped.size >= 4 && chosen) api.unlock(); };

  body.append(h('div', { class: 'activity' }, h('h3', null, '① 여러 가지 친환경 자동차의 특징을 조사해 봅시다.'),
    h('p', null, '카드를 눌러 뒤집어 보세요. 달리는 동안 나오는 배기가스의 양도 비교해 봐요.')));
  const grid = h('div', { class: 'flipgrid' });
  const gas = function (n) {
    return h('div', { class: 'gas-meter', 'aria-label': '달리는 동안 나오는 배기가스 ' + n + '단계' }, h('span', null, '배기가스'),
      Array.from({ length: 5 }, function (_, i) { return h('i', { class: i < n ? 'on' : '' }, '💨'); }));
  };
  const drawCards = function () {
    grid.replaceChildren.apply(grid, ECO_CARS.map(function (c) {
      const on = flipped.has(c.id);
      return h('button', {
        type: 'button', class: 'flip' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false',
        onClick: function () { flipped.add(c.id); flags.flipped = Array.from(flipped); Store.save(); Sound.click(); drawCards(); drawChoose(); check(); }
      },
        on ? h('div', { class: 'flip-back' }, h('h4', null, c.icon + ' ' + c.name),
          h('p', null, h('b', null, '에너지: '), c.energy), h('p', null, h('b', null, '원리: '), c.how),
          h('p', { class: 'good' }, '👍 ' + c.good), h('p', { class: 'limit' }, '🤔 ' + c.limit), gas(c.gas))
          : h('div', { class: 'flip-front' }, h('div', { class: 'big' }, c.icon), h('b', null, c.name), h('span', null, '눌러서 뒤집기')));
    }));
  };
  body.append(grid, h('div', { class: 'gas-ref' }, gas(5), h('span', null, '← 휘발유 자동차 (비교용)')),
    tip('ℹ️', '전기 자동차는 달리는 동안은 배기가스가 없지만, 전기를 만드는 방법에 따라 환경에 주는 영향이 달라질 수 있어요.'));

  const choose = h('div', { class: 'activity' });
  body.append(choose);
  const drawChoose = function () {
    choose.replaceChildren(h('h3', null, '② 어떤 자동차의 특징을 적용할지 정하고, 계획을 세워 봅시다.'));
    if (flipped.size < 4) { choose.append(h('p', { class: 'muted' }, '🔒 카드를 모두 뒤집으면 고를 수 있어요. (' + flipped.size + '/4)')); return; }
    choose.append(h('div', { class: 'opts' }, ECO_CARS.map(function (c) {
      return h('button', {
        type: 'button', class: 'opt' + (chosen === c.id ? ' sel' : ''),
        onClick: function () { chosen = c.id; flags.chosen = c.id; Store.save(); Sound.click(); drawChoose(); check(); }
      }, c.icon + ' ' + c.name);
    })));
    if (chosen) {
      choose.append(chosen === 'solar'
        ? tip('☀️', '좋은 선택이에요! 이번 공작소에서는 재활용품과 모터로 만들 수 있는 태양광 자동차를 직접 만들어 볼 거예요.', 'good')
        : tip('🛠️', '멋진 선택이에요! 스케치에는 내가 고른 자동차의 특징을 마음껏 표현해 보세요. 공작소에서는 교과서 예시인 태양광 자동차를 만들어 볼 거예요.', 'good'));
    }
  };
  drawChoose();
  body.append(h('div', { class: 'activity' }, h('h3', null, '③ 내가 만들 친환경 자동차를 스케치하고, 특징을 써 봅시다.'),
    sketchPad('m3'),
    noteBox('m3.sketch', '✏️ 내 친환경 자동차의 특징', '예) 햇빛을 받아 달리고, 우유갑으로 몸체를 만든다.', 2)));
  check();
}

/* ---------- 3. 실행하기 ---------- */
function m3Run(body, api) {
  const flags = m3flags();
  const status = h('div', { class: 'run-status' });
  const tabs = h('div', { class: 'vtabs', role: 'tablist' });
  const pane = h('div', { class: 'run-pane' });
  let cur = 'prep';
  const T = [['prep', '🎒', '준비물 챙기기'], ['build', '🔧', '조립하기'], ['race', '🏁', '달리기 실험']];
  const allDone = function () { return flags.prep && flags.build && flags.race; };
  const update = function () {
    status.replaceChildren.apply(status, [h('b', null, '진행 상황: ')].concat(T.map(function (t) {
      return h('span', { class: 'rs-pill' + (flags[t[0]] ? ' ok' : '') }, (flags[t[0]] ? '✅ ' : '⬜ ') + t[2]);
    })));
    if (allDone()) api.unlock();
  };
  const drawTabs = function () {
    tabs.replaceChildren.apply(tabs, T.map(function (t) {
      return h('button', {
        type: 'button', role: 'tab', 'aria-selected': cur === t[0] ? 'true' : 'false', class: 'vtab' + (cur === t[0] ? ' on' : ''),
        onClick: function () { cur = t[0]; Cleanup.run(); drawTabs(); drawPane(); }
      }, h('span', { class: 'vtab-ico' }, t[1]), t[2], flags[t[0]] ? ' ✅' : '');
    }));
  };
  const done = function (k) { flags[k] = 1; Store.save(); update(); drawTabs(); };
  const drawPane = function () {
    pane.replaceChildren();
    if (cur === 'prep') carPrep(pane, done);
    else if (cur === 'build') carBuild(pane, done);
    else carLab(pane, done);
  };
  body.append(status, tabs, pane);
  update(); drawTabs(); drawPane();
}

/* 3-1 준비물 */
function carPrep(box, done) {
  box.append(h('p', { class: 'lead' }, '태양광 자동차를 만들 때 필요한 준비물만 가방에 담아 보세요. (필요 없는 것도 섞여 있어요!)'));
  const pick = new Set();
  const grid = h('div', { class: 'supplies' });
  const msg = h('p', { class: 'feedback', 'aria-live': 'polite' }, '가방에 담을 물건을 눌러 골라요.');
  const draw = function () {
    grid.replaceChildren.apply(grid, SUPPLIES.map(function (s, i) {
      return h('button', {
        type: 'button', class: 'supply' + (pick.has(i) ? ' sel' : ''), 'aria-pressed': pick.has(i) ? 'true' : 'false',
        onClick: function () { if (pick.has(i)) pick.delete(i); else pick.add(i); Sound.click(); draw(); }
      }, h('span', { class: 'supply-i' }, s[0]), s[1]);
    }));
  };
  draw();
  box.append(grid, h('div', { class: 'row' }, h('button', {
    class: 'btn btn-primary', type: 'button', onClick: function () {
      const missing = SUPPLIES.filter(function (s, i) { return s[2] && !pick.has(i); });
      const extra = SUPPLIES.filter(function (s, i) { return !s[2] && pick.has(i); });
      if (!missing.length && !extra.length) { msg.textContent = '✅ 완벽한 준비물 가방이에요! 태양광 자동차에는 연료도 건전지도 필요 없어요. 햇빛이 에너지가 되니까요.'; Sound.ok(); done('prep'); }
      else {
        Sound.bad();
        msg.textContent = (extra.length ? '🙅 필요 없는 물건이 있어요: ' + extra.map(function (s) { return s[1]; }).join(', ') + '. ' : '') +
          (missing.length ? '🔎 빠진 물건이 있어요: ' + missing.length + '개를 더 찾아보세요.' : '');
      }
    }
  }, '가방 확인하기')), msg);
  box.append(tip('🦺', '바퀴 축, 가위 등 뾰족한 부품이나 도구를 사용할 때에는 손을 다치지 않도록 조심해요.'));
  if (m3flags().prep) msg.textContent = '✅ 준비물을 이미 챙겼어요. 다시 해 봐도 좋아요!';
}

/* 3-2 조립 */
function carBuildSvg() {
  return svgEl(
    '<svg viewBox="0 0 520 270" class="build-svg" role="img" aria-label="태양광 자동차 조립 그림">' +
    '<rect width="520" height="270" rx="14" fill="#eaf6ff"/><rect y="236" width="520" height="34" fill="#cfd8e3"/>' +
    '<g class="lyr l8" ><circle cx="450" cy="46" r="26" fill="#ffd23f"/><g stroke="#ffd23f" stroke-width="4" stroke-linecap="round"><line x1="450" y1="8" x2="450" y2="0"/><line x1="486" y1="22" x2="494" y2="14"/><line x1="412" y1="22" x2="404" y2="14"/><line x1="492" y1="46" x2="502" y2="46"/><line x1="408" y1="46" x2="398" y2="46"/></g></g>' +
    '<g class="lyr l2"><rect x="96" y="196" width="330" height="12" rx="3" fill="#c8a165" stroke="#8a6a3a" stroke-width="2"/><text x="262" y="258" text-anchor="middle" font-size="13" fill="#6b5a3a">바퀴 판</text></g>' +
    '<g class="lyr l1"><g class="wheel"><circle cx="130" cy="202" r="36" fill="#2d3748"/><circle cx="130" cy="202" r="17" fill="#cbd5e1"/><line x1="130" y1="170" x2="130" y2="234" stroke="#8d99ae" stroke-width="3"/><line x1="98" y1="202" x2="162" y2="202" stroke="#8d99ae" stroke-width="3"/></g>' +
    '<g class="wheel"><circle cx="392" cy="202" r="36" fill="#2d3748"/><circle cx="392" cy="202" r="17" fill="#cbd5e1"/><line x1="392" y1="170" x2="392" y2="234" stroke="#8d99ae" stroke-width="3"/><line x1="360" y1="202" x2="424" y2="202" stroke="#8d99ae" stroke-width="3"/></g>' +
    '<g class="wheel"><circle cx="130" cy="202" r="21" fill="#ff9e4a" stroke="#b34a0b" stroke-width="3" stroke-dasharray="5 3"/><circle cx="130" cy="202" r="5" fill="#b34a0b"/></g></g>' +
    '<g class="lyr l3"><g class="motorg"><rect x="150" y="150" width="68" height="42" rx="6" fill="#7b8794" stroke="#3e4c59" stroke-width="3"/><rect x="204" y="162" width="8" height="18" fill="#cbd5e1"/><line x1="150" y1="170" x2="132" y2="170" stroke="#3e4c59" stroke-width="5"/><circle cx="130" cy="170" r="10" fill="#ffd166" stroke="#b7791f" stroke-width="3" stroke-dasharray="3 2"/><text x="184" y="176" text-anchor="middle" font-size="13" fill="#fff">모터</text></g></g>' +
    '<g class="lyr l5"><path d="M112 196 L112 148 Q112 138 124 138 L412 138 Q424 138 424 148 L424 196 Z" fill="#e4c48d" fill-opacity=".96" stroke="#8a6a3a" stroke-width="3"/><text x="268" y="170" text-anchor="middle" font-size="13" fill="#6b5a3a">덮개</text></g>' +
    '<g class="lyr l6"><rect x="124" y="78" width="288" height="60" rx="10" fill="#ff8fab" stroke="#c9415f" stroke-width="3"/><rect x="146" y="92" width="52" height="28" rx="4" fill="#cfeaff" stroke="#c9415f" stroke-width="2"/><rect x="212" y="92" width="52" height="28" rx="4" fill="#cfeaff" stroke="#c9415f" stroke-width="2"/><text x="360" y="116" font-size="22">⭐</text><text x="318" y="104" font-size="18">🌈</text></g>' +
    '<g class="lyr l7"><g transform="rotate(-8 268 66)"><rect x="196" y="56" width="136" height="14" rx="3" fill="#2a4a9c" stroke="#16295c" stroke-width="3"/><g stroke="#7fa0e8" stroke-width="1.5"><line x1="230" y1="56" x2="230" y2="70"/><line x1="264" y1="56" x2="264" y2="70"/><line x1="298" y1="56" x2="298" y2="70"/></g></g>' +
    '<path d="M200 66 Q180 100 160 130" stroke="#e5446d" stroke-width="3" fill="none"/><path d="M210 68 Q190 104 172 134" stroke="#1d2b4f" stroke-width="3" fill="none"/></g>' +
    '</svg>');
}

function carBuild(box, done) {
  box.append(h('p', { class: 'lead' }, '조립 순서를 맞혀 태양광 자동차를 완성해 보세요. 다음에 해야 할 일을 하나씩 골라요!'));
  const svg = carBuildSvg();
  const stageBox = h('div', { class: 'build-stage' }, svg);
  const tl = h('ol', { class: 'timeline' });
  const pool = h('div', { class: 'build-pool' });
  const msg = h('p', { class: 'feedback', 'aria-live': 'polite' }, '어떤 일부터 해야 할까요?');
  const tipBox = h('div', { class: 'build-tip' });
  const marks = ['➊', '➋', '➌', '➍', '➎', '➏', '➐', '➑'];
  let next = 0;
  let order = shuffle(CAR_BUILD.map(function (_, i) { return i; }));

  const setStage = function (n) {
    ['l1', 'l2', 'l3', 'l5', 'l6', 'l7', 'l8'].forEach(function (c) { svg.querySelector('.' + c).classList.remove('on'); });
    // 단계 n(1~8)까지 보이는 층: 1→l1, 2→l2, 3→l3(모터 따로), 4→모터 이동, 5→l5, 6→l6, 7→l7, 8→l8
    if (n >= 1) svg.querySelector('.l1').classList.add('on');
    if (n >= 2) svg.querySelector('.l2').classList.add('on');
    if (n >= 3) svg.querySelector('.l3').classList.add('on');
    svg.querySelector('.l3').classList.toggle('placed', n >= 4);
    if (n >= 5) svg.querySelector('.l5').classList.add('on');
    if (n >= 6) svg.querySelector('.l6').classList.add('on');
    if (n >= 7) svg.querySelector('.l7').classList.add('on');
    svg.classList.toggle('run', n >= 8);
    if (n >= 8) svg.querySelector('.l8').classList.add('on');
  };
  const draw = function () {
    tl.replaceChildren.apply(tl, CAR_BUILD.slice(0, next).map(function (s, i) {
      return h('li', null, h('span', { class: 'mark' }, marks[i]), s.t);
    }));
    pool.replaceChildren.apply(pool, order.filter(function (i) { return i >= next; }).map(function (i) {
      return h('button', {
        type: 'button', class: 'build-card', onClick: function (e) {
          if (i === next) {
            next++; Sound.ok(); setStage(next);
            const t = CAR_BUILD[i].tip;
            tipBox.replaceChildren(t ? tip('💡', t) : '');
            msg.textContent = next >= 8 ? '' : '✅ 맞아요! 그 다음에는 어떤 일을 할까요?';
            if (next >= 8) { msg.textContent = '🎉 태양광 자동차 완성! 햇빛 아래에서 바퀴가 빙글빙글 돌아요.'; celebrate(['☀️', '🚗', '✨']); done('build'); }
            draw();
          } else {
            Sound.bad(); e.currentTarget.classList.add('shake');
            msg.textContent = '🤔 아직이에요! 먼저 해야 할 일이 있어요. 기어와 바퀴 판이 어디까지 만들어졌는지 그림을 보세요.';
            setTimeout(function () { draw(); }, 400);
          }
        }
      }, CAR_BUILD[i].t);
    }));
    pool.hidden = next >= 8;
  };
  box.append(h('div', { class: 'build-layout' }, stageBox, h('div', null, h('h4', null, '🧩 다음에 할 일 고르기'), pool, msg, tipBox)),
    h('h4', null, '📋 지금까지 만든 순서'), tl);
  draw();
  if (m3flags().build) { next = 8; setStage(8); msg.textContent = '🎉 이미 완성했어요. 다시 보려면 새로고침 없이도 이 화면에서 확인할 수 있어요.'; draw(); }
}

/* 3-3 달리기 실험 */
function carLab(box, done) {
  const S = { sun: 35, cloudy: false, tilt: 0, ratio: 3, mass: 'mid', running: false, raf: 0 };
  Cleanup.add(function () { cancelAnimationFrame(S.raf); });
  const TARGET = 8;     // 성공 기준(초)

  const live = h('div', { class: 'live', 'aria-live': 'polite' });
  const result = h('div', { class: 'lab-result', 'aria-live': 'polite' });
  const ctrl = h('div', { class: 'lab-ctrl' });
  const P = function () { return Sim.solarPower(S.sun, S.tilt, S.cloudy); };

  /* --- 3D 무대 --- */
  const stageBox = h('div', { class: 'stage3d' });
  const viewBtns = h('div', { class: 'stage-views', role: 'group', 'aria-label': '카메라 보기' });
  const hud = h('div', { class: 'stage-hud' }, '⏱ 0.0 초');
  const sunBadge = h('div', { class: 'sun-badge', 'aria-hidden': 'true' }, h('span', { class: 'sun-ico' }, '☀️'), h('span', { class: 'cloud-ico' }, '☁️'));
  stageBox.append(viewBtns, hud, sunBadge);
  let stage = null;
  const VIEWS = [['side', '👀 옆에서'], ['follow', '🎥 따라가기'], ['top', '🛰️ 위에서']];
  function drawViews() {
    viewBtns.replaceChildren.apply(viewBtns, VIEWS.map(function (v) {
      const on = stage && stage.getView() === v[0];
      return h('button', { type: 'button', class: 'vbtn' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onClick: function () { stage.setView(v[0]); drawViews(); } }, v[1]);
    }));
  }
  function scene() {
    if (!stage) return;
    sunBadge.style.top = (68 - S.sun * 0.62) + '%';
    sunBadge.classList.toggle('cloudy', S.cloudy);
    stage.setEnv({ sun: S.sun, tilt: S.tilt, cloudy: S.cloudy, power: P() });
    if (!S.running) { stage.reset(); hud.textContent = '⏱ 0.0 초'; }
  }

  function drawLive() {
    const p = P();
    const s = Sim.carSpeed(p, S.ratio, S.mass);
    const fp = clamp(s.force / 30 * 100, 2, 100), rp = clamp(s.resist / 30 * 100, 2, 100);
    live.replaceChildren(
      h('div', { class: 'meter' }, h('span', null, '☀️ 전지판이 받는 햇빛'), h('div', { class: 'bar' }, h('div', { class: 'bar-fill sun', style: { width: Math.round(p * 100) + '%' } })), h('b', null, Math.round(p * 100) + '%')),
      h('div', { class: 'meter' }, h('span', null, '💪 모터가 내는 힘'), h('div', { class: 'bar' }, h('div', { class: 'bar-fill ' + (s.v > 0 ? 'good' : 'bad'), style: { width: fp + '%' } })), h('b', null, '')),
      h('div', { class: 'meter' }, h('span', null, '🧱 움직이는 데 필요한 힘'), h('div', { class: 'bar' }, h('div', { class: 'bar-fill need', style: { width: rp + '%' } })), h('b', null, '')),
      h('div', { class: 'speedtag' + (s.v > 0 ? '' : ' bad') }, s.v > 0 ? '예상 속도: 약 ' + Math.round(s.v) + ' cm/s' : '⚠️ 힘이 부족해서 움직일 수 없어요!'));
  }
  function slider(label, key, min, max, unit, icon) {
    const out = h('output', null, S[key] + unit);
    const inp = h('input', {
      type: 'range', min: min, max: max, step: 1, value: S[key], 'aria-label': label, disabled: S.running,
      onInput: function () { S[key] = +inp.value; out.textContent = S[key] + unit; drawLive(); scene(); }
    });
    return h('label', { class: 'ctl' }, h('span', { class: 'ctl-l' }, icon + ' ' + label), inp, out);
  }
  const RATIOS = [2, 3, 4, 6, 8];
  const MASSES = [['light', '가벼움 (우유갑)'], ['mid', '보통 (택배 상자)'], ['heavy', '무거움 (큰 통)']];
  function drawCtrl() {
    ctrl.replaceChildren(
      h('div', { class: 'ctl-group', style: { '--c': '#f4a300' } }, h('div', { class: 'ctl-h' }, '☀️ 햇빛 환경'),
        slider('해의 높이', 'sun', 10, 90, '°', '🌅'),
        h('label', { class: 'switch' }, h('input', { type: 'checkbox', checked: S.cloudy, disabled: S.running, onChange: function (e) { S.cloudy = e.target.checked; drawLive(); scene(); } }), ' ☁️ 구름이 해를 가렸어요')),
      h('div', { class: 'ctl-group', style: { '--c': '#2a4a9c' } }, h('div', { class: 'ctl-h' }, '🔆 태양 전지판'),
        slider('전지판 기울기', 'tilt', 0, 90, '°', '📐'),
        h('p', { class: 'muted small' }, '0°는 눕힌 모양, 90°는 세운 모양이에요. 햇빛이 들어오는 각도에 맞게 조절해요.')),
      h('div', { class: 'ctl-group', style: { '--c': CAT.drive.color } }, h('div', { class: 'ctl-h' }, CAT.drive.icon + ' 구동 장치 — 기어비'),
        h('div', { class: 'seg five' }, RATIOS.map(function (r) {
          return h('button', {
            type: 'button', disabled: S.running, class: 'segb' + (S.ratio === r ? ' on' : ''), 'aria-pressed': S.ratio === r ? 'true' : 'false',
            onClick: function () { S.ratio = r; Sound.click(); drawCtrl(); drawLive(); }
          }, h('span', { class: 'segb-i' }, r + ' : 1'));
        })),
        h('p', { class: 'muted small' }, '기어비 = 큰 기어 ÷ 작은 기어. 클수록 힘은 세지만 속도는 느려져요.')),
      h('div', { class: 'ctl-group', style: { '--c': '#6b7a99' } }, h('div', { class: 'ctl-h' }, '📦 자동차 몸체 (재활용품)'),
        h('div', { class: 'seg three' }, MASSES.map(function (m) {
          return h('button', {
            type: 'button', disabled: S.running, class: 'segb' + (S.mass === m[0] ? ' on' : ''), 'aria-pressed': S.mass === m[0] ? 'true' : 'false',
            onClick: function () { S.mass = m[0]; Sound.click(); drawCtrl(); drawLive(); }
          }, h('span', { class: 'segb-t' }, m[1]));
        }))),
      h('div', { class: 'lab-actions' }, h('button', { class: 'btn btn-primary btn-big', type: 'button', disabled: S.running, onClick: run }, S.running ? '🚗 달리는 중…' : '🏁 출발!')));
  }

  function run() {
    if (S.running) return;
    S.running = true; result.replaceChildren(); drawCtrl();
    const p = P(); const sp = Sim.carSpeed(p, S.ratio, S.mass);
    const GAS_V = 45;
    const st = { mine: 0, gas: 0, t: 0, stalled: sp.v <= 0.5, vm: 0, gasMoving: true };
    let last = performance.now(), acc = 0, finishT = null, puffCount = 0;
    Sound.whoosh();
    const step = function (now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      st.t += dt;
      st.vm += (sp.v - st.vm) * 2.2 * dt;
      if (finishT === null) st.mine = Math.min(Sim.TRACK, st.mine + st.vm * dt);
      if (st.gas < Sim.TRACK) {
        st.gas = Math.min(Sim.TRACK, st.gas + GAS_V * dt);
        acc += dt;
        while (acc > 0.09) { acc -= 0.09; puffCount++; }
      }
      st.gasMoving = st.gas < Sim.TRACK;
      if (finishT === null && st.mine >= Sim.TRACK) { finishT = st.t; Sound.ok(); }
      stage.update(st, dt); hud.textContent = '⏱ ' + (finishT !== null ? finishT : st.t).toFixed(1) + ' 초';
      const stop = (finishT !== null && st.t > finishT + 1.0) || (st.stalled && st.t > 3.5) || st.t > 22;
      if (!stop) S.raf = requestAnimationFrame(step); else end(finishT, st, puffCount, sp, p);
    };
    S.raf = requestAnimationFrame(step);
  }

  function end(time, st, puffs, sp, p) {
    S.running = false; drawCtrl();
    const lines = [];
    if (time === null) {
      Sound.bad();
      lines.push(h('div', { class: 'rs-top' }, st.stalled ? '😵 자동차가 움직이지 못했어요.' : '🐢 시간 안에 결승선에 도착하지 못했어요.'));
      lines.push(h('p', { class: 'hint' }, '💡 ' + carHint(p, sp)));
    } else {
      const ok = time <= TARGET;
      const stars = time <= 5.5 ? 3 : (time <= TARGET ? 2 : 1);
      if (ok) {
        Sound.win(); celebrate(['☀️', '⭐', '🌿']);
        const b = m3flags(); if (!b.bestTime || time < b.bestTime) b.bestTime = +time.toFixed(1); done2();
      } else Sound.bad();
      lines.push(h('div', { class: 'rs-top ' + (ok ? 'good' : '') }, ok ? '🎯 성공! ' + '★'.repeat(stars) + '☆'.repeat(3 - stars) : '😮 도착했지만 ' + TARGET + '초 안에는 못 들어왔어요.'));
      lines.push(h('div', { class: 'rs-grid' },
        h('div', null, h('span', null, '결승선 도착'), h('b', null, time.toFixed(1) + '초')),
        h('div', null, h('span', null, '내 자동차가 내뿜은 배기가스'), h('b', null, '💨 0개')),
        h('div', null, h('span', null, '휘발유 자동차가 내뿜은 배기가스'), h('b', null, '💨 ' + puffs + '개'))));
      if (!ok) lines.push(h('p', { class: 'hint' }, '💡 ' + carHint(p, sp)));
      else lines.push(h('p', { class: 'hint good' }, '🌿 햇빛만으로 달렸어요. 달리는 동안 오염 물질은 하나도 나오지 않았어요!'));
    }
    result.replaceChildren.apply(result, lines);
    st.gasMoving = false; stage.update(st, 0.016);
  }
  function done2() { done('race'); }

  function carHint(p, sp) {
    if (sp.v <= 0.5) {
      if (p < 0.5) return '햇빛을 받는 양이 ' + Math.round(p * 100) + '%로 적어요. 전지판 기울기를 해의 높이에 맞게 조절해 보세요. (해가 낮을수록 전지판을 세워요.)';
      if (S.ratio <= 3) return '모터의 힘이 자동차를 움직이기엔 부족해요. 기어비를 키우거나 몸체를 가볍게 해 보세요.';
      return '몸체가 너무 무거워요. 가벼운 재활용품으로 바꿔 보세요.';
    }
    if (p < 0.6) return '햇빛을 충분히 받지 못하고 있어요(' + Math.round(p * 100) + '%). 전지판 기울기를 조절해 보세요. 구름이 낀 날에는 힘이 약해져요.';
    if (S.ratio >= 6) return '기어비가 커서 힘은 세지만 속도가 느려요. 기어비를 줄여 보세요.';
    if (S.mass === 'heavy') return '몸체가 무거워 속도가 느려요. 더 가벼운 재활용품을 써 보세요.';
    return '기어비와 몸체의 무게를 바꿔서 가장 빠른 조합을 찾아보세요!';
  }

  box.append(h('p', { class: 'lead' }, '햇빛, 전지판 기울기, 기어비, 몸체 무게를 바꿔서 ', h('b', null, TARGET + '초 안에'), ' 결승선(2 m)에 도착시켜 보세요! 휘발유 자동차와 배기가스도 비교해 봐요.'),
    h('div', { class: 'lab-main car' }, h('div', { class: 'lab-views' }, stageBox, result), h('div', { class: 'lab-side' }, live, ctrl)));
  if (m3flags().bestTime) box.append(h('p', { class: 'muted' }, '🏆 내 최고 기록: ' + m3flags().bestTime + '초'));
  stage = T3.make('car', stageBox);
  Cleanup.add(function () { stage.dispose(); });
  drawViews(); drawCtrl(); drawLive(); scene();
}

/* ---------- 4. 평가 ---------- */
function m3Eval(body) {
  const f = m3flags();
  const car = ECO_CARS.filter(function (c) { return c.id === f.chosen; })[0];
  body.append(h('div', { class: 'summary-card' }, h('div', { class: 'big' }, '🌞'),
    h('div', null, h('h3', null, '내 친환경 자동차'),
      h('p', null, (car ? car.icon + ' ' + car.name + '의 특징을 골랐어요. ' : '') + (f.bestTime ? '최고 기록 ' + f.bestTime + '초 · 배기가스 0개!' : '달리기 실험에서 성공하면 기록이 남아요.')))));
  body.append(h('div', { class: 'activity' }, h('h3', null, '내가 만든 친환경 자동차를 평가해 봅시다.'),
    ratingRow('m3.r1', '문제를 해결하기 위해 세운 계획대로 만들었나요?'),
    ratingRow('m3.r2', '친환경 에너지를 활용하여 움직이게 했나요?'),
    ratingRow('m3.r3', '재활용품을 이용하여 자동차의 몸체를 창의적으로 만들었나요?'),
    noteBox('m3.reflect', '✏️ 내 자동차를 더 좋게 만들려면?', '예) 몸체를 더 가볍게 하고, 기어비를 바꿔 보고 싶어요.', 2)));
  body.append(h('div', { class: 'row center' }, h('button', {
    class: 'btn btn-primary btn-big', type: 'button',
    onClick: function () {
      if (!Store.d.rating['m3.r1'] || !Store.d.rating['m3.r2'] || !Store.d.rating['m3.r3']) { toast('세 가지 평가를 모두 눌러 주세요 🙂'); Sound.bad(); return; }
      completeMission('m3', '햇빛으로 달리는 친환경 자동차를 완성했어요!');
    }
  }, '🏅 미션 완료하기')));
}
