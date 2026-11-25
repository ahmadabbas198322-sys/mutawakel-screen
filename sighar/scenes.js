/* مشاهد الحروف المتحركة — كل شخصية مرسومة بأجزاء منفصلة تتحرك (أجنحة، أرجل، رقبة، أذنين، ذيل) */
window.SCENES = (function () {
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="8" fill="rgba(0,0,0,.15)"/>`;
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d1d1d"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .35}" fill="#fff"/>`;
  const cloud = (top, left, w, dur, delay) => `<svg class="cloud" style="top:${top}vh;left:${left}vw;width:${w}vh;animation-duration:${dur}s;animation-delay:${delay}s" viewBox="0 0 120 60"><g fill="#fff"><circle cx="35" cy="38" r="20"/><circle cx="60" cy="28" r="26"/><circle cx="88" cy="38" r="20"/><rect x="30" y="38" width="62" height="20" rx="10"/></g></svg>`;

  const FALCON = `<div class="actor falcon"><div class="yaywrap"><svg viewBox="0 0 300 200">
    <g class="p wing far"><path d="M150 108 C158 62 196 26 240 10 C232 44 212 78 182 110 Z" fill="#5a3a1e"/></g>
    <path d="M205 108 L282 94 L292 112 L282 134 L205 132 Z" fill="#7a4b22"/>
    <path d="M232 104 L284 100 M232 122 L288 120" stroke="#4a2e14" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="160" cy="118" rx="62" ry="28" fill="#8b5a2b"/>
    <ellipse cx="148" cy="128" rx="44" ry="16" fill="#f1e0bd"/>
    <path d="M128 124 l6 5 l6 -5 M146 128 l6 5 l6 -5 M164 124 l6 5 l6 -5" stroke="#8b5a2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M170 142 q6 10 18 8 M182 142 q6 10 18 8" stroke="#f4c20d" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="96" cy="100" r="27" fill="#5a3a1e"/>
    <path d="M84 104 q8 20 30 12 q-10 -6 -12 -18 z" fill="#fff"/>
    <circle cx="90" cy="94" r="8.5" fill="#fff" stroke="#f4c20d" stroke-width="3"/>${eye(88, 94, 4.5)}
    <path d="M72 94 C60 94 50 100 50 112 C57 105 64 105 72 108 Z" fill="#f4c20d"/>
    <g class="p wing near"><path d="M138 112 C146 58 200 18 262 4 C252 46 226 86 182 118 Z" fill="#7a4b22"/>
      <path d="M168 94 L234 24 M162 104 L220 50 M182 104 L246 40" stroke="#5a3a1e" stroke-width="3" stroke-linecap="round"/></g>
  </svg></div></div>`;

  const legG = (cls, x, top, h, col, hoof) => `<g class="p leg ${cls}"><rect x="${x}" y="${top}" width="18" height="${h}" rx="9" fill="${col}"/><rect x="${x - 2}" y="${top + h - 14}" width="22" height="16" rx="6" fill="${hoof}"/></g>`;

  const GIRAFFE = `<div class="actor giraffe"><div class="yaywrap"><svg viewBox="0 0 300 330">
    ${shadow(170, 318, 92)}
    ${legG('b', 128, 190, 124, '#d9a441', '#5a3a1e')}${legG('a', 222, 190, 124, '#d9a441', '#5a3a1e')}
    <g class="p tail"><path d="M248 176 Q264 200 260 234" stroke="#d9a441" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="260" cy="238" rx="6" ry="11" fill="#6b4423"/></g>
    <g class="bob">
      <ellipse cx="180" cy="190" rx="78" ry="44" fill="#f2c14e"/>
      <g fill="#c47d2a"><ellipse cx="150" cy="178" rx="13" ry="10"/><ellipse cx="186" cy="168" rx="11" ry="9"/><ellipse cx="216" cy="184" rx="14" ry="10"/><ellipse cx="170" cy="206" rx="12" ry="9"/><ellipse cx="206" cy="212" rx="10" ry="8"/><ellipse cx="240" cy="198" rx="8" ry="9"/><ellipse cx="130" cy="202" rx="9" ry="8"/></g>
      <g class="p neck">
        <path d="M112 196 L74 62 L102 54 L148 180 Z" fill="#f2c14e"/>
        <path d="M104 58 L146 176" stroke="#c47d2a" stroke-width="6" stroke-dasharray="7 6"/>
        <g fill="#c47d2a"><ellipse cx="96" cy="100" rx="8" ry="7"/><ellipse cx="110" cy="138" rx="9" ry="8"/><ellipse cx="124" cy="168" rx="8" ry="7"/></g>
        <path d="M88 32 L91 10 M100 34 L107 14" stroke="#d9a441" stroke-width="6" stroke-linecap="round"/>
        <circle cx="91" cy="9" r="5.5" fill="#6b4423"/><circle cx="107" cy="13" r="5.5" fill="#6b4423"/>
        <ellipse cx="108" cy="42" rx="13" ry="6" transform="rotate(25 108 42)" fill="#e7a83e"/>
        <ellipse cx="74" cy="52" rx="33" ry="20" transform="rotate(-12 74 52)" fill="#f2c14e"/>
        <ellipse cx="47" cy="62" rx="16" ry="13" fill="#e7a83e"/>
        <circle cx="40" cy="57" r="2.5" fill="#6b4423"/>
        <path d="M42 71 q8 5 15 0" stroke="#6b4423" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        ${eye(78, 44, 6)}
      </g>
    </g>
    ${legG('a', 108, 196, 118, '#f2c14e', '#6b4423')}${legG('b', 200, 196, 118, '#f2c14e', '#6b4423')}
  </svg></div></div>`;

  const DUCK = `<div class="actor duck"><div class="yaywrap"><div class="swim"><svg viewBox="0 0 260 200">
    <ellipse class="p ripple" cx="236" cy="136" rx="22" ry="5" fill="none" stroke="#fff" stroke-width="3"/>
    <ellipse class="p ripple r2" cx="236" cy="136" rx="22" ry="5" fill="none" stroke="#fff" stroke-width="3"/>
    <g class="p paddle a"><path d="M122 128 L124 162" stroke="#ff922b" stroke-width="5" stroke-linecap="round"/><path d="M110 162 L138 162 L124 174 Z" fill="#ff922b"/></g>
    <g class="p paddle b"><path d="M156 128 L158 162" stroke="#ff922b" stroke-width="5" stroke-linecap="round"/><path d="M144 162 L172 162 L158 174 Z" fill="#ff922b"/></g>
    <path d="M62 108 C62 74 120 74 168 86 C198 93 222 82 236 70 C240 102 222 138 170 142 L92 142 C72 140 62 126 62 108 Z" fill="#ffd43b"/>
    <path class="p dwing" d="M112 100 C138 84 186 92 206 108 C186 126 140 126 112 110 Z" fill="#fab005"/>
    <g class="p dhead">
      <path d="M80 32 q2 -14 14 -12 q-9 3 -6 13" fill="#ffd43b"/>
      <circle cx="78" cy="60" r="30" fill="#ffd43b"/>
      <circle cx="88" cy="72" r="6" fill="#ffa8a8" opacity=".75"/>
      ${eye(70, 52, 5.5)}
      <path d="M52 58 C34 56 20 62 20 70 C32 77 46 75 54 70 Z" fill="#ff922b"/>
      <path d="M22 69 L52 65" stroke="#e8590c" stroke-width="2"/>
    </g>
  </svg></div></div></div>`;

  const RABBIT = `<div class="actor rabbit"><div class="yaywrap"><div class="hopper"><svg viewBox="0 0 240 240">
    <ellipse class="p bleg" cx="172" cy="214" rx="40" ry="13" fill="#e9ecef" stroke="#dee2e6" stroke-width="3"/>
    <circle cx="214" cy="156" r="16" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <ellipse cx="152" cy="168" rx="62" ry="48" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <ellipse cx="104" cy="211" rx="17" ry="10" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <g class="p ear">
      <ellipse cx="108" cy="50" rx="14" ry="44" transform="rotate(12 108 50)" fill="#e9ecef"/>
      <ellipse cx="84" cy="48" rx="15" ry="46" transform="rotate(-8 84 48)" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
      <ellipse cx="84" cy="50" rx="7" ry="32" transform="rotate(-8 84 50)" fill="#ffc9d6"/>
    </g>
    <circle cx="92" cy="118" r="42" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <circle cx="102" cy="134" r="8" fill="#ffc9d6"/>
    ${eye(78, 108, 6.5)}
    <path d="M52 120 l9 -5 l2 9 z" fill="#ff8fab"/>
    <path d="M57 126 q4 7 11 2" stroke="#adb5bd" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M60 124 L28 116 M60 128 L28 132" stroke="#ced4da" stroke-width="2" stroke-linecap="round"/>
  </svg></div></div></div>`;

  const cLeg = (cls, x, col) => `<g class="p leg ${cls}"><rect x="${x}" y="176" width="16" height="108" rx="8" fill="${col}"/><circle cx="${x + 8}" cy="236" r="9" fill="${col}"/><rect x="${x - 4}" y="272" width="24" height="14" rx="7" fill="#8a5a2b"/></g>`;
  const CAMEL = `<div class="actor camel"><div class="yaywrap"><svg viewBox="0 0 320 300">
    ${shadow(180, 290, 96)}
    ${cLeg('b', 132, '#b07a3f')}${cLeg('a', 236, '#b07a3f')}
    <g class="p tail"><path d="M262 152 Q274 176 270 204" stroke="#b07a3f" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="270" cy="208" rx="5" ry="9" fill="#6b4423"/></g>
    <g class="bob">
      <path d="M108 160 C112 128 148 124 162 114 C180 74 226 74 242 116 C258 122 268 138 265 165 C261 190 238 196 202 196 L136 196 C116 194 106 180 108 160 Z" fill="#d4a056"/>
      <path d="M166 112 C180 84 224 84 238 114 L244 150 L160 150 Z" fill="#c92a2a"/>
      <path d="M166 126 L240 126 M163 140 L243 140" stroke="#fff" stroke-width="3" stroke-dasharray="8 5"/>
      <path d="M172 104 L232 104" stroke="#2b8a3e" stroke-width="5" stroke-linecap="round"/>
      <g fill="#fcc419">${[166, 178, 190, 202, 214, 226, 238].map(x => `<circle cx="${x}" cy="154" r="4.5"/>`).join('')}</g>
      <g class="p neck">
        <path d="M122 168 C104 156 90 118 84 92 L108 84 C114 110 126 134 148 148 Z" fill="#d4a056"/>
        <ellipse cx="100" cy="64" rx="9" ry="5" transform="rotate(-30 100 64)" fill="#c58f4a"/>
        <ellipse cx="74" cy="78" rx="31" ry="18" fill="#d4a056"/>
        <ellipse cx="47" cy="86" rx="14" ry="12" fill="#c58f4a"/>
        <circle cx="42" cy="82" r="2.5" fill="#6b4423"/>
        <path d="M42 94 q7 4 13 0" stroke="#6b4423" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M60 72 L62 98 M61 84 L98 82" stroke="#c92a2a" stroke-width="3.5" stroke-linecap="round"/>
        ${eye(80, 72, 5)}
        <path d="M76 66 l-2 -5 M80 65 l0 -5 M84 66 l2 -5" stroke="#6b4423" stroke-width="1.8" stroke-linecap="round"/>
      </g>
    </g>
    ${cLeg('a', 112, '#d4a056')}${cLeg('b', 214, '#d4a056')}
  </svg></div></div>`;

  return {
    13: { // ص صقر
      bg: '#74c0fc', ink: '#0b4f8a', sound: 'screech',
      html: cloud(14, 10, 22, 40, -10) + cloud(30, 60, 16, 55, -30) + cloud(8, 80, 18, 48, -5) +
        `<svg class="backdrop" viewBox="0 0 1000 200" preserveAspectRatio="none" style="height:22vh"><path d="M0 200 L0 120 L120 40 L230 130 L340 60 L470 150 L600 50 L720 140 L850 70 L1000 150 L1000 200 Z" fill="#b197fc"/><path d="M0 200 L0 160 L160 100 L300 170 L450 110 L620 180 L780 120 L1000 180 L1000 200 Z" fill="#9775fa"/></svg>` + FALCON
    },
    10: { // ز زرافة
      bg: '#ffe8a3', ink: '#8f5a00', sound: 'boing',
      html: `<div class="sun" style="left:8vw;top:6vh"></div><div class="ground" style="background:#a9d36e"></div>
        <svg class="backdrop" viewBox="0 0 200 220" style="left:3vw;bottom:10vh;height:46vh;width:auto"><rect x="92" y="90" width="16" height="130" rx="6" fill="#8a5a2b"/><path d="M100 120 L60 80 M100 110 L140 70" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/><ellipse cx="100" cy="62" rx="98" ry="30" fill="#5c940d"/><ellipse cx="80" cy="50" rx="60" ry="20" fill="#74b816"/></svg>` + GIRAFFE
    },
    1: { // ب بطة
      bg: '#a5d8ff', ink: '#0b7285', sound: 'duck',
      html: cloud(10, 20, 18, 50, -20) + cloud(18, 70, 14, 60, -40) +
        `<svg class="backdrop" viewBox="0 0 120 200" style="right:2vw;bottom:16vh;height:34vh;width:auto"><g stroke="#2b8a3e" stroke-width="5" stroke-linecap="round"><path d="M20 200 Q24 100 14 20"/><path d="M50 200 Q48 90 60 30"/><path d="M84 200 Q90 120 104 60"/></g><g fill="#8a5a2b"><rect x="8" y="18" width="12" height="40" rx="6"/><rect x="55" y="28" width="12" height="38" rx="6"/></g></svg>` +
        DUCK + `<div class="water"></div>`
    },
    0: { // أ أرنب
      bg: '#d0ebff', ink: '#2b8a3e', sound: 'boing',
      html: cloud(12, 15, 18, 45, -15) + `<div class="ground" style="background:#69db7c"></div>
        <div class="deco emo" style="left:6vw;bottom:8vh">🌷</div><div class="deco emo" style="left:30vw;bottom:5vh">🌼</div><div class="deco emo" style="left:58vw;bottom:9vh">🥕</div><div class="deco emo" style="left:84vw;bottom:6vh">🌷</div>` + RABBIT
    },
    4: { // ج جمل
      bg: '#ffd8a8', ink: '#b35c00', sound: 'camel',
      html: `<div class="sun" style="right:10vw;top:8vh"></div>
        <svg class="backdrop" viewBox="0 0 1000 300" preserveAspectRatio="none" style="height:34vh"><path d="M0 300 L0 150 Q200 60 420 160 Q620 240 800 120 Q900 80 1000 130 L1000 300 Z" fill="#f4c27a"/><path d="M0 300 L0 230 Q250 160 500 240 Q760 300 1000 210 L1000 300 Z" fill="#e8a952"/></svg>` + CAMEL
    }
  };
})();
