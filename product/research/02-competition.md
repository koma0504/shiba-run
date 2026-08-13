# 02 競合分析 — 2Dアクション／柴犬ラン

調査日: 2026-08-13
調査者: Claude（競合分析担当）

---

## この文書の結論（3〜5行）

1. **Steamに「2Dプラットフォーマー」として出すのは、統計上いま最も勝てない賭け。** 2025年にSteamで1,000レビューに到達した2Dプラットフォーマーはわずか3本（ヒット率0.18%）で、全ジャンル最下位。同年のタグ付きリリースは1,960本ある。
2. **一方でブラウザは空いている。** Pokiは月間アクティブ1億人、CrazyGamesは月3,000〜5,000万人。素のJS+Canvasという本プロジェクトの技術選択は、この市場の要件（初期8MB以下・即起動）に偶然きれいに合致している。
3. **「柴犬」は認知の追い風にはなるが差別化にはならない。** Steamには柴犬ゲームがすでに10本以上あり、うち1本（Shiba Inu Rescue）は「柴犬の2Dアクションプラットフォーマー」そのもの。
4. **率直に言えば、現状の企画（走る・2段ジャンプ・ショット・チャージ・踏みつけ・ボス）はどこにも尖りがない。このままでは埋もれる。** 差別化はモチーフではなくメカニクスかフォーマットで作るしかない。
5. **勝ち筋の仮説はひとつ:「ブラウザで1プレイ60〜90秒・即リトライ・決定論的リプレイによるタイムアタック」。** 検証は「Poki/CrazyGamesで10万プレイに届くか」で行い、届かないならSteam版を作らない。

---

## 0. この調査の限界（先に書く）

この環境ではネットワーク送信が制限されており、**個々のページを直接取得（WebFetch/curl）できなかった**。
howtomarketagame.com、poki.com、sdk.poki.com、wnhub.io、voxbooster.com、Wikipedia などはすべて egress でブロックされた。

したがって本文の数値は**検索エンジンが返した各ページの要約経由**である。一次ページのURLは併記してあるので、
重要な判断に使う前には各自でURLを開いて確認してほしい。特に以下は注意:

- **推定値サイト（gamerevenuedata / raijin / steam-revenue-calculator / SteamSpy など）の売上・本数は推定であり実測ではない。** 本文では「推定」と明記した。
- **開発元・出版元が自ら発表した数字**（Nine Sols の80万本など）と、**第三者の推定**は区別して書いた。
- 孫引き（GamesRadarがZukowskiを引用、など）は「誰が誰を引いたか」を書いた。

---

## 1. ジャンルの勝敗ライン

### 1-1. 事実: 2Dプラットフォーマーは全ジャンル最下位

ゲームマーケティングコンサルタントの **Chris Zukowski** が2026年1月27日に公開した年次分析
"What the hell happened in 2025?" によると、2025年のSteamの状況は次のとおり:

| 指標 | 2024年 | 2025年 |
|---|---|---|
| Steam年間リリース本数 | 18,234本 | 20,282本 |
| うち1,000レビュー到達 | 445本 | 608本 |
| 到達率 | 2.44% | 2.99%（過去4年で最高） |

出典: [How To Market A Game "What the hell happened in 2025?"](https://howtomarketagame.com/2026/01/27/what-the-hell-happened-in-2025/) /
同記事をGamesRadar+が報じたもの [GamesRadar+](https://www.gamesradar.com/games/a-terrifying-20-282-games-were-released-on-steam-in-2025-and-just-608-managed-to-get-1-000-reviews-expert-finds-we-might-be-in-a-bit-of-an-indie-golden-age/)

同じZukowskiの分析による**2025年のジャンル別ヒット率（1,000レビュー到達率）**:

| ジャンル | ヒット率 | 到達本数 |
|---|---|---|
| オープンワールド・サバイバルクラフト | 20.8% | 15本 |
| ファーミング | 8.3% | 5本 |
| ローグライク・デッキビルダー | 5.1% | 11本 |
| シミュレーション | 4.1% | 43本 |
| マネジメント | 3.4% | 19本 |
| レーシング | 2.1% | 14本 |
| パズル | 0.34% | 14本 |
| ポイント&クリック・アドベンチャー | 0.18% | 3本 |
| **2Dプラットフォーマー** | **0.18%** | **3本** |

**2Dプラットフォーマーはサバイバルクラフトの約100分の1しか当たらない。**
なお2024年の2Dプラットフォーマーのヒット率は0.25%だったので、**前年よりさらに悪化している**（全体の到達率は改善しているのに）。

出典: 同上。2024年の0.25%は同じZukowskiの2024年版分析による。

### 1-2. 事実: 供給量

SteamDBのタグ別リリース統計（tag 5379 = 2D Platformer）では、
**2025年に1,960本、2024年に1,963本**の2Dプラットフォーマーがリリースされている。

出典: [SteamDB Steam Game Releases Summary for 2D Platformer](https://steamdb.info/stats/releases/?tagid=5379)

1,960本出て3本しか1,000レビューに届かない。**これが勝敗ラインの実態である。**

### 1-3. 事実: 「単体のプラットフォーマー」は売れない、混ぜれば売れる

Zukowskiが2022年に発表したジャンル分析について、Game World Observerは
「Steamプレイヤーは、他ジャンルと混ぜられていないプラットフォーマーには関心がない」と報じた。
売上上位20本のプラットフォーマーは**すべて**、ローグライク（Rogue Legacy 2）やメトロイドヴァニア（Infernax）などと混成されていた。

出典: [Game World Observer (2022-05-31)](https://gameworldobserver.com/2022/05/31/steam-players-dont-care-about-platformers-unless-they-mixed-with-other-genres)

### 1-4. 事実: 収益の中央値

- Steamのインディーゲームの**生涯総収益の中央値は $5,000〜15,000**（Steamの30%控除後で $3,500〜10,500）。出典: [Ziva](https://ziva.sh/blogs/indie-game-revenue)
- **2025年単年**で見たインディーゲームの総収益の中央値は約 **$249**（Valve控除後 $174）。5,000本以上が年間$100すら稼げなかった。出典: [VoxBooster "Indie Game Statistics (2026)"](https://voxbooster.com/blog/indie-game-statistics-2026/)（VG Insightsのデータを引用）
- 一方、2025年のSteam全体の売上は記録的な$17.7B、うちインディーが約25%＝$4.4B。出典: 同上 / [WN Hub](https://wnhub.io/news/analytics/item-49645)

**解釈**: 総額は史上最大だが、中央値はほぼゼロ。分布は完全に上位集中型。
「ジャンルの平均」を見て意思決定してはいけない。見るべきは「自分がなぜ上位0.18%に入れるのか」だけである。

### 1-5. 勝敗ラインのまとめ（解釈）

| 出し方 | 見込み | 判定 |
|---|---|---|
| Steamに $10 前後の2Dプラットフォーマーとして出す | ヒット率0.18%。無名の初回作なら実質ゼロ | **やってはいけない** |
| Steamに「2Dアクション×何か」の混成として出す | 混成ジャンルは上位を独占。ただし開発規模が跳ね上がる | 初回商業作としては重すぎる |
| ブラウザポータル（Poki/CrazyGames）に出す | 後述。技術的に本プロジェクトと相性が良い | **これが本命** |
| ブラウザ無料 → Steam有料の二段構え | Vampire Survivors / Buckshot Roulette の実績パターン | **本命の延長線として妥当** |

---

## 2. 競合・コンパラブル一覧

### 2-1. 小規模で成功した2Dアクション

| タイトル | 規模 | プラットフォーム | 何が効いたか | 出典 |
|---|---|---|---|---|
| **Animal Well** (2024) | ソロ（Billy Basso、本業の傍ら約7年） | Steam / PS5 / Switch | 「2Dだが正体不明」の圧倒的ビジュアルと秘密の密度。パブリッシャー（Bigmode / videogamedunkey）の話題性。Steamレビュー23,254件・96%。推定120万本／総収益$21.3M（第三者推定） | [gamerevenuedata](https://gamerevenuedata.com/games/animal-well/) / [Game File インタビュー](https://www.gamefile.news/p/animal-well-interview-billy-basso) |
| **Pizza Tower** (2023) | Tour de Pizza（実質ソロ主導、McPig） | Steam | 常軌を逸したアニメーション表現そのものがフック。発売1ヶ月で約10万本・約$3M。累計847,790本／$13.8M（第三者推定、より高い推定では$19.1M） | [Raijin](https://raijin.gg/app/2231450/Pizza_Tower/sales-revenue) / [GameSensor](https://gamesensor.info/news/pizza_tower) |
| **Nine Sols** (2024) | Red Candle Games（台湾、中規模スタジオ） | Steam / 各機 | パリィ特化の戦闘＋強い作家性の美術。**開発元発表で発売1年・全機種80万本**。Steamレビュー16,000件超・95%以上 | [TechRaptor](https://techraptor.net/gaming/news/nine-sols-sales-800k) / [Console Creatures](https://www.consolecreatures.com/nine-sols-has-sold-800000-copies/) |
| **Downwell** (2015) | ソロ（Ojiro Fumoto、約18ヶ月） | PC / iOS / Android | **1メカニクス（銃ブーツ）に全設計を従属させた**。本人がGDC 2016で "Designing Downwell Around One Key Mechanic" として登壇。累計50万本超（推定） | [GDC 2016 講演（Internet Archive）](https://archive.org/details/GDC2016Fumoto) / [Wikipedia: Downwell](https://en.wikipedia.org/wiki/Downwell_(video_game)) |
| **Gravity Circuit** (2023) / **Berserk Boy** (2024) | 小規模 | Steam / Switch ほか | ロックマン系の直系。批評は好意的だが**本プロジェクトの最も直接的な競合**。売上の公開数値は見つからなかった | [Nintendo Life: Berserk Boy](https://www.nintendolife.com/news/2024/01/sonic-meets-mega-man-in-high-speed-retro-platformer-berserk-boy) / [Metacritic: Gravity Circuit](https://www.metacritic.com/game/gravity-circuit/user-reviews/) |

### 2-2. 小規模で「フック1点」で爆発した非プラットフォーマー

| タイトル | 規模 | プラットフォーム | 何が効いたか | 出典 |
|---|---|---|---|---|
| **Vampire Survivors** (2021→22) | ソロ（Luca Galante / poncle） | **itch.ioにHTML5ブラウザ版を無料公開** → 9ヶ月後Steam早期アクセス$2.99 | 「攻撃が自動」という引き算。開発費約$1,500。初月$7M、累計推定総収益$57M。ブラウザ版は体験版として残した | [Wikipedia: Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors) / [poncle.itch.io](https://poncle.itch.io/vampire-survivors) / [steam-revenue-calculator](https://steam-revenue-calculator.com/app/1794680/vampire-survivors) |
| **Buckshot Roulette** (2023→24) | ソロ（Mike Klubnika、Godot） | itch.io無料 → Steam $2.99 | ルール1行で説明できる緊張。**累計800万本超** | [GameDaily](https://gamedaily.com/news/buckshot-roulette-started-off-free-now-its-sold-over-8-million-copies) / [WN Hub](https://wnhub.io/news/investment/item-46509) |
| **Suika Game** (2021→23) | 小規模（Aladdin X） | Switch eShop / モバイル | 2023年9月に配信者（VTuber含む）が触れて**日販4本→数万本**。2023年12月に500万本、2024年3月に800万本。2023・2024年の日本eShop最多DL | [GamesRadar+](https://www.gamesradar.com/watermelon-game-is-the-switchs-latest-viral-sensation-and-its-booming-in-popularity-two-years-after-its-launch/) / [GoNintendo](https://gonintendo.com/contents/27345-suika-game-hits-1-4-million-sold) |
| **Chained Together** (2024) | 小規模 | Steam $5 | 「4人が鎖で繋がる」1点。同時接続85,638人、2024年Steamで11番目に大きいローンチ。配信映え | [WN Hub](https://wnhub.io/news/stores-and-publishing/item-43905) / [GamesRadar+](https://www.gamesradar.com/games/co-op/10000-reviews-90-positive-on-steam-and-only-dollar5-viral-hit-chained-together-uses-the-power-of-co-op-to-ruin-up-to-four-friendships-at-once/) |
| **Level Devil** (Unept) | 小規模 | **Poki / Steam / Google Play** | 「見た目はふつうのプラットフォーマー、実は全部罠」という裏切り1点。**Pokiで300万人以上がアップボート**。約240ステージ、ローカル2人プレイあり。TikTok/YouTubeでバイラル | [Poki](https://poki.com/en/g/level-devil) / [Steam](https://store.steampowered.com/app/3242750/Level_Devil/) |

**Level Devil は本プロジェクトにとって最も学ぶべき1本である。** 2Dプラットフォーマーという「Steamで最悪のジャンル」で、
ブラウザに出して、1つの裏切りメカニクスだけで数千万人に届いている。

---

## 3. 短時間・ブラウザで遊べるアクションゲームの現状

### 3-1. 事実: ポータルの規模

| プラットフォーム | 規模 | 出典 |
|---|---|---|
| **Poki** | 2025年に**6億2,500万人**がプレイ。**月間アクティブ1億人**（PSNの1.19億に迫る）。2025年6月に月間10億プレイ突破。外部資金調達なしで到達 | [AccessNewswire プレスリリース](https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/poki-announces-milestone-of-625-million-players-without-raising-e-1148808) / [Dealroom](https://app.dealroom.co/news/feed/poki-hits-1b-monthly-plays-as-developer-first-model-boosts-top-studio-revenues-tenfold-1) |
| **CrazyGames** | 2025年初に第三者集計で月間3,500万人、自称で5,000万人超。月間約3億プレイ | [Mobidictum](https://mobidictum.com/crazygames-reaches-35-million-monthly-users/) / [GamesBeat](https://gamesbeat.com/crazygames-hits-35m-users-for-browser-games-and-launches-social-multiplayer-features/) |

Pokiの月間アクティブは5年で1,000万人→1億人に伸びた。
出典: [Daily Mobile Gaming News](https://www.mgoddess.com/news/inside-poki-s-vision-for-the-future-of-browser-gaming/?lang=en)

### 3-2. 事実: 出す側の条件

**Poki**
- 収益分配: **Poki経由で来たユーザーは50/50。自分のコミュニティやSNS、検索から直接来たユーザーは100%開発者**
- 初期ダウンロードサイズ **8MB以下**を目標
- SDKの `gameplayStart()` は**ロード時ではなくプレイヤーの最初の入力で**発火させること（必須）
- 「10秒以内に楽しさに到達させる」ことが最大のレバー
- セッションの深さは5〜15分以上を支えられること。**10回来るプレイヤーは1回だけのプレイヤーの約10倍の収益**を生むため、リテンションが最重要指標

出典: [Poki Documentation Requirements](https://sdk.poki.com/new-requirements) / [Poki Quality Guidelines](https://sdk.poki.com/poki-quality-guidelines) / [Poki for Developers](https://developers.poki.com/guide) / [abratabia: Licensing to Portals](https://www.abratabia.com/web-game-monetization/licensing-to-portals.php)

**CrazyGames**
- 初期ダウンロード **50MB以下**、ファイル数 **1,500以下**
- Unity / Godot / Phaser / Construct / GameMaker / PlayCanvas / **Pixi.js / Babylon.js、その他HTML5出力なら何でも可**（＝素のJS+Canvasでも問題ない）
- devicePixelRatio:1、16:9のレスポンシブiframe、モバイル画面で文字と画像が読めること
- PEGI 12相当（過度な暴力・性的表現・実マネーギャンブル不可）
- 2026年のGameMaker web jam条件では**広告収益60%・課金収益70%**が開発者取り分
- Basic Launch → Full Launch の2段階審査

出典: [CrazyGames Documentation](https://docs.crazygames.com/requirements/intro/) / [Gameplay requirements](https://docs.crazygames.com/requirements/gameplay/) / [Cinevva: CrazyGames Developer Guide (2026)](https://app.cinevva.com/guides/publish-game-crazygames)

### 3-3. 事実: ブラウザで実際いくら稼げるか

- 初めてのWebゲームで現実的に見込めるのは**月$500〜3,000**
- よくできたカジュアルゲームでポータルの広告分配は**月$200〜2,000**
- Pokiの上位スタジオは**年間最大$1M（€1M）**。Pokiの開発者ファースト施策で上位スタジオ収益は約10倍（$50,000→$1M）に
- 具体例: トルコのEmolingo Gamesは Poki収益で2人→5人に。同社の Rainbow Obby は**1億プレイ超**
- 「広告収入は数十万プレイを超えて初めて意味を持つ。ボリュームがすべて」

出典: [IndieGameBusiness](https://indiegamebusiness.com/web-gaming-for-indie-developers/) / [Dealroom](https://app.dealroom.co/news/feed/poki-hits-1b-monthly-plays-as-developer-first-model-boosts-top-studio-revenues-tenfold-1) / [Cinevva: Web Game Monetization](https://app.cinevva.com/guides/web-game-monetization)

### 3-4. 人気の2Dアクション・ランナー系（ポータル上）

Poki / CrazyGames で繰り返し名前が挙がるもの:

| タイトル | 型 | 特徴 |
|---|---|---|
| Level Devil | ステージクリア型・超短ステージ | 罠による裏切り。約240ステージ。ローカル2人 |
| Subway Surfers | 無限ランナー | 収集とキャラ解放。操作はスワイプのみ |
| Run 3 | 無限ランナー（2.5D） | 反復前提のスキル型 |
| Stickman Hook | 短ステージ型 | ワイヤーアクション1点、タイミングのみ |

出典: [Poki Platform Games](https://poki.com/en/platform) / [CrazyGames Platform Games](https://www.crazygames.com/t/platform) / [Technosports: Top 10 Poki Games](https://technosports.co.in/top-10-poki-games-to-play-in-oct-2025/)

**共通点（解釈）**: 説明が1行で済む。操作が1〜2ボタン。1プレイが30〜90秒。死んだ瞬間に再挑戦できる。

### 3-5. 無限ランナー型 vs ステージクリア型（解釈・推測）

これは明確なデータで決着がつく問いではなかった。信頼できる定量比較は見つけられなかったので、以下は**解釈**である。

| | 無限ランナー／スコアアタック型 | ステージクリア型 |
|---|---|---|
| 制作コスト | 低い（生成器1つ＋難度曲線） | 高い（ステージ数に比例） |
| 上限 | パターンが飽きやすい | ステージ追加で伸ばせる |
| 配信・SNS適性 | スコア比較が自然に生まれる | クリア/失敗の切り抜きが作りやすい |
| ポータル適性 | セッション反復が自然 | ステージ間で離脱しやすい |
| 本プロジェクトとの距離 | ボス・チャージショット・踏みつけコンボが活きない | 現状の実装そのまま |

**推測**: 本プロジェクトはすでにステージ・ボス・セーブ・面セレクトが実装済みで、ここを捨てるのは損失が大きい。
現実的な最適解は**ハイブリッド**——短いステージクリア型を維持しつつ、**1ステージ単位でタイム／スコアが出る**構造にして、
反復の動機を無限ランナー型から借りること。Level Devil がまさにこの形（超短ステージ＋即リトライ）である。

---

## 4. 「動物が主人公」「犬」を扱ったゲームの市場

### 4-1. 事実: 動物主人公は強い（ただし猫の実績が突出）

| タイトル | 実績 | 出典 |
|---|---|---|
| **Stray**（猫、2022） | 発売1ヶ月で約250万本・約$5,700万。Annapurna InteractiveのSteam最大ヒット。同時接続6万人超 | [Indie Game Origin](https://indiegameorigin.com/blog/how-stray-outsold-aaa-games-with-guerilla-marketing) |
| **Little Kitty, Big City**（猫、2024） | 発売48時間で10万本超・初期収益$400万。Xbox Game Passで200万ユニークユーザー | [WN Hub](https://wnhub.io/news/finance/item-43427) / [GameDiscoverCo](https://newsletter.gamediscover.co/p/how-little-kitty-big-city-purred) |
| **Nintendogs**（犬、2005〜） | シリーズ累計**2,800万本超**（2022年12月時点）、DS史上2番目の売上。発売週の欧州DS本体売上が400〜700%増 | [Video Game Sales Wiki](https://vgsales.fandom.com/wiki/Nintendogs) / [List of best-selling Nintendo video games](https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_video_games) |
| **Nintendogs + Cats**（3DS, 2011） | 171万本。日本46万本、日本国外125万本 | [GameSpot](https://www.gamespot.com/articles/nintendogs-cats-sells-17-million-pokemon-black-and-white-top-115-million/1100-6310374/) |

**注目**: 日本版 Nintendogs の初期SKUのひとつが **「nintendogs 柴&フレンズ」** だった。
柴犬は日本の商業ゲームで既に主役SKUとして扱われた実績がある。
出典: [Amazon.co.jp 商品ページ](https://www.amazon.co.jp/dp/B0007XQ4A0)

**解釈**: 直近で大当たりしているのは**猫**であって犬ではない。犬の大ヒットは20年前のNintendogsで、
かつ「育成／癒し」であって「アクション」ではない。**犬×アクションで大当たりした最近の実例は見つからなかった。**

### 4-2. 事実: 柴犬＝Doge のミーム性は本物、かつ世界規模

- 2010年2月、日本の幼稚園教諭 **佐藤淳子** さんが保護犬の柴犬 **かぼす（Kabosu）** の写真を個人ブログに投稿。Reddit / Tumblr 経由で "Doge" ミームとして世界に拡散
- Dogecoin のロゴになり、時価総額$700億規模のミームコインに発展したと報じられている
- 2014年、**スウェーデン・ストックホルムの公共交通当局が Doge ミームを使った広告キャンペーン**を展開
- 千葉県**佐倉市**がマンホールにDoge画像を採用、寄付でかぼすの銅像が建立された
- オリジナル写真のNFTが**$400万**で落札
- かぼすは2024年5月24日に死去（報道により18歳／19歳と表記ゆれ）

出典: [Know Your Meme: Doge](https://knowyourmeme.com/memes/doge) / [ChainCatcher](https://www.chaincatcher.com/en/article/2125958) / [NBC News](https://www.nbcnews.com/news/world/kabosu-dog-doge-internet-meme-died-rcna4472) / [NPR](https://www.npr.org/tags/1145820862/kabosu)

**解釈**: 「Shiba Inu」は、日本語圏より**むしろ英語圏で認知が高い可能性がある**（Doge / SHIBトークン経由）。
これは日本の個人開発者にとって珍しく有利な非対称性である。ただし——

### 4-3. 事実: 柴犬モチーフはすでに埋まっている

Steamに存在する柴犬タイトル（検索で確認できたもの）:

| タイトル | ジャンル | 備考 |
|---|---|---|
| **Shiba Inu Rescue** (2021-05-21) | **2Dアクションアドベンチャー・プラットフォーマー** | 母犬ユキが子犬を野生動物と捕獲人から救う。**本プロジェクトの直接競合** |
| **HUMANITY** (2023) | パズル／アクションプラットフォーマー | 柴犬が群衆を導く。Enhance製、評価が高い |
| Shiba Knight | アクション | 障害物を跳び、最後にドラゴンと戦う |
| Shiba Simulator Supreme | アクション | 悪夢からの脱出、衣装と能力の解放 |
| Shiba Army | サバイバル | 月を目指してコイン収集 |
| A Summer with the Shiba Inu / Autumn with the Shiba Inu | ビジュアルノベル | |
| Shiba Mekuri（柴めくり） | パズル | 実写の柴犬子犬「ひな」 |
| METAL DOGS（柴犬追加DLC） | アクション | |

出典: [Shiba Inu Rescue](https://store.steampowered.com/app/1583660/Shiba_Inu_Rescue/) / [HUMANITY](https://store.steampowered.com/app/1581480/HUMANITY/) / [Shiba Knight](https://store.steampowered.com/app/3164410) / [Shiba Simulator Supreme](https://store.steampowered.com/app/2615100/Shiba_Simulator_Supreme/) / [Shiba Army](https://store.steampowered.com/app/1734870/Shiba_Army/) / [A Summer with the Shiba Inu](https://store.steampowered.com/app/916030/A_Summer_with_the_Shiba_Inu/) / [Shiba Mekuri](https://store.steampowered.com/app/1673300/Shiba_Mekuri/)

なお SteamSpy の推定では A Summer with the Shiba Inu の所有者数は 0〜20,000（推定）。
出典: [SteamSpy app/916030](https://steamspy.com/app/916030)

**解釈: 「柴犬が主人公の2Dアクションプラットフォーマー」は、既にSteamに存在する（Shiba Inu Rescue）。**
モチーフだけでは名乗れない。ただし**「柴犬 × ロックマン系（ショット／チャージ／ボス戦）」の組み合わせは見つからなかった**ので、
そこにはまだ隙間がある——とはいえ、**その隙間が空いているのは需要がないからかもしれない**（推測）。

---

## 5. 差別化フックの類型カタログ

小さいゲームが埋もれずに注目された「フック」を、実例付きで類型化する。

### 型1: 1メカニクスに全設計を従属させる
1つのメカニクスを決め、他のすべてをそれに奉仕させる。説明が1行で済むようになる。
- **Downwell**: 「落ちながら下に撃つ銃ブーツ」。開発者本人がGDC 2016で "Designing Downwell Around One Key Mechanic" として語った
- **Vampire Survivors**: 「攻撃は自動」という引き算。ボタンは移動だけ
- 出典: [GDC 2016 講演](https://archive.org/details/GDC2016Fumoto) / [Wikipedia: Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors)

### 型2: 期待の裏切り（トロール／メタ）
既知のジャンルの見た目で入らせ、ルールを破る。
- **Level Devil**: 「普通のプラットフォーマーに見えるが全部罠」。Pokiで300万人以上がアップボート
- 出典: [Poki](https://poki.com/en/g/level-devil)

### 型3: ミーム性・キャラの一撃性
1枚の画像で伝わる。SNSで勝手に増殖する。
- **Doge / Kabosu**: 1枚の写真が世界的ミーム、広告・銅像・NFT $400万まで到達
- **Suika Game**: かわいい見た目が「戦略ゲームを避ける層」への通行証として機能した、との分析
- 出典: [Know Your Meme](https://knowyourmeme.com/memes/doge) / [hocmarketing 分析](https://en.hocmarketing.org/the-sensational-success-of-suika-game-why-a-watermelon-game-is-d-68108)

### 型4: 配信・切り抜き適性（3秒可読性）
「1枚のスクショか3秒のクリップで何のゲームか伝わるか」。伝わらないなら概念が複雑すぎる。
- **Suika Game**: 2023年9月、日本の配信者（Hololive等のVTuber含む）が触れて**日販4本→数万本**。Twitch月間視聴284万時間で9月82位
- **Chained Together**: 配信者が「友情が壊れる」様子をクリップ化して拡散、同接85,638人
- 出典: [GamesRadar+ (Suika)](https://www.gamesradar.com/watermelon-game-is-the-switchs-latest-viral-sensation-and-its-booming-in-popularity-two-years-after-its-launch/) / [WN Hub (Chained Together)](https://wnhub.io/news/stores-and-publishing/item-43905) / [The Viral Game Blueprint](https://www.game-developers.org/the-viral-game-blueprint)（「3秒可読性テスト」の出所）

### 型5: 協力／ローカルマルチ
2人目がいるだけで話題量が倍以上になる。
- **Chained Together**: 鎖で繋がれた最大4人。$5
- **Level Devil**: ローカル2人プレイを備える
- 出典: 上記

### 型6: 極端な短さ・即プレイ（摩擦ゼロ）
- Pokiの指針: **10秒以内に楽しさに到達**、初期DL **8MB以下**、`gameplayStart()` は最初の入力で発火
- 出典: [Poki Documentation](https://sdk.poki.com/new-requirements)

### 型7: 無料の入口 → 有料の本編
- **Vampire Survivors**: 2021年3月にitch.ioで**HTML5ブラウザ版を無料公開** → 9ヶ月後Steam早期アクセス$2.99。ブラウザ版は「体験版扱い」として残した（開発者本人の説明）
- **Buckshot Roulette**: itch.io無料 → Steam $2.99。累計800万本超
- 出典: [poncle.itch.io](https://poncle.itch.io/vampire-survivors) / [Kotaku](https://kotaku.com/castlevania-roguelike-vampire-survivors-steam-itch-io-1848402308) / [GameDaily](https://gamedaily.com/news/buckshot-roulette-started-off-free-now-its-sold-over-8-million-copies)

### 型8: 常軌を逸したビジュアル／アート量
- **Pizza Tower**: 手描きアニメーションの狂気そのものが売り。発売1ヶ月10万本
- **Animal Well**: 「2Dなのに何を見ているのか分からない」照明表現
- 出典: 前掲

### 型9: ジャンル混成
- Steam売上上位のプラットフォーマーは**全て**ローグライク／メトロイドヴァニアとの混成（Zukowski）
- 出典: [Game World Observer](https://gameworldobserver.com/2022/05/31/steam-players-dont-care-about-platformers-unless-they-mixed-with-other-genres)

### 型10: 技術的裏付けのある競技性（本プロジェクト固有の候補・推測）
決定論的リプレイが保証されているゲームは、**改ざんできないタイムアタック・リプレイ共有・ゴースト対戦**を実装できる。
これは「技術資産をそのままフックに変える」珍しい型で、小規模でも実装可能。
本プロジェクトは既に `tools/replay-check.mjs` による決定論的リプレイ基盤を持っている。
**これは推測に基づく提案であり、市場実績の裏付けはない。**

---

## 6. コンパラブル（comps）5本

「本プロジェクトは〇〇の△△を、□□の××にしたもの」という形で名乗れる候補。
実現難度と、効くと考える理由を併記する。

| # | 名乗り方 | 元にする実績 | 実現難度 | 効くと考える理由（解釈） |
|---|---|---|---|---|
| **1** | **「Downwell の1メカニクス集中を、柴犬の踏みつけコンボでやったもの」** | Downwell（ソロ、GDC登壇、1メカニクス設計） | 中（機能の削除が主なので実装は減る） | 現状は走る／2段ジャンプ／ショット／チャージ／踏みつけと**要素が多すぎる**。「踏みつけを繋げ続ける限り落ちない」1点に絞れば説明が1行になる |
| **2** | **「Vampire Survivors の"ブラウザ無料→Steam有料"導線を、ロックマン系アクションでやったもの」** | Vampire Survivors（HTML5でitch.io無料→Steam $2.99、累計推定$57M） | 低（既にブラウザで動く） | 素のJS+Canvasという技術選択が、そのまま流通戦略になる。Steamのヒット率0.18%を正面から踏まずに済む |
| **3** | **「Level Devil の1プレイ30秒×即リトライを、ショットとボスのある横スクロールでやったもの」** | Level Devil（Pokiで300万アップボート、約240ステージ） | 中（ステージを刻み直す） | 「Steamで最悪のジャンル」がブラウザでは数千万人に届いた唯一の直接的証拠。本プロジェクトが最も学ぶべき形 |
| **4** | **「Suika Game / Doge のミーム的かわいさを、腕前が要るアクションの表皮にしたもの」** | Suika Game（配信で日販4本→数万本）／Doge（世界規模のミーム） | 低（美術方針の決定） | かわいさは「戦略／腕前を避ける層」への通行証として機能した、という分析がある。柴犬は英語圏での認知が特に高い |
| **5** | **「Nine Sols / Gravity Circuit のボス偏重構成を、5分で終わるサイズに圧縮したもの（ボスラッシュ）」** | Nine Sols（開発元発表80万本、パリィ特化） | 中〜高（ボス行動の作り込みが必要） | CLAUDE.mdの「次にやること」にも『ボスの行動パターンを面ごとに作り分ける』とある。道中を削ってボスだけにすれば、制作量を減らしつつ濃度が上がる |

**推奨は 2 + 3 の組み合わせ**（＝ブラウザに超短ステージ型として出す）。1 と 4 は上乗せできる。5 は単独では規模が重い。

---

## 7. 本プロジェクトへの示唆（率直に）

### 7-1. 悪い知らせ

**このままでは埋もれる。** 根拠は3つ。

1. **ジャンルが最悪。** 2Dプラットフォーマーは2025年のSteamで全ジャンル最下位のヒット率0.18%。1,960本出て3本しか1,000レビューに届いていない。しかも前年（0.25%）より悪化している。
2. **モチーフが空いていない。** Steamには柴犬ゲームが少なくとも8本、うち Shiba Inu Rescue は「柴犬が主人公の2Dアクションプラットフォーマー」そのもの。「柴犬が走る2Dアクション」は名乗りとして成立しない。
3. **メカニクスに尖りがない。** 走る・2段ジャンプ・ショット・チャージショット・踏みつけコンボ・ボス戦——これは1987年から2024年まで数千本が通った道で、**1行で説明したときに「で、何が新しいの？」に答えられない**。Downwell も Level Devil も Vampire Survivors も、その1行を持っていた。

### 7-2. 良い知らせ

1. **ブラウザという逃げ道がある。そしてそこは空いている。** Poki月間1億人、CrazyGames月3,000〜5,000万人。Level Devil は「Steamで最悪のジャンル」でここに出して勝った。
2. **技術選択が偶然、正しい。** 素のJS+Canvas、外部ライブラリなし、ビルドなし——これは Poki の8MB制約・即起動要件に対して**ほぼ理想的**。Unity製の競合はこの点で不利。CrazyGamesもPixi.js等のHTML5出力を明示的に受け入れている。
3. **柴犬は英語圏で強い。** Doge/Kabosu経由で「Shiba Inu」の認知は世界規模。日本の個人開発者が持てる数少ない非対称優位。
4. **決定論的リプレイ基盤を既に持っている。** `tools/replay-check.mjs` は元々リグレッション検証のためのものだが、これは**改ざん不能なタイムアタック・リプレイ共有・ゴースト**の土台でもある。この資産を持っている小規模2Dアクションはほぼない（推測）。

### 7-3. 具体的な提言（優先順）

1. **Steamを第一目標から外す。** 第一目標はPokiまたはCrazyGamesへの掲載。Steamは「ブラウザで10万プレイ超えたら考える」。理由: ヒット率0.18% vs 月間1億人。
2. **フックを1つ決めて、それ以外を削る。** 今の機能セットは「小さいゲーム」ではなく「小さいのに要素が多いゲーム」。1行で言えるまで削る。
3. **1プレイの長さを60〜90秒に設計し直す。** Pokiの指針は「10秒で楽しさに到達」「5〜15分のセッションを支える」「10回来る人は1回の人の10倍の収益」。今のステージ構成がこれに合っているか測る。
4. **決定論的リプレイをフックに転用する。** ステージごとのタイム表示 → 記録の保存 → リプレイ再生 → 共有。これは既存の技術資産の上に乗るので、追加コストが小さい。
5. **英語圏を主戦場と想定する。** UIの英語対応と、"Shiba" を含むタイトルを最初から前提にする。日本語圏は配信者経由（Suika Gameの前例）を狙う二次市場と位置づける。
6. **検証可能な失敗条件を先に決める。** 例:「ポータル掲載から3ヶ月で10万プレイに届かなければ、この企画では商業化しない」。中央値$249という数字を見て、期待値を先に現実に合わせておく。

### 7-4. やってはいけないこと

- **ステージ数を増やして勝とうとすること。** 1,960本の中で「ステージが多い」は差別化にならない。Level Devil は240ステージあるが、売りは罠であってステージ数ではない。
- **柴犬というモチーフを差別化だと考えること。** 認知の追い風であって、差別化ではない。
- **Steamに$10で出して様子を見ること。** 統計上、これは最も期待値の低い選択肢。

---

## 8. 「事実」と「解釈・推測」の分離

### 事実（出典あり）
- 2025年Steamリリース20,282本、1,000レビュー到達608本（2.99%）／ 2024年は18,234本中445本（2.44%）— Chris Zukowski
- 2025年の2Dプラットフォーマーのヒット率0.18%（3本）で全ジャンル最下位。2024年は0.25% — Chris Zukowski
- 2025年の2Dプラットフォーマーのタグ付きリリース1,960本 — SteamDB
- Poki月間アクティブ1億人、2025年に6億2,500万人がプレイ、月10億プレイ — Poki公式プレスリリース
- CrazyGames月間3,500万人（第三者集計）〜5,000万人（自称）— Mobidictum / GamesBeat
- Poki: 8MB目標、Poki経由50/50・直接流入100% — Poki公式ドキュメント
- CrazyGames: 初期50MB以下・1,500ファイル以下・HTML5出力なら可 — CrazyGames公式ドキュメント
- Vampire SurvivorsはHTML5ブラウザ版をitch.ioで無料公開してから9ヶ月後にSteamへ — Wikipedia / itch.io
- Nine Sols 発売1年で全機種80万本 — 開発元Red Candle Games発表
- Suika Game: 2023年9月に配信者経由で日販4本→数万本、2023年12月に500万本 — GamesRadar+ ほか
- Nintendogsシリーズ累計2,800万本超（2022年12月時点）— Video Game Sales Wiki
- Stray 発売1ヶ月で約250万本・約$5,700万
- Doge/Kabosu: 2010年に佐藤淳子さんが投稿、Dogecoinのロゴ、NFT $400万、佐倉市の銅像、2024年5月24日死去
- Steamに柴犬タイトルが少なくとも8本存在し、Shiba Inu Rescueは柴犬の2Dアクションプラットフォーマー

### 推定値（第三者の推計であり実測ではない）
- Animal Well 推定120万本／総収益$21.3M — gamerevenuedata（別ソースは67.3万本／$12.3Mと推定しており、**推計間で2倍近い開き**がある）
- Pizza Tower 累計847,790本／$13.8M（別推計では$19.1M）— Raijin / GameSensor
- Vampire Survivors 累計総収益推定$57M — steam-revenue-calculator
- Downwell 累計50万本超 — 推定
- Steamインディーの生涯収益中央値$5,000〜15,000、2025年単年中央値$249

### 解釈・推測（本文書の書き手の判断であり、出典で裏付けられていない）
- 「柴犬×ロックマン系」の隙間が空いているのは、需要がないからかもしれない
- 無限ランナー型 vs ステージクリア型は、本プロジェクトの既存実装を活かすならハイブリッドが最適
- 決定論的リプレイ基盤をタイムアタック／リプレイ共有に転用するという差別化案には、市場実績の裏付けがない
- 「Shiba Inu」は日本語圏より英語圏で認知が高い可能性がある（Doge経由）— 定量的な裏付けは取れていない
- 素のJS+Canvasという技術選択がポータル要件に対してUnity製より有利、というのは要件文書からの推論であって実測ではない

---

## 9. 出典URL一覧

### ジャンル統計・Steam市場
- How To Market A Game "What the hell happened in 2025?" (Chris Zukowski, 2026-01-27) — https://howtomarketagame.com/2026/01/27/what-the-hell-happened-in-2025/
- How To Market A Game "What the hell happened in 2024?" — https://howtomarketagame.com/2025/01/15/what-the-hell-happened-in-2024/
- GamesRadar+「20,282本中608本」報道 — https://www.gamesradar.com/games/a-terrifying-20-282-games-were-released-on-steam-in-2025-and-just-608-managed-to-get-1-000-reviews-expert-finds-we-might-be-in-a-bit-of-an-indie-golden-age/
- SteamDB 2D Platformer タグ別リリース統計 — https://steamdb.info/stats/releases/?tagid=5379
- Game World Observer「プラットフォーマーは混ぜないと売れない」(2022-05-31) — https://gameworldobserver.com/2022/05/31/steam-players-dont-care-about-platformers-unless-they-mixed-with-other-genres
- Game Oracle "Can 2D Platformers Still Be Profitable on Steam?" — https://www.game-oracle.com/blog/2d-platformers-on-steam
- VoxBooster "Indie Game Statistics (2026)" — https://voxbooster.com/blog/indie-game-statistics-2026/
- WN Hub「インディーが2025年Steam収益の25%」— https://wnhub.io/news/analytics/item-49645
- Ziva "How Much Do Indie Games Actually Make on Steam?" — https://ziva.sh/blogs/indie-game-revenue

### ブラウザポータル
- Poki 6億2,500万人プレイ達成のプレスリリース — https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/poki-announces-milestone-of-625-million-players-without-raising-e-1148808
- Dealroom「Poki月10億プレイ、上位スタジオ収益10倍」— https://app.dealroom.co/news/feed/poki-hits-1b-monthly-plays-as-developer-first-model-boosts-top-studio-revenues-tenfold-1
- Poki Documentation: Requirements — https://sdk.poki.com/new-requirements
- Poki Documentation: Quality Guidelines — https://sdk.poki.com/poki-quality-guidelines
- Poki for Developers — https://developers.poki.com/guide
- Mobidictum「CrazyGames 月間3,500万人」— https://mobidictum.com/crazygames-reaches-35-million-monthly-users/
- GamesBeat「CrazyGames 35M」— https://gamesbeat.com/crazygames-hits-35m-users-for-browser-games-and-launches-social-multiplayer-features/
- CrazyGames Documentation: Requirements — https://docs.crazygames.com/requirements/intro/
- CrazyGames Documentation: Gameplay — https://docs.crazygames.com/requirements/gameplay/
- Cinevva "CrazyGames Developer Guide (2026)" — https://app.cinevva.com/guides/publish-game-crazygames
- Cinevva "Web Game Monetization: What the Data Actually Says (2026)" — https://app.cinevva.com/guides/web-game-monetization
- IndieGameBusiness "Web Gaming for Indie Developers: 5 Honest Truths" — https://indiegamebusiness.com/web-gaming-for-indie-developers/
- abratabia "Licensing Games to Portals" — https://www.abratabia.com/web-game-monetization/licensing-to-portals.php
- Gamedeveloper.com "The huge, hidden web game market no one talks about" — https://www.gamedeveloper.com/business/the-huge-hidden-web-game-market-no-one-talks-about-and-how-to-get-in-
- Poki: Platform Games — https://poki.com/en/platform
- CrazyGames: Platform Games — https://www.crazygames.com/t/platform
- Technosports "Top 10 Poki Games" — https://technosports.co.in/top-10-poki-games-to-play-in-oct-2025/

### 個別タイトル
- Animal Well 収益推定 — https://gamerevenuedata.com/games/animal-well/
- Game File: Animal Well 開発者インタビュー — https://www.gamefile.news/p/animal-well-interview-billy-basso
- Pizza Tower 売上推定 (Raijin) — https://raijin.gg/app/2231450/Pizza_Tower/sales-revenue
- GameSensor: Pizza Tower 発売1ヶ月10万本 — https://gamesensor.info/news/pizza_tower
- TechRaptor: Nine Sols 80万本 — https://techraptor.net/gaming/news/nine-sols-sales-800k
- Console Creatures: Nine Sols 80万本 — https://www.consolecreatures.com/nine-sols-has-sold-800000-copies/
- GDC 2016 Ojiro Fumoto "Polishing the Boots – Designing Downwell Around One Key Mechanic" — https://archive.org/details/GDC2016Fumoto
- Wikipedia: Downwell — https://en.wikipedia.org/wiki/Downwell_(video_game)
- Wikipedia: Vampire Survivors — https://en.wikipedia.org/wiki/Vampire_Survivors
- poncle.itch.io: Vampire Survivors（ブラウザ無料版） — https://poncle.itch.io/vampire-survivors
- Kotaku: Vampire Survivors の itch.io → Steam — https://kotaku.com/castlevania-roguelike-vampire-survivors-steam-itch-io-1848402308
- GameDaily: Buckshot Roulette 800万本 — https://gamedaily.com/news/buckshot-roulette-started-off-free-now-its-sold-over-8-million-copies
- WN Hub: Buckshot Roulette 400万本時点 — https://wnhub.io/news/investment/item-46509
- GamesRadar+: Suika Game バイラル — https://www.gamesradar.com/watermelon-game-is-the-switchs-latest-viral-sensation-and-its-booming-in-popularity-two-years-after-its-launch/
- GoNintendo: Suika Game 140万本 — https://gonintendo.com/contents/27345-suika-game-hits-1-4-million-sold
- WN Hub: Chained Together 同接85,638人 — https://wnhub.io/news/stores-and-publishing/item-43905
- GamesRadar+: Chained Together — https://www.gamesradar.com/games/co-op/10000-reviews-90-positive-on-steam-and-only-dollar5-viral-hit-chained-together-uses-the-power-of-co-op-to-ruin-up-to-four-friendships-at-once/
- Poki: Level Devil — https://poki.com/en/g/level-devil
- Steam: Level Devil — https://store.steampowered.com/app/3242750/Level_Devil/
- Nintendo Life: Berserk Boy — https://www.nintendolife.com/news/2024/01/sonic-meets-mega-man-in-high-speed-retro-platformer-berserk-boy
- Metacritic: Gravity Circuit — https://www.metacritic.com/game/gravity-circuit/user-reviews/

### 動物・犬・柴犬
- Indie Game Origin: Stray の売上とマーケティング — https://indiegameorigin.com/blog/how-stray-outsold-aaa-games-with-guerilla-marketing
- WN Hub: Little Kitty, Big City 48時間で10万本 — https://wnhub.io/news/finance/item-43427
- GameDiscoverCo: Little Kitty, Big City 分析 — https://newsletter.gamediscover.co/p/how-little-kitty-big-city-purred
- Video Game Sales Wiki: Nintendogs — https://vgsales.fandom.com/wiki/Nintendogs
- GameSpot: Nintendogs + Cats 171万本 — https://www.gamespot.com/articles/nintendogs-cats-sells-17-million-pokemon-black-and-white-top-115-million/1100-6310374/
- Amazon.co.jp: nintendogs 柴&フレンズ — https://www.amazon.co.jp/dp/B0007XQ4A0
- Know Your Meme: Doge — https://knowyourmeme.com/memes/doge
- ChainCatcher: Kabosu と MEME 文化 — https://www.chaincatcher.com/en/article/2125958
- NBC News: Kabosu 死去 — https://www.nbcnews.com/news/world/kabosu-dog-doge-internet-meme-died-rcna4472
- NPR: Kabosu — https://www.npr.org/tags/1145820862/kabosu
- Steam: Shiba Inu Rescue — https://store.steampowered.com/app/1583660/Shiba_Inu_Rescue/
- Steam: HUMANITY — https://store.steampowered.com/app/1581480/HUMANITY/
- Steam: Shiba Knight — https://store.steampowered.com/app/3164410
- Steam: Shiba Simulator Supreme — https://store.steampowered.com/app/2615100/Shiba_Simulator_Supreme/
- Steam: Shiba Army — https://store.steampowered.com/app/1734870/Shiba_Army/
- Steam: A Summer with the Shiba Inu — https://store.steampowered.com/app/916030/A_Summer_with_the_Shiba_Inu/
- Steam: Shiba Mekuri — https://store.steampowered.com/app/1673300/Shiba_Mekuri/
- SteamSpy: A Summer with the Shiba Inu — https://steamspy.com/app/916030

### フック・バイラル
- The Viral Game Blueprint（3秒可読性テスト） — https://www.game-developers.org/the-viral-game-blueprint
- Game Launch Guide: 共有されるゲームの心理 — https://gamelaunchguide.com/blog/make-indie-game-go-viral-psychology/
- Akupara Games "Indie Insights: Hooks and Anchors" — https://akuparagames.medium.com/indie-insights-hooks-and-anchors-8223f4f0dfb3
- hocmarketing: Suika Game の成功分析 — https://en.hocmarketing.org/the-sensational-success-of-suika-game-why-a-watermelon-game-is-d-68108
