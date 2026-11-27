/* قطار الحيوانات 3D: القطار يوقف في ١٠ محطات، وفي كل محطة يركب حيوان عربة جديدة */
(function () {
  const A = window.APP, K = window.KIT3D; if (!A || !K || !window.MODES) return;
  const { SND, animalSound, voice, confetti, game, $ } = A;
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const ST = [['cat', '🐱', 'قطة'], ['dog', '🐶', 'كلب'], ['duck', '🦆', 'بطة'], ['sheep', '🐑', 'خروف'], ['cow', '🐮', 'بقرة'], ['rooster', '🐓', 'ديك'], ['horse', '🐴', 'حصان'], ['frog', '🐸', 'ضفدع'], ['elephant', '🐘', 'فيل'], ['lion', '🦁', 'أسد']];
  const WCOL = [0x4dabf7, 0x69db7c, 0xffa94d, 0xcc5de8, 0xff6b6b, 0x38d9a9, 0xfcc419, 0xf783ac, 0x748ffc, 0x20c997];
  let T, R, scene, cam, raf = 0, running = false, last = 0, speed = 0, phase = 'run', stationT = 6, station = null, wagons = [], riders = 0, decor = [], sleepers = [], wheels = [], puffs = [], timers = [], smokeT = 0, jumpers = [], camZ = 4;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearT = () => { timers.forEach(clearTimeout); timers = []; };
  const RUN = 12, WGAP = 3.4;

  function wheel(x, z, r) { const g = new T.Group(); g.position.set(x, r, z); const w = K.mesh(new T.CylinderGeometry(r, r, .3, 12), K.mat(0x343a40)); w.rotation.z = Math.PI / 2; g.add(w); const sp = K.mesh(new T.BoxGeometry(.34, r * 1.6, .18), K.mat(0xfa5252)); g.add(sp); wheels.push(g); return g; }
  function loco() {
    const g = new T.Group(), m = K.mat;
    g.add(K.mesh(new T.BoxGeometry(2.4, .5, 4.8), m(0x343a40), 0, .75, 0));
    const boiler = K.mesh(new T.CylinderGeometry(.85, .85, 2.8, 14), m(0xe03131), 0, 1.8, -.7); boiler.rotation.x = Math.PI / 2; g.add(boiler);
    const cap = K.mesh(new T.CylinderGeometry(.9, .9, .2, 14), m(0xfcc419), 0, 1.8, -2.15); cap.rotation.x = Math.PI / 2; g.add(cap);
    g.add(K.mesh(new T.SphereGeometry(.25, 8, 6), m(0xfff3bf, { emissive: 0xffd43b }), 0, 1.8, -2.3));
    g.add(K.mesh(new T.CylinderGeometry(.32, .22, 1, 10), m(0x343a40), 0, 3, -1.5));
    g.add(K.mesh(new T.CylinderGeometry(.45, .45, .2, 10), m(0x343a40), 0, 3.5, -1.5));
    g.add(K.mesh(new T.SphereGeometry(.35, 10, 8), m(0xfcc419), 0, 2.7, -.3));
    g.add(K.mesh(new T.BoxGeometry(2.4, 1.9, 1.8), m(0x1c7ed6), 0, 2, 1.3));
    g.add(K.mesh(new T.BoxGeometry(2.8, .25, 2.3), m(0xfa5252), 0, 3.05, 1.3));
    const win = K.mesh(new T.BoxGeometry(2.45, .8, 1), m(0xd0ebff), 0, 2.3, 1.3); g.add(win);
    const head = K.monkeyHead(1.2); head.position.set(.9, 2.45, 1.3); head.rotation.y = -Math.PI / 2 + .5; g.add(head);
    g.add(K.mesh(new T.BoxGeometry(2.2, .4, .5), m(0xfcc419), 0, .6, -2.6));
    [-1.7, -.4, .9].forEach(z => [-1.25, 1.25].forEach(x => g.add(wheel(x, z, .55))));
    return g;
  }
  function wagon(i) {
    const g = new T.Group(), c = WCOL[i % WCOL.length], m = K.mat;
    g.add(K.mesh(new T.BoxGeometry(2.3, .4, 2.9), m(0x495057), 0, .7, 0));
    g.add(K.mesh(new T.BoxGeometry(2.3, .9, 2.9), m(c), 0, 1.35, 0));
    g.add(K.mesh(new T.BoxGeometry(1.9, .8, 2.5), m(0xfff9db), 0, 1.5, 0));
    g.add(K.mesh(new T.BoxGeometry(.3, .2, .8), m(0x343a40), 0, .7, -1.8));
    [-.9, .9].forEach(z => [-1.2, 1.2].forEach(x => g.add(wheel(x, z, .45))));
    return g;
  }
  function tree(x, z) { const g = new T.Group(); g.add(K.mesh(new T.CylinderGeometry(.25, .35, 2, 6), K.mat(0x8a5a2b), 0, 1, 0)); g.add(K.mesh(new T.ConeGeometry(1.6, 3.4, 7), K.mat([0x2f9e44, 0x40c057, 0x37b24d][Math.random() * 3 | 0]), 0, 3.4, 0)); g.position.set(x, 0, z); return g; }
  function house(x, z) { const g = new T.Group(), c = [0xfff3bf, 0xffe3e3, 0xe7f5ff][Math.random() * 3 | 0]; g.add(K.mesh(new T.BoxGeometry(3, 2.4, 3), K.mat(c), 0, 1.2, 0)); const roof = K.mesh(new T.ConeGeometry(2.5, 1.6, 4), K.mat(0xe03131), 0, 3.2, 0); roof.rotation.y = Math.PI / 4; g.add(roof); g.add(K.mesh(new T.BoxGeometry(.7, 1.2, .1), K.mat(0x8a5a2b), 0, .6, 1.52)); g.position.set(x, 0, z); return g; }
  function hill(x, z) { const h = K.mesh(new T.SphereGeometry(8 + Math.random() * 6, 10, 8), K.mat(0x8ce99a), x, -3, z); h.scale.y = .5; return h; }
  function flowerSprite(x, z) { const s = K.emoji(['🌼', '🌷', '🌸', '🌻'][Math.random() * 4 | 0], 1.2); s.position.set(x, .6, z); return s; }
  function placeDecor(o, z) { const side = Math.random() < .5 ? -1 : 1; o.position.x = side * (o.userData.near ? 3.5 + Math.random() * 3 : 9 + Math.random() * 25); o.position.z = z; }
  function makeStation(i) {
    const g = new T.Group(), [k, e, n] = ST[i];
    g.add(K.mesh(new T.BoxGeometry(3, .9, 7), K.mat(0xced4da), -3.4, .45, 0));
    g.add(K.mesh(new T.BoxGeometry(3.4, .12, 7.4), K.mat(0xfa5252), -3.4, .95, 0));
    g.add(K.mesh(new T.CylinderGeometry(.08, .08, 3, 6), K.mat(0x495057), -4.6, 2.4, -2.6));
    const sign = K.word(n, '#1971c2', 4); sign.position.set(-4.6, 4.3, -2.6); g.add(sign);
    const roof = K.mesh(new T.BoxGeometry(3.6, .2, 4), K.mat(0x1c7ed6), -3.8, 4.1, 1); g.add(roof);
    [-0.6, 2.6].forEach(z => g.add(K.mesh(new T.CylinderGeometry(.1, .1, 3.1, 6), K.mat(0xffffff), -5.3, 2.5, z)));
    const a = K.emoji(e, 2.4); a.position.set(-3.2, 2.2, 0); g.add(a); g.userData = { animal: a, i };
    return g;
  }
  function puff() {
    const p = K.mesh(new T.SphereGeometry(.4, 7, 6), new T.MeshLambertMaterial({ color: 0xf1f3f5, transparent: true, opacity: .9 }), 0, 3.7, -1.5);
    p.userData.life = 0; scene.add(p); puffs.push(p);
  }

  function init() {
    T = THREE; const o = K.init($('.k3'), 0x99e9f2, 45, 140); R = o.r; scene = o.scene; cam = o.cam;
    scene.add(new T.HemisphereLight(0xffffff, 0x99cc88, .9)); const sun = new T.DirectionalLight(0xffffff, .6); sun.position.set(6, 12, 4); scene.add(sun);
    const ground = K.mesh(new T.PlaneGeometry(300, 300), K.mat(0x69db7c), 0, 0, -60); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    const bed = K.mesh(new T.BoxGeometry(3, .2, 300), K.mat(0xc9a27e), 0, .1, -60); scene.add(bed);
    [-.75, .75].forEach(x => scene.add(K.mesh(new T.BoxGeometry(.15, .2, 300), K.mat(0xadb5bd), x, .3, -60)));
    for (let z = 30; z > -150; z -= 1.5) { const s = K.mesh(new T.BoxGeometry(2.4, .12, .4), K.mat(0x8a5a2b), 0, .22, z); scene.add(s); sleepers.push(s); }
    for (let i = 0; i < 26; i++) { const r = Math.random(); const ob = r < .55 ? tree(0, 0) : r < .7 ? house(0, 0) : r < .85 ? hill(0, 0) : flowerSprite(0, 0); ob.userData.near = ob.isSprite; placeDecor(ob, 20 - i * 7); scene.add(ob); decor.push(ob); }
    const sunBall = K.mesh(new T.SphereGeometry(6, 14, 10), new T.MeshBasicMaterial({ color: 0xfff3bf, fog: false }), -40, 40, -160); scene.add(sunBall);
    for (let i = 0; i < 8; i++) { const c = new T.Group(); for (let k = 0; k < 4; k++) c.add(K.mesh(new T.IcosahedronGeometry(1.4 + Math.random(), 1), K.mat(0xffffff, { emissive: 0x666666 }), k * 1.6, Math.random() * .6, 0)); c.position.set(-40 + Math.random() * 80, 18 + Math.random() * 8, -40 - Math.random() * 90); scene.add(c); }
    const L = loco(); scene.add(L); wagons = [L];
    $('.k3load').remove(); running = true; last = 0; speed = 0; phase = 'run';
    voice('tr_hi', '', 300); setTimeout(() => SND.whistle && SND.whistle(), 2200);
    raf = requestAnimationFrame(frame);
  }

  function arrive() {
    phase = 'stop'; speed = 0; const u = station.userData, [k, e, n] = ST[u.i];
    voice('tr_station', '', 0); SND.whistle && SND.whistle();
    later(() => { animalSound(k); voice('n_' + k, n, 1500); }, 900);
    later(() => {
      const w = wagon(riders); w.position.set(0, 0, wagons.length * WGAP + .4); w.scale.set(.01, .01, .01); scene.add(w); wagons.push(w); w.userData.grow = 0; SND.pop(1);
      const a = u.animal; const from = new T.Vector3(); a.getWorldPosition(from); station.remove(a); scene.add(a); a.position.copy(from);
      jumpers.push({ a, from, to: new T.Vector3(0, 2.6, w.position.z), t: 0, w });
    }, 3400);
    later(() => { riders++; $('#trn').textContent = ar(riders); voice('num' + riders, '', 0); const p = K.project(wagons[wagons.length - 1], cam); confetti(50, p.x, p.y); SND.tada(); }, 4700);
    later(() => {
      if (riders >= ST.length) { phase = 'end'; voice('tr_end', '', 300); [0, 700, 1400, 2100].forEach(t => setTimeout(() => confetti(80, Math.random() * innerWidth, innerHeight * .4), t)); setTimeout(showAgain, 3200); return; }
      phase = 'ready'; K.tip('اضغطي OK حتى يمشي القطار 🚂');
    }, 6200);
    later(() => { if (phase === 'ready') go(); }, 12000);
  }
  function go() { if (phase !== 'ready') return; phase = 'run'; voice('tr_go', '', 0); SND.whistle && SND.whistle(); stationT = 9; }
  function showAgain() { const b = document.createElement('button'); b.className = 'k3btn'; b.style.cssText = 'left:50%;top:45%;transform:translateX(-50%);background:#ffd43b'; b.textContent = '🔁 من جديد'; b.onclick = () => MODES.train3d.start(); game.appendChild(b); b.focus(); phase = 'done'; }

  function frame(t) {
    if (!running) return; const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
    if (phase === 'run') {
      speed = Math.min(RUN, speed + dt * 6); stationT -= dt;
      if (!station && stationT <= 0 && riders < ST.length) { station = makeStation(riders); station.position.z = -110; scene.add(station); }
      if (station && !station.userData.done) { const d = -station.position.z; if (d < 32) speed = Math.max(.5, RUN * Math.sqrt(Math.max(0, d) / 32)); if (d <= .15) { station.position.z = 0; arrive(); } }
    }
    if (phase === 'run' || phase === 'leave') {
      const dz = speed * dt;
      if (station && phase === 'run' && station.position.z < 0) station.position.z = Math.min(0, station.position.z + dz);
      sleepers.forEach(s => { s.position.z += dz; if (s.position.z > 30) s.position.z -= 180; });
      decor.forEach(o => { o.position.z += dz; if (o.position.z > 30) placeDecor(o, o.position.z - 182); });
      wheels.forEach(w => w.rotation.x -= dz * 1.8);
      smokeT -= dt * (speed / RUN); if (smokeT <= 0 && speed > 1) { smokeT = .25; puff(); }
    }
    // المحطة تبتعد بعد التحرك
    if (station && phase === 'run' && station.userData.done) { station.position.z += speed * dt; if (station.position.z > 40) { scene.remove(station); K.dispose(station); station = null; } }
    if (phase === 'ready' || phase === 'stop') { if (station) station.userData.done = true; }
    puffs.forEach(p => { p.userData.life += dt; p.position.y += dt * 1.6; p.position.z += dt * (speed * .6 + .5); const s = 1 + p.userData.life * 1.1; p.scale.set(s, s, s); p.material.opacity = Math.max(0, .85 - p.userData.life * .8); });
    for (let i = puffs.length - 1; i >= 0; i--) if (puffs[i].userData.life > 1.1) { scene.remove(puffs[i]); puffs[i].geometry.dispose(); puffs[i].material.dispose(); puffs.splice(i, 1); }
    wagons.forEach(w => { if (w.userData.grow != null && w.userData.grow < 1) { w.userData.grow = Math.min(1, w.userData.grow + dt * 2.5); const s = w.userData.grow; w.scale.set(s, s, s); } });
    for (let i = jumpers.length - 1; i >= 0; i--) { const j = jumpers[i]; j.t = Math.min(1, j.t + dt * .9); const p = j.from.clone().lerp(j.to, j.t); p.y += Math.sin(j.t * Math.PI) * 4; j.a.position.copy(p); if (j.t >= 1) { scene.remove(j.a); j.w.add(j.a); j.a.position.set(0, 2.6, 0); j.w.userData.rider = j.a; jumpers.splice(i, 1); } }
    wagons.forEach((w, i) => { const r = w.userData.rider; if (r) r.position.y = 2.5 + Math.abs(Math.sin(t / 300 + i)) * (speed > 1 ? .35 : .15); });
    const bob = speed > 1 ? Math.sin(t / 90) * .03 : 0; wagons.forEach((w, i) => w.position.y = bob * (i % 2 ? 1 : -1));
    const tail = wagons.length * WGAP; camZ += ((tail * .45 + 3) - camZ) * Math.min(1, dt * 1.5);
    cam.position.set(11 + wagons.length * .5, 6.5 + wagons.length * .25, camZ + 4); cam.lookAt(0, 1.6, camZ - 4);
    R.render(scene, cam); raf = requestAnimationFrame(frame);
  }
  addEventListener('resize', () => { if (!R) return; R.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); });

  MODES.train3d = {
    noTap: true, nav: false,
    start() {
      MODES.train3d.stop(); A.setBody('#99e9f2'); riders = 0; wagons = []; decor = []; sleepers = []; wheels = []; puffs = []; jumpers = []; station = null; stationT = 6; camZ = 4;
      game.innerHTML = `<div class="k3"></div><div class="k3load">جاري التحميل… 🚂</div><div class="k3hud"><span class="emo">🚃</span><b id="trn">٠</b>/${ar(ST.length)}</div><div class="k3tip" id="k3tip">القطار يمشي ويوقف في المحطات… كل محطة يركب صديق جديد 🚂 اضغطي OK للصفارة</div>`;
      game.addEventListener('pointerdown', () => { if (phase === 'ready') go(); else if (phase === 'run') SND.whistle && SND.whistle(); });
      K.load(init, () => { const l = $('.k3load'); if (l) l.textContent = 'تعذّر تحميل الرسومات'; });
    },
    key(k) {
      if (phase === 'done') { const b = game.querySelector('.k3btn'); if (b && (k === 'Enter' || k === ' ')) b.click(); return; }
      if (k === 'Enter' || k === ' ' || k === 'ArrowUp' || k === 'ArrowLeft' || k === 'ArrowRight') { if (phase === 'ready') go(); else if (phase === 'run') SND.whistle && SND.whistle(); }
    },
    stop() { clearT(); running = false; cancelAnimationFrame(raf); if (R) { R.dispose(); R.forceContextLoss && R.forceContextLoss(); R = null; } }
  };
})();
