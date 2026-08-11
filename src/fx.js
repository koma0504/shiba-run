import {TAU,VIEW_W} from './config.js';
import {S} from './state.js';

export function spawnParticles(x,y,n,col,spd,grav,life,sz){for(let k=0;k<n;k++){if(S.particles.length>140)return;const a=Math.random()*TAU,s=spd*(0.4+Math.random()*0.6);S.particles.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-spd*0.4,gravity:grav,life:life,maxLife:life,color:col,size:sz*(0.6+Math.random()*0.7)});}}
export function spawnRing(x,y){for(let k=0;k<8;k++){const a=k/8*TAU;S.particles.push({x:x,y:y,vx:Math.cos(a)*2.6,vy:Math.sin(a)*2.6,gravity:0,life:32,maxLife:32,color:k%2?'#ffd23e':'#ffffff',size:4});}}
export function confetti(){const CO=['#e2554a','#f0a03c','#79c94f','#5aa9e6','#c58ae0'];for(let k=0;k<70;k++){S.particles.push({x:S.cameraX+Math.random()*VIEW_W,y:-10-Math.random()*80,vx:(Math.random()-0.5)*1.6,vy:1+Math.random()*2,gravity:0.05,life:220,maxLife:220,color:CO[k%5],size:3+Math.random()*3});}}
export function popText(x,y,txt,col){S.popups.push({x:x,y:y,text:txt,color:col||'#5a4632',life:60,width:0});}
export function updateFx(){let k;
for(k=S.particles.length-1;k>=0;k--){const f=S.particles[k];f.vy+=f.gravity;f.x+=f.vx;f.y+=f.vy;f.life--;if(f.life<=0)S.particles.splice(k,1);}
for(k=S.popups.length-1;k>=0;k--){const q=S.popups[k];q.y-=0.6;q.life--;if(q.life<=0)S.popups.splice(k,1);}}
