// エンティティ登録簿。
//
// 敵やギミックを増やすときは、このフォルダにファイルを1つ足して、下の配列へ加える。
// 各定義が持てるもの:
//   key / group  … 識別名と、S内で配列を置くプロパティ名
//   spawnAll()   … 配置データから初期状態の配列を作る
//   update()     … 毎フレームの更新。死亡後の削除も自前で行う
//   hitByShot(shot) … プレイヤーのショットが当たったか。当たったらtrueを返す
//   draw(camI)   … 描画（画面外の間引きも自前で行う）
//   advance() / beforeTileY() / afterTileY() … ギミック用。プレイヤー移動の各段階に割り込む
//
// 配列の順序はそのまま挙動の順序になる。3つに分かれているのは、
// 更新・被弾判定・描画で必要な順序が違うため（下のコメント参照）。
import cat from './cat.js';
import crow from './crow.js';
import turret from './turret.js';
import enemyBullet from './enemyBullet.js';
import spring from './spring.js';
import mover from './mover.js';

// 初期化で配列を作る対象。runtimeOnlyのものは空配列になる
export const ENTITIES = [cat, crow, turret, enemyBullet, spring, mover];

// 更新順。砲台が撃った弾を同じフレームのうちに動かすため、砲台→弾の順に置く
export const UPDATE_ORDER = [turret, enemyBullet, cat, crow];

// ショットの当たり判定順。手前の敵から順に調べ、最初に当たったところで打ち止めにする
export const SHOT_ORDER = [cat, crow, turret];

// 描画順。あとに置いたものが手前に描かれる
export const DRAW_ORDER = [turret, cat, crow];

// ギミック。プレイヤーの移動処理に割り込む順序でもある
export const GIMMICKS = [mover, spring];
