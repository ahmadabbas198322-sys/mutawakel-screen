/* الأقسام الجديدة: ABC، 123، الألوان، الأشكال، أذكاري، وين؟، مين الصوت؟، البيانو، أطعميه، الغمّيضة، كبير وصغير، التلوين */
(function () {
  const A = window.APP; if (!A) return;
  const { SND, animalSound, voice, confetti, setBg, later, clearTimers, anim, setScene, sceneSound, $, hero, label, counter, game } = A;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rnd = n => Math.floor(Math.random() * n);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const yay = (d) => voice('yay' + (1 + rnd(3)), '', d || 900);

  const css = `
  #game{position:fixed;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
  #game:empty{display:none}
  #game button,#game .rg{pointer-events:auto}
  .qtext{font-size:min(7vh,7vw);color:#fff;text-shadow:0 .5vh 0 rgba(0,0,0,.18);margin-bottom:4vh;display:flex;align-items:center;gap:2vw}
  .choices{display:flex;gap:4vw;justify-content:center;align-items:center;flex-wrap:wrap}
  .choice{border:none;background:#fff;border-radius:40px;width:min(32vh,26vw);height:min(32vh,26vw);font-size:min(20vh,16vw);box-shadow:0 1.2vh 0 rgba(0,0,0,.15);cursor:pointer;font-family:'Noto Color Emoji','Apple Color Emoji',sans-serif;line-height:1;transition:transform .15s}
  .choice:focus,.gbtn:focus,.pkey:focus{outline:none;box-shadow:0 0 0 1vh #fff,0 0 0 1.7vh #ffd43b;transform:scale(1.07)}
  .choice.no{animation:wig .6s;opacity:.6}
  .choice.yes{background:#d3f9d8;animation:yesb .8s}
  @keyframes yesb{30%{transform:scale(1.25) rotate(-6deg)}60%{transform:scale(.95)}}
  .gbtn{border:none;border-radius:999px;background:rgba(255,255,255,.9);font-size:min(5vh,5vw);padding:.4em .8em;cursor:pointer;font-family:inherit;font-weight:800;color:#333}
  .bigemo{font-size:min(30vh,30vw)!important;display:inline-block}
  .blob{width:min(34vh,40vw);height:min(34vh,40vw);border-radius:42% 58% 63% 37%/41% 44% 56% 59%;animation:morph 3s ease-in-out infinite;box-shadow:0 2vh 0 rgba(0,0,0,.12),inset -2vh -2vh 0 rgba(0,0,0,.1)}
  @keyframes morph{50%{border-radius:58% 42% 37% 63%/56% 59% 41% 44%;transform:rotate(12deg) scale(1.06)}}
  .shapeSvg{width:min(36vh,40vw);height:min(36vh,40vw);animation:shapeBob 2.4s ease-in-out infinite;filter:drop-shadow(0 2vh 0 rgba(0,0,0,.12))}
  @keyframes shapeBob{50%{transform:translateY(-3vh) rotate(8deg) scale(1.05)}}
  .duaText{font-family:Tajawal,sans-serif;font-weight:800;font-size:min(7vh,6vw)!important;color:#fff;max-width:88vw;text-align:center;line-height:1.6;text-shadow:0 .5vh 0 rgba(0,0,0,.2);background:rgba(255,255,255,.18);border-radius:3vh;padding:1.5vh 3vw}
  .duaText span{font-size:inherit!important}
  .feedRow{display:flex;align-items:center;gap:8vw}
  .hungry{font-size:min(34vh,30vw);font-family:'Noto Color Emoji',sans-serif;line-height:1;transition:transform .2s}
  .hungry.chomp{animation:chomp .6s}
  @keyframes chomp{25%,75%{transform:scale(1.15,.9)}50%{transform:scale(.95,1.1)}}
  .hungry.nope{animation:nope .6s}
  @keyframes nope{20%,60%{transform:rotate(-10deg)}40%,80%{transform:rotate(10deg)}}
  .flying{position:fixed;z-index:9;font-size:min(16vh,13vw);font-family:'Noto Color Emoji',sans-serif;transition:transform .7s cubic-bezier(.3,1.4,.6,1),opacity .7s;pointer-events:none}
  .spots{display:flex;gap:6vw;align-items:flex-end;margin-top:6vh}
  .spot{position:relative;width:min(30vh,26vw);height:min(30vh,26vw);border:none;background:transparent;cursor:pointer;font-family:'Noto Color Emoji',sans-serif}
  .spot .cover{position:absolute;inset:0;font-size:min(28vh,24vw);line-height:1;z-index:2;display:flex;align-items:flex-end;justify-content:center}
  .spot .who{position:absolute;left:0;right:0;top:20%;font-size:min(17vh,14vw);text-align:center;z-index:1;animation:peek 2.4s ease-in-out infinite}
  .spot.found .who{animation:found .8s forwards;z-index:3}
  @keyframes peek{0%,60%,100%{transform:translateY(40%)}75%,85%{transform:translateY(0)}}
  @keyframes found{40%{transform:translateY(-70%) scale(1.4)}100%{transform:translateY(-55%) scale(1.25)}}
  .spot.miss .cover{animation:wig .6s}
  .opp{display:flex;gap:3vw;margin-top:3vh}
  .panel{position:relative;width:min(44vw,70vh);height:56vh;border-radius:4vh;background:rgba(255,255,255,.7);overflow:hidden;transition:transform .3s,box-shadow .3s}
  .panel.lit{transform:scale(1.04);box-shadow:0 0 0 1vh #ffd43b}
  .panel .pw{position:absolute;bottom:2vh;left:0;right:0;text-align:center;font-size:min(6vh,5vw);color:#333}
  .panel .pe{position:absolute;font-family:'Noto Color Emoji',sans-serif;line-height:1}
  .run{animation:run 1.2s linear infinite}.crawl{animation:run 9s linear infinite}
  @keyframes run{from{transform:translateX(min(44vw,70vh))}to{transform:translateX(-30vh)}}
  .piano{position:fixed;left:2vw;right:2vw;bottom:4vh;height:46vh;display:flex;gap:1vw;direction:ltr}
  .pkey{flex:1;border:none;border-radius:0 0 3vh 3vh;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:3vh;font-size:min(9vh,6vw);font-family:'Noto Color Emoji',sans-serif;box-shadow:inset 0 -1.5vh 0 rgba(0,0,0,.15);transition:transform .08s}
  .pkey.down{transform:translateY(1.5vh);box-shadow:inset 0 -.4vh 0 rgba(0,0,0,.15)}
  .note{position:fixed;font-size:min(10vh,8vw);font-family:'Noto Color Emoji',sans-serif;pointer-events:none;z-index:6;animation:noteUp 1.4s ease-out forwards}
  @keyframes noteUp{to{transform:translateY(-38vh) rotate(25deg);opacity:0}}
  .pmode{position:fixed;top:2vh;left:2vw;z-index:4}
  .colorWrap{display:flex;align-items:center;gap:3vw;width:96vw;justify-content:center}
  .canvasPic{width:min(70vh,58vw);height:min(70vh,58vw);background:#fff;border-radius:4vh;box-shadow:0 1.5vh 0 rgba(0,0,0,.12)}
  .canvasPic .rg{cursor:pointer;transition:fill .25s;stroke:#343a40;stroke-width:4;stroke-linejoin:round}
  .palette{display:grid;grid-template-columns:repeat(2,min(9vh,7vw));gap:1.6vh}
  .sw{width:min(9vh,7vw);height:min(9vh,7vw);border-radius:50%;border:.6vh solid #fff;cursor:pointer;box-shadow:0 .6vh 0 rgba(0,0,0,.15)}
  .sw.sel{transform:scale(1.2);box-shadow:0 0 0 .6vh #343a40}
  .sw:focus{outline:none;box-shadow:0 0 0 .6vh #ffd43b,0 0 0 1.1vh #fff}
  .ctools{display:flex;flex-direction:column;gap:2vh}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* تنقل بالأسهم بين أزرار #game */
  const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  function nav(k) {
    const bs = [...game.querySelectorAll('button:not([disabled])')].filter(b => b.offsetParent !== null);
    if (!bs.length) return false; const cur = document.activeElement;
    if (DIRS[k]) {
      if (!bs.includes(cur)) { bs[0].focus(); return true; }
      const r = cur.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, d = DIRS[k]; let best = null, bd = 1e9;
      for (const b of bs) { if (b === cur) continue; const q = b.getBoundingClientRect(), x = q.left + q.width / 2 - cx, y = q.top + q.height / 2 - cy, al = x * d[0] + y * d[1]; if (al <= 4) continue; const dist = al + Math.abs(x * d[1] - y * d[0]) * .5; if (dist < bd) { bd = dist; best = b; } }
      if (best) best.focus(); return true;
    }
    if (k === 'Enter' || k === ' ') { (bs.includes(cur) ? cur : bs[0]).click(); return true; }
    return false;
  }
  const focusFirst = (sel) => setTimeout(() => { const b = game.querySelector(sel || 'button'); if (b) b.focus(); }, 80);

  /* ---------- قوائم البطاقات (تقليب بالأسهم) ---------- */
  function cardMode(len, render, extra) {
    let i = 0;
    return Object.assign({ nav: true, start() { i = 0; render(i); }, step(d) { i = (i + d + len) % len; render(i); }, replay() { render(i); } }, extra || {});
  }
  const reset = () => { clearTimers(); setScene(null); game.innerHTML = ''; hero.className = 'emo'; hero.style.fontSize = ''; hero.innerHTML = ''; label.innerHTML = ''; label.style.direction = ''; hero.style.direction = ''; counter.innerHTML = ''; counter.classList.add('hidden'); };

  /* ABC */
  const EN = [['A', 'Apple', 2], ['B', 'Bee', 24], ['C', 'Cat', 20], ['D', 'Dog', 21], ['E', 'Elephant', 19], ['F', 'Fish', 11], ['G', 'Giraffe', 10], ['H', 'Horse', 5], ['I', 'Ice cream', '🍦'], ['J', 'Juice', '🧃'], ['K', 'Kite', '🪁'], ['L', 'Lion', '🦁'], ['M', 'Monkey', '🐒'], ['N', 'Nut', '🥜'], ['O', 'Orange', '🍊'], ['P', 'Panda', '🐼'], ['Q', 'Queen', '👑'], ['R', 'Rabbit', 0], ['S', 'Sun', 12], ['T', 'Tiger', '🐯'], ['U', 'Umbrella', '☂️'], ['V', 'Van', '🚐'], ['W', 'Whale', '🐳'], ['X', 'Fox', 3], ['Y', 'Yo-yo', '🪀'], ['Z', 'Zebra', '🦓']];
  const abc = cardMode(EN.length, i => {
    reset(); setBg(); const [L, w, x] = EN[i]; hero.className = 'txt'; hero.style.direction = 'ltr'; hero.textContent = L + ' ' + L.toLowerCase();
    if (typeof x === 'number' && window.SCENES && SCENES[x]) { setScene(SCENES[x]); label.textContent = w; later(() => sceneSound(SCENES[x]), 2600); }
    else { hero.style.fontSize = 'min(22vh,26vw)'; counter.classList.remove('hidden'); counter.innerHTML = `<span class="bigemo bounce">${x}</span>`; label.textContent = w; if (w === 'Lion') later(() => animalSound('lion'), 2200); }
    label.style.direction = 'ltr'; anim(hero, 'pop-in'); SND.jingle(i); voice('en_let' + i, '', 500); confetti(30);
  }, { stop() { hero.style.direction = ''; label.style.direction = ''; } });

  /* 123 */
  const ENW = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const n123 = cardMode(10, i => {
    reset(); setBg(); const n = i + 1, e = A.COUNT_EMO[(i + 3) % A.COUNT_EMO.length]; hero.className = 'txt'; hero.style.fontSize = 'min(30vh,40vw)'; hero.textContent = String(n); counter.classList.remove('hidden'); anim(hero, 'pop-in');
    for (let k = 1; k <= n; k++) later(() => { const s = document.createElement('span'); s.textContent = e; s.className = 'pop-in'; counter.appendChild(s); SND.pop(1 + k * .12); voice('en_num' + k, '', 120); if (k === n) later(() => { label.textContent = ENW[n]; label.style.direction = 'ltr'; SND.tada(); confetti(60); }, 450); }, 500 + k * 800);
  });

  /* الألوان */
  const COLS = [['أحمر', 'Red', '#fa5252', '🍎🍓🌹'], ['أزرق', 'Blue', '#228be6', '🐳💧👖'], ['أصفر', 'Yellow', '#fcc419', '🍌🌻🐥'], ['أخضر', 'Green', '#40c057', '🐸🥦🍀'], ['برتقالي', 'Orange', '#fd7e14', '🍊🥕🦊'], ['بنفسجي', 'Purple', '#7950f2', '🍇🍆☂️'], ['وردي', 'Pink', '#f783ac', '🌸🐷🎀'], ['بنّي', 'Brown', '#8b5a2b', '🐻🍫🌰'], ['أبيض', 'White', '#ffffff', '☁️🐑🥛'], ['أسود', 'Black', '#212529', '🎩⚫🐈‍⬛']];
  const colors = cardMode(COLS.length, i => {
    reset(); const [a, e, c, objs] = COLS[i]; A.setBody(c === '#ffffff' ? '#a5d8ff' : '#fff8e7');
    hero.className = ''; hero.innerHTML = `<div class="blob" style="background:${c}"></div>`; anim(hero, 'pop-in');
    label.innerHTML = `<span>${esc(a)}</span><span style="opacity:.6">·</span><span style="direction:ltr">${esc(e)}</span>`; label.style.color = c === '#ffffff' ? '#1864ab' : c;
    counter.classList.remove('hidden'); [...objs.matchAll(/\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|️)*/gu)].forEach((m, k) => later(() => { const s = document.createElement('span'); s.textContent = m[0]; s.className = 'pop-in'; counter.appendChild(s); SND.pop(1 + k * .2); }, 900 + k * 500));
    voice('col_ar' + i, a, 300); voice('col_en' + i, '', 1700); SND.jingle(i); confetti(30);
  }, { stop() { label.style.color = ''; } });

  /* الأشكال */
  const starPts = (cx, cy, r1, r2, n) => [...Array(n * 2)].map((_, k) => { const r = k % 2 ? r2 : r1, a = -Math.PI / 2 + k * Math.PI / n; return (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1); }).join(' ');
  const SHP = [['دائرة', 'Circle', '#fa5252', '<circle cx="100" cy="100" r="80"/>', '⚽🍪🌕'], ['مربع', 'Square', '#228be6', '<rect x="25" y="25" width="150" height="150" rx="12"/>', '🎁🧇📺'], ['مثلث', 'Triangle', '#40c057', '<polygon points="100,18 186,176 14,176" stroke-linejoin="round"/>', '🍕⛺🔺'], ['نجمة', 'Star', '#fcc419', `<polygon points="${starPts(100, 104, 90, 38, 5)}"/>`, '⭐🌟✨'], ['قلب', 'Heart', '#f06595', '<path d="M100 178 C40 136 14 104 14 70 C14 38 40 20 64 22 C82 24 94 36 100 50 C106 36 118 24 136 22 C160 20 186 38 186 70 C186 104 160 136 100 178 Z"/>', '❤️💖💌'], ['مستطيل', 'Rectangle', '#7950f2', '<rect x="14" y="50" width="172" height="100" rx="12"/>', '🚪📱🧱'], ['بيضاوي', 'Oval', '#fd7e14', '<ellipse cx="100" cy="100" rx="58" ry="84"/>', '🥚🏉🥔']];
  const shapes = cardMode(SHP.length, i => {
    reset(); setBg(); const [a, e, c, sh, objs] = SHP[i];
    hero.className = ''; hero.innerHTML = `<svg class="shapeSvg" viewBox="0 0 200 200" fill="${c}" stroke="#fff" stroke-width="8">${sh}</svg>`; anim(hero, 'pop-in');
    label.innerHTML = `<span>${esc(a)}</span><span style="opacity:.6">·</span><span style="direction:ltr">${esc(e)}</span>`;
    counter.classList.remove('hidden'); [...objs.matchAll(/\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|️)*/gu)].forEach((m, k) => later(() => { const s = document.createElement('span'); s.textContent = m[0]; s.className = 'pop-in'; counter.appendChild(s); SND.pop(1 + k * .2); }, 900 + k * 500));
    voice('shp_ar' + i, a, 300); voice('shp_en' + i, '', 1600); SND.jingle(i + 2); confetti(30);
  });

  /* أذكاري */
  const DUA = [['قبل الأكل', '🍽️😋', 'بِسْمِ الله', '#ffe8cc'], ['بعد الأكل', '😊🍽️', 'الحَمْدُ لله', '#d3f9d8'], ['قبل النوم', '🌙😴', 'بِاسْمِكَ اللّهُمَّ أَموتُ وَأَحْيا', '#364fc7'], ['عند الاستيقاظ', '☀️😊', 'الحَمْدُ للهِ الَّذي أَحْيانا بَعْدَ ما أَماتَنا وَإِلَيْهِ النُّشور', '#ffd43b'], ['السلام', '👋😊', 'السَّلامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكاتُه', '#99e9f2'], ['عند العطاس', '🤧😊', 'الحَمْدُ لله ← يَرْحَمُكَ الله', '#ffdeeb'], ['الخروج من البيت', '🏡🚪', 'بِسْمِ الله، تَوَكَّلْتُ عَلى الله', '#b2f2bb']];
  const adhkar = cardMode(DUA.length, i => {
    reset(); const [t, e, d, bg] = DUA[i]; A.setBody(bg);
    hero.className = 'emo bounce'; hero.style.fontSize = 'min(26vh,30vw)'; hero.textContent = e; anim(hero, 'pop-in');
    label.textContent = t; label.style.color = i === 2 ? '#fff' : '#333';
    counter.classList.remove('hidden'); counter.innerHTML = `<div class="duaText" style="color:${i === 2 ? '#fff' : '#1d1d1d'};text-shadow:none">${esc(d)}</div>`;
    voice('dua' + i, d, 900); SND.chime(); confetti(25);
  }, { stop() { label.style.color = ''; } });

  /* كبير وصغير */
  const OPP = [
    ['كبير', 'صغير', '<div class="pe" style="font-size:34vh;left:50%;bottom:7vh;transform:translateX(-50%)">🐘</div>', '<div class="pe" style="font-size:9vh;left:50%;bottom:9vh;transform:translateX(-50%)">🐭</div>'],
    ['طويلة', 'قصيرة', '<div class="pe" style="font-size:20vh;left:50%;bottom:7vh;transform:translateX(-50%) scaleY(1.9);transform-origin:bottom">🦒</div>', '<div class="pe" style="font-size:12vh;left:50%;bottom:9vh;transform:translateX(-50%)">🐢</div>'],
    ['فوق', 'تحت', '<div style="position:absolute;left:10%;right:10%;top:52%;height:2vh;background:#8a5a2b;border-radius:1vh"></div><div class="pe bounce" style="font-size:14vh;left:38%;top:14%">🐦</div>', '<div style="position:absolute;left:10%;right:10%;top:30%;height:2vh;background:#8a5a2b;border-radius:1vh"></div><div class="pe" style="font-size:14vh;left:38%;top:42%">🐱</div>'],
    ['النهار', 'الليل', '<div style="position:absolute;inset:0;background:#74c0fc"></div><div class="pe" style="font-size:20vh;left:30%;top:12%;animation:spinr 8s linear infinite">☀️</div>', '<div style="position:absolute;inset:0;background:#1c2a4a"></div><div class="pe" style="font-size:18vh;left:34%;top:12%">🌙</div><div class="pe" style="font-size:5vh;left:15%;top:20%">⭐</div><div class="pe" style="font-size:4vh;left:75%;top:40%">⭐</div>'],
    ['سريع', 'بطيئة', '<div class="pe run" style="font-size:15vh;bottom:12vh;left:0">🐇</div>', '<div class="pe crawl" style="font-size:13vh;bottom:12vh;left:0">🐢</div>'],
    ['بارد', 'حار', '<div class="pe" style="font-size:22vh;left:30%;top:14%">🍦</div><div class="pe" style="font-size:7vh;left:12%;top:10%">❄️</div><div class="pe" style="font-size:6vh;left:76%;top:30%">❄️</div>', '<div class="pe" style="font-size:22vh;left:30%;top:16%">☕</div><div class="pe" style="font-size:7vh;left:44%;top:3%;animation:bob 1.5s infinite">♨️</div>'],
    ['مفتوح', 'مسكّر', '<div class="pe" style="font-size:24vh;left:26%;top:12%">📖</div>', '<div class="pe" style="font-size:24vh;left:28%;top:12%">📕</div>']];
  const opp = cardMode(OPP.length, i => {
    reset(); setBg(); const [w1, w2, h1, h2] = OPP[i];
    game.innerHTML = `<div class="opp"><div class="panel" id="p1">${h1}<div class="pw">${esc(w1)}</div></div><div class="panel" id="p2">${h2}<div class="pw" style="${i === 3 ? 'color:#fff' : ''}">${esc(w2)}</div></div></div>`;
        const p1 = $('#p1'), p2 = $('#p2'); anim(p1, 'pop-in'); anim(p2, 'pop-in');
    voice('opp' + i, w1 + '... ' + w2, 400);
    later(() => { p1.classList.add('lit'); SND.pop(1); }, 500); later(() => { p1.classList.remove('lit'); p2.classList.add('lit'); SND.pop(1.5); }, 2300); later(() => { p2.classList.remove('lit'); confetti(30); }, 4200);
  });

  /* وين؟ */
  const WH = A.ANIMALS.map(a => ({ e: a[0], name: a[1], key: a[2] }));
  function roundMode(o) {
    let streak = 0, busy = false;
    const M = {
      noTap: true,
      start() { streak = 0; M.round(); },
      round() { reset(); setBg(); busy = false; o.round(M, streak); },
      win(btn) { if (busy) return; busy = true; streak++; btn.classList.add('yes'); const r = btn.getBoundingClientRect(); confetti(50, r.left + r.width / 2, r.top + r.height / 2); SND.tada(); o.onWin && o.onWin(btn); later(() => M.round(), 3000); },
      lose(btn) { if (busy) return; streak = 0; btn.classList.add('no'); btn.disabled = true; SND.boing(); voice('again', '', 300); o.onLose && o.onLose(btn); const nb = game.querySelector('.choice:not([disabled])'); if (nb) nb.focus(); },
      key(k) { nav(k); }, replay() { o.replay && o.replay(); },
      stop() { clearTimers(); }
    };
    return M;
  }
  const choiceHTML = (opts) => `<div class="choices">${opts.map((x, j) => `<button class="choice" data-j="${j}">${x}</button>`).join('')}</div>`;
  let whTarget = null;
  const where = roundMode({
    round(M, streak) {
      const n = streak >= 3 ? 3 : 2; const opts = shuffle(WH).slice(0, n); whTarget = opts[rnd(n)];
      game.innerHTML = `<div class="qtext"><span>وين ${esc(whTarget.name.replace(/^(ال)?/, 'ال').replace(/^الال/, 'ال'))}؟</span><button class="gbtn" id="rep">🔊</button></div>` + choiceHTML(opts.map(x => x.e));
      game.querySelectorAll('.choice').forEach(b => b.onclick = () => { const x = opts[+b.dataset.j]; x === whTarget ? M.win(b) : M.lose(b); });
      $('#rep').onclick = () => voice('q_w_' + whTarget.key, '', 0);
      voice('q_w_' + whTarget.key, '', 400); focusFirst('.choice');
    },
    onWin() { later(() => animalSound(whTarget.key), 300); yay(2000); },
    onLose() { later(() => voice('q_w_' + whTarget.key, '', 0), 1500); },
    replay() { voice('q_w_' + whTarget.key, '', 0); }
  });

  /* مين الصوت؟ */
  const SOUNDED = WH.filter(x => ['cat', 'dog', 'cow', 'sheep', 'duck', 'rooster', 'lion', 'elephant', 'horse', 'frog', 'bird', 'bee'].includes(x.key));
  let whoT = null;
  const who = roundMode({
    round(M, streak) {
      const n = streak >= 3 ? 3 : 2; const opts = shuffle(SOUNDED).slice(0, n); whoT = opts[rnd(n)];
      game.innerHTML = `<div class="qtext"><span>مين صاحب الصوت؟</span><button class="gbtn" id="rep">🔊 اسمعي</button></div>` + choiceHTML(opts.map(x => x.e));
      game.querySelectorAll('.choice').forEach(b => b.onclick = () => { const x = opts[+b.dataset.j]; x === whoT ? M.win(b) : M.lose(b); });
      $('#rep').onclick = () => animalSound(whoT.key);
      voice('q_who', '', 300); later(() => animalSound(whoT.key), 2000); focusFirst('.choice');
    },
    onWin() { voice('n_' + whoT.key, whoT.name, 500); yay(2000); },
    onLose() { later(() => animalSound(whoT.key), 1400); },
    replay() { animalSound(whoT.key); }
  });

  /* أطعميه */
  const FEED = [['rabbit', '🐰', '🥕'], ['dog', '🐶', '🦴'], ['monkey', '🐒', '🍌'], ['cat', '🐱', '🐟'], ['cow', '🐮', '🌿'], ['bee', '🐝', '🌸'], ['mouse', '🐭', '🧀'], ['panda', '🐼', '🎋']];
  let fT = null;
  const feed = roundMode({
    round(M) {
      fT = FEED[rnd(FEED.length)]; let wrong; do { wrong = FEED[rnd(FEED.length)]; } while (wrong === fT);
      const opts = shuffle([fT[2], wrong[2]]);
      game.innerHTML = `<div class="feedRow"><div class="hungry" id="eater">${fT[1]}</div><div class="choices" style="flex-direction:column;gap:4vh">${opts.map((x, j) => `<button class="choice" style="width:min(24vh,20vw);height:min(24vh,20vw);font-size:min(15vh,12vw)" data-f="${x}">${x}</button>`).join('')}</div></div><button class="gbtn" id="rep" style="margin-top:3vh">🔊</button>`;
      game.querySelectorAll('.choice').forEach(b => b.onclick = () => { b.dataset.f === fT[2] ? M.win(b) : M.lose(b); });
      $('#rep').onclick = () => voice('f_' + fT[0], '', 0);
      voice('f_' + fT[0], '', 400); focusFirst('.choice');
    },
    onWin(btn) {
      const eater = $('#eater'), a = btn.getBoundingClientRect(), b = eater.getBoundingClientRect();
      const f = document.createElement('div'); f.className = 'flying'; f.textContent = fT[2]; f.style.left = a.left + 'px'; f.style.top = a.top + 'px'; document.body.appendChild(f);
      requestAnimationFrame(() => { f.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px,${b.top + b.height * .55 - a.top - a.height / 2}px) scale(.4)`; f.style.opacity = '0'; });
      setTimeout(() => { f.remove(); eater.classList.add('chomp'); [0, .2, .4].forEach(t0 => SND.pop(.5 + t0)); voice('yum', '', 200); const k = { rabbit: 0, dog: 'dog', cat: 'cat', cow: 'cow', bee: 'bee' }[fT[0]]; if (k) later(() => animalSound(k), 1400); }, 700);
    },
    onLose() { const e = $('#eater'); e.classList.remove('nope'); void e.offsetWidth; e.classList.add('nope'); voice('nope', '', 0); }
  });

  /* الغمّيضة */
  const COVERS = ['🌳', '📦', '🏠', '🪨', '🌵', '🧺'];
  let hT = null;
  const hide = roundMode({
    round(M) {
      hT = WH[rnd(WH.length)]; const covers = shuffle(COVERS).slice(0, 3), at = rnd(3);
      game.innerHTML = `<div class="qtext"><span>وين اختبى؟ 👀</span><button class="gbtn" id="rep">🔊</button></div><div class="spots">${covers.map((c, j) => `<button class="choice spot" data-j="${j}" style="background:transparent;box-shadow:none">${j === at ? `<div class="who">${hT.e}</div>` : ''}<div class="cover">${c}</div></button>`).join('')}</div>`;
      game.querySelectorAll('.spot').forEach(b => b.onclick = () => { if (+b.dataset.j === at) { b.classList.add('found'); M.win(b); } else { b.classList.add('miss'); setTimeout(() => b.classList.remove('miss'), 700); SND.boing(); } });
      $('#rep').onclick = () => voice('q_hide', '', 0);
      voice('q_hide', '', 400); focusFirst('.spot');
    },
    onWin() { voice('boo', '', 100); later(() => animalSound(hT.key), 900); }
  });

  /* البيانو */
  const PK = [['#ff6b6b', '🐱', 'cat'], ['#ffa94d', '🐶', 'dog'], ['#ffd43b', '🐥', 'chick'], ['#69db7c', '🐸', 'frog'], ['#38d9a9', '🦆', 'duck'], ['#4dabf7', '🐮', 'cow'], ['#9775fa', '🐑', 'sheep'], ['#f783ac', '🐓', 'rooster']];
  const FREQ = [262, 294, 330, 349, 392, 440, 494, 523];
  let pianoAnimal = false;
  function pianoPlay(j, btn) {
    btn.classList.add('down'); setTimeout(() => btn.classList.remove('down'), 160);
    if (pianoAnimal) animalSound(PK[j][2]);
    else { const f = FREQ[j]; SND.note ? SND.note(f) : null; }
    const r = btn.getBoundingClientRect(), n = document.createElement('div'); n.className = 'note'; n.textContent = pianoAnimal ? PK[j][1] : ['🎵', '🎶'][j % 2]; n.style.left = (r.left + r.width / 2 - 30) + 'px'; n.style.top = (r.top - 40) + 'px'; document.body.appendChild(n); setTimeout(() => n.remove(), 1400);
    A.setBody(PK[j][0] + '55');
  }
  const piano = {
    noTap: true,
    start() {
      reset(); A.setBody('#fff4e6');
      game.innerHTML = `<button class="gbtn pmode" id="pm">${pianoAnimal ? '🐾 أصوات الحيوانات' : '🎵 نغمات'}</button><div class="piano">${PK.map((k, j) => `<button class="pkey" data-j="${j}" style="background:${k[0]}">${k[1]}</button>`).join('')}</div>`;
      game.querySelectorAll('.pkey').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); pianoPlay(+b.dataset.j, b); }));
      game.querySelectorAll('.pkey').forEach(b => b.onclick = e => { if (e.detail === 0) pianoPlay(+b.dataset.j, b); });
      $('#pm').onclick = () => { pianoAnimal = !pianoAnimal; $('#pm').textContent = pianoAnimal ? '🐾 أصوات الحيوانات' : '🎵 نغمات'; };
      focusFirst('.pkey');
    },
    key(k) { nav(k); }
  };

  /* التلوين */
  const PAL = ['#fa5252', '#fd7e14', '#fcc419', '#40c057', '#228be6', '#7950f2', '#f783ac', '#8b5a2b'];
  const PICS = [
    `<path class="rg" d="M60 200 C60 130 130 90 210 100 C270 108 300 150 300 200 C300 250 270 292 210 300 C130 310 60 270 60 200 Z"/><path class="rg" d="M296 200 L372 136 C360 180 360 220 372 264 Z"/><path class="rg" d="M170 104 C186 60 236 60 252 110 Z"/><path class="rg" d="M180 120 C160 170 160 230 180 284 L210 290 C188 230 190 170 212 112 Z"/><circle class="rg" cx="118" cy="180" r="22"/><circle cx="114" cy="180" r="9" fill="#212529"/><path d="M84 236 q20 14 40 0" stroke="#343a40" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    `<path class="rg" d="M196 390 C192 330 204 280 200 220" fill="none" stroke-width="10"/><path class="rg" d="M198 330 C160 300 120 310 104 286 C140 268 180 288 198 318 Z"/><path class="rg" d="M202 300 C240 270 280 280 296 256 C260 240 220 260 202 290 Z"/>${[0, 60, 120, 180, 240, 300].map(a => `<ellipse class="rg" cx="200" cy="96" rx="34" ry="56" transform="rotate(${a} 200 150)"/>`).join('')}<circle class="rg" cx="200" cy="150" r="44"/>`,
    `<rect class="rg" x="80" y="180" width="240" height="190"/><path class="rg" d="M60 190 L200 70 L340 190 Z"/><rect class="rg" x="260" y="80" width="34" height="70"/><rect class="rg" x="170" y="270" width="60" height="100" rx="6"/><rect class="rg" x="100" y="210" width="50" height="50"/><rect class="rg" x="250" y="210" width="50" height="50"/><circle class="rg" cx="70" cy="60" r="34"/>`,
    `<path class="rg" d="M40 260 L40 200 C40 186 52 180 70 176 L120 120 C130 108 140 104 160 104 L260 104 C280 104 292 112 300 124 L330 176 C352 180 364 190 364 206 L364 260 Z"/><path class="rg" d="M132 172 L166 124 L220 124 L220 172 Z"/><path class="rg" d="M236 172 L236 124 L282 124 L310 172 Z"/><circle class="rg" cx="110" cy="264" r="38"/><circle class="rg" cx="290" cy="264" r="38"/><circle cx="110" cy="264" r="14" fill="#adb5bd"/><circle cx="290" cy="264" r="14" fill="#adb5bd"/><rect class="rg" x="340" y="206" width="22" height="20" rx="6"/>`];
  let curCol = 0, pic = 0;
  function fillRg(r) { r.style.fill = PAL[curCol]; r.dataset.done = '1'; SND.pop(1 + curCol * .08); const b = r.getBoundingClientRect(); confetti(8, b.left + b.width / 2, b.top + b.height / 2); checkDone(); }
  function checkDone() { const all = [...game.querySelectorAll('.rg')]; if (all.every(r => r.dataset.done)) { SND.tada(); yay(400); confetti(80); later(() => { pic = (pic + 1) % PICS.length; coloring.draw(); }, 3500); } }
  const coloring = {
    noTap: true, nav: false,
    start() { reset(); voice('color_hi', '', 300); coloring.draw(); },
    draw() {
      game.innerHTML = '';
      A.setBody('#e7f5ff');
      game.innerHTML = `<div class="colorWrap"><div class="ctools"><div class="palette">${PAL.map((c, j) => `<button class="sw${j === curCol ? ' sel' : ''}" data-c="${j}" style="background:${c}"></button>`).join('')}</div>
        <button class="gbtn" id="magic">✨ لوّني</button><button class="gbtn" id="nextPic">🖼️ رسمة ثانية</button></div>
        <svg class="canvasPic" viewBox="0 0 400 400" style="fill:#fff">${PICS[pic]}</svg></div>`;
      game.querySelectorAll('.rg').forEach(r => r.addEventListener('click', e => { e.stopPropagation(); fillRg(r); }));
      game.querySelectorAll('.sw').forEach(b => b.onclick = () => { curCol = +b.dataset.c; game.querySelectorAll('.sw').forEach(x => x.classList.toggle('sel', x === b)); SND.pop(1.3); });
      $('#magic').onclick = () => { const r = [...game.querySelectorAll('.rg')].find(x => !x.dataset.done) || game.querySelector('.rg'); if (r) fillRg(r); };
      $('#nextPic').onclick = () => { pic = (pic + 1) % PICS.length; coloring.draw(); };
      focusFirst('#magic');
    },
    key(k) { nav(k); },
    step(d) { pic = (pic + d + PICS.length) % PICS.length; coloring.draw(); }
  };

  window.MODES = { abc, n123, colors, shapes, adhkar, opp, where, who, feed, hide, piano, coloring };
})();
