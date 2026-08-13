import {stage} from './stage.js';
import {STAGES} from './stages/index.js';
import {S} from './state.js';
import {sfx} from './audio.js';
import {confetti} from './fx.js';

export const overlay=document.getElementById('ov'),overlayTitle=document.getElementById('ovT'),overlayDesc=document.getElementById('ovD'),overlayBtn=document.getElementById('ovB');
export function startGame(){S.state='play';overlay.style.display='none';sfx('start');}
function showOverlay(t,d,b){overlayTitle.textContent=t;overlayDesc.innerHTML=d;overlayBtn.textContent=b;overlay.style.display='flex';}
function formatTime(s){const m=Math.floor(s/60),ss=s%60;return m+':'+(ss<10?'0':'')+ss;}
export function gameOver(){S.state='over';showOverlay('ゲームオーバー','スコア：'+S.score+' ／ 骨：'+S.boneCount+' 本','もう一度');}

// クリア後にボタンを押したとき、次の面へ進むのか最初からやり直すのか。
// main.jsがこれを見て分岐する
export let pendingNextStage=false;
export function consumeNextStage(){const v=pendingNextStage;pendingNextStage=false;return v;}

export function clearGame(){S.state='clear';sfx('clear');confetti();
const sec=Math.floor(S.playFrames/60),tb=Math.max(0,stage.timeTarget-sec)*10,total=S.score+tb;let nb='';
if(total>S.best){S.best=total;nb='<br>ベスト記録を更新';}
S.score=total;
const detail='タイム：'+formatTime(sec)+' ／ 骨：'+S.boneCount+' / '+stage.totalBones+' 本<br>タイムボーナス：+'+tb+'<br>合計スコア：'+total+nb;
const hasNext=S.stageIndex+1<STAGES.length;
pendingNextStage=hasNext;
if(hasNext)showOverlay(stage.name+' クリア',detail+'<br>次は「'+STAGES[S.stageIndex+1].name+'」','次の面へ');
else showOverlay('全面クリア',detail+'<br>すべての面を踏破しました','もう一度あそぶ');}
