import {initAudio} from './audio.js';
import {S} from './state.js';
import {resetAll} from './reset.js';
import {updateFx} from './fx.js';
import {bindInput} from './input.js';
import {overlayBtn,startGame,consumeNextStage,togglePause,resumeGame,showTitle,bindUi} from './ui.js';
import {tryFire,step} from './game.js';
import {render} from './render.js';

bindInput({fire:tryFire,startGame:startGame,togglePause:togglePause});
bindUi({resetAll:resetAll});
overlayBtn.addEventListener('click',function(){initAudio();
if(S.state==='pause'){resumeGame();return;}
if(S.state==='title'){startGame();return;}
// クリアで次の面があるなら進む。それ以外（ゲームオーバー・全面クリア）は面セレクトへ戻す。
// 2面で力尽きたのに1面からやり直させるのは、面が増えるほど理不尽になる
if(consumeNextStage()){S.stageIndex++;resetAll();startGame();return;}
showTitle();});
let last=0,accum=0;
function loop(ts){requestAnimationFrame(loop);if(!last)last=ts;let dt=ts-last;last=ts;if(dt>100)dt=100;
// ポーズ中はフレームを1つも進めない。step()だけでなく updateFx・S.time++・render() も止める。
// S.time は背景・骨の上下動・HPの点滅を駆動しているので、止めないと画面が動き続けてしまう。
// render() も止めるので描画呼び出しが1件も増えない。つまりポーズを挟んでも描画列は同一になり、
// pauseシナリオが runシナリオと一致することでそれを機械的に確かめられる。
// canvasは再描画しなければ内容が保持されるので、画面は止まった絵のまま残る。
// dtを足さずに戻る。lastは上で毎フレーム更新しているので、ポーズが長引いても
// 時間は溜まらない。accumは触らないこと。ここに溜まっている端数は蓄積誤差の繰り越しで、
// 捨てると再開したフレームがstepを1回落とし、以降ずっと1フレームずれる
// （dtは16.6667きっかりにならず、わずかに足りないことがあるため）
if(S.state==='pause')return;
accum+=dt;
let steps=0;
while(accum>=16.6667&&steps<3){if(S.state==='play')step();updateFx();if(S.state!=='play')S.time++;accum-=16.6667;steps++;}
if(steps===3)accum=0;
render();}
requestAnimationFrame(loop);
