/* تجربة ثلاثية الأبعاد: طيارة القرد فوق الكويت — نجوم وبالونات وأبراج الكويت وجامع ونخيل */
(function () {
  const A = window.APP; if (!A || !window.MODES) return;
  const { SND, confetti, voice, game, $ } = A;
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const css = `.p3{position:fixed;inset:0;z-index:1}.p3 canvas{display:block;width:100%;height:100%}
  .p3hud{position:fixed;top:2vh;left:2vw;z-index:4;background:rgba(255,255,255,.9);border-radius:999px;padding:.6vh 1.8vw;font-size:min(5vh,4vw);display:flex;gap:.8vw;align-items:center;box-shadow:0 .5vh 0 rgba(0,0,0,.12)}
  #p3abc{position:fixed;top:10.5vh;left:0;right:0;display:flex;justify-content:center;gap:.4vw;z-index:4;direction:ltr;font:800 min(2.6vh,2vw) Arial,sans-serif}
  #p3abc span{width:min(3.6vh,2.8vw);height:min(3.6vh,2.8vw);border-radius:50%;background:rgba(255,255,255,.55);color:#868e96;display:flex;align-items:center;justify-content:center}
  #p3abc span.d{background:#69db7c;color:#fff}#p3abc span.h{background:#ffd43b;color:#333;transform:scale(1.35)}
  .p3load{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-size:6vh;color:#fff;z-index:3}
  .p3ctrl{position:fixed;bottom:3vh;left:3vw;z-index:4;display:none;grid-template-columns:repeat(3,min(11vh,13vw));grid-template-rows:repeat(3,min(11vh,13vw));gap:.6vh;direction:ltr}
  @media (pointer:coarse){.p3ctrl{display:grid}}
  .p3ctrl button{pointer-events:auto;border:none;border-radius:2vh;background:rgba(255,255,255,.45);color:#fff;font-size:min(5vh,6vw);touch-action:none}
  .p3tip{position:fixed;bottom:4vh;left:0;right:0;text-align:center;color:#fff;font-size:min(3.6vh,3.4vw);text-shadow:0 .3vh 0 rgba(0,0,0,.3);z-index:4;animation:fadeTip 6s forwards}
  @keyframes fadeTip{0%,85%{opacity:1}100%{opacity:0}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const WORDS = [["A", [["Apple", "🍎"], ["Ant", "🐜"], ["Airplane", "✈️"]]], ["B", [["Ball", "⚽"], ["Banana", "🍌"], ["Bear", "🐻"]]], ["C", [["Cat", "🐱"], ["Car", "🚗"], ["Cake", "🎂"]]], ["D", [["Dog", "🐶"], ["Duck", "🦆"], ["Door", "🚪"]]], ["E", [["Elephant", "🐘"], ["Egg", "🥚"], ["Ear", "👂"]]], ["F", [["Fish", "🐟"], ["Frog", "🐸"], ["Flower", "🌸"]]], ["G", [["Giraffe", "🦒"], ["Grapes", "🍇"], ["Gift", "🎁"]]], ["H", [["Horse", "🐴"], ["Hat", "🎩"], ["House", "🏠"]]], ["I", [["Ice cream", "🍦"], ["Ice", "🧊"], ["Island", "🏝️"]]], ["J", [["Juice", "🧃"], ["Jacket", "🧥"], ["Jeans", "👖"]]], ["K", [["Kite", "🪁"], ["Key", "🔑"], ["Kangaroo", "🦘"]]], ["L", [["Lion", "🦁"], ["Lemon", "🍋"], ["Leaf", "🍃"]]], ["M", [["Monkey", "🐒"], ["Moon", "🌙"], ["Milk", "🥛"]]], ["N", [["Nose", "👃"], ["Nut", "🥜"], ["Night", "🌃"]]], ["O", [["Orange", "🍊"], ["Owl", "🦉"], ["Octopus", "🐙"]]], ["P", [["Panda", "🐼"], ["Pizza", "🍕"], ["Pig", "🐷"]]], ["Q", [["Queen", "👸"], ["Question", "❓"], ["Quiet", "🤫"]]], ["R", [["Rabbit", "🐰"], ["Rainbow", "🌈"], ["Rocket", "🚀"]]], ["S", [["Sun", "☀️"], ["Star", "⭐"], ["Snake", "🐍"]]], ["T", [["Tiger", "🐯"], ["Tree", "🌳"], ["Train", "🚂"]]], ["U", [["Umbrella", "☂️"], ["Unicorn", "🦄"], ["Up", "⬆️"]]], ["V", [["Van", "🚐"], ["Violin", "🎻"], ["Volcano", "🌋"]]], ["W", [["Whale", "🐳"], ["Watermelon", "🍉"], ["Watch", "⌚"]]], ["X", [["Fox", "🦊"], ["Box", "📦"], ["Six", "6️⃣"]]], ["Y", [["Yo-yo", "🪀"], ["Yellow", "💛"], ["Yacht", "⛵"]]], ["Z", [["Zebra", "🦓"], ["Zero", "0️⃣"], ["Zipper", "🤐"]]]];
  let letterI = 0; try { letterI = +(localStorage.getItem('plane-letter') || 0) % 26; } catch (e) { }
  let phase = 'fly', flyT = 0, speed = 20, island = null, gTimers = [], sprites = [];
  let T, renderer, scene, camera, plane, prop, raf = 0, running = false, last = 0, keys = {}, objs = [], score = 0, spawnT = { star: 0, balloon: 0, cloud: 0, land: 0 }, landI = 0, bounds = { x: 7, yMin: -2.5, yMax: 4.5 };
  const pos = { x: 0, y: 1 }, vel = { x: 0, y: 0 }, SPEED = 20, LAND_Y = -13.1;

  function loadThree(cb) { if (window.THREE) return cb(); const s = document.createElement('script'); s.src = 'three.min.js'; s.onload = cb; s.onerror = () => { const l = $('.p3load'); if (l) l.textContent = 'تعذّر تحميل الرسومات'; }; document.head.appendChild(s); }
  const mat = (c, o) => new T.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, o || {}));
  const mesh = (g, m, x, y, z) => { const o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };

  function makePlane() {
    const g = new T.Group();
    const body = mesh(new T.CylinderGeometry(.55, .35, 3.4, 10), mat(0xfa5252)); body.rotation.x = Math.PI / 2; g.add(body);
    const nose = mesh(new T.SphereGeometry(.56, 10, 8), mat(0xfa5252), 0, 0, -1.7); g.add(nose);
    const wing = mesh(new T.BoxGeometry(5.2, .14, 1.1), mat(0xffd43b), 0, -.05, -.3); g.add(wing);
    const tailW = mesh(new T.BoxGeometry(1.8, .1, .6), mat(0xffd43b), 0, .1, 1.5); g.add(tailW);
    const fin = mesh(new T.BoxGeometry(.12, .9, .7), mat(0xffd43b), 0, .5, 1.5); g.add(fin);
    prop = new T.Group(); prop.position.set(0, 0, -2.3);
    prop.add(mesh(new T.BoxGeometry(2.1, .18, .06), mat(0x495057))); prop.add(mesh(new T.SphereGeometry(.18, 8, 6), mat(0x868e96))); g.add(prop);
    // القرد الطيار
    const head = mesh(new T.SphereGeometry(.42, 12, 10), mat(0x8d5524), 0, .78, -.2); g.add(head);
    const face = mesh(new T.SphereGeometry(.3, 12, 10), mat(0xf1c27d), 0, .74, -.42); face.scale.z = .6; g.add(face);
    [-1, 1].forEach(s => { g.add(mesh(new T.SphereGeometry(.15, 8, 6), mat(0x8d5524), s * .42, .84, -.2)); g.add(mesh(new T.SphereGeometry(.06, 6, 5), mat(0x1d1d1d), s * .11, .82, -.6)); });
    const scarf = mesh(new T.TorusGeometry(.32, .07, 6, 12), mat(0x4dabf7), 0, .45, -.2); scarf.rotation.x = Math.PI / 2; g.add(scarf);
    [-1, 1].forEach(s => g.add(mesh(new T.CylinderGeometry(.12, .12, .35, 8), mat(0x343a40), s * .5, -.6, -.6)));
    return g;
  }
  function star() {
    const sh = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .38 : .9, a = Math.PI / 2 + i * Math.PI / 5; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    const o = mesh(new T.ExtrudeGeometry(sh, { depth: .3, bevelEnabled: false }), mat(0xffd43b, { emissive: 0x8a6d00 })); o.userData = { kind: 'star', r: 1.6, spin: 2.5 }; return o;
  }
  const BCOL = [0xff6b6b, 0x4dabf7, 0x69db7c, 0xcc5de8, 0xffa94d, 0xf783ac];
  function balloon() {
    const g = new T.Group(); const b = mesh(new T.SphereGeometry(.85, 12, 10), mat(BCOL[Math.random() * BCOL.length | 0])); b.scale.y = 1.2; g.add(b);
    g.add(mesh(new T.ConeGeometry(.16, .25, 6), b.material, 0, -1.05, 0));
    const s = mesh(new T.CylinderGeometry(.02, .02, 1.8, 4), mat(0xdee2e6), 0, -2, 0); g.add(s); g.userData = { kind: 'balloon', r: 1.8, bob: Math.random() * 6 }; return g;
  }
  function cloud() {
    const g = new T.Group(); const m = mat(0xffffff, { emissive: 0x555555 });
    for (let i = 0; i < 5; i++) { const s = mesh(new T.IcosahedronGeometry(1 + Math.random() * 1.2, 1), m, (i - 2) * 1.3, Math.random() * .6, Math.random() * .8); g.add(s); }
    g.userData = { kind: 'deco' }; return g;
  }
  function kuwaitTowers() {
    const g = new T.Group(), w = mat(0xe9ecef), b1 = mat(0x1c7ed6), b2 = mat(0x15aabf);
    g.add(mesh(new T.CylinderGeometry(.35, .6, 22, 10), w, 0, 11, 0)); g.add(mesh(new T.ConeGeometry(.35, 4, 10), w, 0, 24, 0));
    g.add(mesh(new T.SphereGeometry(3, 14, 10), b1, 0, 12, 0)); g.add(mesh(new T.SphereGeometry(1.6, 12, 9), b2, 0, 17.5, 0));
    g.add(mesh(new T.CylinderGeometry(.3, .5, 15, 10), w, 4.5, 7.5, 1)); g.add(mesh(new T.SphereGeometry(2.1, 12, 9), b1, 4.5, 9.5, 1));
    g.add(mesh(new T.CylinderGeometry(.15, .35, 10, 8), w, -3.4, 5, -1));
    g.userData = { kind: 'deco' }; return g;
  }
  function mosque() {
    const g = new T.Group(), w = mat(0xfff9db), gold = mat(0xfab005), gr = mat(0x2b8a3e);
    g.add(mesh(new T.BoxGeometry(10, 4, 7), w, 0, 2, 0));
    const dome = mesh(new T.SphereGeometry(3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), gold, 0, 4, 0); g.add(dome); g.add(mesh(new T.ConeGeometry(.25, 1.4, 6), gold, 0, 7.6, 0));
    [-6, 6].forEach(x => { g.add(mesh(new T.CylinderGeometry(.5, .6, 11, 8), w, x, 5.5, 2)); g.add(mesh(new T.ConeGeometry(.75, 2, 8), gr, x, 12, 2)); g.add(mesh(new T.CylinderGeometry(.85, .85, .4, 8), w, x, 9, 2)); });
    [-3, 0, 3].forEach(x => g.add(mesh(new T.BoxGeometry(1.4, 2.4, .2), mat(0x8a5a2b), x, 1.2, 3.55)));
    g.userData = { kind: 'deco' }; return g;
  }
  function palm(x, z) {
    const g = new T.Group(); const tr = mesh(new T.CylinderGeometry(.22, .35, 6, 6), mat(0x8a5a2b), 0, 3, 0); tr.rotation.z = .1; g.add(tr);
    for (let i = 0; i < 6; i++) { const l = mesh(new T.BoxGeometry(3.2, .1, .7), mat(0x40c057), 0, 6, 0); l.rotation.y = i * Math.PI / 3; l.rotation.z = -.35; l.position.x = Math.cos(i * Math.PI / 3) * 1.2; l.position.z = -Math.sin(i * Math.PI / 3) * 1.2; g.add(l); }
    g.position.set(x, 0, z); return g;
  }
  function palmGroup() { const g = new T.Group(); [[0, 0], [4, 2], [-3, 3], [2, -3]].forEach(([x, z]) => g.add(palm(x, z))); g.userData = { kind: 'deco' }; return g; }
  function houses() { const g = new T.Group(); [[0, 0, 0xfff3bf], [5, 1, 0xffe8cc], [-5, -1, 0xe7f5ff]].forEach(([x, z, c]) => { g.add(mesh(new T.BoxGeometry(3.4, 3, 3.4), mat(c), x, 1.5, z)); g.add(mesh(new T.BoxGeometry(3.6, .4, 3.6), mat(0xced4da), x, 3.2, z)); g.add(mesh(new T.BoxGeometry(.8, 1.2, .1), mat(0x4dabf7), x, 1.6, z + 1.75)); }); g.userData = { kind: 'deco' }; return g; }


  function canvasTex(draw, w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h); const t = new T.CanvasTexture(c); t.needsUpdate = true; return t; }
  function emojiSprite(e, size) { const t = canvasTex((x, w, h) => { x.font = (h * .8) + 'px "Noto Color Emoji","Apple Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, w / 2, h * .54); }, 256, 256); const sp = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true })); sp.scale.set(size, size, 1); return sp; }
  function wordSprite(txt, col) { const t = canvasTex((x, w, h) => { x.font = '800 ' + (h * .62) + 'px Tajawal,Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = h * .14; x.strokeStyle = '#fff'; x.strokeText(txt, w / 2, h / 2); x.fillStyle = col || '#e8590c'; x.fillText(txt, w / 2, h / 2); }, 512, 128); const sp = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true })); sp.scale.set(6, 1.5, 1); return sp; }
  const LCOL = ['#fa5252', '#fd7e14', '#fab005', '#40c057', '#15aabf', '#228be6', '#7950f2', '#e64980'];
  function bigLetter(L, col) {
    const g = new T.Group(); const txt = L + L.toLowerCase();
    const mk = (fill, stroke) => canvasTex((x, w, h) => { x.font = '900 ' + (h * .78) + 'px Arial Black,Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; if (stroke) { x.lineWidth = h * .08; x.strokeStyle = stroke; x.strokeText(txt, w / 2, h * .55); } x.fillStyle = fill; x.fillText(txt, w / 2, h * .55); }, 512, 256);
    const back = mk('#343a40'), front = mk(col, '#fff');
    for (let i = 0; i < 7; i++) { const m = new T.Mesh(new T.PlaneGeometry(12, 6), new T.MeshBasicMaterial({ map: i === 6 ? front : back, transparent: true, depthWrite: i === 6 })); m.position.z = i * .12; g.add(m); }
    return g;
  }
  function makeIsland(i) {
    const [L, ws] = WORDS[i], col = LCOL[i % LCOL.length], g = new T.Group();
    g.add(mesh(new T.CylinderGeometry(15, 16, 2.4, 20), mat(0xf4d28a), 0, -15, -4));
    g.add(mesh(new T.CylinderGeometry(13.5, 14, 2.6, 20), mat(0x69db7c), 0, -14.9, -4));
    g.add(mesh(new T.BoxGeometry(4, .1, 26), mat(0x868e96), 0, -13.55, 2));
    for (let z = -9; z < 14; z += 4) g.add(mesh(new T.BoxGeometry(.4, .12, 1.6), mat(0xffffff), 0, -13.48, z));
    const letter = bigLetter(L, col); letter.position.set(0, -6, -15); g.add(letter); g.userData.letter = letter;
    [[-9, -12], [9, -12], [-11, 2], [11, 3]].forEach(([x, z]) => { const pm = palm(x, z); pm.position.y = -13.6; pm.scale.set(.8, .8, .8); g.add(pm); });
    g.userData.items = ws.map(([w, e], k) => { const it = new T.Group(); const sp = emojiSprite(e, 5); sp.position.y = 3.6; it.add(sp); const lb = wordSprite(w, col); lb.position.y = .9; it.add(lb); it.position.set([-7.5, 0, 7.5][k], -13.4 + (k === 1 ? 1.2 : 0), k === 1 ? -11 : -6); it.scale.set(.01, .01, .01); it.userData = { sp, base: 0, on: false }; g.add(it); return it; });
    g.userData = Object.assign(g.userData, { kind: 'island', L, ws, col });
    return g;
  }
  function gLater(fn, ms) { gTimers.push(setTimeout(fn, ms)); }
  function clearG() { gTimers.forEach(clearTimeout); gTimers = []; }
  function tip(txt) { const t = $('#p3tip'); if (t) { t.textContent = txt; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; } }
  function setTarget() { const el = $('#p3t'); if (el) el.textContent = WORDS[letterI][0]; document.querySelectorAll('#p3abc span').forEach((s, i) => s.className = i < letterI ? 'd' : i === letterI ? 'h' : ''); }
  function onLanded() {
    phase = 'ground'; speed = 0; const u = island.userData; voice('en_land', '', 0);
    u.items.forEach((it, k) => gLater(() => { it.userData.on = true; it.userData.t0 = performance.now(); SND.pop(1 + k * .2); voice('w_' + u.L.toLowerCase() + k, '', 150); const v = it.position.clone(); island.localToWorld(v); const p = v.project(camera); confetti(30, (p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight * .8); }, 900 + k * 2600));
    gLater(() => { u.letter.userData.jump = performance.now(); voice('en_l' + letterI, '', 0); SND.tada(); confetti(80); }, 900 + 3 * 2600);
    gLater(() => { tip('اضغطي OK أو ▲ للإقلاع ✈️'); phase = 'ready'; }, 900 + 3 * 2600 + 1800);
    gLater(() => { if (phase === 'ready') takeOff(); }, 900 + 3 * 2600 + 9000);
  }
  function takeOff() {
    if (phase !== 'ready' && phase !== 'ground') return; clearG(); phase = 'takeoff'; voice('en_off', '', 0);
    letterI = (letterI + 1) % 26; try { localStorage.setItem('plane-letter', letterI); } catch (e) { }
    gLater(() => { voice('en_go' + letterI, '', 0); tip('يلّا نطير لحرف ' + WORDS[letterI][0] + ' ✈️'); setTarget(); }, 2200);
  }

  function add(o, x, y, z) { o.position.set(x, y, z); scene.add(o); objs.push(o); }
  function spawn(dt) {
    for (const k in spawnT) spawnT[k] -= dt * speed / SPEED;
    if (speed < 3) return;
    if (phase === 'fly' && flyT > 13 && !island) { island = makeIsland(letterI); island.position.set(0, 0, -170); scene.add(island); tip('شوفي! جزيرة حرف ' + WORDS[letterI][0]); }
    if (phase !== 'fly' || island) { if (spawnT.cloud <= 0) { spawnT.cloud = .5; const side = Math.random() < .5 ? -1 : 1; add(cloud(), side * (14 + Math.random() * 12), -4 + Math.random() * 14, -140); } return; }
    if (spawnT.star <= 0) { spawnT.star = .7; add(star(), (Math.random() * 2 - 1) * bounds.x, bounds.yMin + Math.random() * (bounds.yMax - bounds.yMin), -130); }
    if (spawnT.balloon <= 0) { spawnT.balloon = 1.8; add(balloon(), (Math.random() * 2 - 1) * bounds.x, bounds.yMin + Math.random() * (bounds.yMax - bounds.yMin), -130); }
    if (spawnT.cloud <= 0) { spawnT.cloud = .5; const side = Math.random() < .5 ? -1 : 1; add(cloud(), side * (9 + Math.random() * 14), -4 + Math.random() * 14, -140); }
    if (spawnT.land <= 0) { spawnT.land = 2.2; const maker = [kuwaitTowers, palmGroup, mosque, houses, palmGroup][landI++ % 5]; const side = landI % 2 ? -1 : 1; add(maker(), side * (13 + Math.random() * 6), -16, -150); }
  }

  function init() {
    T = window.THREE;
    const wrap = $('.p3'); renderer = new T.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(1.25, window.devicePixelRatio || 1)); renderer.setSize(innerWidth, innerHeight); wrap.appendChild(renderer.domElement);
    scene = new T.Scene(); const sky = 0x8fd3ff; scene.background = new T.Color(sky); scene.fog = new T.Fog(sky, 50, 145);
    camera = new T.PerspectiveCamera(60, innerWidth / innerHeight, .1, 300);
    scene.add(new T.HemisphereLight(0xffffff, 0x88cc88, .85)); const sun = new T.DirectionalLight(0xffffff, .7); sun.position.set(5, 10, 6); scene.add(sun);
    const ground = mesh(new T.PlaneGeometry(400, 400), mat(0xe9c46a), 0, -16, -100); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    const sea = mesh(new T.PlaneGeometry(60, 400), mat(0x1c7ed6), 0, -15.9, -100); sea.rotation.x = -Math.PI / 2; scene.add(sea);
    const sunBall = mesh(new T.SphereGeometry(8, 16, 12), new T.MeshBasicMaterial({ color: 0xfff3bf, fog: false }), 40, 40, -220); scene.add(sunBall);
    plane = makePlane(); scene.add(plane);
    for (let z = -10; z > -140; z -= 12) { const side = Math.random() < .5 ? -1 : 1; add(cloud(), side * (9 + Math.random() * 14), -4 + Math.random() * 14, z); }
    [kuwaitTowers, palmGroup, mosque].forEach((mk, i) => add(mk(), (i % 2 ? 1 : -1) * 14, -16, -40 - i * 45)); landI = 3;
    $('.p3load').remove(); running = true; last = 0; raf = requestAnimationFrame(frame);
    
  }

  function frame(t) {
    if (!running) return; const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
    let ax = (keys.R ? 1 : 0) - (keys.L ? 1 : 0), ay = (keys.U ? 1 : 0) - (keys.D ? 1 : 0);
    if (phase === 'fly') flyT += dt;
    if (island) {
      island.position.z += speed * dt; const d = -island.position.z;
      if (phase === 'fly' && d < 75) { phase = 'landing'; tip('نهبط! 🛬'); }
      if (phase === 'landing') { speed = Math.max(.6, SPEED * Math.sqrt(Math.max(d, 0) / 75)); pos.x += (0 - pos.x) * Math.min(1, dt * 2); pos.y += (LAND_Y + Math.max(0, d) * .12 - pos.y) * Math.min(1, dt * 2.5); ax = ay = 0; vel.x = vel.y = 0; if (d <= .2) { island.position.z = 0; pos.y = LAND_Y; onLanded(); } }
      if (phase === 'takeoff') { speed = Math.min(SPEED, speed + dt * 9); pos.y += (1 - pos.y) * Math.min(1, dt * .9); ax = ay = 0; if (island.position.z > 40) { scene.remove(island); island = null; phase = 'fly'; flyT = 0; } }
      const now = performance.now();
      if (island) island.userData.items.forEach((it, k) => { if (!it.userData.on) return; const e = Math.min(1, (now - it.userData.t0) / 500), s = e < 1 ? e * 1.15 : 1 + Math.sin(now / 300 + k) * .04; it.scale.set(s, s, s); it.userData.sp.position.y = 3.6 + Math.abs(Math.sin(now / 350 + k)) * .6; });
      const lt = island && island.userData.letter; if (lt && lt.userData.jump) { const j = (now - lt.userData.jump) / 1000; lt.position.y = -6 + Math.max(0, Math.sin(Math.min(j, 3) * Math.PI * 2)) * 2.2 * Math.max(0, 1 - j / 3); lt.rotation.y = Math.sin(now / 900) * .25; }
    }
    if (phase === 'ground' || phase === 'ready') { ax = ay = 0; vel.x = vel.y = 0; }
    vel.x += (ax * 9 - vel.x) * Math.min(1, dt * 4); vel.y += (ay * 6 - vel.y) * Math.min(1, dt * 4);
    if (phase === 'fly') { pos.x = Math.max(-bounds.x, Math.min(bounds.x, pos.x + vel.x * dt)); pos.y = Math.max(bounds.yMin, Math.min(bounds.yMax, pos.y + vel.y * dt)); }
    plane.position.set(pos.x, pos.y + (phase === 'ground' || phase === 'ready' ? 0 : Math.sin(t / 500) * .12), 0); plane.rotation.z = -vel.x * .07; plane.rotation.x = vel.y * .05; prop.rotation.z += dt * (phase === 'ground' || phase === 'ready' ? 6 : 40);
    const gnd = phase !== 'fly'; camera.position.set(pos.x * .6, pos.y + (gnd ? 4.5 : 3), gnd ? 12 : 9); camera.lookAt(pos.x * .8, pos.y + (gnd ? 2 : .5), -6);
    spawn(dt);
    for (let i = objs.length - 1; i >= 0; i--) {
      const o = objs[i]; o.position.z += speed * dt; const u = o.userData;
      if (u.spin) o.rotation.y += u.spin * dt; if (u.bob != null) { u.bob += dt * 2; o.position.y += Math.sin(u.bob) * dt * .6; }
      if (u.r && !u.got && Math.abs(o.position.z) < 1.6) {
        const dx = o.position.x - pos.x, dy = o.position.y - pos.y;
        if (dx * dx + dy * dy < u.r * u.r) { u.got = true; score += u.kind === 'balloon' ? 3 : 1; $('#p3s').textContent = ar(score); SND.pop(u.kind === 'balloon' ? .9 : 1.5); const v = o.position.clone().project(camera); confetti(u.kind === 'balloon' ? 40 : 18, (v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight); scene.remove(o); objs.splice(i, 1); if (score % 20 === 0 || (u.kind === 'balloon' && score % 20 < 3)) voice('yay' + (1 + (score / 20 | 0) % 3), '', 0); continue; }
      }
      if (o.position.z > 12) { scene.remove(o); o.traverse(c => { if (c.geometry) c.geometry.dispose(); }); objs.splice(i, 1); }
    }
    renderer.render(scene, camera); raf = requestAnimationFrame(frame);
  }
  function onResize() { if (!renderer) return; renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  addEventListener('resize', onResize);
  const KM = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' };
  addEventListener('keyup', e => { if (KM[e.key]) keys[KM[e.key]] = false; });
  addEventListener('blur', () => { keys = {}; });

  MODES.plane3d = {
    noTap: true, nav: false,
    start() {
      A.setBody('#8fd3ff'); score = 0; objs = []; keys = {}; pos.x = 0; pos.y = 1; vel.x = vel.y = 0; landI = 0; spawnT = { star: 0, balloon: 1, cloud: 0, land: 0 }; phase = 'fly'; flyT = 0; speed = SPEED; island = null; clearG();
      game.innerHTML = `<div class="p3"></div><div class="p3load">جاري التحميل… ✈️</div><div class="p3hud"><span class="emo">⭐</span><b id="p3s">٠</b></div><div class="p3hud" style="left:auto;right:8vw"><span class="emo">✈️</span><span>←</span><b id="p3t" style="direction:ltr;color:#e8590c">A</b></div><div id="p3abc">${WORDS.map(w => `<span>${w[0]}</span>`).join("")}</div>
        <div class="p3ctrl"><span></span><button data-k="U">▲</button><span></span><button data-k="L">◀</button><span></span><button data-k="R">▶</button><span></span><button data-k="D">▼</button><span></span></div>
        <div class="p3tip" id="p3tip">حرّكي الطيارة بالأسهم واجمعي النجوم… وبعدها نهبط في جزيرة الحرف</div>`;
      game.querySelectorAll('.p3ctrl button').forEach(b => { const k = b.dataset.k; b.addEventListener('pointerdown', e => { e.preventDefault(); keys[k] = true; }); ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, () => { keys[k] = false; })); });
      setTarget(); loadThree(() => { init(); setTarget(); voice('en_go' + letterI, '', 1800); });
    },
    key(k) { if (KM[k]) keys[KM[k]] = true; if ((k === 'Enter' || k === ' ' || k === 'ArrowUp') && phase === 'ready') takeOff(); },
    stop() { clearG(); running = false; cancelAnimationFrame(raf); keys = {}; if (renderer) { renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); renderer = null; } objs = []; }
  };
})();
