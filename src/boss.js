// ボス「ニャン大将」。
//
// entities/ の登録簿に入れていないのは、ボスが他の敵と性質が違うため。
// 1面に1体しかおらず、面データ（名前・体力・出現位置）で駆動され、
// ショットの当たり判定も他の敵を全部調べたあと最後に見る。
// 登録簿は「同じ形のものが何体もいる」ためのしくみなので、そこへ押し込むと
// spawnAll が1体だけ返すなど、あちこちで例外を作ることになる。
//
// 面ごとに行動パターンを変えたくなったら、ここに手を入れる。
import {TAU} from './config.js';
import {ctx} from './canvas.js';
import {stage} from './stage.js';
import {S} from './state.js';
import {sfx} from './audio.js';
import {spawnParticles,spawnRing,popText} from './fx.js';
import {roundRect,triangle} from './draw.js';
import {rectsOverlap,resolveTiles,hurtPlayer} from './combat.js';

function damageBoss(d){if(S.boss.invincible>0||S.boss.mode==='wait'||S.boss.mode==='intro'||S.boss.mode==='die')return;
S.boss.hp-=d;S.boss.invincible=12;sfx('bhit');spawnParticles(S.boss.x+35,S.boss.y+24,5,'#ffffff',2,0.05,16,2.4);
if(S.boss.hp<=0){S.boss.hp=0;S.boss.mode='die';S.boss.deathTimer=0;S.boss.vx=0;}}

// プレイヤーのショットが当たったか。他の敵を全部調べたあとに呼ばれる
export function bossHitByShot(sh){
if(!S.bossStarted||S.bossDead||S.boss.mode==='wait')return false;
if(sh.x>S.boss.x-4&&sh.x<S.boss.x+S.boss.w+4&&sh.y>S.boss.y-4&&sh.y<S.boss.y+S.boss.h+4){damageBoss(sh.damage);return true;}
return false;}

// ボス「ニャン大将」。3つの攻撃パターンを待機を挟んで繰り返す
export function stepBoss(){const pcx=S.playerCenterX,pcy=S.playerCenterY;
if(!S.bossStarted&&!S.bossDead&&S.player.x>stage.boss.triggerX){S.bossStarted=true;S.boss.mode='intro';S.boss.timer=0;S.boss.x=stage.boss.spawnX;S.boss.y=-100;popText(stage.boss.spawnX+35,240,stage.boss.name,'#5a4632');}
if(!S.bossStarted||S.bossDead)return;
const bs=S.boss;if(bs.invincible>0)bs.invincible--;
bs.facing=pcx<bs.x+bs.w/2?-1:1;
// timerは登場演出では加算、idle/shootでは減算して使う。
// 以前はここで毎フレーム加算していたため、idleの減算と相殺してボスが行動しなかった
if(bs.mode==='intro'){bs.timer++;bs.vy=Math.min(bs.vy+0.55,15);bs.y+=bs.vy;bs.onGround=false;resolveTiles(bs,'y');
if(bs.onGround&&bs.timer>70){bs.mode='idle';bs.timer=45;}
return;}
if(bs.mode==='die'){bs.deathTimer++;
if(bs.deathTimer%8===0){spawnRing(bs.x+bs.w/2+(Math.random()-0.5)*50,bs.y+bs.h/2+(Math.random()-0.5)*40);sfx('boom');}
if(bs.deathTimer>72){S.bossDead=true;S.score+=1000;popText(bs.x+35,bs.y,'+1000','#a86b1e');popText(stage.goalX+58,300,'扉が開いた','#3b6d11');spawnRing(bs.x+35,bs.y+28);sfx('clear');}
return;}
if(bs.mode==='idle'){bs.vx*=0.8;bs.timer--;
if(bs.timer<=0){const dd=Math.abs(pcx-bs.x),rn=Math.random();
if(dd>250||rn<0.38){bs.mode='jump';bs.vy=-13.5;bs.vx=bs.facing*4.4;}
else if(rn<0.72){bs.mode='shoot';bs.timer=50;bs.hasFired=false;}
else{bs.mode='hop';bs.hopsLeft=2;bs.vy=-8;bs.vx=bs.facing*3;}}}
else if(bs.mode==='shoot'){bs.vx=0;bs.timer--;
if(bs.timer===28&&!bs.hasFired){bs.hasFired=true;const mx2=bs.x+bs.w/2+bs.facing*30,my2=bs.y+22;
const ang=Math.atan2(pcy-my2,pcx-mx2);
for(let j=-1;j<=1;j++){S.enemyBullets.push({x:mx2,y:my2,vx:Math.cos(ang+j*0.22)*4,vy:Math.sin(ang+j*0.22)*4});}sfx('tshot');}
if(bs.timer<=0){bs.mode='idle';bs.timer=40;}}
const wasOn=bs.onGround;
bs.vy=Math.min(bs.vy+0.55,15);
bs.x+=bs.vx;if(bs.x<stage.arenaLeft+4){bs.x=stage.arenaLeft+4;bs.vx=bs.vx<0?-bs.vx:bs.vx;}if(bs.x>stage.arenaRight-bs.w-4){bs.x=stage.arenaRight-bs.w-4;bs.vx=bs.vx>0?-bs.vx:bs.vx;}
resolveTiles(bs,'x');bs.onGround=false;bs.y+=bs.vy;resolveTiles(bs,'y');
if(bs.onGround&&!wasOn){
// 着地の衝撃で左右に弾をまき散らす
if(bs.mode==='jump'){spawnParticles(bs.x+35,bs.y+bs.h,9,'#c9b08a',2.4,0.08,24,3);
S.enemyBullets.push({x:bs.x-6,y:bs.y+bs.h-10,vx:-3.2,vy:0});S.enemyBullets.push({x:bs.x+bs.w+6,y:bs.y+bs.h-10,vx:3.2,vy:0});sfx('tshot');bs.vx=0;bs.mode='idle';bs.timer=55;}
else if(bs.mode==='hop'){bs.hopsLeft--;
if(bs.hopsLeft>0){bs.vy=-8;bs.vx=bs.facing*3;}else{bs.vx=0;bs.mode='idle';bs.timer=45;}}}
if(S.state==='play'&&rectsOverlap(S.player,bs)){
if(S.powerTimer>0){if(S.powerHitCooldown<=0){damageBoss(1);S.powerHitCooldown=20;}}
else if(S.player.vy>1&&S.player.y+S.player.h<bs.y+bs.h*0.5){damageBoss(1);S.player.vy=-10;S.player.usedDoubleJump=false;}
else hurtPlayer(stage.boss.touchDamage,bs.x+bs.w/2);}}

export function drawBoss(camI){const bs=S.boss;
if(bs.mode==='wait'||S.bossDead)return;
if(bs.invincible>0&&((S.time>>1)&1)===0)return;
const x=bs.x-camI+bs.w/2,y=bs.y+bs.h;
ctx.save();ctx.translate(x,y);ctx.scale(bs.facing>0?2.1:-2.1,2.1);
const D='#2e323b',G='#596070',G2='#454b59',WH='#eef1f5';
ctx.strokeStyle=G;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-15,-14);ctx.quadraticCurveTo(-24,-23,-19,-29);ctx.stroke();
ctx.fillStyle=G2;roundRect(-12,-8,5,8,2);ctx.fill();roundRect(5,-8,5,8,2);ctx.fill();
ctx.fillStyle=G;roundRect(-16,-24,32,18,8);ctx.fill();
ctx.fillStyle='#c9412f';roundRect(-16,-24,32,5,2);ctx.fill();
ctx.fillStyle=G;ctx.beginPath();ctx.arc(11,-24,9,0,TAU);ctx.fill();
triangle(4,-30,7,-39,11,-30);triangle(12,-30,16,-39,18,-29);
ctx.fillStyle='#8a93a5';ctx.beginPath();ctx.arc(11,-27,7,Math.PI,0);ctx.closePath();ctx.fill();
ctx.fillStyle=WH;ctx.beginPath();ctx.ellipse(14,-21,5.5,4,0,0,TAU);ctx.fill();
ctx.fillStyle=D;ctx.beginPath();ctx.arc(9,-24,1.7,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(15,-24.5,1.7,0,TAU);ctx.fill();
ctx.strokeStyle=D;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(5.5,-28);ctx.lineTo(10.5,-26);ctx.stroke();
ctx.fillStyle='#d98a8a';ctx.beginPath();ctx.arc(17.5,-22,1.6,0,TAU);ctx.fill();
ctx.restore();}
