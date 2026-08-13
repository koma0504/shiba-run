// 移動床。往復運動し、乗ったプレイヤーを一緒に運ぶ。
// 位置更新はstepの冒頭、乗せ判定は地形解決のあと（地面より優先して足場になる）
import {TAU,VIEW_W} from '../config.js';
import {stage} from '../stage.js';
import {S} from '../state.js';
import {ctx} from '../canvas.js';
import {roundRect} from '../draw.js';

export default {
  key: 'mover',
  group: 'movers',
  spawnAll(){return (stage.spawns.mover??[]).map((d)=>({axis:d.axis,from:d.from,to:d.to,x:d.x,y:d.y,w:d.w,h:d.h,period:d.period,phase:d.phase,dx:0,dy:0}));},

  advance(){const list=S.movers;
for(let i=0;i<list.length;i++){const m=list[i];
const u=0.5+0.5*Math.sin(S.time*TAU/m.period+m.phase);
const pos=m.from+(m.to-m.from)*u;
// dx/dyは今フレームの移動量。乗っているプレイヤーを運ぶのに使う
if(m.axis==='x'){m.dx=pos-m.x;m.x=pos;m.dy=0;}else{m.dy=pos-m.y;m.y=pos;m.dx=0;}}},

  afterTileY(){const list=S.movers;
for(let i=0;i<list.length;i++){const m=list[i];
if(S.player.vy>=0&&S.player.x+S.player.w>m.x&&S.player.x<m.x+m.w){const foot=S.player.y+S.player.h;
if(foot>=m.y-8&&foot<=m.y+m.h+6){S.player.y=m.y-S.player.h;S.player.vy=0;S.player.onGround=true;S.player.x+=m.dx;}}}},

  draw(camI){const list=S.movers;
for(let k=0;k<list.length;k++){const m=list[k];const mvx=m.x-camI;
if(mvx>-100&&mvx<VIEW_W+40){ctx.fillStyle='#7a8290';roundRect(mvx,m.y,m.w,m.h,4);ctx.fill();ctx.fillStyle='#93dd66';roundRect(mvx,m.y,m.w,5,3);ctx.fill();}}},
};
