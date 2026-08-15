import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import {tmpdir} from 'node:os';
// スクリーンショットの出力先。OUT で上書きできる（既定はOSの一時領域）
const OUT=process.env.OUT||tmpdir();
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const cases=[
 {n:'phone-portrait', w:390,h:844, touch:true},
 {n:'phone-landscape',w:844,h:390, touch:true},
 {n:'small-phone',    w:360,h:640, touch:true},
 {n:'desktop',        w:1280,h:800,touch:false},
];
for(const c of cases){
  const ctx=await b.newContext({viewport:{width:c.w,height:c.h},hasTouch:c.touch,isMobile:c.touch});
  const p=await ctx.newPage();
  await p.goto('http://localhost:8765/',{waitUntil:'networkidle'});
  await p.waitForTimeout(350);
  await p.click('#ovB'); await p.waitForTimeout(250);
  const m=await p.evaluate(()=>{
    const g=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bot:Math.round(r.bottom)};};
    return {cv:g('#cv'), ctrl:g('#ctrl'), meta:g('#bM'), vh:innerHeight, vw:innerWidth,
            scrollH:document.documentElement.scrollHeight, hint:(()=>{const e=document.querySelector('#kbdHint');return e&&getComputedStyle(e).display!=='none';})()};
  });
  const fits = m.ctrl.bot<=m.vh && m.meta.bot<=m.vh;
  const noScroll = m.scrollH<=m.vh+1;
  const used = Math.round(100*m.cv.h/m.vh);
  console.log(`${c.n.padEnd(16)} vp=${m.vw}x${m.vh} canvas=${m.cv.w}x${m.cv.h}@y${m.cv.y} 画面に対する縦の占有=${used}%  ボタン収まる=${fits?'○':'✗'} 縦スクロールなし=${noScroll?'○':'✗'} 説明文=${m.hint?'表示':'非表示'}`);
  await p.screenshot({path:`${OUT}/L-${c.n}.png`});
  await ctx.close();
}
await b.close();
