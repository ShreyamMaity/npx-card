#!/usr/bin/env node
'use strict';

// npx shreyam: an animated terminal business card. No dependencies.

const https = require('https');
const cp = require('child_process');

const me = {
  name: 'Shreyam Maity',
  title: 'Software Engineer',
  company: '@Writesonic',
  tagline: 'Software Engineer · AI enthusiast · 5+ years building software',
  focus: 'LLM routing · RAG · agents · MCP servers',
  email: 'sm8967724231@gmail.com',
  links: [
    ['Web', 'shreyam.dev', 'https://shreyam.dev'],
    ['GitHub', 'ShreyamMaity', 'https://github.com/ShreyamMaity'],
    ['LinkedIn', 'shreyammaity', 'https://www.linkedin.com/in/shreyammaity/'],
    ['X', '@ShreyamMaity', 'https://x.com/ShreyamMaity'],
    ['HF', 'ReyDev', 'https://huggingface.co/ReyDev'],
  ],
  quests: [
    ['Space Sumo', 'https://games.shreyam.dev/space-sumo/'],
    ['KCD mods', 'https://www.nexusmods.com/profile/ReyDev/mods'],
    ['CoWIN Smart Print', 'https://apps.microsoft.com/detail/9pm5zjg9slw3'],
  ],
};

const BANNER = [
  '███████╗██╗  ██╗██████╗ ███████╗██╗   ██╗ █████╗ ███╗   ███╗',
  '██╔════╝██║  ██║██╔══██╗██╔════╝╚██╗ ██╔╝██╔══██╗████╗ ████║',
  '███████╗███████║██████╔╝█████╗   ╚████╔╝ ███████║██╔████╔██║',
  '╚════██║██╔══██║██╔══██╗██╔══╝    ╚██╔╝  ██╔══██║██║╚██╔╝██║',
  '███████║██║  ██║██║  ██║███████╗   ██║   ██║  ██║██║ ╚═╝ ██║',
  '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝',
];

// 20x20 photo, 6 hex chars per pixel, "------" = outside the circle.
const AVATAR = '------------------------------------------ebf6feebf2fdebeffcebeffcebf4feebf4fe------------------------------------------------------------------------ebf6feebf2fdebf8ffebf8ffebf8ffebf8ffebf8ffebf8ffebf6feebf6fe------------------------------------------------ebf8ffebf8ffebf8ffebf8ffebf4feef8ee0c767e0da6adcee9fe5edbeeeebf8ffebf8ffebf8ffebf8ff------------------------------ecdcf7ece0f8ecdaf6ebebfbb664e3382a73120e28120e28120e281813341f18425e46bcedbeeeece7faece7faebf4fe------------------------edbbededc0efeeb1eab264e4120e28120e28130f2a16112f15102d120e28140f2b120e287d5befebeffcedc6f1ecd5f5------------------edbbededbbededb9edecd3f45f48c0130f2a1b153915102d140f2b161131161131120e281c153be66cd9ece7faecd3f4ecd8f6ecd8f6------------eeb1eaedbbededb9edecd5f55e46bc130f2a171232120e28120e28120e28120e28513da4b965e3edb7ececdaf6ecd3f4ecd3f4ecdaf6------eea1e6eea4e7eeace9edb7ecebeffc875ced120e2834276a654cca644bc87658ebae63e5db6bdb7658ebbd66e2ebebfbedc6f1edcdf2ece0f8ece7faee9de5ee9be4ee9be4ee9fe5edc6f1ca68df1611318b5decee99e3eeb1eaebf8ffebf8ffb264e44b3898eeb3ebecd3f4edc6f1edcdf2ecd3f4ecd8f6ee9de5ef97e3eea6e7eea8e8eea8e8ef8adf2d225cd069deeeb3ebedc2efeea1e6ebf8ffecdaf6eccff3ece9fbeeb1eaedbeeeedc8f1edc4f0edc6f1eea1e6eea6e7eeb3ebeeace9ee9fe5edcbf2523ea5905eebeccff3ecd5f5a161e7ef90e1ebf6fed86adc905eebeea1e6eea6e7eeaae8edb9ededc0efeea1e6eea4e7eea6e7ee9be4ee9fe5ef7fdc36296faf63e4d86adcab62e56c51d8a762e6885ded5943b3bd66e2edbeeeee9be4ee9fe5eea4e7eeaae8ef97e3ef90e1ee99e3ee9de5ecd3f4624ac5120e28ef92e2ecd5f53e2f7f2119464736911b15394f3ca0935feaef85deef97e3ee99e3ee99e3ee9de5------ee99e3eeb3ebef94e27a5af01611312a2057ecd8f6ecdcf7e36cda413184120e28130f2a120e286c51d8edb5ecee9be4ef8ee0ef92e2------------c767e06e53dd2f2462120e28140f2b120e28935feaebf8ffebf4fe9c60e8130f2a15102d140f2b281f545a44b5ba65e2ee9de5ef8ee0------------------120e28120e28140f2b130f2a140f2b120e28885dedece0f8624ac516112f130f2a120e28120e28120e28120e28523ea5------------------------15102d140f2b120e28120e28120e28140f2b120e28523ea5533ea7140f2b120e28120e28130f2a15102d15102d120e28------------------------------120e28120e28120e28120e28120e28140f2b120e28120e28120e28120e28120e28130f2a130f2a140f2b------------------------------------------------120e28120e28120e28120e2815102d15102d120e28120e28120e28120e28------------------------------------------------------------------------120e28120e28120e28120e28120e28130f2a------------------------------------------';
const AV = 20;

// ---------- terminal helpers ----------

const out = process.stdout;
const args = process.argv.slice(2);
const COLOR = !('NO_COLOR' in process.env) && !args.includes('--no-color');
const ESC = '\x1b[';
const fg = (r, g, b) => (COLOR ? `${ESC}38;2;${r};${g};${b}m` : '');
const bg = (r, g, b) => (COLOR ? `${ESC}48;2;${r};${g};${b}m` : '');
const sgr = (code) => (COLOR ? `${ESC}${code}m` : '');
const RESET = sgr(0);
const BOLD = sgr(1);
const DIM = sgr(2);
const ITALIC = sgr(3);
const link = (text, url) => (out.isTTY ? `\x1b]8;;${url}\x07${text}\x1b]8;;\x07` : text);
const visible = (s) => s.replace(/\x1b\[[0-9;]*m|\x1b\]8;;[^\x07]*\x07/g, '');
const pad = (s, w) => s + ' '.repeat(Math.max(0, w - [...visible(s)].length));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (n) => Math.floor(Math.random() * n);

const PINK = [255, 79, 216];
const VIOLET = [140, 110, 255];
const CYAN = [77, 225, 255];
const INK = [14, 16, 24];
const GREY = [130, 138, 160];
const WHITE = [236, 240, 255];

// Pink -> violet -> cyan across t in [0, 1].
function grad(t) {
  const [a, b, u] = t < 0.5 ? [PINK, VIOLET, t * 2] : [VIOLET, CYAN, (t - 0.5) * 2];
  return a.map((v, i) => Math.round(v + (b[i] - v) * u));
}

const GLITCH = '▓▒░█#@%&$!?/\\<>*+=~';

// ---------- pieces of the card ----------

// progress 0..1: how much of the banner has resolved out of the noise.
function banner(progress, shift) {
  return BANNER.map((row, y) => {
    let s = '';
    const chars = [...row];
    chars.forEach((ch, x) => {
      const t = (x / chars.length + shift) % 1;
      const settled = ch === ' ' || Math.random() < progress;
      if (settled) {
        s += fg(...grad(t)) + ch;
      } else {
        const c = Math.random() < 0.5 ? PINK : CYAN;
        s += fg(...c) + GLITCH[rand(GLITCH.length)];
      }
    });
    // Occasional horizontal tear while glitching.
    if (progress < 1 && Math.random() < 0.25) s = ' '.repeat(1 + rand(3)) + s;
    return s + RESET;
  });
}

function avatarRows() {
  const px = (x, y) => AVATAR.substr((y * AV + x) * 6, 6);
  const rows = [];
  for (let y = 0; y < AV; y += 2) {
    let s = '';
    for (let x = 0; x < AV; x++) {
      const top = px(x, y);
      const bot = px(x, y + 1);
      const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
      if (top === '------' && bot === '------') s += ' ';
      else if (top === '------') s += fg(...rgb(bot)) + '▄' + RESET;
      else if (bot === '------') s += fg(...rgb(top)) + '▀' + RESET;
      else s += fg(...rgb(top)) + bg(...rgb(bot)) + '▀' + RESET;
    }
    rows.push(s);
  }
  return rows;
}

function infoRows() {
  const label = (t) => fg(...GREY) + pad(t, 9) + RESET;
  return [
    BOLD + fg(...WHITE) + me.name + RESET,
    fg(...CYAN) + me.title + RESET + ' ' + fg(...PINK) + me.company + RESET,
    DIM + me.focus + RESET,
    '',
    ...me.links.map(([k, v, url]) => label(k) + link(fg(...WHITE) + v + RESET, url)),
    '',
  ];
}

// A rounded box. `reveal` = how many body rows are shown so far.
function box(body, width, reveal = body.length) {
  const edge = fg(...VIOLET);
  const lines = [edge + '╭' + '─'.repeat(width + 2) + '╮' + RESET];
  body.forEach((row, i) => {
    const content = i < reveal ? row : '';
    lines.push(edge + '│ ' + RESET + pad(content, width) + edge + ' │' + RESET);
  });
  lines.push(edge + '╰' + '─'.repeat(width + 2) + '╯' + RESET);
  return lines;
}

function questLine() {
  const items = me.quests.map(([n, u]) => link(fg(...WHITE) + n + RESET, u));
  return fg(...PINK) + '✦ ' + RESET + fg(...GREY) + 'side quests  ' + RESET + items.join(fg(...GREY) + ' · ' + RESET);
}

// ---------- menu ----------

const ACTIONS = [
  { label: 'Open website', run: () => openUrl('https://shreyam.dev', 'shreyam.dev') },
  { label: 'Open GitHub', run: () => openUrl('https://github.com/ShreyamMaity', 'github.com/ShreyamMaity') },
  { label: 'Latest project', run: latestProject },
  { label: 'Play Space Sumo', run: () => openUrl(me.quests[0][1], 'Space Sumo, good luck in the ring') },
  { label: 'Show email', run: () => setStatus(fg(...CYAN) + '✉ ' + RESET + BOLD + me.email + RESET + DIM + '  (copy it from here)' + RESET) },
  { label: 'Quit', run: quit },
];

const COLS = 2;
const BTN = 22;

// A button. Selected buttons are solid with a pink/cyan split shadow;
// `glitch` scrambles the label for the frame, `pop` widens it.
function button(label, selected, glitch = 0, pop = false) {
  let text = label;
  if (glitch) {
    text = [...label].map((c) => (c !== ' ' && Math.random() < glitch ? GLITCH[rand(GLITCH.length)] : c)).join('');
  }
  const inner = pop ? `  ${text}  ` : ` ${text} `;
  const body = pad(inner, BTN - 2);
  if (!selected) return ' ' + fg(...GREY) + '[' + RESET + fg(...WHITE) + body + RESET + fg(...GREY) + ']' + RESET;
  const face = pop ? bg(...WHITE) : bg(...grad(0.15));
  const left = fg(...CYAN) + '▐' + RESET;
  const right = fg(...PINK) + '▌' + RESET;
  return left + face + fg(...INK) + BOLD + '▸' + body.slice(1) + RESET + right;
}

function menuRows(state) {
  const rows = [];
  for (let r = 0; r < ACTIONS.length / COLS; r++) {
    let s = '';
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const sel = i === state.sel;
      s += button(ACTIONS[i].label, sel, sel ? state.glitch : 0, sel && state.pop) + '  ';
    }
    rows.push(s);
  }
  return rows;
}

// ---------- screen ----------

const state = {
  bannerProgress: 0,
  shift: 0,
  typed: 0,
  cursor: true,
  reveal: 0,
  showQuests: false,
  showMenu: false,
  sel: 0,
  glitch: 0,
  pop: false,
  status: '',
};

const compact = () => (out.rows || 40) < 30 || (out.columns || 80) < 72;

function screen(withMenu = state.showMenu) {
  const lines = [''];
  if (compact()) {
    lines.push(' ' + BOLD + [...me.name].map((ch, i) => fg(...grad(i / me.name.length)) + ch).join('') + RESET);
  } else {
    banner(state.bannerProgress, state.shift).forEach((l) => lines.push(' ' + l));
  }
  const tag = me.tagline.slice(0, state.typed);
  const cursor = state.typed < me.tagline.length || state.cursor ? fg(...PINK) + '▌' + RESET : ' ';
  lines.push(' ' + ITALIC + fg(...WHITE) + tag + RESET + (state.typed ? cursor : ''));
  lines.push('');

  const info = infoRows();
  if (compact()) {
    box(info, 40, state.reveal).forEach((l) => lines.push(' ' + l));
  } else {
    const av = avatarRows();
    const body = av.map((a, i) => a + '   ' + (info[i] || ''));
    box(body, AV + 3 + 41, state.reveal).forEach((l) => lines.push(' ' + l));
  }
  lines.push(state.showQuests ? ' ' + questLine() : '');
  lines.push('');
  if (withMenu) {
    menuRows(state).forEach((l) => lines.push(' ' + l));
    lines.push('');
    lines.push(' ' + (state.status || ''));
    lines.push(' ' + DIM + '↑ ↓ ← → move · enter select · q quit' + RESET);
  }
  return lines;
}

let drawn = 0;
function draw(lines = screen()) {
  // Redraw in place: jump back to the top of the last frame.
  let s = drawn ? `${ESC}${drawn}A\r` : '';
  s += lines.map((l) => l + `${ESC}K`).join('\r\n') + '\r\n';
  s += `${ESC}J`;
  out.write(s);
  drawn = lines.length;
}

// Repaint only the first `n` lines (the banner and tagline), then return
// the cursor to where it was.
function drawTop(n) {
  const lines = screen().slice(0, n);
  let s = `${ESC}${drawn}A\r`;
  s += lines.map((l) => l + `${ESC}K`).join('\r\n') + '\r\n';
  s += `${ESC}${drawn - n}B`;
  out.write(s);
}

function setStatus(s) {
  state.status = s;
  draw();
}

// ---------- actions ----------

function openUrl(url, what) {
  const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try {
    const child = cp.spawn(cmd[0], cmd[1], { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
  } catch (e) { /* no browser, the link below still works */ }
  setStatus(fg(...CYAN) + '↗ ' + RESET + 'Opening ' + link(BOLD + what + RESET, url));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'npx-shreyam', Accept: 'application/vnd.github+json' } }, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => (res.statusCode === 200 ? resolve(JSON.parse(data)) : reject(new Error(res.statusCode))));
    });
    req.setTimeout(5000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

async function latestProject() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const spin = setInterval(() => setStatus(fg(...PINK) + frames[i++ % frames.length] + RESET + ' Asking GitHub what I pushed last…'), 80);
  try {
    const repos = await fetchJson('https://api.github.com/users/ShreyamMaity/repos?sort=pushed&per_page=20');
    const r = repos.find((x) => !x.fork && !x.private && x.name !== 'ShreyamMaity');
    clearInterval(spin);
    const desc = (r.description || '').slice(0, 58);
    setStatus(fg(...CYAN) + '◆ ' + RESET + link(BOLD + r.name + RESET, r.html_url) + '  ' + DIM + desc + RESET + '  ' + fg(...PINK) + '★ ' + r.stargazers_count + RESET);
  } catch (e) {
    clearInterval(spin);
    setStatus(fg(...PINK) + '✗ ' + RESET + "Couldn't reach GitHub. Everything lives at " + link('github.com/ShreyamMaity', 'https://github.com/ShreyamMaity'));
  }
}

async function glitchSelection() {
  for (const g of [0.9, 0.6, 0.3, 0]) {
    state.glitch = g;
    draw();
    await sleep(35);
  }
}

async function press() {
  state.pop = true;
  state.glitch = 0.5;
  draw();
  await sleep(70);
  state.glitch = 0;
  draw();
  await sleep(90);
  state.pop = false;
  draw();
  await ACTIONS[state.sel].run();
}

let finishing = false;
async function quit() {
  if (finishing) return;
  finishing = true;
  // Dissolve the menu, then leave the plain card in the scrollback.
  for (const g of [0.3, 0.6, 1]) {
    state.glitch = g;
    state.status = fg(...PINK) + [...'see you around'].map((c) => (Math.random() < g ? GLITCH[rand(GLITCH.length)] : c)).join('') + RESET;
    draw();
    await sleep(60);
  }
  state.cursor = false;
  draw(screen(false));
  out.write(' ' + fg(...PINK) + '✦ ' + RESET + ITALIC + 'Thanks for stopping by. Say hi any time.' + RESET + '\r\n\r\n' + `${ESC}?25h`);
  process.stdin.setRawMode && process.stdin.setRawMode(false);
  process.stdin.pause();
  process.exit(0);
}

// ---------- intro ----------

async function intro() {
  for (let f = 0; f <= 14; f++) {
    state.bannerProgress = f / 14;
    state.shift = f * 0.02;
    draw();
    await sleep(45);
  }
  state.bannerProgress = 1;
  for (let i = 1; i <= me.tagline.length; i++) {
    state.typed = i;
    draw();
    await sleep(me.tagline[i - 1] === '·' ? 120 : 18);
  }
  const rows = compact() ? infoRows().length : AV / 2;
  for (let i = 1; i <= rows; i++) {
    state.reveal = i;
    draw();
    await sleep(40);
  }
  state.showQuests = true;
  state.showMenu = true;
  draw();
}

// Slow gradient drift and a blinking cursor while the menu waits.
function idle() {
  let t = 0;
  return setInterval(() => {
    t++;
    state.shift = (state.shift + 0.012) % 1;
    if (t % 6 === 0) state.cursor = !state.cursor;
    if (!finishing) drawTop(compact() ? 3 : 8);
  }, 110);
}

// ---------- entry ----------

function plain() {
  state.bannerProgress = 1;
  state.typed = me.tagline.length;
  state.cursor = false;
  state.reveal = 99;
  state.showQuests = true;
  return screen(false).join('\n') + '\n';
}

async function main() {
  if (args.includes('--json')) {
    out.write(JSON.stringify(me, null, 2) + '\n');
    return;
  }
  if (!out.isTTY || !process.stdin.isTTY || args.includes('--static')) {
    out.write(plain());
    return;
  }

  out.write(`${ESC}2J${ESC}H${ESC}?25l`);
  process.on('exit', () => out.write(`${ESC}?25h`));

  await intro();
  idle();

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  let busy = false;
  process.stdin.on('data', async (key) => {
    if (busy || finishing) return;
    const n = ACTIONS.length;
    const move = { '\x1b[A': -COLS, k: -COLS, '\x1b[B': COLS, j: COLS, '\x1b[D': -1, h: -1, '\x1b[C': 1, l: 1, '\t': 1 }[key];
    if (key === 'q' || key === '\x03' || key === '\x1b') return quit();
    busy = true;
    if (move !== undefined) {
      state.sel = (state.sel + move + n) % n;
      await glitchSelection();
    } else if (key >= '1' && key <= String(n)) {
      state.sel = Number(key) - 1;
      await glitchSelection();
      await press();
    } else if (key === '\r' || key === ' ') {
      await press();
    }
    busy = false;
  });
}

main();
