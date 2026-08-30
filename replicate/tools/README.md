# Phase 1 計測ツール（docs/replicate.md 用）

参照サイトを Playwright（同梱 Chromium）で自動計測し、`reference/` に保存する。
**サイト固有のセレクタや推測値はここに書かない。** 挙動計測（ホバー・押下など）は
実 DOM を見てから `probe.mjs`（未作成）として追加する。

## 使い方

```bash
cd replicate
npm ci                                   # playwright 1.56.1（同梱 chromium-1194 と一致）
node tools/capture.mjs                   # 3ページ × 3ビューポート → reference/
node tools/extract-css.mjs               # 保存済み CSS から 1-2 の項目を抽出
```

ローカル検証（対象を差し替えられる）:

```bash
node tools/capture.mjs --base http://localhost:8765 --pages / --out /tmp/smoke
```

## 出力

- `reference/shots/{page}-{vp}-{t0,t300,t1000,full}.png` — 読み込み直後 0/300/1000ms とフル
- `reference/dom/{page}-{vp}.html` — settle 後の outerHTML
- `reference/net/{page}-{vp}.json` — 全リクエストのログ（フォント特定用）
- `reference/css/` + `css-extract.json` — CSS 実体と抽出結果
- `reference/fonts.json` / `capture-summary.json`

## この環境（Claude Code リモート）の既知の問題

2026-08-30 時点の記録。ローカルマシンで実行する場合は関係ない。

1. **参照サイトへの egress がポリシーで拒否される。** `satoshiwatanabe.org:443` への
   CONNECT にゲートウェイが 403 を返す（コンテナ内 curl も WebFetch も同様）。
   環境のネットワーク許可を変更しない限り Phase 1 は実行できない。
2. **Chromium だけ TLS が中継で切られる症状がある。** 許可済みホスト
   （fonts.googleapis.com）で curl / Node / openssl は成功するが、Chromium は
   ClientHello 送信後に 39B の応答とともに切断される（`ERR_CONNECTION_RESET`）。
   切り分け済み: ClientHello サイズ（ポスト量子鍵交換）が原因ではない
   （フル版 + `/etc/chromium/policies/managed/pq.json` で 540B に縮めても再現）。
   ECH 無効化フラグも効果なし。このホストは TLS 再終端されない素通し経路
   （実 Google 証明書が見える）なので、SNI 覗き見実装が Chrome の Hello を
   処理できない可能性が高い。**対象サイトが許可されたら（再終端経路のはず）
   まず Chromium で 1 ページ読めるか確かめること。** ダメなら回避せず
   管理者/Anthropic に報告する（/root/.ccr/README.md の方針）。

### 環境メモ

- Playwright は **1.56.1 に固定**（`/opt/pw-browsers/chromium-1194` と同じビルド。
  上げると「Executable doesn't exist」になる）
- root 実行なので `--no-sandbox` 必須（capture.mjs に組み込み済み）
- localhost 対象のときはプロキシを外す（capture.mjs が自動判定。
  NO_PROXY の CIDR 混じり値を bypass に渡すと Chromium 側で解析が壊れる）
