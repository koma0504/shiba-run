# 04 検証（フェーズ0・1）— 「面白いか」「売れるか」を安く早く確かめる

対象: 個人開発者の初の商業タイトル（小規模なHTML5横スクロールアクション）。
目的: 作り込んでから失敗するのを避ける。**明日そのまま実行できる**粒度で書く。

> 出典の扱いについて。本文中の数字はすべて末尾の出典URLに紐づけている。
> 一次データ（Steamworks公式など）と二次的な分析ブログを区別して書いた。
> 出典がない主張は「経験則」または「推測」と明記した。
> なお調査環境の制約で `howtomarketagame.com` / `gamedeveloper.com` / `presskit.gg` /
> `gamedevreports.substack.com` などの本文に直接アクセスできず、検索エンジン経由の
> 引用文と要約に頼った箇所がある。**数字を意思決定に使う前に、該当URLを自分の目で開いて確認すること。**

---

## この文書の結論（3〜5行）

1. **「面白いか」は作らずに測れない。「売れるか」は作らずに測れる。** だから順序は「面白いかを最小プロトタイプで測る」→「売れるかをストアページ／ランディングページで測る」→「本開発」。
2. **他人5人に黙って遊ばせるのが最強かつ最安の手段。** 5人で使い勝手の問題の約85%が出る（[Nielsen由来の経験則](https://trymata.com/blog/5-user-rule-for-user-testing/)）。友人・家族の感想は使えない（[理由](https://gamedesignskills.com/game-design/playtest/)）。費用0円・所要3時間。
3. **「売れるか」の唯一まともな代理指標はウィッシュリスト（またはメール登録）であって、いいね数ではない。** Steamページは商品ページ訪問→ウィッシュリスト化の中央値が8〜12%（[出典](https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks)）。ここを測れば、作る前に需要が見える。
4. **2Dアクション／プラットフォーマーはSteamで最も飽和した領域のひとつ。** 2025年にSteamで出た17,889本のうち約半数はレビュー10件未満（[出典](https://www.steampageanalyzer.com/blog/indie-game-revenue-data)）。「良い作りである」ことは売れる理由にならない。**フックが一言で言えるか**が検証の中心。
5. **初作は小さく出し切ること自体が最大の学習。** 審査・税務・返金・サポート・ストア運用は、出してみるまで一切分からない。

---

## 用語の前提：この2つを混同しないこと

| 問い | 何で測るか | 作らないと測れないか |
|---|---|---|
| **面白いか**（Fun / Retention） | 他人の行動。触った時間、2回目を押すか、どこで手が止まるか | **測れない。** 最小の遊べるものが要る |
| **売れるか**（Demand / Appeal） | 見た人の意思表示。ウィッシュリスト、メール登録、事前登録、クリック率 | **測れる。** 静止画・GIF・30秒トレーラー・ストアページだけでよい |

個人開発でよくある事故は、**面白いかだけを検証して売れるかを検証しないまま3年使う**こと。
Crumbling World の開発者は約3年かけて、Steamのウィッシュリストは約1,900に留まったと自ら書いている（[postmortem](https://danimarti.itch.io/crumbling-world/devlog/160435/crumbling-world-post-mortem-the-story-of-a-failure)）。

---

# 第1部 「面白いか」の検証手順（コストが安い順）

## L0. 自分で30日空けて遊び直す（0円 / 30分 + 待ち時間）

最も安い。作った直後は自分のバイアスが最大。
最低1週間、できれば1か月間ゲームを開かず、その後**メモを取りながら**通しで遊ぶ。
「ここは自分が仕様を知っているから遊べている」箇所を全部書き出す。

これは検証ではなく**検証の前処理**。これをやらないと、他人のテストで出る指摘の半分は自分でも気づけたものになり、貴重なテスターを浪費する。

## L1. 対面プレイテスト 5人（0円 / 準備1時間 + 1人30分 = 合計3.5時間）

**いちばん費用対効果が高い。これを飛ばして次に進んではいけない。**

### なぜ5人か

Jakob Nielsen の「5人でユーザビリティ問題の85%が見つかる」（2000年、Landauer との1993年の研究が基）が根拠（[Trymata](https://trymata.com/blog/5-user-rule-for-user-testing/), [UX Planet](https://uxplanet.org/sample-size-for-usability-study-part-1-about-nielsen-and-probability-efffecdbfa95)）。
ただし前提がある。**1人あたりの問題発見率31%を仮定した数字**であり、発見率が20%なら9人、10%なら18人必要（[出典](https://www.koji.so/blog/how-many-users-usability-testing-2026)）。

実務上の読み替え（**経験則**）:
- 「操作が分からない」「どこへ行けばいいか分からない」レベルの**明白な問題は5人で出尽くす**。
- 「面白くない」「飽きる」レベルの**体験の問題は5人では判断できない**。方向性の確信を得るには L3 の規模が要る。

### 誰に見せるか

- **友人・家族はダメ。** 彼らは「あなたに気を遣う」ため最も本音を言わない相手。「すごい！」しか返ってこないなら、それはあなたを気遣っている証拠（[gamedesignskills](https://gamedesignskills.com/game-design/playtest/), [Wayline](https://www.wayline.io/blog/how-to-conduct-game-playtesting-feedback-improvement)）。人は相手を傷つけたくないので、当たり障りのない肯定を返す（[Planet Smasher Games](https://planetsmashergames.com/gaslands-blog/playtesting-tabletop-games-advice/)）。
- **知らない人のほうがゲームフィールとメカニクスについて有効なフィードバックを返す**（[出典](https://gamedesignskills.com/game-design/playtest/)）。
- 現実的な調達先: 職場の同僚（あなたのゲーム開発を知らない人）、行きつけの店、地域のもくもく会、コワーキング、家族の**友人**（家族本人ではない）。
- 5人の内訳の目安（**経験則**）: アクションゲームを日常的に遊ぶ人2人、ゲームは遊ぶがアクションは苦手な人2人、ほとんど遊ばない人1人。

### 当日の進め方（そのままスクリプトとして使える）

**準備するもの**
- 遊べる状態のURL（ローカルでもよいが、スマホでも開けるURLだと圧倒的に楽）
- ストップウォッチ（スマホで可）
- 紙とペン（**PCでタイプすると顔を見られない**）
- 録画（画面＋できれば手元。相手に許可を取る）

**冒頭に言うこと（これだけ言って、あとは黙る）**

> 「これから10分くらいゲームを遊んでもらいます。テストしているのはあなたではなくゲームのほうなので、
> 詰まっても失敗しても全部こちらの責任です。遠慮なくつまらないと言ってください。
> 遊びながら、頭に浮かんだことを声に出し続けてもらえますか。『何これ』『たぶんこっち』『うわ』でいいです。
> 私は質問されても答えられないので、無視されたと思わずにいてください。」

最後の一文が肝。これが **think-aloud（発話思考法）**。プレイヤーが頭の中を話し、こちらは観察を「なぜそうなったか」で補完できる（[Cornell CS3152 Playtesting講義](https://www.cs.cornell.edu/courses/cs3152/2020sp/lectures/23-Playtesting.pdf), [Games User Research (Oxford Academic)](https://academic.oup.com/book/26677/chapter/195457270)）。
なお think-aloud にはゲーム特有の弱点がある。**しゃべらせると没入が壊れる**ため、「面白さ」そのものの評価は歪む（[出典](https://www.igi-global.com/article/playing-aloud/296705)）。
対策として、実況者のように振る舞ってもらう "Play Aloud" という手法が提案されている（[同上](https://www.researchgate.net/publication/363094488_Playing_Aloud_Leveraging_Game_Commentary_Culture_for_Playtesting)）。
**実務的な折衷（経験則）**: 1回目は黙って遊んでもらい（没入を壊さない）、2回目に同じ場所を発話しながら遊んでもらう。

**やってはいけないこと**
- 遊ぶ前に説明する（操作説明を含む）。**説明が要るなら、それがバグ**。
- 詰まっているときに助ける。**最低60秒は耐える**。助けた瞬間、そのデータは失われる。
- 「ここはこういう意図で」と言い訳する。テスト中は一切禁止。
- 画面ではなく相手の**顔と手**を見るのを忘れる。指がどのキーを探しているかが最大の情報。

**観察して記録する項目（テンプレ）**

```
被験者 #__  日付___  ゲーム歴: よく遊ぶ / たまに / ほぼ遊ばない
[  秒] 最初の入力までの時間
[  秒] 最初のジャンプまでの時間
[Y/N] 説明なしでショットを撃てたか（何秒後か: __秒）
[Y/N] 説明なしで2段ジャンプを発見したか（__秒）
[Y/N] チャージショットに気づいたか
最初に死んだ場所: ______  そのときの表情/発言: ______
60秒以上手が止まった場所: ______
声に出た否定語（「え」「なんで」「うわ」）の回数: __
プレイ総時間: __分  やめた理由: 自分でやめた / こちらが止めた
[Y/N] 止めずにいたらもう1回やっていた
```

### 遊び終わった後に聞くこと（順番厳守）

1. 「いま何をするゲームでしたか、一言で」 ← **これが答えられないならコンセプトが伝わっていない**
2. 「一番気持ちよかった瞬間はどこですか」
3. 「一番イラッとした瞬間はどこですか」
4. 「この続きがあったら遊びますか。**お金を払うとしたらいくらまでですか**」
5. 「友達に説明するとしたら何と言いますか」 ← **口コミの文面がそのまま手に入る**
6. （最後に）「言い残したことは」

### 聞いてはいけないこと

| ダメな質問 | なぜダメか | 代わりに |
|---|---|---|
| 「面白かったですか？」 | 目の前の作者に「いいえ」と言える人はほぼいない | 行動（続けたか）を見る |
| 「新しいジャンプの仕様どうでした？」 | 誘導的。設計者視点を押し付けている | 「移動やジャンプの操作感はどう感じましたか」（[出典](https://www.wayline.io/blog/effective-playtesting-strategies-indie-games)） |
| 「どんな機能が欲しいですか？」 | プレイヤーは解決策の設計者ではない。要望を鵜呑みにすると機能が膨らむ | 「どこで困りましたか」だけ聞き、解決策は自分で考える |
| 「難しすぎましたか？」 | Yes/No誘導。実際は「理不尽」と「難しい」を混同する | 「死んだとき、自分のミスだと思いましたか、それともゲームのせいだと思いましたか」 |

**原則: プレイヤーは「何を感じたか」の権威であり、「なぜそうなったか」「どう直すか」の権威ではない**（[出典](https://indiedevgames.com/game-playtesting-feedback-how-to-use-playtest-questions-effectively/)）。

### 合否判定（この段で先へ進んでよいライン）

**経験則**（出典なし。個人開発の実務判断として提案する）:
- 5人中4人が説明なしで最初の1分を越えられる → 操作は合格
- 5人中3人以上が「もう1回」を自発的に押す → **面白さの一次合格**
- 5人中3人以上が「一言でどんなゲームか」を**あなたの意図どおりに**言える → コンセプト合格

3つ目が落ちるのが一番多い。ここが落ちたら、機能を足すのではなく**フックを削って尖らせる**。

## L2. リモート・非同期プレイテスト（0円 / 投稿30分 + 返信対応数時間）

対面5人で明白な問題を潰した**後**にやる。順序を逆にすると、指摘の9割が既知の操作性バグで埋まる。

前提として、**ブラウザで即遊べる**ことが決定的に効く。itch.io の統計では、70パーセンタイルのゲームで約13,000ビューに対し、**ブラウザ版は37%が実際に遊ぶのに対し、ダウンロード専用は6%しか遊ばない**（[Benchmark: Itch.io traffic](https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/)）。HTML5であることはここで最大の武器になる。

### 2-a. itch.io に置く（30分）

- 無料・審査なし。HTML5をアップロードして「Play in browser」にできる。
- ただし**置いただけでは誰も来ない**。実例: あるデベロッパーの6本・1年半で累計ビュー611、ブラウザプレイ185（[itch.io フォーラム](https://itch.io/post/5704390)）。別の初作は1か月で1,364ブラウザプレイ、その後は平常時1日30〜50プレイ（[itch.io](https://itch.io/t/6770685/my-first-game-went-from-nobody-online-to-1364-browser-plays-in-a-month)）。
- **itch.io は「置き場所」であって「集客装置」ではない。** 集客は下の各チャネルでやる。

### 2-b. Reddit（0円 / 1投稿20分）

投稿先と規約（**投稿前に必ず各subのサイドバーとルールを読むこと**。ルールは変わる）:

| subreddit | 性質 | 注意 |
|---|---|---|
| **r/playmygame**（約109k） | 自己宣伝が前提の場。**無料で遊べること**が必須（[出典](https://mikeyoung.ghost.io/subreddits-you-can-use-to-talk-about-your-game/)） | 最も安全な第一候補 |
| **r/WebGames** | ブラウザゲーム専門 | **一定期間コミュニティに参加していないと自作投稿できないことがある**（[出典](https://dinogame.gg/blog/best-browser-game-subreddits/)）。先に1〜2週間、他人のゲームにコメントしてから |
| **r/IndieDev / r/IndieGaming / r/IndieGames** | 開発者・ファン層 | 開発者が多く、プレイヤー目線の反応は薄まる |
| **r/gamedev の Feedback Friday** | 相互フィードバックの定例スレ | **相互主義**。他人の3本に真面目な感想を書いてから自分を出す |

**実務のコツ**: 発見は投稿後24時間に集中し、その後は流れる。小規模開発者は「hot」では埋もれるので、見る側も出す側も **new** ソートを意識する（[出典](https://dinogame.gg/blog/best-browser-game-subreddits/)）。Redditユーザーは露骨な宣伝に敏感で反発する（[出典](https://mikeyoung.ghost.io/subreddits-you-can-use-to-talk-about-your-game/)）。

**そのまま使える r/playmygame 投稿文テンプレ（英語）**

```
Title: [WebGL] Shiba Run — a 2D action platformer where your dog double-jumps
       and charge-shoots. ~5 min, browser, no install.

Body:
Hi! Solo dev here. This is a small side-scrolling action game I've been
building in plain JavaScript + Canvas (no engine, no libraries).

Play in browser (free, ~5 min): <URL>

What I'd love feedback on, specifically:
1. Did you figure out the double jump and the charge shot without being told?
   If yes, roughly how long did it take?
2. Where did you die the first time, and did it feel fair?
3. Did you want to press restart after your first game over? Why / why not?

I'm not asking you to be nice — if it's boring, the most useful thing you can
tell me is exactly which second it got boring.

Controls: Arrow keys / A-D to move, Space to jump (again in air = double jump),
Z or X to shoot (hold to charge). Works on mobile too.
```

日本語で出す場合の投稿先: X（旧Twitter）の `#個人開発` `#インディーゲーム`、および後述の unityroom / 東京ゲームダンジョン。

### 2-c. Discord（0円 / 参加は無料、常駐コスト大）

プレイテスト目的のサーバが複数ある（[まとめ](https://www.gamineai.com/resources/game-development-discord-communities-2025), [DISBOARD の playtesting タグ](https://disboard.org/servers/tag/playtesting), [Discord Me の playtest タグ](https://discord.me/servers/tag/playtest)）。
規模の例: 最大級の gamedev 系サーバは30万人超、インディー特化で5万人超、フィードバック／プレイテスト特化で1.9万人規模（[出典](https://www.gamineai.com/resources/game-development-discord-communities-2025)）。
Game Tester（約4.1万人）は、開発中ゲームの詳細フィードバックに報酬を出す仕組み（[出典](https://discord.com/invite/gametester)）。

**注意（経験則）**: 開発者コミュニティのフィードバックは技術・設計論に寄りやすく、**一般プレイヤーの反応の代替にはならない**。バランス調整には効くが「売れるか」は測れない。

### 2-d. 日本のチャネル（ここが本命になりうる）

- **unityroom / unity1week**: ブラウザで遊べるWebGL形式の投稿サイトで、1週間ゲームジャムを定期開催。期間中の投稿作は**日曜20時に一斉公開**され、同時に多数のプレイヤーが回遊する（[unity1week](https://unityroom.com/unity1weeks)）。Unity製前提の枠組みだが、**投稿サイトとしてのunityroomはWebGLビルドの受け皿**。素のJS/CanvasのHTML5をそのまま置けるかは規約確認が要る（**要確認事項**）。置けない場合でも、一斉公開のタイミングに合わせてXで出すだけで回遊が増える（**推測**）。
- **東京ゲームダンジョン**: 個人・小規模チームのインディー展示会。**出展作品の審査がなく、申込は先着順**、出展料も手頃（[ファミ通の主催者インタビュー](https://www.famitsu.com/article/202502/33624), [公式](https://gamedungeon.jp/events/tokyo10)）。→ **対面で見知らぬ人が遊ぶ姿を1日で数十人分観察できる**。プレイテストとしての費用対効果が極めて高い。
- **デジゲー博**: 同種の同人・インディーゲーム展示会（[出展体験記](https://zenn.dev/haniwakun/articles/3a6d440e88897a)）。

**実務判断（推測）**: 日本語圏の個人開発小規模アクションなら、Reddit よりも **東京ゲームダンジョン級のイベント1回**のほうが、質・量ともに上のプレイテストデータが取れる可能性が高い。出展料と1日で済む。

### 2-e. ゲームジャム（0円 / 48〜72時間）

Ludum Dare は48時間ソロの Compo と72時間の Jam があり、**他人の作品を遊ぶとカルマが上がって自作が遊ばれる**相互プレイテスト機構が組み込まれている（[出典](https://respawn.outlookindia.com/gaming/gaming-guides/ultimate-game-jam-guide-join-learn-and-build-your-first-game), [Ludum Dare の歴史](https://dinogame.gg/blog/history-of-ludum-dare/)）。**「知らない人が確実に遊んでくれる」ことが保証された、ほぼ唯一の無料装置**。

ジャム発の商業化事例: Super Crate Box（Vlambeer）、McPixel、Goat Simulator（Coffee Stain）（[出典](https://dinogame.gg/blog/history-of-ludum-dare/)）。
一方で Crumbling World もゲームジャムで1位を取った作品を3年かけて商業化し、失敗している（[postmortem](https://danimarti.itch.io/crumbling-world/devlog/160435/crumbling-world-post-mortem-the-story-of-a-failure)）。
**教訓: ジャムでの高評価は「面白いか」の証拠にはなるが「売れるか」の証拠にはならない。**

## L3. 定量計測（0円 / 実装2〜6時間）

Web版であることを最大限に活かす。**誰がどこで辞めたかが自動で分かる**のは、DL販売では得られない優位。

### 何を計測するか（ファネル）

```
[起動]                       … ページを開いた
  ↓ 起動率
[プレイ開始]                 … スタート/最初の入力
  ↓ 離陸率（First Input Rate）
[チュートリアル/1面前半突破]  … 最初のギミックを越えた
  ↓
[初回ゲームオーバー]
  ↓ リトライ率  ★最重要
[2回目のプレイ開始]
  ↓
[1面クリア] → [ボス到達] → [ボス撃破] → [2面開始]
  ↓ 再訪率
[翌日以降の再訪（D1リテンション）]
```

**あわせて取る**
- セッション長（中央値。平均は外れ値に壊される）
- 死亡地点のヒートマップ: `stage, x, y, cause` をイベント送信するだけ。集計は後で。
- 各中間地点への到達率
- 離脱地点: 最後に送られたイベントの種類（＝そこで閉じた）

### 実装のしかた（このリポジトリでの現実解）

このプロジェクトは**外部ライブラリなし・ビルドツールなし**が方針なので、それを壊さない選択肢を挙げる。

1. **自前ログ（推奨・最小）**
   `navigator.sendBeacon('/e', JSON.stringify({t:'death', stage:1, x:1234, y:300, ms:Date.now()-t0}))` を数か所に置くだけ。
   受け側は `tools/serve.mjs` に POST エンドポイントを1本足して JSONL に追記すればよい（**この方式なら依存ゼロの方針を守れる**）。
   `sendBeacon` はページを閉じる瞬間でも送信される点が重要。
   注意: **replay-check のダイジェストに影響を与えないこと。** 計測コードは `step()` / `render()` の描画呼び出し列に一切触れてはいけない。スタブDOM側で `sendBeacon` を no-op にするのが安全（`CLAUDE.md` の「検証していない場所は壊れていても気づけない」に直結する）。
2. **プライバシー配慮型の既製ツール**
   - **GoatCounter**: オープンソース、無料のホスト版あり、ユニーク識別子を使わずGDPR通知不要をうたう（[公式](https://www.goatcounter.com/), [レビュー](https://privacytools.io/app/goatcounter)）
   - **Umami**: MITライセンス、セルフホスト可、クラウド無料枠は月100万イベント（[出典](https://analytics-alternatives.com/tools/umami/)）
   - **Plausible**: Cookieレス、EUホスト、同意バナー不要をうたう（[比較](https://openpanel.dev/articles/self-hosted-web-analytics)）
   これらは Cookie を使わず個人データを集めないため、一般に同意バナーの要件外とされる（[出典](https://openpanel.dev/articles/self-hosted-web-analytics)）。
   ただし**外部スクリプトを読み込む**ため、このプロジェクトの「外部依存なし」方針とは衝突する。**推奨は 1 の自前ログ**。

### プライバシー配慮の実務ルール（**法的助言ではない**）

- IPアドレスを保存しない（サーバ側で受け取ったら即捨てる、または保存前に破棄）
- Cookie / localStorage に識別子を置かない（セッション単位のランダムIDをメモリ上だけで使う）
- 送るのは `stage / x / y / 経過ms / イベント種別` のみ。**入力文字列やUAの詳細は送らない**
- ページに一行「このゲームは遊び方の統計（どこで死んだか等）を匿名で記録します。個人は特定しません。」と明記する
- 日本の個人情報保護法・GDPRの適用可否は**専門家に確認すること**（この文書では判断しない）

### 合格ラインの目安

**出典のあるもの（ただしモバイルゲーム基準。ブラウザ単発アクションへの外挿は要注意）**
| 指標 | 数値 | 出典 |
|---|---|---|
| D1リテンション 中央値 | 22.91% | [Mistplay ベンチマークまとめ](https://maf.ad/en/blog/mobile-game-retention-benchmarks/) |
| D1リテンション 目標 | 約30% | 同上 |
| D7リテンション | 4.2% | 同上 |
| D28リテンション | 0.85% | 同上 |
| セッション時間 中央値 | 4分45秒 | 同上 |
| チュートリアル完了率の見方 | 「70%完了」ではなく「ステップ3で12%が離脱」とステップ別に見る | [GameAnalytics ファネル](https://www.gameanalytics.com/blog/exploring-gaming-funnels) |
| 最初の5〜10分がD2リテンションを決める | Googleの調査として引用 | [Playio](https://blog.playio.co/mobile-game-onboarding-retention) |

**経験則（出典なし。この規模のブラウザアクション向けに提案する暫定ライン）**
| 指標 | 赤信号 | 黄 | 合格 |
|---|---|---|---|
| 離陸率（開いた人のうち実際に動かした割合） | <50% | 50-70% | **>70%** |
| 初回ゲームオーバー後のリトライ率 | <30% | 30-50% | **>50%** ← 最重要 |
| 1面クリア率 | <20% | 20-40% | **>40%** |
| セッション中央値 | <2分 | 2-5分 | **>5分** |
| 同日中の3回目プレイ到達率 | <10% | 10-20% | **>20%** |

**リトライ率を最重要にする理由**: 「面白い」の実体は「死んだ直後にもう一度押したくなること」であり、アンケートより行動のほうが嘘をつかない。アクションゲームでこれ以上に予測力のある単一指標は**推測だが**ない。

### サンプル数の下限

ファネルの数字を信じるには**最低100〜200プレイセッション**（**経験則**）。
参考として、ファイクドア／LPテストでは母数のブレが大きいため**300〜500ユニーク訪問**を目安にすべきとされる（[出典](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers)）。20人のデータで「リトライ率45%」と言ってはいけない。

---

# 第2部 「売れるか」の検証手順（コストが安い順）

## S0. 前提の確認：あなたのジャンルはそもそも売れるのか（0円 / 2時間）

**作る前に必ずやる。** これをやらずに進むのが最大の事故。

- 2025年にSteamで17,889本がリリースされ、**約半数がユーザーレビュー10件未満、約2,100本がレビュー0件**（[出典](https://www.steampageanalyzer.com/blog/indie-game-revenue-data)）。
- 約2万本のうち**100万ドル超を稼いだのは約300本**（[出典](https://www.steampageanalyzer.com/blog/indie-game-revenue-data)）。
- インディーの生涯販売本数の中央値は**500〜2,000本**。レビュー100件以上に達したものに限れば3,000〜10,000本（[同上](https://www.steampageanalyzer.com/blog/indie-game-revenue-data)）。
- **プラットフォーマーは「作りやすい」と思われているため著しく飽和しており**、よくできた作品でも5万本に届かないことがある。中央値の売上は $30,000〜$100,000 との推定（[Game Oracle](https://www.game-oracle.com/blog/2d-platformers-on-steam)。**単一ブログの推定値なので鵜呑みにしないこと**）。

**やること（明日できる）**
1. SteamDB / Steam のタグ検索で `Platformer` `2D Platformer` `Action` の**直近12か月のリリースを50本**リストにする。
2. 各本のレビュー数を記録し、中央値を出す。レビュー数×おおよその倍率で販売本数を粗く推定する（倍率はジャンル・価格で変わるので**参考値**として扱う）。
3. **レビュー数上位10本を実際に遊ぶ／トレーラーを見る。** 「なぜこれが売れたのか」を1本1行で書く。
4. その10本の理由リストに、自分のゲームが**1つも該当しないなら、フックが足りない**。

## S1. GIF・スクリーンショット1枚でSNSに出す（0円 / 30分）

**最も安い需要テスト。ただし解釈を誤りやすい。**

やること:
- ゲームの最も気持ちいい3〜5秒を GIF / 短尺動画にする（着地コンボ、チャージショットでボスを削る瞬間など）
- X / Bluesky / Mastodon に、**説明を最小限にして**投稿する
- 同じ素材を r/IndieDev、r/IndieGaming にも出す

**注意: いいね数は虚栄指標（vanity metric）である。**
Eric Ries が『リーン・スタートアップ』で定義した通り、活動量を測るだけで結果を測らず、操作しやすく、戦略判断に使えない（[出典](https://improvado.io/blog/what-is-a-vanity-metric)）。
インディーゲームでは「いいね・シェア・コメントは人為的に膨らませられ、売上やリテンションと必ずしも相関しない」と明言されている（[Wayline](https://www.wayline.io/blog/actionable-analytics-indie-game-success)）。

**だから、いいね数ではなく「クリック」を測る。**
投稿には必ずリンクを入れ、**リンクのクリック数／いいね数**を見る。
- いいね1,000・クリック5 → **見た目だけ良くて中身に興味を持たれていない**（危険信号）
- いいね80・クリック60 → **刺さっている**

閾値については、「GIFがX件のいいねを取れなければ諦めろ」という具体的数値基準の一次出典は**今回の調査では見つからなかった**。ネット上でよく語られるが検証できていない。**この数字を根拠に意思決定しないこと。** 代わりに上のクリック率で判断する（**経験則**）。

## S2. ランディングページ / フェイクドアテスト（0円〜 / 3時間）

作る前に「買いたい」の意思表示を集める。

**フェイクドアテストとは**: まだ存在しない製品・機能をあたかもあるように見せ、クリックした人に「近日公開」と伝えて登録を促す実験（[Learning Loop](https://learningloop.io/plays/fake-door-testing), [Evelance](https://evelance.io/blog/fake-door-testing-the-complete-guide/)）。

**ゲーム業界での実例**: Zynga は新作案を**5語のピッチ**にして既存ゲーム内のプロモリンクに差し込み、**クリック率でどの案に開発予算を出すかを決めていた**（[出典](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers)）。これは個人開発でもそのまま真似できる。

**明日できる手順**
1. GitHub Pages に1ページ作る（無料）。載せるのは以下だけ:
   - タイトル、5〜10語のフック（例:「柴犬が二段ジャンプでネコの軍団を蹴散らす30面の高速アクション」）
   - GIF 3枚（動きが分かるもの）
   - 価格（例: ¥600）を**明示する**
   - CTAボタン1つ:「発売のお知らせを受け取る」→ メール入力（またはX/Discordのフォロー）
2. S1 の SNS 投稿、Reddit、itch.io のプロフィールからこのページへ送る
3. **300〜500ユニーク訪問**を集めるまで判断しない（[出典](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers)）

**合格ライン**
| 指標 | 基準 | 出典 |
|---|---|---|
| メール登録率 | **5%以上で強い需要シグナル** | [CleverX](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers) |
| 主要CTAのコンバージョン | 100〜200訪問で25%以上なら強い需要 | 同上 |
| 判断に必要な母数 | 300〜500ユニーク訪問 | 同上 |

**倫理上の注意（重要）**: フェイクドアで**決済を実際に受け付けてはいけない**。「近日公開・お知らせ登録」までに留める。存在しない商品の代金を受け取るのは詐欺になりうる。

## S3. 30秒トレーラーを先に作る（0円〜 / 1〜2日）

「作る前にトレーラーを作る」を方法論として名付けた一次出典は**今回の調査では確認できなかった**（`gamedeveloper.com` にアクセスできず未確認）。
ただし関連する主張として、**トレーラーはゲームが完成していなくても機能を見せられる**という指摘がある（[出典](https://www.gamedeveloper.com/business/indie-game-indie-trailer-tips-for-making-a-trailer)）。

**実務としての価値（推測だが強く推奨）**:
30秒のトレーラーを先に編集すると、「見せ場が30秒分ない」ことに**開発初期に**気づける。
見せ場が15秒しか埋まらないなら、その企画には売る材料がない。**編集ソフト代0円、失う時間1日、避けられる損失1年。**

**やり方**
1. 現状のプロトタイプで撮れる最高の瞬間を全部録画する
2. 30秒に編集する（最初の3秒に一番強い絵を置く）
3. 埋まらなかった秒数をメモする ← **これが検証結果**
4. できたトレーラーを S1 / S2 の素材として使い回す

## S4. Steam「近日登場」ページを先に公開する（$100 / 1〜2日）

**ここからが本命の「売れるか」検証。** ウィッシュリストは、作る前に取れる**唯一の金銭に近いシグナル**。

### 費用と手順

- **Steam Direct 手数料は1アプリあたり $100 USD**。返金はされないが、**調整後総収益が $1,000 に達した後の支払いで回収される**（[Steamworks 公式](https://partner.steamgames.com/doc/gettingstarted/appfee)）。
- 新規開発者は**本人／法人確認と税務書類を含むデジタル手続き**が必要で、銀行口座開設に近い手間（[出典](https://ziva.sh/blogs/publish-game-steam)）。
- Valve のレビューは、設定が正しいか・ストアページの記述と一致するか・悪質なものが含まれないかを実際に遊んで確認し、**通常1〜2日**（[出典](https://www.gamedeveloper.com/business/valve-will-charge-devs-100-to-publish-games-through-steam-direct)）。

**基本コンセプトとジャンルが決まったら、できるだけ早く「近日登場」ページを出せ**というのが定説（[出典](https://www.immutable.com/resources/guides/how-to-grow-a-steam-game-2026)）。発売前は時間が味方で、ウィッシュリストを育てる期間が長いほどアルゴリズム上も有利で、試行回数も増える（同上）。

### 何を測るか

**ストアページ訪問 → ウィッシュリスト化率が、コンセプトの通信簿。**

| 指標 | ベンチマーク | 出典 |
|---|---|---|
| ページ訪問→ウィッシュリスト（発売前） | **中央値 8〜12%** | [Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks) |
| これを下回る | ページに具体的で直せる問題がある | 同上 |

**読み方（重要）**: 8%を下回るなら、問題は「ゲームが面白くない」ではなく **「カプセル画像・1行説明・GIFが仕事をしていない」**。ここは作り直しが安い。ゲーム本体を作り直す前に、必ずページを直す。

### ウィッシュリストの合格ライン

Chris Zukowski のローンチ基準（2026年6月更新版として引用されているもの）:

| ティア | ウィッシュリスト数 |
|---|---|
| Bronze | 5,000 |
| Silver | 8,000 |
| Gold | 50,000 |
| Diamond | 90,000 |

（[Steam Page Analyzer 経由の引用](https://www.steampageanalyzer.com/blog/how-many-wishlists-before-launch)。**一次出典は [howtomarketagame.com](https://howtomarketagame.com/2022/09/26/how-many-wishlists-should-i-have-when-i-launch-my-game/) だが本調査では直接アクセスできなかった。必ず一次を確認すること**）

その他の目安:
- **7,000ウィッシュリスト**が Popular Upcoming 入りと Next Fest の Gold ティアの境界とされてきた（[出典](https://www.steampageanalyzer.com/blog/how-many-wishlists-before-launch)）
- 商業的に真面目なリリースの**下限は5,000**、目標は7,000以上（[出典](https://steamforecast.app/guides/how-many-wishlists-before-steam-launch)）
- 1,000〜5,000の帯は「検証フェーズとして扱え」＝**利益は期待するな**（[出典](https://altheragames.com/en/blog/steam-wishlist-guide)）
- **注意: Valve が発売前の露出導線を静かに変更しており、閾値は上がっているとの報告がある**（[出典](https://www.pcguide.com/news/steams-new-100000-wishlist-rule-means-many-indie-devs-will-have-to-rely-on-a-different-feature-to-be-discovered/)）。**この数字は毎年確認し直すこと。**

### ウィッシュリスト → 売上の換算

| 期間 | 転換率（中央値） | 出典 |
|---|---|---|
| 発売初日 | 約5% | [Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks) |
| 発売1週間 | 約20〜22% | 同上 / [Steam Forecast](https://steamforecast.app/guides/steam-wishlist-conversion-rate) |
| 発売1か月 | 中央値 27% | [同上](https://steamforecast.app/guides/steam-wishlist-conversion-rate) |
| 1年 | 約60% | [Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks) |
| 生涯 | 20〜40% | 同上 |

価格帯による差: **$1〜$10 と無料は転換率が高く、$15〜$30 が最も悪い**（[出典](https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks)）。
→ **小規模初作を $5〜$8 に置くのは、この意味で理にかなっている。**

**逆算（このプロジェクトの現実的な試算・推測）**
```
価格 ¥800（約$5.5）、Valve 30%控除、初月転換率 22%
ウィッシュリスト 2,000 → 初月 約440本 → 粗収入 約35万円 → 手取り 約25万円（税前）
ウィッシュリスト 5,000 → 初月 約1,100本 → 粗収入 約88万円 → 手取り 約62万円（税前）
```
**判断基準**: 発売2か月前の時点でウィッシュリストが2,000に届いていないなら、**発売しないのではなく「これは商業的成功ではなく学習と実績のための出荷である」と定義し直す**。

### 途中で「やめる」判断ライン（**経験則**）

ページ公開後の初動で、**続行 / 縮小 / 中止**を決める:
- 公開1週目で**200ウィッシュリスト未満**、かつ訪問→WL率が8%未満 → **フック・ページの作り直し**（ゲームではなく見せ方の問題）
- 作り直して2回目も同じ → **企画そのものを縮小する。1年かけない。**

## S5. Steam Playtest（無料 / 半日）

- **開発者は無料で使える。** ストアページから**プレイテスト参加の申込を受け付け**、ゲームを公開せずにプライベートなキー配布ができる（[出典](https://start.playtestcloud.com/blog/steam-playtest-vs-playtesting-steam-games-at-playtestcloud)）。
- 設定は「ストアページ編集 → Special Settings タブ」で申込を有効化。公開すればストアに申込ボタンが出る。表示/非表示はいつでも切替可（[Steamworks 公式](https://partner.steamgames.com/doc/features/playtest)）。
- 申込者はキューに入り、**開発者が好きな人数だけ選んでテストに参加させられる**（同上）。

**Playtest と Demo の使い分け**（[出典](https://www.steampageanalyzer.com/blog/steam-playtest-vs-demo)）:
- **Playtest** = 管理された環境での反復と高品質なフィードバック
- **Demo** = 継続的な発見と広い露出。デモがあるとSteam上の露出面が増える
- 推奨は**順番に使う**: Playtest で調整 → Demo で露出

**このプロジェクトへの含意（推測）**: HTML5でブラウザ版が既にあるなら、**ブラウザ版そのものがデモの役割を果たせる**。Steamページから「ブラウザで今すぐ試す」に誘導するのは、Steamのデモ機構と併用できる強い武器。

## S6. Steam Next Fest（無料 / 準備1か月）

**一発勝負。デモは Next Fest に一度しか出せない**（[出典](https://gamedevproducer.com/posts/how-to-plan-a-game-demo-for-steam-next-fest/)）。

- 参加は**発売が近づいてから**。デモを遊んだ人の記憶が新しいうちに製品版を出すため（[出典](https://frownsmarketing.com/when-should-you-enter-your-indie-game-into-steam-next-fest/)）。
- **よくある失敗: Next Fest 開催に合わせてデモを初公開すること。** デモはフェス開始**前**に既に公開されているべき（[出典](https://opgamemarketing.substack.com/p/a-comprehensive-guide-to-mastering)）。
- 規模: 2026年6月開催は約5,000本のデモで過去最多、2026年2月は3,500本超（[出典](https://tech-insider.org/steam-next-fest-june-2026/)）。**埋もれる前提で設計する。**

**最重要の事実**: フェスで得られるウィッシュリストと**最も強く相関するのは「フェス開始前のウィッシュリスト数」**。2025年2月の208本の調査データで**Spearman相関 0.825**、**2,000ウィッシュリストのあたりに明確な変曲点**がある（[出典](https://ziva.sh/blogs/steam-next-fest-2026)）。

> **つまり Next Fest は増幅器であって発火装置ではない。0を増幅しても0。**
> 参加前に自力で2,000を作れていなければ、参加してもほとんど何も起きない。

- デモ→ウィッシュリスト転換率の目安は 15〜25%、20%なら健全（[出典](https://www.steampageanalyzer.com/blog/steam-next-fest-results)）。
- 参考上限: 2024年10月の Crashlands 2 は1週間で15,987、2026年2月の How Many Dudes? は14,740（[同上](https://www.steampageanalyzer.com/blog/steam-next-fest-results)）。

## S7. Web ポータルへのライセンス（別ルート / 交渉数週間）

**HTML5であることの固有の選択肢。Steam とは別の「売れるか」がここにある。**

- Poki / CrazyGames などのポータルは**SDKを組み込むと広告収益をレベニューシェア**する。取り分はおおむね**50〜80%**（[出典](https://app.cinevva.com/guides/web-game-monetization)）。
- CrazyGames は標準の分配率を公開していないが、**SDK実装・ゲーム内広告・他ポータルへの配信許諾・ローンチ時2か月の独占**を受け入れると**分配率が50%増える**インセンティブがある（[出典](https://app.cinevva.com/guides/publish-game-crazygames)）。支払いは Tipalti 経由で月次、**残高€100以上**で翌月10日を目安（同上）。
- レベニューシェアでなく**買い切りライセンス**もあり、**非独占で $300〜$800、独占で $5,000以上**が目安（[出典](https://dinogame.gg/blog/how-to-sell-browser-game-to-publisher/)）。
- 収益感: 大手ポータルでよく回るカジュアルゲームで**月 $200〜$2,000 が中間帯**（[出典](https://app.cinevva.com/guides/web-game-monetization)）。

**このルートの検証としての価値**: **ポータルに提出して受理されるかどうか自体が、市場からの査定**。しかも無料で、数週間で結果が出る。
**注意**: ポータルは「即座に楽しい」「セッションが短い」「モバイルで遊べる」ものを好む（**推測**）。ストーリーや長い習熟曲線は不利。柴犬ランのように短時間で完結するブラウザアクションは、この形に適合しやすい。

---

# 第3部 計測すべき指標と合格ライン（一覧）

## 面白いか

| 指標 | 合格ライン | 根拠 |
|---|---|---|
| 5人テストでの操作習得率 | 5人中4人が説明なしで1分突破 | **経験則** |
| コンセプト言語化率 | 5人中3人が意図どおりに一言で言える | **経験則** |
| 初回GO後リトライ率 | **50%以上** | **経験則**（最重要指標） |
| 離陸率（開いた→動かした） | 70%以上 | **経験則** |
| 1面クリア率 | 40%以上 | **経験則** |
| セッション中央値 | 5分以上 | 参考: モバイル中央値4分45秒 [出典](https://maf.ad/en/blog/mobile-game-retention-benchmarks/) |
| D1リテンション | 22.9%が中央値、30%が目標 | [出典](https://maf.ad/en/blog/mobile-game-retention-benchmarks/)（モバイル基準。外挿注意） |
| D7リテンション | 4.2%が中央値 | [同上](https://maf.ad/en/blog/mobile-game-retention-benchmarks/) |
| チュートリアル | ステップ別に離脱率を見る（総完了率では判断しない） | [GameAnalytics](https://www.gameanalytics.com/blog/exploring-gaming-funnels) |
| 判断に必要なセッション数 | 100〜200以上 | **経験則**（LPは300〜500 [出典](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers)） |

## 売れるか

| 指標 | 合格ライン | 根拠 |
|---|---|---|
| LPのメール登録率 | **5%以上で強いシグナル** | [CleverX](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers) |
| LP判断の母数 | 300〜500ユニーク訪問 | [同上](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers) |
| Steamページ 訪問→WL率 | **8〜12%が中央値。下回るならページの問題** | [Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks) |
| 発売時WL 商業的下限 | 5,000 | [Steam Forecast](https://steamforecast.app/guides/how-many-wishlists-before-launch) |
| 発売時WL 損益分岐帯 | 7,000 | [Steam Page Analyzer](https://www.steampageanalyzer.com/blog/how-many-wishlists-before-launch) |
| WL 1,000〜5,000 | 「検証フェーズ」と割り切る帯 | [Althera](https://altheragames.com/en/blog/steam-wishlist-guide) |
| WL→売上（1週） | 20〜22% | [Steam Forecast](https://steamforecast.app/guides/steam-wishlist-conversion-rate) |
| WL→売上（1か月） | 中央値27% | [同上](https://steamforecast.app/guides/steam-wishlist-conversion-rate) |
| Next Fest 参加の前提 | **開始前に2,000WL**（変曲点） | [Ziva](https://ziva.sh/blogs/steam-next-fest-2026) |
| デモ→WL転換 | 15〜25%（20%で健全） | [Steam Page Analyzer](https://www.steampageanalyzer.com/blog/steam-next-fest-results) |
| itch.io ブラウザ版のプレイ率 | ビューの37%（DL専用は6%） | [howtomarketagame](https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/) |
| SNS投稿 | いいね数ではなく**クリック数／いいね数**を見る | [Wayline](https://www.wayline.io/blog/actionable-analytics-indie-game-success) |

---

# 第4部 失敗パターン集

## F1. 作りすぎてから気づく

- **Crumbling World**: ゲームジャムで1位を取ったメカニクスを約3年かけて商業化。SNSでの観客形成を試みたが**Steamウィッシュリストは約1,900に留まった**（[postmortem](https://danimarti.itch.io/crumbling-world/devlog/160435/crumbling-world-post-mortem-the-story-of-a-failure)）。
- **Immortal Darkness: Curse of The Pale King**: 2018年10月に自主リリース。**誰も知らず、誰も気にせず、確かめようとする人すらいなかった**（[出典](https://www.gamedeveloper.com/business/the-cure-for-indie-game-failure)）。
- 構造として: **インディーは数年かけて数十万ドル相当の時間を投じ、それから世に出して名声と収益を願う**（[同上](https://www.gamedeveloper.com/business/the-cure-for-indie-game-failure)）。順序が逆。
- **初作に何年もかけるのは典型的な失敗**。スキルが上がるたびに過去の作業が陳腐に見え、スコープが動く標的になり続ける（[出典](https://gamedev.net/news/game-dev-mistake-spending-years-developing-your-first-game-r4488/)）。

**対策**: 「売れるか」の検証（S2〜S4）を、開発時間の**累計200時間**を超える前に必ず一度通す（**経験則**）。

## F2. 検証を誤読する

| 誤読 | 何が起きているか | 対策 |
|---|---|---|
| 友人・家族の「面白い！」を信じる | 彼らはあなたを気遣っている。最も本音を言わない相手（[出典](https://gamedesignskills.com/game-design/playtest/)） | 知らない人だけを一次データにする |
| いいね数を需要と読む | 虚栄指標。活動量を測るだけで結果を測らない（[Eric Ries](https://improvado.io/blog/what-is-a-vanity-metric)）。いいねは操作可能で売上・リテンションと必ずしも相関しない（[Wayline](https://www.wayline.io/blog/actionable-analytics-indie-game-success)） | クリック数・登録数・WL数だけを見る |
| 開発者コミュニティの好評を市場と読む | 開発者は技術と設計に反応する。買う人ではない | 一般プレイヤー枠を必ず混ぜる |
| Next Fest に賭ける | フェスの成果は**参加前のWL数と相関0.825**（[出典](https://ziva.sh/blogs/steam-next-fest-2026)）。増幅器であって発火装置ではない | 参加前に2,000WLを自力で作る |
| WLの急増を売上と読む | ウィッシュリストの急増が比例した売上に結びつくとは限らない（[出典](https://b3daily.com/2025/10/25/how-indie-game-wishlists-on-steam-predict-success-trends-from-2024-2025)） | 転換率（1週22%等）で換算してから判断 |
| 少人数のファネル数字を信じる | 小標本では転換率が大きく振れる（[出典](https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers)） | 母数の下限（100〜200セッション／300〜500訪問）を守る |
| プレイヤーの要望をそのまま実装する | プレイヤーは「何を感じたか」の権威だが「どう直すか」の権威ではない（[出典](https://indiedevgames.com/game-playtesting-feedback-how-to-use-playtest-questions-effectively/)） | 症状だけ受け取り、処方は自分でする |
| 5人テストで「面白さ」を判定する | 5人=85%は**問題発見率31%を仮定した数字**。発見率が低い問題（＝面白さ）には20人近く要る（[出典](https://www.koji.so/blog/how-many-users-usability-testing-2026)） | 5人はUX、面白さの判断は定量ログで |
| itch.io に置いたのに反応がない＝つまらない、と読む | itch.io は置き場所であって集客装置ではない。累計ビュー611・プレイ185という実例がある（[出典](https://itch.io/post/5704390)） | トラフィックを自分で連れてくるまで判定しない |

## F3. 検証のバイアス（自分側）

- **「ここは説明すれば分かる」**: 説明が要る＝欠陥。テスト中に説明した時点でそのデータは死ぬ。
- **「今日のテスターはたまたま下手だった」**: 5人中3人が同じ場所で詰まったら、それは仕様。
- **「もっと作り込めば伝わる」**: フックが伝わらない問題は、量では解決しない。
- **一度一致したことを不変条件の証明として扱う**（このリポジトリの `CLAUDE.md` にある教訓と同じ構造）: 一度いい数字が出たことを恒久的な証拠にしない。

## F4. ジャンル選択の失敗

プラットフォーマーは「作りやすい」という認識ゆえに著しく飽和しており、**よくできた作品にきちんとしたマーケティングを付けても5万本に届かないことがある**（[Game Oracle](https://www.game-oracle.com/blog/2d-platformers-on-steam)）。
→ **対策は「やめる」ことではなく、「一言で言えるフック」を持つこと。** S0 の10本分析で「なぜ売れたか」の理由リストを作り、自作が1つも該当しないなら企画を作り直す。

---

# 第5部 個人開発 初回タイトルの推奨検証プラン

前提: 平日夜と週末で**週10〜15時間**使える個人開発者。既にプロトタイプ（＝現在の柴犬ラン）がある状態から始める。

## Week 1 — 面白いかの一次検証（合計 8〜10時間）

| # | やること | 時間 | 完了条件 |
|---|---|---|---|
| 1 | S0: 競合50本のレビュー数調査 + 上位10本の「なぜ売れたか」1行メモ | 2h | 10行のリストがある |
| 2 | ブラウザで遊べるURLを用意（itch.io か GitHub Pages） | 1h | スマホで開いて遊べる |
| 3 | 計測を仕込む（`sendBeacon` + `serve.mjs` にPOST 1本 / または静的ホストなら簡易ログ） | 3h | 死亡地点・セッション長・リトライがJSONLに落ちる。**replay-check のダイジェストが1文字も変わらないこと** |
| 4 | 対面プレイテスト 5人（1人30分、テンプレで記録） | 3h | 記録シート5枚 |

**Week 1 のゲート**: リトライ率と「一言で言えるか」。3人以上が意図どおりに言えないなら Week 2 を**フックの作り直し**に充てる。

## Week 2 — 売れるかの一次検証（合計 8〜10時間）

| # | やること | 時間 | 完了条件 |
|---|---|---|---|
| 5 | 30秒トレーラーを編集する（S3） | 4h | **埋まらなかった秒数を記録する** |
| 6 | GIF 3枚を作る（着地コンボ / チャージ / ボス） | 1h | 各3〜5秒 |
| 7 | ランディングページ（GitHub Pages）+ メール登録（S2） | 2h | 価格明示・CTA1つ |
| 8 | r/playmygame に投稿（上のテンプレ）+ X に GIF 投稿 | 1h | クリック数を計測 |
| 9 | Discord のプレイテスト系サーバ2つに参加、他人3本に感想を書く | 2h | 相互主義の下準備 |

**Week 2 のゲート**: LPの登録率。訪問300を集めて5%未満なら、**フックかビジュアルの問題**。ゲーム本体を触る前にここを直す。

## Week 3〜4 — 増幅と反復（合計 20時間）

| # | やること | 時間 |
|---|---|---|
| 10 | Week 1〜2 の指摘のうち「3人以上が同じことを言った」ものだけ直す | 10h |
| 11 | r/WebGames 用にコミュニティ参加を進める（他人の投稿にコメント） | 2h |
| 12 | 100〜200セッションぶんの定量ログを集めて、離脱地点を1枚のヒートマップにする | 4h |
| 13 | 離脱が集中する箇所を1つだけ直し、A/B的に前後で比較 | 4h |

**Week 4 のゲート**: リトライ率50%を超えたか。超えないなら**フェーズ2（本開発）に進んではいけない。**

## Month 2 — 商業判断（合計 20〜30時間）

| # | やること | 時間 | 費用 |
|---|---|---|---|
| 14 | 意思決定: Steam（買い切り）／Webポータル（広告レベニューシェア）／両方 | 2h | 0 |
| 15 | Steam Direct に登録、本人確認・税務書類を出す（時間がかかるので早めに） | 4h + 待ち | **$100**（$1,000収益後に回収） |
| 16 | Steam「近日登場」ページを作って公開（カプセル・GIF・1行説明を全力で） | 8h | 0 |
| 17 | Steam Playtest の申込を有効化（Special Settings） | 1h | 0 |
| 18 | 並行して CrazyGames / Poki に提出（受理されるか自体が査定） | 4h | 0 |
| 19 | ページ公開後4週間、訪問→WL率を毎週記録 | 2h | 0 |

**Month 2 のゲート**:
- 訪問→WL率 **8%以上** → ページは合格。集客に注力する
- 8%未満 → **カプセルと1行説明を作り直す。2回やってダメなら企画を縮小する**

## Month 3〜 — 本開発 or 撤退

| WL 4週目の到達点 | 判断 |
|---|---|
| 1,000以上 | 本開発へ。発売までに5,000を目標にする |
| 300〜1,000 | 進めてよいが、**「商業的成功」ではなく「実績・レビュー・学習」を目的に再定義**する。スコープを削って早く出す |
| 300未満 | **企画を変える。** ただし**出すこと自体はやる**（下記） |

---

# 第6部 「小さく出し切る」ことの価値

## なぜ初作は小さくすべきか

- 初作は**3〜6か月で完成できる規模**に絞り、「出荷のライフサイクル全体」を学ぶべき（[StraySpark](https://www.strayspark.studio/blog/how-long-does-it-take-to-make-an-indie-game)）。itch.io規模の小品はフルタイムで1〜3か月（同上）。
- 初作が失敗する最大の理由は**スコープ過大**。数年かけると、スキルが上がるたびに過去の作業が陳腐化し、スコープが動く標的になる（[StraySpark](https://www.strayspark.studio/blog/how-long-does-it-take-to-make-an-indie-game), [GameDev.net](https://gamedev.net/news/game-dev-mistake-spending-years-developing-your-first-game-r4488/)）。
- **磨き上げた2時間のゲームのほうが、完成しない大作より多くを教える**（[StraySpark](https://www.strayspark.studio/blog/how-long-does-it-take-to-make-an-indie-game)）。
- 初リリースは完璧さより、**「完成させられる」「パイプラインを作れる」「製造の現実を生き延びられる」ことの証明**（同上）。
- うまくいく開発者は速い人ではなく、**初日の計画が現実と一致していて、作りながら売り、完成できる規模で出した人**（同上）。

## 初作を小さくすることで実際に学べること（＝2作目の資産）

出すまで絶対に分からない、コードと無関係の実務。

| 領域 | 具体的に何が起きるか | 出典 |
|---|---|---|
| **審査** | Valve が実際に遊んで、設定・ストア記述との一致・悪質性を確認する。通常1〜2日 | [出典](https://www.gamedeveloper.com/business/valve-will-charge-devs-100-to-publish-games-through-steam-direct) |
| **登録・法務** | 本人／法人確認と税務書類。銀行口座開設に近い手続き | [出典](https://ziva.sh/blogs/publish-game-steam) |
| **費用回収** | Steam Direct の $100 は返金不可だが、調整後総収益 $1,000 到達後の支払いで回収され、月次レポートに別項目で表示される | [Steamworks 公式](https://partner.steamgames.com/doc/gettingstarted/appfee) |
| **ストア運用** | カプセル、タグ、説明文、更新告知、セール参加。これは**作った後にしか練習できない** | **経験則** |
| **サポート・返金** | Steam の返金ポリシー、バグ報告、レビュー欄での対応。**プレイ時間が短い小品は返金されやすい**（推測） | **推測** |
| **レビューの実績** | レビュー数はSteam上の可視性に直結する。2025年に出た約17,889本のうち約半数はレビュー10件未満、約2,100本はゼロ | [出典](https://www.steampageanalyzer.com/blog/indie-game-revenue-data) |
| **税務** | 米国源泉徴収の扱い、日本の確定申告、消費税。**専門家に確認すること**（この文書では判断しない） | — |

## ジャム発の小品が商業化した事例

Super Crate Box（Vlambeer）、McPixel、Goat Simulator（Coffee Stain Studios）はいずれも Ludum Dare 型のジャム作品から始まった（[出典](https://dinogame.gg/blog/history-of-ludum-dare/)）。
共通するのは、**「小さくて変なもの」を先に出し、反応があったものだけ拡張した**という順序。

**裏側の事例も忘れないこと**: Crumbling World も同じくジャムで1位を取った作品を拡張したが、3年かけてWL約1,900だった（[postmortem](https://danimarti.itch.io/crumbling-world/devlog/160435/crumbling-world-post-mortem-the-story-of-a-failure)）。
**差は「拡張する前に売れるかを測ったかどうか」**（**推測**）。

## 柴犬ランへの具体的な適用（提案）

現状は1面・2面とボス、面セレクト、セーブ、ポーズ、ミュートが動いている。**すでに「出せる」水準に近い。**

**推奨する形**:
1. **3〜5面で打ち止めにして、無料のブラウザ版を先に出し切る**（itch.io + 自サイト）。これで実績・レビュー・トラフィック・計測データが手に入る。
2. 同時に **Steam「近日登場」ページ**を出し、訪問→WL率を測る。ブラウザ版を「今すぐ試す」導線として使う。
3. 並行して **CrazyGames / Poki に提出**。受理されればそれ自体が市場からの査定であり、月$200〜$2,000帯の収益が見える可能性がある（[出典](https://app.cinevva.com/guides/web-game-monetization)）。
4. WLが伸びた場合のみ、**面数・ボス・演出を足して有料版**にする。伸びなければ、無料ブラウザ版のまま「1本出し切った」実績として畳んで2作目へ。

**この形の利点**: どのゲートで落ちても**必ず「完成して出した1本」が残る**。撤退が撤退にならない。

---

# 出典URL一覧

## プレイテスト手法
- Jakob Nielsen の5人ルール — https://trymata.com/blog/5-user-rule-for-user-testing/
- 5人ルールの数学的前提（発見率31%） — https://uxplanet.org/sample-size-for-usability-study-part-1-about-nielsen-and-probability-efffecdbfa95
- 5人ルールの限界（20%なら9人、10%なら18人） — https://www.koji.so/blog/how-many-users-usability-testing-2026
- 実務的なプレイテスト（友人・家族の偏り、知らない人が有効） — https://gamedesignskills.com/game-design/playtest/
- プレイテストでのフィードバック収集 — https://www.wayline.io/blog/how-to-conduct-game-playtesting-feedback-improvement
- 社会的バイアスと当たり障りのない肯定 — https://planetsmashergames.com/gaslands-blog/playtesting-tabletop-games-advice/
- 誘導質問を避ける／効果的な質問設計 — https://www.wayline.io/blog/effective-playtesting-strategies-indie-games
- プレイヤーは「何を感じたか」の権威 — https://indiedevgames.com/game-playtesting-feedback-how-to-use-playtest-questions-effectively/
- インディー向けプレイテスト6ステップ — https://www.gamedeveloper.com/programming/6-steps-to-a-successful-playtesting-process-for-an-indie-developer
- Cornell CS3152 Playtesting 講義資料 — https://www.cs.cornell.edu/courses/cs3152/2020sp/lectures/23-Playtesting.pdf
- The think-aloud protocol（Games User Research, Oxford Academic） — https://academic.oup.com/book/26677/chapter/195457270
- Playing Aloud（think-aloud の没入問題と代替手法） — https://www.igi-global.com/article/playing-aloud/296705 / https://www.researchgate.net/publication/363094488_Playing_Aloud_Leveraging_Game_Commentary_Culture_for_Playtesting

## リモートプレイテスト・コミュニティ
- 自作ゲームを出せる subreddit 一覧（r/playmygame は無料で遊べることが必須） — https://mikeyoung.ghost.io/subreddits-you-can-use-to-talk-about-your-game/
- ブラウザゲーム向け subreddit（r/WebGames の参加歴要件、new ソート、初日24時間） — https://dinogame.gg/blog/best-browser-game-subreddits/
- フィードバックが得られる subreddit のキュレーション — https://medium.com/@anulagarwal12/i-curated-a-list-of-subreddits-that-can-provide-feedback-on-your-game-here-you-go-2cec9ac66e7d
- ゲーム開発 Discord コミュニティ一覧（規模の記載あり） — https://www.gamineai.com/resources/game-development-discord-communities-2025
- DISBOARD playtesting タグ — https://disboard.org/servers/tag/playtesting
- Discord Me playtest タグ — https://discord.me/servers/tag/playtest
- Game Tester Discord — https://discord.com/invite/gametester
- ゲームデザイン／開発 Discord 15選 — https://gamedesignskills.com/game-design/discord-servers/

## ゲームジャム
- ゲームジャム入門（Ludum Dare の Compo/Jam、カルマによる相互プレイテスト） — https://respawn.outlookindia.com/gaming/gaming-guides/ultimate-game-jam-guide-join-learn-and-build-your-first-game
- Ludum Dare の歴史とジャム発の商業化事例 — https://dinogame.gg/blog/history-of-ludum-dare/

## 日本のチャネル
- Unity 1週間ゲームジャム（unityroom、日曜20時一斉公開） — https://unityroom.com/unity1weeks
- 東京ゲームダンジョン 主催者インタビュー（審査なし・先着順） — https://www.famitsu.com/article/202502/33624
- 東京ゲームダンジョン 公式 — https://gamedungeon.jp/events/tokyo10
- 東京ゲームダンジョン 出展体験記 — https://zenn.dev/haniwakun/articles/3a6d440e88897a
- 個人ゲーム開発者の投稿先プラットフォーム比較 — https://jaygameblog.com/platform/

## 計測・分析
- ゲームのファネル分析（ステップ別に見る） — https://www.gameanalytics.com/blog/exploring-gaming-funnels
- モバイルゲームのリテンションベンチマーク（D1 22.91%、D7 4.2%、セッション4分45秒） — https://maf.ad/en/blog/mobile-game-retention-benchmarks/
- 初回セッションとFTUE（最初の5〜10分がD2を決める） — https://blog.playio.co/mobile-game-onboarding-retention
- GoatCounter 公式 — https://www.goatcounter.com/
- GoatCounter レビュー — https://privacytools.io/app/goatcounter
- Umami（MITライセンス、無料枠 月100万イベント） — https://analytics-alternatives.com/tools/umami/
- セルフホスト型分析ツール比較（Cookieレス、同意バナー不要） — https://openpanel.dev/articles/self-hosted-web-analytics

## 需要検証・フェイクドア
- 発売前需要テスト（Zyngaの5語ピッチ、5%登録率、300〜500訪問） — https://cleverx.com/blog/pre-launch-demand-testing-with-real-buyers
- フェイクドアテストとは — https://learningloop.io/plays/fake-door-testing
- フェイクドアテスト完全ガイド — https://evelance.io/blog/fake-door-testing-the-complete-guide/
- ランディングページ・スモークテスト — https://help.glidr.io/en/articles/1648431-landing-page-smoke-test
- 虚栄指標（Eric Ries の定義） — https://improvado.io/blog/what-is-a-vanity-metric
- インディーゲームにおける虚栄指標 — https://www.wayline.io/blog/actionable-analytics-indie-game-success
- インディーゲームマーケティング生存ガイド — https://www.wayline.io/blog/indie-game-marketing-survival-guide

## Steam
- Steam Direct 手数料（$100、$1,000到達後に回収） — https://partner.steamgames.com/doc/gettingstarted/appfee
- Steam Direct 手数料の解説とレビュー期間（1〜2日） — https://www.gamedeveloper.com/business/valve-will-charge-devs-100-to-publish-games-through-steam-direct
- Steam公開の実費・手続き（本人確認・税務書類） — https://ziva.sh/blogs/publish-game-steam
- Steam Playtest 公式ドキュメント — https://partner.steamgames.com/doc/features/playtest
- Steam Playtest の使い方（無料、キュー、キー配布） — https://start.playtestcloud.com/blog/steam-playtest-vs-playtesting-steam-games-at-playtestcloud
- Steam Playtest と Demo の使い分け — https://www.steampageanalyzer.com/blog/steam-playtest-vs-demo
- Steam ストアページの転換率ベンチマーク（訪問→WL 8〜12%、WL→売上） — https://www.steampageanalyzer.com/blog/steam-store-page-conversion-benchmarks
- 発売時ウィッシュリスト数のベンチマーク（Zukowski のティア、7,000の閾値） — https://www.steampageanalyzer.com/blog/how-many-wishlists-before-launch
- 発売時ウィッシュリストの下限（5,000） — https://steamforecast.app/guides/how-many-wishlists-before-steam-launch
- ウィッシュリスト→売上転換率（1週22%、1か月27%） — https://steamforecast.app/guides/steam-wishlist-conversion-rate
- ウィッシュリスト戦略（1,000〜5,000は検証フェーズ） — https://altheragames.com/en/blog/steam-wishlist-guide
- Steam ページを早く出す理由 — https://www.immutable.com/resources/guides/how-to-grow-a-steam-game-2026
- Valve の発売前露出導線の変更 — https://www.pcguide.com/news/steams-new-100000-wishlist-rule-means-many-indie-devs-will-have-to-rely-on-a-different-feature-to-be-discovered/
- （一次出典・要確認）How Many Wishlists Should I Have When I Launch — https://howtomarketagame.com/2022/09/26/how-many-wishlists-should-i-have-when-i-launch-my-game/

## Steam Next Fest
- Next Fest のデータ分析（相関0.825、2,000WLの変曲点） — https://ziva.sh/blogs/steam-next-fest-2026
- Next Fest の実績（デモ→WL 15〜25%、事例数値） — https://www.steampageanalyzer.com/blog/steam-next-fest-results
- Next Fest 2026年6月の規模（約5,000デモ） — https://tech-insider.org/steam-next-fest-june-2026/
- Next Fest のデモ計画（参加は一度きり） — https://gamedevproducer.com/posts/how-to-plan-a-game-demo-for-steam-next-fest/
- Next Fest の参加時期 — https://frownsmarketing.com/when-should-you-enter-your-indie-game-into-steam-next-fest/
- Next Fest 攻略（デモを当日初公開しない） — https://opgamemarketing.substack.com/p/a-comprehensive-guide-to-mastering
- Unity による Next Fest のヒント — https://unity.com/blog/steam-next-fest-developer-tips-unity

## 市場・売上データ
- インディーゲーム収益データ（2025年17,889本、レビュー10件未満が約半数、中央値500〜2,000本） — https://www.steampageanalyzer.com/blog/indie-game-revenue-data
- 2Dプラットフォーマーの収益性（飽和、中央値$30k〜$100k） — https://www.game-oracle.com/blog/2d-platformers-on-steam
- ウィッシュリストが成功を予測するか（急増が売上に比例しない） — https://b3daily.com/2025/10/25/how-indie-game-wishlists-on-steam-predict-success-trends-from-2024-2025

## itch.io / Webポータル
- itch.io トラフィックのベンチマーク（70パーセンタイル13,000ビュー、ブラウザ37% / DL 6%） — https://howtomarketagame.com/2025/05/12/benchmark-itch-io-traffic/
- itch.io 初作の実績（1か月1,364ブラウザプレイ） — https://itch.io/t/6770685/my-first-game-went-from-nobody-online-to-1364-browser-plays-in-a-month
- itch.io 小規模開発者の実データ — https://itch.io/post/5704390
- Webゲームの収益化データ（レベニューシェア50〜80%、月$200〜$2,000） — https://app.cinevva.com/guides/web-game-monetization
- CrazyGames 開発者ガイド（独占2か月で分配率+50%、€100から支払い） — https://app.cinevva.com/guides/publish-game-crazygames
- ブラウザゲームのパブリッシャーへの売り方（非独占$300〜$800、独占$5,000以上） — https://dinogame.gg/blog/how-to-sell-browser-game-to-publisher/
- ポータルへのライセンス — https://www.abratabia.com/web-game-monetization/licensing-to-portals.php

## 失敗事例・ポストモーテム
- Crumbling World Post-Mortem: The Story of a Failure（3年、WL約1,900） — https://danimarti.itch.io/crumbling-world/devlog/160435/crumbling-world-post-mortem-the-story-of-a-failure
- The cure for indie game failure（Immortal Darkness、数年投じてから世に出す構造） — https://www.gamedeveloper.com/business/the-cure-for-indie-game-failure
- 初作に何年もかける失敗 — https://gamedev.net/news/game-dev-mistake-spending-years-developing-your-first-game-r4488/
- 2年間のインディーポストモーテム — https://www.valadria.com/my-2-year-indie-postmortem/
- 失敗ポストモーテム集 — https://danbruno.net/notes/games/failure-postmortems/

## 小さく出す
- インディーゲームの制作期間の実数（初作は3〜6か月、小品は1〜3か月） — https://www.strayspark.studio/blog/how-long-does-it-take-to-make-an-indie-game
- 初作のブートストラップ（予算・スコープ・生存） — https://game-wisdom.com/general/bootstrapping-first-indie-game-budgeting-scope-survival-tips
- インディーにリーンスタートアップを適用する — https://empowered.gg/blog/how-to-apply-the-lean-startup-principles-to-video-game-development-for-indie-developers/

## トレーラー
- インディーゲームトレーラーのヒント（完成前でも機能を見せられる） — https://www.gamedeveloper.com/business/indie-game-indie-trailer-tips-for-making-a-trailer
- インディーゲームトレーラー作成ガイド — https://www.gamedeveloper.com/business/a-quick-guide-to-making-indie-game-trailers

---

## 未解決・要追加調査

1. **「GIFのいいね数がN件未満なら諦めろ」の一次出典**が見つからなかった。よく語られるが検証できていない。
2. **`howtomarketagame.com` の Zukowski ティア（5,000/8,000/50,000/90,000）を一次で確認**すること。本文では二次引用に頼っている。
3. **Steam の発売前露出（Popular Upcoming）の現行閾値**。2026年に変更があったとの報道があり、7,000という数字は既に古い可能性がある。
4. **unityroom に素のHTML5（非Unity）を投稿できるか**の規約確認。
5. **日本の個人開発者向けの税務・法務**（米国源泉徴収、確定申告、消費税、特定商取引法表示）。専門家への確認が必要で、この文書では扱っていない。
