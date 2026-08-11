---
title: 柴犬ラン Step1 スタンドアロン化
status: approved        # draft | approved | in-progress | done | aborted
created: 2026-08-11
planner: claude-fable-5
executor: codex-cli 0.147.0 (gpt-5.6-sol)
target: /Users/komayuuta/project/games/test
---

# 実行計画書: 柴犬ラン Step1 スタンドアロン化

承認経緯: 2026-08-11 の会話でユーザーが Step1 の方針（git保全＋スタンドアロン化）を承認し、実行者に Codex を指定した。

## 1. 目的と完了条件

- 目的: claude.ai の Artifact 断片形式である柴犬ラン5を、外部環境に依存しない単体 `index.html` にし、ローカルブラウザで完動させる。ゲームロジック（JS）は1文字も変えない。
- 完了条件（S1〜S3 は Codex が検証、S4 は Claude が検収）:
  - [ ] `test -f index.html && echo OK` → `OK`
  - [ ] `awk '/^<script>$/{f=1;next} /^<\/script>/{f=0} f' index.html | md5 -q` → `f9767f647616c33850665abf19d49456`
  - [ ] `grep -c 'ti ti-' index.html` → 出力 `0`（終了コード1。これが正常）
  - [ ] `grep -ci '<!doctype html>' index.html` → `1`
  - [ ] `grep -oE '^[[:space:]]*--(font-sans|border|surface-2|text-primary|text-secondary|text-muted):' index.html | wc -l` → `6`
  - [ ] `grep -cE 'https?://' index.html` → 出力 `0`（終了コード1。外部リソース参照ゼロ）
  - [ ] `test ! -f shiba_run_platformer_v5_optimized.html && echo GONE` → `GONE`
  - [ ] ブラウザ検収（Claude実施）: `node tools/serve.mjs` 起動 → http://localhost:8765 表示 → スタート押下 → 移動・ジャンプ・ショットが反応 → コンソールエラー0件

## 2. 事実（現状）

| 事実 | 出典（コマンド／パス） |
|---|---|
| 原本 `shiba_run_platformer_v5_optimized.html` は改行数446行。L1=sr-only見出し、L2〜L24=UIのDOM、L25=`<script>`（単独行）、L26〜最終行の直前まで=JS本体、最終行=`</script>`（末尾改行なし） | `wc -l` / ファイル実読 |
| JS部（`<script>`行の次から`</script>`行の前まで）は421行、md5は `f9767f647616c33850665abf19d49456` | `awk '/^<script>$/{f=1;next} /^<\/script>/{f=0} f' <原本> \| md5 -q` |
| 使用CSS変数は6種類: `--font-sans` `--border`（2箇所使用） `--surface-2` `--text-primary` `--text-secondary` `--text-muted`。定義はどこにもない（チャット環境依存） | `grep -o 'var(--[a-z0-9-]*' <原本> \| sort \| uniq -c` |
| Tablerアイコンは5種類・各1箇所: L9 `ti-player-play` / L15 `ti-arrow-left` / L16 `ti-arrow-right` / L19 `ti-bolt` / L20 `ti-arrow-big-up` | `grep -o 'ti ti-[a-z-]*' <原本>` |
| 原本に `http://` `https://` の参照は0件 | `grep -cE 'https?://' <原本>` → 0 |
| python3 は壊れている（xcrun error / Xcode CLT欠損）。使用禁止 | `python3 --version` の出力 |
| node 20.19.5 が volta 管理で動作する | `volta list` |
| git 2.37.2 動作、user.name / user.email 設定済み。原本は初回コミットで履歴保全済み（計画者実施） | `git --version` / `git log` |
| ポート8765は空き | `lsof -i :8765` 無出力 |
| `tools/serve.mjs`（Node製静的サーバ、ポート8765）と `.claude/launch.json` は計画者が用意済み | 本計画の前提条件 |

## 3. 判断記録

| # | 論点 | 選択肢 | 採用 | 理由（却下理由を含む） |
|---|---|---|---|---|
| 1 | 開発サーバ | python3 / npx serve / Node自作 | Node自作 `tools/serve.mjs` | python3はCLT欠損で起動不能。npx serveは初回にネットワーク必須で却下。Nodeはvoltaで動作確認済み・依存ゼロ |
| 2 | アイコン置換 | Tabler CDN読込 / インラインSVG / Unicode文字 | Unicode文字（▶ ← → ⚡ ↑） | CDNは外部依存が復活するため却下。SVGは5箇所のために工数過剰で却下 |
| 3 | CSS変数 | 変数名を実値に書き換え / `:root`で実体定義 | `:root`で6変数を実体定義 | 書き換えはDOM側diffが膨らみ検証しづらいため却下。定義追加なら原本DOMがほぼ無傷で残る |
| 4 | 原本ファイルの扱い | 残す / archive/へ移動 / 削除 | 初回コミットで保全済みのため作業ツリーから削除 | 正が2つある状態は編集事故のもと。gitが履歴を持つのでarchive/は冗長で却下 |
| 5 | JSの扱い | 整形・改善しつつ移植 / 無変更コピー | 無変更コピー（md5一致で機械検証） | 挙動変更ゼロがStep1の原則。整形はStep2（分割・可読化）で行う |
| 6 | ダークモード | 対応 / 非対応 | 非対応（固定ライトテーマ） | Step1のスコープ外。ゲーム画面はCanvas内で自前描画のため影響なし |
| 7 | コミット実施者 | Codex / Claude | Claude（検収後） | 検収前の履歴汚染を避ける。Codexはファイル変更と実行ログ記入まで |

## 4. 制約とスコープ外

- やらないこと（non-goals）: JSロジックの変更・整形・改善、ファイル分割、新機能追加、ダークモード、npm/package.json導入、README作成
- 触らないファイル・領域: `.claude/`、`.git/`、`tools/serve.mjs`、本計画書の「8. 実行ログ」以外のセクション
- 守るべき規約・互換性: `index.html` は外部リソース参照ゼロ（CDN・Webフォント・アイコンフォント・画像URLすべて禁止）。文字コードはUTF-8

## 5. 前提知識の注入

- 原本は claude.ai の Artifact 断片形式で、DOCTYPE / html / head / body タグを持たない。チャット環境が提供していたCSS変数とTablerアイコンフォント（クラス `ti ti-*`）に依存していた。これを取り除くのが本作業である
- macOS の md5 コマンドは `md5 -q <file>` 形式（GNUの `md5sum` ではない）
- `grep -c` はマッチ0件のとき「0」を出力し**終了コード1**を返す。0件が期待値の検証では終了コード1は失敗ではない
- 原本の最終行 `</script>` には末尾改行がない。awk検証は「`<script>` 単独行の次の行」から「`</script>` で始まる行の前」までを抽出する。よって index.html でも `<script>` と `</script>` をそれぞれ単独行にすること
- ボタンの見た目（サイズ・余白）は原本のインラインstyleが担っている。styleブロックで新たに定義するのは「チャット環境が供給していた分」だけである

## 6. ステップ

### S1: index.html を新規作成する
- 変更対象: `index.html`（新規作成）
- 作業内容: 以下の構成で作成する。
  1. 冒頭に次の6行を置く:
     ```html
     <!doctype html>
     <html lang="ja">
     <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>柴犬ラン 5</title>
     ```
  2. 続けて `<style>` ブロック。内容は次のCSSを**そのまま**貼る:
     ```css
     :root{
       --font-sans:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif;
       --border:rgba(20,30,40,0.18);
       --surface-2:#ffffff;
       --text-primary:#1b2430;
       --text-secondary:#46525f;
       --text-muted:#8a929e;
     }
     *{box-sizing:border-box;}
     body{margin:0;padding:16px;background:#eef4f8;font-family:var(--font-sans);}
     button{font-family:inherit;font-weight:500;color:var(--text-primary);background:#ffffff;border:1px solid var(--border);border-radius:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;}
     button:active{background:#dbe6ee;}
     #ovB{background:#2f6fed;border:none;color:#ffffff;}
     #ovB:active{background:#245ac6;}
     ```
  3. `</style>` `</head>` `<body>` を置く
  4. 原本 `shiba_run_platformer_v5_optimized.html` の L1〜L24 を**そのまま**コピーし、次の5点**のみ**置換する:
     - L9: `<i class="ti ti-player-play" aria-hidden="true" style="font-size:16px;vertical-align:-2px;"></i> スタート` → `▶ スタート`
     - L15: `<i class="ti ti-arrow-left" aria-hidden="true"></i>` → `←`
     - L16: `<i class="ti ti-arrow-right" aria-hidden="true"></i>` → `→`
     - L19: `<i class="ti ti-bolt" aria-hidden="true" style="font-size:16px;vertical-align:-2px;"></i> ショット` → `⚡ ショット`
     - L20: `<i class="ti ti-arrow-big-up" aria-hidden="true" style="font-size:16px;vertical-align:-2px;"></i> ジャンプ` → `↑ ジャンプ`
  5. `<script>` を単独行で置き、原本の L26 から最終行の直前（=JS本体全421行）を**1文字も変えず**コピーする
  6. `</script>` `</body>` `</html>` を各単独行で置いて閉じる
- 検証（すべて `/Users/komayuuta/project/games/test` で実行）:
  - `test -f index.html && echo OK` → `OK`
  - `awk '/^<script>$/{f=1;next} /^<\/script>/{f=0} f' index.html | md5 -q` → `f9767f647616c33850665abf19d49456`
  - `grep -c 'ti ti-' index.html` → 出力 `0`（終了コード1で正常）
  - `grep -ci '<!doctype html>' index.html` → `1`
  - `grep -oE '^[[:space:]]*--(font-sans|border|surface-2|text-primary|text-secondary|text-muted):' index.html | wc -l` → `6`
  - `grep -cE 'https?://' index.html` → 出力 `0`（終了コード1で正常）
- 失敗時: md5不一致の場合はJS部を原本から機械的に再コピー（`awk '/^<script>$/{f=1;next} /^<\/script>/{f=0} f' shiba_run_platformer_v5_optimized.html` の出力をそのまま使う）して再検証。2回目も失敗したら停止して実行ログに記録

### S2: 原本ファイルを作業ツリーから削除する
- 変更対象: `shiba_run_platformer_v5_optimized.html`（削除）
- 事前確認: `git cat-file -e HEAD:shiba_run_platformer_v5_optimized.html && echo PRESERVED` → `PRESERVED`（gitに保全済みであることの確認。これが出ない場合は削除せず停止して報告）
- 作業内容: `rm shiba_run_platformer_v5_optimized.html`
- 検証: `test ! -f shiba_run_platformer_v5_optimized.html && echo GONE` → `GONE`
- 失敗時: 停止して報告

### S3: 実行ログを記入する
- 変更対象: `plans/20260811-step1-standalone.plan.md` の「8. 実行ログ」表のみ
- 作業内容: S1・S2の実行結果（日時・検証出力の要約・逸脱の有無）を表に1行ずつ追記する
- 検証: `awk '/## 8/,0' plans/20260811-step1-standalone.plan.md | grep -c '^|'` → `4` 以上（ヘッダ2行＋記入2行）
- 失敗時: 停止して報告

### S4: ブラウザ検収とコミット（実施者: Claude。Codexは実施しない）
- 作業内容: 完了条件の全コマンド再実行、`node tools/serve.mjs` でサーバ起動、ブラウザで表示・操作・コンソール確認、diffレビュー、コミット
- 検証: 完了条件チェックリストが全て埋まること
- 失敗時: 問題箇所を特定し、計画を修正した上でCodexに差し戻す

## 7. プレモーテム

| 失敗経路 | 兆候 | 対策（反映先ステップ） |
|---|---|---|
| CodexがJSを「ついでに」整形・修正してしまい挙動が変わる | S1のmd5検証が不一致 | S1作業内容に「1文字も変えず」を明記。md5で機械検出。失敗時手順に「awk出力をそのまま使う」機械的復旧を用意 |
| アイコン置換時にbutton要素の構造や属性まで書き換えてUIが崩れる | 検収時のdiffでL1〜L24に5箇所以外の差分 | S1で置換は5点のみと限定列挙。S4でClaudeがdiffレビュー |
| `grep -c`の終了コード1をエラーと誤解して実行者が停止する | S1検証の途中で停止報告 | セクション5に「0出力＋終了コード1が正常」と明記 |
| 原本最終行の改行なしを引きずり`</script>`が単独行にならずawk検証が壊れる | md5検証が不一致または空出力 | S1手順6で`</script>`単独行を明示。抽出ルールをセクション5に記載 |
| python3前提のサーバ起動で検収が止まる | `xcrun: error` | 計画段階で判明済み。Nodeサーバ採用（判断記録#1）、`tools/serve.mjs`は計画者が用意 |

## 8. 実行ログ

| 日時 | ステップ | 結果 | 検証出力（要約） | 逸脱・メモ |
|---|---|---|---|---|
