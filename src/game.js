import {TILE,VIEW_W,VIEW_H,HP_MAX,LIVES_MAX} from './config.js';
import {stage,isSolid} from './stage.js';
import {S} from './state.js';
import {sfx} from './audio.js';
import {spawnParticles,popText} from './fx.js';
import {input} from './input.js';
import {clearGame} from './ui.js';
import {resolveTiles,loseLife} from './combat.js';
import {UPDATE_ORDER,SHOT_ORDER,GIMMICKS} from './entities/index.js';
import {stepBoss,bossHitByShot} from './boss.js';

export function tryFire(big){if(S.state!=='play')return;
if(!big&&(S.shots.length>=3||S.fireCooldown>0))return;
const sx=S.player.facing>0?S.player.x+S.player.w+2:S.player.x-8,sy=S.player.y+9;
S.shots.push({x:sx,y:sy,vx:S.player.facing*(big?8.5:7.5),isCharged:!!big,damage:big?3:1});
S.fireCooldown=9;sfx(big?'big':'shot');}


// プレイヤーの横移動・ジャンプ・重力
function stepPlayer(){
if(input.shoot){S.chargeTimer++;if(S.chargeTimer===45)sfx('chg');
if(S.chargeTimer>12&&(S.time&3)===0)spawnParticles(S.player.x+15+(Math.random()-0.5)*30,S.player.y+15+(Math.random()-0.5)*30,1,S.chargeTimer>=45?'#ffd23e':'#9fd4ff',0.6,-0.03,14,2);}
if(S.fireCooldown>0)S.fireCooldown--;
const ACC=0.65,MX=S.powerTimer>0?5.4:4.3;
if(S.player.stunTimer>0){S.player.stunTimer--;}
else if(input.left&&!input.right){S.player.vx=Math.max(S.player.vx-ACC,-MX);S.player.facing=-1;}
else if(input.right&&!input.left){S.player.vx=Math.min(S.player.vx+ACC,MX);S.player.facing=1;}
else{S.player.vx*=0.72;if(S.player.vx>-0.1&&S.player.vx<0.1)S.player.vx=0;}
// coyote: 崖から落ちた直後でも数フレームはジャンプできる猶予
S.player.coyote=S.player.onGround?7:S.player.coyote-1;
// jumpBuffer: 着地の少し前に押したジャンプを取りこぼさない
if(input.jumpPressed){S.player.jumpBuffer=8;input.jumpPressed=false;}else S.player.jumpBuffer--;
if(S.player.stunTimer<=0&&S.player.jumpBuffer>0){
if(S.player.coyote>0){S.player.vy=-13.6;S.player.coyote=0;S.player.jumpBuffer=0;S.player.usedDoubleJump=false;S.player.stretchTimer=6;sfx('jump');}
else if(!S.player.usedDoubleJump){S.player.usedDoubleJump=true;S.player.vy=-11.8;S.player.jumpBuffer=0;S.player.stretchTimer=6;spawnParticles(S.player.x+15,S.player.y+30,6,'#dfeaf2',1.8,0.04,20,2.4);sfx('dj');}}
// ボタンを早く離すと低く跳ぶ
if(!input.jump&&S.player.vy<-4.5)S.player.vy=-4.5;
S.player.vy=Math.min(S.player.vy+0.55,15);
S.player.x+=S.player.vx;
// ボス戦中はアリーナの外へ出られない
const lx=S.bossStarted&&!S.bossDead?stage.arenaLeft+4:0,rx=S.bossStarted&&!S.bossDead?stage.arenaRight-S.player.w-4:stage.worldW-S.player.w;
if(S.player.x<lx){S.player.x=lx;S.player.vx=0;}if(S.player.x>rx){S.player.x=rx;S.player.vx=0;}
resolveTiles(S.player,'x');
const wasOn=S.player.onGround,fallV=S.player.vy;
S.player.onGround=false;S.player.y+=S.player.vy;
for(const g of GIMMICKS)if(g.beforeTileY)g.beforeTileY();
resolveTiles(S.player,'y');
for(const g of GIMMICKS)if(g.afterTileY)g.afterTileY();
if(S.player.onGround){S.player.usedDoubleJump=false;S.combo=0;
if(!wasOn&&fallV>7){S.player.squashTimer=6;spawnParticles(S.player.x+15,S.player.y+30,5,'#c9b08a',1.6,0.06,18,2.4);}}
S.player.walkPhase+=(S.player.vx<0?-S.player.vx:S.player.vx)*0.35;
if(S.player.invincible>0)S.player.invincible--;
if(S.powerHitCooldown>0)S.powerHitCooldown--;
if(S.powerTimer>0){S.powerTimer--;if((S.time%3)===0)spawnParticles(S.player.x+15+(Math.random()-0.5)*24,S.player.y+15+(Math.random()-0.5)*24,1,'#ffd23e',0.8,-0.02,20,2);}
if(S.player.squashTimer>0)S.player.squashTimer--;if(S.player.stretchTimer>0)S.player.stretchTimer--;
// 以降の判定が参照する中心座標。ここで固定するのが原作の挙動（state.jsのコメント参照）
S.playerCenterX=S.player.x+15;S.playerCenterY=S.player.y+15;}

// 骨・肉・中間地点の取得
function stepPickups(){const pcx=S.playerCenterX,pcy=S.playerCenterY;
for(let i=0;i<S.bones.length;i++){const b=S.bones[i];if(b.taken)continue;
if(b.x<pcx-40||b.x>pcx+40)continue;
if(Math.abs(pcx-b.x)<24&&Math.abs(pcy-b.y)<26){b.taken=true;S.boneCount++;S.score+=50;spawnParticles(b.x,b.y,5,'#fff3c2',1.8,0.03,20,2.2);sfx('bone');
if(S.boneCount%20===0&&S.lives<LIVES_MAX){S.lives++;popText(b.x,b.y-16,'1UP','#3b6d11');sfx('chk');}}}
for(let i=0;i<S.meats.length;i++){const mt=S.meats[i];
if(!mt.taken&&Math.abs(pcx-mt.x)<26&&Math.abs(pcy-mt.y)<28){mt.taken=true;S.powerTimer=480;S.hp=HP_MAX;S.score+=200;popText(mt.x,mt.y-14,'パワーアップ','#b8770f');spawnParticles(mt.x,mt.y,12,'#ffd23e',2.6,0.05,30,3);sfx('power');}}
for(let i=S.checkpointIndex+1;i<stage.checkpoints.length;i++){if(S.player.x>stage.checkpoints[i]){S.checkpointIndex=i;S.hp=HP_MAX;popText(stage.checkpoints[i],356,'中間地点','#3b6d11');sfx('chk');}}}

// プレイヤーのショット
function stepShots(){
for(let i=S.shots.length-1;i>=0;i--){const sh=S.shots[i];sh.x+=sh.vx;
let hit=false;const cc2=Math.floor((sh.x+(sh.vx>0?6:-6))/TILE),rr2b=Math.floor(sh.y/TILE);
if(isSolid(cc2,rr2b)){spawnParticles(sh.x,sh.y,4,'#cfeaff',1.5,0,12,2);hit=true;}
// チャージショットは敵の弾を撃ち消す。消してもショット自体は進み続ける
if(!hit&&sh.isCharged){for(let j=S.enemyBullets.length-1;j>=0;j--){const eb=S.enemyBullets[j];if(Math.abs(sh.x-eb.x)<12&&Math.abs(sh.y-eb.y)<12){S.enemyBullets.splice(j,1);spawnParticles(sh.x,sh.y,4,'#ffd23e',1.6,0,12,2);sfx('tink');}}}
if(!hit){for(const def of SHOT_ORDER){if(def.hitByShot(sh)){hit=true;break;}}}
if(!hit&&bossHitByShot(sh))hit=true;
if(hit||sh.x<S.cameraX-60||sh.x>S.cameraX+VIEW_W+60)S.shots.splice(i,1);}}


export function step(){S.time++;S.playFrames++;
for(const g of GIMMICKS)if(g.advance)g.advance();
stepPlayer();
stepPickups();
stepShots();
for(const def of UPDATE_ORDER)def.update();
stepBoss();
if(S.player.y>VIEW_H+60)loseLife();
if(S.state==='play'&&S.bossDead&&S.player.x+S.player.w>stage.goalX+8)clearGame();}
