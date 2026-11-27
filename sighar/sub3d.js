/* غوّاصة تحت البحر 3D: صوّري أصدقاء البحر وجاوبي «وين السمكة الحمرا؟» */
(function () {
  const A = window.APP, K = window.KIT3D; if (!A || !K || !window.MODES) return;
  const { SND, voice, confetti, game, $ } = A;
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const SEA = [['fish', '🐟', 'سمكة', 2.2], ['tropical', '🐠', 'سمكة ملوّنة', 2.2], ['turtle', '🐢', 'سلحفاة', 2.6], ['octopus', '🐙', 'أخطبوط', 2.6], ['crab', '🦀', 'سلطعون', 2, 'floor'], ['puffer', '🐡', 'سمكة منفوخة', 2.2],
    ['dolphin', '🐬', 'دلفين', 3.2], ['shrimp', '🦐', 'ربيان', 1.8], ['squid', '🦑', 'حبّار', 2.6], ['seal', '🦭', 'فقمة', 3], ['shark', '🦈', 'قرش', 3.4], ['whale', '🐳', 'حوت', 7, 'far']];
  const QC = [['red', 0xfa5252], ['blue', 0x228be6], ['yellow', 0xfcc419], ['green', 0x40c057]];
  let T, R, scene, cam, sub, prop, raf = 0, running = false, last = 0, keys = {}, objs = [], decor = [], bubbles = [], seaI = 0, spawnT = 2, questT = 22, quest = null, allDone = false;
  const pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 }, SPEED = 7, B = { x: 6, yMin: -3.6, yMax: 3 };
  let album = {}; try { album = JSON.parse(localStorage.getItem('sea-album') || '{}') || {}; } catch (e) { }
  const save = () => { try { localStorage.setItem('sea-album', JSON.stringify(album)); } catch (e) { } };

  function makeSub() {
    const g = new T.Group(), m = K.mat, y = 0xfcc419;
    const body = K.mesh(new T.CylinderGeometry(1, 1, 3, 16), m(y), 0, 0, 0); body.rotation.x = Math.PI / 2; g.add(body);
    g.add(K.mesh(new T.SphereGeometry(1, 16, 12), m(y), 0, 0, 1.5));
    g.add(K.mesh(new T.SphereGeometry(1, 16, 12), new T.MeshLambertMaterial({ color: 0xa5d8ff, transparent: true, opacity: .55 }), 0, 0, -1.5));
    const win = K.mesh(new T.CylinderGeometry(.62, .62, .2, 16), m(0xf59f00), .93, .15, -.35); win.rotation.z = Math.PI / 2; g.add(win);
    const glass = K.mesh(new T.CylinderGeometry(.52, .52, .24, 16), new T.MeshLambertMaterial({ color: 0xd0ebff, transparent: true, opacity: .35 }), .97, .15, -.35); glass.rotation.z = Math.PI / 2; g.add(glass);
    const head = K.monkeyHead(1); head.position.set(.62, .12, -.35); head.rotation.y = -Math.PI / 2; g.add(head);
    g.add(K.mesh(new T.BoxGeometry(.9, .8, 1.3), m(0xfab005), 0, 1.15, .2));
    g.add(K.mesh(new T.CylinderGeometry(.09, .09, .9, 6), m(0x868e96), 0, 1.9, .5)); g.add(K.mesh(new T.BoxGeometry(.18, .18, .45), m(0x868e96), 0, 2.3, .35));
    [.75].forEach(z => [-1, 1].forEach(x => { const p = K.mesh(new T.CylinderGeometry(.28, .28, .12, 12), m(0x74c0fc, { emissive: 0x1864ab }), x * .97, .15, z); p.rotation.z = Math.PI / 2; g.add(p); }));
    [-1, 1].forEach(x => g.add(K.mesh(new T.BoxGeometry(.9, .12, .6), m(0xf59f00), x * 1, -.3, 1.6)));
    g.add(K.mesh(new T.BoxGeometry(.12, .9, .6), m(0xf59f00), 0, .4, 2.2));
    prop = new T.Group(); prop.position.set(0, 0, 2.55); [0, 1, 2].forEach(i => { const b = K.mesh(new T.BoxGeometry(.18, .9, .08), m(0x495057)); b.rotation.z = i * Math.PI / 1.5; prop.add(b); }); g.add(prop);
    [-.45, .45].forEach(x => g.add(K.mesh(new T.SphereGeometry(.14, 8, 6), new T.MeshBasicMaterial({ color: 0xfff3bf }), x, -.55, -1.3)));
    return g;
  }
  function seaweed() { const g = new T.Group(); const n = 4 + Math.random() * 4 | 0; for (let i = 0; i < n; i++) { const s = K.mesh(new T.BoxGeometry(.35, 1, .12), K.mat(i % 2 ? 0x2f9e44 : 0x40c057), 0, .5 + i * .95, 0); g.add(s); } g.userData.sway = Math.random() * 6; return g; }
  function coral() { const g = new T.Group(), c = [0xff8787, 0xffa94d, 0xf783ac, 0xda77f2][Math.random() * 4 | 0]; for (let i = 0; i < 5; i++) { const b = K.mesh(new T.CylinderGeometry(.12, .2, 1 + Math.random() * 1.5, 6), K.mat(c), (Math.random() - .5) * 1.4, .6, (Math.random() - .5) * 1.4); b.rotation.z = (Math.random() - .5) * .8; g.add(b); g.add(K.mesh(new T.SphereGeometry(.22, 6, 5), K.mat(c), b.position.x + Math.sin(-b.rotation.z) * .6, 1.4 + Math.random() * .6, b.position.z)); } return g; }
  function rock() { const r = K.mesh(new T.DodecahedronGeometry(.8 + Math.random() * 1.4, 0), K.mat(0x868e96)); r.scale.y = .6; return r; }
  function placeDecor(o, z) { const side = Math.random() < .5 ? -1 : 1; o.position.set(side * (2 + Math.random() * 22), -6, z); }
  function fishMesh(col) {
    const g = new T.Group(); const b = K.mesh(new T.SphereGeometry(.8, 12, 10), K.mat(col)); b.scale.set(1.3, .9, .6); g.add(b);
    const tail = K.mesh(new T.ConeGeometry(.6, .9, 4), K.mat(col), 1.3, 0, 0); tail.rotation.z = Math.PI / 2; g.add(tail); g.userData.tail = tail;
    g.add(K.mesh(new T.SphereGeometry(.2, 8, 6), K.mat(0xffffff), -.7, .2, .38)); g.add(K.mesh(new T.SphereGeometry(.1, 6, 5), K.mat(0x1d1d1d), -.78, .2, .5));
    g.add(K.mesh(new T.SphereGeometry(.2, 8, 6), K.mat(0xffffff), -.7, .2, -.38)); return g;
  }

  function init() {
    T = THREE; const o = K.init($('.k3'), 0x1971c2, 8, 62); R = o.r; scene = o.scene; cam = o.cam;
    scene.add(new T.HemisphereLight(0xc5f6fa, 0x1864ab, 1)); const l = new T.DirectionalLight(0xffffff, .5); l.position.set(0, 10, 3); scene.add(l);
    const bed = K.mesh(new T.PlaneGeometry(200, 200), K.mat(0xf4d28a), 0, -6, -60); bed.rotation.x = -Math.PI / 2; scene.add(bed);
    const surf = K.mesh(new T.PlaneGeometry(200, 200), new T.MeshBasicMaterial({ color: 0x74c0fc, transparent: true, opacity: .5, side: T.DoubleSide, fog: false }), 0, 9, -60); surf.rotation.x = Math.PI / 2; scene.add(surf);
    for (let i = 0; i < 34; i++) { const r = Math.random(), d = r < .45 ? seaweed() : r < .75 ? coral() : rock(); placeDecor(d, 10 - i * 4); scene.add(d); decor.push(d); }
    sub = makeSub(); scene.add(sub);
    $('.k3load').remove(); running = true; last = 0; voice('sb_hi', '', 300); updHud();
    raf = requestAnimationFrame(frame);
  }
  function updHud() { const n = SEA.filter(s => album[s[0]]).length; const el = $('#sbn'); if (el) el.textContent = ar(n); return n; }
  function spawnCreature() {
    const [k, e, name, size, where] = SEA[seaI++ % SEA.length]; const sp = K.emoji(e, size);
    const x = where === 'far' ? (Math.random() < .5 ? -9 : 9) : (Math.random() * 2 - 1) * (B.x - 1), y = where === 'floor' ? -5 : where === 'far' ? 1 : B.yMin + Math.random() * (B.yMax - B.yMin);
    sp.position.set(x, y, -70); sp.userData = { kind: 'sea', size, k, name, r: where === 'far' ? 5 : Math.max(2.4, size * .9), ph: Math.random() * 6, y0: y }; scene.add(sp); objs.push(sp);
  }
  function startQuest() {
    const order = [...QC].sort(() => Math.random() - .5).slice(0, 3), target = order[Math.random() * 3 | 0];
    quest = { target: target[0], fish: [] };
    order.forEach(([c, col], i) => { const f = fishMesh(col); f.position.set((i - 1) * 4, Math.max(B.yMin, Math.min(B.yMax, pos.y)), -60); f.userData = { kind: 'qfish', c, r: 1.7, ph: i }; scene.add(f); objs.push(f); quest.fish.push(f); });
    voice('q_fish_' + target[0], '', 0); K.tip({ red: 'وين السمكة الحمرا؟ 🔴', blue: 'وين السمكة الزرقا؟ 🔵', yellow: 'وين السمكة الصفرا؟ 🟡', green: 'وين السمكة الخضرا؟ 🟢' }[target[0]]);
  }
  function hit(o, i) {
    const u = o.userData, p = K.project(o, cam);
    if (u.kind === 'sea') {
      u.got = true; K.flash(); SND.pop(2); voice('n_' + u.k, u.name, 350); confetti(30, p.x, p.y);
      const isNew = !album[u.k]; album[u.k] = 1; save(); const n = updHud();
      if (isNew) { SND.chime(); if (n === SEA.length && !allDone) { allDone = true; setTimeout(() => { voice('sb_all', '', 0); confetti(120); SND.tada(); }, 2200); } }
      u.spin = 1;
    } else if (u.kind === 'qfish' && quest) {
      if (u.c === quest.target) { u.got = true; SND.tada(); voice('yay' + (1 + Math.random() * 3 | 0), '', 300); confetti(70, p.x, p.y); quest.fish.forEach(f => { f.userData.flee = f === o ? 0 : 1; }); u.happy = 1; quest = null; questT = 24; }
      else if (!u.wrong) { u.wrong = true; u.flee = 1; SND.boing(); voice('again', '', 0); setTimeout(() => quest && voice('q_fish_' + quest.target, '', 0), 1500); }
    }
  }

  function frame(t) {
    if (!running) return; const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
    const ax = (keys.R ? 1 : 0) - (keys.L ? 1 : 0), ay = (keys.U ? 1 : 0) - (keys.D ? 1 : 0);
    vel.x += (ax * 6 - vel.x) * Math.min(1, dt * 3); vel.y += (ay * 4.5 - vel.y) * Math.min(1, dt * 3);
    pos.x = Math.max(-B.x, Math.min(B.x, pos.x + vel.x * dt)); pos.y = Math.max(B.yMin, Math.min(B.yMax, pos.y + vel.y * dt));
    sub.position.set(pos.x, pos.y + Math.sin(t / 700) * .15, 0); sub.rotation.z = -vel.x * .06; sub.rotation.x = vel.y * .06; prop.rotation.z += dt * 12;
    cam.position.set(pos.x * .5 + 4.6, pos.y * .5 + 1.8, 7.5); cam.lookAt(pos.x * .7 + .4, pos.y * .6, -5);
    const dz = SPEED * dt;
    spawnT -= dt; if (spawnT <= 0) { spawnT = 2.6; spawnCreature(); }
    if (!quest) { questT -= dt; if (questT <= 0) startQuest(); }
    decor.forEach(d => { d.position.z += dz; if (d.userData.sway != null) d.rotation.z = Math.sin(t / 900 + d.userData.sway) * .12; if (d.position.z > 12) placeDecor(d, d.position.z - 136); });
    if (Math.random() < dt * 4) { const b = K.mesh(new T.SphereGeometry(.12 + Math.random() * .12, 6, 5), new T.MeshBasicMaterial({ color: 0xe7f5ff, transparent: true, opacity: .7 }), (Math.random() - .5) * 30, -6, -10 - Math.random() * 40); scene.add(b); bubbles.push(b); }
    if (Math.random() < dt * 3) { const b = K.mesh(new T.SphereGeometry(.1, 6, 5), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 }), pos.x + (Math.random() - .5) * .4, pos.y, 2.6); scene.add(b); bubbles.push(b); }
    for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; b.position.y += dt * 2.2; b.position.z += dz; b.position.x += Math.sin(t / 300 + i) * dt * .3; if (b.position.y > 9 || b.position.z > 12) { scene.remove(b); b.geometry.dispose(); b.material.dispose(); bubbles.splice(i, 1); } }
    for (let i = objs.length - 1; i >= 0; i--) {
      const o = objs[i], u = o.userData; o.position.z += dz;
      if (u.kind === 'sea') { o.position.y = u.y0 + Math.sin(t / 800 + u.ph) * .4; if (u.spin) { u.spin += dt; const s = 1 + Math.sin(Math.min(u.spin, 1) * Math.PI) * .5; o.material.rotation = u.spin * 6; o.scale.set(s * u.size, s * u.size, 1); } }
      if (u.kind === 'qfish') { u.tail = o.userData.tail; if (o.userData.tail) o.userData.tail.rotation.y = Math.sin(t / 120 + u.ph) * .6; o.position.y += Math.sin(t / 600 + u.ph) * dt * .5; if (u.flee) { o.position.x += (o.position.x >= 0 ? 1 : -1) * dt * 8; o.position.y += dt * 2; } if (u.happy) { o.rotation.y += dt * 8; o.position.y += dt; } }
      if (!u.got && !u.flee && Math.abs(o.position.z) < 1.8) { const dx = o.position.x - pos.x, dy = o.position.y - pos.y; if (dx * dx + dy * dy < u.r * u.r) hit(o, i); }
      if (o.position.z > 12) { if (u.kind === 'qfish' && quest && quest.fish.includes(o)) { quest = null; questT = 8; } scene.remove(o); K.dispose(o); objs.splice(i, 1); }
    }
    R.render(scene, cam); raf = requestAnimationFrame(frame);
  }
  addEventListener('resize', () => { if (!R) return; R.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); });
  const KM = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' };
  addEventListener('keyup', e => { if (KM[e.key]) keys[KM[e.key]] = false; });
  addEventListener('blur', () => { keys = {}; });

  MODES.sub3d = {
    noTap: true, nav: false,
    start() {
      MODES.sub3d.stop(); A.setBody('#1971c2'); objs = []; decor = []; bubbles = []; keys = {}; pos.x = 0; pos.y = 0; vel.x = vel.y = 0; seaI = 0; spawnT = 1.5; questT = 20; quest = null; allDone = SEA.every(s => album[s[0]]);
      game.innerHTML = `<div class="k3"></div><div class="k3load">جاري التحميل… 🌊</div><div class="k3hud"><span class="emo">📸</span><b id="sbn">٠</b>/${ar(SEA.length)}</div><button class="k3btn" id="sbAlb" style="top:2vh;left:auto;right:8vw">📒</button>
        <div class="k3pad"><span></span><button data-k="U">▲</button><span></span><button data-k="L">◀</button><span></span><button data-k="R">▶</button><span></span><button data-k="D">▼</button><span></span></div>
        <div class="k3tip" id="k3tip">حرّكي الغوّاصة بالأسهم، وقرّبي من حيوانات البحر حتى تصوّريهم 📸</div>`;
      game.querySelectorAll('.k3pad button').forEach(b => { const k = b.dataset.k; b.addEventListener('pointerdown', e => { e.preventDefault(); keys[k] = true; }); ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, () => { keys[k] = false; })); });
      $('#sbAlb').onclick = showAlbum;
      K.load(init, () => { const l = $('.k3load'); if (l) l.textContent = 'تعذّر تحميل الرسومات'; });
    },
    key(k) { const al = $('#sbAlbum'); if (al) { if (k === 'Enter' || k === ' ') al.remove(); return; } if (KM[k]) keys[KM[k]] = true; },
    stop() { running = false; cancelAnimationFrame(raf); keys = {}; if (R) { R.dispose(); R.forceContextLoss && R.forceContextLoss(); R = null; } }
  };
  function showAlbum() {
    const d = document.createElement('div'); d.id = 'sbAlbum'; d.style.cssText = 'position:fixed;inset:0;z-index:6;background:rgba(11,61,120,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto';
    d.innerHTML = `<div style="font-size:min(8vh,6vw);color:#fff;margin-bottom:3vh">ألبوم أصدقاء البحر 📸</div><div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:2vh 1.6vw;width:84vw">${SEA.map(s => `<div style="background:${album[s[0]] ? '#fff' : 'rgba(255,255,255,.25)'};border-radius:2.6vh;padding:1.6vh 0;text-align:center"><div class="emo" style="font-size:min(10vh,7vw);${album[s[0]] ? '' : 'filter:brightness(0) opacity(.35)'}">${s[1]}</div><div style="font-size:min(3.2vh,2.4vw);color:${album[s[0]] ? '#333' : '#dee2e6'}">${album[s[0]] ? s[2] : '؟'}</div></div>`).join('')}</div><div style="color:#fff;margin-top:3vh;font-size:min(3.4vh,3vw)">اضغطي للرجوع</div>`;
    d.onclick = () => d.remove(); game.appendChild(d);
  }
})();
