// 飛ぶカラス。決められた区間を往復しながら上下に揺れる。踏むと大きく跳ねる。
import {TAU,TILE,VIEW_W,VIEW_H} from '../config.js';
import {stage} from '../stage.js';
import {S} from '../state.js';
import {ctx} from '../canvas.js';
import {triangle} from '../draw.js';
import {rectsOverlap,killEnemy,touchEnemy} from '../combat.js';

export default {
  key: 'crow',
  group: 'crows',
  // 配置データは [左端の列, 右端の列, 基準の高さ, 速度]
  spawnAll(){return (stage.spawns.crow??[]).map((a)=>({x:a[0]*TILE,minX:a[0]*TILE,maxX:a[1]*TILE,baseY:a[2],y:a[2],w:30,h:22,facing:1,speed:a[3],deadTimer:0,vy:0,phase:a[0]}));},

  update(){const list=S.crows;
for(let i=list.length-1;i>=0;i--){const cr=list[i];
if(cr.deadTimer){cr.deadTimer++;cr.vy+=0.5;cr.y+=cr.vy;if(cr.deadTimer>39||cr.y>VIEW_H+60)list.splice(i,1);continue;}
cr.x+=cr.facing*cr.speed;
if(cr.x<cr.minX){cr.x=cr.minX;cr.facing=1;}if(cr.x>cr.maxX){cr.x=cr.maxX;cr.facing=-1;}
cr.y=cr.baseY+Math.sin(S.time*0.05+cr.phase)*24;
if(S.state==='play'&&rectsOverlap(S.player,cr))touchEnemy(cr,{killPoints:100,bounce:-9.5,hurtFromOffset:15});}},

  hitByShot(sh){const list=S.crows;
for(let j=0;j<list.length;j++){const e=list[j];
if(!e.deadTimer&&sh.x>e.x-4&&sh.x<e.x+e.w+4&&sh.y>e.y-4&&sh.y<e.y+e.h+4){killEnemy(e,100);return true;}}
return false;},

  draw(camI){const list=S.crows;
for(let k=0;k<list.length;k++){const cr=list[k];
if(cr.x-camI<-60||cr.x-camI>VIEW_W+60)continue;
const x=cr.x-camI+15,y=cr.y+11;
ctx.save();ctx.translate(x,y);ctx.scale(cr.facing>0?1:-1,1);
const D='#3c4352';
if(cr.deadTimer){ctx.globalAlpha=Math.max(0,1-cr.deadTimer/40);ctx.rotate(cr.deadTimer*0.2);}
const fl=Math.sin(S.time*0.4+cr.phase)*7;
ctx.fillStyle=D;
triangle(-4,-2,-14,-2-fl-6,4,-4);
ctx.beginPath();ctx.ellipse(0,0,13,8,0,0,TAU);ctx.fill();
triangle(-13,-2,-20,4,-12,5);
ctx.beginPath();ctx.arc(11,-4,6,0,TAU);ctx.fill();
ctx.fillStyle='#f0a03c';triangle(16,-5,23,-3,16,-1);
ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(12,-5,1.6,0,TAU);ctx.fill();
ctx.fillStyle='#3c4352';ctx.beginPath();ctx.arc(12.5,-5,0.8,0,TAU);ctx.fill();
ctx.restore();}},
};
