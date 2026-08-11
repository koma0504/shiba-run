import {canvas} from './canvas.js';
import {initAudio} from './audio.js';
import {S} from './state.js';

export const input={left:false,right:false,jump:false,jumpPressed:false,shoot:false};
let fire,startGame;
function setInput(k,v){
if(k==='shoot'){if(v&&!input.shoot){fire(false);S.chargeTimer=0;}
if(!v&&input.shoot){if(S.chargeTimer>=45)fire(true);S.chargeTimer=0;}
input.shoot=v;return;}
if(k==='jump'){if(v&&!input.jump)input.jumpPressed=true;input.jump=v;if(v&&S.state==='title')startGame();}else input[k]=v;}
function bindButton(id,k){const el=document.getElementById(id);const dn=function(e){e.preventDefault();initAudio();setInput(k,true);};const up=function(e){e.preventDefault();setInput(k,false);};el.addEventListener('pointerdown',dn);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);el.addEventListener('touchstart',function(e){e.preventDefault();},{passive:false});el.addEventListener('contextmenu',function(e){e.preventDefault();});}
export function bindInput(callbacks){fire=callbacks.fire;startGame=callbacks.startGame;
bindButton('bL','left');bindButton('bR','right');bindButton('bJ','jump');bindButton('bS','shoot');
canvas.addEventListener('touchstart',function(e){e.preventDefault();},{passive:false});
const KEY_MAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',KeyZ:'shoot',KeyX:'shoot',KeyK:'shoot'};
window.addEventListener('keydown',function(e){const k=KEY_MAP[e.code];if(!k)return;e.preventDefault();initAudio();if(k==='shoot'&&e.repeat)return;setInput(k,true);});
window.addEventListener('keyup',function(e){const k=KEY_MAP[e.code];if(!k)return;setInput(k,false);});}
