'use strict';
/* three.js 3D 장면: 종이비행기 비행장, 태양광 자동차 경주장
   좌표 규칙(시뮬레이션 → three.js): 앞쪽 x → x, 왼쪽 y → -z, 높이 z → y */
const T3 = (function () {

  function supported() {
    try {
      const c = document.createElement('canvas');
      return !!(window.THREE && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function spriteText(text, o) {
    o = o || {};
    const c = document.createElement('canvas'); c.width = 320; c.height = 100;
    const g = c.getContext('2d');
    g.font = 'bold 52px "Malgun Gothic","Apple SD Gothic Neo",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 12; g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,255,255,.95)'; g.strokeText(text, 160, 52);
    g.fillStyle = o.color || '#1d2b4f'; g.fillText(text, 160, 52);
    const m = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false });
    const s = new THREE.Sprite(m); const sc = o.scale || 3;
    s.scale.set(sc, sc * 100 / 320, 1); s.renderOrder = 10;
    return s;
  }

  function mat(color, extra) { return new THREE.MeshLambertMaterial(Object.assign({ color: color }, extra || {})); }
  function box(w, h, d, color) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color)); }

  function tree(x, z, s) {
    const g = new THREE.Group();
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.2 * s, 1.2 * s, 6), mat(0x8a5a2b)); t.position.y = 0.6 * s;
    const l = new THREE.Mesh(new THREE.ConeGeometry(0.9 * s, 2.2 * s, 7), mat(0x2e9e57)); l.position.y = 2.1 * s;
    g.add(t, l); g.position.set(x, 0, z); return g;
  }
  function cloudMesh(color) {
    const g = new THREE.Group();
    [[0, 0, 0, 1.6], [1.5, -0.2, 0.3, 1.2], [-1.5, -0.1, -0.2, 1.3], [0.6, 0.5, 0, 1.2]].forEach(function (q) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(q[3], 12, 10), new THREE.MeshLambertMaterial({ color: color }));
      s.position.set(q[0], q[1], q[2]); g.add(s);
    });
    return g;
  }

  /* 공통 무대: 렌더러, 장면, 카메라, 크기 맞춤, 정리 */
  function baseStage(container, ratio) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const el = renderer.domElement; el.className = 'stage-canvas';
    container.prepend(el);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1 / ratio, 0.1, 500);
    const B = { renderer: renderer, scene: scene, camera: camera, raf: 0 };
    let ro = null;
    B.render = function () { renderer.render(scene, camera); };
    B.resize = function () {
      const w = container.clientWidth || 640, hh = Math.round(w * ratio);
      renderer.setSize(w, hh, false); el.style.width = '100%'; el.style.height = hh + 'px';
      camera.aspect = w / hh; camera.updateProjectionMatrix(); B.render();
    };
    if (window.ResizeObserver) { ro = new ResizeObserver(B.resize); ro.observe(container); }
    B.resize();
    B.dispose = function () {
      cancelAnimationFrame(B.raf); if (ro) ro.disconnect();
      renderer.dispose(); try { renderer.forceContextLoss(); } catch (e) { }
      if (el.parentNode) el.parentNode.removeChild(el);
    };
    return B;
  }

  /* ============================== 종이비행기 ============================== */
  function paperPlane() {
    const root = new THREE.Group();
    const N = [1.0, 0, 0], T = [-0.55, 0, 0], L = [-0.55, 0.13, -0.66], R = [-0.55, 0.13, 0.66], K = [-0.3, -0.22, 0];
    function tri(a, b, c, color) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([].concat(a, b, c)), 3));
      g.computeVertexNormals();
      return new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide }));
    }
    root.add(tri(N, L, T, 0xffffff), tri(N, T, R, 0xffffff), tri(N, T, K, 0xc9d6ea));
    // 날개 윤곽선
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BufferGeometry().setFromPoints(
      [N, L, T, N, T, R, N, T, K].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }))), new THREE.LineBasicMaterial({ color: 0x1d2b4f }));
    root.add(edges);
    // 날개 뒤쪽 접기(제동 장치)
    const flaps = [];
    [-1, 1].forEach(function (side) {
      const gm = new THREE.BoxGeometry(0.2, 0.012, 0.36); gm.translate(-0.1, 0, 0);
      const f = new THREE.Mesh(gm, mat(0xff7a2f));
      f.position.set(-0.36, 0.07, side * 0.33); root.add(f); flaps.push(f);
    });
    // 꼬리 날개(방향타, 조향 장치)
    const fin = box(0.3, 0.2, 0.012, 0xe8eef5); fin.position.set(-0.4, 0.1, 0); root.add(fin);
    const rg = new THREE.BoxGeometry(0.2, 0.2, 0.014); rg.translate(-0.1, 0, 0);
    const rudder = new THREE.Mesh(rg, mat(0x2a8cff)); rudder.position.set(-0.55, 0.1, 0); root.add(rudder);
    root.userData = { flaps: flaps, rudder: rudder };
    return root;
  }

  function createPlaneStage(container) {
    const B = baseStage(container, 0.5);
    const scene = B.scene, camera = B.camera;
    scene.background = new THREE.Color(0xbfe6ff);
    scene.fog = new THREE.Fog(0xcfeeff, 45, 140);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7aa05a, 1.0));
    const sun = new THREE.DirectionalLight(0xffffff, 0.5); sun.position.set(-10, 25, 12); scene.add(sun);

    // 땅(잔디 무늬 + 활주로)
    const far = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), mat(0x86c26a)); far.rotation.x = -Math.PI / 2; far.position.set(20, -0.03, 0); scene.add(far);
    const gc = document.createElement('canvas'); gc.width = 1200; gc.height = 600;
    const g = gc.getContext('2d');
    for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#a8d98c' : '#9bd17f'; g.fillRect(i * 100, 0, 100, 600); }
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(200, 268, 600, 64);
    g.fillStyle = 'rgba(255,255,255,.9)';
    for (let k = 0; k <= 6; k++) g.fillRect(200 + k * 100 - 2, 0, 4, 600);
    for (let x = 200; x < 800; x += 40) g.fillRect(x, 298, 20, 4);
    const gt = new THREE.CanvasTexture(gc); gt.anisotropy = 4;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshLambertMaterial({ map: gt }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(20, 0, 0); scene.add(ground);

    for (let m = 5; m <= 30; m += 5) {
      const s = spriteText(m + ' m', { scale: 3 }); s.position.set(m, 0.9, 6.2); scene.add(s);
      const p = box(0.12, 0.8, 0.12, 0xffffff); p.position.set(m, 0.4, 5.4); scene.add(p);
    }
    [[4, -12], [12, -13], [22, -12], [32, -13], [8, 12], [18, 13], [28, 12], [40, 11], [-4, -11], [-5, 11]].forEach(function (t, i) { scene.add(tree(t[0], t[1], 1 + (i % 3) * 0.25)); });
    const cl = cloudMesh(0xffffff); cl.position.set(18, 16, -18); cl.scale.setScalar(1.6); scene.add(cl);
    const cl2 = cloudMesh(0xffffff); cl2.position.set(38, 18, 10); cl2.scale.setScalar(1.3); scene.add(cl2);

    // 출발대와 던지는 친구
    const pad = box(1.4, 0.3, 1.8, 0xb8c2d3); pad.position.set(0, 0.15, 0); scene.add(pad);
    const kid = new THREE.Group();
    const kb = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.0, 10), mat(0xff8a3d)); kb.position.y = 0.55;
    const kh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), mat(0xffd9b0)); kh.position.y = 1.3;
    const ka = box(0.7, 0.12, 0.12, 0xffd9b0); ka.position.set(0.35, 1.05, 0.15); ka.rotation.z = 0.5;
    kid.add(kb, kh, ka); kid.position.set(-1.3, 0, 0.1); scene.add(kid);
    const st = spriteText('출발', { scale: 2.2 }); st.position.set(0, 2.3, 0); scene.add(st);

    // 비행기
    const plane = paperPlane(); plane.rotation.order = 'YZX'; plane.scale.setScalar(1.6); scene.add(plane);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.9, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.04; scene.add(shadow);

    // 비행 자국
    function trailMesh(color, size) {
      const m = new THREE.InstancedMesh(new THREE.SphereGeometry(size, 6, 6), new THREE.MeshBasicMaterial({ color: color }), 320);
      m.count = 0; m.frustumCulled = false; scene.add(m); return m;
    }
    function fillTrail(mesh, pts, upto) {
      const d = new THREE.Object3D(); let n = 0;
      for (let i = 0; i <= upto && n < 320; i += 3) { const p = pts[i]; d.position.set(p.x, p.z, -p.y); d.updateMatrix(); mesh.setMatrixAt(n++, d.matrix); }
      mesh.count = n; mesh.instanceMatrix.needsUpdate = true;
    }
    const trail = trailMesh(0x2a8cff, 0.09);
    let ghosts = [];
    let marker = null, targetG = null;

    let view = 'chase';
    let cur = { x: 0, y: 0, z: 1.4, psi: 0 };
    const look = new THREE.Vector3(), camPos = new THREE.Vector3(), want = new THREE.Vector3(), wantLook = new THREE.Vector3();

    function updateCam(imm) {
      camera.up.set(0, 1, 0);
      if (view === 'top') { want.set(16, 27, 0); wantLook.set(16, 0, 0); camera.up.set(0, 0, -1); }
      else if (view === 'side') { want.set(15, 3.4, 22); wantLook.set(15, 1.4, 0); }
      else {
        const fx = Math.cos(cur.psi), fz = -Math.sin(cur.psi);
        want.set(cur.x - fx * 7.5 - fz * 1.8, cur.z + 2.8, -cur.y - fz * 7.5 + fx * 1.8);
        wantLook.set(cur.x + fx * 4, cur.z * 0.6, -cur.y + fz * 4);
        if (cur.x < 0.1 && cur.z > 1.3) { want.set(-8, 3.4, 3.2); wantLook.set(7, 1, -0.5); }
      }
      if (imm || view !== 'chase') { camPos.copy(want); look.copy(wantLook); }
      else { camPos.lerp(want, 0.12); look.lerp(wantLook, 0.15); }
      camera.position.copy(camPos); camera.up.set(0, view === 'top' ? 0 : 1, view === 'top' ? -1 : 0); camera.lookAt(look);
    }

    function pose(x, y, z, psi, pitch, roll) {
      cur = { x: x, y: y, z: z, psi: psi };
      plane.position.set(x, z + 0.06, -y); plane.rotation.set(roll, psi, pitch);
      shadow.position.set(x, 0.04, -y); const s = 1 + z * 0.12; shadow.scale.set(s, s, s); shadow.material.opacity = Math.max(0.08, 0.3 - z * 0.05);
    }

    const api = {
      available: true,
      setConfig: function (rudder, spoiler) {
        plane.userData.rudder.rotation.y = -rudder * 0.7;
        plane.userData.flaps.forEach(function (f) { f.rotation.z = -spoiler * 0.55; });
        B.render();
      },
      setMission: function (m) {
        if (targetG) { scene.remove(targetG); targetG = null; }
        if (m) {
          targetG = new THREE.Group();
          const r = m.r;
          const a = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: 0x12a05f, transparent: true, opacity: 0.4 }));
          const b = new THREE.Mesh(new THREE.CircleGeometry(r * 0.5, 40), new THREE.MeshBasicMaterial({ color: 0x0b7a46, transparent: true, opacity: 0.55 }));
          const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.1, r, 48), new THREE.MeshBasicMaterial({ color: 0xffffff }));
          [a, b, ring].forEach(function (o, i) { o.rotation.x = -Math.PI / 2; o.position.y = 0.03 + i * 0.01; targetG.add(o); });
          const pole = box(0.1, 2.6, 0.1, 0xffffff); pole.position.set(0, 1.3, 0); targetG.add(pole);
          const flag = box(0.9, 0.5, 0.04, 0xe5446d); flag.position.set(0.45, 2.3, 0); targetG.add(flag);
          const lb = spriteText(m.maxSpeed ? '느리게!' : '과녁', { scale: 3 }); lb.position.set(0, 3.4, 0); targetG.add(lb);
          targetG.position.set(m.tx, 0, -m.ty); scene.add(targetG);
        }
        B.render();
      },
      clearGhosts: function () { ghosts.forEach(function (gh) { scene.remove(gh); }); ghosts = []; },
      addGhost: function (res) {
        const gm = trailMesh(0x7a869e, 0.06); fillTrail(gm, res.pts, res.pts.length - 1);
        ghosts.push(gm); if (ghosts.length > 3) scene.remove(ghosts.shift());
      },
      reset: function () {
        cancelAnimationFrame(B.raf); trail.count = 0;
        if (marker) { scene.remove(marker); marker = null; }
        pose(0, 0, 1.4, 0, 0, 0); updateCam(true); B.render();
      },
      setView: function (v) { view = v; updateCam(true); B.render(); },
      getView: function () { return view; },
      play: function (res, speed, done) {
        cancelAnimationFrame(B.raf);
        if (marker) { scene.remove(marker); marker = null; }
        const t0 = performance.now(), SLIDE = 0.4, dt = Sim.PLANE.DT;
        const bank = -res.rud * 0.5;
        const step = function (now) {
          const el = (now - t0) / 1000 * speed;
          const idx = Math.min(res.pts.length - 1, Math.floor(el / dt));
          const p = res.pts[idx];
          const slideT = el > res.time ? Math.min(1, (el - res.time) / SLIDE) : 0;
          if (slideT > 0) {
            const sx = res.touchX + (res.endX - res.touchX) * slideT, sy = res.touchY + (res.endY - res.touchY) * slideT;
            pose(sx, sy, 0, p.psi, 0, 0);
          } else pose(p.x, p.y, p.z, p.psi, Math.atan2(p.vz, Math.max(p.v, 1)), bank);
          fillTrail(trail, res.pts, idx);
          updateCam(false); B.render();
          if (el < res.time + SLIDE) B.raf = requestAnimationFrame(step);
          else {
            marker = new THREE.Group();
            [0.8, -0.8].forEach(function (a) { const b = box(1.1, 0.05, 0.16, 0xe5446d); b.rotation.y = a; marker.add(b); });
            marker.position.set(res.endX, 0.06, -res.endY); scene.add(marker);
            updateCam(false); B.render(); if (done) done();
          }
        };
        B.raf = requestAnimationFrame(step);
      },
      dispose: function () { B.dispose(); }
    };
    api.reset();
    return api;
  }

  /* ============================== 태양광 자동차 ============================== */
  const LANE_MINE = -2.1, LANE_GAS = 2.1, X_OFF = 1.6;
  const cmToX = function (cm) { return X_OFF + cm / 10; };

  function carModel(bodyColor, cabinColor, solar) {
    const group = new THREE.Group();
    const body = box(2.7, 0.55, 1.35, bodyColor); body.position.y = 0.6; group.add(body);
    const cab = box(1.5, 0.45, 1.15, cabinColor); cab.position.set(-0.15, 1.08, 0); group.add(cab);
    const wheels = [];
    [[0.9, 0.7], [-0.9, 0.7], [0.9, -0.7], [-0.9, -0.7]].forEach(function (p) {
      const wg = new THREE.Group(); wg.position.set(p[0], 0.34, p[1]);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16), mat(0x2d3748)); tire.rotation.x = Math.PI / 2;
      const hub = box(0.5, 0.08, 0.24, 0xe2e8f0);
      wg.add(tire, hub); group.add(wg); wheels.push(wg);
    });
    const out = { group: group, wheels: wheels };
    if (solar) {
      const pivot = new THREE.Group(); pivot.position.set(0, 1.36, 0);
      const c = document.createElement('canvas'); c.width = 128; c.height = 128; const g = c.getContext('2d');
      g.fillStyle = '#2a4a9c'; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#8fb0f0'; g.lineWidth = 3;
      for (let i = 0; i <= 128; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); }
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.3), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(c) }));
      panel.position.y = 0.05; pivot.add(panel);
      const rim = box(2.06, 0.05, 1.36, 0x16295c); rim.position.y = 0.0; pivot.add(rim);
      group.add(pivot); out.pivot = pivot;
      const deco = box(0.5, 0.3, 1.38, 0xffd23f); deco.position.set(0.9, 0.7, 0); group.add(deco);
    } else {
      const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 8), mat(0x555b66)); ex.rotation.z = Math.PI / 2; ex.position.set(-1.45, 0.4, 0.45); group.add(ex);
      out.exhaust = new THREE.Vector3(-1.75, 0.4, 0.45);
      const hl = box(0.06, 0.18, 0.35, 0xfff3a3); hl.position.set(1.36, 0.62, 0.4); group.add(hl);
    }
    return out;
  }

  function createCarStage(container) {
    const B = baseStage(container, 0.5);
    const scene = B.scene, camera = B.camera;
    scene.background = new THREE.Color(0x8fd3ff); scene.fog = new THREE.Fog(0xdff4ff, 60, 160);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x7aa05a, 0.85); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 0.8); scene.add(sun); scene.add(sun.target);

    const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0x8fcf72)); grass.rotation.x = -Math.PI / 2; grass.position.set(12, -0.02, 0); scene.add(grass);
    [LANE_MINE, LANE_GAS].forEach(function (z) {
      const r = box(31, 0.04, 3.4, 0x6b7686); r.position.set(11.5, 0.0, z); scene.add(r);
      for (let x = 0; x < 30; x += 2) { const d = box(0.9, 0.05, 0.12, 0xffffff); d.position.set(x - 3, 0.03, z); scene.add(d); }
    });
    // 출발선
    [LANE_MINE, LANE_GAS].forEach(function (z) { const s = box(0.16, 0.06, 3.2, 0xffffff); s.position.set(0.5, 0.05, z); scene.add(s); });
    // 결승 아치
    const fx = cmToX(200) + 1.2;
    const fc = document.createElement('canvas'); fc.width = 256; fc.height = 64; const fg = fc.getContext('2d');
    for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) { fg.fillStyle = (i + j) % 2 ? '#fff' : '#1d2b4f'; fg.fillRect(i * 16, j * 16, 16, 16); }
    [-4.4, 4.4].forEach(function (z) { const p = box(0.18, 3.8, 0.18, 0xe5446d); p.position.set(fx, 1.9, z); scene.add(p); });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 8.8), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(fc) })); banner.position.set(fx, 3.6, 0); scene.add(banner);
    const fl = spriteText('결승선', { scale: 3.2 }); fl.position.set(fx, 4.6, 0); scene.add(fl);
    const l1 = spriteText('내 태양광 자동차', { scale: 4.4, color: '#c9415f' }); l1.position.set(4.5, 3.2, LANE_MINE); scene.add(l1);
    const l2 = spriteText('휘발유 자동차', { scale: 4, color: '#8a2020' }); l2.position.set(4.5, 3.0, LANE_GAS); scene.add(l2);
    for (let i = 0; i < 14; i++) scene.add(tree(-4 + i * 3.2, -9 - (i % 3) * 2.2, 1.1 + (i % 3) * 0.3));

    const mine = carModel(0xff8fab, 0xe4c48d, true); scene.add(mine.group);
    const gas = carModel(0xd64545, 0xcfeaff, false); scene.add(gas.group);

    const cloud = cloudMesh(0x9aa3b2); cloud.position.set(13, 9, -3); cloud.scale.setScalar(2.6); cloud.visible = false; scene.add(cloud);
    const cloudOver = cloudMesh(0x9aa3b2); cloudOver.position.set(5, 8, -6); cloudOver.scale.setScalar(2); cloudOver.visible = false; scene.add(cloudOver);

    // 햇빛 줄기
    const rays = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.4 }));
      scene.add(r); rays.push(r);
    }
    // 연기
    const puffs = [];
    for (let i = 0; i < 40; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), new THREE.MeshBasicMaterial({ color: 0x555a66, transparent: true, opacity: 0 }));
      m.visible = false; scene.add(m); puffs.push({ m: m, life: 0 });
    }

    const env = { sun: 35, tilt: 0, cloudy: false, power: 0.5 };
    let view = 'side', acc = 0, prevMine = 0, prevGas = 0, puffCount = 0;
    let cur = new THREE.Vector3(), curLook = new THREE.Vector3();
    const want = new THREE.Vector3(), wantLook = new THREE.Vector3();
    const mix = function (a, b, t) { return new THREE.Color(a).lerp(new THREE.Color(b), t); };

    function applyEnv() {
      const e = env.sun * Math.PI / 180, t = Math.min(1, Math.max(0, (env.sun - 10) / 40));
      scene.background = mix(0xffa56b, 0x8fd3ff, t); scene.fog.color = mix(0xffd9b8, 0xdff4ff, t);
      const k = env.cloudy ? 0.35 : 1;
      sun.position.set(Math.cos(e) * 30 + 12, Math.sin(e) * 30, 6); sun.target.position.set(12, 0, 0);
      sun.intensity = (0.25 + 0.75 * Math.sin(e)) * k; hemi.intensity = env.cloudy ? 0.65 : 0.9;
      mine.pivot.rotation.z = -env.tilt * Math.PI / 180;
      cloud.visible = cloudOver.visible = env.cloudy;
    }
    function placeRays() {
      const e = env.sun * Math.PI / 180, dir = new THREE.Vector3(Math.cos(e), Math.sin(e), 0);
      const c = new THREE.Vector3(mine.group.position.x, 1.5, LANE_MINE);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      rays.forEach(function (r, i) {
        r.position.copy(c).addScaledVector(dir, 4.3); r.position.z += (i - 1) * 0.5;
        r.quaternion.copy(q); r.material.opacity = 0.1 + 0.5 * env.power; r.visible = env.power > 0.03;
      });
    }
    function updateCam(imm) {
      camera.up.set(0, 1, 0);
      const mx = mine.group.position.x;
      if (view === 'top') { want.set(12.5, 28, 0); wantLook.set(12.5, 0, 0); camera.up.set(0, 0, -1); }
      else if (view === 'follow') { want.set(mx - 6.5, 3.4, LANE_MINE + 8); wantLook.set(mx + 3, 0.9, LANE_MINE); }
      else { want.set(12.5, 7.5, 21); wantLook.set(12.5, 0.4, 0); }
      if (imm) { cur.copy(want); curLook.copy(wantLook); } else { cur.lerp(want, 0.12); curLook.lerp(wantLook, 0.15); }
      if (view !== 'follow') { cur.copy(want); curLook.copy(wantLook); }
      camera.position.copy(cur); camera.lookAt(curLook);
    }
    function layout(st, dt) {
      const mx = cmToX(st.mine), gx = cmToX(st.gas);
      mine.group.position.set(mx + (st.stalled ? Math.sin(st.t * 45) * 0.03 : 0), 0, LANE_MINE);
      gas.group.position.set(gx, 0, LANE_GAS);
      mine.wheels.forEach(function (w) { w.rotation.z -= (mx - prevMine) / 0.34; });
      gas.wheels.forEach(function (w) { w.rotation.z -= (gx - prevGas) / 0.34; });
      prevMine = mx; prevGas = gx;
      if (st.gasMoving && dt > 0) {
        acc += dt;
        while (acc > 0.09) {
          acc -= 0.09;
          const p = puffs[puffCount++ % puffs.length];
          p.life = 1.8; p.m.visible = true; p.m.position.set(gx + gas.exhaust.x, 0.5, LANE_GAS + gas.exhaust.z); p.m.scale.setScalar(0.6);
        }
      }
      puffs.forEach(function (p) {
        if (p.life <= 0) return;
        p.life -= dt; p.m.position.y += 1.1 * dt; p.m.scale.multiplyScalar(1 + 0.9 * dt);
        p.m.material.opacity = Math.max(0, p.life / 1.8) * 0.6;
        if (p.life <= 0) p.m.visible = false;
      });
    }

    const api = {
      available: true,
      setEnv: function (e) { Object.assign(env, e); applyEnv(); placeRays(); B.render(); },
      update: function (st, dt) { layout(st, dt || 0); placeRays(); updateCam(false); B.render(); },
      reset: function () {
        puffs.forEach(function (p) { p.life = 0; p.m.visible = false; });
        prevMine = cmToX(0); prevGas = cmToX(0);
        layout({ mine: 0, gas: 0, t: 0, stalled: false, gasMoving: false }, 0); placeRays(); updateCam(true); B.render();
      },
      setView: function (v) { view = v; updateCam(true); B.render(); },
      getView: function () { return view; },
      dispose: function () { B.dispose(); }
    };
    prevMine = cmToX(0); prevGas = cmToX(0);
    applyEnv(); api.reset();
    return api;
  }

  /* WebGL을 쓸 수 없을 때 빈 무대 */
  function nullStage(container, msg) {
    container.prepend(h('div', { class: 'stage-fallback' }, '🧊 이 브라우저에서는 3D 화면을 보여 줄 수 없어요. (' + msg + ') 계산 결과는 아래에 그대로 나와요.'));
    const noop = function () { };
    return {
      available: false, setConfig: noop, setMission: noop, clearGhosts: noop, addGhost: noop, reset: noop, setView: noop, getView: function () { return 'chase'; },
      play: function (res, speed, done) { setTimeout(done, 600); }, setEnv: noop, update: noop, dispose: noop
    };
  }

  function make(kind, container) {
    if (!supported()) return nullStage(container, 'WebGL 미지원');
    try { return kind === 'plane' ? createPlaneStage(container) : createCarStage(container); }
    catch (e) { return nullStage(container, '오류'); }
  }

  return { make: make, supported: supported };
})();
