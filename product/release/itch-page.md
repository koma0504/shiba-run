# itch.io 公開用の原稿と手順

`plans/20260813-ship-shibarun.plan.md` 第2段階の材料。**そのままコピペして使える形**にしてある。

zip は `node tools/pack.mjs` で作る（`shiba-run-itch.zip`、約40KB、29ファイル）。
展開したものを単体で配信して動くことは確認済み（JS例外なし、404なし）。

---

## 掲載情報

### タイトル

```
柴犬ラン / Shiba Run
```

### 短い説明（tagline）

```
柴犬を操って骨を集め、ボスネコ「ニャン大将」を倒して犬小屋へ帰る。ブラウザで遊べる横スクロールアクション。
```

英語版:

```
A shiba inu runs, jumps and shoots his way home. A small side-scrolling action game you can play in your browser.
```

### 説明本文

```
柴犬を操作して骨を集め、ボスネコ「ニャン大将」を倒し、犬小屋を目指す横スクロールアクションです。
全2面。1回のプレイは5分ほど。

■ 操作
　移動　　　← → または A / D、画面下のボタン
　ジャンプ　スペース（空中でもう一度押すと2段ジャンプ）
　ショット　Z / X（長押しでチャージショット）
　ポーズ　　Esc / P

　スマートフォンのタッチ操作にも対応しています。

■ 遊び方
・骨は50点。20本集めるごとに残機が1つ増えます
・肉を取ると一定時間無敵になり、HPが全回復します
・着地せずに敵を連続で踏むと、得点が倍々に増えます
・中間地点に着くとHPが回復し、力尽きてもそこから再開できます
・クリア状況と自己ベストは自動で保存されます

■ つくり
外部ライブラリもビルドツールも使わず、素のJavaScriptとHTML Canvasだけで書いています。
効果音も音声ファイルではなく Web Audio で合成しています。全部で40KBほどです。
```

### 設定項目

| 項目 | 値 | 補足 |
|---|---|---|
| Kind of project | **HTML** | zip の直下に `index.html` がある必要がある。`tools/pack.mjs` がそれを検査している |
| 価格 | **無料**（No payments） | D3・D12 のとおり、初回作の目的は収益ではない |
| Viewport | **640 × 480** | canvas の実寸 |
| Mobile friendly | **オン** | タッチ対応済み。実機幅390pxで確認済み |
| Fullscreen button | **オン** | 4:3 なので全画面のほうが遊びやすい |
| Genre | Platformer | |
| Tags | `2d`, `action`, `arcade`, `browser`, `dog`, `html5`, `pixel-free`, `side-scroller`, `singleplayer` | itch.io のタグは既存のものから選ぶ形式。無いものは飛ばす |
| Release status | Released | |
| 対応言語 | 日本語（UIは日本語のみ） | |

### スクリーンショット

`product/release/shots/` に5枚（すべて実画面、2倍解像度）。

| ファイル | 内容 |
|---|---|
| `01-title.png` | タイトルと面セレクト |
| `02-run.png` | 平地を走る。最初の敵 |
| `03-jump.png` | 段差と肉 |
| `04-turret.png` | 砲台ネコとバネ |
| `05-boss.png` | ボス「ニャン大将」と犬小屋 |

**カバー画像（630×500）はまだ無い。** itch.io は一覧に出すためにカバー画像を求める。
`05-boss.png` を切り抜いて充てるのが最短。

---

## 公開の手順

1. [ ] itch.io のアカウントを作る（無料）
2. [ ] `node tools/pack.mjs` で zip を作る
3. [ ] ダッシュボードから Create new project
4. [ ] 上の「掲載情報」を順に埋める。Kind of project を **HTML** にするのを忘れないこと
5. [ ] zip をアップロードし、「This file will be played in the browser」にチェック
6. [ ] Viewport を 640×480、Mobile friendly と Fullscreen button をオンにする
7. [ ] スクリーンショット5枚とカバー画像をアップロード
8. [ ] **Draft のまま自分で遊んでみる。** アップロードしたものが動くかは、上げてみるまで分からない
9. [ ] PCとスマホの両方で1回ずつ通す
10. [ ] Public にする
11. [ ] 公開URLと日付を `product/README.md` の現在地に書く ← **ここまでやって「完走」**

---

## 未確認（自分の目で確認すること）

- itch.io の画面の文言と項目名は変わることがある。上の表は**項目の意図**を書いたもので、
  画面と一字一句同じとは限らない
- 収益を受け取らないので税務情報の登録は不要のはずだが、画面の指示に従うこと
- `product/research/01-platforms.md` の itch.io の記述は検索エンジン経由の情報で、
  一次ページに到達できていない
