/* الدفعة الرابعة: ت تفاحة، ظ ظرف، ع عنب، ل ليمون، م موز، هـ هدية، و وردة، ي يد */
(function () {
  const S = window.SCENES || (window.SCENES = {});
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d1d1d"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .35}" fill="#fff"/>`;
  const face = (x, y, s, c) => `${eye(x - 9 * s, y, 3.6 * s)}${eye(x + 9 * s, y, 3.6 * s)}<path d="M${x - 7 * s} ${y + 8 * s} Q${x} ${y + 15 * s} ${x + 7 * s} ${y + 8 * s}" stroke="${c || '#5c3d1e'}" stroke-width="${2.6 * s}" fill="none" stroke-linecap="round"/><circle cx="${x - 15 * s}" cy="${y + 7 * s}" r="${4 * s}" fill="#ff8787" opacity=".55"/><circle cx="${x + 15 * s}" cy="${y + 7 * s}" r="${4 * s}" fill="#ff8787" opacity=".55"/>`;
  const ground = (c) => `<div class="ground" style="background:${c}"></div>`;
  const cloud = (top, left, w, dur) => `<svg class="cloud" style="top:${top}vh;left:${left}vw;width:${w}vh;animation-duration:${dur}s;animation-delay:-${dur / 3}s" viewBox="0 0 120 60"><g fill="#fff"><circle cx="35" cy="38" r="20"/><circle cx="60" cy="28" r="26"/><circle cx="88" cy="38" r="20"/><rect x="30" y="38" width="62" height="20" rx="10"/></g></svg>`;
  const star = (cx, cy, r, c) => { let d = ''; for (let k = 0; k < 10; k++) { const rr = k % 2 ? r / 2.2 : r, a = -Math.PI / 2 + k * Math.PI / 5; d += (k ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); } return `<path d="${d}Z" fill="${c}"/>`; };

  const css = `
  .center{left:calc(50vw - var(--w)/2)}
  .apple{width:8vh;height:8vh;bottom:29vh;left:calc(50vw + 2vh);animation:apfall 6s ease-in infinite}
  @keyframes apfall{0%,20%{transform:translate(0,0) rotate(0)}25%{transform:translate(0,0) rotate(10deg)}30%{transform:translate(0,0) rotate(-10deg)}35%{transform:translate(0,0) rotate(0)}48%{transform:translate(0,20vh)}56%{transform:translate(-3vw,13vh) rotate(-60deg)}64%{transform:translate(-6vw,20vh) rotate(-120deg)}70%{transform:translate(-8vw,16vh) rotate(-170deg)}76%{transform:translate(-10vw,20vh) rotate(-220deg)}94%{transform:translate(-30vw,20vh) rotate(-560deg);opacity:1}100%{transform:translate(-30vw,20vh) rotate(-560deg);opacity:0}}
  .env{--w:46vh;width:46vh;height:34vh;bottom:14vh}
  .flap{transform-origin:50% 0%;animation:flap4 5s ease-in-out infinite}
  @keyframes flap4{0%,15%,90%,100%{transform:scaleY(1)}30%,78%{transform:scaleY(-1)}}
  .heartup{transform-origin:50% 50%;animation:heartup 5s ease-in-out infinite}
  @keyframes heartup{0%,30%,92%,100%{transform:translateY(0) scale(.8)}50%{transform:translateY(-150px) scale(1.2)}58%{transform:translateY(-150px) scale(1)}66%{transform:translateY(-150px) scale(1.25)}74%{transform:translateY(-150px) scale(1)}}
  .grapes{--w:28vh;width:28vh;height:40vh;top:44vh}
  .pend{width:100%;height:100%;transform-origin:50% 0%;animation:pend 2.4s ease-in-out infinite}
  @keyframes pend{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
  .gb{transform-origin:50% 50%;animation:gb 1.6s ease-in-out infinite}
  @keyframes gb{0%,70%,100%{transform:scale(1)}80%{transform:scale(1.18)}90%{transform:scale(.94)}}
  .lemon{bottom:9vh;width:18vh;height:18vh}
  .lbounce{width:100%;height:100%;transform-origin:50% 100%;animation:lbounce .8s ease-in-out infinite}
  @keyframes lbounce{0%,100%{transform:translateY(0) scale(1.1,.9)}50%{transform:translateY(-12vh) rotate(-25deg) scale(.95,1.05)}}
  .banana{--w:30vh;width:30vh;height:46vh;bottom:9vh}
  .peelL{transform-origin:90% 100%;animation:peelL 6s ease-in-out infinite}
  .peelR{transform-origin:10% 100%;animation:peelR 6s ease-in-out infinite}
  @keyframes peelL{0%,15%,90%,100%{transform:rotate(0)}35%,75%{transform:rotate(-62deg)}}
  @keyframes peelR{0%,15%,90%,100%{transform:rotate(0)}35%,75%{transform:rotate(62deg)}}
  .bhappy{transform-origin:50% 100%;animation:bhappy 6s ease-in-out infinite}
  @keyframes bhappy{0%,35%,80%,100%{transform:translateY(0)}45%,65%{transform:translateY(-10px)}55%{transform:translateY(0)}}
  .gift{--w:34vh;width:34vh;height:40vh;bottom:10vh}
  .shake{transform-origin:50% 100%;animation:shake4 5s ease-in-out infinite}
  @keyframes shake4{0%,4%,12%,20%,28%,100%{transform:rotate(0)}8%,24%{transform:rotate(-6deg)}16%{transform:rotate(6deg)}}
  .lid{transform-origin:50% 100%;animation:lid 5s ease-in-out infinite}
  @keyframes lid{0%,34%,90%,100%{transform:translateY(0) rotate(0)}44%,80%{transform:translateY(-90px) rotate(-18deg)}}
  .gstar{transform-origin:50% 50%;opacity:0;animation:gstar 5s ease-out infinite}
  @keyframes gstar{0%,40%{transform:translate(0,0) scale(.3);opacity:0}46%{opacity:1}75%{transform:translate(var(--dx),-170px) scale(1.2) rotate(180deg);opacity:1}88%,100%{transform:translate(var(--dx),-200px) scale(.6);opacity:0}}
  .flower{--w:30vh;width:30vh;height:50vh;bottom:9vh}
  .stem{transform-origin:50% 100%;animation:stem 9s ease-out infinite}
  @keyframes stem{0%{transform:scaleY(0)}30%,90%{transform:scaleY(1)}100%{transform:scaleY(0)}}
  .bloom{transform-origin:50% 50%;animation:bloom 9s ease-out infinite}
  @keyframes bloom{0%,25%{transform:scale(0) rotate(-90deg)}40%{transform:scale(1.15) rotate(10deg)}46%,88%{transform:scale(1) rotate(0)}97%,100%{transform:scale(0)}}
  .leafpop{transform-origin:50% 100%;animation:leafpop 9s ease-out infinite}
  @keyframes leafpop{0%,15%{transform:scale(0)}28%,90%{transform:scale(1)}100%{transform:scale(0)}}
  .bfly{width:10vh;height:9vh;top:30vh;left:0;animation:bfly 9s ease-in-out infinite}
  @keyframes bfly{0%{transform:translate(105vw,10vh)}25%{transform:translate(70vw,-6vh)}45%{transform:translate(54vw,12vh)}55%{transform:translate(48vw,4vh)}75%{transform:translate(30vw,-8vh)}100%{transform:translate(-15vw,6vh)}}
  .bwl{transform-origin:100% 50%;animation:bwf .18s ease-in-out infinite alternate}
  .bwr{transform-origin:0% 50%;animation:bwf .18s ease-in-out infinite alternate}
  @keyframes bwf{from{transform:scaleX(1)}to{transform:scaleX(.25)}}
  .hand{--w:34vh;width:34vh;height:44vh;bottom:6vh}
  .wavehand{transform-origin:50% 100%;animation:wavehand .5s ease-in-out infinite alternate}
  @keyframes wavehand{from{transform:rotate(-18deg)}to{transform:rotate(18deg)}}
  .spark{transform-origin:50% 50%;animation:tw 1s ease-in-out infinite alternate}.spark.k2{animation-delay:-.5s}`;
  if (!document.getElementById('scenes4css')) { const st = document.createElement('style'); st.id = 'scenes4css'; st.textContent = css; document.head.appendChild(st); }
  const A = (cls, svg, style) => `<div class="actor ${cls}" style="${style || ''}"><div class="yaywrap">${svg}</div></div>`;

  /* ت تفاحة */
  const appleSvg = (s) => `<path d="M50 22 C34 8 8 16 8 44 C8 74 30 96 50 90 C70 96 92 74 92 44 C92 16 66 8 50 22 Z" fill="#fa5252"/><path d="M50 22 C50 14 52 8 58 2" stroke="#6b4423" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M56 12 C66 2 80 4 84 10 C76 16 64 16 56 12 Z" fill="#40c057"/><ellipse cx="30" cy="38" rx="7" ry="12" fill="#fff" opacity=".35"/>${s ? face(50, 52, 1.3) : ''}`;
  const TREE = `<svg class="backdrop" viewBox="0 0 300 360" style="left:calc(50vw - 19vh);bottom:9vh;height:46vh;width:38vh"><rect x="130" y="200" width="40" height="160" rx="12" fill="#8a5a2b"/><path d="M150 250 L100 210 M150 230 L200 190" stroke="#8a5a2b" stroke-width="16" stroke-linecap="round"/>
    <g fill="#40c057"><circle cx="150" cy="110" r="90"/><circle cx="80" cy="150" r="60"/><circle cx="220" cy="150" r="60"/><circle cx="110" cy="60" r="50"/><circle cx="195" cy="65" r="50"/></g>
    <g fill="#37b24d"><circle cx="120" cy="150" r="40"/><circle cx="200" cy="110" r="36"/></g>
    ${[[90, 120], [150, 70], [210, 140], [120, 180], [60, 170], [240, 100]].map(([x, y]) => `<g transform="translate(${x - 15} ${y - 15}) scale(.3)">${appleSvg(false)}</g>`).join('')}</svg>`;

  /* ظ ظرف */
  const ENV = A('env center', `<svg viewBox="0 0 300 220" style="overflow:visible">
    <rect x="20" y="60" width="260" height="160" rx="14" fill="#e7f5ff" stroke="#74c0fc" stroke-width="5"/>
    <g class="p heartup"><path d="M150 190 C110 160 90 140 90 116 C90 96 110 86 126 92 C138 96 146 106 150 114 C154 106 162 96 174 92 C190 86 210 96 210 116 C210 140 190 160 150 190 Z" fill="#ff6b81"/><ellipse cx="122" cy="110" rx="8" ry="12" fill="#fff" opacity=".45"/></g>
    <path d="M20 220 L150 132 L280 220 Z" fill="#d0ebff" stroke="#74c0fc" stroke-width="5" stroke-linejoin="round"/>
    <path d="M20 66 L20 220 L130 146 Z M280 66 L280 220 L170 146 Z" fill="#a5d8ff"/>
    <path class="p flap" d="M22 62 L150 150 L278 62 Z" fill="#74c0fc" stroke="#4dabf7" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="150" cy="140" r="12" fill="#fa5252"/></svg>`);

  /* ع عنب */
  const grapeXY = [[60, 60], [100, 56], [140, 60], [40, 96], [80, 94], [120, 94], [160, 96], [60, 132], [100, 130], [140, 132], [80, 166], [120, 166], [100, 200]];
  const GRAPES = A('grapes center', `<div class="pend"><svg viewBox="0 0 200 300" style="overflow:visible">
    <path d="M100 0 L100 34" stroke="#6b4423" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 30 C130 6 170 10 184 26 C164 44 126 46 100 30 Z" fill="#40c057"/><path d="M104 30 L170 24" stroke="#2f9e44" stroke-width="3"/>
    ${grapeXY.map(([x, y], i) => `<g class="p gb" style="animation-delay:-${(i * .23).toFixed(2)}s"><circle cx="${x}" cy="${y + 20}" r="24" fill="${i % 3 ? '#9c36b5' : '#ae3ec9'}"/><circle cx="${x - 8}" cy="${y + 12}" r="6" fill="#fff" opacity=".45"/></g>`).join('')}
    <g>${face(100, 76, 1.2, '#3b0a45')}</g></svg></div>`);
  const VINE = `<svg class="backdrop" viewBox="0 0 1000 60" preserveAspectRatio="none" style="top:42vh;bottom:auto;height:5vh"><path d="M0 30 Q250 10 500 30 Q750 50 1000 28" stroke="#8a5a2b" stroke-width="16" fill="none"/></svg>` +
    [12, 30, 70, 86].map(l => `<div class="deco emo" style="top:39vh;left:${l}vw;font-size:7vh">🍃</div>`).join('');

  /* ل ليمون */
  const LEMON = `<div class="actor walker lemon" style="animation-duration:11s"><div class="yaywrap"><div class="lbounce"><svg viewBox="0 0 120 120" style="overflow:visible">
    <path d="M14 60 C14 30 36 14 60 14 C84 14 106 30 106 60 C106 90 84 106 60 106 C36 106 14 90 14 60 Z" fill="#ffd43b" stroke="#fab005" stroke-width="4"/>
    <path d="M6 60 l10 -6 l0 12 Z M114 60 l-10 -6 l0 12 Z" fill="#fab005"/>
    <path d="M60 14 C62 6 70 2 78 4 C76 12 68 16 60 14 Z" fill="#40c057"/>
    <ellipse cx="40" cy="40" rx="8" ry="12" fill="#fff" opacity=".4"/>${face(60, 60, 1.4)}</svg></div></div></div>`;

  /* م موز */
  const BANANA = A('banana center', `<svg viewBox="0 0 200 300" style="overflow:visible"><g class="p bhappy">
    <path d="M70 120 C64 60 84 30 100 24 C116 30 136 60 130 120 Z" fill="#fff3bf"/>
    <g class="p peelL"><path d="M100 150 C70 150 56 110 66 60 C74 80 86 110 100 150 Z" fill="#ffd43b" stroke="#fab005" stroke-width="3"/></g>
    <g class="p peelR"><path d="M100 150 C130 150 144 110 134 60 C126 80 114 110 100 150 Z" fill="#ffd43b" stroke="#fab005" stroke-width="3"/></g>
    <path d="M56 120 C50 190 70 270 100 280 C130 270 150 190 144 120 C130 132 70 132 56 120 Z" fill="#ffd43b" stroke="#fab005" stroke-width="4"/>
    <path d="M96 280 L104 280 L102 292 L98 292 Z" fill="#6b4423"/>
    ${face(100, 190, 1.8)}</g></svg>`);

  /* هـ هدية */
  const gstars = [[-120, '#ffd43b'], [-60, '#ff6b6b'], [0, '#4dabf7'], [60, '#69db7c'], [120, '#cc5de8'], [-30, '#ffa94d'], [30, '#ffd43b']].map(([dx, c], i) => `<g class="p gstar" style="--dx:${dx}px;animation-delay:${(i * .05).toFixed(2)}s">${star(150, 120, 16, c)}</g>`).join('');
  const GIFT = A('gift center', `<svg viewBox="0 0 300 300" style="overflow:visible"><g class="p shake">${gstars}
    <rect x="50" y="130" width="200" height="160" rx="12" fill="#e03131"/><rect x="135" y="130" width="30" height="160" fill="#ffd43b"/>
    ${face(100, 200, 1.6, '#fff')}
    <g class="p lid"><rect x="36" y="100" width="228" height="40" rx="10" fill="#fa5252"/><rect x="135" y="100" width="30" height="40" fill="#fcc419"/>
      <path d="M150 100 C120 60 90 70 100 94 C108 104 130 102 150 100 Z M150 100 C180 60 210 70 200 94 C192 104 170 102 150 100 Z" fill="#fcc419" stroke="#f59f00" stroke-width="3"/><circle cx="150" cy="98" r="9" fill="#f59f00"/></g></g></svg>`);

  /* و وردة */
  const petals = [...Array(8)].map((_, i) => `<ellipse cx="100" cy="64" rx="17" ry="30" fill="${i % 2 ? '#f783ac' : '#faa2c1'}" transform="rotate(${i * 45} 100 100)"/>`).join('');
  const FLOWER = A('flower center', `<svg viewBox="0 0 200 330" style="overflow:visible">
    <g class="p stem"><path d="M100 330 C96 270 106 210 100 140" stroke="#2f9e44" stroke-width="10" fill="none" stroke-linecap="round"/></g>
    <g class="p leafpop"><path d="M100 260 C70 240 50 250 40 230 C70 220 90 230 100 250 Z" fill="#40c057"/><path d="M102 230 C130 210 150 220 162 200 C130 192 112 204 102 222 Z" fill="#51cf66"/></g>
    <g class="p bloom" style="transform-box:view-box;transform-origin:100px 100px">${petals}<circle cx="100" cy="100" r="30" fill="#ffd43b"/>${face(100, 96, 1.1)}</g></svg>`);
  const BFLY = `<div class="actor bfly"><svg viewBox="0 0 100 90" style="overflow:visible">
    <g class="p bwl"><ellipse cx="32" cy="32" rx="22" ry="26" fill="#9775fa"/><ellipse cx="36" cy="66" rx="14" ry="16" fill="#b197fc"/></g>
    <g class="p bwr"><ellipse cx="68" cy="32" rx="22" ry="26" fill="#9775fa"/><ellipse cx="64" cy="66" rx="14" ry="16" fill="#b197fc"/></g>
    <rect x="46" y="20" width="8" height="56" rx="4" fill="#495057"/><path d="M48 22 Q40 6 34 4 M52 22 Q60 6 66 4" stroke="#495057" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div>`;

  /* ي يد */
  const HAND = A('hand center', `<svg viewBox="0 0 220 300" style="overflow:visible">
    ${star(30, 60, 14, '#ffd43b').replace('<path', '<path class="p spark"')}${star(190, 40, 12, '#ffd43b').replace('<path', '<path class="p spark k2"')}
    <g class="p wavehand">
      <rect x="50" y="110" width="120" height="120" rx="50" fill="#ffd8a8" stroke="#e8a87c" stroke-width="4"/>
      ${[[58, 40], [84, 22], [110, 18], [136, 28]].map(([x, y]) => `<rect x="${x}" y="${y}" width="26" height="${140 - y}" rx="13" fill="#ffd8a8" stroke="#e8a87c" stroke-width="4"/>`).join('')}
      <rect x="54" y="96" width="112" height="60" rx="20" fill="#ffd8a8"/>
      <path d="M52 170 C30 150 18 130 26 118 C36 108 52 126 62 144 Z" fill="#ffd8a8" stroke="#e8a87c" stroke-width="4"/>
      ${face(110, 172, 1.4)}
      <rect x="62" y="226" width="96" height="60" rx="10" fill="#4dabf7"/><rect x="62" y="226" width="96" height="14" fill="#339af0"/></g></svg>`);

  Object.assign(S, {
    2: { bg: '#d3f9d8', ink: '#c92a2a', sound: 'boing', html: cloud(10, 70, 16, 50) + ground('#8ce99a') + TREE + A('apple', `<svg viewBox="0 0 100 100" style="overflow:visible">${appleSvg(true)}</svg>`) },
    16: { bg: '#fff0f6', ink: '#d6336c', sound: 'tada', html: [10, 25, 75, 88].map((l, i) => `<div class="deco emo" style="left:${l}vw;top:${40 + (i % 2) * 15}vh;font-size:6vh;opacity:.6">💗</div>`).join('') + ENV },
    17: { bg: '#f3d9fa', ink: '#862e9c', sound: 'boing', html: VINE + ground('#b2f2bb') + GRAPES },
    22: { bg: '#fff9db', ink: '#e67700', sound: 'boing', html: cloud(12, 30, 16, 45) + ground('#a9e34b') + LEMON },
    23: { bg: '#fff3bf', ink: '#e67700', sound: 'whoosh', html: `<div class="sun" style="left:10vw;top:8vh"></div>` + ground('#8ce99a') + BANANA },
    25: { bg: '#e5dbff', ink: '#5f3dc4', sound: 'tada', html: ground('#d0bfff') + GIFT },
    26: { bg: '#e3fafc', ink: '#c2255c', sound: 'chime', html: cloud(10, 20, 16, 45) + ground('#8ce99a') + FLOWER + BFLY },
    27: { bg: '#fff4e6', ink: '#e8590c', sound: 'chime', html: [8, 22, 78, 92].map((l, i) => `<div class="twinkle" style="top:${45 + (i % 2) * 12}vh;left:${l}vw;background:#ffd43b;box-shadow:0 0 2vh #ffd43b"></div>`).join('') + HAND }
  });
})();
