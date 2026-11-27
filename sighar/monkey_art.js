/* رسومات لعبة «مغامرة القرد»: القرد (مشي، سباحة، تسلّق)، الباندا، البقرة، الأسد */
window.ART = (function () {
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d1d1d"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .35}" fill="#fff"/>`;
  const B = '#8d5524', BD = '#6f4219', F = '#f1c27d';
  const head = (goggles) => `<g class="p mhead">
      <circle cx="58" cy="82" r="18" fill="${B}"/><circle cx="58" cy="82" r="10" fill="${F}"/>
      <circle cx="142" cy="82" r="18" fill="${B}"/><circle cx="142" cy="82" r="10" fill="${F}"/>
      <circle cx="100" cy="84" r="44" fill="${B}"/>
      <path d="M92 42 q8 -16 18 -4 q-6 -2 -8 8" fill="${B}"/>
      <circle cx="86" cy="82" r="19" fill="${F}"/><circle cx="114" cy="82" r="19" fill="${F}"/><ellipse cx="100" cy="102" rx="30" ry="22" fill="${F}"/>
      ${eye(88, 80, 6.5)}${eye(112, 80, 6.5)}
      ${goggles ? `<rect x="70" y="68" width="60" height="26" rx="12" fill="rgba(165,216,255,.55)" stroke="#1971c2" stroke-width="5"/><path d="M70 78 L56 76 M130 78 L144 76" stroke="#1971c2" stroke-width="5"/>` : ''}
      <circle cx="96" cy="98" r="2.6" fill="${BD}"/><circle cx="104" cy="98" r="2.6" fill="${BD}"/>
      <path d="M86 108 Q100 122 114 108" stroke="${BD}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="74" cy="100" r="6" fill="#ff8787" opacity=".5"/><circle cx="126" cy="100" r="6" fill="#ff8787" opacity=".5"/></g>`;
  const banana = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 C4 22 22 34 42 30 C46 29 46 25 43 24 C26 26 12 16 8 -2 Z" fill="#ffd43b" stroke="#f59f00" stroke-width="2.5"/></g>`;

  const monkey = (o = {}) => `<svg viewBox="0 0 200 250" style="overflow:visible">
    <ellipse cx="104" cy="244" rx="46" ry="6" fill="rgba(0,0,0,.15)"/>
    <g class="p mtail"><path d="M136 160 C186 160 196 110 172 98 C158 92 150 106 160 112" stroke="${B}" stroke-width="10" fill="none" stroke-linecap="round"/></g>
    <g class="p leg b"><rect x="114" y="180" width="18" height="52" rx="9" fill="${BD}"/><ellipse cx="118" cy="234" rx="15" ry="8" fill="${F}"/></g>
    <g class="p arm b"><rect x="124" y="128" width="16" height="54" rx="8" fill="${BD}"/></g>
    <g class="bob"><ellipse cx="110" cy="152" rx="40" ry="46" fill="${B}"/><ellipse cx="104" cy="160" rx="25" ry="31" fill="${F}"/>${head(o.goggles)}</g>
    <g class="p leg a"><rect x="90" y="182" width="18" height="52" rx="9" fill="${B}"/><ellipse cx="94" cy="236" rx="15" ry="8" fill="${F}"/></g>
    <g class="p arm a"><rect x="76" y="128" width="17" height="56" rx="8.5" fill="${B}"/><circle cx="84" cy="186" r="9" fill="${F}"/>${o.banana ? banana(70, 178, 10) : ''}</g>
  </svg>`;

  const monkeyClimb = () => `<svg viewBox="0 0 200 250" style="overflow:visible">
    <g class="p mtail"><path d="M136 170 C186 176 192 130 170 116" stroke="${B}" stroke-width="10" fill="none" stroke-linecap="round"/></g>
    <g class="p arm a"><rect x="64" y="40" width="17" height="80" rx="8.5" fill="${B}" transform="rotate(-20 72 120)"/></g>
    <g class="p arm b"><rect x="122" y="40" width="17" height="80" rx="8.5" fill="${BD}" transform="rotate(20 130 120)"/></g>
    <ellipse cx="104" cy="160" rx="40" ry="46" fill="${B}"/><ellipse cx="104" cy="166" rx="25" ry="31" fill="${F}"/>
    <g transform="translate(4 30)">${head(false)}</g>
    <rect x="78" y="190" width="18" height="46" rx="9" fill="${B}" transform="rotate(-25 86 190)"/><rect x="114" y="190" width="18" height="46" rx="9" fill="${BD}" transform="rotate(25 122 190)"/>
  </svg>`;

  const panda = () => `<svg viewBox="0 0 220 220" style="overflow:visible">
    <ellipse cx="110" cy="150" rx="58" ry="52" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <ellipse cx="76" cy="196" rx="24" ry="16" fill="#212529"/><ellipse cx="144" cy="196" rx="24" ry="16" fill="#212529"/>
    <g class="p parm"><rect x="128" y="104" width="28" height="64" rx="14" fill="#212529" transform="rotate(-30 142 110)"/>
      <rect x="146" y="40" width="10" height="120" rx="5" fill="#69db7c" transform="rotate(-12 150 100)"/><path d="M156 52 C176 44 186 52 190 60 C176 62 164 60 156 52 Z" fill="#40c057"/></g>
    <rect x="62" y="108" width="28" height="60" rx="14" fill="#212529" transform="rotate(20 76 110)"/>
    <circle cx="70" cy="40" r="20" fill="#212529"/><circle cx="150" cy="40" r="20" fill="#212529"/>
    <circle cx="110" cy="78" r="52" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
    <ellipse cx="88" cy="74" rx="15" ry="20" transform="rotate(30 88 74)" fill="#212529"/><ellipse cx="132" cy="74" rx="15" ry="20" transform="rotate(-30 132 74)" fill="#212529"/>
    <circle cx="90" cy="72" r="7" fill="#fff"/><circle cx="91" cy="73" r="4" fill="#1d1d1d"/><circle cx="130" cy="72" r="7" fill="#fff"/><circle cx="129" cy="73" r="4" fill="#1d1d1d"/>
    <ellipse cx="110" cy="96" rx="9" ry="6" fill="#212529"/><path d="M100 106 Q110 116 120 106" stroke="#212529" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="78" cy="98" r="7" fill="#ffc9d6"/><circle cx="142" cy="98" r="7" fill="#ffc9d6"/>
  </svg>`;

  const cleg = (cls, x, col) => `<g class="p leg ${cls}"><rect x="${x}" y="150" width="20" height="70" rx="10" fill="${col}"/><rect x="${x - 2}" y="208" width="24" height="14" rx="6" fill="#343a40"/></g>`;
  const cow = () => `<svg viewBox="0 0 300 240" style="overflow:visible">
    <ellipse cx="165" cy="226" rx="92" ry="7" fill="rgba(0,0,0,.15)"/>
    ${cleg('b', 120, '#e9ecef')}${cleg('a', 220, '#e9ecef')}
    <g class="p tail"><path d="M248 118 Q268 150 262 184" stroke="#e9ecef" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="262" cy="188" rx="7" ry="11" fill="#343a40"/></g>
    <g class="bob"><ellipse cx="168" cy="128" rx="86" ry="46" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
      <path d="M140 92 C160 84 176 100 168 116 C156 130 132 120 140 92 Z M196 120 C214 112 236 124 228 142 C216 156 190 146 196 120 Z M110 140 C120 132 136 140 130 152 C122 160 104 154 110 140 Z" fill="#343a40"/>
      <ellipse cx="200" cy="170" rx="22" ry="12" fill="#ffc9d6"/>
      <g class="p neck"><path d="M70 60 C64 44 74 38 80 46 M110 60 C116 44 106 38 100 46" stroke="#f1e3c3" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="56" cy="74" rx="18" ry="9" transform="rotate(-20 56 74)" fill="#fff" stroke="#dee2e6" stroke-width="2"/><ellipse cx="124" cy="74" rx="18" ry="9" transform="rotate(20 124 74)" fill="#fff" stroke="#dee2e6" stroke-width="2"/>
        <rect x="60" y="52" width="64" height="76" rx="30" fill="#fff" stroke="#dee2e6" stroke-width="3"/>
        <path d="M66 70 C76 60 90 66 86 80 C82 90 66 86 66 70 Z" fill="#343a40"/>
        <ellipse cx="92" cy="116" rx="32" ry="20" fill="#ffc9d6"/><ellipse cx="80" cy="116" rx="4" ry="6" fill="#d6336c"/><ellipse cx="104" cy="116" rx="4" ry="6" fill="#d6336c"/>
        ${eye(78, 86, 5.5)}${eye(106, 86, 5.5)}
        <path d="M94 138 L94 146" stroke="#c92a2a" stroke-width="4"/><circle cx="94" cy="152" r="9" fill="#fcc419" stroke="#f59f00" stroke-width="2"/></g></g>
    ${cleg('a', 100, '#fff')}${cleg('b', 200, '#fff')}
  </svg>`;

  const lion = () => `<svg viewBox="0 0 300 240" style="overflow:visible">
    <ellipse cx="160" cy="226" rx="90" ry="7" fill="rgba(0,0,0,.15)"/>
    ${cleg('b', 122, '#e8a33d')}${cleg('a', 218, '#e8a33d')}
    <g class="p tail"><path d="M240 120 C270 120 280 150 270 170" stroke="#f0b14f" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="270" cy="174" rx="9" ry="12" fill="#b35c00"/></g>
    <g class="bob"><ellipse cx="166" cy="132" rx="82" ry="42" fill="#f0b14f"/>
      <g class="p neck">${[...Array(14)].map((_, i) => { const a = i * Math.PI * 2 / 14; return `<circle cx="${(86 + Math.cos(a) * 46).toFixed(1)}" cy="${(96 + Math.sin(a) * 46).toFixed(1)}" r="20" fill="${i % 2 ? '#b35c00' : '#d9480f'}"/>`; }).join('')}
        <circle cx="86" cy="96" r="46" fill="#c2410c"/><circle cx="86" cy="98" r="36" fill="#f5c36b"/>
        <circle cx="58" cy="66" r="9" fill="#f5c36b"/><circle cx="114" cy="66" r="9" fill="#f5c36b"/>
        ${eye(74, 92, 5.5)}${eye(98, 92, 5.5)}
        <path d="M80 104 L92 104 L86 112 Z" fill="#7f3f1f"/><path d="M76 116 Q86 124 96 116" stroke="#7f3f1f" stroke-width="3.5" fill="none" stroke-linecap="round"/></g></g>
    ${cleg('a', 102, '#f0b14f')}${cleg('b', 198, '#f0b14f')}
  </svg>`;

  return { monkey, monkeyClimb, panda, cow, lion, banana };
})();
