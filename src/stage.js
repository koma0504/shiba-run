// 「いま読み込んでいる面」の置き場。
//
// 面を切り替えるとこの中身が丸ごと入れ替わる。各モジュールは stage.goalX のように
// プロパティ越しに読む。ESモジュールのimport束縛は再代入できないため、
// export const で個別に出すと差し替えられない（state.js の S と同じ理由）。
import {ROWS,TILE} from './config.js';

export const stage = {
  id:'', name:'', cols:0, worldW:0, timeTarget:300,
  theme:null,
  grid:[],           // grid[行][列] が '#' なら地面
  bones:[], meats:[],
  spawns:{},         // entities の登録名 → 配置データ
  checkpoints:[], goalX:0, arenaLeft:0, arenaRight:0,
  boss:null,
  totalBones:0,
};

export function loadStage(def){
  stage.id=def.id;stage.name=def.name;stage.cols=def.cols;stage.worldW=def.cols*TILE;
  stage.timeTarget=def.timeTarget;stage.theme=def.theme;

  // 地形を組み立てる
  stage.grid=[];
  for(let r=0;r<ROWS;r++)stage.grid.push(new Array(def.cols).fill('.'));
  for(const [c1,c2,r1,r2] of def.terrain){
    for(let rr=r1;rr<=r2;rr++)for(let cc=c1;cc<=c2;cc++)stage.grid[rr][cc]='#';
  }

  // 骨を並べる。並び順は描画順・取得判定順になるので定義順を保つ
  stage.bones=[];
  for(const [c1,c2,rr] of def.bones){
    for(let cc=c1;cc<=c2;cc++)stage.bones.push({x:cc*TILE+TILE/2,y:rr*TILE+TILE/2});
  }
  stage.totalBones=stage.bones.length;

  stage.meats=def.meats;
  stage.spawns=def.spawns;
  stage.checkpoints=def.checkpoints;
  stage.goalX=def.goalX;stage.arenaLeft=def.arenaLeft;stage.arenaRight=def.arenaRight;
  stage.boss=def.boss;
}

export function isSolid(cc,rr){return rr>=0&&rr<ROWS&&cc>=0&&cc<stage.cols&&stage.grid[rr][cc]==='#';}
