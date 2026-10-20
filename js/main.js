'use strict';
/* 시작 화면(탐험 지도) + 라우터 연결 */

function renderHome(app) {
  const done = MISSIONS.filter(function (m) { return Store.d.done[m.id]; }).length;
  app.append(h('section', { class: 'hero' },
    h('div', { class: 'hero-text' },
      h('h1', null, '수송 기술 탐험대'),
      h('p', { class: 'hero-sub' }, '자동차 · 비행기 · 배 · 자전거는 어떻게 움직이고, 멈추고, 방향을 바꿀까요? 직접 만들고 시뮬레이션하며 알아봐요!'),
      h('a', { class: 'btn btn-primary btn-big', href: '#/' + (MISSIONS.filter(function (m) { return !Store.d.done[m.id]; })[0] || MISSIONS[0]).id },
        done === 0 ? '🚀 탐험 시작하기' : (done >= 4 ? '🔁 다시 탐험하기' : '▶ 이어서 탐험하기'))),
    h('div', { class: 'hero-art', 'aria-hidden': 'true' }, h('span', { class: 'ha a1' }, '✈️'), h('span', { class: 'ha a2' }, '🚗'), h('span', { class: 'ha a3' }, '🚢'), h('span', { class: 'ha a4' }, '🚲'), h('span', { class: 'ha a5' }, '☀️'))));

  app.append(h('div', { class: 'progress-line' }, h('b', null, '탐험 진행 '), done + ' / 4 미션 완료',
    h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: done / 4 * 100 + '%' } }))));

  const desc = {
    m1: ['자동차·비행기·배·자전거의 부품을 눌러 보고, 구동·조향·제동 장치를 찾아요.', '교과서 64~65쪽', '탐험 · 분류 · 퀴즈'],
    m2: ['꼬리 날개와 날개 뒤쪽을 조절해 방향을 바꾸고 속도를 줄이는 종이비행기를 설계해요.', '교과서 66~67쪽', '🛩️ 시뮬레이션'],
    m3: ['햇빛으로 달리는 자동차를 조립하고, 전지판·기어·무게를 바꿔 가며 달려요.', '교과서 68~69쪽', '🏎️ 시뮬레이션'],
    m4: ['고장 난 자동차를 고치는 정비사가 되어 보고, 친환경이 왜 필요한지 생각해요.', '교과서 69쪽', '진로 · 수료증']
  };
  app.append(h('div', { class: 'map' }, MISSIONS.map(function (m, i) {
    const d = desc[m.id];
    return h('a', { class: 'mcard' + (Store.d.done[m.id] ? ' done' : ''), href: '#/' + m.id, style: { '--c': m.color } },
      h('div', { class: 'mcard-n' }, '미션 ' + (i + 1)),
      h('div', { class: 'mcard-ico' }, m.icon),
      h('h3', null, m.title),
      h('p', null, d[0]),
      h('div', { class: 'mcard-tags' }, h('span', null, d[1]), h('span', null, d[2])),
      h('div', { class: 'mcard-go' }, Store.d.done[m.id] ? '✅ 완료! 다시 보기' : '시작하기 ▶'));
  })));

  app.append(h('div', { class: 'engineering' },
    h('h2', null, '🧭 문제를 해결하는 4단계'),
    h('ol', null,
      h('li', null, h('b', null, '문제 확인하기'), h('span', null, '무엇이 불편하거나 아쉬운지 찾아요.')),
      h('li', null, h('b', null, '아이디어 탐색'), h('span', null, '조사하고, 해결 방법을 계획해요.')),
      h('li', null, h('b', null, '실행하기'), h('span', null, '직접 만들고 시험해 봐요.')),
      h('li', null, h('b', null, '평가하기'), h('span', null, '계획대로 되었는지 돌아봐요.')))));

  app.append(h('div', { class: 'row center home-foot' }, h('button', {
    class: 'btn btn-ghost btn-small', type: 'button', onClick: function () {
      modal({
        emoji: '🧹', title: '처음부터 다시 할까요?', body: h('p', null, '완료한 미션과 기록이 모두 지워져요.'),
        actions: [{ label: '네, 지울래요', primary: true, onClick: function () { Store.reset(); Store.save(); location.hash = '#/home'; Router.render(); } }, { label: '아니요' }]
      });
    }
  }, '🧹 기록 지우기')));
}

Store.load();
Router.routes.home = renderHome;
Router.routes.m1 = renderM1;
Router.routes.m2 = renderM2;
Router.routes.m3 = renderM3;
Router.routes.m4 = renderM4;
Router.render();
