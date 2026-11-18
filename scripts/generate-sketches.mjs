#!/usr/bin/env node
/**
 * Generates the hand-drawn style dish illustrations in public/sketches/.
 * Ink line drawing + loose watercolour washes, with an SVG displacement
 * filter so every line wobbles like a pen sketch.
 *
 *   node scripts/generate-sketches.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "sketches");
fs.mkdirSync(OUT, { recursive: true });

const INK = "#3b2420";
const C = {
  red: "#c4432f",
  tomato: "#d65a3c",
  orange: "#d9824a",
  yellow: "#e8b64a",
  gold: "#d9a441",
  lime: "#b9d443",
  green: "#6f9e3f",
  herb: "#4f8a3c",
  avocado: "#9cbf4a",
  purple: "#9c5b8f",
  pink: "#d9708a",
  brown: "#8a4a2a",
  stone: "#8d8079",
  turq: "#3fa7a0",
  cobalt: "#1d4f91",
  cream: "#f4ecdf",
};

/* ── helpers ── */
const wash = (d, color, op = 0.45) => `<path d="${d}" fill="${color}" fill-opacity="${op}" stroke="none"/>`;
const blob = (cx, cy, rx, ry, color, op = 0.45) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" fill-opacity="${op}" stroke="none"/>`;
const line = (d, w = 2) => `<path d="${d}" stroke-width="${w}"/>`;
const fine = (d) => `<path d="${d}" stroke-width="1.1" opacity=".75"/>`;

/** Talavera-style bowl: rim ellipse, body, foot, cobalt dotted band. */
function bowl(cx, cy, rx, depth, { band = true } = {}) {
  const ry = rx * 0.2;
  const bottom = cy + depth;
  const body = `M${cx - rx} ${cy} C${cx - rx * 0.95} ${cy + depth * 0.75} ${cx - rx * 0.55} ${bottom} ${cx} ${bottom} C${cx + rx * 0.55} ${bottom} ${cx + rx * 0.95} ${cy + depth * 0.75} ${cx + rx} ${cy}`;
  const washD = `${body} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy}Z`;
  let dots = "";
  if (band) {
    for (let i = -4; i <= 4; i++) {
      const x = cx + i * rx * 0.2;
      const y = cy + ry + 7 + Math.abs(i) * -0.6;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1" fill="${C.cobalt}" fill-opacity=".7" stroke="none"/>`;
    }
  }
  return {
    washes: wash(washD, C.turq, 0.18) + dots,
    lines:
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>` +
      line(body) +
      line(`M${cx - rx * 0.32} ${bottom - 1} Q${cx} ${bottom + 7} ${cx + rx * 0.32} ${bottom - 1}`, 1.6) +
      fine(`M${cx - rx * 0.85} ${cy + 10} C${cx - rx * 0.5} ${cy + ry + 16} ${cx + rx * 0.5} ${cy + ry + 16} ${cx + rx * 0.85} ${cy + 10}`),
  };
}

/** Soft taco seen from the side: shallow folded tortilla with the back edge rising behind the filling. */
function tortilla() {
  const front = 'M30 84 A70 40 0 0 0 170 84';
  return {
    washes:
      wash('M30 84 C22 68 30 56 44 54 L156 54 C170 56 178 68 170 84 Z', '#e9c98a', 0.35) +
      wash(front + ' Z', '#e9c98a', 0.6),
    lines:
      // back half of the tortilla, peeking up at both tips
      line('M30 84 C22 70 28 58 42 54', 1.7) +
      line('M170 84 C178 70 172 58 158 54', 1.7) +
      line(front) +
      line('M40 87 A60 31 0 0 0 160 87', 1.2) +
      '<circle cx="72" cy="112" r="2" fill="' + INK + '" fill-opacity=".35" stroke="none"/>' +
      '<circle cx="120" cy="118" r="1.6" fill="' + INK + '" fill-opacity=".3" stroke="none"/>' +
      '<circle cx="142" cy="104" r="2.2" fill="' + INK + '" fill-opacity=".3" stroke="none"/>' +
      fine('M62 116 q4 3 8 2') +
      fine('M126 116 q5 2 9 -1'),
  };
}

function leaf(x, y, angle, size = 1, color = C.herb) {
  const s = size;
  const d = `M0 0 C${6 * s} ${-6 * s} ${14 * s} ${-5 * s} ${18 * s} 0 C${14 * s} ${5 * s} ${6 * s} ${6 * s} 0 0Z`;
  return {
    washes: `<g transform="translate(${x} ${y}) rotate(${angle})">${wash(d, color, 0.55)}</g>`,
    lines: `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="${d}" stroke-width="1.4"/>${fine(`M1 0 L${16 * s} 0`)}</g>`,
  };
}

function cilantro(x, y, angle = 0) {
  const lobes = [
    [0, -10],
    [-8, -4],
    [8, -4],
  ];
  let w = "";
  let l = `<path d="M0 14 Q1 4 0 -2" stroke-width="1.3"/>`;
  for (const [dx, dy] of lobes) {
    const d = `M${dx} ${dy} c-4 -1 -5 -6 -2 -8 c1 -3 5 -3 6 0 c3 -1 6 2 4 5 c2 3 -1 6 -4 5 c-1 2 -4 1 -4 -2z`;
    w += wash(d, C.herb, 0.55);
    l += `<path d="${d}" stroke-width="1.2"/>`;
  }
  return { washes: `<g transform="translate(${x} ${y}) rotate(${angle})">${w}</g>`, lines: `<g transform="translate(${x} ${y}) rotate(${angle})">${l}</g>` };
}

function limeWedge(cx, cy, r, angle = 0) {
  const d = `M${-r} 0 A${r} ${r} 0 0 0 ${r} 0 Z`;
  let segs = "";
  for (const a of [30, 60, 90, 120, 150]) {
    const rad = (a * Math.PI) / 180;
    segs += fine(`M0 2 L${(Math.cos(rad) * r * 0.8).toFixed(1)} ${(Math.sin(rad) * r * 0.8).toFixed(1)}`);
  }
  return {
    washes: `<g transform="translate(${cx} ${cy}) rotate(${angle})">${wash(d, C.lime, 0.6)}</g>`,
    lines:
      `<g transform="translate(${cx} ${cy}) rotate(${angle})"><path d="${d}"/>` +
      `<path d="M${-r + 4} 2 A${r - 4} ${r - 4} 0 0 0 ${r - 4} 2" stroke-width="1.1"/>${segs}</g>`,
  };
}

function chili(x, y, angle, scale = 1, color = C.red) {
  const d = "M0 0 C10 -4 30 -2 44 8 C52 14 56 22 54 26 C46 20 30 14 14 12 C6 11 0 8 0 0Z";
  return {
    washes: `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">${wash(d, color, 0.6)}</g>`,
    lines:
      `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="${d}"/>` +
      `<path d="M0 3 C-6 0 -9 -6 -8 -12" stroke-width="1.6"/>${fine("M14 6 C26 7 38 12 48 20")}</g>`,
  };
}

function svg(seed, parts, tilt = 0) {
  const washes = parts.map((p) => p.washes ?? "").join("");
  const lines = parts.map((p) => p.lines ?? "").join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
<defs>
  <filter id="pen" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed}"/>
    <feDisplacementMap in="SourceGraphic" scale="2.4"/>
  </filter>
  <filter id="water" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="${seed + 7}"/>
    <feDisplacementMap in="SourceGraphic" scale="7"/>
  </filter>
</defs>
<g transform="rotate(${tilt} 100 90)"><g filter="url(#water)" transform="translate(3 2)">${washes}</g>
<g filter="url(#pen)" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${lines}</g></g>
</svg>
`;
}

/* ── the dishes ── */
const sketches = {};

// 1 · Nachos & salsa roja
{
  const b = bowl(84, 96, 60, 38);
  const chips = [
    "M34 96 L52 50 L74 92",
    "M62 94 L88 40 L108 92",
    "M96 94 L124 52 L138 96",
    "M48 94 L30 64 L66 80",
    "M80 92 L70 60 L98 70",
  ];
  const chipW = chips.map((d) => wash(d + "Z", C.yellow, 0.55)).join("");
  const chipL = chips.map((d) => line(d + "Z", 1.8)).join("") + fine("M58 70 l3 2 M90 58 l2 3 M118 66 l3 1 M44 76 l2 2");
  const s = bowl(160, 112, 26, 20, { band: false });
  sketches.nachos = svg(3, [
    b,
    { washes: chipW, lines: chipL },
    s,
    {
      washes: blob(160, 112, 23, 5, C.red, 0.7),
      lines: `<circle cx="152" cy="111" r="1.6"/><circle cx="163" cy="113" r="1.4"/><circle cx="170" cy="110" r="1.2"/>`,
    },
  ]);
}

// 2 · Mexican corn salad (esquites)
{
  const b = bowl(92, 92, 54, 40);
  let kernels = "";
  for (let y = 60; y <= 90; y += 8) {
    for (let x = 48; x <= 136; x += 10) {
      const off = (y / 8) % 2 ? 5 : 0;
      const kx = x + off;
      const top = 92 - Math.sqrt(Math.max(0, 1 - ((kx - 92) / 50) ** 2)) * 40;
      if (y > top + 3 && y < 94) kernels += `<ellipse cx="${kx}" cy="${y}" rx="3.6" ry="3" stroke-width="1.1"/>`;
    }
  }
  const lw = limeWedge(160, 128, 18, -15);
  sketches.corn = svg(5, [
    b,
    {
      washes: wash("M40 92 Q92 40 144 92 Z", C.yellow, 0.6) + blob(80, 70, 4, 3, C.red, 0.7) + blob(108, 66, 3, 3, C.red, 0.7),
      lines: line("M40 92 Q92 42 144 92", 1.6) + kernels + `<circle cx="70" cy="64" r="2.4"/><circle cx="100" cy="58" r="2"/><circle cx="122" cy="72" r="2.2"/>`,
    },
    lw,
    cilantro(118, 52, 20),
  ]);
}

// 3 · Pico de gallo
{
  const b = bowl(90, 94, 56, 36);
  const cubes = [
    [58, 80, C.tomato, 10], [72, 70, C.tomato, -8], [88, 64, C.cream, 12], [100, 74, C.tomato, 4],
    [114, 66, C.tomato, -14], [126, 80, C.herb, 8], [80, 84, C.cream, -6], [96, 86, C.tomato, 16],
    [110, 86, C.tomato, -4], [66, 90, C.herb, 0], [120, 92, C.cream, 10], [86, 76, C.herb, -10],
  ];
  const cw = cubes.map(([x, y, c, a]) => `<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" rx="1.5" transform="rotate(${a} ${x} ${y})" fill="${c}" fill-opacity="${c === C.cream ? 0.9 : 0.65}" stroke="none"/>`).join("");
  const cl = cubes.map(([x, y, , a]) => `<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" rx="1.5" transform="rotate(${a} ${x} ${y})" stroke-width="1.2"/>`).join("");
  sketches.pico = svg(11, [
    b,
    { washes: wash("M40 94 Q90 52 140 94 Z", C.tomato, 0.2) + cw, lines: line("M40 94 Q90 56 140 94", 1.3) + cl },
    chili(140, 124, -18, 0.8, C.herb),
    cilantro(36, 70, -25),
  ]);
}

// 4 · Cabbage, mango & mint salad
{
  const b = bowl(96, 92, 60, 38);
  let shreds = "";
  for (let i = 0; i < 9; i++) {
    const x = 46 + i * 11;
    shreds += `<path d="M${x} 92 C${x + 6} ${70 - (i % 3) * 6} ${x + 14} ${76} ${x + 18} ${62 + (i % 2) * 8}" stroke-width="1.3"/>`;
  }
  const mango = [[66, 76], [92, 66], [112, 78], [130, 70], [80, 86]];
  const mw = mango.map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="2" transform="rotate(${x % 20} ${x} ${y})" fill="${C.yellow}" fill-opacity=".8" stroke="none"/>`).join("");
  const ml = mango.map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="2" transform="rotate(${x % 20} ${x} ${y})" stroke-width="1.3"/>`).join("");
  sketches.cabbage = svg(17, [
    b,
    { washes: wash("M38 92 Q96 46 154 92 Z", C.purple, 0.45) + wash("M60 92 Q100 64 140 92Z", C.green, 0.25) + mw, lines: shreds + ml },
    leaf(120, 54, -30, 1.1, C.herb),
    leaf(132, 60, 20, 0.9, C.green),
    leaf(58, 62, -150, 1, C.herb),
  ]);
}

// 5 · Tempura fish taco
{
  const t = tortilla();
  const fish = "M40 82 C36 66 52 58 62 66 C64 52 84 50 90 60 C96 48 116 48 120 60 C128 50 150 54 148 68 C160 70 164 80 160 84";
  sketches.fish = svg(23, [
    t,
    {
      washes: wash(fish + " Z", C.gold, 0.6) + wash("M50 70 C70 60 120 58 150 72 L150 80 L50 80Z", C.purple, 0.25),
      lines:
        line(fish, 1.9) +
        fine("M66 72 q4 -3 8 0 M100 64 q4 -3 8 0 M128 70 q4 -3 8 0") +
        line("M52 70 q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0", 1.4),
    },
    { washes: wash("M52 70 q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0 l0 4 q-8 8 -96 0Z", C.orange, 0.45) },
    limeWedge(176, 128, 14, -30),
    cilantro(100, 46, 0),
  ], -6);
}

// 6 · Slow-cooked asado taco
{
  const t = tortilla();
  let strands = "";
  for (let i = 0; i < 14; i++) {
    const x = 42 + i * 8.5;
    const y = 76 - Math.sin((i / 13) * Math.PI) * 18;
    strands += `<path d="M${x} ${y + 8} c3 -6 6 -2 8 -8 c2 -5 5 -2 7 -6" stroke-width="1.4"/>`;
  }
  const rings = [[70, 60], [104, 54], [130, 62]];
  sketches.asado = svg(29, [
    t,
    {
      washes: wash("M38 84 C46 58 80 50 100 52 C124 50 156 60 162 84Z", C.brown, 0.6) + rings.map(([x, y]) => blob(x, y, 9, 4, C.pink, 0.55)).join(""),
      lines: line("M38 84 C46 58 80 50 100 52 C124 50 156 60 162 84", 1.6) + strands + rings.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4" stroke-width="1.3"/>`).join(""),
    },
    cilantro(88, 44, -10),
    cilantro(146, 52, 25),
  ], -6);
}

// 7 · Vegan tacos
{
  const t = tortilla();
  const slices = [[60, 66, -30], [96, 56, 0], [130, 64, 30]];
  const avoD = "M0 0 C6 -14 26 -14 32 0 C24 -4 8 -4 0 0Z";
  const beans = [[48, 78], [76, 74], [114, 72], [146, 78], [88, 80], [128, 82]];
  sketches.vegan = svg(31, [
    t,
    {
      washes:
        wash("M36 86 C44 56 156 54 164 86Z", C.green, 0.3) +
        slices.map(([x, y, a]) => `<g transform="translate(${x - 16} ${y}) rotate(${a} 16 0)">${wash(avoD, C.avocado, 0.75)}</g>`).join("") +
        wash("M60 80 L76 64 L84 68 L68 84Z", C.red, 0.6) +
        wash("M118 82 L134 66 L142 70 L126 86Z", C.yellow, 0.6) +
        beans.map(([x, y]) => blob(x, y, 4, 3, "#3a2a2a", 0.7)).join(""),
      lines:
        slices.map(([x, y, a]) => `<g transform="translate(${x - 16} ${y}) rotate(${a} 16 0)"><path d="${avoD}" stroke-width="1.5"/></g>`).join("") +
        line("M60 80 L76 64 L84 68 L68 84Z", 1.3) +
        line("M118 82 L134 66 L142 70 L126 86Z", 1.3) +
        beans.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="3" stroke-width="1.1"/>`).join("") +
        line("M36 86 C42 64 58 60 66 62 C76 52 96 50 104 56 C116 48 140 54 146 62 C156 62 164 72 164 86", 1.3),
    },
    leaf(100, 46, -70, 1, C.green),
    leaf(104, 46, -110, 0.9, C.herb),
    cilantro(150, 54, 20),
  ], -6);
}

// 8 · Guacamole in a molcajete, avocado half alongside
{
  const cx = 84, cy = 82, rx = 56, depth = 40;
  const body = `M${cx - rx} ${cy} C${cx - rx} ${cy + depth} ${cx + rx} ${cy + depth} ${cx + rx} ${cy}`;
  const legs = [[cx - 34, cy + 30], [cx, cy + 38], [cx + 34, cy + 30]];
  const avo = "M150 140 C134 140 128 124 134 110 C138 98 142 86 154 86 C166 86 170 98 174 110 C180 124 172 140 150 140Z";
  sketches.guacamole = svg(37, [
    {
      washes:
        wash(`${body} A${rx} 11 0 0 0 ${cx - rx} ${cy}Z`, C.stone, 0.45) +
        wash(`M${cx - rx + 6} ${cy} Q${cx} ${cy - 40} ${cx + rx - 6} ${cy}Z`, C.avocado, 0.75),
      lines:
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="11"/>` +
        line(body) +
        legs.map(([x, y]) => line(`M${x - 7} ${y} L${x - 5} ${y + 12} L${x + 5} ${y + 12} L${x + 7} ${y}`, 1.6)).join("") +
        line(`M${cx - rx + 6} ${cy} Q${cx} ${cy - 40} ${cx + rx - 6} ${cy}`, 1.5) +
        `<circle cx="64" cy="96" r="1.3"/><circle cx="96" cy="104" r="1.2"/><circle cx="116" cy="94" r="1.3"/><circle cx="78" cy="108" r="1"/>` +
        fine("M70 66 q5 -4 10 0 M92 58 q5 -4 10 0") +
        `<circle cx="74" cy="72" r="1.6"/><circle cx="102" cy="68" r="1.6"/>`,
    },
    {
      washes: wash(avo, C.green, 0.55) + blob(154, 118, 14, 18, C.avocado, 0.6) + blob(154, 120, 8, 9, C.brown, 0.75),
      lines: line(avo, 1.8) + line("M154 96 C144 98 140 110 142 122 C144 132 164 132 166 122 C168 110 164 98 154 96Z", 1.2) + `<ellipse cx="154" cy="120" rx="8" ry="9"/>`,
    },
    cilantro(46, 56, -20),
  ]);
}

// 9 · Chipotle aioli
{
  const swirl = "M86 76 C70 76 66 66 80 62 C96 58 110 66 104 74 C98 80 82 76 86 70 C90 66 98 68 96 72";
  const pepper = "M140 126 C132 118 136 104 150 100 C164 96 176 102 178 112 C180 124 168 132 158 130 C150 130 146 132 140 126Z";
  sketches.aioli = svg(41, [
    {
      washes:
        wash("M48 76 L54 124 C60 136 120 136 126 124 L132 76 Z", C.cream, 0.9) +
        wash("M48 76 L54 124 C60 136 120 136 126 124 L132 76 Z", C.turq, 0.18) +
        blob(90, 72, 38, 9, C.orange, 0.75),
      lines:
        `<ellipse cx="90" cy="74" rx="42" ry="11"/>` +
        line("M48 76 L54 124 C60 136 120 136 126 124 L132 76") +
        line(swirl, 1.5) +
        `<circle cx="70" cy="98" r="2" fill="${C.cobalt}" fill-opacity=".7" stroke="none"/><circle cx="90" cy="102" r="2" fill="${C.cobalt}" fill-opacity=".7" stroke="none"/><circle cx="110" cy="98" r="2" fill="${C.cobalt}" fill-opacity=".7" stroke="none"/>`,
    },
    {
      washes: wash(pepper, "#7a2a1e", 0.7),
      lines: line(pepper, 1.8) + fine("M146 116 C154 110 164 108 172 112 M150 124 C158 120 166 120 172 122") + line("M150 100 C148 92 152 86 158 84", 1.6),
    },
    // spoon
    { lines: line("M30 128 L56 100", 2) + `<ellipse cx="25" cy="133" rx="7" ry="5" transform="rotate(-45 25 133)"/>` },
  ]);
}

// 10 · Fresh toppings board
{
  const board = "M24 96 C24 74 176 74 176 96 C176 120 24 120 24 96Z";
  const radish = (x, y) => ({
    washes: blob(x, y, 11, 11, C.pink, 0.6) + blob(x, y, 7, 7, C.cream, 0.95),
    lines: `<circle cx="${x}" cy="${y}" r="11"/><circle cx="${x}" cy="${y}" r="7" stroke-width="1"/>`,
  });
  const jalapeno = (x, y) => ({
    washes: blob(x, y, 9, 9, C.green, 0.6),
    lines: `<circle cx="${x}" cy="${y}" r="9"/><circle cx="${x}" cy="${y}" r="4" stroke-width="1"/><circle cx="${x - 1.5}" cy="${y - 1}" r=".9"/><circle cx="${x + 1.5}" cy="${y + 1}" r=".9"/>`,
  });
  sketches.toppings = svg(47, [
    { washes: wash(board, "#c79a6a", 0.4), lines: line(board) + line("M176 96 L192 92", 2) + fine("M40 104 C80 110 130 110 160 104") },
    limeWedge(56, 90, 16, -10),
    limeWedge(84, 98, 14, 15),
    radish(116, 88),
    radish(136, 100),
    jalapeno(160, 88),
    jalapeno(100, 104),
    { washes: blob(70, 74, 10, 4, C.purple, 0.5), lines: `<path d="M60 74 q10 -8 20 0" stroke-width="1.3"/><path d="M62 77 q8 -5 16 0" stroke-width="1"/>` },
    cilantro(150, 64, 15),
    cilantro(40, 70, -30),
  ]);
}

// 11 · Avocado: two halves (one with the pit) and a fan of slices
{
  const half = (x, y, a, pit) => {
    const outer = "M0 34 C-16 34 -22 18 -16 4 C-12 -8 -8 -20 0 -20 C8 -20 12 -8 16 4 C22 18 16 34 0 34Z";
    const inner = "M0 -12 C-8 -10 -12 2 -12 12 C-12 24 12 24 12 12 C12 2 8 -10 0 -12Z";
    const g = (c) => `<g transform="translate(${x} ${y}) rotate(${a})">${c}</g>`;
    return {
      washes: g(wash(outer, "#3f6b2a", 0.6) + wash(inner, C.avocado, 0.75) + (pit ? blob(0, 12, 8, 9, C.brown, 0.8) : "")),
      lines: g(line(outer, 1.8) + line(inner, 1.2) + (pit ? `<ellipse cx="0" cy="12" rx="8" ry="9"/>` + fine("M-3 7 q2 -2 5 -1") : `<ellipse cx="0" cy="12" rx="7" ry="8" stroke-width="1" opacity=".5"/>`)),
    };
  };
  const slice = (x, y, a) => {
    const d = "M0 0 C6 -20 36 -20 44 0 C34 -8 10 -8 0 0Z";
    return {
      washes: `<g transform="translate(${x} ${y}) rotate(${a})">${wash(d, C.avocado, 0.8)}</g>`,
      lines: `<g transform="translate(${x} ${y}) rotate(${a})"><path d="${d}" stroke-width="1.5"/>${fine("M5 -3 C16 -11 30 -11 39 -3")}</g>`,
    };
  };
  sketches.avocado = svg(53, [
    { washes: wash("M20 112 C20 96 180 96 180 112 C180 130 20 130 20 112Z", "#c79a6a", 0.35), lines: line("M20 112 C20 96 180 96 180 112 C180 130 20 130 20 112Z") },
    half(58, 82, -18, true),
    half(98, 78, 14, false),
    slice(112, 110, -22),
    slice(122, 113, -10),
    slice(132, 116, 2),
    limeWedge(160, 96, 13, 20),
    cilantro(40, 108, -40),
  ]);
}

for (const [name, content] of Object.entries(sketches)) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), content);
}
console.log(`Wrote ${Object.keys(sketches).length} sketches to ${OUT}`);
