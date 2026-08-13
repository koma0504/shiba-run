// 歩きネコ。地面の端で折り返す。踏める。
import {TAU,TILE,VIEW_W} from '../config.js';
import {isSolid,stage} from '../stage.js';
import {S} from '../state.js';
import {ctx} from '../canvas.js';
import {roundRect,triangle} from '../draw.js';
import {rectsOverlap,killEnemy,touchEnemy} from '../combat.js';

export default {
  key: 'cat',
  group: 'cats',
  spawnAll(){return (stage.spawns.cat??[]).map((col)=>({x:col*TILE+3,y:11*TILE-26,w:34,h:26,facing:-1,deadTimer:0}));},

  update(){const list=S.cats;
for(let i=list.length-1;i>=0;i--){const ct=list[i];
if(ct.deadTimer){ct.deadTimer++;if(ct.deadTimer>21)list.splice(i,1);continue;}
ct.x+=ct.facing*1.1;
// 進行方向の足元を見て、壁にぶつかるか床が途切れていたら折り返す
const front=ct.facing>0?ct.x+ct.w+1:ct.x-1;
const fc=Math.floor(front/TILE),fr=Math.floor((ct.y+ct.h-2)/TILE);
if(isSolid(fc,fr)||!isSolid(fc,fr+1)){ct.facing*=-1;ct.x+=ct.facing*2.2;}
if(S.state==='play'&&rectsOverlap(S.player,ct))touchEnemy(ct,{killPoints:100,bounce:-8.5,hurtFromOffset:17});}},

  hitByShot(sh){const list=S.cats;
for(let j=0;j<list.length;j++){const e=list[j];
if(!e.deadTimer&&sh.x>e.x-4&&sh.x<e.x+e.w+4&&sh.y>e.y-4&&sh.y<e.y+e.h+4){killEnemy(e,100);return true;}}
return false;},

  draw(camI){const list=S.cats;
for(let k=0;k<list.length;k++){const ct=list[k];
if(ct.x-camI<-60||ct.x-camI>VIEW_W+60)continue;
const x=ct.x-camI,y=ct.y;
ctx.save();ctx.translate(x+17,y+ct.h);ctx.scale(ct.facing>0?1:-1,1);
const D='#343841',G='#8b93a1',G2='#6f7684',WH='#eef1f5';
if(ct.deadTimer){ctx.globalAlpha=Math.max(0,1-ct.deadTimer/22);ctx.fillStyle=G;ctx.beginPath();ctx.ellipse(0,-4,17,4.5,0,0,TAU);ctx.fill();ctx.strokeStyle=D;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(4,-7);ctx.lineTo(8,-3);ctx.moveTo(8,-7);ctx.lineTo(4,-3);ctx.stroke();ctx.restore();continue;}
const sw=Math.sin(S.time*0.25+ct.x)*3;
ctx.strokeStyle=G;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-15,-14);ctx.quadraticCurveTo(-23,-22,-19,-28);ctx.stroke();
ctx.fillStyle=G2;roundRect(-12+sw*0.4,-8,5,8,2);ctx.fill();roundRect(5-sw*0.4,-8,5,8,2);ctx.fill();
ctx.fillStyle=G;roundRect(-16,-24,32,18,8);ctx.fill();
ctx.fillStyle=G2;roundRect(-8,-24,4,6,2);ctx.fill();roundRect(0,-24,4,6,2);ctx.fill();
ctx.fillStyle=G;ctx.beginPath();ctx.arc(11,-24,9,0,TAU);ctx.fill();
triangle(4,-30,7,-39,11,-30);triangle(12,-30,16,-39,18,-29);
ctx.fillStyle=WH;ctx.beginPath();ctx.ellipse(14,-21,5.5,4,0,0,TAU);ctx.fill();
ctx.fillStyle=D;ctx.beginPath();ctx.arc(9,-24.5,1.5,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(15,-25,1.5,0,TAU);ctx.fill();
ctx.strokeStyle=D;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(6,-28);ctx.lineTo(10,-26.5);ctx.stroke();
ctx.fillStyle='#d98a8a';ctx.beginPath();ctx.arc(17.5,-22,1.6,0,TAU);ctx.fill();
ctx.restore();}},
};
