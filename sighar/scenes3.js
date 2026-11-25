/* الدفعة الثالثة: س سمكة، ض ضفدع، ن نحلة، ر ريشة، ط طائرة، ش شمس، غ غيمة */
(function () {
  const S = window.SCENES || (window.SCENES = {});
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d1d1d"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .35}" fill="#fff"/>`;
  const cloud = (top, left, w, dur) => `<svg class="cloud" style="top:${top}vh;left:${left}vw;width:${w}vh;animation-duration:${dur}s;animation-delay:-${dur / 3}s" viewBox="0 0 120 60"><g fill="#fff"><circle cx="35" cy="38" r="20"/><circle cx="60" cy="28" r="26"/><circle cx="88" cy="38" r="20"/><rect x="30" y="38" width="62" height="20" rx="10"/></g></svg>`;
  const back = (vb, h, inner, extra) => `<svg class="backdrop" viewBox="${vb}" preserveAspectRatio="none" style="height:${h}vh;${extra || ''}">${inner}</svg>`;

  // حركة قفز الضفدع: ٦ قفزات، كل قفزة: جلوس ثم وثبة
  const hopX = [100, 80, 62, 44, 26, 8, -40];
  let frogKF = '@keyframes froggo{';
  for (let i = 0; i < 6; i++) {
    const a = i * 100 / 6, m = a + 50 / 6, top = a + 75 / 6, b = (i + 1) * 100 / 6;
    frogKF += `${a.toFixed(2)}%,${m.toFixed(2)}%{transform:translate(${hopX[i]}vw,0)}${top.toFixed(2)}%{transform:translate(${(hopX[i] + hopX[i + 1]) / 2}vw,-22vh) rotate(-10deg)}${(b - .01).toFixed(2)}%{transform:translate(${hopX[i + 1]}vw,0)}`;
  }
  frogKF += '}';

  const css = `${frogKF}
  .swimmer{top:42vh;width:40vh;height:27vh}
  .wavy{width:100%;height:100%;animation:wavy 2.2s ease-in-out infinite}
  @keyframes wavy{50%{transform:translateY(-7vh) rotate(-5deg)}}
  .ftail{transform-origin:0% 50%;animation:wag .32s ease-in-out infinite alternate}
  .fin{transform-origin:50% 0%;animation:wag .5s ease-in-out infinite alternate}
  .bub{transform-origin:50% 50%;animation:bub 2.2s ease-in infinite}.bub.k2{animation-delay:-.7s}.bub.k3{animation-delay:-1.4s}
  @keyframes bub{from{transform:translate(0,0) scale(.5);opacity:.9}to{transform:translate(-14px,-110px) scale(1.4);opacity:0}}
  .sbub{position:absolute;bottom:-6vh;width:3vh;height:3vh;border:3px solid rgba(255,255,255,.75);border-radius:50%;animation:risebub 7s linear infinite}
  @keyframes risebub{to{transform:translate(4vw,-115vh)}}
  .weed{transform-origin:50% 100%;animation:swish 3s ease-in-out infinite}.weed.w2{animation-delay:-1.5s}
  .frog{bottom:13vh;width:26vh;height:22vh;animation:froggo 13s linear infinite}
  .fleg{transform-origin:20% 20%;animation:fleg 2.1667s ease-in-out infinite}
  @keyframes fleg{0%,50%,100%{transform:rotate(0)}62%,80%{transform:rotate(-55deg)}}
  .sac{transform-origin:50% 0%;animation:sac 2.1667s ease-in-out infinite}
  @keyframes sac{0%,8%,46%,100%{transform:scale(.6)}18%,36%{transform:scale(1.25)}27%{transform:scale(.8)}}
  .pad{position:absolute;bottom:11vh;width:22vh;height:6vh;border-radius:50%;background:#37b24d;box-shadow:inset 0 -1vh 0 #2b8a3e}
  .bee{top:16vh;width:22vh;height:18vh;animation:beefly 11s ease-in-out infinite}
  @keyframes beefly{0%{transform:translate(105vw,24vh)}15%{transform:translate(80vw,6vh) rotate(-8deg)}28%{transform:translate(66vw,40vh)}36%{transform:translate(66vw,38vh) rotate(6deg)}50%{transform:translate(46vw,10vh) rotate(-8deg)}63%{transform:translate(30vw,42vh)}71%{transform:translate(30vw,40vh) rotate(6deg)}85%{transform:translate(12vw,14vh)}100%{transform:translate(-40vh,26vh)}}
  .bwing{transform-origin:50% 100%;animation:buzz .05s linear infinite alternate}.bwing.w2{animation-delay:-.025s}
  @keyframes buzz{from{transform:scaleY(1)}to{transform:scaleY(.35)}}
  .featherA{left:42vw;top:0;width:22vh;height:38vh;animation:fall 11s linear infinite}
  @keyframes fall{from{transform:translateY(-35vh)}to{transform:translateY(85vh)}}
  .sway{width:100%;height:100%;animation:sway 2.6s ease-in-out infinite alternate}
  @keyframes sway{from{transform:translateX(-16vw) rotate(-32deg)}to{transform:translateX(16vw) rotate(32deg)}}
  .plane{top:0;width:46vh;height:24vh;animation:takeoff 9s ease-in infinite}
  @keyframes takeoff{0%{transform:translate(105vw,62vh)}25%{transform:translate(72vw,61vh) rotate(-2deg)}100%{transform:translate(-55vh,2vh) rotate(-14deg)}}
  .prop{transform-origin:50% 50%;animation:prop .06s linear infinite alternate}
  @keyframes prop{from{transform:scaleY(1)}to{transform:scaleY(.12)}}
  .puff{transform-origin:50% 50%;animation:puff 1s ease-out infinite}.puff.k2{animation-delay:-.33s}.puff.k3{animation-delay:-.66s}
  @keyframes puff{from{transform:scale(.4);opacity:.9}to{transform:scale(1.8) translateX(40px);opacity:0}}
  .sunact{left:calc(50vw - 22vh);bottom:2vh;width:44vh;height:44vh;animation:sunrise 14s ease-out infinite}
  @keyframes sunrise{0%{transform:translateY(48vh)}30%,100%{transform:translateY(0)}}
  .rays{transform-origin:50% 50%;animation:spinr 14s linear infinite}
  @keyframes spinr{to{transform:rotate(360deg)}}
  .blink{transform-origin:50% 50%;animation:blink 4s infinite}
  @keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  .rcloud{top:36vh;width:52vh;height:46vh;animation:walk 24s linear infinite}
  .drop{animation:drop 1s linear infinite}
  @keyframes drop{from{transform:translateY(0);opacity:1}to{transform:translateY(130px);opacity:0}}`;
  if (!document.getElementById('scenes3css')) { const st = document.createElement('style'); st.id = 'scenes3css'; st.textContent = css; document.head.appendChild(st); }

  const FISH = `<div class="actor walker swimmer" style="animation-duration:14s"><div class="yaywrap"><div class="wavy"><svg viewBox="0 0 240 160">
    <circle class="p bub" cx="30" cy="70" r="6" fill="none" stroke="#fff" stroke-width="2.5"/><circle class="p bub k2" cx="34" cy="74" r="4" fill="none" stroke="#fff" stroke-width="2.5"/><circle class="p bub k3" cx="28" cy="72" r="5" fill="none" stroke="#fff" stroke-width="2.5"/>
    <path class="p ftail" d="M172 80 L226 36 C218 60 218 100 226 124 Z" fill="#f76707"/>
    <path class="p fin" d="M100 40 C112 14 146 16 160 44 Z" fill="#f76707"/>
    <ellipse cx="110" cy="80" rx="72" ry="46" fill="#ff922b"/>
    <path d="M122 38 C110 60 110 100 122 122 M148 46 C138 66 138 96 148 114" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path class="p fin" d="M104 92 C112 112 132 116 140 104 Z" fill="#f76707"/>
    <circle cx="70" cy="68" r="15" fill="#fff"/>${eye(66, 68, 8)}
    <path d="M44 92 q10 8 20 0" stroke="#c2410c" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="86" cy="92" r="7" fill="#ffa8a8" opacity=".7"/>
  </svg></div></div></div>`;

  const FROG = `<div class="actor frog"><div class="yaywrap"><svg viewBox="0 0 220 180">
    <g class="p fleg"><path d="M150 140 C190 136 206 160 196 174 L150 170 Z" fill="#40c057"/><path d="M178 172 l22 0 M182 166 l20 -4" stroke="#2f9e44" stroke-width="5" stroke-linecap="round"/></g>
    <ellipse cx="108" cy="122" rx="68" ry="46" fill="#51cf66"/>
    <ellipse cx="104" cy="134" rx="44" ry="26" fill="#d8f5a2"/>
    <ellipse class="p sac" cx="80" cy="150" rx="24" ry="16" fill="#b2f2bb"/>
    <circle cx="76" cy="70" r="22" fill="#51cf66"/><circle cx="130" cy="70" r="22" fill="#51cf66"/>
    <circle cx="76" cy="68" r="14" fill="#fff"/><circle cx="130" cy="68" r="14" fill="#fff"/>${eye(74, 68, 7)}${eye(128, 68, 7)}
    <path d="M62 108 Q100 132 142 106" stroke="#2b8a3e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="100" r="7" fill="#ffa8a8" opacity=".7"/><circle cx="146" cy="98" r="7" fill="#ffa8a8" opacity=".7"/>
    <path d="M70 162 l-14 10 M78 164 l-4 12 M86 162 l8 10" stroke="#40c057" stroke-width="6" stroke-linecap="round"/>
  </svg></div></div>`;

  const BEE = `<div class="actor bee"><div class="yaywrap"><svg viewBox="0 0 200 160">
    <defs><clipPath id="beeBody"><ellipse cx="110" cy="100" rx="56" ry="38"/></clipPath></defs>
    <ellipse class="p bwing" cx="104" cy="44" rx="26" ry="36" fill="rgba(208,235,255,.85)" stroke="#a5d8ff" stroke-width="3"/>
    <ellipse class="p bwing w2" cx="134" cy="48" rx="22" ry="30" fill="rgba(208,235,255,.85)" stroke="#a5d8ff" stroke-width="3"/>
    <path d="M164 100 L186 96 L166 110 Z" fill="#343a40"/>
    <g clip-path="url(#beeBody)"><rect x="40" y="50" width="140" height="100" fill="#fcc419"/><rect x="96" y="50" width="16" height="100" fill="#212529"/><rect x="128" y="50" width="16" height="100" fill="#212529"/><rect x="158" y="50" width="16" height="100" fill="#212529"/></g>
    <circle cx="58" cy="94" r="30" fill="#fcc419"/>
    <path d="M50 66 Q42 40 30 36 M64 64 Q66 40 78 32" stroke="#212529" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="30" cy="36" r="5" fill="#212529"/><circle cx="78" cy="32" r="5" fill="#212529"/>
    ${eye(48, 90, 6)}${eye(70, 88, 6)}<path d="M48 106 q10 8 20 0" stroke="#212529" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="40" cy="104" r="6" fill="#ffa8a8" opacity=".8"/>
  </svg></div></div>`;

  const FEATHER = `<div class="actor featherA"><div class="yaywrap"><div class="sway"><svg viewBox="0 0 120 220">
    <path d="M60 210 C58 150 62 80 70 10" stroke="#7048e8" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M68 18 C30 40 20 110 58 170 C64 120 66 70 68 18 Z" fill="#4dabf7"/>
    <path d="M70 14 C104 40 108 110 60 172 C64 120 66 70 70 14 Z" fill="#748ffc"/>
    <path d="M64 60 L36 74 M62 90 L32 104 M60 120 L40 132 M68 60 L94 70 M66 90 L98 100 M62 124 L86 134" stroke="#fff" stroke-width="2.5" opacity=".7" stroke-linecap="round"/>
  </svg></div></div></div>`;

  const PLANE = `<div class="actor plane"><div class="yaywrap"><svg viewBox="0 0 300 150">
    <circle class="p puff" cx="262" cy="78" r="12" fill="#fff"/><circle class="p puff k2" cx="262" cy="78" r="12" fill="#fff"/><circle class="p puff k3" cx="262" cy="78" r="12" fill="#fff"/>
    <path d="M200 70 L240 22 L262 22 L246 76 Z" fill="#c92a2a"/>
    <path d="M60 64 C60 48 90 44 130 44 L230 52 C252 56 256 92 230 96 L110 100 C80 100 60 86 60 64 Z" fill="#fa5252"/>
    <path d="M232 60 L262 64 L262 84 L232 86 Z" fill="#c92a2a"/>
    <g fill="#d0ebff" stroke="#fff" stroke-width="3"><circle cx="120" cy="66" r="10"/><circle cx="150" cy="66" r="10"/><circle cx="180" cy="66" r="10"/></g>
    <path d="M78 58 C80 50 96 48 104 52 L100 66 L80 66 Z" fill="#a5d8ff"/>
    <path d="M120 82 L190 82 L150 130 L130 130 Z" fill="#c92a2a"/>
    <circle cx="58" cy="70" r="9" fill="#868e96"/>
    <ellipse class="p prop" cx="50" cy="70" rx="5" ry="34" fill="#495057" opacity=".85"/>
    <text x="196" y="90" font-size="16" font-weight="800" fill="#fff" font-family="Tajawal,sans-serif">ط</text>
  </svg></div></div>`;

  const rays = [...Array(12)].map((_, i) => `<rect x="94" y="4" width="12" height="34" rx="6" fill="#fab005" transform="rotate(${i * 30} 100 100)"/>`).join('');
  const SUN = `<div class="actor sunact"><div class="yaywrap"><svg viewBox="0 0 200 200">
    <g class="p rays">${rays}</g>
    <circle cx="100" cy="100" r="58" fill="#ffd43b" stroke="#fcc419" stroke-width="6"/>
    <g class="p blink">${eye(80, 92, 7)}${eye(120, 92, 7)}</g>
    <circle cx="70" cy="112" r="9" fill="#ff8787" opacity=".6"/><circle cx="130" cy="112" r="9" fill="#ff8787" opacity=".6"/>
    <path d="M80 116 Q100 136 120 116" stroke="#e8590c" stroke-width="5" fill="none" stroke-linecap="round"/>
  </svg></div></div>`;

  const drops = [[60, 0], [90, -.3], [120, -.6], [150, -.15], [180, -.45], [75, -.8], [135, -.9], [165, -.7]].map(([x, d]) => `<path class="p drop" style="animation-delay:${d}s" d="M${x} 130 C${x - 6} 142 ${x - 6} 150 ${x} 150 C${x + 6} 150 ${x + 6} 142 ${x} 130 Z" fill="#4dabf7"/>`).join('');
  const RAINCLOUD = `<div class="actor rcloud"><div class="yaywrap"><svg viewBox="0 0 240 260">${drops}
    <g fill="#e9ecef"><circle cx="70" cy="90" r="40"/><circle cx="118" cy="66" r="52"/><circle cx="170" cy="90" r="40"/><rect x="40" y="90" width="160" height="40" rx="20"/></g>
    <g class="p blink">${eye(100, 92, 6)}${eye(140, 92, 6)}</g>
    <path d="M108 108 Q120 118 132 108" stroke="#495057" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="88" cy="106" r="7" fill="#ffa8a8" opacity=".7"/><circle cx="152" cy="106" r="7" fill="#ffa8a8" opacity=".7"/>
  </svg></div></div>`;

  const seaweed = [8, 22, 74, 90].map((l, i) => `<svg class="p weed ${i % 2 ? 'w2' : ''}" style="position:absolute;bottom:0;left:${l}vw;height:${26 + i % 2 * 8}vh;width:auto;transform-box:fill-box" viewBox="0 0 40 200"><path d="M20 200 C0 150 40 110 20 60 C10 30 24 10 20 0" stroke="#2f9e44" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`).join('');
  const sbubs = [[10, 0], [30, -2], [55, -4], [70, -1], [88, -5]].map(([l, d]) => `<div class="sbub" style="left:${l}vw;animation-delay:${d}s"></div>`).join('');
  const pads = hopX.slice(1, 6).map(x => `<div class="pad" style="left:calc(${x}vw + 2vh)"></div>`).join('');
  const water = `<div style="position:absolute;left:0;right:0;bottom:0;height:16vh;background:#339af0"></div>`;
  const rainbow = `<svg class="backdrop" viewBox="0 0 400 200" style="width:60vw;left:20vw;bottom:9vh;opacity:.45">${['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'].map((c, i) => `<path d="M${20 + i * 12} 200 A${180 - i * 12} ${180 - i * 12} 0 0 1 ${380 - i * 12} 200" stroke="${c}" stroke-width="12" fill="none"/>`).join('')}</svg>`;

  Object.assign(S, {
    11: { bg: '#4dabf7', ink: '#fff', sound: 'blub', html: sbubs + seaweed + `<div class="ground" style="background:#ffe8a3;height:7vh"></div>` + FISH },
    14: { bg: '#c3fae8', ink: '#2b8a3e', sound: 'frog', html: water + pads + FROG },
    24: { bg: '#e7f5ff', ink: '#e67700', sound: 'bee', html: cloud(10, 40, 16, 45) + `<div class="ground" style="background:#8ce99a"></div><div class="deco emo" style="left:calc(66vw + 6vh);bottom:7vh;font-size:12vh">🌻</div><div class="deco emo" style="left:calc(30vw + 6vh);bottom:7vh;font-size:12vh">🌸</div><div class="deco emo" style="left:84vw;bottom:6vh">🌼</div>` + BEE },
    9: { bg: '#e5dbff', ink: '#5f3dc4', sound: 'whoosh', html: cloud(14, 15, 18, 50) + cloud(30, 70, 14, 60) + FEATHER },
    15: { bg: '#a5d8ff', ink: '#1864ab', sound: 'plane', html: cloud(12, 20, 18, 40) + cloud(26, 75, 15, 55) + `<div class="ground" style="background:#adb5bd;height:9vh"></div><div style="position:absolute;bottom:4vh;left:0;right:0;height:1vh;background:repeating-linear-gradient(90deg,#fff 0 6vw,transparent 6vw 10vw)"></div>` + PLANE },
    12: { bg: '#ffe3e3', ink: '#e8590c', sound: 'tada', html: SUN + back('0 0 1000 300', 30, `<path d="M0 300 L0 140 Q250 40 500 150 Q750 250 1000 120 L1000 300 Z" fill="#8ce99a"/><path d="M0 300 L0 220 Q300 140 600 230 Q820 290 1000 210 L1000 300 Z" fill="#69db7c"/>`, 'z-index:3') },
    18: { bg: '#d0ebff', ink: '#1971c2', sound: 'rain', html: rainbow + `<div class="ground" style="background:#8ce99a"></div><div class="deco emo" style="left:14vw;bottom:6vh">🌷</div><div class="deco emo" style="left:48vw;bottom:5vh">🌱</div><div class="deco emo" style="left:80vw;bottom:6vh">🌷</div>` + RAINCLOUD }
  });
})();
