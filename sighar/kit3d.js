/* أدوات مشتركة لألعاب الثلاثي الأبعاد (القطار والغوّاصة) */
window.KIT3D = (function () {
  const K = {};
  K.load = (cb, onErr) => { if (window.THREE) return cb(); const s = document.createElement('script'); s.src = 'three.min.js'; s.onload = cb; s.onerror = onErr || (() => { }); document.head.appendChild(s); };
  K.init = (wrap, bg, fogNear, fogFar) => {
    const T = THREE, r = new T.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
    r.setPixelRatio(Math.min(1.25, window.devicePixelRatio || 1)); r.setSize(innerWidth, innerHeight); wrap.appendChild(r.domElement);
    const scene = new T.Scene(); scene.background = new T.Color(bg); scene.fog = new T.Fog(bg, fogNear, fogFar);
    const cam = new T.PerspectiveCamera(55, innerWidth / innerHeight, .1, 300);
    return { r, scene, cam };
  };
  K.mat = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, o || {}));
  K.mesh = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };
  K.tex = (draw, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t; };
  const texCache = {};
  K.emoji = (e, size) => {
    const t = texCache[e] || (texCache[e] = K.tex((x, w, h) => { x.font = (h * .8) + 'px "Noto Color Emoji","Apple Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, w / 2, h * .54); }, 256, 256));
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true })); sp.scale.set(size, size, 1); return sp;
  };
  K.word = (txt, col, sx) => {
    const t = K.tex((x, w, h) => { x.font = '800 ' + (h * .6) + 'px Tajawal,Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = 'rtl'; x.lineWidth = h * .14; x.strokeStyle = '#fff'; x.strokeText(txt, w / 2, h / 2); x.fillStyle = col || '#e8590c'; x.fillText(txt, w / 2, h / 2); }, 512, 128);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true })); sp.scale.set(sx || 5, (sx || 5) / 4, 1); return sp;
  };
  K.monkeyHead = (s) => {
    const { mesh, mat } = K, T = THREE, g = new T.Group();
    g.add(mesh(new T.SphereGeometry(.42, 12, 10), mat(0x8d5524)));
    const f = mesh(new T.SphereGeometry(.3, 12, 10), mat(0xf1c27d), 0, -.04, -.22); f.scale.z = .6; g.add(f);
    [-1, 1].forEach(k => { g.add(mesh(new T.SphereGeometry(.15, 8, 6), mat(0x8d5524), k * .42, .06, 0)); g.add(mesh(new T.SphereGeometry(.06, 6, 5), mat(0x1d1d1d), k * .11, .02, -.4)); });
    if (s) g.scale.set(s, s, s); return g;
  };
  K.project = (obj, cam) => { const v = new THREE.Vector3(); obj.getWorldPosition(v); v.project(cam); return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight }; };
  K.dispose = (o) => o.traverse(c => { if (c.geometry) c.geometry.dispose(); });
  K.css = `.k3{position:fixed;inset:0;z-index:1}.k3 canvas{display:block;width:100%;height:100%}
  .k3hud{position:fixed;top:2vh;left:2vw;z-index:4;background:rgba(255,255,255,.9);border-radius:999px;padding:.6vh 1.8vw;font-size:min(5vh,4vw);display:flex;gap:.8vw;align-items:center;box-shadow:0 .5vh 0 rgba(0,0,0,.12)}
  .k3load{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-size:6vh;color:#fff;z-index:3}
  .k3tip{position:fixed;bottom:4vh;left:0;right:0;text-align:center;color:#fff;font-size:min(4vh,3.6vw);text-shadow:0 .3vh 0 rgba(0,0,0,.35);z-index:4;animation:k3fade 6s forwards;pointer-events:none}
  @keyframes k3fade{0%,85%{opacity:1}100%{opacity:0}}
  .k3btn{position:fixed;z-index:4;border:none;border-radius:999px;background:rgba(255,255,255,.9);font:inherit;font-weight:800;font-size:min(5vh,4vw);padding:1vh 2.4vw;pointer-events:auto;box-shadow:0 .6vh 0 rgba(0,0,0,.15)}
  .k3flash{position:fixed;inset:0;background:#fff;z-index:5;pointer-events:none;animation:k3flash .45s forwards}
  @keyframes k3flash{from{opacity:.85}to{opacity:0}}
  .k3pad{position:fixed;bottom:3vh;left:3vw;z-index:4;display:none;grid-template-columns:repeat(3,min(11vh,13vw));grid-template-rows:repeat(3,min(11vh,13vw));gap:.6vh;direction:ltr}
  @media (pointer:coarse){.k3pad{display:grid}}
  .k3pad button{pointer-events:auto;border:none;border-radius:2vh;background:rgba(255,255,255,.45);color:#fff;font-size:min(5vh,6vw);touch-action:none}`;
  const st = document.createElement('style'); st.textContent = K.css; document.head.appendChild(st);
  K.tip = (txt) => { const t = document.getElementById('k3tip'); if (t) { t.textContent = txt; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; } };
  K.flash = () => { const f = document.createElement('div'); f.className = 'k3flash'; document.body.appendChild(f); setTimeout(() => f.remove(), 500); };
  return K;
})();
