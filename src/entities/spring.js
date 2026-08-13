// バネ。踏むと大きく打ち上げる。
// 判定はプレイヤーのY移動後・地形解決の前に行う（先に地面へ吸着されると踏めなくなるため）
import {VIEW_W,TILE} from '../config.js';
import {stage} from '../stage.js';
import {S} from '../state.js';
import {ctx} from '../canvas.js';
import {makeCanvas,roundRectOn} from '../draw.js';
import {spawnParticles} from '../fx.js';
import {sfx} from '../audio.js';

const springCv=makeCanvas(36,32);(function(){const c=springCv.getContext('2d');c.translate(2,2);c.fillStyle='#6b6f78';roundRectOn(c,0,20,28,4,1);c.fill();c.strokeStyle='#d84f44';c.lineWidth=3;c.beginPath();c.moveTo(3,19);c.lineTo(25,15);c.lineTo(3,11);c.lineTo(25,7);c.lineTo(6,4);c.stroke();c.fillStyle='#8a8f99';roundRectOn(c,-2,0,32,5,2);c.fill();})();

export default {
  key: 'spring',
  group: 'springs',
  spawnAll(){return (stage.spawns.spring??[]).map((col)=>({x:col*TILE+6,y:10*TILE+16,w:28,h:24,squash:0}));},

  beforeTileY(){const list=S.springs;
for(let i=0;i<list.length;i++){const s=list[i];if(s.squash>0)s.squash--;
if(S.player.vy>=0&&S.player.x+S.player.w>s.x+3&&S.player.x<s.x+s.w-3){const foot=S.player.y+S.player.h;
if(foot>=s.y-2&&foot<=s.y+s.h+2){S.player.y=s.y-S.player.h;S.player.vy=-20;S.player.usedDoubleJump=false;s.squash=8;S.player.stretchTimer=8;spawnParticles(s.x+14,s.y,7,'#ffffff',2,0.05,22,2.2);sfx('spring');}}}},

  draw(camI){const list=S.springs;
for(let k=0;k<list.length;k++){const s=list[k];const sx=s.x-camI;if(sx<-60||sx>VIEW_W+60)continue;
if(s.squash>0)ctx.drawImage(springCv,sx-2,s.y+9,36,19);else ctx.drawImage(springCv,sx-2,s.y-3);}},
};
