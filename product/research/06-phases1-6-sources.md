# dev-flow.html フェーズ1〜6 の出典検証（2026-08-15）

**この文書の結論:** 15主張のうち **確認○が9件**（#2, 3, 4, 6, 7, 11, 12, 14, 15）、**部分的○（訂正・注記が要る）が6件**（#1, 5, 8, 9, 10, 13）、完全に「確認できず」は0件。
訂正が特に必要なのは **#9（アイコンで「CTRが数倍」は過大。実例は数%〜3割程度の改善）** と **#13（D1 40/D7 20/D30 10 は現在では平均ではなく上位層の基準）**。
#1 は「業界標準の定義」と言い切れない（会社・契約ごとに揺れる）、#8 と #10 は趣旨は正しいが言い回し・数字が出典より強い。
検証方法は WebSearch のみ（一次ページの全文取得はネットワーク制限のため不可）。検索結果の要約に基づくので、意思決定に使う前に各URLを開いて確認すること。

## 判定表

判定の凡例: **○** = 確認できた / **△** = 部分的に確認（訂正・注記あり） / **×** = 確認できず

### 開発工程の用語と慣行

| # | 主張 | 判定 | 出典 | 訂正・注記 |
|---|------|------|------|-----------|
| 1 | First Playable / Alpha（feature complete）/ Beta（content complete）/ RC / ゴールドマスター の定義。「Alpha以降は機能追加しない」「Beta以降はバグ修正とバランスのみ」 | △ | [Game Development Wiki](https://gamedev.fandom.com/wiki/Game_development) / [Filament Games](https://www.filamentgames.com/blog/alpha-beta-gold-commitment-high-quality-game-development) / [salivity: Publisher Milestones](https://salivity.github.io/game-development/article/publisher-milestones-in-game-development) | 用語と大枠（Alpha=feature complete、Beta以降はバグ修正中心、Gold=出荷ビルド）は広く確認できる。ただし**「マイルストーンに業界標準の定義はなく、パブリッシャー・年代・プロジェクトごとに異なる」**と明記する資料がある。Beta を「content complete」とする流儀と「feature and asset complete」とする流儀が併存。「content lock」という語自体の独立した出典は取れなかった。**「業界でよく使う語彙だが、契約ごとに定義し直すもの」と書くのが正確。** |
| 2 | バーティカルスライス＝「製品と同じ品質の数分間」、プリプロダクションの成果物 | ○ | [Ask a Game Dev: The Vertical Slice](https://askagamedev.tumblr.com/post/77406994278/game-development-glossary-the-vertical-slice) / [Game Developer: What you should take out of Pre-Production](https://www.gamedeveloper.com/game-platforms/what-you-should-take-out-of-pre-production) / [Tono Game Consultants](https://tonogameconsultants.com/vertical-slice/) | 定義（final quality の自己完結した一部分、主要システムが全部動く）・プリプロの成果物であり production 移行の判断材料という慣行、パブリッシャー/投資家へのピッチに使われる点まで一致。一次に近い出典は Mark Cerny の DICE 2002 講演「Method」の **publishable first playable**（[要約](https://iterative.co.nz/mark-cerny-method)）。 |
| 3 | プリプロを飛ばして量産に入ると後半で作り直しが発生する | ○ | Mark Cerny「Method」DICE Summit 2002（[要約](https://iterative.co.nz/mark-cerny-method) / [スライド](https://www.slideshare.net/holtt/cerny-method)） / [Game Developer: What you should take out of Pre-Production](https://www.gamedeveloper.com/game-platforms/what-you-should-take-out-of-pre-production) | Cerny 講演が最も引用される出典。「プリプロと量産は昼夜ほど違う」「first playable が不合格ならプロジェクトを中止せよ」。プリプロ省略→量産中の手戻り・スコープ崩壊は複数の producer 向け資料が一致して指摘。ただし検索上位には近年の（出所の弱い）ブログも混ざるため、引用するなら Cerny と Game Developer 記事に限定するのが安全。 |

### 審査・リリース慣行

| # | 主張 | 判定 | 出典 | 訂正・注記 |
|---|------|------|------|-----------|
| 4 | コンソールのプラットフォーム審査（lotcheck / cert）は厳格で、通らなければ差し戻し。審査期間の目安 | ○ | [N-iX: Console certification process](https://gamestudio.n-ix.com/console-certification-process-and-releasing-a-game-on-playstation-xbox-and-switch-what-you-should-know/) / [Room 8 Studio](https://room8studio.com/news/how-to-submit-game-to-store-from-the-first-attempt-game-porting-tips/) / [Rebel Galaxy: What is Lotcheck and Cert?](https://rebel-galaxy.com/what-islotcheck-and-cert/) | 実在の慣行（任天堂 Lotcheck / Sony TRC / Microsoft XR・TCR）。落ちれば修正して再提出。目安（2023〜2026年の記事）: Microsoft は約4〜7日、任天堂は発売予定日の30日前提出を求め審査は3社で最も長い。dev-flow の「数日〜数週間かかる前提でスケジュールを引く」はコンソールについて妥当。 |
| 5 | App Store / Google Play の審査期間の目安 | △ | [BE-DEV: How Long Does App Store & Google Play Review Take in 2025](https://be-dev.pl/blog/eng/how-long-does-app-store-google-play-review-take-in-2025) / [Google Play Developer Community](https://support.google.com/googleplay/android-developer/community-guide/244499850/app-review-time?hl=en) | 2025年時点: App Store は標準24〜48時間。Google Play は更新なら数時間、新規アプリ1〜3日、金融・子供向け等は最大7日。**dev-flow の「数日〜数週間」はコンソール込みの表現としては成立するが、モバイル単体は通常1〜3日**。「モバイルは1〜3日、コンソールは数週間」と分けて書くとより正確。 |
| 6 | Day 1 パッチは一般的な慣行 | ○ | [Kotaku: Why 'Day-One Patches' Are So Common](https://kotaku.com/why-day-one-patches-are-so-common-1784967193) / [Game Developer: Why You Should Want Day One Patches](https://www.gamedeveloper.com/business/why-you-should-want-day-one-patches) | 確認。理由も dev-flow の記述どおり: ゴールドマスター提出（認証＋ディスク製造で4〜8週間）から発売までの間に見つけたバグを直すため。ビルドは発売時点で1〜3ヶ月古い。初の Day 1 パッチは Ultima IX（1999）とされる。 |
| 7 | モバイルF2Pのソフトローンチ（カナダ・フィリピン・北欧などで先行配信し指標を見る） | ○ | [a16z: Mobile Game Soft Launch Best Practices](https://a16z.com/mobile-game-soft-launch/) / [MyTracker: How to Soft Launch a Game App](https://tracker.my.com/blog/all-you-need-to-know-about-how-to-soft-launch-a-game-app?lang=en) / [mobilegamer.biz: soft launch games](https://mobilegamer.biz/the-soft-launch-games-you-need-to-know-about/) | 確認。定番市場は NZ・カナダ・フィリピン（英語圏で英米に消費行動が近い）。役割分担まで慣行化: 技術テスト＝フィリピン等の安価市場、リテンション＝北欧、マネタイズ＝カナダ・豪・NZ 等。マネタイズ検証で LTV を実測し、世界展開かキルかを決める。EA・Playrix 等大手も現役で実施（2025年時点）。 |

### マーケティングの主張

| # | 主張 | 判定 | 出典 | 訂正・注記 |
|---|------|------|------|-----------|
| 8 | 「トレーラーは最初の5秒が全て」「ロゴから始めるトレーラーは負ける」 | △ | [Derek Lieu: Where to Put Logos in a Game Trailer](https://www.derek-lieu.com/blog/2021/3/29/where-to-put-logos-in-a-game-trailer) / [Derek Lieu: Trailer Editing Essays](https://www.derek-lieu.com/essays) | 発信者はゲームトレーラー専門編集者の Derek Lieu で確定（Half-Life: Alyx 等を手掛け、GDCでも講演）。ただし彼の実際の主張は「**最初の5〜10秒でどんなゲームかを確立せよ**」「**原則ロゴで始めるな。使うなら1ロゴ1秒以内**」。dev-flow の「5秒が全て」「ロゴから始めると負ける」は趣旨は同じだが断定が原文より強い。出典を付けるなら表現を Lieu の言い方に寄せること。 |
| 9 | 「モバイルはアイコンだけでCTRが数倍変わる」 | △ **要訂正** | [SplitMetrics: Rovio case](https://splitmetrics.com/cases/rovio-app-screenshots-a-b-testing/) / [AppTweak: App icon design tips](https://www.apptweak.com/en/aso-blog/how-to-design-an-app-icon) / [Asodesk: Towerlands icon A/B test](https://asodesk.com/blog/from-angry-guy-yelling-to-game-graphics-a-b-testing-of-the-towerlands-app-icon/) | A/Bテストでアイコンが効くこと自体は多数の実例で確認。ただし実測の改善幅は: Google Play アイコンテストの勝者で**中央値8〜12%のCVR改善、上位10%で28%**（AppTweak集計）、AppQuantum の事例でインストール+21.5%、Rovio はスクショ等含め+13%。**「数倍（2倍以上）変わる」を支持する実例は見つからなかった。**「アイコンだけでコンバージョンが1〜3割変わる」に訂正すべき。 |
| 10 | 「スクリーンショット1枚目で何のゲームか2秒で伝わるべき」 | △ | [Game World Observer: Zukowski's Steam page guide](https://gameworldobserver.com/2025/03/11/steam-page-launch-guide-wishlists-zukowski) / [Game Developer: How Steam users see your game](https://www.gamedeveloper.com/business/how-steam-users-see-your-game) | 趣旨（1枚目はコアゲームプレイを見せろ、タイトル画面やコンセプトアートを置くな、見た瞬間にゲームの内容が分かるべき）は Chris Zukowski（howtomarketagame.com）の一貫した主張として確認。ただし**「2秒」という具体的数字の出典は見つからなかった**。数字を外して「一目で伝わる」とするか、数字を使うなら出典を別途取ること。 |
| 11 | 「Steamのローンチ週の割引は10〜15%が定番」 | ○ | [Steamworks Documentation: Discounting](https://partner.steamgames.com/doc/marketing/discounts) / [presskit.gg: Steam Discounting Strategy](https://presskit.gg/field-guides/steam-discounting-strategy) | 2026年時点でも正しい。ローンチ割引は10〜15%が通例（強気に押すなら20%）で、7〜14日間。ローンチ割引の上限は40%。10〜15%の割引でウィッシュリスト→購入の転換が2〜4割上がるとするデータもある（steampageanalyzer, 2026）。 |
| 12 | 「ウィッシュリストの蓄積には数ヶ月かかるので、完成後にマーケを始めても間に合わない」 | ○ | [presskit.gg: How Steam Wishlists Work](https://presskit.gg/field-guides/how-steam-wishlists-work) / [presskit.gg: Indie Game Marketing Timeline](https://presskit.gg/field-guides/indie-game-marketing-timeline) | 確認。Zukowski のデータに基づく通説: Coming Soon ページは発売の6〜12ヶ月以上前に公開すべきで、早く出すデメリットはほぼない。古いウィッシュリストも新しいものとほぼ同率でコンバートする（Song of Iron のコホート分析）。Popular Upcoming 入りに必要な規模（約7,000件）を完成後から集めるのは困難。 |

### 運用KPI

| # | 主張 | 判定 | 出典 | 訂正・注記 |
|---|------|------|------|-----------|
| 13 | D1/D7/D30 の定義と「40% / 20% / 10% を下回ると広告でスケールさせにくい」 | △ **要訂正** | [Playio: D1/D7/D30 Retention Benchmarks](https://blog.playio.co/d1-d7-d30-retention-benchmarks-2026) / [GameAnalytics: 2025 Mobile Gaming Benchmarks](https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks) / [Game World Observer: Voodoo の基準](https://gameworldobserver.com/2023/07/25/voodoo-hybrid-games-d7-retention-games-and-names-podcast) | 定義（翌日・7日後・30日後に戻る割合）は○。40/20/10 は「long-standing rule」として実在するが、**発案者・初出は特定できなかった**（業界の慣習的目安）。**現在の実態では 40/20/10 は平均ではなく上位層の基準**: GameAnalytics（2024年末、約11,600本）で D1 は上位25%でも約27%、D7 中央値は3.4〜3.9%。2026年時点の「良い」水準は 35/15/5 程度とする資料もある。一方 UA 主導のジャンルでは近い数字が現役: Voodoo（ハイブリッドカジュアル）は D1 45% / D7 15%（パズルは20%）/ D30 10% を基準にしている（2023）。**「モバイル全体の合格ライン」ではなく「広告獲得で回すトップ層・ハイパーカジュアル系の基準」と書き直すべき。ジャンル差も大きい**（パズルは D1 約32%と高め、ハイパーカジュアルは D7 で一桁が普通）。 |
| 14 | LTV > CPI でなければ広告獲得を回せない | ○ | [AppAgent: LTV > CPI: The Guide to Mobile Game Profitability](https://appagent.com/blog/ltv-cpi/) / [Singular: LTV > CPI = success](https://www.singular.net/blog/ltv-cpi-success/) / [Upptic: CPI vs. LTV](https://upptic.com/cpi-vs-ltv-understanding-this-must-know-ratio-in-game-marketing/) | モバイルUAの標準的な原則として確認。LTV が獲得単価の上限（bid ceiling)を決める。実務上の注記: LTV>CPI ちょうどでは足りず、スケールに耐えるマージン（CPI は LTV の30〜70%目安）と回収期間・キャッシュフローの考慮が要る。スケールすると CPI は上がり獲得ユーザーの質は下がる。 |
| 15 | ポストモーテムを書いて次のプロジェクトに渡す慣行（Game Developer 誌の postmortem シリーズ） | ○ | [Wikipedia: Game Developer (magazine)](https://en.wikipedia.org/wiki/Game_Developer_(magazine)) / [Game Developer: Postmortem: Game Developer magazine](https://www.gamedeveloper.com/programming/postmortem-game-developer-magazine) / [Game Developer: 10 seminal game postmortems](https://www.gamedeveloper.com/audio/10-seminal-game-postmortems-every-developer-should-read) | 確認。Game Developer 誌の月刊 Postmortem コラムは1997年10月開始。「What Went Right 5つ / What Went Wrong 5つ」の形式が定番。2013年の休刊後は Gamasutra（現 gamedeveloper.com）が継承。開発チーム自身が書き、教訓を業界・次作へ渡す慣行として20年以上続いている。 |

## 検証方法の限界

- WebSearch の結果要約のみで判定した。一次ページの全文は取得していない。
- 検索上位に生成AI由来とみられる新興ブログ（nastyrodent.com、steampageanalyzer.com、presskit.gg 等）が多く、これらは「業界通説の反映」としては使えるが一次出典ではない。数字を意思決定に使うなら Steamworks 公式・GameAnalytics レポート・Cerny 講演など一次に近いものを開いて確認すること。
- 「検索で見つからなかった」（#10 の「2秒」、#13 の 40/20/10 の初出）は誤りの証明ではない。

## 出典URL一覧

### 開発工程
- https://gamedev.fandom.com/wiki/Game_development
- https://www.filamentgames.com/blog/alpha-beta-gold-commitment-high-quality-game-development
- https://salivity.github.io/game-development/article/publisher-milestones-in-game-development
- https://askagamedev.tumblr.com/post/77406994278/game-development-glossary-the-vertical-slice
- https://www.gamedeveloper.com/game-platforms/what-you-should-take-out-of-pre-production
- https://tonogameconsultants.com/vertical-slice/
- https://iterative.co.nz/mark-cerny-method （Cerny「Method」DICE 2002 の要約）
- https://www.slideshare.net/holtt/cerny-method

### 審査・リリース
- https://gamestudio.n-ix.com/console-certification-process-and-releasing-a-game-on-playstation-xbox-and-switch-what-you-should-know/
- https://room8studio.com/news/how-to-submit-game-to-store-from-the-first-attempt-game-porting-tips/
- https://rebel-galaxy.com/what-islotcheck-and-cert/
- https://be-dev.pl/blog/eng/how-long-does-app-store-google-play-review-take-in-2025
- https://support.google.com/googleplay/android-developer/community-guide/244499850/app-review-time?hl=en
- https://kotaku.com/why-day-one-patches-are-so-common-1784967193
- https://www.gamedeveloper.com/business/why-you-should-want-day-one-patches
- https://a16z.com/mobile-game-soft-launch/
- https://tracker.my.com/blog/all-you-need-to-know-about-how-to-soft-launch-a-game-app?lang=en
- https://mobilegamer.biz/the-soft-launch-games-you-need-to-know-about/

### マーケティング
- https://www.derek-lieu.com/blog/2021/3/29/where-to-put-logos-in-a-game-trailer
- https://www.derek-lieu.com/essays
- https://splitmetrics.com/cases/rovio-app-screenshots-a-b-testing/
- https://www.apptweak.com/en/aso-blog/how-to-design-an-app-icon
- https://asodesk.com/blog/from-angry-guy-yelling-to-game-graphics-a-b-testing-of-the-towerlands-app-icon/
- https://gameworldobserver.com/2025/03/11/steam-page-launch-guide-wishlists-zukowski
- https://www.gamedeveloper.com/business/how-steam-users-see-your-game
- https://partner.steamgames.com/doc/marketing/discounts
- https://presskit.gg/field-guides/steam-discounting-strategy
- https://presskit.gg/field-guides/how-steam-wishlists-work
- https://presskit.gg/field-guides/indie-game-marketing-timeline

### 運用KPI
- https://blog.playio.co/d1-d7-d30-retention-benchmarks-2026
- https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks
- https://gameworldobserver.com/2023/07/25/voodoo-hybrid-games-d7-retention-games-and-names-podcast
- https://appagent.com/blog/ltv-cpi/
- https://www.singular.net/blog/ltv-cpi-success/
- https://upptic.com/cpi-vs-ltv-understanding-this-must-know-ratio-in-game-marketing/
- https://en.wikipedia.org/wiki/Game_Developer_(magazine)
- https://www.gamedeveloper.com/programming/postmortem-game-developer-magazine
- https://www.gamedeveloper.com/audio/10-seminal-game-postmortems-every-developer-should-read
