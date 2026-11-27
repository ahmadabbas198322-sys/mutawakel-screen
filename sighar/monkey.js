/* مغامرة القرد: القرد يمشي في ٧ مناطق ويلتقي أصدقاءه */
(function () {
  const A = window.APP; if (!A || !window.MODES || !window.ART) return;
  const { SND, animalSound, voice, confetti, later, clearTimers, game, $ } = A;
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const sv = k => { const d = document.createElement('div'); d.innerHTML = SCENES[k].html; return d.querySelector('.actor svg').outerHTML; };
  const tree = (c1, c2) => `<svg viewBox="0 0 160 240"><rect x="70" y="120" width="22" height="120" rx="8" fill="#8a5a2b"/><circle cx="80" cy="80" r="64" fill="${c1}"/><circle cx="46" cy="104" r="40" fill="${c2}"/><circle cx="116" cy="100" r="42" fill="${c2}"/></svg>`;
  const acacia = `<svg viewBox="0 0 200 220"><rect x="92" y="90" width="16" height="130" rx="6" fill="#8a5a2b"/><path d="M100 120 L60 80 M100 110 L140 70" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/><ellipse cx="100" cy="62" rx="98" ry="30" fill="#5c940d"/><ellipse cx="80" cy="50" rx="60" ry="20" fill="#74b816"/></svg>`;
  const barn = `<svg viewBox="0 0 200 180"><path d="M20 180 L20 70 L100 20 L180 70 L180 180 Z" fill="#e03131"/><path d="M20 70 L100 20 L180 70" stroke="#fff" stroke-width="10" fill="none"/><rect x="70" y="100" width="60" height="80" fill="#fff"/><path d="M70 100 L130 180 M130 100 L70 180" stroke="#e03131" stroke-width="6"/></svg>`;

  /* المناطق: [البداية، النهاية، الاسم، رمز، لون السماء، لون الأرض] */
  const ZONES = [[0, 260, 'الغابة', '🌳', 'linear-gradient(#d3f9d8,#8ce99a)', '#5c940d'], [260, 720, 'المزرعة', '🐄', 'linear-gradient(#e3fafc,#c5f6fa)', '#8ce99a'], [720, 980, 'البركة', '🦆', 'linear-gradient(#e7f5ff,#a5d8ff)', '#8ce99a'],
    [980, 1180, 'الخيزران', '🎋', 'linear-gradient(#ebfbee,#c3fae8)', '#74b816'], [1180, 1520, 'السافانا', '🦁', 'linear-gradient(#fff9db,#ffe8a3)', '#c5e17a'], [1520, 1820, 'الصحراء', '🐪', 'linear-gradient(#fff4e6,#ffd8a8)', '#f4c27a'], [1820, 2040, 'حديقة الورد', '🌷', 'linear-gradient(#fff0f6,#e7f5ff)', '#8ce99a']];
  const WORLD = 2040, GROUND = 80, WATER = [760, 940], SURF = 72, TREE_X = 1070, BRANCH = 38, CAMEL_END = 1790, PARTY = 1990;

  /* الأصدقاء: مفتاح، اسم، رمز للألبوم، رسم، ارتفاع، موقع، صوت، خيارات */
  const F = [
    ['rabbit', 'أرنب', '🐰', () => sv(0), 18, 120, 'boing'], ['fox', 'ثعلب', '🦊', () => sv(3), 20, 200, 'yip'], ['falcon', 'صقر', '🦅', () => sv(13), 16, 236, 'screech', { y: 22 }],
    ['cow', 'بقرة', '🐄', () => ART.cow(), 30, 340, 'cow'], ['sheep', 'خروف', '🐑', () => sv(6), 22, 420, 'sheep'], ['hen', 'دجاجة', '🐔', () => sv(7), 18, 490, 'cluck'],
    ['horse', 'حصان', '🐴', () => sv(5), 34, 560, 'horse'], ['cat', 'قطة', '🐱', () => sv(20), 20, 630, 'cat'], ['dog', 'كلب', '🐶', () => sv(21), 22, 690, 'dog'],
    ['duck', 'بطة', '🦆', () => sv(1), 16, 800, 'duck', { y: SURF - 16 * .66 }], ['fish', 'سمكة', '🐟', () => sv(11), 15, 860, 'blub', { y: 86 }], ['frog', 'ضفدع', '🐸', () => sv(14), 13, 915, 'frog', { y: SURF - 13 + 1 }],
    ['panda', 'باندا', '🐼', () => ART.panda(), 19, TREE_X - 4, 'munch', { y: BRANCH - 18 }], ['lion', 'أسد', '🦁', () => ART.lion(), 30, 1260, 'lion'],
    ['elephant', 'فيل', '🐘', () => sv(19), 40, 1360, 'elephant'], ['giraffe', 'زرافة', '🦒', () => sv(10), 52, 1460, 'hum'],
    ['camel', 'جمل', '🐪', () => sv(4), 42, 1580, 'camel'], ['bee', 'نحلة', '🐝', () => sv(24), 12, 1900, 'bee', { y: 50 }]];
  const FILE = A.FILE_ANIMALS;
  const playFriend = s => FILE.includes(s) ? animalSound(s) : (SND[s] ? SND[s]() : SND.boing());

  let album = {}; try { album = JSON.parse(localStorage.getItem('monkey-album') || '{}') || {}; } catch (e) { }
  const saveAlbum = () => { try { localStorage.setItem('monkey-album', JSON.stringify(album)); } catch (e) { } };

  const css = `
  .mw{position:fixed;inset:0;overflow:hidden;pointer-events:none;direction:ltr}
  .world{position:absolute;top:0;left:0;height:100%;will-change:transform}
  .wz,.wg,.wo{position:absolute}
  .wo svg,.mk svg,.mcard svg{width:100%;height:100%;display:block;overflow:visible}
  .idle .leg,.idle .bob{animation:none!important}
  .mk{position:absolute;left:0;top:0;z-index:5}
  .mk .flipx{width:100%;height:100%;transform:scaleX(-1)}
  .mk .leg,.mk .arm,.mk .bob{animation-play-state:paused}
  .mk.walking .leg,.mk.walking .arm,.mk.walking .bob{animation-play-state:running}
  .mk .arm{transform-origin:50% 0%;animation:step .5s ease-in-out infinite}.mk .arm.b{animation-delay:-.25s}
  .mk .leg{animation-duration:.5s}.mk .leg.b{animation-delay:-.25s}.mk .bob{animation-duration:.25s}
  .mk .mtail{transform-origin:0% 50%;animation:swish 1.4s ease-in-out infinite}
  .mk.mswim .flipx{transform:scaleX(-1) rotate(-60deg)}
  .mk.mclimb .arm{animation:climbArm .5s ease-in-out infinite alternate}
  @keyframes climbArm{to{transform:translateY(8px)}}
  .mban{position:absolute;z-index:4;animation:bob 1.4s ease-in-out infinite}
  .mwater{position:absolute;background:linear-gradient(rgba(77,171,247,.42),rgba(24,100,171,.6));z-index:6}
  .bubbleM{position:absolute;border:3px solid rgba(255,255,255,.8);border-radius:50%;z-index:7;animation:risebub2 1.6s ease-out forwards}
  @keyframes risebub2{to{transform:translateY(-14vh);opacity:0}}
  .mhud{position:fixed;top:2vh;left:2vw;right:7vw;display:flex;justify-content:space-between;align-items:center;z-index:8;pointer-events:none}
  .mpill{background:rgba(255,255,255,.9);border-radius:999px;padding:.6vh 1.6vw;font-size:min(4vh,3vw);color:#333;display:flex;gap:.6vw;align-items:center;box-shadow:0 .5vh 0 rgba(0,0,0,.12)}
  .mprog{display:flex;gap:.6vw;background:rgba(255,255,255,.85);border-radius:999px;padding:.6vh 1.4vw;font-size:min(4.2vh,3vw);align-items:center}
  .mprog span{transition:transform .3s,filter .3s}.mprog .off{filter:grayscale(1) opacity(.4)}.mprog .here{transform:scale(1.4)}
  .mctrl{position:fixed;bottom:3vh;z-index:9;display:none;gap:2vw}
  @media (pointer:coarse){.mctrl{display:flex}}
  .mcb{pointer-events:auto;width:min(13vh,15vw);height:min(13vh,15vw);border-radius:50%;border:none;background:rgba(255,255,255,.5);color:#fff;font-size:min(6vh,7vw);touch-action:none}
  .mdim{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:10;display:flex;align-items:center;justify-content:center;flex-direction:column;pointer-events:auto}
  .mcard{width:min(62vw,96vh);height:min(66vh,48vw);border-radius:6vh;background:radial-gradient(circle,#fff9db,#ffe066);box-shadow:0 0 0 1.4vh #fff;position:relative;display:flex;align-items:center;justify-content:center;animation:cardIn .6s cubic-bezier(.2,1.5,.4,1)}
  @keyframes cardIn{from{transform:scale(.1) rotate(-15deg)}to{transform:scale(1)}}
  .mcard .big{width:70%;height:78%}
  .mcard .nm{position:absolute;bottom:-3vh;left:0;right:0;text-align:center;font-size:min(13vh,10vw);color:#e8590c;text-shadow:0 .8vh 0 #fff,0 0 2vh #fff}
  .mcard .snd{position:absolute;top:3vh;right:4vh;font-size:9vh;animation:tw .5s infinite alternate}
  .mtitle{position:fixed;inset:0;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(#8ce99a,#2f9e44);pointer-events:auto}
  .mtitle h1{font-size:min(13vh,10vw);color:#fff;text-shadow:0 1vh 0 rgba(0,0,0,.2)}
  .mtitle p{font-size:min(4.6vh,4vw);color:#fff8db;margin:1vh 0 2vh}
  .mtitle .mkbig{width:min(46vh,40vw);height:min(52vh,46vw)}
  .mbtns{display:flex;gap:3vw;margin-top:2vh}
  .mbtn{pointer-events:auto;border:none;border-radius:999px;font:inherit;font-weight:800;font-size:min(6vh,5vw);padding:1.4vh 4vw;background:#fff;color:#333;cursor:pointer;box-shadow:0 1vh 0 rgba(0,0,0,.15)}
  .mbtn.go{background:#ffd43b}
  .mbtn:focus{outline:none;box-shadow:0 0 0 1vh #fff,0 0 0 1.7vh #e8590c;transform:scale(1.06)}
  .malbum{position:fixed;inset:0;z-index:10;background:#fff4e6;display:flex;flex-direction:column;align-items:center;padding-top:4vh;pointer-events:auto}
  .malbum h2{font-size:min(8vh,6vw);color:#e8590c;margin-bottom:3vh}
  .agrid{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:2vh 1.4vw;width:92vw}
  .acell{background:#fff;border-radius:2.6vh;padding:1.6vh 0;text-align:center;box-shadow:0 .7vh 0 rgba(0,0,0,.08)}
  .acell .e{font-size:min(10vh,7vw)}.acell .n{font-size:min(3.4vh,2.4vw);color:#333}
  .acell.no{background:#e9ecef}.acell.no .e{filter:brightness(0) opacity(.18)}.acell.no .n{color:#adb5bd}
  .party{position:fixed;top:16vh;left:0;right:0;display:flex;justify-content:center;flex-wrap:wrap;gap:1vw;z-index:9;font-size:min(9vh,6vw)}
  .party span{animation:bob .8s ease-in-out infinite}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  let U = 7, running = false, raf = 0, last = 0, keys = { L: false, R: false }, state = 'walk', meeting = null, met = {}, bananas = [], bcount = 0;
  let mx = 30, yb = GROUND, vy = 0, onGround = true, climbed = false, riding = false, rode = false, partied = false, curZone = -1;
  let world, mkEl, camelEl, friends = [];

  const H = () => innerHeight;
  function screenW() { return innerWidth / U; }

  function buildWorld() {
    U = H() / 100;
    let h = '';
    ZONES.forEach(([s, e, , , sky, gr]) => {
      h += `<div class="wz" style="left:${s * U}px;width:${(e - s) * U + 2}px;top:0;height:100%;background:${sky}"></div>`;
      const segs = s === 720 ? [[s, WATER[0]], [WATER[1], e]] : [[s, e]];
      segs.forEach(([a, b]) => h += `<div class="wg" style="left:${a * U}px;width:${(b - a) * U + 2}px;top:${GROUND * U}px;bottom:0;background:${gr}"></div>`);
    });
    const deco = (x, y, w, hh, svg, z) => `<div class="wo" style="left:${x * U}px;top:${y * U}px;width:${w * U}px;height:${hh * U}px;${z ? 'z-index:' + z : ''}">${svg}</div>`;
    const emo = (x, y, s, e) => `<div class="wo emo" style="left:${x * U}px;top:${y * U}px;font-size:${s * U}px">${e}</div>`;
    // الغابة
    [[-10, 26, 1.5], [60, 36, 1.1], [150, 30, 1.3], [250, 34, 1.2]].forEach(([x, y, s]) => h += deco(x, y, 32 * s, 48 * s, tree('#2f9e44', '#40c057')));
    h += emo(90, 72, 7, '🍄') + emo(175, 73, 6, '🌼');
    // المزرعة
    h += deco(590, 44, 40, 36, barn);
    h += `<div class="wo" style="left:${270 * U}px;width:${300 * U}px;top:${66 * U}px;height:${12 * U}px;background:repeating-linear-gradient(90deg,#fff 0 ${2 * U}px,transparent ${2 * U}px ${8 * U}px);opacity:.9"></div><div class="wo" style="left:${270 * U}px;width:${300 * U}px;top:${69 * U}px;height:${1.4 * U}px;background:#fff"></div><div class="wo" style="left:${270 * U}px;width:${300 * U}px;top:${74 * U}px;height:${1.4 * U}px;background:#fff"></div>`;
    // البركة
    h += `<div class="mwater" style="left:${WATER[0] * U}px;width:${(WATER[1] - WATER[0]) * U}px;top:${SURF * U}px;bottom:0"></div>`;
    h += `<div class="wo" style="left:${905 * U}px;top:${(SURF - .5) * U}px;width:${20 * U}px;height:${3 * U}px;border-radius:50%;background:#37b24d;z-index:7"></div>`;
    [745, 950, 965].forEach(x => h += emo(x, 60, 12, '🌾'));
    // الخيزران
    [990, 1010, 1130, 1150, 1165].forEach((x, i) => h += `<div class="wo" style="left:${x * U}px;top:${(14 + i % 3 * 6) * U}px;width:${(2.6 + i % 2) * U}px;height:${(66 - i % 3 * 6) * U}px;background:repeating-linear-gradient(#69db7c 0 ${7 * U}px,#2f9e44 ${7 * U}px ${7.6 * U}px);border-radius:${U}px"></div>`);
    h += `<div class="wo" style="left:${(TREE_X - 6) * U}px;top:${18 * U}px;width:${14 * U}px;height:${62 * U}px;background:#8a5a2b;border-radius:${4 * U}px"></div>`;
    h += `<div class="wo" style="left:${(TREE_X - 30) * U}px;top:${BRANCH * U}px;width:${34 * U}px;height:${4 * U}px;background:#8a5a2b;border-radius:${2 * U}px;transform:rotate(-4deg)"></div>`;
    h += deco(TREE_X - 46, 2, 92, 34, `<svg viewBox="0 0 720 260" preserveAspectRatio="none"><g fill="#2f9e44"><circle cx="360" cy="110" r="120"/><circle cx="200" cy="140" r="90"/><circle cx="530" cy="140" r="90"/></g><g fill="#40c057"><circle cx="280" cy="80" r="60"/><circle cx="460" cy="90" r="60"/></g></svg>`);
    // السافانا
    h += `<div class="wo" style="left:${1300 * U}px;top:${8 * U}px;width:${16 * U}px;height:${16 * U}px;border-radius:50%;background:#ffd43b;box-shadow:0 0 0 ${2 * U}px rgba(255,212,59,.35)"></div>`;
    [1200, 1410, 1495].forEach(x => h += deco(x, 46, 38, 38, acacia));
    // الصحراء
    h += deco(1520, 56, 300, 26, `<svg viewBox="0 0 1000 300" preserveAspectRatio="none"><path d="M0 300 L0 150 Q200 60 420 160 Q620 240 800 120 Q900 80 1000 130 L1000 300 Z" fill="#f4c27a"/><path d="M0 300 L0 230 Q250 160 500 240 Q760 300 1000 210 L1000 300 Z" fill="#e8a952"/></svg>`);
    h += emo(1540, 62, 14, '🌵') + emo(1680, 58, 16, '🌴') + emo(1760, 64, 12, '🌵');
    // الحديقة
    [1835, 1860, 1925, 1950, 2010].forEach((x, i) => h += emo(x, 70 + i % 2 * 2, 8, ['🌷', '🌻', '🌸', '🌼', '🌷'][i]));
    h += emo(1975, 30, 10, '🎈') + emo(1995, 24, 10, '🎈') + emo(2015, 32, 10, '🎈');
    // الأصدقاء
    friends = F.map(f => {
      const svg = f[3](); const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1].split(/\s+/).map(Number); const w = f[4] * vb[2] / vb[3];
      const y = f[7] && f[7].y != null ? f[7].y : GROUND - f[4];
      return { key: f[0], name: f[1], emo: f[2], svg, h: f[4], w, x: f[5], y, snd: f[6] };
    });
    friends.forEach((f, i) => h += `<div class="wo idle fr" data-i="${i}" style="left:${(f.x - f.w / 2) * U}px;top:${f.y * U}px;width:${f.w * U}px;height:${f.h * U}px;z-index:${f.key === 'fish' ? 5 : f.key === 'duck' || f.key === 'frog' ? 7 : 3}">${f.svg}</div>`);
    // الموز
    bananas = [];
    for (let x = 60; x < PARTY - 20; x += 24) {
      if (Math.abs(x - TREE_X) < 14) continue;
      const inW = x > WATER[0] + 6 && x < WATER[1] - 6, high = !inW && (x / 24 | 0) % 4 === 0;
      bananas.push({ x, y: inW ? 88 : high ? 60 : 74, got: false });
    }
    bananas.forEach((b, i) => h += `<div class="mban" data-b="${i}" style="left:${(b.x - 2.5) * U}px;top:${(b.y - 2.5) * U}px;width:${5 * U}px;height:${4 * U}px;animation-delay:-${(i % 7) * .2}s"><svg viewBox="-5 -10 60 50" width="100%" height="100%">${ART.banana(0, 0, 0)}</svg></div>`);
    h += `<div class="mk" id="mk"><div class="flipx">${ART.monkey({})}</div></div>`;
    world.style.width = WORLD * U + 'px'; world.innerHTML = h;
    mkEl = $('#mk'); camelEl = world.querySelector('.fr[data-i="16"]');
  }

  function hudHTML() {
    return `<div class="mhud"><div class="mpill"><span class="emo">🍌</span><b id="mbn">${ar(bcount)}</b></div><div class="mprog" id="mprog">${ZONES.map((z, i) => `<span class="emo off" data-z="${i}">${z[3]}</span>`).join('')}</div><div class="mpill">أصدقائي <b id="mfr">${ar(Object.keys(album).length)}</b>/${ar(F.length)} <span class="emo">🐵</span></div></div>
      <div class="mctrl" style="left:3vw"><button class="mcb" data-k="L">◀</button></div><div class="mctrl" style="right:3vw"><button class="mcb emo" data-k="J">⤴️</button><button class="mcb" data-k="R">▶</button></div>`;
  }

  function setMonkeyLook(kind) {
    const html = kind === 'climb' ? ART.monkeyClimb() : ART.monkey({ goggles: kind === 'swim' });
    mkEl.firstElementChild.innerHTML = html; mkEl.dataset.kind = kind;
    mkEl.classList.toggle('mswim', kind === 'swim'); mkEl.classList.toggle('mclimb', kind === 'climb');
  }

  function place() {
    const mh = 24, mw = mh * .8;
    mkEl.style.width = mw * U + 'px'; mkEl.style.height = mh * U + 'px';
    mkEl.style.transform = `translate(${(mx - mw / 2) * U}px,${(yb - mh) * U}px)`;
    if (riding && camelEl) { const f = friends[16]; camelEl.style.left = (mx - f.w * .4) * U + 'px'; }
    const sw = screenW(); let cam = mx - sw * .38; cam = Math.max(0, Math.min(WORLD - sw, cam));
    world.style.transform = `translateX(${-cam * U}px)`;
    const z = ZONES.findIndex(z => mx >= z[0] && mx < z[1]);
    if (z !== curZone && z >= 0) { curZone = z; document.querySelectorAll('#mprog span').forEach((s, i) => { s.className = 'emo ' + (i < z ? '' : i === z ? 'here' : 'off'); }); }
  }

  function bubble() { const b = document.createElement('div'); b.className = 'bubbleM'; const s = (1.5 + Math.random() * 2) * U; b.style.cssText = `left:${(mx + 3) * U}px;top:${(yb - 18) * U}px;width:${s}px;height:${s}px`; world.appendChild(b); setTimeout(() => b.remove(), 1600); }

  function meet(i) {
    const f = friends[i]; met[f.key] = 1; meeting = f; keys.L = keys.R = false;
    const isNew = !album[f.key]; album[f.key] = 1; saveAlbum(); $('#mfr').textContent = ar(Object.keys(album).length);
    const d = document.createElement('div'); d.className = 'mdim'; d.id = 'mdim';
    d.innerHTML = `<div class="mcard"><span class="snd emo">🔊</span><div class="big ${['lion', 'cow', 'panda'].includes(f.key) ? '' : ''}">${f.svg}</div><div class="nm">${f.name}${isNew ? ' <span class="emo" style="font-size:.6em">⭐</span>' : ''}</div></div>`;
    game.appendChild(d); d.addEventListener('click', endMeet);
    SND.whoosh(); later(() => playFriend(f.snd), 500); voice('n_' + f.key, f.name, 2700); later(() => confetti(60), 600);
    if (isNew) later(() => SND.tada(), 3400);
    meeting.t = later(endMeet, 5600);
  }
  function endMeet() {
    if (!meeting) return; const f = meeting; meeting = null; const d = $('#mdim'); if (d) d.remove();
    if (f.key === 'camel' && !rode) { riding = true; rode = true; vy = -40; voice('mk_ride', '', 0); camelEl.classList.remove('idle'); camelEl.firstElementChild.style.transform = 'scaleX(-1)'; state = 'ride'; }
    if (f.key === 'panda') { state = 'down'; }
  }

  function party() {
    partied = true; state = 'party'; keys.L = keys.R = false;
    const list = F.filter(f => album[f[0]]).map(f => f[2]);
    const p = document.createElement('div'); p.className = 'party'; p.innerHTML = list.map((e, i) => `<span class="emo" style="animation-delay:-${(i * .1).toFixed(1)}s">${e}</span>`).join('');
    game.appendChild(p); voice('mk_party', '', 300); SND.tada();
    [0, 800, 1600, 2400].forEach(t => later(() => confetti(80, Math.random() * innerWidth, innerHeight * .4), t));
    later(() => { const d = document.createElement('div'); d.className = 'mdim'; d.style.background = 'rgba(0,0,0,.25)'; d.innerHTML = `<div class="mbtns"><button class="mbtn go" id="again">🔁 من جديد</button><button class="mbtn" id="toAlbum">📒 ألبومي</button></div>`; game.appendChild(d); $('#again').onclick = () => startRun(); $('#toAlbum').onclick = showAlbum; $('#again').focus(); }, 3500);
  }

  function frame(t) {
    if (!running) return; const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
    if (!meeting && state !== 'party') {
      const inWater = mx > WATER[0] && mx < WATER[1];
      let dir = (keys.R ? 1 : 0) - (keys.L ? 1 : 0);
      if (state === 'climb') { yb -= 22 * dt; mkEl.classList.add('walking'); if (yb <= BRANCH) { yb = BRANCH; state = 'top'; meet(12); } }
      else if (state === 'down') { yb += 26 * dt; mkEl.classList.add('walking'); if (yb >= GROUND) { yb = GROUND; state = 'walk'; setMonkeyLook('walk'); } }
      else if (state === 'top') { }
      else {
        const sp = riding ? 24 : inWater ? 20 : 30; mx += dir * sp * dt; mx = Math.max(12, Math.min(WORLD - 12, mx));
        mkEl.classList.toggle('walking', dir !== 0 || !onGround);
        // الأرضية
        let floor = GROUND;
        if (riding) floor = GROUND - friends[16].h * .7;
        else if (inWater) floor = 95;
        const g = inWater && !riding ? 55 : 220; vy += g * dt; if (inWater && vy > 18) vy = 18;
        yb += vy * dt; if (yb >= floor) { yb = floor; vy = 0; onGround = true; } else onGround = false;
        if (inWater && mkEl.dataset.kind !== 'swim') { setMonkeyLook('swim'); SND.whoosh(); voice('mk_splash', '', 0); for (let k = 0; k < 6; k++) setTimeout(bubble, k * 120); }
        if (!inWater && mkEl.dataset.kind === 'swim') setMonkeyLook('walk');
        if (inWater && Math.random() < dt * 3) bubble();
        if (inWater && mx > WATER[1] - 8 && dir > 0 && yb > SURF - 2) vy = -70; // الطلوع من الماء
        if (!inWater && mx > WATER[1] - 2 && mx < WATER[1] + 4 && yb > GROUND) yb = GROUND;
        if (!climbed && mx >= TREE_X - 8 && mx < TREE_X) { climbed = true; mx = TREE_X - 8; state = 'climb'; setMonkeyLook('climb'); voice('mk_climb', '', 0); }
        if (riding && mx >= CAMEL_END) { riding = false; vy = -50; camelEl.classList.add('idle'); state = 'walk'; }
        // اللقاءات
        friends.forEach((f, i) => { if (met[f.key] || f.key === 'panda') return; if (Math.abs(mx - f.x) < (f.key === 'giraffe' || f.key === 'elephant' ? 16 : 12)) meet(i); });
        if (!partied && mx >= PARTY) party();
      }
      // الموز
      const cy = yb - 12;
      bananas.forEach((b, i) => { if (b.got) return; if (Math.abs(b.x - mx) < 6 && Math.abs(b.y - cy) < 13) { b.got = true; bcount++; $('#mbn').textContent = ar(bcount); const el = world.querySelector(`[data-b="${i}"]`); if (el) el.remove(); SND.pop(1.4); } });
      place();
    } else mkEl.classList.remove('walking');
    raf = requestAnimationFrame(frame);
  }

  function startRun() {
    clearTimers(); stopLoop(); game.innerHTML = `<div class="mw"><div class="world" id="world"></div></div>` + hudHTML();
    world = $('#world'); met = {}; bcount = 0; mx = 30; yb = GROUND; vy = 0; state = 'walk'; climbed = riding = rode = partied = false; curZone = -1; meeting = null;
    buildWorld(); setMonkeyLook('walk'); place();
    game.querySelectorAll('.mcb').forEach(b => {
      const k = b.dataset.k;
      b.addEventListener('pointerdown', e => { e.preventDefault(); A.SND && 0; if (k === 'J') jump(); else keys[k] = true; });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, () => { if (k !== 'J') keys[k] = false; }));
    });
    voice('mk_hi', '', 400);
    running = true; last = 0; raf = requestAnimationFrame(frame);
  }
  function jump() { if (meeting || state !== 'walk' && state !== 'ride') return; if (onGround || (mx > WATER[0] && mx < WATER[1])) { vy = mx > WATER[0] && mx < WATER[1] ? -40 : -75; onGround = false; SND.boing(); } }
  function stopLoop() { running = false; cancelAnimationFrame(raf); keys.L = keys.R = false; }

  function showTitle() {
    stopLoop(); clearTimers();
    game.innerHTML = `<div class="mtitle"><h1>مغامرة القرد</h1><p>امشي مع القرد في الغابة وتعرّفي على أصدقائه</p><div class="mkbig">${ART.monkey({ banana: true })}</div>
      <div class="mbtns"><button class="mbtn go" id="mgo">▶ ابدأ</button><button class="mbtn" id="malb">📒 ألبومي</button></div></div>`;
    $('#mgo').onclick = startRun; $('#malb').onclick = showAlbum; setTimeout(() => $('#mgo') && $('#mgo').focus(), 80);
  }
  function showAlbum() {
    stopLoop(); clearTimers();
    game.innerHTML = `<div class="malbum"><h2>ألبوم أصدقاء القرد <span class="emo">📒</span> ${ar(Object.keys(album).length)}/${ar(F.length)}</h2><div class="agrid">${F.map(f => `<div class="acell ${album[f[0]] ? '' : 'no'}"><div class="e emo">${f[2]}</div><div class="n">${album[f[0]] ? f[1] : '؟'}</div></div>`).join('')}</div>
      <div class="mbtns" style="margin-top:4vh"><button class="mbtn go" id="mgo">▶ العب</button></div></div>`;
    $('#mgo').onclick = startRun; setTimeout(() => $('#mgo').focus(), 80);
    game.querySelectorAll('.acell:not(.no)').forEach((c, i) => { });
  }

  const focusNav = (k) => { const bs = [...game.querySelectorAll('.mbtn')]; if (!bs.length) return false; const i = bs.indexOf(document.activeElement); if (k === 'ArrowLeft' || k === 'ArrowRight') { bs[(i + (k === 'ArrowLeft' ? 1 : bs.length - 1)) % bs.length].focus(); return true; } if (k === 'Enter' || k === ' ') { (i >= 0 ? bs[i] : bs[0]).click(); return true; } return true; };

  addEventListener('keyup', e => { if (!running) return; if (e.key === 'ArrowRight') keys.R = false; if (e.key === 'ArrowLeft') keys.L = false; });
  addEventListener('blur', () => { keys.L = keys.R = false; });
  addEventListener('resize', () => { if (running) { const s = { mx, yb }; buildWorld(); setMonkeyLook(mkEl.dataset.kind || 'walk'); mx = s.mx; yb = s.yb; bananas.forEach((b, i) => { }); place(); } });

  window.__mk = () => ({ mx: Math.round(mx), yb: Math.round(yb), state, riding });
  MODES.monkey = {
    noTap: true, nav: false,
    start() { A.setBody('#2f9e44'); showTitle(); },
    key(k) {
      if (!running || game.querySelector('.mbtn')) { if (game.querySelector('.mbtn')) focusNav(k); return; }
      if (meeting) { if (k === 'Enter' || k === ' ') endMeet(); return; }
      if (k === 'ArrowRight') keys.R = true; else if (k === 'ArrowLeft') keys.L = true; else if (k === 'ArrowUp' || k === 'Enter' || k === ' ') jump();
    },
    stop() { stopLoop(); }
  };
})();
