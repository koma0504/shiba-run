// 敵の弾。砲台ネコとボスが撃つ。配置データからは生まれず、実行中にだけ増える。
import {VIEW_W,VIEW_H,TILE} from '../config.js';
import {isSolid} from '../stage.js';
import {S} from '../state.js';
import {ctx} from '../canvas.js';
import {makeCanvas} from '../draw.js';
import {spawnParticles} from '../fx.js';
import {hurtPlayer} from '../combat.js';

const bulletCv=makeCanvas(10,10);(function(){const c=bulletCv.getContext('2d');c.fillStyle='#f0a03c';c.beginPath();c.arc(5,5,4,0,Math.PI*2);c.fill();c.fillStyle='#7a4b12';c.beginPath();c.arc(5,5,1.8,0,Math.PI*2);c.fill();})();

export default {
  key: 'enemyBullet',
  group: 'enemyBullets',
  runtimeOnly: true,
  spawnAll(){return [];},

  update(){const list=S.enemyBullets;
for(let i=list.length-1;i>=0;i--){const eb=list[i];
// 被弾で残機を失うと loseLife が弾を全消しする。
// 後ろから走査しているので、その先の添字は空になっている。ここで打ち切る
if(!eb)break;
eb.x+=eb.vx;eb.y+=eb.vy;
const ec=Math.floor(eb.x/TILE),er=Math.floor(eb.y/TILE);
if(isSolid(ec,er)){spawnParticles(eb.x,eb.y,3,'#f0a03c',1.2,0,10,2);list.splice(i,1);continue;}
if(eb.x<S.cameraX-80||eb.x>S.cameraX+VIEW_W+80||eb.y>VIEW_H+40){list.splice(i,1);continue;}
if(S.state==='play'&&S.player.invincible<=0&&eb.x>S.player.x-3&&eb.x<S.player.x+S.player.w+3&&eb.y>S.player.y-3&&eb.y<S.player.y+S.player.h+3){
if(S.powerTimer>0){spawnParticles(eb.x,eb.y,3,'#ffd23e',1.4,0,10,2);list.splice(i,1);continue;}
hurtPlayer(1,eb.x);list.splice(i,1);}}},

  draw(camI){const list=S.enemyBullets;
for(let k=0;k<list.length;k++){const eb=list[k];ctx.drawImage(bulletCv,(eb.x-camI-5)|0,(eb.y-5)|0);}},
};
