---
title: 柴犬ラン Step2 ESモジュール分割と可読化
status: approved        # draft | approved | in-progress | done | aborted
created: 2026-08-11
planner: claude-opus-5
executor: codex-cli 0.147.0 (gpt-5.6-sol)
target: /Users/komayuuta/project/games/test
---

# 実行計画書: 柴犬ラン Step2 ESモジュール分割と可読化

承認経緯: 2026-08-11 の会話でユーザーが3ステップ基盤化方針を承認済み。Step1完了（コミット84e3efb）を受けてStep2に着手する。実行者はCodex（[[codex-implementation-workflow]]の分業）。

## 1. 目的と完了条件

- 目的: 421行1ファイルのゲームコードを10個のESモジュールへ分割し、識別子を意味の通る名前にする。**挙動は1ミリも変えない**。以後「ステージ追加はlevel.jsだけ」「難易度調整はconfig.jsだけ」で済む土台にする。
- 完了条件（S1〜S4はCodexが検証、S5はClaudeが検収）:
  - [ ] `node tools/replay-check.mjs | tail -1` → `digest=f95011843bc0462d`
  - [ ] `ls src/*.js | wc -l` → `10`
  - [ ] `grep -c 'script type="module" src="src/main.js"' index.html` → `1`
  - [ ] `grep -cE '^<script>$' index.html` → 出力 `0`（終了コード1。インラインscriptが残っていない）
  - [ ] `grep -c 'ti ti-' index.html` → 出力 `0`（終了コード1。Step1の成果を壊していない）
  - [ ] `grep -chE '^\s*var ' src/*.js | sort -u` → `0` のみ（varが1つも残っていない）
  - [ ] `grep -lE '\b(chargeT|bcount|chkI|pwCd|ebs|turs|inp|KM|CHKS|AR0|AR1)\b' src/*.js; echo "rc=$?"` → `rc=1`（旧名が残っていない）
  - [ ] ブラウザ検収（Claude実施）: サーバ経由で表示 → スタート → 移動・ジャンプ・ショット・骨取得が動作 → コンソールエラー0件

## 2. 事実（現状）

| 事実 | 出典（コマンド／パス） |
|---|---|
| `index.html` は473行。L1〜L48がHTML/CSS、L49が `<script>` 単独行、L50〜L470がJS本体421行、L471が `</script>`、L472〜473が `</body></html>` | ファイル実読 |
| 現在のリプレイダイジェストは `f95011843bc0462d`（3600フレーム、シード12345、描画呼び出し737237回、オフスクリーンcanvas13枚） | `node tools/replay-check.mjs` |
| このダイジェストは重力0.55→0.5501の変更を検出し、変数名変更（chargeT→chargeTimer）では変化しない。挙動同一性の判定に使える | 計画時に実測（`sed`で改変して比較） |
| モジュール直下の共有ループ変数 `i` `j` `r` は、関数をまたいで値を引き継ぐ用途では使われていない。`step()`が呼ぶ`spawnFx`は`k`、`hitTiles`は`rr`/`cc`を使う | コード実読で全呼び出しを確認 |
| `var`宣言はループ内でクロージャを生成していない（`map`/`forEach`のコールバック引数のみ）。`let`/`const`へ機械的に置換して安全 | コード実読 |
| ESモジュールは `file://` では読めない。動作確認は必ず `node tools/serve.mjs` 経由（ポート8765） | ブラウザのCORS仕様 |
| 開発サーバは二重起動するとEADDRINUSEの案内を出して正常終了する。既に起動中なら起動不要 | `tools/serve.mjs` L43-51 |

## 3. 判断記録

| # | 論点 | 選択肢 | 採用 | 理由（却下理由を含む） |
|---|---|---|---|---|
| 1 | 分割の軸 | アクター別（player/enemies） / システム別（state/game/render） | システム別 | `step()`が全アクターを1関数で更新しており、アクター別に割ると関数の切開が必要で挙動変更リスクが高い。システム別なら移動だけで済む。アクター別はStep3のデータ駆動化で自然に解決する |
| 2 | 可変状態の共有方法 | 個別export / 単一オブジェクト`S` / クラス化 | 単一オブジェクト`S` | ESモジュールのimport束縛は再代入できないため個別exportは不可（`score++`が書けない）。クラス化は`this`の配線が増えて移動が変更になる |
| 3 | リネームの範囲 | 全識別子 / モジュール間APIとオブジェクトフィールドのみ | モジュール間APIとフィールドのみ | 関数内の一時変数（`e2`,`sh`,`mt`等）まで含めると差分が肥大しレビュー不能になる。拡張性に効くのは境界の名前。一時変数は各関数を触る機会に直す |
| 4 | 分割とリネームの順序 | 同時 / 分割→リネーム | 分割→リネーム（S3→S4） | 同時にやるとダイジェスト不一致時に原因が「移動ミス」か「置換ミス」か切り分けられない |
| 5 | UI関数の置き場所 | main.js / 専用ui.js | 専用ui.js | `gameOver`/`clearGame`は`step()`から呼ばれる。main.jsに置くとgame.js↔main.jsの循環参照になる |
| 6 | 入力の副作用 | input.jsからtryFire直接呼び出し / コールバック注入 | コールバック注入`bindInput({fire,startGame})` | 直接呼び出しはinput.js↔game.jsの循環参照になる |
| 7 | IIFEラッパー | 残す / 外す | S1では残し、S3で外す | モジュールスコープは既に隔離されているため不要だが、S1は「そのまま移動」に徹して検証を単純化する |
| 8 | var→let/const | やる / やらない | S4でやる | 事実欄のとおりクロージャ問題がなく安全。モジュール化の目的である可読性に直結する |

## 4. 制約とスコープ外

- やらないこと（non-goals）: ゲームロジックの変更、バランス調整、新機能、新ステージ、データ駆動化（Step3）、関数内一時変数のリネーム、TypeScript化、npm/バンドラー導入、テストフレームワーク導入
- 触らないファイル・領域: `index.html`のL1〜L48（HTML/CSS部）、`tools/`、`.claude/`、`.git/`、`plans/`配下の本計画書の「9. 実行ログ」以外
- 守るべき規約・互換性: 外部リソース参照ゼロを維持。`index.html`のDOM構造・id・インラインstyleは変更しない（`<script>`タグの1行のみ差し替える）

## 5. 前提知識の注入

- **検証の要**: `node tools/replay-check.mjs` がこの作業の唯一の合否判定である。スタブDOM上でゲームを3600フレーム走らせ、Canvasへの描画呼び出し列をハッシュ化する。**各ステップの後に必ず実行し、`digest=f95011843bc0462d` と一致しなければ次へ進まない**
- 不一致になったときの調査手順:
  1. `DUMP=/tmp/after.txt node tools/replay-check.mjs`
  2. `git stash && DUMP=/tmp/before.txt node tools/replay-check.mjs && git stash pop`
  3. `diff /tmp/before.txt /tmp/after.txt | head -20` で最初に食い違う描画呼び出しを見る。そこが壊した箇所である
- ESモジュールのimport束縛は**再代入できない**。`import {score} from './state.js'; score++` は実行時エラーになる。可変状態は必ず `S.score++` の形で扱う
- `<script type="module">` は自動的にdeferされ、DOM構築後に実行される。現在のコードはDOM取得を即時に行っているが、moduleなら問題ない
- リプレイ検証はAudioContextを未定義にして走るため、音声コードは`try/catch`で無音のまま通過する。音の実機確認はブラウザ検収（S5、Claude担当）で行う
- `grep -c` はマッチ0件のとき「0」を出力し**終了コード1**を返す。0件が期待値の検証では終了コード1は失敗ではない

## 6. モジュール構成（S3の分割先）

依存は上から下への一方向のみ。循環参照を作らないこと。

| ファイル | 責務 | importする先 |
|---|---|---|
| `src/config.js` | 定数（TAU, VIEW_W, VIEW_H, TILE, COLS, ROWS, WORLD_W, HP_MAX） | なし |
| `src/level.js` | タイル地形の構築、骨/敵/バネ/肉/中間地点の配置データ、`isSolid()` | config |
| `src/state.js` | 可変状態オブジェクト`S`、`makeCats/makeCrows/makeTurrets/makeBoss`、`resetPlayer/resetAll` | config, level |
| `src/audio.js` | `initAudio/tone/sfx` | なし |
| `src/fx.js` | `spawnParticles/spawnRing/confetti/popText/updateFx` | config, state |
| `src/ui.js` | `showOverlay/startGame/gameOver/clearGame/formatTime` | config, level, state, audio, fx |
| `src/input.js` | `input`オブジェクト、`bindInput({fire, startGame})` | なし |
| `src/game.js` | `step()`と全ゲームロジック（当たり判定・ダメージ・敵/ボス更新・射撃） | config, level, state, audio, fx, ui |
| `src/render.js` | オフスクリーンスプライト生成、全描画、HUD | config, level, state, input |
| `src/main.js` | 配線とゲームループ | 全モジュール |

## 7. リネーム表（S4で適用）

**モジュール直下の変数・関数**

| 旧 | 新 | 旧 | 新 |
|---|---|---|---|
| `cv` | `canvas` | `T` | `TILE` |
| `W` / `H` | `VIEW_W` / `VIEW_H` | `WORLD` | `WORLD_W` |
| `HPMAX` | `HP_MAX` | `g` | `tileGrid` |
| `F` | `fillTiles` | `addB` | `addBones` |
| `BONES` | `BONE_SPOTS` | `NB` | `TOTAL_BONES` |
| `CATS0` | `CAT_SPOTS` | `CROWS0` | `CROW_SPOTS` |
| `TURS0` | `TURRET_SPOTS` | `SPRINGS0` | `SPRING_SPOTS` |
| `MEATS0` | `MEAT_SPOTS` | `CHKS` | `CHECKPOINTS` |
| `GOAL` | `GOAL_X` | `AR0` / `AR1` | `ARENA_LEFT` / `ARENA_RIGHT` |
| `solid` | `isSolid` | `p` | `player` |
| `bcount` | `boneCount` | `pf` | `playFrames` |
| `chkI` | `checkpointIndex` | `pw` | `powerTimer` |
| `pwCd` | `powerHitCooldown` | `cam` | `cameraX` |
| `turs` | `turrets` | `ebs` | `enemyBullets` |
| `fx` | `particles` | `pops` | `popups` |
| `chargeT` | `chargeTimer` | `fireCd` | `fireCooldown` |
| `A` | `audioCtx` | `initA` | `initAudio` |
| `spawnFx` | `spawnParticles` | `pop` | `popText` |
| `updFx` | `updateFx` | `inp` | `input` |
| `press` | `setInput` | `bindBtn` | `bindButton` |
| `KM` | `KEY_MAP` | `ov`/`ovT`/`ovD`/`ovB` | `overlay`/`overlayTitle`/`overlayDesc`/`overlayBtn` |
| `start` | `startGame` | `showOv` | `showOverlay` |
| `fmt` | `formatTime` | `rectHit` | `rectsOverlap` |
| `hitTiles` | `resolveTiles` | `killE` | `killEnemy` |
| `stompE` | `stompEnemy` | `dmgBoss` | `damageBoss` |
| `hurtHP` | `hurtPlayer` | `mkCv` | `makeCanvas` |
| `rr2c`/`rr2` | `roundRectOn`/`roundRect` | `tric`/`tri` | `triangleOn`/`triangle` |
| `CL` / `HL` | `CLOUDS` / `HILLS` | `makeTurs` | `makeTurrets` |
| `shibaDraw` | `drawShiba` | `catDraw` | `drawCat` |
| `crowDraw` | `drawCrow` | `turDraw` | `drawTurret` |
| `bossDraw` | `drawBoss` | `drawVBar` | `drawMeterBar` |

**オブジェクトのフィールド**（全生成箇所・全参照箇所を揃えて変更する）

| 対象 | 旧 → 新 |
|---|---|
| プレイヤー | `on`→`onGround`, `dir`→`facing`, `ph`→`walkPhase`, `inv`→`invincible`, `coy`→`coyote`, `buf`→`jumpBuffer`, `dj`→`usedDoubleJump`, `sqt`→`squashTimer`, `stt`→`stretchTimer`, `stun`→`stunTimer` |
| 敵共通 | `d`→`facing`, `dead`→`deadTimer` |
| カラス | `sp`→`speed`, `by`→`baseY`, `x0`/`x1`→`minX`/`maxX`, `seed`→`phase` |
| 砲台 | `cd`→`cooldown`, `ht`→`hitFlash` |
| ボス | `st`→`mode`, `t`→`timer`, `inv`→`invincible`, `max`→`hpMax`, `hopN`→`hopsLeft`, `fired`→`hasFired`, `dieT`→`deathTimer`, `on`→`onGround`, `d`→`facing` |
| 弾 | `big`→`isCharged`, `dmg`→`damage` |
| パーティクル | `g`→`gravity`, `l`→`life`, `ml`→`maxLife`, `c`→`color`, `s`→`size` |
| ポップアップ | `t`→`text`, `c`→`color`, `l`→`life`, `w`→`width` |
| 移動床 | `o`→`axis`, `a0`/`a1`→`from`/`to`, `per`→`period`, `ph`→`phase` |
| バネ | `sq`→`squash` |
| 骨・肉 | `t`→`taken` |

**入力オブジェクト**: `inp.l`→`input.left`, `inp.r`→`input.right`, `inp.j`→`input.jump`, `inp.jp`→`input.jumpPressed`, `inp.s`→`input.shoot`

上表にない識別子（関数内の一時変数 `e2` `e3` `tu` `tu2` `ct` `cr` `sh` `eb` `mt` `b` `s` `m` `k` `i` `j` `rr` `cc` など）は**変更しない**。

## 8. ステップ

### S1: インラインscriptを src/main.js へそのまま移す
- 変更対象: `src/main.js`（新規）、`index.html`（L49〜L471のみ）
- 作業内容:
  1. `index.html` のL50〜L470（JS本体421行、IIFEを含む）を1文字も変えずに `src/main.js` へ移す
  2. `index.html` のL49〜L471（`<script>`〜`</script>`）を次の1行に置き換える: `<script type="module" src="src/main.js"></script>`
- 検証:
  - `node tools/replay-check.mjs | tail -1` → `digest=f95011843bc0462d`
  - `node tools/replay-check.mjs | head -1` の `mode=` が `module:src/main.js` であること
  - `grep -cE '^<script>$' index.html` → 出力 `0`（終了コード1で正常）
- 失敗時: ダイジェスト不一致ならセクション5の調査手順を1回だけ実施して修正。2回目も不一致なら停止して実行ログに記録

### S2: 可変状態を単一オブジェクト S に集約する（まだ1ファイル内）
- 変更対象: `src/main.js`
- 作業内容:
  1. `var state='title',score=0,...` と `var p,cats,crows,...` で宣言されている**全ての可変状態**を、1つのオブジェクトリテラル `const S = { ... }` にまとめる
  2. 全参照箇所を `S.state` `S.score` `S.p` … の形に置換する。`p={...}` は `S.p={...}`、`fx.length=0` は `S.fx.length=0` のように、代入も含めて漏れなく行う
  3. 定数（TAU, W, H, T, COLS, ROWS, WORLD, HPMAX, BONES, CATS0 …）と関数は`S`に入れない。`g`（タイル配列）も再代入されないため`S`に入れない
  4. この時点ではプロパティ名は旧名のまま（`S.bcount` 等）。リネームはS4で行う
- 検証: `node tools/replay-check.mjs | tail -1` → `digest=f95011843bc0462d`
- 失敗時: セクション5の調査手順を1回だけ実施して修正。2回目も不一致なら停止して実行ログに記録

### S3: 10モジュールへ分割する
- 変更対象: `src/` 配下10ファイル
- 作業内容:
  1. セクション6の表のとおり `src/config.js` `src/level.js` `src/state.js` `src/audio.js` `src/fx.js` `src/ui.js` `src/input.js` `src/game.js` `src/render.js` を作成し、`src/main.js` から該当コードを**移動**する（書き換えない）
  2. 各モジュールは必要なものを `export` し、使う側は `import` する。依存はセクション6の表の方向のみ。循環参照を作らない
  3. `input.js` は `press` の中の `tryFire` / `start` 呼び出しを、`bindInput({fire, startGame})` で受け取ったコールバック経由に変える。`main.js` が `bindInput({fire: tryFire, startGame: start})` で配線する
  4. モジュール直下で共有していたループ変数 `i` `j` `r` は、各モジュール内で個別に宣言してよい（事実欄で関数間の値の引き継ぎがないことを確認済み）
  5. `main.js` に残すのは、import群、`bindInput`と`overlayBtn`のクリック配線、`loop()`、初回の`requestAnimationFrame(loop)` のみ
  6. IIFEラッパー `(function(){ ... })();` を外す（モジュールスコープで隔離されるため不要）
- 検証:
  - `node tools/replay-check.mjs | tail -1` → `digest=f95011843bc0462d`
  - `ls src/*.js | wc -l` → `10`
- 失敗時: セクション5の調査手順を1回だけ実施して修正。2回目も不一致なら停止して実行ログに記録

### S4: 識別子をリネームし var を let/const にする
- 変更対象: `src/` 配下10ファイル
- 作業内容:
  1. セクション7のリネーム表を全ファイルに適用する。`S`のプロパティ名も表に従って変更する（例: `S.bcount` → `S.boneCount`）
  2. 表にない関数内一時変数は変更しない
  3. `var` を全て `let` / `const` にする。再代入しないものは `const`、するものは `let`
- 検証:
  - `node tools/replay-check.mjs | tail -1` → `digest=f95011843bc0462d`
  - `grep -chE '^\s*var ' src/*.js | sort -u` → `0` のみ
  - `grep -lE '\b(chargeT|bcount|chkI|pwCd|ebs|turs|inp|KM|CHKS|AR0|AR1)\b' src/*.js; echo "rc=$?"` → `rc=1`
- 失敗時: セクション5の調査手順を1回だけ実施して修正。2回目も不一致なら停止して実行ログに記録

### S5: ブラウザ検収とコミット（実施者: Claude。Codexは実施しない）
- 作業内容: 完了条件の全コマンド再実行、サーバ経由でのブラウザ実プレイ確認、モジュール構成のレビュー、コミット
- 失敗時: 問題箇所を特定し、計画を修正した上でCodexに差し戻す

## 9. プレモーテム

| 失敗経路 | 兆候 | 対策（反映先ステップ） |
|---|---|---|
| S2で状態の参照漏れが起き、`score`がグローバル変数として暗黙生成されて別物になる | ダイジェスト不一致。HUDのスコア描画が0のまま | S2の検証をダイジェストで行う。S3以降はモジュールが暗黙のstrictモードなので未宣言代入は即エラーになり、S1〜S2の漏れもそこで露見する |
| ESモジュール化で循環参照が生じ、import時にundefinedを掴んで起動しない | replay-checkが「requestAnimationFrameが途切れました」で異常終了 | セクション6の表で依存方向を一方向に固定。判断記録#5・#6で循環を生む2箇所（ui/input）を先に解決済み |
| リネームでフィールド名の変更が生成箇所と参照箇所で片方だけになる | ダイジェスト不一致。該当エンティティが動かない／NaNになる | S4の作業内容2で「全生成箇所・全参照箇所を揃えて」と明示。ダイジェストで機械検出 |
| `boss.st`→`boss.mode` のように、文字列比較（`bs.st==='idle'`）の左辺だけ直して右辺の文字列も直してしまう | ボス戦が始まらない／固まる。ダイジェスト不一致 | リネーム表は**識別子のみ**が対象で文字列リテラルは対象外であることを本欄で明示。`'idle'` `'jump'` `'shoot'` `'hop'` `'die'` `'intro'` `'wait'` `'title'` `'play'` `'over'` `'clear'` は変更しない |
| 分割とリネームを同時にやり、不一致の原因が切り分けられず時間を溶かす | S3で不一致、原因不明 | 判断記録#4でS3（移動のみ）とS4（リネームのみ）を分離 |
| `index.html` のHTML部を巻き込んで編集し、Step1の成果（アイコン置換・CSS変数）を壊す | `grep -c 'ti ti-'` が0以外、または表示崩れ | S1の変更対象をL49〜L471に限定。完了条件に `ti ti-` チェックを残す |

## 10. 実行ログ

| 日時 | ステップ | 結果 | 検証出力（要約） | 逸脱・メモ |
|---|---|---|---|---|
