import {initAudio} from './audio.js';
import {S} from './state.js';
import {resetAll} from './reset.js';
import {updateFx} from './fx.js';
import {bindInput} from './input.js';
import {overlayBtn,startGame} from './ui.js';
import {tryFire,step} from './game.js';
import {render} from './render.js';

bindInput({fire:tryFire,startGame:startGame});
overlayBtn.addEventListener('click',function(){initAudio();if(S.state==='title'){startGame();}else{resetAll();startGame();}});
let last=0,accum=0;
function loop(ts){requestAnimationFrame(loop);if(!last)last=ts;let dt=ts-last;last=ts;if(dt>100)dt=100;accum+=dt;
let steps=0;
while(accum>=16.6667&&steps<3){if(S.state==='play')step();updateFx();if(S.state!=='play')S.time++;accum-=16.6667;steps++;}
if(steps===3)accum=0;
render();}
requestAnimationFrame(loop);
