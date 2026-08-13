// 決定論リプレイ検証: リファクタで挙動が変わっていないことを機械的に証明する
//
// Node上のスタブDOMでゲームを走らせ、決まった入力列を決まったフレーム数だけ流し、
// Canvasへの描画呼び出し列をハッシュ化する。乱数は固定シード、時刻は固定刻み。
// リファクタ前後でダイジェストが一致すれば、描画に現れる挙動は同一である。
//
//   node tools/replay-check.mjs                  … ダイジェストを表示
//   SCENARIO=boss node tools/replay-check.mjs    … ボス戦を検証する（既定は run）
//   DUMP=/tmp/a.txt node tools/replay-check.mjs  … 描画呼び出し列を書き出す（差分調査用）
//   EXPECT=<digest> node tools/replay-check.mjs  … 不一致なら終了コード1（CI用）
//
// シナリオ:
//   run    … 1面のスタート地点から右へ走る。道中の地形・敵・アイテムを広く通る
//   boss   … 1面のボスアリーナ手前へ瞬間移動してボス戦を検証する。
//            runシナリオはボスまで届かないため、これがないとボス戦は無検証になる
//   stage2 … 2面を頭から走る。面を増やしたらここに1つ足すこと
//
// index.html のscriptがインライン／module srcのどちらでも動く。
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCENARIO = process.env.SCENARIO || 'run';
const SCENARIOS = ['run', 'boss', 'stage2', 'pause'];

// pauseシナリオ: runとまったく同じ操作を流しながら、途中で3回ポーズを挟む。
// ポーズ中はゲームが1フレームも進まないので、入力スケジュールも時刻も据え置く。
// 進んだフレーム数がrunと同じ3600になるよう、止めた分だけ全体を延ばす。
// 結果は run と1文字も違わないダイジェストになるはず。
// 違ったら、ポーズが素通しになっていないか、再開時に入力や時間が漏れている。
//
// 止める位置は「ゲームが進んだフレーム数」で指定する。生のフレーム番号で書くと、
// 前のポーズの長さだけ後ろがずれて、狙った場面を外す。
// またポーズが効くのは遊んでいる間だけ。runシナリオが実際に遊んでいるのは5〜795フレームで、
// 残り2800フレームはゲームオーバー画面なので、そこで止めようとしても素通りする
const PAUSE_AT = [[200, 90], [450, 60], [700, 130]];  // [止め始めるゲームフレーム, 止める長さ]
const PAUSED_TOTAL = PAUSE_AT.reduce((n, [, length]) => n + length, 0);

const BASE_FRAMES = SCENARIO === 'boss' ? 1800 : 3600;
const FRAMES = Number(process.env.FRAMES || BASE_FRAMES + (SCENARIO === 'pause' ? PAUSED_TOTAL : 0));
const SEED = Number(process.env.SEED || 12345);
const DUMP = process.env.DUMP || '';
const EXPECT = (process.env.EXPECT || '').trim();

const sha = (s) => createHash('sha256').update(s).digest('hex');

let seedState = SEED | 0;
function seededRandom() {
  seedState = (seedState + 0x6d2b79f5) | 0;
  let t = Math.imul(seedState ^ (seedState >>> 15), 1 | seedState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// 座標は小数6桁に丸めて記録する。
// Math.sin などの超越関数は V8 でも CPU アーキテクチャによって最終1ビットが変わる
// （arm64 の macOS と x64 の Linux で実測。例: -3.7071664773517767 と -3.707166477351776）。
// 丸めないと、同じコードでも環境が違うだけでダイジェストが一致しない。
// ゲームの挙動として意味を持つ差は1画素の何分の1どころではないので、
// 6桁で丸めても壊れた変更は取りこぼさない（重力0.55→0.5501は検出できることを実測で確認済み）。
const PRECISION = 6;
function fmtArg(v) {
  if (v && v.__canvas) return '#' + v.digest();
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return String(v);
    const s = v.toFixed(PRECISION);
    return s === '-0.' + '0'.repeat(PRECISION) ? '0.' + '0'.repeat(PRECISION) : s;
  }
  if (v === null || v === undefined) return String(v);
  if (typeof v === 'object') return '[obj]';
  return String(v);
}

const CTX_METHODS = [
  'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'arcTo', 'ellipse',
  'quadraticCurveTo', 'bezierCurveTo', 'rect', 'roundRect', 'fill', 'stroke',
  'fillRect', 'strokeRect', 'clearRect', 'save', 'restore', 'translate',
  'scale', 'rotate', 'setTransform', 'resetTransform', 'transform', 'clip',
  'fillText', 'strokeText', 'setLineDash',
];
const CTX_PROPS = [
  'fillStyle', 'strokeStyle', 'lineWidth', 'globalAlpha', 'font', 'textAlign',
  'textBaseline', 'lineCap', 'lineJoin', 'miterLimit', 'globalCompositeOperation',
  'imageSmoothingEnabled', 'shadowBlur', 'shadowColor', 'filter',
];

function makeCtx(log) {
  const ctx = {};
  for (const name of CTX_METHODS) {
    ctx[name] = (...args) => { log.push(name + '(' + args.map(fmtArg).join(',') + ')'); };
  }
  ctx.drawImage = (img, ...rest) => {
    log.push('drawImage(' + fmtArg(img) + ',' + rest.map(fmtArg).join(',') + ')');
  };
  // 文字幅は実測できないので決定論的な近似を返す。前後で同じ値なので比較には影響しない
  ctx.measureText = (text) => {
    log.push('measureText(' + text + ')');
    return { width: String(text).length * 7 };
  };
  const gradient = () => ({ addColorStop: (o, c) => log.push('addColorStop(' + fmtArg(o) + ',' + c + ')') });
  ctx.createLinearGradient = (...a) => { log.push('linearGradient(' + a.map(fmtArg).join(',') + ')'); return gradient(); };
  ctx.createRadialGradient = (...a) => { log.push('radialGradient(' + a.map(fmtArg).join(',') + ')'); return gradient(); };
  ctx.createPattern = () => null;
  for (const prop of CTX_PROPS) {
    let value;
    Object.defineProperty(ctx, prop, {
      configurable: true,
      get: () => value,
      set: (next) => { value = next; log.push(prop + '=' + fmtArg(next)); },
    });
  }
  return ctx;
}

const allCanvases = [];
function makeCanvas(w = 300, h = 150) {
  const log = [];
  let cachedLen = -1;
  let cachedHash = '';
  const canvas = {
    __canvas: true,
    width: w,
    height: h,
    log,
    style: {},
    // オフスクリーンcanvasは「生成順」ではなく「中身」で識別する。
    // モジュール分割で生成順が変わっても、内容が同じならダイジェストは変わらない
    digest() {
      if (cachedLen !== log.length) {
        cachedLen = log.length;
        cachedHash = sha(log.join('\n')).slice(0, 12);
      }
      return cachedHash;
    },
    getContext: () => makeCtx(log),
    addEventListener() {},
    removeEventListener() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: w, height: h }),
    toDataURL: () => '',
  };
  allCanvases.push(canvas);
  return canvas;
}

function makeEl(id) {
  return {
    id,
    style: {},
    textContent: '',
    innerHTML: '',
    className: '',
    addEventListener() {},
    removeEventListener() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
    focus() {},
    click() {},
  };
}

const mainCanvas = makeCanvas(640, 480);
const elements = { cv: mainCanvas };
const winListeners = {};
let rafCallback = null;

globalThis.document = {
  getElementById: (id) => (elements[id] ??= makeEl(id)),
  createElement: (tag) => (tag === 'canvas' ? makeCanvas() : makeEl(tag)),
  querySelector: () => null,
  addEventListener() {},
  removeEventListener() {},
  body: makeEl('body'),
  documentElement: makeEl('html'),
  hidden: false,
  visibilityState: 'visible',
};
globalThis.window = {
  addEventListener: (type, fn) => { (winListeners[type] ??= []).push(fn); },
  removeEventListener() {},
  requestAnimationFrame: (cb) => { rafCallback = cb; return 1; },
  cancelAnimationFrame() {},
  devicePixelRatio: 1,
  innerWidth: 1280,
  innerHeight: 720,
  // AudioContextを未定義にしておくと initA の try/catch が捕まえ、音声は無効のまま進む
  AudioContext: undefined,
  webkitAudioContext: undefined,
};
globalThis.requestAnimationFrame = (cb) => { rafCallback = cb; return 1; };
globalThis.cancelAnimationFrame = () => {};

// セーブ用の localStorage。毎回まっさらな状態から始まるので実行結果は変わらない。
// スタブを置かないと src/save.js が ReferenceError で落ちて検証が起動すらしないが、
// それ以上に「保存はするが、保存内容は挙動に影響しない」ことを実際に踏んで確かめたい。
// ここが空のまま run/boss/stage2 のダイジェストが変わらなければ、その裏取りになる
const storageData = new Map();
globalThis.localStorage = {
  getItem: (k) => (storageData.has(k) ? storageData.get(k) : null),
  setItem: (k, v) => { storageData.set(k, String(v)); },
  removeItem: (k) => { storageData.delete(k); },
  clear: () => storageData.clear(),
  key: (i) => [...storageData.keys()][i] ?? null,
  get length() { return storageData.size; },
};

Math.random = seededRandom;

// 入力スケジュール: 右に走り続けながら、周期的にジャンプ・ショット・チャージショットを行う。
// フレーム番号だけで決まるので、何度実行しても同じ操作列になる。
const KEYS = ['ArrowRight', 'Space', 'KeyZ'];
function inputsAt(f) {
  return {
    ArrowRight: f >= 10,
    Space: (f >= 4 && f < 8) || (f >= 40 && f % 47 < 7),
    KeyZ: (f >= 60 && f % 23 < 4) || f % 311 < 70,
  };
}
function fireKey(type, code) {
  const event = { type, code, repeat: false, preventDefault() {}, stopPropagation() {} };
  for (const fn of winListeners[type] ?? []) fn(event);
}

const html = await readFile(join(ROOT, 'index.html'), 'utf8');
const moduleSrc = html.match(/<script[^>]*\bsrc=["']([^"']+)["']/);
let mode;
if (moduleSrc) {
  mode = 'module:' + moduleSrc[1];
  await import(pathToFileURL(join(ROOT, moduleSrc[1])).href);
} else {
  const inline = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (!inline) {
    console.error('index.html に script が見つかりません');
    process.exit(1);
  }
  mode = 'inline';
  new Function(inline[1])();
}

// 開始12フレーム目に一度だけ実行する仕込み。シナリオごとに違う。
// pauseはrunと同じ面を同じ条件で走らせる（違いはポーズを挟むことだけ）ので仕込みは要らない
let setup = null;
let liveState = null;   // ポーズが本当に効いたかを覗いて確かめるため
if (SCENARIO !== 'run') {
  if (!moduleSrc) {
    console.error(`${SCENARIO}シナリオはモジュール版のみ対応しています`);
    process.exit(1);
  }
  const { S } = await import(pathToFileURL(join(ROOT, 'src/state.js')).href);
  const { TILE } = await import(pathToFileURL(join(ROOT, 'src/config.js')).href);
  liveState = S;
  if (SCENARIO === 'pause') {
    // 仕込みは要らない。runと同じ面を同じ条件で走らせ、違いはポーズを挟むことだけ
  } else if (SCENARIO === 'boss') {
    // 中間地点も最後のものに合わせ、被弾死してもアリーナ付近から再開させる
    setup = () => {
      S.checkpointIndex = 3;
      S.player.x = 240 * TILE;
      S.player.y = 11 * TILE - 30;
      S.player.vx = 0;
      S.player.vy = 0;
    };
  } else if (SCENARIO === 'stage2') {
    const { resetAll } = await import(pathToFileURL(join(ROOT, 'src/reset.js')).href);
    setup = () => {
      S.stageIndex = 1;
      resetAll();
      S.state = 'play';
    };
  } else {
    console.error(`未知のシナリオです: ${SCENARIO}`);
    process.exit(1);
  }
}

// 何フレーム目で食い違ったかを突き止めるための区間ハッシュ。
// 環境差やリグレッションの切り分けに使う
const CHUNK = 300;
const chunkMarks = [];
let previous = {};
let timestamp = 0;
let ranFrames = 0;
// ゲームが実際に進んだフレーム数。ポーズ中は増えない。
// 入力スケジュールも区間ハッシュもこちらで数える。そうしないとポーズを挟んだ分だけ
// 操作列がずれてしまい、runとの比較が成立しない
let gameFrame = 0;
let pausedNow = false;
let pauseLeft = 0;
let pauseIndex = 0;
for (let f = 0; f < FRAMES; f++) {
  if (SCENARIO === 'pause' && pauseLeft === 0 && pauseIndex < PAUSE_AT.length
      && gameFrame === PAUSE_AT[pauseIndex][0]) {
    pauseLeft = PAUSE_AT[pauseIndex][1];
    pauseIndex++;
  }
  const wantPause = pauseLeft > 0;
  if (wantPause) pauseLeft--;
  if (wantPause !== pausedNow) {
    fireKey('keydown', 'Escape');
    fireKey('keyup', 'Escape');
    pausedNow = wantPause;
    // 止めたつもりで止まっていなければ、ここで気づけるようにする。
    // ゲームオーバー中など遊んでいない場面ではポーズは効かず、黙って素通りしてしまう
    const expected = wantPause ? 'pause' : 'play';
    if (liveState.state !== expected) {
      console.error(`フレーム${f}（ゲーム${gameFrame}）でポーズが効きませんでした。`);
      console.error(`期待した状態は ${expected} ですが、実際は ${liveState.state} です。`);
      console.error('遊んでいる最中に止めるよう PAUSE_AT を見直してください。');
      process.exit(1);
    }
  }
  if (!wantPause) {
    if (gameFrame > 0 && gameFrame % CHUNK === 0) chunkMarks.push([gameFrame, mainCanvas.log.length]);
    if (gameFrame === 12 && setup) setup();
    const current = inputsAt(gameFrame);
    for (const code of KEYS) {
      if (current[code] && !previous[code]) fireKey('keydown', code);
      if (!current[code] && previous[code]) fireKey('keyup', code);
    }
    previous = current;
    gameFrame++;
    // 時刻を進めるのはゲームが進むフレームだけ。ポーズ中は同じ時刻で呼び直す。
    //
    // こうしないと、ゲームが進むフレームに渡る時刻がrunとポーズ分だけずれる。
    // 固定ステップの積算は dt = ts - last の浮動小数の端数を繰り越して動くので、
    // 時刻の絶対値が変わると端数の出方も変わり、たまに1フレームで2回進む。
    // それはポーズの副作用ではなく、この検証ツールが時刻を作っている都合による差。
    // 同じ時刻列を渡してこそ「ポーズがゲームを乱していない」ことだけを見られる。
    timestamp += 16.6667;
  }
  const cb = rafCallback;
  rafCallback = null;
  if (!cb) {
    console.error(`フレーム${f}でrequestAnimationFrameが途切れました`);
    process.exit(1);
  }
  cb(timestamp);
  ranFrames++;
}

const offscreen = allCanvases.filter((c) => c !== mainCanvas).map((c) => c.digest()).sort();
const mainHash = sha(mainCanvas.log.join('\n')).slice(0, 12);
const digest = sha(mainHash + '|' + offscreen.join(',')).slice(0, 16);

if (DUMP) {
  const limit = Number(process.env.DUMP_LIMIT || 0);
  const lines = limit > 0 ? mainCanvas.log.slice(0, limit) : mainCanvas.log;
  await writeFile(DUMP, lines.join('\n') + '\n');
}
if (process.env.VERBOSE) {
  console.log(`main=${mainHash}`);
  console.log(`offscreen=${offscreen.join(',')}`);
  for (const [frame, upto] of chunkMarks) {
    console.log(`  frame${frame}: ${sha(mainCanvas.log.slice(0, upto).join('\n')).slice(0, 12)}`);
  }
}
const pausedNote = SCENARIO === 'pause' ? ` paused=${ranFrames - gameFrame}` : '';
console.log(`scenario=${SCENARIO} mode=${mode} frames=${gameFrame}${pausedNote} seed=${SEED} ops=${mainCanvas.log.length} offscreen=${offscreen.length}`);
console.log(`digest=${digest}`);

if (EXPECT && EXPECT !== digest) {
  console.error(`\n挙動が変わっています。期待 ${EXPECT} に対して実際は ${digest} でした。`);
  console.error('意図した変更なら tools/replay-baseline.txt を更新してください。');
  console.error('意図しない変更なら DUMP=... で描画呼び出し列を書き出し、変更前後で diff を取ってください。');
  process.exit(1);
}
