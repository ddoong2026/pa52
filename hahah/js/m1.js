'use strict';
/* 미션 1: 수송 수단의 구성 요소 (교과서 64~65쪽) */

const VEHICLES = {
  car: {
    name: '자동차', emoji: '🚗',
    intro: '자동차의 부품을 눌러 보세요. 번쩍이는 동그라미를 찾아요!',
    art: '<svg viewBox="0 0 640 340" class="vehicle-svg" role="img" aria-label="자동차 옆모습">' +
      '<rect width="640" height="340" fill="#dff1ff"/><rect y="290" width="640" height="50" fill="#9aa7b8"/>' +
      '<rect y="312" width="640" height="4" fill="#fff" opacity=".6" stroke-dasharray="30 22"/>' +
      '<path d="M80 262 L80 222 Q80 205 100 200 L190 192 L236 150 Q246 140 264 140 L384 140 Q402 140 412 154 L444 194 L520 202 Q556 208 556 240 L556 262 Z" fill="#ff6b6b" stroke="#c0392b" stroke-width="3"/>' +
      '<path d="M206 190 L244 156 L304 156 L304 190 Z M318 190 L318 156 L380 156 L408 190 Z" fill="#cfeaff" stroke="#c0392b" stroke-width="3"/>' +
      '<rect x="468" y="208" width="62" height="38" rx="8" fill="#8d99ae" stroke="#4a5568" stroke-width="2"/>' +
      '<circle cx="499" cy="227" r="11" fill="#cbd5e1" stroke="#4a5568" stroke-width="2"/><circle cx="499" cy="227" r="4" fill="#4a5568"/>' +
      '<circle cx="352" cy="196" r="17" fill="none" stroke="#1d2b4f" stroke-width="5"/><line x1="352" y1="196" x2="352" y2="212" stroke="#1d2b4f" stroke-width="5"/><line x1="335" y1="196" x2="369" y2="196" stroke="#1d2b4f" stroke-width="4"/>' +
      '<rect x="104" y="226" width="46" height="24" rx="5" fill="#ffd166" stroke="#b7791f" stroke-width="2"/>' +
      '<ellipse cx="548" cy="224" rx="9" ry="12" fill="#fff3a3" stroke="#b7791f" stroke-width="2"/>' +
      '<path d="M404 150 L376 120" stroke="#1d2b4f" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M268 168 L296 202" stroke="#2b3a67" stroke-width="5" stroke-linecap="round"/>' +
      '<g><circle cx="190" cy="268" r="36" fill="#2d3748"/><circle cx="190" cy="268" r="16" fill="#cbd5e1"/></g>' +
      '<g><circle cx="450" cy="268" r="36" fill="#2d3748"/><circle cx="450" cy="268" r="21" fill="#cbd5e1"/><circle cx="450" cy="268" r="14" fill="none" stroke="#e5446d" stroke-width="4"/><rect x="444" y="238" width="12" height="16" rx="3" fill="#e5446d"/></g>' +
      '</svg>',
    spots: [
      { id: 'engine', cat: 'drive', label: '엔진', x: 499, y: 227, text: '엔진에서 자동차가 움직일 수 있는 힘을 만들어 바퀴에 전달해요. 바퀴가 회전하면서 자동차가 움직이지요.' },
      { id: 'handle', cat: 'steer', label: '핸들', x: 352, y: 196, text: '핸들로 바퀴의 방향을 조종하면 원하는 방향으로 이동할 수 있어요.' },
      { id: 'brake', cat: 'brake', label: '브레이크', x: 450, y: 268, text: '브레이크는 자동차의 속도를 줄이거나 자동차를 멈추게 해요.' },
      { id: 'wheel', cat: 'other', label: '바퀴', x: 190, y: 268, text: '바퀴가 굴러서 자동차가 앞으로 나아가요. 땅과 닿아 힘을 전달해요.' },
      { id: 'light', cat: 'other', label: '전조등', x: 548, y: 224, text: '어두운 길을 환하게 비추고, 다른 차에게 내 차의 위치를 알려 줘요.' },
      { id: 'tank', cat: 'other', label: '연료 탱크', x: 127, y: 238, text: '엔진이 쓸 연료를 담아 두는 곳이에요. (전기 자동차에는 배터리가 있어요.)' },
      { id: 'belt', cat: 'other', label: '안전벨트', x: 282, y: 184, text: '갑자기 멈출 때 몸이 앞으로 쏠리지 않게 붙잡아 줘요. 꼭 매야 해요!' },
      { id: 'wiper', cat: 'other', label: '와이퍼', x: 390, y: 135, text: '비가 오거나 앞 유리가 더러워지면 유리를 닦아 앞이 잘 보이게 해 줘요.' }
    ]
  },
  plane: {
    name: '비행기', emoji: '✈️',
    intro: '비행기도 자동차처럼 세 가지 기본 장치로 움직임을 조종해요.',
    art: '<svg viewBox="0 0 640 340" class="vehicle-svg" role="img" aria-label="비행기 옆모습">' +
      '<defs><linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#e6f6ff"/></linearGradient></defs>' +
      '<rect width="640" height="340" fill="url(#sky1)"/>' +
      '<g fill="#fff" opacity=".9"><ellipse cx="90" cy="70" rx="50" ry="18"/><ellipse cx="130" cy="58" rx="34" ry="16"/><ellipse cx="520" cy="290" rx="60" ry="18"/><ellipse cx="560" cy="276" rx="34" ry="14"/></g>' +
      '<path d="M120 170 L84 90 L142 90 L186 164 Z" fill="#e8eef5" stroke="#5b6b82" stroke-width="3"/>' +
      '<path d="M84 90 L106 90 L130 164 L112 166 Z" fill="#2a8cff" stroke="#1b5fb8" stroke-width="3"/>' +
      '<path d="M76 190 Q76 164 130 160 L470 152 Q566 160 586 190 Q566 220 470 226 L130 222 Q76 218 76 190 Z" fill="#f3f6fa" stroke="#5b6b82" stroke-width="3"/>' +
      '<path d="M500 168 Q540 166 566 184 L500 186 Z" fill="#9bd4ff" stroke="#5b6b82" stroke-width="2"/>' +
      '<g fill="#9bd4ff" stroke="#5b6b82" stroke-width="1.5"><circle cx="190" cy="184" r="7"/><circle cx="222" cy="184" r="7"/><circle cx="254" cy="184" r="7"/><circle cx="286" cy="184" r="7"/><circle cx="440" cy="182" r="7"/></g>' +
      '<path d="M300 204 L372 204 L262 270 L222 270 Z" fill="#cfd8e3" stroke="#5b6b82" stroke-width="3"/>' +
      '<rect x="296" y="196" width="62" height="9" rx="3" transform="rotate(-18 296 200)" fill="#e5446d" stroke="#a02847" stroke-width="2"/>' +
      '<ellipse cx="312" cy="252" rx="42" ry="16" fill="#8d99ae" stroke="#4a5568" stroke-width="3"/><ellipse cx="350" cy="252" rx="8" ry="12" fill="#cbd5e1" stroke="#4a5568" stroke-width="2"/>' +
      '<line x1="420" y1="224" x2="420" y2="248" stroke="#4a5568" stroke-width="5"/><circle cx="420" cy="256" r="10" fill="#2d3748"/>' +
      '</svg>',
    spots: [
      { id: 'engine', cat: 'drive', label: '엔진', x: 312, y: 252, text: '엔진의 힘으로 비행기를 움직여요. 힘이 있어야 하늘을 앞으로 날아갈 수 있어요.' },
      { id: 'rudder', cat: 'steer', label: '방향타', x: 100, y: 112, text: '꼬리 날개에 달린 방향타를 움직여 비행기의 방향을 바꿔요.' },
      { id: 'cockpit', cat: 'steer', label: '조종실', x: 530, y: 178, text: '조종사가 앉아서 비행기의 방향을 조종하는 곳이에요.' },
      { id: 'spoiler', cat: 'brake', label: '스포일러', x: 326, y: 196, text: '착륙할 때 날개 위로 펴져서 공기의 저항을 키워 속도를 줄여 줘요.' },
      { id: 'wing', cat: 'other', label: '날개', x: 258, y: 258, text: '비행기를 하늘에 떠 있게 하는 힘(양력)을 만들어 줘요.' },
      { id: 'gear', cat: 'other', label: '바퀴(착륙 장치)', x: 420, y: 256, text: '활주로에서 달리거나 내려앉을 때 비행기를 받쳐 줘요.' }
    ]
  },
  ship: {
    name: '배', emoji: '🚢',
    intro: '물 위를 달리는 배는 어떤 장치로 움직이고 멈출까요?',
    art: '<svg viewBox="0 0 640 340" class="vehicle-svg" role="img" aria-label="배 옆모습">' +
      '<rect width="640" height="340" fill="#dff1ff"/><rect y="210" width="640" height="130" fill="#4fb3e8"/>' +
      '<path d="M0 232 Q40 214 80 232 T160 232 T240 232 T320 232 T400 232 T480 232 T560 232 T640 232" fill="none" stroke="#bfe8ff" stroke-width="5"/>' +
      '<path d="M90 214 L560 214 L520 276 L140 276 Z" fill="#1d4e89" stroke="#12315c" stroke-width="3"/>' +
      '<rect x="90" y="208" width="470" height="10" fill="#e5446d"/>' +
      '<rect x="300" y="166" width="150" height="44" fill="#fff" stroke="#8d99ae" stroke-width="3"/>' +
      '<rect x="350" y="132" width="76" height="36" fill="#fff" stroke="#8d99ae" stroke-width="3"/><rect x="360" y="142" width="56" height="14" fill="#9bd4ff"/>' +
      '<rect x="228" y="150" width="28" height="60" fill="#ff7a2f" stroke="#b34a0b" stroke-width="2"/>' +
      '<g fill="#9bd4ff"><circle cx="320" cy="188" r="7"/><circle cx="350" cy="188" r="7"/><circle cx="380" cy="188" r="7"/><circle cx="410" cy="188" r="7"/></g>' +
      '<rect x="170" y="226" width="86" height="34" rx="6" fill="#8d99ae" stroke="#4a5568" stroke-width="2" opacity=".95"/><circle cx="213" cy="243" r="10" fill="#cbd5e1" stroke="#4a5568" stroke-width="2"/>' +
      '<g fill="#ffd166" stroke="#b7791f" stroke-width="2"><path d="M118 262 Q96 252 100 232 Q118 244 130 262 Z"/><path d="M118 262 Q96 276 100 296 Q118 282 130 262 Z"/></g>' +
      '<rect x="128" y="266" width="10" height="38" rx="3" fill="#8b5cf6" stroke="#5b3bb0" stroke-width="2"/>' +
      '<g stroke="#2d3748" stroke-width="5" fill="none" stroke-linecap="round"><path d="M548 232 L548 270"/><path d="M528 244 L568 244"/><path d="M526 266 Q548 290 570 266"/><circle cx="548" cy="226" r="6"/></g>' +
      '</svg>',
    spots: [
      { id: 'prop', cat: 'drive', label: '엔진·프로펠러', x: 213, y: 243, text: '엔진의 힘으로 프로펠러가 돌면서 물을 뒤로 밀어내요. 그 힘으로 배가 앞으로 나아가요.' },
      { id: 'bridge', cat: 'steer', label: '조타실', x: 388, y: 150, text: '배의 방향을 조종하는 방이에요. 선장님이 이곳에서 키를 돌려요.' },
      { id: 'rudder', cat: 'steer', label: '방향타', x: 133, y: 288, text: '배 뒤쪽에 달려 물의 흐름을 바꿔서 배의 방향을 조종해요.' },
      { id: 'anchor', cat: 'brake', label: '닻', x: 548, y: 256, text: '한곳에 머무르거나 이동 속도를 급하게 줄일 때 바다 밑으로 내려 사용해요.' },
      { id: 'hull', cat: 'other', label: '선체', x: 330, y: 255, text: '배의 몸통이에요. 물에 뜨는 힘(부력)을 받아 가라앉지 않아요.' },
      { id: 'funnel', cat: 'other', label: '굴뚝', x: 242, y: 170, text: '엔진에서 나온 연기와 열을 밖으로 내보내요.' }
    ]
  },
  bike: {
    name: '자전거', emoji: '🚲',
    intro: '자전거는 사람의 힘으로 움직여요. 구동 · 조향 · 제동 장치를 찾아보세요!',
    art: '<svg viewBox="0 0 640 340" class="vehicle-svg" role="img" aria-label="자전거 옆모습">' +
      '<rect width="640" height="340" fill="#e9f7e4"/><rect y="296" width="640" height="44" fill="#a7d68a"/>' +
      '<g fill="none" stroke="#1d2b4f" stroke-width="7"><circle cx="160" cy="236" r="58"/><circle cx="480" cy="236" r="58"/></g>' +
      '<g stroke="#8d99ae" stroke-width="1.5"><line x1="160" y1="236" x2="160" y2="178"/><line x1="160" y1="236" x2="102" y2="236"/><line x1="160" y1="236" x2="218" y2="236"/><line x1="160" y1="236" x2="160" y2="294"/><line x1="480" y1="236" x2="480" y2="178"/><line x1="480" y1="236" x2="422" y2="236"/><line x1="480" y1="236" x2="538" y2="236"/><line x1="480" y1="236" x2="480" y2="294"/></g>' +
      '<g fill="none" stroke="#2a8cff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M160 236 L255 160 L418 160 L300 236 Z"/><path d="M255 160 L300 236"/><path d="M418 160 L480 236"/></g>' +
      '<path d="M416 160 L408 114" stroke="#1d2b4f" stroke-width="8" stroke-linecap="round"/><path d="M386 108 L440 108" stroke="#1d2b4f" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M236 144 L286 144 L280 154 L240 154 Z" fill="#1d2b4f" stroke="#1d2b4f" stroke-width="6" stroke-linejoin="round"/><path d="M258 146 L255 160" stroke="#1d2b4f" stroke-width="6"/>' +
      '<g stroke="#4a5568" stroke-width="3" fill="none"><path d="M300 224 L160 226"/><path d="M300 248 L160 246"/></g>' +
      '<circle cx="300" cy="236" r="20" fill="#cbd5e1" stroke="#4a5568" stroke-width="4"/><circle cx="160" cy="236" r="10" fill="#cbd5e1" stroke="#4a5568" stroke-width="3"/>' +
      '<path d="M300 236 L322 282" stroke="#4a5568" stroke-width="8" stroke-linecap="round"/><rect x="312" y="278" width="34" height="10" rx="3" fill="#1d2b4f"/>' +
      '<g fill="#e5446d" stroke="#a02847" stroke-width="2"><rect x="440" y="170" width="14" height="26" rx="4"/><rect x="196" y="190" width="14" height="26" rx="4"/></g>' +
      '</svg>',
    spots: [
      { id: 'pedal', cat: 'drive', label: '페달·체인', x: 300, y: 236, text: '사람이 페달을 밟는 힘이 체인을 따라 뒷바퀴로 전달되어 자전거가 앞으로 나아가요.' },
      { id: 'handle', cat: 'steer', label: '핸들', x: 412, y: 108, text: '핸들을 돌리면 앞바퀴의 방향이 바뀌어서 가고 싶은 쪽으로 갈 수 있어요.' },
      { id: 'fbrake', cat: 'brake', label: '앞 브레이크', x: 447, y: 183, text: '손잡이를 쥐면 앞바퀴를 잡아 속도를 줄여 줘요.' },
      { id: 'rbrake', cat: 'brake', label: '뒤 브레이크', x: 203, y: 203, text: '뒷바퀴를 잡아 속도를 줄이고 멈추게 해요. 앞 브레이크와 함께 쓰면 더 안전해요.' },
      { id: 'frame', cat: 'other', label: '프레임', x: 340, y: 160, text: '자전거의 뼈대예요. 바퀴, 핸들, 안장을 모두 이어 주고 튼튼하게 받쳐 줘요.' },
      { id: 'seat', cat: 'other', label: '안장', x: 262, y: 148, text: '사람이 앉는 의자예요. 편안하게 앉아 페달을 밟을 수 있게 해 줘요.' },
      { id: 'wheel', cat: 'other', label: '앞바퀴', x: 480, y: 236, text: '굴러서 자전거를 이동하게 해요. 핸들과 연결되어 방향을 바꿔요.' }
    ]
  }
};

/* ---------- 분류 놀이 카드 ---------- */
const SORT_CARDS = [
  ['엔진', 'drive'], ['프로펠러', 'drive'], ['페달', 'drive'],
  ['핸들', 'steer'], ['방향타', 'steer'], ['조타실', 'steer'], ['조종실', 'steer'],
  ['브레이크', 'brake'], ['스포일러', 'brake'], ['닻', 'brake']
];

const QUIZ = [
  { q: '자동차를 멈추려면 어떤 장치를 사용해야 할까요?', o: ['구동 장치 (엔진)', '조향 장치 (핸들)', '제동 장치 (브레이크)'], a: 2, why: '속도를 줄이거나 멈추게 하는 것은 제동 장치인 브레이크예요.' },
  { q: '비행기가 착륙할 때 속도를 줄여 주는 장치는 무엇일까요?', o: ['스포일러', '방향타', '프로펠러'], a: 0, why: '스포일러가 공기의 저항을 키워 착륙 속도를 줄여 줘요.' },
  { q: '배가 한곳에 머무르고 싶을 때 바다 밑으로 내리는 것은?', o: ['방향타', '닻', '조타실'], a: 1, why: '닻은 배를 한곳에 머물게 하거나 속도를 급하게 줄일 때 써요.' },
  { q: '핸들은 자동차의 어떤 일을 도와줄까요?', o: ['힘을 만들어요', '속도를 줄여요', '가는 방향을 조종해요'], a: 2, why: '핸들은 바퀴의 방향을 조종하는 조향 장치예요.' },
  { q: '모든 수송 수단에서 공통으로 움직임을 조종하는 세 가지 장치는?', o: ['구동·조향·제동 장치', '엔진·타이어·연료', '핸들·문·창문'], a: 0, why: '자동차, 비행기, 배, 자전거 모두 구동·조향·제동 장치로 움직임을 조종해요.' }
];

const EV_ROWS = [
  { cat: 'drive', gas: '엔진 (연료를 태워 힘을 만들어요)', opts: ['엔진', '전기 모터', '돛'], a: 1, why: '전기 자동차는 배터리의 전기로 전기 모터를 돌려 바퀴를 굴려요.' },
  { cat: 'steer', gas: '핸들', opts: ['핸들', '방향타', '닻'], a: 0, why: '조향 장치는 같아요! 핸들로 바퀴의 방향을 조종해요.' },
  { cat: 'brake', gas: '브레이크', opts: ['스포일러', '닻', '브레이크'], a: 2, why: '제동 장치도 브레이크예요. (전기차는 멈출 때 전기를 되돌려 모으기도 해요.)' }
];

function renderM1(app) {
  app.append(h('div', { class: 'page-head', style: { '--c': '#ff8a3d' } },
    h('div', { class: 'ph-emoji' }, '🔍'),
    h('div', null, h('h1', null, '수송 수단의 구성 요소'),
      h('p', null, '자동차를 멈추려면 어떤 장치를 사용해야 할까요? 수송 수단의 구성 요소를 알고 체험해 봐요!'))));

  const root = h('div', { class: 'wiz' });
  app.append(root);
  const found = new Set();

  wizard(root, 'm1', [
    {
      label: '탐험하기', icon: '🔍', title: '수송 수단 탐험하기', gate: '부품 8개를 찾으면 열려요.',
      build: function (body, api) {
        body.append(h('p', { class: 'lead' }, '수송 수단은 다양한 장치로 구성되어 있어요. 그림 위의 동그라미를 눌러 부품을 알아보세요. ',
          h('b', null, '부품 8개'), '를 찾으면 다음 단계로 갈 수 있어요.'));
        body.append(h('div', { class: 'legend' }, ['drive', 'steer', 'brake', 'other'].map(function (c) {
          return h('div', { class: 'legend-item', style: { '--c': CAT[c].color } }, h('b', null, CAT[c].icon + ' ' + CAT[c].name), h('span', null, CAT[c].desc));
        })));
        const counter = h('div', { class: 'counter' });
        const tabs = h('div', { class: 'vtabs', role: 'tablist' });
        const stage = h('div', { class: 'vstage' });
        const info = h('div', { class: 'vinfo', 'aria-live': 'polite' });
        let curKey = 'car';

        const updCounter = function () {
          counter.replaceChildren(h('span', null, '🔎 찾은 부품 '), h('b', null, found.size + ' / 8'),
            h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: Math.min(100, found.size / 8 * 100) + '%' } })));
          if (found.size >= 8) api.unlock();
        };
        const drawTabs = function () {
          tabs.replaceChildren.apply(tabs, Object.keys(VEHICLES).map(function (k) {
            const v = VEHICLES[k];
            return h('button', {
              type: 'button', role: 'tab', 'aria-selected': k === curKey ? 'true' : 'false', class: 'vtab' + (k === curKey ? ' on' : ''),
              onClick: function () { curKey = k; drawTabs(); drawStage(); }
            }, h('span', { class: 'vtab-ico' }, v.emoji), v.name);
          }));
        };
        const drawStage = function () {
          const v = VEHICLES[curKey];
          const svg = svgEl(v.art);
          const layer = svgEl('<g></g>');
          svg.append(layer);
          v.spots.forEach(function (s) {
            const key = curKey + ':' + s.id;
            const g = svgEl('<g class="hs ' + s.cat + (found.has(key) ? ' seen' : '') + '" tabindex="0" role="button" aria-label="' + s.label + ' 부품 보기" transform="translate(' + s.x + ' ' + s.y + ')">' +
              '<circle class="pulse-ring" r="20"/><circle class="hs-dot" r="15"/><text class="hs-q" y="6" text-anchor="middle">' + (found.has(key) ? '✓' : '?') + '</text></g>');
            const open = function () {
              found.add(key); Sound.click();
              g.classList.add('seen'); g.querySelector('.hs-q').textContent = '✓';
              svg.querySelectorAll('.hs').forEach(function (n) { n.classList.remove('active'); });
              g.classList.add('active');
              showInfo(s);
              updCounter();
            };
            g.addEventListener('click', open);
            g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
            layer.append(g);
          });
          stage.replaceChildren(svg);
          info.replaceChildren(h('div', { class: 'vinfo-empty' }, h('div', { class: 'big' }, v.emoji), h('p', null, v.intro)));
        };
        const showInfo = function (s) {
          const c = CAT[s.cat];
          info.replaceChildren(h('div', { class: 'vinfo-card', style: { '--c': c.color } },
            h('div', { class: 'vinfo-top' }, h('h3', null, s.label), catChip(s.cat)),
            h('p', null, s.text),
            s.cat === 'other' ? null : h('p', { class: 'vinfo-q' }, '💡 ' + c.name + '는 ' + c.desc + '.')));
        };
        body.append(counter, tabs, h('div', { class: 'vlayout' }, stage, info));
        drawTabs(); drawStage(); updCounter();
        if (found.size >= 8) api.unlock();
        body.append(h('div', { class: 'activity' },
          h('h3', null, '📝 생각해 보기'),
          h('p', null, '① 기본 요소 외에 자동차의 다른 구성 요소를 더 찾아 보세요.'),
          h('p', null, '② 자전거를 구성하는 장치는 각각 어떤 역할을 하나요?'),
          noteBox('m1.explore', '내가 알게 된 점', '예) 와이퍼는 비 오는 날 앞 유리를 닦아 줘요.', 3)));
      }
    },
    {
      label: '분류하기', icon: '🧩', title: '장치 분류 놀이', gate: '카드 10장을 모두 분류하면 열려요.',
      build: function (body, api) {
        body.append(h('p', { class: 'lead' }, '카드를 하나 눌러 고른 다음, 알맞은 장치 칸을 눌러 넣어 주세요.'));
        let pool = shuffle(SORT_CARDS);
        let sel = null, wrongs = 0;
        const cardsBox = h('div', { class: 'cards-pool' });
        const buckets = h('div', { class: 'buckets' });
        const msg = h('p', { class: 'feedback', 'aria-live': 'polite' }, '카드를 눌러 보세요!');
        const placed = { drive: [], steer: [], brake: [] };

        const draw = function () {
          cardsBox.replaceChildren.apply(cardsBox, pool.map(function (c) {
            return h('button', {
              type: 'button', class: 'sort-card' + (sel === c ? ' sel' : ''),
              onClick: function () { sel = (sel === c ? null : c); Sound.click(); draw(); }
            }, c[0]);
          }));
          buckets.replaceChildren.apply(buckets, ['drive', 'steer', 'brake'].map(function (k) {
            const c = CAT[k];
            return h('button', {
              type: 'button', class: 'bucket' + (sel ? ' ready' : ''), style: { '--c': c.color }, 'aria-label': c.name + ' 칸에 넣기',
              onClick: function () { drop(k); }
            }, h('div', { class: 'bucket-h' }, c.icon + ' ' + c.name), h('div', { class: 'bucket-d' }, c.desc),
              h('div', { class: 'bucket-items' }, placed[k].map(function (n) { return h('span', { class: 'chip-in' }, n); })));
          }));
          if (!pool.length) {
            msg.textContent = wrongs === 0 ? '🎉 완벽해요! 한 번도 틀리지 않았어요.' : '🎉 모두 분류했어요! (다시 시도한 횟수: ' + wrongs + '번)';
            api.unlock();
          }
        };
        const drop = function (k) {
          if (!sel) { msg.textContent = '먼저 위에서 카드를 골라 주세요 👆'; Sound.bad(); return; }
          if (sel[1] === k) {
            placed[k].push(sel[0]);
            pool = pool.filter(function (c) { return c !== sel; });
            msg.textContent = '✅ 맞아요! ' + sel[0] + '은(는) ' + CAT[k].name + '예요.';
            sel = null; Sound.ok();
          } else {
            wrongs++;
            msg.textContent = '🤔 ' + sel[0] + '은(는) ' + CAT[k].name + '가 아니에요. ' + CAT[k].name + '는 ' + CAT[k].desc + '. 다시 생각해 봐요!';
            Sound.bad();
          }
          draw();
        };
        body.append(cardsBox, msg, buckets);
        draw();
      }
    },
    {
      label: '전기차 비교', icon: '🔋', title: '전기 자동차의 기본 요소 비교', gate: '세 가지 장치를 모두 맞히면 열려요.',
      build: function (body, api) {
        body.append(h('p', { class: 'lead' }, '전기 자동차도 기본 요소는 같을까요? 휘발유 자동차와 비교해서 전기 자동차의 장치를 골라 보세요.'));
        const done = {};
        const table = h('div', { class: 'compare' });
        table.append(h('div', { class: 'cmp-head' }, h('span'), h('b', null, '⛽ 휘발유 자동차'), h('b', null, '🔌 전기 자동차')));
        EV_ROWS.forEach(function (r) {
          const c = CAT[r.cat];
          const cell = h('div', { class: 'cmp-cell opts' });
          const why = h('p', { class: 'cmp-why' });
          r.opts.forEach(function (o, i) {
            const b = h('button', {
              type: 'button', class: 'opt', onClick: function () {
                if (done[r.cat]) return;
                if (i === r.a) {
                  done[r.cat] = true; b.classList.add('right'); why.textContent = '✅ ' + r.why; Sound.ok();
                  cell.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
                  if (Object.keys(done).length === 3) { api.unlock(); }
                } else { b.classList.add('wrong'); b.disabled = true; why.textContent = '🤔 다시 골라 보세요.'; Sound.bad(); }
              }
            }, o);
            cell.append(b);
          });
          table.append(h('div', { class: 'cmp-row', style: { '--c': c.color } },
            h('div', { class: 'cmp-label' }, c.icon + ' ' + c.name),
            h('div', { class: 'cmp-cell' }, r.gas), cell), why);
        });
        body.append(table);
        body.append(tip('💡', '전기 자동차는 엔진 대신 전기 모터가 힘을 만들어요. 그래서 달리는 동안 배기가스가 나오지 않아요!'));
      }
    },
    {
      label: '퀴즈', icon: '❓', title: '탐험 퀴즈', gate: '',
      build: function (body) {
        body.append(h('p', { class: 'lead' }, '다섯 문제 중 4문제 이상 맞히면 미션 완료예요!'));
        let idx = 0, score = 0;
        const box = h('div', { class: 'quiz' });
        body.append(box);
        const show = function () {
          if (idx >= QUIZ.length) {
            const pass = score >= 4;
            box.replaceChildren(h('div', { class: 'quiz-end' },
              h('div', { class: 'big' }, pass ? '🏆' : '📚'),
              h('h3', null, score + ' / ' + QUIZ.length + '점'),
              h('p', null, pass ? '대단해요! 수송 수단의 구성 요소를 잘 이해했어요.' : '조금만 더 탐험하고 다시 도전해 볼까요?'),
              h('div', { class: 'row' },
                h('button', { class: 'btn btn-ghost', type: 'button', onClick: function () { idx = 0; score = 0; show(); } }, '🔁 다시 풀기'),
                pass ? h('button', { class: 'btn btn-primary', type: 'button', onClick: function () { completeMission('m1', '수송 수단의 구성 요소를 완벽히 탐험했어요!'); } }, '🏅 미션 완료하기') : null)));
            return;
          }
          const q = QUIZ[idx];
          const why = h('p', { class: 'feedback' });
          const next = h('button', { class: 'btn btn-primary', type: 'button', hidden: true, onClick: function () { idx++; show(); } }, idx === QUIZ.length - 1 ? '결과 보기' : '다음 문제 ▶');
          let answered = false;
          box.replaceChildren(
            h('div', { class: 'quiz-n' }, '문제 ' + (idx + 1) + ' / ' + QUIZ.length),
            h('h3', { class: 'quiz-q' }, 'Q. ' + q.q),
            h('div', { class: 'opts col' }, q.o.map(function (o, i) {
              const b = h('button', {
                type: 'button', class: 'opt big-opt', onClick: function () {
                  if (answered) return; answered = true;
                  const all = box.querySelectorAll('.opt');
                  all.forEach(function (x) { x.disabled = true; });
                  if (i === q.a) { b.classList.add('right'); score++; why.textContent = '✅ 정답! ' + q.why; Sound.ok(); }
                  else { b.classList.add('wrong'); all[q.a].classList.add('right'); why.textContent = '❌ 아쉬워요. ' + q.why; Sound.bad(); }
                  next.hidden = false;
                }
              }, o);
              return b;
            })), why, next);
        };
        show();
      }
    }
  ]);
}
