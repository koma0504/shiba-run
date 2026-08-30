// Phase 1 計測ハーネス（docs/replicate.md 1-1〜1-3 の汎用部分）
//
// 使い方:
//   node tools/capture.mjs --base https://satoshiwatanabe.org --out reference
//   node tools/capture.mjs --base http://localhost:8765 --pages / --out /tmp/smoke
//
// やること（ページ × ビューポートごと）:
//   - スクリーンショット: 読み込み直後 t0 / t300 / t1000（ビューポート）と settle 後の fullPage
//   - DOM: settle 後の document.documentElement.outerHTML
//   - ネットワークログ: 全リクエストの url / resourceType / status / content-type
//   - CSS: link[rel=stylesheet] の実体と <style> の中身（@import も1段だけ追跡）
//
// ホバーや押下など状態別の撮影はサイトの DOM を見てから probe スクリプトで行う。
// ここには対象サイト固有のセレクタを一切書かない（推測を持ち込まないため）。

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const BASE = (args.base ?? 'https://satoshiwatanabe.org').replace(/\/$/, '');
const OUT = path.resolve(args.out ?? 'reference');
const PAGES = (args.pages ?? '/,/photography/,/about/').split(',');
const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: '390', width: 390, height: 844 },
];
const DSF = 2;

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[i + 1], i++;
  }
  return o;
}

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const d of ['shots', 'dom', 'net', 'css']) await mkdir(path.join(OUT, d), { recursive: true });

  // ローカル対象（Phase 3 の自作サイト撮影など）はプロキシ不要。外部対象は必ずプロキシ経由。
  // NO_PROXY の CIDR 混じりの値を bypass に渡すと Chromium 側で解析が壊れるので、固定の短い値にする。
  const baseHost = new URL(BASE + '/').hostname;
  const isLocal = ['localhost', '127.0.0.1', '::1'].includes(baseHost);
  const browser = await chromium.launch({
    // コンテナは root 実行なので sandbox を切る
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    proxy: !isLocal && process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined,
  });

  const cssIndex = new Map(); // url -> saved filename（ページ間で重複保存しない）
  const summary = [];

  for (const pagePath of PAGES) {
    for (const vp of VIEWPORTS) {
      const label = `${slug(pagePath)}-${vp.name}`;
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: DSF,
      });
      const page = await context.newPage();

      const netLog = [];
      page.on('response', async (res) => {
        const req = res.request();
        netLog.push({
          url: req.url(),
          resourceType: req.resourceType(),
          status: res.status(),
          contentType: (await res.headerValue('content-type')) ?? '',
        });
      });
      page.on('requestfailed', (req) => {
        netLog.push({ url: req.url(), resourceType: req.resourceType(), status: 'FAILED', error: req.failure()?.errorText ?? '' });
      });

      const url = BASE + pagePath;
      const t0 = Date.now();
      // commit = 最初の応答を受けて描画が始まる瞬間。フェードイン検出のためここから 0/300/1000ms を刻む
      await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      await page.screenshot({ path: path.join(OUT, 'shots', `${label}-t0.png`) });
      await sleep(Math.max(0, 300 - (Date.now() - t0)));
      await page.screenshot({ path: path.join(OUT, 'shots', `${label}-t300.png`) });
      await sleep(Math.max(0, 1000 - (Date.now() - t0)));
      await page.screenshot({ path: path.join(OUT, 'shots', `${label}-t1000.png`) });

      await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await sleep(500);
      await page.screenshot({ path: path.join(OUT, 'shots', `${label}-full.png`), fullPage: true });

      const html = await page.evaluate(() => document.documentElement.outerHTML);
      await writeFile(path.join(OUT, 'dom', `${label}.html`), html);

      // CSS 収集: 外部シートは実体を取得、<style> はそのまま保存
      const sheets = await page.evaluate(() => ({
        links: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
        inline: [...document.querySelectorAll('style')].map((s) => s.textContent ?? ''),
      }));
      for (const href of sheets.links) await saveCss(context, href, cssIndex);
      sheets.inline.forEach(async (text, i) => {
        if (text.trim()) await writeFile(path.join(OUT, 'css', `inline-${label}-${i}.css`), text);
      });

      await writeFile(path.join(OUT, 'net', `${label}.json`), JSON.stringify(netLog, null, 2));
      summary.push({ page: pagePath, viewport: vp.name, url, requests: netLog.length, stylesheets: sheets.links.length, inlineStyles: sheets.inline.length });
      console.log(`done ${label}: ${netLog.length} requests`);
      await context.close();
    }
  }

  // フォントファイルの一覧（1-3）: resourceType=font か拡張子で拾う
  const fonts = new Map();
  for (const s of summary) {
    const { default: fs } = await import('node:fs');
    const log = JSON.parse(fs.readFileSync(path.join(OUT, 'net', `${slug(s.page)}-${s.viewport}.json`), 'utf8'));
    for (const e of log) {
      if (e.resourceType === 'font' || /\.(woff2?|otf|ttf)(\?|$)/.test(e.url)) fonts.set(e.url, { host: new URL(e.url).host, status: e.status });
    }
  }
  await writeFile(path.join(OUT, 'fonts.json'), JSON.stringify([...fonts.entries()].map(([url, v]) => ({ url, ...v })), null, 2));
  await writeFile(path.join(OUT, 'css', 'index.json'), JSON.stringify([...cssIndex.entries()].map(([url, file]) => ({ url, file })), null, 2));
  await writeFile(path.join(OUT, 'capture-summary.json'), JSON.stringify({ base: BASE, capturedAt: new Date().toISOString(), runs: summary }, null, 2));

  await browser.close();
  console.log(`\ncapture complete → ${OUT}`);
}

async function saveCss(context, href, cssIndex, depth = 0) {
  if (cssIndex.has(href) || depth > 1) return;
  try {
    const res = await context.request.get(href);
    const text = await res.text();
    const name = `${createHash('sha1').update(href).digest('hex').slice(0, 10)}.css`;
    cssIndex.set(href, name);
    await writeFile(path.join(OUT, 'css', name), `/* source: ${href} */\n${text}`);
    // @import を1段だけ追う
    for (const m of text.matchAll(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?/g)) {
      await saveCss(context, new URL(m[1], href).href, cssIndex, depth + 1);
    }
  } catch (e) {
    cssIndex.set(href, `FETCH_FAILED: ${e.message}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
