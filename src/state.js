import {TILE,HP_MAX} from './config.js';
import {CHECKPOINTS} from './level.js';

// ゲーム中に変化する値はすべてここに集める。
// ESモジュールのimport束縛は再代入できないため（import した score を score++ できない）、
// 1つのオブジェクトのプロパティとして持たせている。
//
// playerCenterX/Y はプレイヤーの中心。敵の判定はすべてこの値を見る。
// 1フレームに1度だけ更新するのが要点で、被弾死して復活位置へ飛んだあとも
// そのフレーム中の残りの敵は「死ぬ直前の位置」を見続ける（原作の挙動）
export const S = {state:'title',score:0,boneCount:0,lives:3,hp:HP_MAX,time:0,playFrames:0,checkpointIndex:-1,powerTimer:0,powerHitCooldown:0,combo:0,best:0,cameraX:0,playerCenterX:0,playerCenterY:0,player:undefined,cats:undefined,crows:undefined,springs:undefined,movers:undefined,meats:undefined,bones:undefined,turrets:undefined,enemyBullets:undefined,boss:undefined,bossStarted:undefined,bossDead:undefined,shots:undefined,particles:[],popups:[],chargeTimer:0,fireCooldown:0};

export function makeBoss(){return {x:250*TILE,y:-100,w:70,h:56,vx:0,vy:0,onGround:false,facing:-1,hp:20,hpMax:20,mode:'wait',timer:0,invincible:0,hopsLeft:0,hasFired:false,deathTimer:0};}

// full=trueは最初から、falseは中間地点からの再開
export function resetPlayer(full){S.player={x:(S.checkpointIndex>=0&&!full)?CHECKPOINTS[S.checkpointIndex]:2*TILE,y:11*TILE-30,w:30,h:30,vx:0,vy:0,facing:1,onGround:false,walkPhase:0,invincible:full?0:90,coyote:0,jumpBuffer:0,usedDoubleJump:false,squashTimer:0,stretchTimer:0,stunTimer:0};S.hp=HP_MAX;}
