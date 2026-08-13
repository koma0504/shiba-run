// 敵と共有する当たり判定・ダメージ処理。
// entities配下がgame.jsを直接importすると循環参照になるため、共通部分をここへ置く。
import {TILE,ROWS} from './config.js';
import {isSolid,stage} from './stage.js';
import {S,makeBoss,resetPlayer} from './state.js';
import {sfx} from './audio.js';
import {spawnParticles,popText} from './fx.js';
import {gameOver} from './ui.js';

export function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

// oを軸axで地形に押し戻す。o.vx/o.vyを見て、めり込んだ分だけ位置を補正する
export function resolveTiles(o,ax){const c1=Math.max(0,Math.floor(o.x/TILE)),c2=Math.min(stage.cols-1,Math.floor((o.x+o.w-0.01)/TILE));const r1=Math.max(0,Math.floor(o.y/TILE)),r2=Math.min(ROWS-1,Math.floor((o.y+o.h-0.01)/TILE));for(let rr=r1;rr<=r2;rr++)for(let cc=c1;cc<=c2;cc++){if(!isSolid(cc,rr))continue;if(ax==='x'){if(o.vx>0)o.x=cc*TILE-o.w;else if(o.vx<0)o.x=(cc+1)*TILE;o.vx=0;}else{if(o.vy>0){o.y=rr*TILE-o.h;o.vy=0;o.onGround=true;}else if(o.vy<0){o.y=(rr+1)*TILE;o.vy=0;}}}}

export function loseLife(){S.lives--;S.combo=0;S.powerTimer=0;sfx('hit');spawnParticles(S.player.x+15,S.player.y+15,12,'#e2554a',2.8,0.1,32,3);S.shots.length=0;S.enemyBullets.length=0;
// ボス戦中に力尽きたら仕切り直すが、与えたダメージは持ち越す。
// 毎回HP満タンに戻ると、何度挑んでも手応えが1ミリも進まず心が折れる
if(S.bossStarted&&!S.bossDead){const carried=S.boss.hp;S.boss=makeBoss();S.boss.hp=carried;S.bossStarted=false;}
if(S.lives<=0){resetPlayer(false);gameOver();}else resetPlayer(false);}

export function hurtPlayer(d,fromX){if(S.player.invincible>0||S.powerTimer>0)return;
S.hp-=d;S.player.invincible=60;S.player.stunTimer=12;S.combo=0;
S.player.vx=(S.player.x+S.player.w/2<fromX?-1:1)*3.5;S.player.vy=-4;
sfx('hit');spawnParticles(S.player.x+15,S.player.y+15,7,'#e2554a',2.2,0.1,24,2.6);
if(S.hp<=0)loseLife();}

// ショットやパワーアップ状態で倒したとき。コンボは加算しない
export function killEnemy(e,pts){e.deadTimer=e.deadTimer||1;S.score+=pts;popText(e.x+e.w/2,e.y-6,'+'+pts,'#a86b1e');spawnParticles(e.x+e.w/2,e.y+10,8,'#ffd23e',2.2,0.08,26,2.6);sfx('stomp');}

// 踏んで倒したとき。着地するまでコンボが伸びる。bounceは踏んだあとの跳ね上がり速度
export function stompEnemy(e,bounce){e.deadTimer=1;S.combo++;const pts=100*S.combo;S.score+=pts;
popText(e.x+10,e.y-6,S.combo>1?('コンボ×'+S.combo+'  +'+pts):('+'+pts),S.combo>1?'#c25a1e':'#5a4632');
spawnParticles(e.x+15,e.y+8,8,'#ffffff',2.2,0.06,24,2.4);S.player.vy=bounce;S.player.usedDoubleJump=false;sfx('stomp');}

// プレイヤーが敵に接触したときの共通処理。
// パワーアップ中なら倒す／上から踏んでいれば踏みつけ／それ以外は被弾、の3分岐は全ての敵で同じ
export function touchEnemy(e,opts){
if(S.powerTimer>0){killEnemy(e,opts.killPoints);return;}
if(S.player.vy>1&&S.player.y+S.player.h<e.y+e.h*0.7){stompEnemy(e,opts.bounce);return;}
hurtPlayer(2,e.x+opts.hurtFromOffset);}
