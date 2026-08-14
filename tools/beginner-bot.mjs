import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const RUNS = Number(process.env.RUNS||5);
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const results=[];
for(let run=0; run<RUNS; run++){
  const ctx = await b.newContext({viewport:{width:700,height:900}});
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/',{waitUntil:'networkidle'});
  await p.evaluate(()=>localStorage.setItem('shibaRun.v1',JSON.stringify({version:1,muted:true,best:{},cleared:[]})));
  await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(250);
  await p.click('#ovB'); await p.waitForTimeout(150);
  // 初心者ボット: 右へ走り続ける。足元の先に穴が見えたら跳ぶ。
  // ただし反応が遅く（0〜4フレームのばらつき）、2段ジャンプは使わない。
  // 敵が近いと勘で撃つ。上手い人の待ちや引き返しはしない
  await p.evaluate(async(seed)=>{
    const {S}=await import('/src/state.js');
    const {isSolid}=await import('/src/stage.js');
    const {input}=await import('/src/input.js');
    let s=seed; const rnd=()=>((s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff);
    window.__log=[]; window.__max=2; window.__cleared=false;
    let prevLives=S.lives, prevHp=S.hp, lastCol=2, lastY=0, delay=0, jumpHeld=0;
    let stuckX=0, stuckN=0, tick=0;
    window.__t=setInterval(()=>{
      if(S.state==='clear'){window.__cleared=true;return;}
      if(S.state!=='play'||!S.player)return;
      const col=Math.round(S.player.x/40), row=Math.round(S.player.y/40);
      if(S.hp!==prevHp||S.lives!==prevLives){
        window.__log.push({sec:+(S.playFrames/60).toFixed(1),col:lastCol,
          ev:S.lives!==prevLives?(lastY>470?'落下死':'力尽きた'):'被弾', hp:S.hp,lives:S.lives});
        prevHp=S.hp; prevLives=S.lives;}
      lastCol=col; lastY=S.player.y; if(col>window.__max)window.__max=col;
      // 先2〜3列に足場がなければ跳ぶ（反応の遅れつき）
      let holeAhead=false;
      for(let d=2;d<=3;d++){let found=false;
        for(let r=row;r<12;r++) if(isSolid(col+d,r)){found=true;break;}
        if(!found)holeAhead=true;}
      if(holeAhead&&delay<=0){delay=Math.floor(rnd()*5);}
      if(holeAhead&&delay>0){delay--; if(delay===0)jumpHeld=10;}
      input.right=true; input.left=false;
      // 初心者はとりあえず連打する。撃たないボットだと敵の被害を過大に見積もる
      tick++; input.shoot=(tick%22)<6;
      // 段差で止まったら跳ぶ。穴だけ見ていると階段の前で永久に足踏みする
      if(Math.abs(S.player.x-stuckX)<1.5){stuckN++;}else{stuckN=0;stuckX=S.player.x;}
      if(stuckN>18&&jumpHeld<=0){jumpHeld=10;stuckN=0;}
      if(jumpHeld>0){ if(!input.jump)input.jumpPressed=true; input.jump=true; jumpHeld--; }
      else input.jump=false;
    },16);
  }, 1000+run*7);
  // 仮想入力が無い場合に備えてキーボードでも操作する
  const deadline=Date.now()+70000;
  while(Date.now()<deadline){
    const st=await p.evaluate(()=>({s:(window.__cleared?'clear':null), over:document.querySelector('#ovT').textContent}));
    if(st.s==='clear'||/おしまい|クリア|ゲームオーバー/.test(st.over)) break;
    await p.waitForTimeout(250);
  }
  const r=await p.evaluate(()=>{clearInterval(window.__t);return {log:window.__log,max:window.__max,title:document.querySelector('#ovT').textContent};});
  results.push(r);
  await ctx.close();
}
console.log('初心者ボット '+RUNS+'回');
for(let i=0;i<results.length;i++){const r=results[i];
  console.log(`\n[${i+1}] 最も進んだ列 ${r.max}/260  結果: ${r.title}`);
  for(const e of r.log) console.log(`     ${String(e.sec).padStart(5)}秒 ${String(e.col).padStart(3)}列 ${e.ev} (HP${e.hp}/残${e.lives})`);}
const cols=results.map(r=>r.max);
console.log('\n到達列: 最小'+Math.min(...cols)+' 中央'+cols.slice().sort((a,b)=>a-b)[Math.floor(cols.length/2)]+' 最大'+Math.max(...cols));
const deaths={}; for(const r of results) for(const e of r.log) {const k=Math.floor(e.col/5)*5; deaths[k]=(deaths[k]||0)+1;}
console.log('死んだ/被弾した場所（5列ごと）:', Object.entries(deaths).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>`${k}〜${+k+4}列:${v}回`).join('  '));
await b.close();
