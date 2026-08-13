import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT='/tmp/claude-0/-home-user-shiba-run/c88bded8-b8f8-5b74-963e-b608f2643079/scratchpad';
const URL='http://localhost:8765/';
const KEY='shibaRun.v1';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx = await b.newContext({viewport:{width:700,height:820}});
const p = await ctx.newPage();
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
const ok=[], ng=[];
const chk=(name,cond,detail='')=>{(cond?ok:ng).push(name+(detail?` — ${detail}`:''));};

await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(400);

// --- 1. ミュート ---
const muteBefore = (await p.textContent('#bM')).trim();
await p.click('#bM');
await p.waitForTimeout(200);
const muteAfter = (await p.textContent('#bM')).trim();
chk('ミュート: ボタン表示が切り替わる', muteBefore!==muteAfter, `${muteBefore} -> ${muteAfter}`);
const stored = await p.evaluate(k=>localStorage.getItem(k), KEY);
chk('ミュート: localStorage に保存される', !!stored && JSON.parse(stored).muted===true, stored||'null');
await p.reload({waitUntil:'networkidle'});
await p.waitForTimeout(300);
const muteReload = (await p.textContent('#bM')).trim();
chk('ミュート: リロード後も保持される', muteReload===muteAfter, `reload -> ${muteReload}`);
await p.click('#bM'); await p.waitForTimeout(150); // 音ありに戻す

// --- 2. 面セレクト（未クリア時） ---
const btns0 = await p.$$eval('#ovS button', bs=>bs.map(b=>({t:b.textContent.trim(), dis:b.disabled})));
chk('面セレクト: ボタンが面の数だけ出る', btns0.length===2, JSON.stringify(btns0));
chk('面セレクト: 2面が未クリア時はロックされている', btns0.length>1 && btns0[1].dis===true, JSON.stringify(btns0[1]||{}));

// --- 3. 面セレクト（クリア済みを注入） ---
await p.evaluate(k=>localStorage.setItem(k, JSON.stringify({version:1,muted:false,best:{stage1:12345},cleared:['stage1']})), KEY);
await p.reload({waitUntil:'networkidle'});
await p.waitForTimeout(300);
const btns1 = await p.$$eval('#ovS button', bs=>bs.map(b=>({t:b.textContent.trim(), dis:b.disabled})));
chk('面セレクト: 1面クリア後に2面が開く', btns1.length>1 && btns1[1].dis===false, JSON.stringify(btns1));
chk('記録: 自己ベストがタイトルに出る', JSON.stringify(btns1).includes('12345')||(await p.textContent('#ovD')).includes('12345'), JSON.stringify(btns1));
await p.screenshot({path:OUT+'/v1-select.png'});

// innerHTML 組み直しの罠（CLAUDE.md）: 再描画してもボタンが増えないこと
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(300);
const btns2 = await p.$$eval('#ovS button', bs=>bs.length);
chk('面セレクト: 再描画でボタンが増殖しない', btns2===btns1.length, `${btns1.length} -> ${btns2}`);

// --- 4. ポーズ ---
await p.click('#ovB');
await p.waitForTimeout(500);
const ovDuringPlay = await p.evaluate(()=>getComputedStyle(document.querySelector('#ov')).display);
chk('プレイ中はオーバーレイが消えている', ovDuringPlay==='none', ovDuringPlay);
await p.keyboard.down('ArrowRight');
await p.waitForTimeout(900);
await p.keyboard.up('ArrowRight');
const xBefore = await p.evaluate(()=>document.querySelector('#cv').toDataURL().length);
await p.keyboard.press('Escape');
await p.waitForTimeout(500);
const ovPaused = await p.evaluate(()=>getComputedStyle(document.querySelector('#ov')).display);
const pauseTxt = (await p.textContent('#ovT')).trim();
chk('ポーズ: Esc でオーバーレイが出る', ovPaused!=='none', `display=${ovPaused} title=${pauseTxt}`);
await p.screenshot({path:OUT+'/v2-pause.png'});
// ポーズ中は画面が止まっている（canvas が変化しない）
const c1 = await p.evaluate(()=>document.querySelector('#cv').toDataURL());
await p.waitForTimeout(700);
const c2 = await p.evaluate(()=>document.querySelector('#cv').toDataURL());
chk('ポーズ: 画面が完全に止まる（再描画されない）', c1===c2, c1===c2?'同一':'差分あり');
// 再開
await p.keyboard.press('Escape');
await p.waitForTimeout(600);
const ovResumed = await p.evaluate(()=>getComputedStyle(document.querySelector('#ov')).display);
chk('ポーズ: Esc で再開できる', ovResumed==='none', ovResumed);
const c3 = await p.evaluate(()=>document.querySelector('#cv').toDataURL());
chk('ポーズ: 再開後に画面が動き出す', c3!==c2);
// P キーでもポーズできる
await p.keyboard.press('KeyP');
await p.waitForTimeout(400);
chk('ポーズ: P キーでも止まる', (await p.evaluate(()=>getComputedStyle(document.querySelector('#ov')).display))!=='none');
await p.keyboard.press('KeyP'); await p.waitForTimeout(300);

// --- 5. タッチ操作（モバイル） ---
const m = await b.newContext({viewport:{width:390,height:844}, hasTouch:true, isMobile:true});
const mp = await m.newPage();
await mp.goto(URL,{waitUntil:'networkidle'});
await mp.waitForTimeout(400);
await mp.click('#ovB'); await mp.waitForTimeout(300);
await mp.tap('#bR'); await mp.tap('#bJ'); await mp.waitForTimeout(500);
await mp.screenshot({path:OUT+'/v3-mobile.png'});
const cvBox = await (await mp.$('#cv')).boundingBox();
chk('モバイル: canvas が画面幅に収まる', cvBox.width<=390, `w=${Math.round(cvBox.width)}`);
const bjBox = await (await mp.$('#bJ')).boundingBox();
chk('モバイル: 操作ボタンがビューポート内にある', bjBox.y+bjBox.height<=844, `bJ.bottom=${Math.round(bjBox.y+bjBox.height)}`);

chk('JS例外が出ていない', errs.length===0, errs.join(' | '));

console.log('\n===== OK ('+ok.length+') =====');
ok.forEach(s=>console.log('  ✓ '+s));
console.log('\n===== NG ('+ng.length+') =====');
ng.forEach(s=>console.log('  ✗ '+s));
await b.close();
