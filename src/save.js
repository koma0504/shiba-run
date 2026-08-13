// セーブデータの読み書き。localStorage に触るのはこのファイルだけにする。
//
// 保存内容をゲーム中の挙動へ反映してはいけない。面を始めた瞬間の状態は、
// 保存があってもなくても完全に同一でなければならない。初期状態が保存内容で変わると、
// リプレイ検証が「実行環境に前回の保存が残っているか」に依存して決定論が崩れる。
// 保存が効くのはタイトルの表示・面セレクトで選べる範囲・音のオンオフだけ。
//
// localStorage は「無い」だけでなく「触ると例外を投げる」ことがある。
// Safari のプライベートブラウジングは存在したうえで setItem が失敗し、
// Node 上の検証スタブには変数自体が無い。存在判定と try/catch の両方が要る。
//
// 面ごとの記録は面の id で持つ。配列の添字だと、面を途中に挿入した瞬間に
// 他の面の記録がずれて紐づく。

const KEY='shibaRun.v1';

export const save={version:1,muted:false,best:{},cleared:[]};

function storage(){try{return typeof localStorage==='undefined'?null:localStorage;}catch(e){return null;}}

// 読めない・壊れている・型が違うときは既定値のまま黙って続行する。
// セーブが壊れているせいで遊べなくなるのが最悪なので、部分的に読めた分だけ拾う
export function loadSave(){
const store=storage();if(!store)return;
let raw;try{raw=store.getItem(KEY);}catch(e){return;}
if(!raw)return;
let data;try{data=JSON.parse(raw);}catch(e){return;}
if(!data||typeof data!=='object'||data.version!==1)return;
save.muted=data.muted===true;
if(data.best&&typeof data.best==='object')for(const id in data.best){const v=data.best[id];if(typeof v==='number'&&isFinite(v)&&v>0)save.best[id]=v;}
if(Array.isArray(data.cleared))for(const id of data.cleared)if(typeof id==='string'&&save.cleared.indexOf(id)<0)save.cleared.push(id);}

export function saveNow(){const store=storage();if(!store)return false;
try{store.setItem(KEY,JSON.stringify(save));return true;}catch(e){return false;}}

export function bestOf(stageId){return save.best[stageId]||0;}
export function isCleared(stageId){return save.cleared.indexOf(stageId)>=0;}

// クリアを記録する。ベストを更新したときだけ true を返す
export function recordClear(stageId,score){
const renewed=score>bestOf(stageId);
if(renewed)save.best[stageId]=score;
if(!isCleared(stageId))save.cleared.push(stageId);
saveNow();
return renewed;}

export function setMuted(v){save.muted=!!v;saveNow();}

loadSave();
