# 配信先の調査 — 小規模HTML5アクションゲームをどこに出すか

調査日: 2026年8月13日 / 対象時期: 2025〜2026年の公開情報
対象プロダクト: 素のJavaScript + HTML5 Canvas、外部ライブラリなし、横スクロールアクション、極小規模、開発者は個人・初の商業タイトル

---

## この文書の結論

1. **本命はHTML5ゲームポータル（Poki / CrazyGames）**。すでにブラウザで動くものをそのまま活かせ、参入コストがほぼゼロで、市場が伸びている唯一の領域である。ただし審査は人力キュレーションで、通る保証はない。
2. **Steamは初回タイトルに向かない**。2025年のSteamリリース作品の中央値売上は249ドル（[Gamalytic調べ](https://game-developers.org/steam-paradox-2025-revenue-volume)）で、4割超が登録料100ドルを回収できていない（[GameBusiness.jp](https://www.gamebusiness.jp/article/2025/10/22/25314.html)）。加えて2時間返金ルールが短編ゲームを直撃する。
3. **itch.io はコストゼロなので「置いておく」価値はあるが、収益は期待しない**。ブラウザで遊べることがitch.io上では明確に有利に働く。
4. **モバイルストアは今回は見送りが妥当**。Apple 99ドル/年 + ガイドライン4.2（WebViewラッパー拒否）、Google Playの12テスター×14日という個人向けの追加関門があり、極小プロダクトには割に合わない。
5. **推奨する順番: ①CrazyGames → ②Poki → ③itch.io + 自前Web公開**。まずポータルで「そもそも遊ばれるか」を数万〜数十万プレイ規模で検証し、その手応えがあってからSteamを考える。

> **出典についての注意**: 調査環境のネットワーク制限により、`partner.steamgames.com` / `sdk.poki.com` / `docs.crazygames.com` / `itch.io` / `note.com` などの一次ページに直接アクセスできなかった。これらの数値は検索エンジン経由で取得した当該ページの要約に基づく。**実際に着手する前に、各公式ドキュメントを自分の目で開いて確認すること。**（Apple Developer Program の年会費のみ一次ページを直接確認済み）

---

## 比較表

| 配信先 | 金銭的参入コスト | 必要な追加開発 | 収益モデル | 向いているもの | 個人・初回タイトルへの適性 |
|---|---|---|---|---|---|
| **CrazyGames** | 0円 | SDK組み込み（広告フック・ローディング通知）、初期DL 50MB以内・1500ファイル以内、16:9レスポンシブ、モバイル対応が望ましい | 広告レベニューシェア（公式非公表。ジャム規約では広告60% / 課金70%）、€100からTipalti払い | 短時間で繰り返し遊べるカジュアル、アクション | ◎ 最有力。審査フィードバックが1〜2日と速く、Basic Launchなら軽い統合で出せる |
| **Poki** | 0円 | SDK組み込み（`gameplayStart`/`gameplayStop`/`commercialBreak`/ローディング終了通知）、Poki規約準拠 | Poki経由の流入は50/50レベニューシェア | 磨き込まれたカジュアル・アクション | ○ 上限は最も高い（トップ層は年€1M）が完全ハンドピックで選抜が厳しい |
| **itch.io** | 0円 | ほぼ不要。HTML5一式をzipで上げるだけ | 販売手数料はクリエイターが決める（既定10%、0%も可）。投げ銭型 | 実験的作品、ジャム作品、デモ配布 | ○ コストゼロなので出さない理由がない。ただし収益はほぼ期待できない |
| **Newgrounds** | 0円 | ほぼ不要 | 広告レベシェア（$50から支払い） | レトロ・アクション、Flash文化圏 | △ 収益は小さいがコミュニティ露出として無料 |
| **GameJolt** | 0円 | ほぼ不要 | 販売50%クリエイター取り分、ステッカー等 | ホラー・ファンゲーム・インディー | △ 上記と同様、露出目的 |
| **Y8 / GameDistribution / GameMonetize** | 0円 | SDK組み込み | 広告レベシェア（Y8は広告総収入の最低50%と表明） | 汎用カジュアル、広く薄く | △ 単価は低いが本数が捌ける。Poki/CrazyGamesの後の横展開先 |
| **自前Web + 広告** | 年数千円（ドメイン）。Cloudflare Pagesなら帯域無料 | 広告タグ、アナリティクス、集客の仕組み全部 | AdSense等（日本のPV単価0.25〜0.75円という報告） | ポートフォリオ、実験 | △ 収益化としては最も非効率。ただし「自分の資産」になる |
| **Steam** | $100/作品（AGR $1,000到達で返還） | ストアページ一式（スクショ5枚以上1920x1080、カプセル画像規定サイズ）、Electron等でのデスクトップ化、実績・クラウドセーブ・コントローラー対応、本人確認＋銀行口座＋30日待機 | 買い切り販売、Valve 30% | 数時間以上遊べる有料作品 | ✕〜△ 初回・極小規模には強く非推奨。2時間返金ルールが致命的 |
| **Epic Games Store** | $100/作品 | 上記に加えEGS実績必須、マルチならクロスプレイ必須、年齢レーティング | 買い切り、開発者88% | Steamと並行展開する中〜大規模 | ✕ Steamを出した後の話 |
| **GOG** | 0円（審査制） | Steam同等＋DRMフリー | 買い切り | 品質基準を満たす作品 | ✕ キュレーションが厳しく個人の初回は現実的でない |
| **App Store** | $99/年 | ネイティブ化（Capacitor等）＋「ブラウザでできないこと」の実装、ストア素材 | 買い切り/広告/課金、Apple 15〜30% | ネイティブ体験を持つモバイルゲーム | ✕ ガイドライン4.2でWebViewラッパーは拒否されやすい |
| **Google Play** | $25（1回） | ネイティブ化＋広告SDK＋**12テスター×14日の非公開テスト** | 広告/課金、Google 15〜30% | 同上 | ✕ 個人アカウントの追加関門が重い |
| **日本国内投稿サイト（unityroom / PLiCy / ふりーむ）** | 0円 | ほぼ不要 | 基本的に収益化なし（露出・フィードバック目的） | 日本語圏でのテストプレイ獲得 | ○ 「売上」ではなく「反応を得る場」として有効 |
| **BOOTH / DLsite** | 0円（手数料のみ） | ダウンロード販売用のパッケージ化 | BOOTH: 価格×5.6%+45円 / DLsite: 高率 | 日本語圏向け買い切り | △ ブラウザゲームより「落として遊ぶ」形式向き |

---

# 事実編

## 1. Steam

### 費用と手続き
- Steam Direct の手数料は**1作品あたり$100**。返金はされないが、その作品の調整後総収益（AGR）が$1,000に達すると回収（recoup）される（[Steamworks公式](https://partner.steamgames.com/doc/gettingstarted/appfee)、[Ziva](https://ziva.sh/blogs/publish-game-steam)）。
- 初回のパブリッシャーは**本人確認・銀行口座の登録・30日の待機期間**を経てから最初のタイトルをリリースできる（[Ziva](https://ziva.sh/blogs/publish-game-steam)）。
- ストアページの審査は**7営業日以上見込む**必要があり、リジェクトされるたびに**3〜5営業日**の追加を要する（[Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-page-asset-requirements)、[Steamworks](https://partner.steamgames.com/doc/store/review_process)）。
- 必須素材: スクリーンショット**最低5枚**（推奨8〜10枚、最低1920x1080、16:9推奨、ゲームプレイ画面のみでコンセプトアートや宣伝文句入り画像は不可）、ヘッダーカプセル**920x430px**、スモールカプセル**462x174px**（サイズ厳格）。カプセルは120x45pxでも読める必要がある（[Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-page-asset-requirements)、[presskit.gg](https://presskit.gg/field-guides/steam-capsule-art-guide)）。
  - 実務者の記録として「Steam審査に何度も落ちたので必要画像14種のチェックリストを作った」という報告がある（[UhiyamaLab](https://uhiyama-lab.com/en/blog/gamedev/steam-release-images-checklist/)）。

### 市場の混雑度（2025年）
- 2025年のSteamリリース本数は**19,000本超**で過去最多。集計元により差があり、GameDiscoverCo 20,558 / Gamalytic 20,353 / VGInsights 20,282 / SteamDB 20,008（[How To Market A Game](https://howtomarketagame.com/2026/01/08/how-many-games-were-released-in-2025/)）。参考: 2023年 14,109本、2024年 18,559本（同）。
- そのうち**ほぼ半数がレビュー10件未満**。約2,200本がレビュー0件、さらに約7,100本が9件以下で頭打ち（[80.lv](https://80.lv/articles/steam-earned-usd16b-in-2025-but-nearly-half-of-19-000-games-got-under-10-reviews)、[TechSpot](https://www.techspot.com/news/110592-nearly-half-19000-games-released-steam-year-went.html)）。

### 収益の実態（2025年）
- **2025年リリース作品の売上中央値は $249**。Valveの30%を引いた開発者の手取りは約$174（Gamalytic調べ、[game-developers.org](https://game-developers.org/steam-paradox-2025-revenue-volume)）。
- 2025年にリリースされた12,732本のうち**4割超が$100の登録料すら回収できていない**（Gamalytic調べ、[Outlook Respawn](https://respawn.outlookindia.com/gaming/gaming-news/thousands-of-steam-games-fail-to-recoup-100-submission-fee)）。日本語報道も同趣旨で「2025年リリースは1万3,000本以上、8%が総売上10万ドル以上、40%が100ドルを回収できず」と伝えている（[GameBusiness.jp](https://www.gamebusiness.jp/article/2025/10/22/25314.html)）。
- 一方で総額は最高値を更新しており、インディーは2025年にSteam全体$17.7Bのうち**$4.4B（25%）**を稼いだ（[Notebookcheck](https://www.notebookcheck.net/Indie-games-accounted-for-25-of-Steam-s-revenue-in-2025.1189429.0.html)）。ただし**年間$100K超を達成したのは5,863本**にとどまる（[game-developers.org](https://game-developers.org/steam-paradox-2025-revenue-volume)）。
- 2024年時点で、いわゆる「Triple-I」（AAA級の予算・人員を持つインディー）が**インディー収益全体の53%**を占めていた（[Video Game Insights経由](https://gamedevreports.substack.com/p/video-game-insights-indie-games-on)）。

### ウィッシュリスト
- 2025年の目安として「注目されるには**7,000〜10,000件**が基準」「Next Festで意味のある押し上げを得るには最低2,000件必要」という開発者報告がある（[B3 Daily](https://b3daily.com/2025/10/25/how-indie-game-wishlists-on-steam-predict-success-trends-from-2024-2025)）。
- 発売前に10万件に到達する新作は**わずか6%**、**66%は1万件未満で発売**している（[Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-popular-upcoming-list)）。
- Valveは2025年に「Popular Upcoming」枠の基準を引き上げ、小規模作品の露出経路の1つが実質的に狭まったと報じられている（[PC Guide](https://www.pcguide.com/news/steams-new-100000-wishlist-rule-means-many-indie-devs-will-have-to-rely-on-a-different-feature-to-be-discovered/)）。

### レビュー数から売上を推定する係数
- 2025年の新作はレビュー1件あたり**20〜60本**の範囲に収まる（GameDiscoverCo / Simon Carless）。「NB number」（New Boxleiter）の2025年平均は約63（[Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-sales-calculator)、[Otakukart](https://otakukart.com/steams-review-multiplier-still-shapes-game-revenue-metrics-in-2025/)）。
- 日本の個人開発者コミュニティでは「レビュー数×50前後」が目安として流通している（[みやこ出版 note](https://note.com/akutaba/n/na40466f9386e)、[Ad-Virtua note](https://note.com/ad_virtua/n/ndecf8ce74a26)）。

### 短編ゲームにとっての固有リスク: 2時間返金
- Steamは購入後14日以内かつプレイ時間2時間未満なら無条件で全額返金する。
- 実例: インディー開発者Zoroartsの『Paddle Paddle Paddle』は初年度27万本売れたが、**2時間以内にクリアできるため55,000本（約21%）が返金された**。「Very Positive」評価を保ったまま、レビュー欄で「返金しました」と書かれる状況が発生した（[Kotaku](https://kotaku.com/steam-indie-short-pc-refund-paddle-paddle-paddle-zoroarts-2000712822)、[TweakTown](https://www.tweaktown.com/news/112505/indie-developer-asks-valve-to-change-its-2-hour-refund-policy-as-55-000-players-refunded-his-game-after-finishing-it/index.html)、[XDA](https://www.xda-developers.com/steams-two-hour-refund-window-killing-niche-indie-games/)）。Valveは方針変更を発表していない。

### HTML5ゲームをSteamに出す方法
- Steam向けにはデスクトップアプリ化が必要。**ElectronとNW.jsが、Steam配信を助ける主要ライブラリが公式にサポートする唯一のデスクトップフレームワーク**（[Web Game Dev](https://www.webgamedev.com/publishing/desktop)）。
- Steamworks API との接続は **Greenworks**（Greenheart Games製、`Game Dev Tycoon` で使われた）または **steamworks.js** を使う（[greenworks](https://github.com/greenheartgames/greenworks)、[steamworks.js](https://github.com/ceifa/steamworks.js/)）。
- Electronは Chromium と Node.js を同梱するため**ビルドが100MB超**になる。実績はあるが最も重い（[Web Game Dev](https://www.webgamedev.com/publishing/desktop)）。
- 2025年3月にPhaser公式が Electron 経由でWebゲームをSteamに出す手順の記事を出している（[Phaser](https://phaser.io/news/2025/03/publishing-web-games-on-steam-with-electron)）。

### Steam Deck / プラットフォーム機能
- Verifiedバッジには**コントローラー対応が必須**で、既定のコントローラー設定で全コンテンツにアクセスできる必要がある。実績・クラウドセーブは強く推奨されるが、Verified自体の必須条件ではないとされる（[Steamworks](https://partner.steamgames.com/doc/steamdeck/compat)、[Bugnet](https://bugnet.io/blog/steam-launch-qa-checklist)）。

---

## 2. Epic Games Store / GOG

### Epic Games Store
- **セルフサービス公開ツール**により、全ての開発者・パブリッシャーに開放されている（[Unreal Engine公式](https://www.unrealengine.com/en-US/blog/self-service-publishing-now-available-for-the-epic-games-store)）。
- **ストアページ1本あたり$100の手数料**（[Logrus IT](https://games.logrusit.com/en/news/beyond-steam/)）。
- 収益分配は**開発者88% / Epic 12%**。自前または第三者決済を使えばアプリ内課金は最大100%（[Unreal Engine公式](https://www.unrealengine.com/en-US/blog/self-service-publishing-now-available-for-the-epic-games-store)）。
- 必須要件: **Epic Games Store実績の実装**、地域配信のための年齢レーティング、マルチプレイヤーの場合はPCクロスプレイ（同）。
- 月間アクティブPCユーザーは6,800万人超（同）。

### GOG
- 「最終段階に達した、あるいは他所ですでにリリース済みのゲームの提出」を推奨。**品質基準を満たさない場合は掲載を見送る権利を留保**している（[GOGサポート](https://support.gog.com/hc/en-us/articles/11382878039197-Releasing-your-game-on-GOG-FAQ)）。
- 提出の却下率に関する公開データは見つからなかった。

---

## 3. itch.io

- 手数料は**既定10%で、クリエイターが自由に変更できる（0%も可）**。Steam（30%固定）やEpic（12%固定）と異なる（[Dinogame GG](https://dinogame.gg/blog/how-to-publish-game-on-itch-io/)、[Generalist Programmer](https://generalistprogrammer.com/tutorials/how-to-make-money-on-itchio-indie-game-guide)）。
- HTML5一式をアップロードするだけでブラウザ実行に対応する（iframeでホストされる）（[Dinogame GG](https://dinogame.gg/blog/how-to-publish-game-on-itch-io/)）。**今回のプロダクトは改修ゼロで出せる。**
- 露出のデータ: 169人の開発者から集めたベンチマークによると、**上位30%（70パーセンタイル）の作品で約13,000ビュー**。ブラウザで遊べる場合は**閲覧者の37%がプレイする**が、ダウンロード専用だと**6%にとどまる**（[How To Market A Game](https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/)）。
- プラットフォームには**90万件超のプロジェクト**があり、大半はほとんど収益を生まない。二次情報では「大半の作品は生涯で$100未満」とされる（[Generalist Programmer](https://generalistprogrammer.com/tutorials/how-to-make-money-on-itchio-indie-game-guide)。※SEO系メディアであり信頼度は低い。一次データではない）。
- 実額を公開している開発者の一次報告として Nathalie Lawhead の記事がある（[The Candybox Blog](https://www.nathalielawhead.com/candybox/my-gross-revenue-on-itch-io-transparently-sharing-all-my-stats-earnings-and-speaking-on-how-supportive-of-a-base-itch-io-has)。※本調査ではアクセスできず未読）。

---

## 4. HTML5ゲームポータル

### 4-1. Poki

**規模（2025年）**
- 2025年6月に**月間10億プレイ**を突破。月間プレイヤー1億人（[TechFundingNews](https://techfundingnews.com/browser-gaming-website-poki-won-big-at-the-dutch-game-awards-celebrating-hitting-1-billion-monthly-plays/)、[PocketGamer.biz](https://www.pocketgamer.biz/inside-pokis-vision-for-the-future-of-browser-gaming/)）。
- 2025年通年ではデスクトップ・モバイル合計で**6億2,500万人のプレイヤー**（[AccessNewswire](https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/poki-announces-milestone-of-625-million-players-without-raising-e-1148808)）。
- **600以上のスタジオ**が参加。トップスタジオの収益は5年前の$50,000から**最大年$1M（€1M）へと10倍**に伸びた（[Dealroom](https://app.dealroom.co/news/feed/poki-hits-1b-monthly-plays-as-developer-first-model-boosts-top-studio-revenues-tenfold-1)）。

**条件**
- **Poki.com経由またはPokiのマーケティング経由の流入については、収益を50/50で分配する**（[Poki SDK ドキュメント](https://sdk.poki.com/)）。
- **全ゲームがハンドピック**。Pokiのチームが1本ずつ確認し、Pokiに合うかを判断する（同）。掲載されればホームページのスポットライト枠が保証される。
- 採択率の公開データは見つからなかった。

**必要な追加開発（SDK要件）**
- `gameplayStart()` は**ロード時ではなくプレイヤーの最初の入力時**に発火させる。
- `gameplayStop()` は**あらゆるゲームプレイの中断時**（ポーズ、メニュー、レベル終了、カットシーン）に発火させる。
- `commercialBreak()` は**ポーズから復帰してゲームプレイに戻る時のみ**発火させる。推奨として、ユーザーが続行の意思を示したタイミングで毎回 `gameplayStart()` の直前に置く。
- 全ファイルのロードが終わってメインメニュー／最初のプレイ画面を出せる状態になったら Loading End を呼ぶ。
（[Poki Requirements](https://sdk.poki.com/new-requirements)、[HTML5向けガイド](https://sdk.poki.com/html5)）

> このプロダクトはすでにポーズ機能とステージ開始／終了の明確な区切りを持っているため、これらのフックは既存の `ui.js` / `input.js` の分岐にほぼそのまま挿せる構造にある。

**開発者の実例**
- Artem Lanin（PlayRea）は Poki 上の5本で **2025年に累計6,700万プレイ**、年末時点で**1日約20万プレイ**に到達し、ゲーム開発を主たる収入にできたと報告している（[Medium](https://medium.com/@playrea/from-hobby-to-67-million-gameplays-on-poki-in-2025-df2c147cfb27)）。※具体的な金額は非公開。
- js13kGames とのコラボでは、選出作品に対して通常のレベニューシェアに加えて**$500の最低保証**を提示した実績がある（[js13kGames / Medium](https://medium.com/js13kgames/reach-the-world-on-web-build-your-brand-and-earn-revenue-with-poki-a9bac9044a28)）。

### 4-2. CrazyGames

**規模**
- 月間アクティブユーザー**3,000万人**、月間3億プレイ（[Cinevva](https://app.cinevva.com/guides/publish-game-crazygames)）。別の記述では3,500万MAU（[Shapes](https://shapes.inc/fandom/crazygames/developer-portal)）。月間訪問数は6,110万で、5年前比673%増（[MCV/DEVELOP](https://mcvuk.com/business-news/why-browser-games-are-the-next-billion-dollar-bet/)）。

**技術要件（Basic Launch）**
- **初期ダウンロードサイズは50MB以内**、**総ファイル数は1,500以内**（サーバリクエスト過多を防ぐため）。
- モバイル版ホームページ掲載の資格を得るには、**最初にプレイできるまでのダウンロードが20MB以内**。
- 新規ユーザーを**即座にゲームプレイに入れる**こと。難しい場合でもクリックは最大1回まで。
- テキストと画像が `devicePixelRatio:1` のデバイス、**16:9のレスポンシブiframe**、（対応するなら）モバイル画面で読めること。
（[CrazyGames Technical Requirements](https://docs.crazygames.com/requirements/technical/)、[Gameplay Requirements](https://docs.crazygames.com/requirements/gameplay/)）

> このプロダクトは外部ライブラリなしのCanvasゲームで、アセットも手続き的生成（Web Audioで効果音を合成、音声ファイルなし）のため、**50MB / 1,500ファイル制限は余裕でクリアする**。すでにタッチ操作と画面下ボタンにも対応済み。

**審査とローンチ段階**
- QAチームが審査し、**フィードバックは通常1〜2営業日**で返る。
- **Basic Launch は軽い統合でも公開できる**。Full Launch に選ばれた作品はより広い要件を満たし、SDKを使う必要がある（[Cinevva](https://app.cinevva.com/guides/publish-game-crazygames)、[CrazyGames Docs](https://docs.crazygames.com/requirements/intro/)）。
- SDKは広告管理、ユーザー認証、クラウドセーブのフックを提供する。

**収益条件**
- **CrazyGamesは主要な開発者向けドキュメントでレベニューシェアの割合を公表していない。** 最も近い公式データは2026年のGameMaker web jam規約で、そこでは**開発者が広告収益の60%、課金収益の70%を得る**と記載されている（[Cinevva](https://app.cinevva.com/guides/publish-game-crazygames)）。
- 支払いは**Tipalti経由で月次**、**€100の最低支払額**を超えた分を翌月10日を目標に支払う（同、[Tipalti事例](https://tipalti.com/resources/customer-stories/crazygames/)）。
- 収益は米英豪などの英語圏Tier1市場で高くなる（広告需要がそこに集中しているため）。

### 4-3. Y8 / GameDistribution / GameMonetize

- **Y8**: ゲーム内広告の**総収入の最低50%**を開発者に配分すると表明（[Y8 Revenue Share](https://www.y8.com/revshare)）。
- **GameDistribution（Azerion）**: 単一のSDK統合で**4,000以上のポータル、月間3.5億ユーザー**に配信する。1プレイあたりの収益は主要ポータルより低いが、リーチが広い（[Cinevva](https://app.cinevva.com/guides/web-game-monetization)）。
- **GameMonetize**: 開発者に**90%のレベニューシェア**を提示（サイト運営側の取り分は45%）。分配後の収入は**広告1,000表示あたり$1.5〜$3**。支払いはNET30、PayPal/USDT ERC20で25日以内、**最低支払額$30**、届かなければ翌月に繰り越し（[GameMonetize FAQ](https://gamemonetize.com/faq)、[GameMonetize Developers](https://gamemonetize.com/developers)）。※いずれも運営側の自己申告であり、第三者検証データではない。
- HTML5ポータル全般のCPMは**地域と広告種別により$1〜$5**が典型。リワード動画は最も単価が高く、米国で**eCPM $15〜$28**、EU $8〜$15、インド・ブラジル等のTier3で$1〜$3（分配前の総額）（[Cinevva](https://app.cinevva.com/guides/web-game-monetization)）。

### 4-4. Newgrounds / GameJolt

- **Newgrounds**: 広告レベニューシェアの支払いは**$50到達後**、PayPalまたは小切手で行われる。コンテンツが安定して表示されている場合、**1,000ビューあたり約$0.30**が目安とされる。2026年4月にSupporter会員を月$5に値上げし、そちらを収益源として強化する方向（[Wikigrounds: Revenue Sharing](https://newgrounds.fandom.com/wiki/Revenue_Sharing)、[Cinevva](https://app.cinevva.com/guides/web-game-monetization)）。
- **GameJolt**: クリエイターは販売の**最大50%**を得る（クリエイター50% / GameJolt 20% / モバイルストア30%）。加えてクエスト達成で得たステッカーを介した広告収益の分配システムがある（[Business Wire](https://www.businesswire.com/news/home/20221206005017/en/Game-Jolt-Announces-Unique-Way-for-Creators-to-Monetize)）。※2022年の発表であり**やや古い情報**。

---

## 5. モバイル（App Store / Google Play）

### 費用
- **Apple Developer Program: 年$99**（一次情報として[Apple公式](https://developer.apple.com/support/compare-memberships/)で確認済み）。アプリ配信には加入が必須。非営利・教育機関・政府機関は免除の対象になりうる。
- **Google Play: 登録料$25の1回払い**。月額・年額・アプリごとの課金はない（[SplitMetrics](https://splitmetrics.com/blog/google-play-apple-app-store-fees/)）。
- 両ストアとも**デジタル販売がなければ手数料は発生しない**（無料広告アプリなら手数料ゼロ）。売上には15〜30%（同）。

### 個人開発者にとっての追加関門
- **Google Play**: **2023年11月13日以降に作成された個人開発者アカウント**は、本番公開の申請前に**最低12人のテスターが14日間連続でオプトインした非公開テスト**を実施する必要がある。当初は20人だったが、個人開発者の困難を受けて2024年12月に12人へ緩和された（[Play Console ヘルプ](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)、[Google Play Developer Community](https://support.google.com/googleplay/android-developer/community-guide/255621488/everything-about-the-12-testers-requirement?hl=en)）。組織アカウントおよびそれ以前に作成されたアカウントは対象外。
- **App Store**: **ガイドライン4.2「Minimum Functionality」はWebViewベースのアプリにとって最大のリジェクト理由**。フルスクリーンのWebViewで外部のHTML/CSS/JSを読み込むだけのアプリは、「Safariで表示した場合と十分に異なる体験を提供していない」として拒否される。通すには**ブラウザではできないこと**（ネイティブなナビゲーション、プッシュ通知、オフライン対応、生体認証など）が必要（[MobiLoud](https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper)、[Apple Developer Forums](https://developer.apple.com/forums/thread/806726)）。

### 技術
- HTML5ゲームのネイティブ化には Capacitor / Cordova が使われ、AdMob連携プラグインが複数存在する（[AdMob Plus](https://github.com/admob-plus/admob-plus)、[Cap-go/capacitor-admob](https://github.com/Cap-go/capacitor-admob)）。

---

## 6. 自前Web配信 + 広告

- **Cloudflare Pages の無料プラン**: 帯域幅は無制限。ビルドは**月500回**（ビルド時間は月180分という記述もあり）。**1サイトあたり20,000ファイル**まで。無料プランではカスタムドメインは1アカウント1つ、カスタムSSL証明書も1つまで（[FreeTiers](https://www.freetiers.com/directory/cloudflare-pages)、[Rubab's Digital](https://rubabsdigital.com/blog/cloudflare-pages-free-tier-limits)）。静的HTML5ゲームの配信には十分。
- **日本のAdSense単価**: PV単価はサイトによって差が大きく、**高いもので0.75円、安いもので0.25円**という調査（[アドセンスクエスト](https://life-money-create.com/adosensu/)）。
- **個人開発サービスの実例**: 月間6〜8万PVのWebサービスで**月2万円前後が上限**、うち3割以上がリワード広告（オファーウォール）だったという20か月分の実績公開（[Qiita](https://qiita.com/pikachu0203/items/8241585e0b3114891615)）。
- **参考（規模が違う例）**: 同時接続600人規模の常時稼働型ブラウザゲームでは年間1,800万円以上の運営コスト（通信費約974万円、広告宣伝費約868万円）がかかったという公開記録（[note](https://note.com/tiktan/n/n43ab3be6949f)）。※これはサーバ常駐型の多人数ゲームであり、静的配信の本プロダクトとは前提が異なる。

---

## 7. 日本市場

### 投稿サイト（露出目的、基本的に非収益）
- **unityroom**: 約2万作品超。投稿もプレイも無料、**審査なし**。`unity1week`（1週間ゲームジャム）が定期開催され、個人開発者の集まる場になっている（[かかし note](https://note.com/kakasi4423/n/n75ec8e897da7)、[unityroom解説](https://indie-game.hatenablog.com/entry/2025/08/04/075021)）。
- **PLiCy**: 約5万作品超。投稿・プレイ無料（プレミアムプランあり）、**審査あり（数日〜1週間）**。PLiCyゲームコンテストを開催（[かかし note](https://note.com/kakasi4423/n/n75ec8e897da7)）。
- **ふりーむ**: RPG投稿数が多くRPGファンが集まる。定期コンテストが特徴（同）。
- **ゲームアツマール（ドワンゴ / niconico）は2023年6月28日にサービス終了**。理由として**「ブラウザゲーム市場の縮小」**が挙げられた（[ゲームメーカーズ](https://gamemakers.jp/article/2022_12_20_27416/)、[AUTOMATON](https://automaton-media.com/articles/newsjp/20221220-231370/)）。約7年の運営だった。

### 販売プラットフォーム
- **BOOTH**: ダウンロード商品の手数料は**価格×5.6% + 45円**（2025年10月28日の改定で固定手数料が22円→45円に）。初期費用・月額なし。pixiv連携で月間2,200万人規模の利用者にリーチ（[クリナビ](https://crenavi.com/platform/booth)）。
- **DLsite**: サイトに毎日300万人が訪問すると紹介されている。手数料は価格帯により異なり、1,000円以下だと約55%という記述がある（[地熱スープ](https://tinetu-soup.com/dlsite)）。※二次情報のため要確認。

### 日本産インディーのSteamでの実態
- **1,000円以上する日本産インディーゲームで10万本以上売れているタイトルは「10本あるかどうか」**という調査（[ながいながぽん](https://nagapong.hatenablog.jp/entry/2025/03/04/155253)）。
- Steamにおける日本語ユーザーの比率は**おおむね2%程度**（2023年6月時点で日本語2.82%、言語別6位）（[serkantoto.com](https://www.serkantoto.com/2023/07/07/japanese-steam-pc-gaming/)、[Quantumrun](https://www.quantumrun.com/consulting/steam-language-statistics/)）。※比率は小さいが、2020〜2025年で最も成長した国の一つに日本が挙げられている（[gamediscover.co](https://newsletter.gamediscover.co/p/whats-the-country-split-for-players)）。

---

## 8. HTML5 / ブラウザゲーム市場の現状

### 伸びている側の数字
- **Bloomberg は2025年11月に「ビデオゲームの最も熱い新プラットフォームは古いプラットフォーム、すなわちWebサイトである」と報じた。** 1,890億ドル規模のゲーム産業の大半が停滞または縮小するなか、GeoGuessrやチェスのようなWebゲームへの需要が高まっている。Google と Kantar のデータによれば、この分野の売上（広告＋アイテム課金）は**2021年から2028年にかけて3倍の30.9億ドル**に達する見込み（[Bloomberg](https://www.bloomberg.com/news/articles/2025-11-07/video-games-hottest-new-platform-is-an-old-one-websites)、[BusinessWorld転載](https://bworldonline.com/bloomberg/2025/11/11/711147/video-games-hottest-new-platform-is-an-old-one-websites/)）。
- **2025年上半期のHTML5ゲームのリリース数は前年同期比でほぼ3倍の15,000本**（[MCV/DEVELOP](https://mcvuk.com/business-news/why-browser-games-are-the-next-billion-dollar-bet/)）。
- Poki の月間訪問数は1億2,250万、CrazyGames は6,110万。それぞれ5年前比で**569%増 / 673%増**（同）。
- 市場規模の予測: ブラウザゲーム市場は2025年の78.1億ドルから2026年に80.1億ドル（CAGR 2.6%）、2030年に90.7億ドル（[The Business Research Company](https://www.thebusinessresearchcompany.com/report/browser-games-global-market-report)）。HTML5ゲーム市場は2025年の56.6億ドルから2035年に104.2億ドル（CAGR 6.34%）（[Market Reports World](https://www.marketreportsworld.com/market-reports/html5-games-market-14713615)）。※市場調査会社のレポートは手法が公開されておらず、数字の幅も大きい。参考値として扱うべき。

### 縮んでいる／終わっている側の数字
- 日本では **ゲームアツマールが「ブラウザゲーム市場の縮小」を理由に2023年に終了**している（前述）。

### 誰がプレイヤーか
- Poki のプレイヤーは2025年に**6億2,500万人**（デスクトップ＋モバイル）（[AccessNewswire](https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/poki-announces-milestone-of-625-million-players-without-raising-e-1148808)）。
- Bloomberg の分析では「時間に追われる人々にとって、Webサイトを訪れるのは速くて簡単。コンソールを起動する必要もアプリを落とす必要もなく、自宅でも仕事の合間でもいつでも再開できる」ことが牽引要因（[Bloomberg](https://www.bloomberg.com/news/articles/2025-11-07/video-games-hottest-new-platform-is-an-old-one-websites)）。
- 収益は英語圏Tier1（米・英・豪）に強く偏る（[Cinevva](https://app.cinevva.com/guides/publish-game-crazygames)）。

---

# 解釈・推測編

**以下はすべて調査者の解釈であり、上記の事実から導いた推論である。数字そのものではない。**

## 解釈1: Steamは「初回の商業プロダクト」に対する答えとしては構造的に誤っている

事実として、2025年のSteam新作の売上中央値は$249で、4割超が$100を回収できていない。これは「うちのゲームが弱いかもしれない」という話ではなく、**19,000本という供給過剰に対して発見機構が追いついていない構造の問題**である。加えて本プロダクトは短編アクションであり、2時間返金ルールの直撃を受ける層に完全に一致する。『Paddle Paddle Paddle』の21%返金率は、27万本という成功規模でも避けられなかった。極小規模で出せば、返金率はより高くなると推測する。

さらにSteamに出すには、いま存在しないものを全部作る必要がある —— Electronラッパー、コントローラー対応、実績、クラウドセーブ、ストア素材14種、トレーラー、そしてウィッシュリスト7,000〜10,000件を集めるためのマーケティング活動。**これは「極小規模なプロダクト」という前提と真っ向から矛盾する。**

## 解釈2: HTML5ポータルは、このプロダクトの現在の形と最も適合が良い

CrazyGamesの技術要件（初期DL 50MB以内、1,500ファイル以内、1クリック以内でプレイ開始、16:9レスポンシブ）は、**外部ライブラリなし・音声ファイルなし・すでにタッチ対応済み**の本プロダクトなら、ほぼ現状のまま満たしている可能性が高いと推測する。必要な追加開発はSDKのフック（ゲームプレイ開始／停止／広告ブレイク／ロード完了通知）だけで、これは既存の `ui.js`（開始・ゲームオーバー・クリア）と `input.js`（ポーズ）の分岐に対応する箇所がすでにあるため、**数十行のオーダー**で済むと見込む。

一方Steamに出すために必要な追加開発は、控えめに見ても数週間から数か月分ある。**同じプロダクトに対して、参入コストが1桁ないし2桁違う。**

## 解釈3: CrazyGames → Poki の順が良い

両方とも人力審査だが、性質が違うと推測する。

- CrazyGames は **Basic Launch という軽い統合の入り口があり、QAのフィードバックが1〜2営業日**で返る。つまり「まず出してみて、反応を見る」ができる。
- Poki は**完全ハンドピックで、掲載されればホームページのスポットライトが保証される**代わりに、選抜が重い。50/50という条件は業界で最も良い部類だが、それは「選ばれた場合の話」。

したがって **CrazyGames で先に出してプレイ数の実績を作り、その数字を持ってPokiに提出する**のが、初回タイトルとしては合理的な順序だと考える。両者に排他条項があるかは本調査では確認できなかったため、**提出前に各社の規約で独占条件の有無を必ず確認すること。**

## 解釈4: 収益の現実的なレンジ（推測）

出典のある数字から逆算した**推測**である。断定的な数字ではない。

- **もしPoki / CrazyGamesに掲載され、そこそこ遊ばれた場合**: 二次情報では「主要ポータルで好調なカジュアルゲームは月$200〜$2,000」とされる（[Cinevva](https://app.cinevva.com/guides/web-game-monetization)）。**初回タイトルはこのレンジの下端、あるいはそれ以下**と見るのが妥当だろう。CPM $1〜$5から素直に計算すると、月10万プレイ・1プレイあたり広告1〜2回・分配後50〜60%で、**月$50〜$300**程度になる。
- **掲載されなかった場合**: itch.io + 自前Webでは、**ほぼゼロ**と考えるべきである。itch.io の70パーセンタイルで13,000ビューという数字は「収益」ではなく「閲覧」である。
- **Steamに出した場合**: 中央値$249、返金2割前後を引いて、$100の登録料を回収できない可能性が5割前後。**初回タイトルとしては期待値がマイナス**と推測する。

**結論として、「初回タイトルで生活できる金額」は、どの配信先を選んでも現実的ではない。** そのため、初回タイトルの目的は収益額ではなく、**(a) 実際に人に遊ばれる経験を1回通すこと、(b) 次のタイトルで通用する配信チャネルを1本確保すること**に置くべきだと考える。

## 解釈5: 「HTML5市場は伸びている」の読み方に注意

Bloombergと各ポータルの数字は確かに強い成長を示している。ただし注意すべき点が2つある。

1. **2025年上半期だけでHTML5ゲームのリリース数が前年比3倍の15,000本**という数字は、需要と同時に**供給も爆発している**ことを意味する。Steamで起きた供給過剰が、数年遅れでWebでも起きる可能性がある。ポータルが人力キュレーションを維持しているのは、いまのところその防波堤になっている。**つまり「審査に通る」ことの価値は今後さらに上がると推測する。**
2. **日本では逆の動きがあった。** ゲームアツマールは2023年に「ブラウザゲーム市場の縮小」を理由に終了している。日本の投稿サイト（unityroom、PLiCy、ふりーむ）はいずれも基本的に非収益であり、**日本語圏のブラウザゲームには「収益化された市場」が事実上存在しない**と見てよい。したがって**収益を狙うなら英語圏のポータル一択**であり、日本の投稿サイトは「フィードバックを得る場」として使うのが正しい。

## 解釈6: 追加開発の優先順位（推測に基づく提案）

1. **英語化**（最優先）。ポータルの収益は英語圏Tier1に偏っており、日本語のみのゲームはそもそも掲載対象になりにくいと推測する。テキスト量が少ないゲームなので、これは低コストで済むはず。
2. **モバイル横画面での操作性**。CrazyGamesはモバイルホームページ掲載の条件を別途持っている（20MB以内）。すでにタッチ対応済みなので、あとは実機での手触り。
3. **SDKフック**。ゲームプレイ開始／停止／広告ブレイク／ロード完了。
4. **1クリック以内でプレイ開始**。現在タイトル画面に面セレクトがあるが、「即座にゲームプレイに入れる」というCrazyGamesの要件に照らすと、**タイトル画面から1クリックでステージ1に入れる導線**が必要になる可能性がある。
5. **プレイ時間の設計**。ポータルの収益はプレイ回数と滞在時間に比例する。買い切りとは最適化する指標が違う。

---

## 出典URL一覧

### Steam
- Steam Direct Fee（Steamworks公式）: https://partner.steamgames.com/doc/gettingstarted/appfee
- Review Process（Steamworks公式）: https://partner.steamgames.com/doc/store/review_process
- Steam Deck Compatibility Review（Steamworks公式）: https://partner.steamgames.com/doc/steamdeck/compat
- How to Publish a Game on Steam in 2026（Ziva）: https://ziva.sh/blogs/publish-game-steam
- Thousands of Steam Games Fail to Recoup $100 Submission Fee（Outlook Respawn）: https://respawn.outlookindia.com/gaming/gaming-news/thousands-of-steam-games-fail-to-recoup-100-submission-fee
- Steam新作4割、サイト登録料100ドルすら回収できずか（GameBusiness.jp）: https://www.gamebusiness.jp/article/2025/10/22/25314.html
- The Steam Paradox 2025: https://game-developers.org/steam-paradox-2025-revenue-volume
- How many games were released in 2025?（How To Market A Game）: https://howtomarketagame.com/2026/01/08/how-many-games-were-released-in-2025/
- Steam: $16B+ in 2025, Nearly Half of 19,000 Games Got Under 10 Reviews（80.lv）: https://80.lv/articles/steam-earned-usd16b-in-2025-but-nearly-half-of-19-000-games-got-under-10-reviews
- Nearly half of the 19,000 games released on Steam this year went almost unnoticed（TechSpot）: https://www.techspot.com/news/110592-nearly-half-19000-games-released-steam-year-went.html
- Indie games accounted for 25% of Steam's revenue in 2025（Notebookcheck）: https://www.notebookcheck.net/Indie-games-accounted-for-25-of-Steam-s-revenue-in-2025.1189429.0.html
- Video Game Insights: Indie Games on Steam in 2024: https://gamedevreports.substack.com/p/video-game-insights-indie-games-on
- Steam Game Page Requirements（Steam Page Analyzer）: https://www.steampageanalyzer.com/blog/steam-page-asset-requirements
- Steam Capsule Sizes & Art Guide（presskit.gg）: https://presskit.gg/field-guides/steam-capsule-art-guide
- I Failed Steam Review Multiple Times, So I Made a Checklist of All 14 Required Images（UhiyamaLab）: https://uhiyama-lab.com/en/blog/gamedev/steam-release-images-checklist/
- Steam Popular Upcoming List: Wishlists Needed to Qualify: https://www.steampageanalyzer.com/blog/steam-popular-upcoming-list
- How Indie Game Wishlists on Steam Predict Success（B3 Daily）: https://b3daily.com/2025/10/25/how-indie-game-wishlists-on-steam-predict-success-trends-from-2024-2025
- Steam's new 100,000 wishlist rule（PC Guide）: https://www.pcguide.com/news/steams-new-100000-wishlist-rule-means-many-indie-devs-will-have-to-rely-on-a-different-feature-to-be-discovered/
- Steam Sales Calculator: Reviews-to-Sales Multiplier: https://www.steampageanalyzer.com/blog/steam-sales-calculator
- Steam's Review Multiplier Still Shapes Game Revenue Metrics in 2025（Otakukart）: https://otakukart.com/steams-review-multiplier-still-shapes-game-revenue-metrics-in-2025/
- Indie Dev Says Game Refunded 55,000 Times Via Steam Loophole（Kotaku）: https://kotaku.com/steam-indie-short-pc-refund-paddle-paddle-paddle-zoroarts-2000712822
- Indie developer asks Valve to change its 2-hour refund policy（TweakTown）: https://www.tweaktown.com/news/112505/indie-developer-asks-valve-to-change-its-2-hour-refund-policy-as-55-000-players-refunded-his-game-after-finishing-it/index.html
- Steam's two-hour refund window is silently killing niche indie games（XDA）: https://www.xda-developers.com/steams-two-hour-refund-window-killing-niche-indie-games/
- Steam Launch QA Checklist（Bugnet）: https://bugnet.io/blog/steam-launch-qa-checklist
- Steam Game Release Summary by Year（SteamDB）: https://steamdb.info/stats/releases/

### HTML5をSteamに出す（ラッパー）
- Desktop publishing（Web Game Dev）: https://www.webgamedev.com/publishing/desktop
- Publishing Web Games on Steam with Electron（Phaser, 2025-03）: https://phaser.io/news/2025/03/publishing-web-games-on-steam-with-electron
- greenworks（GitHub）: https://github.com/greenheartgames/greenworks
- steamworks.js（GitHub）: https://github.com/ceifa/steamworks.js/
- How to integrate an HTML5 Electron based game with the Steam API: https://liana.one/integrate-electron-steam-api-steamworks

### Epic / GOG
- Self-service publishing now available for the Epic Games Store（Epic公式）: https://www.unrealengine.com/en-US/blog/self-service-publishing-now-available-for-the-epic-games-store
- Epic Games Store now lets developers publish their own games（Game Developer）: https://www.gamedeveloper.com/business/epic-games-store-now-lets-developers-publish-their-own-games
- Beyond Steam: Where else to sell your game（Logrus IT）: https://games.logrusit.com/en/news/beyond-steam/
- Releasing your game on GOG | FAQ（GOG公式）: https://support.gog.com/hc/en-us/articles/11382878039197-Releasing-your-game-on-GOG-FAQ

### itch.io
- Benchmark: Itch.io traffic（How To Market A Game, 2025-05-12）: https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/
- Can itch.io success translate to Steam success?（How To Market A Game, 2025-05-22）: https://howtomarketagame.com/2025/05/22/more-games-that-made-the-itch-io-to-steam-transition/
- How to Publish a Browser Game on itch.io（Dinogame GG）: https://dinogame.gg/blog/how-to-publish-game-on-itch-io/
- How to Make Money on Itch.io（Generalist Programmer）※二次情報: https://generalistprogrammer.com/tutorials/how-to-make-money-on-itchio-indie-game-guide
- My gross revenue on itch.io（Nathalie Lawhead）※本調査では未読: https://www.nathalielawhead.com/candybox/my-gross-revenue-on-itch-io-transparently-sharing-all-my-stats-earnings-and-speaking-on-how-supportive-of-a-base-itch-io-has
- How to Make Money as a Game Developer with Zero Investment（itch.io公式ブログ）: https://itch.io/blog/910759/how-to-make-money-as-a-game-developer-with-zero-investment

### Poki
- Working With Poki（Poki公式SDKドキュメント）: https://sdk.poki.com/
- Requirements（Poki公式）: https://sdk.poki.com/new-requirements
- HTML5（Poki公式）: https://sdk.poki.com/html5
- Release Process（Poki公式）: https://sdk.poki.com/releaseprocess
- Poki for Developers: https://developers.poki.com/
- Terms and Conditions Poki for Developers（PDF）: https://app.poki.dev/2024.03.13_Terms_and_Conditions_Poki_for_Developers.pdf
- How Poki's developer-first approach drove 1 billion game plays（TechFundingNews）: https://techfundingnews.com/browser-gaming-website-poki-won-big-at-the-dutch-game-awards-celebrating-hitting-1-billion-monthly-plays/
- Poki Announces Milestone of 625 Million Players（AccessNewswire）: https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/poki-announces-milestone-of-625-million-players-without-raising-e-1148808
- Poki hits 1B monthly plays（Dealroom）: https://app.dealroom.co/news/feed/poki-hits-1b-monthly-plays-as-developer-first-model-boosts-top-studio-revenues-tenfold-1
- Inside Poki's vision for the future of browser gaming（PocketGamer.biz）: https://www.pocketgamer.biz/inside-pokis-vision-for-the-future-of-browser-gaming/
- From hobby to 67 Million Gameplays on Poki in 2025（Artem Lanin / Medium）: https://medium.com/@playrea/from-hobby-to-67-million-gameplays-on-poki-in-2025-df2c147cfb27
- Reach the world on web, build your brand, and earn revenue with Poki（js13kGames / Medium）: https://medium.com/js13kgames/reach-the-world-on-web-build-your-brand-and-earn-revenue-with-poki-a9bac9044a28

### CrazyGames
- Introduction / Requirements（CrazyGames公式）: https://docs.crazygames.com/requirements/intro/
- Technical Requirements（CrazyGames公式）: https://docs.crazygames.com/requirements/technical/
- Gameplay Requirements（CrazyGames公式）: https://docs.crazygames.com/requirements/gameplay/
- FAQ & Contact（CrazyGames公式）: https://docs.crazygames.com/faq/
- CrazyGames Developer Portal: https://developer.crazygames.com/
- CrazyGames Developer Guide: Publish and Earn（Cinevva）: https://app.cinevva.com/guides/publish-game-crazygames
- How CrazyGames Streamlined Global Payouts with Tipalti: https://tipalti.com/resources/customer-stories/crazygames/
- CrazyGames launches new Developer Portal with revenue share options: https://start-it-x.prezly.com/crazygames-launches-new-developer-portal-with-revenue-share-options

### その他ポータル
- Y8 Revenue Share（Y8公式）: https://www.y8.com/revshare
- Upload Your Game to Y8: https://www.y8.com/upload
- GameMonetize FAQ: https://gamemonetize.com/faq
- Game distribution for developers（GameMonetize）: https://gamemonetize.com/developers
- Web Game Monetization: What the Data Actually Says（Cinevva）: https://app.cinevva.com/guides/web-game-monetization
- The huge, hidden web game market no one talks about（Game Developer）: https://www.gamedeveloper.com/business/the-huge-hidden-web-game-market-no-one-talks-about-and-how-to-get-in-
- How to Submit an HTML5 Game to Web Game Platforms（Bounty Board）: https://www.bountyboard.gg/blog/how-to-submit-an-html5-game-to-web-platforms
- Revenue Sharing（Wikigrounds / Newgrounds）: https://newgrounds.fandom.com/wiki/Revenue_Sharing
- Game Jolt Announces Unique Way for Creators to Monetize（Business Wire, 2022）※古い情報: https://www.businesswire.com/news/home/20221206005017/en/Game-Jolt-Announces-Unique-Way-for-Creators-to-Monetize

### モバイル
- Compare Memberships（Apple公式・本調査で直接確認済み）: https://developer.apple.com/support/compare-memberships/
- App testing requirements for new personal developer accounts（Google Play Console ヘルプ）: https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- Everything about the 12 testers requirement（Google Play Developer Community）: https://support.google.com/googleplay/android-developer/community-guide/255621488/everything-about-the-12-testers-requirement?hl=en
- Google Play and App Store Fees（SplitMetrics）: https://splitmetrics.com/blog/google-play-apple-app-store-fees/
- App Store Review Guidelines: Will Your Webview App Be Rejected?（MobiLoud）: https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper
- Guideline 4.2 - Design - Minimum Functionality（Apple Developer Forums）: https://developer.apple.com/forums/thread/806726
- AdMob Plus（GitHub）: https://github.com/admob-plus/admob-plus
- Cap-go/capacitor-admob（GitHub）: https://github.com/Cap-go/capacitor-admob

### 自前Web配信
- Cloudflare Pages Free Tier – Pricing & Limits（FreeTiers）: https://www.freetiers.com/directory/cloudflare-pages
- Cloudflare Pages Free Tier Limits（Rubab's Digital）: https://rubabsdigital.com/blog/cloudflare-pages-free-tier-limits
- Googleアドセンスの平均収入（月収）と目安はいくら？（アドセンスクエスト）: https://life-money-create.com/adosensu/
- 個人開発WEBサービスのAdSense収益20ヶ月分を公開する（Qiita）: https://qiita.com/pikachu0203/items/8241585e0b3114891615
- 個人開発ブラウザゲームの運営コストメモ（2025年版）（note）: https://note.com/tiktan/n/n43ab3be6949f

### 日本市場
- 【2026年更新】ゲームの公開サイト一覧（かかし / note）: https://note.com/kakasi4423/n/n75ec8e897da7
- unityroomとは？無料ゲームの宝庫で遊び方から投稿まで徹底解説: https://indie-game.hatenablog.com/entry/2025/08/04/075021
- 自作ゲーム投稿サービス『ゲームアツマール』、2023年6月28日にサービス終了（ゲームメーカーズ）: https://gamemakers.jp/article/2022_12_20_27416/
- niconicoの自作ゲーム投稿サービス「ゲームアツマール」2023年6月にサービス終了へ（AUTOMATON）: https://automaton-media.com/articles/newsjp/20221220-231370/
- 『ゲームアツマール』サービス終了のお知らせ（ニコニコインフォ）: https://blog.nicovideo.jp/niconews/194994.html
- BOOTH で同人・デジタル販売——手数料5.5%で手取りを最大化する方法（クリナビ）: https://crenavi.com/platform/booth
- DLsiteでの販売方法・手数料を徹底解説（地熱スープ）: https://tinetu-soup.com/dlsite
- 個人開発（インディー）ゲームをSteamで販売するのがおすすめじゃない理由（みやこ出版 / note）: https://note.com/akutaba/n/na40466f9386e
- #Steam という名の戦地 〜自作ゲームを個人で販売してみた雑感メモ〜（みやこ出版 / note）: https://note.com/akutaba/n/n8f231965cf53
- さすがにもうちょいあるでしょ？Steamで十万本以上売れてそうな国産インディーゲームを調べる（ながいながぽん）: https://nagapong.hatenablog.jp/entry/2025/03/04/155253
- あのゲームはどれだけ儲かっている？レビュー数から売上・収益を予想しよう！(Steam編)（Ad-Virtua / note）: https://note.com/ad_virtua/n/ndecf8ce74a26
- Japanese Steam User Number Reaches Record High（Serkan Toto, 2023）※古い情報: https://www.serkantoto.com/2023/07/07/japanese-steam-pc-gaming/
- Steam Language Statistics（Quantumrun）: https://www.quantumrun.com/consulting/steam-language-statistics/
- What's the country split for players of hit Steam games?（GameDiscoverCo）: https://newsletter.gamediscover.co/p/whats-the-country-split-for-players

### 市場全体
- Video Games' Hottest New Platform Is an Old One: Websites（Bloomberg, 2025-11-07）: https://www.bloomberg.com/news/articles/2025-11-07/video-games-hottest-new-platform-is-an-old-one-websites
- 同上（BusinessWorld転載・全文）: https://bworldonline.com/bloomberg/2025/11/11/711147/video-games-hottest-new-platform-is-an-old-one-websites/
- Why browser games are the next billion-dollar bet（MCV/DEVELOP）: https://mcvuk.com/business-news/why-browser-games-are-the-next-billion-dollar-bet/
- Browser Games Global Market Report 2026（The Business Research Company）※市場調査会社レポート: https://www.thebusinessresearchcompany.com/report/browser-games-global-market-report
- HTML5 Games Market（Market Reports World）※市場調査会社レポート: https://www.marketreportsworld.com/market-reports/html5-games-market-14713615
