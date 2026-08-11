import {TOTAL_BONES} from './level.js';
import {S} from './state.js';
import {sfx} from './audio.js';
import {confetti} from './fx.js';

export const overlay=document.getElementById('ov'),overlayTitle=document.getElementById('ovT'),overlayDesc=document.getElementById('ovD'),overlayBtn=document.getElementById('ovB');
export function startGame(){S.state='play';overlay.style.display='none';sfx('start');}
function showOverlay(t,d,b){overlayTitle.textContent=t;overlayDesc.innerHTML=d;overlayBtn.textContent=b;overlay.style.display='flex';}
function formatTime(s){const m=Math.floor(s/60),ss=s%60;return m+':'+(ss<10?'0':'')+ss;}
export function gameOver(){S.state='over';showOverlay('ゲームオーバー','スコア：'+S.score+' ／ 骨：'+S.boneCount+' 本','もう一度');}
export function clearGame(){S.state='clear';sfx('clear');confetti();
const sec=Math.floor(S.playFrames/60),tb=Math.max(0,300-sec)*10,total=S.score+tb;let nb='';
if(total>S.best){S.best=total;nb='<br>ベスト記録を更新';}
S.score=total;
showOverlay('ゴール','タイム：'+formatTime(sec)+' ／ 骨：'+S.boneCount+' / '+TOTAL_BONES+' 本<br>タイムボーナス：+'+tb+'<br>合計スコア：'+total+nb,'もう一度あそぶ');}
