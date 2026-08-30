// Phase 1: 保存済み CSS から docs/replicate.md 1-2 の項目を抽出する
//
//   node tools/extract-css.mjs --in reference
//
// 出力: reference/css-extract.json
//   rootVars / fontFaces / mediaQueries / keyframes / transitions / animations
//   hoverRules / cursor / fixedSticky / mixBlendMode / gridTemplateColumns / writingMode
//
// 正規表現ではなく波括弧の対応でルール単位に分割する（ネストした @media も追う）。

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => (a.startsWith('--') ? [a.slice(2), all[i + 1]] : null)).filter(Boolean));
const IN = path.resolve(args.in ?? 'reference');

// CSS をトップレベルのルール列に分割。at-rule の中身は context 付きで再帰する
function parseRules(css, context = []) {
  const rules = [];
  let i = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // コメント除去
  while (i < css.length) {
    const braceOpen = css.indexOf('{', i);
    if (braceOpen === -1) break;
    const selector = css.slice(i, braceOpen).trim();
    let depth = 1;
    let j = braceOpen + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(braceOpen + 1, j - 1);
    if (selector.startsWith('@media') || selector.startsWith('@supports') || selector.startsWith('@layer')) {
      rules.push(...parseRules(body, [...context, selector]));
      rules.push({ selector, body: '', context }); // クエリ自体も記録
    } else {
      rules.push({ selector, body: body.trim(), context });
    }
    i = j;
  }
  return rules;
}

const decl = (body, prop) => {
  const m = body.match(new RegExp(`(?:^|;|\\s)${prop.replace(/[-]/g, '\\-')}\\s*:\\s*([^;]+)`, 'i'));
  return m ? m[1].trim() : null;
};

async function main() {
  const files = (await readdir(path.join(IN, 'css'))).filter((f) => f.endsWith('.css'));
  const out = {
    files: files.length,
    rootVars: {},
    fontFaces: [],
    mediaQueries: new Set(),
    keyframes: [],
    transitions: [],
    animations: [],
    hoverRules: [],
    cursor: [],
    fixedSticky: [],
    mixBlendMode: [],
    gridTemplateColumns: [],
    writingMode: [],
  };

  for (const f of files) {
    const css = await readFile(path.join(IN, 'css', f), 'utf8');
    for (const r of parseRules(css)) {
      const ctx = r.context.join(' ');
      if (r.selector.startsWith('@media')) { out.mediaQueries.add(r.selector); continue; }
      if (r.selector.startsWith('@font-face')) { out.fontFaces.push({ file: f, body: r.body }); continue; }
      if (r.selector.startsWith('@keyframes')) { out.keyframes.push({ file: f, name: r.selector, body: r.body }); continue; }
      if (/^:root\b|^html\b/.test(r.selector)) {
        for (const m of r.body.matchAll(/--([\w-]+)\s*:\s*([^;]+)/g)) out.rootVars[`--${m[1]}`] = m[2].trim();
      }
      const push = (key, value) => out[key].push({ file: f, selector: r.selector, context: ctx, value });
      const t = decl(r.body, 'transition') ?? decl(r.body, 'transition-duration');
      if (t) push('transitions', t);
      const a = decl(r.body, 'animation') ?? decl(r.body, 'animation-name');
      if (a) push('animations', a);
      if (r.selector.includes(':hover')) push('hoverRules', r.body);
      const c = decl(r.body, 'cursor');
      if (c) push('cursor', c);
      const pos = decl(r.body, 'position');
      if (pos === 'fixed' || pos === 'sticky') push('fixedSticky', pos);
      const mb = decl(r.body, 'mix-blend-mode');
      if (mb) push('mixBlendMode', mb);
      const g = decl(r.body, 'grid-template-columns');
      if (g) push('gridTemplateColumns', g);
      const w = decl(r.body, 'writing-mode');
      if (w) push('writingMode', w);
    }
  }

  out.mediaQueries = [...out.mediaQueries].sort();
  await writeFile(path.join(IN, 'css-extract.json'), JSON.stringify(out, null, 2));
  console.log(`extracted from ${files.length} css files → ${path.join(IN, 'css-extract.json')}`);
  console.log(`  rootVars: ${Object.keys(out.rootVars).length}, fontFaces: ${out.fontFaces.length}, media: ${out.mediaQueries.length}, hover: ${out.hoverRules.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
