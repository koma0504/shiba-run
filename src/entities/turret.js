// 砲台ネコ。近づくと弾を撃つ。体力3で、踏むかショットで削る。
import {TAU,TILE,VIEW_W} from '../config.js';
import {TURRET_SPOTS} from '../level.js';
import {S} from '../state.js';
import {ctx} from '../canvas.js';
import {roundRect,triangle} from '../draw.js';
import {rectsOverlap,killEnemy,hurtPlayer} from '../combat.js';
import {spawnRing,spawnParticles} from '../fx.js';
import {sfx} from '../audio.js';

const KILL_POINTS=300;
function destroy(tu){tu.deadTimer=1;spawnRing(tu.x+15,tu.y+13);killEnemy(tu,KILL_POINTS);}

export default {
  key: 'turret',
  group: 'turrets',
  spawnAll(){return TURRET_SPOTS.map((col)=>({x:col*TILE+5,y:11*TILE-26,w:30,h:26,hp:3,cooldown:80,facing:-1,deadTimer:0,hitFlash:0}));},

  update(){const list=S.turrets;
for(let i=list.length-1;i>=0;i--){const tu=list[i];
if(tu.deadTimer){tu.deadTimer++;if(tu.deadTimer>21)list.splice(i,1);continue;}
if(tu.hitFlash>0)tu.hitFlash--;
const dxp=S.playerCenterX-(tu.x+15);
// プレイヤーが射程内にいるときだけ向きを変えて撃つ
if(dxp>-430&&dxp<430){tu.facing=dxp>0?1:-1;tu.cooldown--;
if(tu.cooldown<=0){tu.cooldown=105;S.enemyBullets.push({x:tu.x+15+tu.facing*18,y:tu.y+12,vx:tu.facing*3.4,vy:0});sfx('tshot');}}
if(S.state==='play'&&rectsOverlap(S.player,tu)){
if(S.powerTimer>0){destroy(tu);}
// 踏んでも一撃では倒れない。体力を1削って跳ね返る
else if(S.player.vy>1&&S.player.y+S.player.h<tu.y+tu.h*0.7){tu.hp-=1;tu.hitFlash=8;S.player.vy=-8.5;S.player.usedDoubleJump=false;sfx('tink');if(tu.hp<=0)destroy(tu);}
else hurtPlayer(2,tu.x+15);}}},

  hitByShot(sh){const list=S.turrets;
for(let j=0;j<list.length;j++){const tu=list[j];
if(!tu.deadTimer&&sh.x>tu.x-4&&sh.x<tu.x+tu.w+4&&sh.y>tu.y-4&&sh.y<tu.y+tu.h+4){
tu.hp-=sh.damage;tu.hitFlash=8;sfx('tink');spawnParticles(sh.x,sh.y,4,'#ffffff',1.6,0,12,2);
if(tu.hp<=0)destroy(tu);
return true;}}
return false;},

  draw(camI){const list=S.turrets;
for(let k=0;k<list.length;k++){const tu=list[k];
if(tu.deadTimer||tu.x-camI<-60||tu.x-camI>VIEW_W+60)continue;
const x=tu.x-camI,y=tu.y;
ctx.save();ctx.translate(x+15,y+tu.h);
const fl=tu.hitFlash>0,G=fl?'#e8ecf2':'#6f7684',G2=fl?'#ffffff':'#4c515c';
ctx.fillStyle=G2;roundRect(-16,-8,32,8,2);ctx.fill();
ctx.fillStyle=G;ctx.beginPath();ctx.arc(0,-12,13,Math.PI,0);ctx.closePath();ctx.fill();
ctx.fillStyle=G;triangle(-11,-22,-7,-31,-3,-23);triangle(3,-23,7,-31,11,-22);
ctx.fillStyle=G2;roundRect(tu.facing>0?4:-18,-17,14,6,3);ctx.fill();
ctx.fillStyle=tu.cooldown<30?'#e2554a':'#9aa2af';ctx.beginPath();ctx.arc(tu.facing>0?-6:6,-15,2.4,0,TAU);ctx.fill();
ctx.restore();}},
};
