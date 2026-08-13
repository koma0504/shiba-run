import {save} from './save.js';
let audioCtx=null;
export function initAudio(){if(audioCtx)return;try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.resume)audioCtx.resume();}catch(e){}}
// 音を出す出口はここ1つだけ。sfx()の呼び出し側は20箇所以上あるので、
// 呼び出し側で止めると必ず漏れる
export function tone(f0,f1,d,type,vol,delay){if(save.muted||!audioCtx)return;try{const t=audioCtx.currentTime+(delay||0);const o=audioCtx.createOscillator(),gn=audioCtx.createGain();o.type=type||'square';o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+d);gn.gain.setValueAtTime(vol||0.12,t);gn.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(gn);gn.connect(audioCtx.destination);o.start(t);o.stop(t+d+0.02);}catch(e){}}
export function sfx(n){if(n==='jump')tone(280,620,0.13,'square',0.08);
else if(n==='dj')tone(420,820,0.11,'square',0.08);
else if(n==='spring')tone(170,920,0.2,'square',0.12);
else if(n==='bone')tone(880,1350,0.09,'sine',0.1);
else if(n==='stomp')tone(220,70,0.14,'triangle',0.15);
else if(n==='hit')tone(320,110,0.3,'sawtooth',0.11);
else if(n==='shot')tone(980,620,0.06,'square',0.06);
else if(n==='chg')tone(1150,1650,0.12,'sine',0.09);
else if(n==='big')tone(620,200,0.2,'sawtooth',0.12);
else if(n==='tink')tone(1500,900,0.05,'square',0.07);
else if(n==='tshot')tone(300,180,0.09,'square',0.08);
else if(n==='bhit')tone(520,300,0.08,'triangle',0.1);
else if(n==='boom'){tone(160,55,0.35,'sawtooth',0.14);tone(90,40,0.4,'triangle',0.12,0.05);}
else if(n==='chk'){tone(523,0,0.09,'sine',0.09);tone(784,0,0.12,'sine',0.09,0.09);}
else if(n==='power'){[392,523,659,784].forEach(function(f,ii){tone(f,0,0.09,'square',0.09,ii*0.07);});}
else if(n==='start'){tone(523,0,0.1,'square',0.07);tone(659,0,0.1,'square',0.07,0.1);tone(784,0,0.14,'square',0.07,0.2);}
else if(n==='clear'){[523,659,784,1047].forEach(function(f,ii){tone(f,0,0.16,'triangle',0.11,ii*0.13);});}}
