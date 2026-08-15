import {stage} from './stage.js';
import {STAGES} from './stages/index.js';
import {S} from './state.js';
import {sfx,initAudio} from './audio.js';
import {confetti} from './fx.js';
import {save,setMuted,bestOf,isCleared,recordClear} from './save.js';
import {clearInputEdges} from './input.js';

export const overlay=document.getElementById('ov'),overlayTitle=document.getElementById('ovT'),overlayDesc=document.getElementById('ovD'),overlayBtn=document.getElementById('ovB');
const stageList=document.getElementById('ovS');

// 面のやり直しには reset.js が要るが、ここから import すると
// combat → ui → reset → entities → cat → combat の循環になる。
// bindInput と同じように main.js から渡してもらって、依存の向きを一方向に保つ
// reset.js が同名の関数を輸出しているので、受け取り側は Cb を付けて区別する。
// 名前がぶつかると、1ファイルに固めたときに同じスコープへ並んで壊れる
let resetAllCb=null;
export function bindUi(callbacks){resetAllCb=callbacks.resetAll;}

const muteBtn=document.getElementById('bM');
function syncMuteLabel(){muteBtn.textContent=save.muted?'🔇 消音中':'🔊 音あり';}
muteBtn.addEventListener('click',function(){setMuted(!save.muted);syncMuteLabel();});
syncMuteLabel();
export function startGame(){S.state='play';overlay.style.display='none';sfx('start');}

// ポーズ。S.state に値を1つ足すだけで、既にある8箇所の `S.state==='play'` ガードが
// そのまま「ポーズ中は判定しない」になる。別フラグにすると8箇所すべてに条件を足すことになり、
// 敵を増やすたびに足し忘れが出る
export function togglePause(){if(S.state==='play'){S.state='pause';showOverlay('ポーズ','Esc または P で再開','再開する');}
else if(S.state==='pause')resumeGame();}
export function resumeGame(){if(S.state!=='pause')return;S.state='play';overlay.style.display='none';
// ポーズ中に押されたジャンプが再開の1フレーム目に暴発しないよう、入力のエッジを消す
clearInputEdges();}
// 面セレクトはタイトルのときだけ出す。それ以外の場面では邪魔なので畳む
function showOverlay(t,d,b,withStages){overlayTitle.textContent=t;overlayDesc.innerHTML=d;overlayBtn.textContent=b;
stageList.style.display=withStages?'flex':'none';overlay.style.display='flex';}
function formatTime(s){const m=Math.floor(s/60),ss=s%60;return m+':'+(ss<10?'0':'')+ss;}
export function gameOver(){S.state='over';showOverlay('ゲームオーバー','スコア：'+S.score+' ／ 骨：'+S.boneCount+' 本','面をえらぶ');}

// 1面は常に選べ、以降は前の面をクリアしていれば選べる。
// 全面いつでも開放だと「進める」という動機が消える
function isUnlocked(i){return i<=0||isCleared(STAGES[i-1].id);}

function buildStageList(){
stageList.innerHTML='';
for(let i=0;i<STAGES.length;i++){
const def=STAGES[i],unlocked=isUnlocked(i),best=bestOf(def.id);
const btn=document.createElement('button');
btn.className='stageBtn';
btn.disabled=!unlocked;
btn.textContent=unlocked
  ?((i+1)+'. '+def.name+(isCleared(def.id)?' ✓':'')+(best?'　ベスト '+best:''))
  :((i+1)+'. ？？？（前の面をクリアすると選べる）');
if(unlocked)btn.addEventListener('click',function(){selectStage(i);});
stageList.appendChild(btn);}}

function selectStage(i){initAudio();S.stageIndex=i;resetAllCb();startGame();}

// タイトルへ戻る。面をリセットしてから戻すので、ここでスペースを押せば
// 選んでいる面を頭からやり直せる
export function showTitle(){resetAllCb();S.state='title';buildStageList();
showOverlay('柴犬ラン 5','遊ぶ面をえらんでください。','▶ '+STAGES[S.stageIndex].name+' をはじめる',true);}

// クリア後にボタンを押したとき、次の面へ進むのか最初からやり直すのか。
// main.jsがこれを見て分岐する
export let pendingNextStage=false;
export function consumeNextStage(){const v=pendingNextStage;pendingNextStage=false;return v;}

export function clearGame(){S.state='clear';sfx('clear');confetti();
const sec=Math.floor(S.playFrames/60),tb=Math.max(0,stage.timeTarget-sec)*10,total=S.score+tb;
// クリアとベストを面のidで記録する。ここが保存の唯一の書き込み口
const nb=recordClear(stage.id,total)?'<br>ベスト記録を更新':'';
S.score=total;
const detail='タイム：'+formatTime(sec)+' ／ 骨：'+S.boneCount+' / '+stage.totalBones+' 本<br>タイムボーナス：+'+tb+'<br>合計スコア：'+total+nb;
const hasNext=S.stageIndex+1<STAGES.length;
pendingNextStage=hasNext;
if(hasNext){showOverlay(stage.name+' クリア',detail+'<br>次は「'+STAGES[S.stageIndex+1].name+'」','次の面へ');return;}
showEnding(detail);}

// 最終面のクリアは「面のクリア」ではなく「ゲームの終わり」。
// 面クリアと同じ見出し・同じ言葉づかい・同じボタンだと、遊んだ人は終わったことに気づかないまま
// 面セレクトへ戻ってしまう。見出し・締めの一文・ボタンの3つとも変えて、ここが終点だと分かるようにする。
//
// 描くのは DOM だけで canvas には触らない。
// 注意: どのリプレイシナリオもボスを倒しきらない（boss シナリオも1800フレームでは
// 倒せずに終わる）ので、クリア〜エンディングはリプレイ検証の外にある。
// ここを変えたら必ず実ブラウザで確かめること。
function showEnding(detail){
// 全面の自己ベストの合計。localStorage が使えない環境では 0 になるので、そのときは出さない
let grand=0;for(const def of STAGES)grand+=bestOf(def.id);
const sum=grand>0?'<br>全'+STAGES.length+'面の合計：'+grand:'';
showOverlay('🏆 おしまい',
  'すべての面をかけぬけて、柴犬は犬小屋へ帰りついた。<br><br>'+detail+sum+'<br><br>あそんでくれてありがとう。',
  'タイトルへもどる');}

// 読み込み時にタイトルの面セレクトを組んでおく。
// S.state は 'title' のままなので、ここでゲームの進行には触れない
buildStageList();
