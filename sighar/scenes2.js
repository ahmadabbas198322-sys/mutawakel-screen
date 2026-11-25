/* الدفعة الثانية: حيوانات تمشي — ث ثعلب، ح حصان، خ خروف، د دجاجة، ذ ذئب، ف فيل، ق قطة، ك كلب */
(function () {
  const S = window.SCENES || (window.SCENES = {});
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d1d1d"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .35}" fill="#fff"/>`;
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="7" fill="rgba(0,0,0,.15)"/>`;
  const leg = (cls, x, top, h, w, col, foot) => `<g class="p leg ${cls}"><rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${w / 2}" fill="${col}"/><rect x="${x - 2}" y="${top + h - 12}" width="${w + 4}" height="14" rx="6" fill="${foot}"/></g>`;
  // ترتيب الرسم: الأرجل البعيدة، الذيل، الجسم والرأس، الأرجل القريبة
  const quad = (o) => `<svg viewBox="${o.vb}">${shadow(o.sx, o.sy, o.sr)}
    ${leg('b', o.x[1], o.top, o.h, o.w, o.far, o.foot)}${leg('a', o.x[3], o.top, o.h, o.w, o.far, o.foot)}
    ${o.tail}<g class="bob">${o.body}</g>
    ${leg('a', o.x[0], o.top, o.h, o.w, o.col, o.foot)}${leg('b', o.x[2], o.top, o.h, o.w, o.col, o.foot)}</svg>`;
  const actor = (cls, style, svg) => `<div class="actor walker ${cls}" style="${style}"><div class="yaywrap">${svg}</div></div>`;
  const ground = (c) => `<div class="ground" style="background:${c}"></div>`;
  const cloud = (top, left, w, dur) => `<svg class="cloud" style="top:${top}vh;left:${left}vw;width:${w}vh;animation-duration:${dur}s;animation-delay:-${dur / 3}s" viewBox="0 0 120 60"><g fill="#fff"><circle cx="35" cy="38" r="20"/><circle cx="60" cy="28" r="26"/><circle cx="88" cy="38" r="20"/><rect x="30" y="38" width="62" height="20" rx="10"/></g></svg>`;
  const back = (vb, h, inner, extra) => `<svg class="backdrop" viewBox="${vb}" preserveAspectRatio="none" style="height:${h}vh;${extra || ''}">${inner}</svg>`;

  /* ث ثعلب */
  const FOX = quad({ vb: '0 0 300 220', sx: 160, sy: 208, sr: 85, top: 135, h: 72, w: 14, col: '#e8590c', far: '#c2410c', foot: '#212529', x: [92, 110, 196, 212],
    tail: `<g class="p tail"><path d="M226 122 C268 98 300 128 292 160 C284 188 250 180 236 150 Z" fill="#f08c00"/><path d="M282 150 C294 162 288 184 268 178 C280 170 284 160 282 150 Z" fill="#fff"/></g>`,
    body: `<ellipse cx="160" cy="132" rx="72" ry="30" fill="#f08c00"/><ellipse cx="150" cy="146" rx="50" ry="13" fill="#fff4e6"/>
      <g class="p neck"><path d="M96 142 L80 98 L112 92 L128 132 Z" fill="#f08c00"/>
        <path d="M104 82 L118 56 L124 88 Z" fill="#c2410c"/>
        <path d="M48 96 C58 76 96 70 116 84 C120 100 104 116 84 114 C68 112 56 104 48 96 Z" fill="#f08c00"/>
        <path d="M48 96 C62 100 72 108 88 113 C70 118 56 110 48 96 Z" fill="#fff"/>
        <path d="M90 80 L96 50 L112 78 Z" fill="#f08c00"/><path d="M95 76 L98 60 L106 76 Z" fill="#343a40"/>
        <circle cx="47" cy="96" r="5.5" fill="#212529"/>${eye(84, 90, 4.8)}</g>` });

  /* ح حصان */
  const HORSE = quad({ vb: '0 0 320 280', sx: 165, sy: 270, sr: 95, top: 150, h: 110, w: 17, col: '#a0522d', far: '#7f3f1f', foot: '#343a40', x: [96, 116, 212, 232],
    tail: `<g class="p tail"><path d="M246 132 C278 136 290 178 278 218 C266 192 254 168 244 150 Z" fill="#3b2314"/></g>`,
    body: `<ellipse cx="166" cy="150" rx="86" ry="38" fill="#a0522d"/>
      <g class="p neck"><path d="M112 156 C100 122 92 94 88 70 L122 60 C126 92 136 118 154 138 Z" fill="#a0522d"/>
        <path d="M114 50 C126 46 134 48 140 60 C150 84 162 108 172 126 L156 142 C144 118 132 90 122 66 Z" fill="#3b2314"/>
        <path d="M58 72 C62 52 92 44 112 56 L120 72 C112 86 94 98 72 100 C60 100 52 88 58 72 Z" fill="#a0522d"/>
        <ellipse cx="62" cy="90" rx="15" ry="12" fill="#8b4513"/><circle cx="54" cy="86" r="2.6" fill="#2b1a0e"/>
        <path d="M104 50 L110 28 L120 52 Z" fill="#8b4513"/><path d="M112 46 C104 52 100 60 104 66 C110 58 116 54 122 52 Z" fill="#3b2314"/>
        ${eye(96, 66, 5.2)}<path d="M84 66 Q92 60 102 62 L104 68 L84 70 Z" fill="none"/></g>`,
    }).replace('</svg>', `<g class="dustg"><circle class="p dust" cx="258" cy="262" r="10" fill="#e9d8c4"/><circle class="p dust d2" cx="240" cy="266" r="8" fill="#e9d8c4"/></g></svg>`);

  /* خ خروف */
  const fluff = (pts, r) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
  const SHEEP = quad({ vb: '0 0 280 220', sx: 145, sy: 208, sr: 80, top: 140, h: 62, w: 13, col: '#495057', far: '#343a40', foot: '#212529', x: [94, 110, 178, 194],
    tail: `<g class="p tail"><circle cx="218" cy="122" r="13" fill="#f8f9fa" stroke="#dee2e6" stroke-width="3"/></g>`,
    body: `<g fill="#f8f9fa" stroke="#dee2e6" stroke-width="3">${fluff([[100, 120], [124, 98], [154, 92], [184, 98], [208, 118], [206, 148], [180, 160], [150, 162], [120, 158], [100, 144]], 24)}</g>
      <ellipse cx="154" cy="128" rx="62" ry="32" fill="#f8f9fa"/>
      <g class="p neck"><ellipse cx="66" cy="112" rx="22" ry="8" transform="rotate(-20 66 112)" fill="#343a40"/>
        <ellipse cx="80" cy="110" rx="25" ry="22" fill="#495057"/>
        <ellipse cx="104" cy="104" rx="16" ry="7" transform="rotate(25 104 104)" fill="#343a40"/>
        <g fill="#f8f9fa" stroke="#dee2e6" stroke-width="2">${fluff([[72, 88], [86, 84], [98, 90]], 10)}</g>
        <circle cx="72" cy="106" r="7" fill="#fff"/>${eye(70, 106, 4)}
        <path d="M60 124 q6 4 12 0" stroke="#212529" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>` });

  /* د دجاجة */
  const henLeg = (cls, x) => `<g class="p leg ${cls}"><rect x="${x}" y="168" width="8" height="46" rx="4" fill="#fab005"/><path d="M${x - 10} 216 L${x + 4} 208 L${x + 18} 216 M${x + 4} 208 L${x - 4} 218" stroke="#fab005" stroke-width="5" stroke-linecap="round" fill="none"/></g>`;
  const HEN = `<svg viewBox="0 0 240 240">${shadow(130, 222, 60)}${henLeg('b', 136)}
    <path d="M178 120 C200 76 226 82 224 104 C230 116 214 138 196 146 Z" fill="#f1f3f5"/><path d="M196 96 C212 84 222 92 216 104" stroke="#dee2e6" stroke-width="4" fill="none"/>
    <g class="bob"><ellipse cx="138" cy="140" rx="62" ry="48" fill="#fff"/>
      <path class="p dwing" d="M118 132 C144 112 186 120 196 140 C180 164 140 166 118 148 Z" fill="#e9ecef"/>
      <g class="p peck"><circle cx="80" cy="66" r="8" fill="#fa5252"/><circle cx="92" cy="60" r="9" fill="#fa5252"/><circle cx="104" cy="66" r="8" fill="#fa5252"/>
        <path d="M80 110 C76 130 90 150 110 150 L120 110 Z" fill="#fff"/>
        <circle cx="92" cy="92" r="28" fill="#fff"/>
        <path d="M66 86 L44 96 L66 104 Z" fill="#ff922b"/>
        <ellipse cx="70" cy="114" rx="7" ry="11" fill="#fa5252"/>${eye(84, 86, 5)}</g></g>
    ${henLeg('a', 116)}</svg>`;

  /* ذ ذئب */
  const WOLF = quad({ vb: '0 0 300 230', sx: 160, sy: 218, sr: 88, top: 140, h: 76, w: 15, col: '#868e96', far: '#5c636a', foot: '#495057', x: [92, 110, 196, 214],
    tail: `<g class="p tail"><path d="M228 126 C262 116 290 140 284 170 C266 168 246 154 232 142 Z" fill="#868e96"/><path d="M272 150 C284 156 286 166 284 170 C276 168 268 160 266 154 Z" fill="#dee2e6"/></g>`,
    body: `<ellipse cx="160" cy="136" rx="74" ry="32" fill="#868e96"/><ellipse cx="150" cy="152" rx="50" ry="12" fill="#dee2e6"/>
      <path d="M108 112 C130 102 170 100 200 108" stroke="#5c636a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <g class="p howl"><path d="M96 146 L80 98 L114 92 L130 134 Z" fill="#868e96"/>
        <path d="M44 94 C54 74 96 68 118 84 C122 102 106 118 84 116 C66 114 54 106 44 94 Z" fill="#868e96"/>
        <path d="M44 94 C60 100 72 108 90 114 C70 120 54 110 44 94 Z" fill="#dee2e6"/>
        <path d="M90 80 L94 48 L112 76 Z" fill="#868e96"/><path d="M95 74 L97 58 L106 74 Z" fill="#495057"/>
        <path d="M104 82 L118 54 L124 88 Z" fill="#5c636a"/>
        <circle cx="43" cy="94" r="5.5" fill="#212529"/>
        <circle cx="84" cy="89" r="5" fill="#ffd43b"/><circle cx="83" cy="89" r="2.6" fill="#1d1d1d"/></g>` });

  /* ف فيل */
  const ELEPHANT = quad({ vb: '0 0 330 270', sx: 180, sy: 260, sr: 105, top: 165, h: 88, w: 30, col: '#adb5bd', far: '#868e96', foot: '#e9ecef', x: [100, 128, 222, 250],
    tail: `<g class="p tail"><path d="M272 140 Q290 166 284 196" stroke="#868e96" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="284" cy="200" rx="5" ry="9" fill="#495057"/></g>`,
    body: `<ellipse cx="184" cy="150" rx="98" ry="64" fill="#adb5bd"/>
      <g class="p neck"><g class="p trunk"><path d="M54 128 C40 160 44 198 62 218 C68 224 78 218 72 208 C58 190 60 166 70 140 Z" fill="#adb5bd"/>
          <path d="M50 170 h10 M50 184 h10 M54 198 h10" stroke="#868e96" stroke-width="3" stroke-linecap="round"/></g>
        <circle cx="90" cy="116" r="48" fill="#adb5bd"/>
        <path d="M70 150 C64 164 52 168 44 164 C54 160 62 152 64 144 Z" fill="#fff"/>
        <g class="p ear2"><ellipse cx="128" cy="118" rx="34" ry="46" fill="#ced4da" stroke="#adb5bd" stroke-width="5"/><ellipse cx="130" cy="120" rx="20" ry="30" fill="#ffc9d6" opacity=".6"/></g>
        ${eye(78, 104, 6.5)}<circle cx="92" cy="122" r="8" fill="#ffc9d6" opacity=".7"/></g>` });

  /* ق قطة */
  const CAT = quad({ vb: '0 0 260 220', sx: 140, sy: 206, sr: 76, top: 140, h: 58, w: 14, col: '#ffa94d', far: '#f08c00', foot: '#fff4e6', x: [86, 102, 176, 192],
    tail: `<g class="p wave"><path d="M198 134 C228 122 236 84 220 56" stroke="#ffa94d" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M226 92 l10 -4 M222 76 l10 -2" stroke="#e8590c" stroke-width="4" stroke-linecap="round"/></g>`,
    body: `<ellipse cx="140" cy="140" rx="68" ry="29" fill="#ffa94d"/>
      <path d="M126 114 l4 14 M146 112 l2 14 M166 114 l0 14 M186 120 l-3 12" stroke="#e8590c" stroke-width="5" stroke-linecap="round"/>
      <g class="p neck"><path d="M54 84 L62 52 L80 78 Z" fill="#ffa94d"/><path d="M60 78 L63 62 L72 76 Z" fill="#ffc9d6"/>
        <path d="M86 76 L102 52 L106 84 Z" fill="#ffa94d"/><path d="M92 76 L101 62 L102 80 Z" fill="#ffc9d6"/>
        <circle cx="80" cy="104" r="31" fill="#ffa94d"/>
        <path d="M70 76 l2 10 M80 74 l0 10 M90 76 l-2 10" stroke="#e8590c" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="70" cy="100" rx="5" ry="7" fill="#2b8a3e"/><ellipse cx="70" cy="100" rx="2" ry="5" fill="#1d1d1d"/>
        <ellipse cx="92" cy="100" rx="5" ry="7" fill="#2b8a3e"/><ellipse cx="92" cy="100" rx="2" ry="5" fill="#1d1d1d"/>
        <path d="M78 112 l6 0 l-3 4 z" fill="#ff8fab"/><path d="M75 120 q6 5 6 -2 q0 7 6 2" stroke="#7f3f1f" stroke-width="2" fill="none"/>
        <path d="M66 114 L40 108 M66 118 L40 122 M96 114 L120 108 M96 118 L120 122" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>` });

  /* ك كلب */
  const DOG = quad({ vb: '0 0 270 230', sx: 145, sy: 214, sr: 80, top: 146, h: 60, w: 15, col: '#c08552', far: '#a0673a', foot: '#fff', x: [86, 102, 178, 194],
    tail: `<g class="p wag"><path d="M208 136 C228 122 236 106 236 90" stroke="#c08552" stroke-width="11" fill="none" stroke-linecap="round"/></g>`,
    body: `<ellipse cx="146" cy="146" rx="72" ry="32" fill="#c08552"/><ellipse cx="136" cy="160" rx="44" ry="13" fill="#fff"/><ellipse cx="176" cy="132" rx="20" ry="14" fill="#8b5a2b"/>
      <g class="p neck"><circle cx="82" cy="106" r="33" fill="#c08552"/>
        <ellipse cx="58" cy="120" rx="20" ry="14" fill="#f1d3b3"/>
        <g class="p tongue"><path d="M52 132 C52 146 64 148 64 134 Z" fill="#ff6b81"/></g>
        <path d="M48 128 q8 6 16 0" stroke="#5c3d1e" stroke-width="2.5" fill="none"/>
        <ellipse cx="44" cy="114" rx="7" ry="6" fill="#212529"/>${eye(72, 98, 5.5)}
        <g class="p fear"><ellipse cx="104" cy="104" rx="13" ry="28" transform="rotate(18 104 104)" fill="#8b5a2b"/></g></g>` });

  const moon = `<div style="position:absolute;right:12vw;top:8vh;width:14vh;height:14vh;border-radius:50%;background:#fff3bf;box-shadow:0 0 6vh rgba(255,243,191,.6)"></div>` +
    [[8, 12], [20, 30], [6, 48], [26, 62], [12, 78], [32, 90], [38, 20], [16, 92]].map(([t, l], i) => `<div class="twinkle" style="top:${t}vh;left:${l}vw;animation-delay:-${i * .4}s"></div>`).join('');
  const pines = (c1, c2) => back('0 0 1000 300', 40, [60, 200, 330, 520, 700, 860, 960].map((x, i) => `<path d="M${x} ${300} L${x - 60} 300 L${x} ${120 + (i % 3) * 30} L${x + 60} 300 Z" fill="${i % 2 ? c1 : c2}"/>`).join(''));
  const hills = (c1, c2) => back('0 0 1000 300', 36, `<path d="M0 300 L0 140 Q250 40 500 150 Q750 250 1000 120 L1000 300 Z" fill="${c1}"/><path d="M0 300 L0 220 Q300 140 600 230 Q820 290 1000 210 L1000 300 Z" fill="${c2}"/>`);
  const fence = back('0 0 1000 100', 14, [...Array(21)].map((_, i) => `<rect x="${i * 50}" y="10" width="14" height="90" rx="4" fill="#fff"/>`).join('') + `<rect x="0" y="30" width="1000" height="10" fill="#fff"/><rect x="0" y="62" width="1000" height="10" fill="#fff"/>`, 'bottom:10vh;opacity:.9');

  Object.assign(S, {
    3: { bg: '#ffe8cc', ink: '#c2410c', sound: 'boing', html: pines('#2f9e44', '#37b24d') + ground('#94d82d') + actor('fox', 'bottom:6vh;height:36vh;width:49vh;animation-duration:15s', FOX) },
    5: { bg: '#c5f6fa', ink: '#7f3f1f', sound: 'horse', html: cloud(10, 30, 18, 45) + fence + ground('#8ce99a') + actor('fast', 'bottom:6vh;height:44vh;width:50vh;animation-duration:7s', HORSE) },
    6: { bg: '#d3f9d8', ink: '#2b8a3e', sound: 'sheep', html: cloud(12, 60, 16, 50) + hills('#b2f2bb', '#8ce99a') + actor('', 'bottom:6vh;height:34vh;width:43vh;animation-duration:18s', SHEEP) },
    7: { bg: '#fff3bf', ink: '#c92a2a', sound: 'cluck', html: back('0 0 200 180', 34, `<path d="M20 180 L20 70 L100 20 L180 70 L180 180 Z" fill="#e03131"/><path d="M20 70 L100 20 L180 70" stroke="#fff" stroke-width="10" fill="none"/><rect x="70" y="100" width="60" height="80" fill="#fff" opacity=".9"/><path d="M70 100 L130 180 M130 100 L70 180" stroke="#e03131" stroke-width="6"/>`, 'left:auto;right:4vw;width:auto;bottom:10vh') + ground('#ffd8a8') + actor('', 'bottom:7vh;height:30vh;width:30vh;animation-duration:20s', HEN) },
    8: { bg: '#1c2a4a', ink: '#fff3bf', sound: 'howl', html: moon + hills('#2b3a5e', '#22304f') + actor('', 'bottom:5vh;height:36vh;width:47vh;animation-duration:16s', WOLF) },
    19: { bg: '#ffe8a3', ink: '#495057', sound: 'elephant', html: `<div class="sun" style="left:10vw;top:8vh"></div>` + ground('#c5e17a') + actor('slow', 'bottom:5vh;height:48vh;width:59vh;animation-duration:24s', ELEPHANT) },
    20: { bg: '#ffdeeb', ink: '#d6336c', sound: 'cat', html: ground('#b2f2bb') + `<div class="deco emo" style="left:12vw;bottom:7vh">🧶</div><div class="deco emo" style="left:70vw;bottom:6vh">🌸</div>` + actor('', 'bottom:6vh;height:34vh;width:40vh;animation-duration:15s', CAT) },
    21: { bg: '#d0ebff', ink: '#1864ab', sound: 'dog', html: cloud(10, 50, 18, 45) + ground('#8ce99a') + `<div class="deco emo" style="left:20vw;bottom:6vh">🦴</div><div class="deco emo" style="left:80vw;bottom:7vh">⚽</div>` + actor('', 'bottom:6vh;height:36vh;width:42vh;animation-duration:12s', DOG) }
  });
})();
