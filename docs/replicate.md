# 参照サイト デザイン再現プロンプト（Claude Code 用）

## 0. 前提

- 参照サイト: https://satoshiwatanabe.org/ （対象ページ: `/` `/photography/` `/about/`）
- スタック: Next.js (App Router) + TypeScript + CSS Modules（CSS カスタムプロパティで値を集中管理）。※変更する場合はこの行を書き換える
- ゴール: 3ビューポート（1440 / 1024 / 390）で、余白・書体・線・配置・挙動が参照と区別できないレベルの実装
- コンテンツ規則: 写真・動画・文章・作品データ・ワードマークの文字はすべてダミーに置換する。参照の CSS ファイル・フォントファイル・画像を直接コピーせず、実測値から書き起こす
- 進め方: Phase 1 計測 → Phase 2 実装 → Phase 3 照合。Phase 1 が完了するまでコードを書かない。各 Phase の終了時に報告して止まり、指示を待つ

## 1. Phase 1 — 計測（推測禁止・すべて実測）

Playwright（`npx playwright install chromium`）でヘッドレスブラウザを起動し、結果を `./reference/` に保存する。

### 1-1. スクリーンショット

- 3ページ × 3ビューポート（1440×900 / 1024×768 / 390×844、deviceScaleFactor: 2）、fullPage で保存
- 状態別に追加撮影: 読み込み直後 0ms / 300ms / 1000ms（フェードイン等の有無）、作品行ホバー、ナビ項目ホバー、「Contact」押下後、写真サムネ押下後、About の En/Ja 切替後、スクロール中（ヘッダー固定の有無）

### 1-2. DOM とスタイル

- 各ページの `document.documentElement.outerHTML` を保存（クラス名・data 属性・DOM 構造の確認用）
- 読み込まれた全 CSS（`link[rel=stylesheet]` と `<style>`）を保存し、次を抽出する: `:root` のカスタムプロパティ / `@font-face` / `@media` のブレークポイント全件 / `transition` `animation` `@keyframes` / `:hover` ルール / `cursor` / `position: fixed|sticky` / `mix-blend-mode` / `grid-template-columns` / `writing-mode`
- 主要要素の computed style を 3ビューポートそれぞれで取得: 対象 = body、h1 ワードマーク、ナビ各リンク、リスト見出し `N.` `C.` `P.` `Y.`、作品行の各セル、写真サムネ、About の h2・本文・リンク・Copy ボタン・言語切替 項目 = font-family / font-size / font-weight / letter-spacing / line-height / text-transform / color / background-color / padding / margin / border / opacity / `getBoundingClientRect()`

### 1-3. フォント

- ネットワークログから読み込まれたフォントファイル（woff2 等）の URL と書体名を特定し、配信元（Adobe Fonts / Google Fonts / 自己ホスト）を記録する
- 自己ホストの商用フォントはコピーしない。同一書体の正規入手方法を報告し、入手不能な場合は x-height・字幅・ウェイトが最も近い代替書体を候補 3 つで提案する（実装は指示を待つ）

### 1-4. 挙動（すべて「実測結果」として記録）

- ナビ「Film,」「Photo / Photography」の表記が切り替わる条件（ビューポート幅かホバーか）
- 「Contact」押下時の挙動（オーバーレイ / スライドパネル / スクロール）と閉じ方
- トップの作品行: ホバー時に出る画像・動画の位置とサイズ（カーソル追従か固定配置か）、クリック時の挙動（Vimeo 埋め込みモーダルか別ページか）、行の区切り線・ハイライトの有無
- 写真ページ: サムネの並び（横スクロール帯かグリッドか）、ギャップ、ホイール・ドラッグの挙動、拡大表示の遷移（duration / easing）
- About: En / Ja が「切替表示」か「2 列同時表示」か。メール Copy 押下後のフィードバック表示
- 全ページ: ページ遷移アニメーション、スクロール時のヘッダー挙動、カスタムカーソルの有無

### 1-5. 成果物 `reference/design-tokens.json`

```json
{
  "colors": { "bg": "", "fg": "", "muted": "", "hover": "", "overlayBg": "", "divider": "" },
  "type": {
    "family": "", "source": "", "fallback": "",
    "wordmark": { "size": "", "weight": "", "ls": "", "lh": "" },
    "nav":      { "size": "", "weight": "", "ls": "", "lh": "" },
    "listHead": { "size": "", "weight": "", "ls": "", "lh": "", "transform": "" },
    "listRow":  { "size": "", "weight": "", "ls": "", "lh": "", "transform": "" },
    "body":     { "size": "", "weight": "", "ls": "", "lh": "" },
    "h2":       { "size": "", "weight": "", "ls": "", "lh": "" }
  },
  "layout": {
    "breakpoints": [],
    "gutter": { "1440": "", "1024": "", "390": "" },
    "header": { "height": "", "position": "", "layout": "" },
    "list": { "columns": "", "gap": "", "rowHeight": "", "divider": "" },
    "photoStrip": { "thumbHeight": "", "gap": "", "scroll": "" },
    "about": { "maxWidth": "", "sectionGap": "" }
  },
  "motion": { "hover": "", "overlay": "", "pageEnter": "", "easing": "", "duration": "" },
  "behavior": { "contact": "", "navLabel": "", "rowHover": "", "rowClick": "", "lightbox": "", "lang": "", "copy": "" }
}
```

空欄を残さない。実測できなかった項目は `"UNVERIFIED"` と書き、理由を報告する。

## 2. Phase 2 — 実装（`design-tokens.json` の値のみ使用）

### 2-1. 情報設計（実測済み・変更不可）

- 共通ヘッダー: 左にワードマーク（元は "S. W."。イニシャル + ピリオドの形式をダミー "A. B." で再現）、主ナビ「Film,」「Photo」(= Photography)、副ナビ「About」「Contact」
- `/` Film: 列見出し `N.` `C.` `P.` `Y.`（No. / Client / Project / Year）。79 行、番号は 3 桁ゼロ埋め `000`〜`078`、年の降順（2026 → 2020）。ダミーデータは同じ件数・同じ文字数分布（クライアント名 3〜30 字、題名 5〜40 字の英大文字ローマ字、同一クライアントの連続あり）で生成し `data/works.json` に置く
- `/photography/`: 高さ揃えのサムネイル列（画像リクエストは `h=240`、表示高さは Phase 1 の実測値）。ダミー画像は縦位置中心に 2:3 / 3:4 / 1:1 / 3:2 を混ぜて 30 枚（プレースホルダー画像または単色矩形）。拡大表示 + 「Close」
- `/about/`: 先頭に連絡先ブロック（案内文 3 行 / Manager / Tel: `tel:` リンク / Mail + `( Copy )` クリップボードコピー / Management Office リンク）→ 名前 h2 → 略歴 1 段落 → Social（Instagram リンク）→ Award（ダッシュ付きリスト 3 件）→ Clients（カンマ区切り 1 段落）。EN / JA の 2 言語ブロックと `En` `Ja` 切替（ページ上下 2 箇所）。文章は同程度の文字量のダミー
- 共通オーバーレイ: Contact パネル / ライトボックス / 動画プレーヤー。Phase 1 の実測結果（1-4）に従う

### 2-2. 実装ルール

- 色・書体・寸法・ブレークポイント・duration / easing はすべて `design-tokens.json` から CSS カスタムプロパティに流し込む。マジックナンバー禁止
- HTML は参照と同じ意味構造（h1 ワードマーク、`<nav>`、`<ol>` の作品リスト、`<h2>` セクション）
- データ層は JSON 直読みだが、後で CMS（Sanity 等）に差し替えられるよう `lib/content.ts` に集約する
- アクセシビリティ: Contact / ライトボックス / 動画は Esc で閉じる・フォーカストラップ・`aria-modal`。`prefers-reduced-motion` で動きを無効化
- 依存を増やさない（アニメーションライブラリ不可。CSS transition と最小限の JS）

## 3. Phase 3 — 照合

- 3ページ × 3ビューポートで自作サイトを同条件で撮影し、`reference/` と左右に並べた比較画像を `compare/` に出力する
- `pixelmatch` で差分率を算出。コンテンツ差（文章・画像）の領域を除外した「余白・書体・線・配置」の差分が 2% 未満で合格
- 1-4 の挙動チェックリストを一つずつ実機で再現確認し、結果を表で報告する
- 未達項目は「原因 → 修正 → 再計測」を最大 3 回繰り返し、それでも未達なら理由を添えて止まる

## 4. 報告フォーマット

各 Phase 終了時に次を箇条書きで報告する:

1. 完了項目
2. `UNVERIFIED` の項目と理由
3. 判断を仰ぐ点（フォント代替、推定挙動の解釈など）

質問は Phase 境界でまとめて行い、途中で作業を止めない。
