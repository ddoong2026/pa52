'use strict';
/* 시뮬레이션 계산 함수 (화면과 분리된 순수 함수) */
const Sim = (function () {

  /* ---------- 종이비행기 ---------- */
  const PLANE = {
    G: 9.8,
    VT: 5.0,          // 수평으로 날기 좋은 속도 (m/s)
    START_Z: 1.4,     // 던지는 높이 (m)
    DT: 0.02
  };

  /**
   * p.power   던지는 힘 1~10 (구동 장치)
   * p.angle   던지는 각도 0~30 (도)
   * p.rudder  꼬리 날개(방향타) -1(오른쪽 크게) ~ +1(왼쪽 크게)
   * p.spoiler 날개 뒤쪽 접기 0, 1, 2 (제동 장치)
   * 좌표: x = 앞쪽 거리(m), y = 왼쪽(+) / 오른쪽(-) (m), z = 높이(m)
   */
  function flyPlane(p) {
    const C = PLANE;
    let t = 0, x = 0, y = 0, z = C.START_Z, psi = 0;
    const v0 = 3.0 + p.power * 0.75;
    const th = p.angle * Math.PI / 180;
    let vz = v0 * Math.sin(th) * 0.8;
    let v = v0 * Math.cos(th);
    const pts = [{ t: 0, x: 0, y: 0, z: z, psi: 0, v: v, vz: vz }];
    const liftFactor = 0.85 - 0.12 * p.spoiler;
    const drag = 0.28 + 0.40 * p.spoiler + 0.05 * Math.abs(p.rudder);
    let landed = false;

    while (t < 15) {
      const ratio = (v * v) / (C.VT * C.VT);
      const lift = Math.min(1.10, ratio) * liftFactor;
      const az = C.G * (lift - 1) - 1.6 * vz;
      vz += az * C.DT;
      z += vz * C.DT;
      let dv = -drag * v;
      if (vz < 0) dv += -vz * 0.30;
      v = Math.max(1.5, v + dv * C.DT);
      psi += p.rudder * 0.055 * v * C.DT;
      x += v * Math.cos(psi) * C.DT;
      y += v * Math.sin(psi) * C.DT;
      t += C.DT;
      if (z <= 0) { z = 0; landed = true; }
      pts.push({ t: t, x: x, y: y, z: z, psi: psi, v: v, vz: vz });
      if (landed) break;
    }
    // 착륙 후 미끄러짐
    const touch = pts[pts.length - 1];
    const slide = touch.v * 0.22 * (1 - 0.25 * p.spoiler);
    const fx = touch.x + slide * Math.cos(touch.psi);
    const fy = touch.y + slide * Math.sin(touch.psi);
    return {
      pts: pts,
      time: touch.t,
      landingSpeed: touch.v,
      touchX: touch.x, touchY: touch.y,
      endX: fx, endY: fy,
      psi: touch.psi,
      maxHeight: Math.max.apply(null, pts.map(function (q) { return q.z; }))
    };
  }

  /* 비행 미션 */
  const PLANE_MISSIONS = [
    { id: 'straight', icon: '⬆️', name: '곧게 날리기', tx: 12, ty: 0, r: 1.6,
      brief: '꼬리 날개를 어떻게 하면 똑바로 날아갈까요? 초록 과녁 안에 착륙시켜 보세요.' },
    { id: 'left', icon: '⬅️', name: '왼쪽으로 돌아 착륙', tx: 11, ty: 4.2, r: 1.7,
      brief: '왼쪽에 있는 과녁에 착륙시켜 보세요. 방향을 바꾸는 장치는 무엇이었죠?' },
    { id: 'right', icon: '➡️', name: '오른쪽으로 돌아 착륙', tx: 11, ty: -4.2, r: 1.7,
      brief: '이번에는 오른쪽 과녁이에요. 꼬리 날개를 반대로 접어 볼까요?' },
    { id: 'soft', icon: '🛬', name: '느리게 착륙하기', tx: 11, ty: 0, r: 2.4, maxSpeed: 3.3,
      brief: '과녁 안에 착륙하되, 착륙 속도를 3.3 m/s 이하로 줄여야 해요. 멀리 날리면서도 느리게! 날개 뒤쪽 접기(제동 장치)를 써 보세요.' }
  ];

  function scorePlane(m, r) {
    if (!m) return null;
    const d = Math.hypot(r.endX - m.tx, r.endY - m.ty);
    let stars = d <= m.r * 0.5 ? 3 : d <= m.r ? 2 : d <= m.r * 2 ? 1 : 0;
    const slowOk = m.maxSpeed ? r.landingSpeed <= m.maxSpeed : true;
    if (!slowOk && stars > 1) stars = 1;     // 속도 조건을 못 맞추면 성공이 아님
    return { dist: d, stars: stars, success: stars >= 2, slowOk: slowOk };
  }

  /* ---------- 태양광 자동차 ---------- */
  /** 전지판이 받는 햇빛의 양 (0~1) */
  function solarPower(sunElev, tilt, cloudy) {
    const normalElev = 90 - tilt;               // 전지판이 바라보는 높이각
    const diff = Math.abs(sunElev - normalElev);
    const c = Math.max(0, Math.cos(diff * Math.PI / 180));
    const strength = 0.45 + 0.55 * Math.sin(sunElev * Math.PI / 180);
    return c * strength * (cloudy ? 0.3 : 1);
  }

  const MASS = { light: 1, mid: 2, heavy: 3 };

  /** 정상 상태 속도 (cm/s). 0이면 힘이 부족해 움직이지 못함 */
  function carSpeed(P, ratio, massKey) {
    const m = MASS[massKey] || 2;
    const free = 52 * Math.sqrt(P) / ratio * 3.4;       // 힘을 안 받을 때의 최고 속도
    const force = 4.2 * P * ratio;                      // 모터가 낼 수 있는 힘 (기어비 클수록 커짐)
    const resist = 1.9 * m;                             // 마찰 + 무게
    if (force <= resist) return { v: 0, free: free, force: force, resist: resist };
    const v = free * (1 - resist / force);
    return { v: v, free: free, force: force, resist: resist };
  }

  const TRACK = 200;   // cm

  /** 출발부터 결승선까지 시간 계산 */
  function carRace(P, ratio, massKey) {
    const s = carSpeed(P, ratio, massKey);
    if (s.v <= 0.5) return { ok: false, time: Infinity, vmax: s.v, info: s };
    let t = 0, x = 0, v = 0;
    const dt = 0.02;
    while (x < TRACK && t < 60) {
      v += (s.v - v) * 2.2 * dt;
      x += v * dt; t += dt;
    }
    return { ok: x >= TRACK, time: t, vmax: s.v, info: s };
  }

  return {
    flyPlane: flyPlane, PLANE: PLANE, PLANE_MISSIONS: PLANE_MISSIONS, scorePlane: scorePlane,
    solarPower: solarPower, carSpeed: carSpeed, carRace: carRace, TRACK: TRACK, MASS: MASS
  };
})();

if (typeof module !== 'undefined') module.exports = Sim;
