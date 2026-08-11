import {TILE,HP_MAX} from './config.js';
import {BONE_SPOTS,CAT_SPOTS,CROW_SPOTS,TURRET_SPOTS,SPRING_SPOTS,MEAT_SPOTS,CHECKPOINTS} from './level.js';

export const S = {state:'title',score:0,boneCount:0,lives:3,hp:HP_MAX,time:0,playFrames:0,checkpointIndex:-1,powerTimer:0,powerHitCooldown:0,combo:0,best:0,cameraX:0,player:undefined,cats:undefined,crows:undefined,springs:undefined,movers:undefined,meats:undefined,bones:undefined,turrets:undefined,boss:undefined,bossStarted:undefined,bossDead:undefined,shots:undefined,enemyBullets:undefined,particles:[],popups:[],chargeTimer:0,fireCooldown:0};

export function makeCats(){return CAT_SPOTS.map(function(cc){return {x:cc*TILE+3,y:11*TILE-26,w:34,h:26,facing:-1,deadTimer:0};});}
export function makeCrows(){return CROW_SPOTS.map(function(a){return {x:a[0]*TILE,minX:a[0]*TILE,maxX:a[1]*TILE,baseY:a[2],y:a[2],w:30,h:22,facing:1,speed:a[3],deadTimer:0,vy:0,phase:a[0]};});}
export function makeTurrets(){return TURRET_SPOTS.map(function(cc){return {x:cc*TILE+5,y:11*TILE-26,w:30,h:26,hp:3,cooldown:80,facing:-1,deadTimer:0,hitFlash:0};});}
export function makeBoss(){return {x:250*TILE,y:-100,w:70,h:56,vx:0,vy:0,onGround:false,facing:-1,hp:20,hpMax:20,mode:'wait',timer:0,invincible:0,hopsLeft:0,hasFired:false,deathTimer:0};}
export function resetPlayer(full){S.player={x:(S.checkpointIndex>=0&&!full)?CHECKPOINTS[S.checkpointIndex]:2*TILE,y:11*TILE-30,w:30,h:30,vx:0,vy:0,facing:1,onGround:false,walkPhase:0,invincible:full?0:90,coyote:0,jumpBuffer:0,usedDoubleJump:false,squashTimer:0,stretchTimer:0,stunTimer:0};S.hp=HP_MAX;}
export function resetAll(){S.score=0;S.boneCount=0;S.lives=3;S.time=0;S.playFrames=0;S.checkpointIndex=-1;S.powerTimer=0;S.combo=0;S.particles.length=0;S.popups.length=0;S.shots=[];S.enemyBullets=[];S.chargeTimer=0;S.fireCooldown=0;
S.bones=BONE_SPOTS.map(function(b){return {x:b.x,y:b.y,taken:false};});
S.cats=makeCats();S.crows=makeCrows();S.turrets=makeTurrets();S.boss=makeBoss();S.bossStarted=false;S.bossDead=false;
S.springs=SPRING_SPOTS.map(function(cc){return {x:cc*TILE+6,y:10*TILE+16,w:28,h:24,squash:0};});
S.movers=[{axis:'x',from:100*TILE+4,to:105*TILE-84,x:100*TILE+4,y:8*TILE+14,w:80,h:14,period:260,phase:0,dx:0,dy:0},
{axis:'x',from:200*TILE+4,to:207*TILE-84,x:200*TILE+4,y:8*TILE+14,w:80,h:14,period:300,phase:0.8,dx:0,dy:0},
{axis:'y',from:9*TILE+14,to:5*TILE+14,x:212*TILE+4,y:9*TILE+14,w:80,h:14,period:280,phase:1.5,dx:0,dy:0}];
S.meats=MEAT_SPOTS.map(function(a){return {x:a[0],y:a[1],taken:false};});
resetPlayer(true);}
resetAll();
