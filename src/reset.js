// ステージ開始時の初期化。
// state.jsからentitiesをimportすると entities → state → entities の循環参照になるため、
// 「状態の入れ物」(state.js) と「入れ物を満たす処理」(ここ) を分けている。
import {S,resetPlayer} from './state.js';
import {stage,loadStage} from './stage.js';
import {STAGES} from './stages/index.js';
import {makeBoss} from './state.js';
import {ENTITIES} from './entities/index.js';
import {buildTheme} from './render.js';

export function resetAll(){S.score=0;S.boneCount=0;S.lives=3;S.time=0;S.playFrames=0;S.checkpointIndex=-1;S.powerTimer=0;S.combo=0;S.particles.length=0;S.popups.length=0;S.shots=[];S.chargeTimer=0;S.fireCooldown=0;
loadStage(STAGES[S.stageIndex]);
buildTheme();
S.bones=stage.bones.map(function(b){return {x:b.x,y:b.y,taken:false};});
S.meats=stage.meats.map(function(a){return {x:a[0],y:a[1],taken:false};});
// 敵とギミックは登録簿から作る。種類を増やしてもこの行は変わらない
for(const def of ENTITIES)S[def.group]=def.spawnAll();
S.boss=makeBoss();S.bossStarted=false;S.bossDead=false;
resetPlayer(true);}

// 読み込み時に一度初期化しておく（タイトル画面の背景としてステージを描くため）
resetAll();
