# フェーズ0（発案・市場調査 / Discovery）の実務ガイド

対象: 初めての商業ゲーム開発を始める個人開発者
調査日: 2026-08-13

---

## この文書の結論（3〜5行）

1. **フェーズ0の本質は「作るかどうかを決める」ではなく「早く安く殺す」こと。** Supercell は10年で30本以上を殺し、Voodoo は年約1,000本のプロトタイプから約4本しか本launchしない（[Voodoo/DoF](https://www.deconstructoroffun.com/blog/2024/6/3/voodoos-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years), [Supercell graveyard](https://cellstring.com/news/article/30-killed-games-the-secret-history-of-supercells-graveyard)）。
2. **成果物は「ワンシート1枚」で十分。** 100ページのGDDは死に、多くのチームはプリプロを1ページで始めてプロトタイプが証明した分だけ書き足す（[Game Developer](https://www.gamedeveloper.com/design/how-to-write-a-game-design-document), [MCV](https://mcvuk.com/development-news/death-of-the-game-design-document/)）。
3. **ゲートの判定は「スコア表」ではなく「実際に遊ばせた結果」で下す。** スコアリングを提唱した本人が「スプレッドシート予測は実績と相関しなかった、無価値かむしろ有害」と書いている（[Melnick](https://lloydmelnick.com/2019/02/26/building-an-analytic-driven-greenlight-process/)）。
4. **個人開発なら圧縮して合計3〜6週間。** 市場調査3日 → ワンシート半日 → 紙プロト2日 → 動くコアループ1〜2週 → 他人テスト3日 → 判定、を1ループとして2〜3周回す。
5. **今回のケースで最大のリスクは「ジャンル選択」。** プラットフォーマーはSteamで売れにくい部類として名指しされている（[Zukowski](https://howtomarketagame.com/)）。柴犬ランを商業化するなら、ここを最初のゲートで直視すること。

---

## 注記: この調査の方法と限界

この環境ではネットワークegressプロキシにより **WebFetch（ページ全文取得）がほぼ全ドメインでブロックされた**（gdcvault.com, supercell.com, oreilly.com, wikipedia.org 等すべて403）。
そのため本文の記述は **検索エンジンが返した抜粋テキスト** に基づいている。URLは併記してあるが、
**一次ページの全文照合ができていない項目がある。** 特に以下は原典を各自で確認してほしい:

- Scott Rogers『Level Up!』のワンシート／テンプレート項目（書籍本体）
- Adam Saltsman の GDC 2016 講演（[GDC Vault](https://www.gdcvault.com/play/1023532/Deciding-What-to-Make-A) / [YouTube](https://www.youtube.com/watch?v=PYpHbuF08Mk)）
- Alexia Mandeville のグリーンライトテンプレート（[Medium](https://alexiamandeville.medium.com/pitch-your-game-with-this-greenlight-template-47ecd919734a)）

筆者の推測・意見には **［推測］** と明記した。それ以外は出典に基づく。

---

## 1. フェーズ0の標準フロー図

業界の公開情報を統合したもの。**ゲート（G）で落ちたら、その案は捨てて上流のループに戻る。**

```
                       ┌───────────────────────────────────────────┐
                       │            [ループA] 発散と収束             │
                       ↓                                           │
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │
  │ S0 制約の確定 │──▶│ S1 市場調査   │──▶│ S2 アイデア出し│──────────┘
  │ 期間/予算/    │   │ ジャンル・競合 │   │ 大量に出す     │
  │ 技術/自分の型 │   │ 需要のある棚   │   │ (20〜100案)   │
  └──────────────┘   └──────────────┘   └──────┬───────┘
                                                │
                                                ↓
                                        ┌───────────────┐
                                        │ S3 一次フィルタ │
                                        │ 制約×市場で篩う │
                                        └───────┬───────┘
                                                │ 残 3〜5案
                                    ┌───── G1: コンセプト・ゲート ─────┐
                                    │ 1文で言えるか / 誰が買うか /      │
                                    │ 自分の期間で作れるか              │
                                    └───────┬──────────────────────┘
                                            │ 残 1〜3案
                                            ↓
                       ┌────────────────────────────────────────┐
                       │       [ループB] コンセプト検証            │
                       ↓                                        │
                ┌──────────────┐   ┌──────────────┐   ┌────────┴─────┐
                │ S4 ワンシート  │──▶│ S5 紙/最小プロト│──▶│ S6 他人に      │
                │ +ハイコンセプト│   │  コアループのみ │   │  遊ばせる      │
                │ +偽トレーラー  │   │  (数日〜2週)   │   │  (5〜10人)    │
                └──────────────┘   └──────────────┘   └────────┬─────┘
                                                                │
                                    ┌───── G2: FUNゲート ────────┘
                                    │ 「面白い」が見つかったか       │
                                    │ = 言わなくても遊び続けるか     │
                                    └───────┬───────────────────┘
                                            │ 通過
                                            ↓
                                  ┌──────────────────┐
                                  │ S7 マーケット検証  │
                                  │ 見た目だけで需要を  │
                                  │ 測る(広告/ストア/  │
                                  │ SNS/トレーラー)    │
                                  └────────┬─────────┘
                                           │
                               ┌─── G3: グリーンライト ───┐
                               │ 作る価値 × 売れる見込み  │
                               │ × 完走できる規模          │
                               └────────┬──────────────┘
                                        │ 通過
                                        ↓
                              ┌────────────────────┐
                              │ フェーズ1 プリプロ    │
                              │ (縦切り/vertical     │
                              │  slice へ)          │
                              └────────────────────┘

  ▼ 落ちたときの戻り先
    G1で落ちる → S2 へ（アイデアを出し直す。1案に固執しない）
    G2で落ちる → S4 へ（同じ素材で別のコアループを試す）or S2 へ（案ごと捨てる）
    G3で落ちる → S1 へ（市場の読みが外れている。ジャンル/観客から見直す）
```

### この図の根拠

- 伝統的な7段階（concept, prototype, greenlight, pre-production, production, live ops, post-production）が
  Develop / Deploy / Grow の3段階に収束しつつあり、**prototype と greenlight はほぼ融合している**
  という報告がある（[GDC 2026 参加記](https://www.invisiblefriends.net/gdc-2026-a-personal-account/)）。
  つまり「プロトタイプを作ってから承認」ではなく「プロトタイプが承認そのもの」。上図の G2/G3 はこれを反映している。
- グリーンライトとは正式には「制作費を承認し、開発フェーズからプリプロダクションへ進ませる許可」を指す（[Wikipedia: Greenlight](https://en.wikipedia.org/wiki/Greenlight), [Pre-production](https://en.wikipedia.org/wiki/Pre-production)）。
- Supercell には **マネジメントによるグリーンライト手続きが存在しない。** マイルストーン会議で財務に
  プロジェクトの存在を正当化する場もなく、チームが自分でキルを決める（[Game Developer](https://www.gamedeveloper.com/business/less-management-more-success-inside-supercell-s-upside-down-organization)）。
  ［推測］個人開発者にとってはこちらのほうが素直なモデル。承認者が自分しかいない以上、
  必要なのは「承認の儀式」ではなく「自分を止める仕掛け」である。

---

## 2. 各ステップの詳細表

### S0 制約の確定

| 項目 | 内容 |
|---|---|
| **入力** | 自分の可処分時間、貯金、技術スタック、既存資産（柴犬ランのコード等） |
| **作業** | 「使える月数」「使える金額」「絶対にやらないこと」を数字で紙に書く。撤退ラインを先に決める |
| **成果物** | 制約シート（1/4ページ） |
| **次に進む条件** | 期間・予算・撤退ラインが数字で書けている |
| **やめる条件** | （このステップに「やめる」はない。書けないなら書けるまで進まない） |

根拠: Saltsman の GDC 講演は「仕事を辞め貯金を全部つぎ込み、既に市場にある他のインディーゲームに
似た見た目のゲームを作り、金が尽きて選択肢がなくなる」悪夢のシナリオから始まる
（[Game Developer](https://www.gamedeveloper.com/business/finji-s-adam-saltsman-tips-for-deciding-which-game-ideas-to-pursue)）。
制約を先に固定するのは、この悪夢に入らないための最初の防波堤。

---

### S1 市場調査（棚を選ぶ）

| 項目 | 内容 |
|---|---|
| **入力** | 制約シート |
| **作業** | ①販売プラットフォームを決める ②そこで健全な需要があるジャンル（タグ）を調べる ③そのジャンルの直近1〜2年の実売上位・中位・下位を各5本ずつ実際に触る ④「棚」を1つ選ぶ |
| **成果物** | ジャンル選定メモ（1ページ）: 選んだタグ3〜5個、競合10本の一覧、価格帯、レビュー数分布 |
| **次に進む条件** | 「この棚の客は誰で、その客が今何を買っているか」を口頭で説明できる |
| **やめる条件** | 選んだ棚に、自分の制約内で作れるサイズの成功例が1本もない |

根拠:
- **ジャンル選択は最大のマーケティング判断。** ジャンルを決めることは観客と潜在顧客を決めること。
  売れるジャンル（roguelike deckbuilder, sandbox, simulator）と売れないジャンル（**puzzle, platformer**）がある
  （[Chris Zukowski / How To Market A Game](https://howtomarketagame.com/), [Game Developer Podcast](https://www.gamedeveloper.com/marketing/game-developer-podcast-36-indie-marketing-advice-from-chris-zukowski)）。
- ストアページを出す前に**競合のタグを調べた開発者は、直感でタグ付けした開発者より "More Like This" への
  配置が明確に良い**と報告している（[presskit.gg Steam Tags Strategy](https://presskit.gg/field-guides/steam-tags-strategy)）。
- 出版社はジャンルで「予測可能なレーン」を組んでおり、良いゲームでも自社戦略に合わなければ見送る
  （[The Mind Studios](https://games.themindstudios.com/post/pitching-your-game/)）。

⚠️ **柴犬ランに直結する話**: 横スクロールアクション＝platformer は上記で「売れにくい」側に名指しされている。
［推測］これは「作るな」ではなく「platformer 単体では棚がない。何と掛け合わせて別の棚に置くかを
S2 で解く必要がある」という意味に読むべき。例: platformer × roguelite、platformer × automation、
platformer × 育成シム。棚を変えれば同じ操作感を売れる場所に持ち込める。

---

### S2 アイデア出し（発散）

| 項目 | 内容 |
|---|---|
| **入力** | ジャンル選定メモ |
| **作業** | 制約を満たす案を **数を目標にして** 出す。1案1行。評価は一切しない（発散と収束を混ぜない） |
| **成果物** | アイデアリスト 20〜100行 |
| **次に進む条件** | 目標本数に到達した |
| **やめる条件** | （なし。数が出ないのは棚の理解が浅いサイン。S1に戻る） |

**何本出すのが標準か（実データ）**

| 主体 | 出す数 | 残す数 | 出典 |
|---|---|---|---|
| Voodoo | 常時約100本のプロトタイプが進行、年間約1,000本テスト | フルローンチ **約0.4%（年4本）**、うちヒット1本 | [DoF](https://www.deconstructoroffun.com/blog/2024/6/3/voodoos-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years) / [Voodoo](https://voodoo.io/news/voodoo-s-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years) |
| Double Fine (Amnesia Fortnight 2017) | 公開ピッチ **25案** | 投票上位2本 + Schafer選1本 + 社員選1本 = **4本**をプロトタイプ化 | [Wikipedia](https://en.wikipedia.org/wiki/Amnesia_Fortnight_2017) / [Double Fine](https://www.doublefine.com/games/amnesia-fortnight) |
| Supercell | 小チーム（2〜15人）が並行して試作 | 10年で **30本以上をキル** | [esportsinsider](https://esportsinsider.com/every-game-supercell-killed) / [CellString](https://cellstring.com/news/article/30-killed-games-the-secret-history-of-supercells-graveyard) |

［推測］個人開発者がこの比率をそのまま真似るのは不可能。ただし **「1本目に思いついた案をそのまま作る」
のは業界のどの実践とも一致しない。** 最低でも 20案出して 3案に絞り、2案をプロトタイプ化する程度の
発散は現実的で、かつフェーズ0の趣旨（安く殺す）を満たす。

---

### S3 一次フィルタ（収束）

| 項目 | 内容 |
|---|---|
| **入力** | アイデアリスト |
| **作業** | 各案を3軸で○/△/× 判定。× が1つでもあれば即落とす |
| **成果物** | 残り3〜5案 |
| **次に進む条件** | 3〜5案に絞れた |
| **やめる条件** | 全案が × → S1 に戻る（棚か制約が間違っている） |

**3軸（三重ベン図）**: 「自分が作れるゲーム」×「自分が遊びたいゲーム」×「人が買うゲーム」
（[Wayline](https://www.wayline.io/blog/how-to-prototype-game-ideas-quickly-validation-strategies)）。

**より厳密にやるなら Schell の8フィルタ**（本来は「完成」の判定基準だが、S3でも軽く通せる）:
1. Artistic Impulse — このゲームは正しいと感じるか
2. Demographics — 想定した客層が十分に好むか
3. Experience Design — よく設計されたゲームか
4. Innovation — 十分に新しいか
5. Business & Marketing — 売れるか
6. Engineering — 技術的に作れるか
7. Social/Community — 社会的・コミュニティ的な目標を満たすか
8. Playtesting — プレイテスターが十分に楽しんでいるか

「8つ全部を**変更を要求されずに**通ったときだけ完成と呼べる」
（[Schell Games](https://schellgames.com/blog/lens-of-the-eight-filters), [artificials.ch Lens #15](https://artificials.ch/lens-15-the-lens-of-the-eight-filters/)）。

---

### G1: コンセプト・ゲート

| 項目 | 内容 |
|---|---|
| **入力** | 残り3〜5案 |
| **判定** | 下記チェックリスト（第5章 G1）を通す |
| **成果物** | 残り1〜3案 + 落とした理由の記録 |
| **次に進む条件** | 1文で説明でき、客が特定でき、制約内で作れる |
| **やめる条件** | 3案とも通らない → S2 へ |

---

### S4 ワンシート + ハイコンセプト + 偽トレーラー

| 項目 | 内容 |
|---|---|
| **入力** | 残った案 |
| **作業** | ①ハイコンセプト1文を書く ②ワンシート1枚を書く（第3章のテンプレート）③**発売時のプレスリリース／トレーラー台本を先に書く** |
| **成果物** | ワンシート1枚、ハイコンセプト1文、偽プレスリリース1枚 |
| **次に進む条件** | 他人に見せて「それ遊びたい」と言われる |
| **やめる条件** | プレスリリースが魅力的に書けない |

**「先にプレスリリースを書く」= Amazon の Working Backwards / PR-FAQ。**
まだ存在しない製品のプレスリリースを先に書き、**魅力的に書けないならその製品は作る価値がない**と判断する。
Kindle, Prime, AWS, Alexa がこの方式で作られた
（[Working Backwards](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/),
[ProductPlan](https://www.productplan.com/glossary/working-backward-amazon-method),
[Product Strategy](https://productstrategy.co/working-backwards-the-amazon-prfaq-for-product-innovation/)）。
ゲームでも、架空のローンチ・プレスリリースを書くことで
「潜在顧客に本当に伝えるべきことは何か」に焦点が絞れると報告されている（同上の記事群）。

［推測］個人開発における「トレーラー先行」の実践的な最小形は
**「30秒トレーラーの絵コンテを12コマ描く」**。12コマ埋まらない＝見せ場が12個ない＝
トレーラーが作れない＝売れない、という早期の警報になる。

---

### S5 紙プロト / 最小プロト

| 項目 | 内容 |
|---|---|
| **入力** | ワンシート |
| **作業** | **紙・鉛筆から始める。** コアループだけを検証。見た目・音・メニュー・タイトル画面は一切作らない |
| **成果物** | 遊べる最小物（紙 or 動くもの） |
| **次に進む条件** | 自分が「もう1回」を無意識に押す |
| **やめる条件** | 期限（例: 2週間）を超えても「もう1回」が来ない |

根拠:
- 物理プロトタイプは **最速・最安の手法**であり、設計プロセスの最初期に
  **技術やプログラミングではなくゲームプレイに集中できる**（Tracy Fullerton『Game Design Workshop』
  [Taylor & Francis 第9章](https://www.taylorfrancis.com/chapters/mono/10.1201/9781003460268-9/prototyping-tracy-fullerton),
  [Game Developer 抜粋](https://www.gamedeveloper.com/design/book-excerpt-game-design-workshop)）。
- **最低忠実度＝紙と鉛筆から始めよ。** レベルをスケッチし、メカニクスをカードで作り、
  友人と手で回す。技術的障壁なしにアイデアを核まで蒸留せざるを得なくなる
  （[Wayline](https://www.wayline.io/blog/how-to-prototype-game-ideas-quickly-validation-strategies)）。
- 目的は磨いたデモを作ることではなく **仮説を検証すること**。速度と学習を完成度より優先する（同上）。
- 「磨きすぎたプロトタイプの罠」— 完成度がインディーの革新を殺す（[Wayline](https://www.wayline.io/blog/polished-prototype-trap-indie-game-innovation)）。
- Riot は R&D を「選択肢を探索し **fun を見つける** 開発フェーズ」と定義している
  （[Riot: Project L /dev](https://www.riotgames.com/en/news/project-l-dev-finding-our-game)）。

**Schell の The Rule of the Loop**: 「設計をテストして改善する回数が多いほど、ゲームは良くなる」
（[CIRCA](https://circa.cs.ualberta.ca/index.php/CIRCA:The_Art_of_Game_Design_-_Jesse_Schell)）。
つまり S5→S6 は**1周の質より周回数**で効く。

---

### S6 他人に遊ばせる

| 項目 | 内容 |
|---|---|
| **入力** | 最小プロト |
| **作業** | **友人ではなく他人** 5〜10人に、説明せずに渡す。横で黙って観察する。話しかけない |
| **成果物** | 観察ログ（詰まった箇所、手が止まった秒数、自発的に再挑戦した回数） |
| **次に進む条件** | G2 を通過 |
| **やめる条件** | 全員が指示なしでは2周目に行かない |

根拠: **真に検証するには友人ではなく他人の入力が要る。** 他人のほうがコアメカニクスについて
正直な批判をくれる（[Wayline](https://www.wayline.io/blog/how-to-prototype-game-ideas-quickly-validation-strategies),
[Stackademic](https://blog.stackademic.com/how-can-a-game-developer-validate-their-ideas-to-create-a-successful-first-indie-game-e0d55da458da)）。
プレイテストは「気持ちよく遊べるゲームを作るための最も強力な道具のひとつ」であり、
**fun をより早く見つける**ためのもの（[Riot](https://www.riotgames.com/en/playtest)）。

Supercell の対応物が **"company playable"**（社内全員が遊べる状態にするマイルストーン）。
**ゲームが殺されるのはたいていこのマイルストーンの後**（[Game Developer](https://www.gamedeveloper.com/design/maybe-it-s-time-to-kill-your-game-and-move-on-supercell-on-cutting-its-losses)）。
Supercell の第2フェーズは「ラフプロトを実際に遊べるゲームにし、少人数の社員を招いて遊ばせ
フィードバックを得る」と説明されている（[case study](https://www.casehero.com/supercell/) — 二次資料、要注意）。

---

### G2: FUN ゲート

| 項目 | 内容 |
|---|---|
| **判定** | 第5章 G2 のチェックリスト |
| **次に進む条件** | 指示なしの再挑戦が観察できた |
| **やめる条件** | 出ない。**このゲートは甘くしてはいけない** |

**Supercell の判断ルール（フェーズ0で最も重要な引用）**:
> ゲームがうまくいかなそう、あるいは十分に面白くないと感じ始めたら、それは**すでにキルしているべきだった**というサイン
> （[Supercell 10 Learnings](https://supercell.com/en/news/10-learnings-10-years/)）

> 指標も会話には出てくるが、**決定は最終的には経験ある少人数チームの直感に帰着する**
> （[Game Developer](https://www.gamedeveloper.com/design/maybe-it-s-time-to-kill-your-game-and-move-on-supercell-on-cutting-its-losses)）

> 6人が6ヶ月で作ったものを償却するほうが、100人が18ヶ月かけたものより
> **心理的にも経済的にも楽**（同上）

Supercell はキル判断を **シャンパンで祝う**（[Corporate Rebels](https://www.corporate-rebels.com/blog/failure-sessions-supercell)）。
［推測］個人開発でこれを再現する最小形は「殺した案をリストに残し、日付と理由を書く」こと。
殺した数が増えることを成果として数える。

---

### S7 マーケット検証（見た目だけで需要を測る）

| 項目 | 内容 |
|---|---|
| **入力** | FUNゲートを通ったコアループ、ワンシート、絵コンテ |
| **作業** | ゲーム本体を作らずに需要を測る。①ストアページ（またはランディングページ）を出す ②30秒トレーラーを作る ③SNS/コミュニティに出して反応を測る ④可能なら少額の広告でCTRを測る |
| **成果物** | 需要の数字（ウィッシュリスト数、CTR、メール登録数、動画のインプレッション対保存率など） |
| **次に進む条件** | G3 |
| **やめる条件** | 数字が同ジャンルのベンチマークを大きく下回る |

**参考ベンチマーク（PC/Steamの場合）**

| 指標 | 数字 | 出典 |
|---|---|---|
| Popular Upcoming 入り / Next Fest の Gold 下限 | **7,000 ウィッシュリスト** | [presskit.gg](https://presskit.gg/field-guides/how-many-wishlists-to-launch) |
| Next Fest 1回の成果: Gold | 7,000〜10,000 WL / Diamond は 10,000+ | [同上](https://presskit.gg/field-guides/how-many-wishlists-to-launch) |
| Next Fest 参加時に WL 1,000 未満だったゲームの新規獲得 | **中央値 462**、Diamond 到達は1本もなし | [How To Market A Game](https://howtomarketagame.com/2025/03/26/benchmarks-how-many-wishlists-can-i-get-from-steam-next-fest/) |

→ **Next Fest は既存の勢いを増幅するだけで、ゼロから需要を作らない**（同上）。
［推測］したがって S7 は「Next Fest に出せば何とかなる」の反証として使うべきステップ。
最初の1,000WLを自力で作れないコンセプトは、イベントでも救われない。

**モバイル/カジュアルの場合（CPIテスト）**

| 指標 | 数字 | 出典 |
|---|---|---|
| プロトタイプ検証で最重要の指標 | **CPI**（コンセプトの「訴求力」を反映） | [Supersonic](https://supersonic.com/learn/blog/the-3-most-important-kpis-for-testing-your-hyper-casual-prototype) |
| CPI 目標 | **$0.30 未満**（ZeptoLab の社内目標も同水準） | [同上](https://supersonic.com/learn/blog/the-3-most-important-kpis-for-testing-your-hyper-casual-prototype) |
| かつての固定ハードル | D1 55% / D7 22% / CPI < $0.25 | [GameAnalytics](https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis) |
| 現在の Voodoo の立場 | 上記の固定ハードルは**近視眼的**とみなす。リテンション・プレイ時間・勝率・ゲーム長・深化余地／CPI・CTR・ニッチ制約を複合で見る | [同上](https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis) |
| Homa の実例 | Zombie Defense は CPI が通常のHCシューターより高かったが、セッション長・課金上位層の見込み・D30/D60/D90 が良く継続。**もはやCPIではなくLTVが判断軸** | [Homa](https://www.homagames.com/games/how-to-evolve-a-hypercasual-game-into-a-hybridcasual-success) |

---

### G3: グリーンライト

| 項目 | 内容 |
|---|---|
| **判定** | 第5章 G3 のチェックリスト |
| **成果物** | 「作る」宣言 + 撤退条件の文書化 + スケジュール |
| **次に進む条件** | 全項目 YES |
| **やめる条件** | 1項目でも NO |

出版社に持ち込む場合、彼らが見るのは
**説得力あるビジョン / 磨かれたプロトタイプ / 現実的な財務 / 競合ベンチマーク / 信頼できるチーム**
（[The Mind Studios](https://games.themindstudios.com/post/pitching-your-game/)）。
決め手は **「5分・10分を超えて広がるビジョン」** であり、以前より磨かれた概念実証が要る（同上）。
また **オーディエンスの証拠**（Steamウィッシュリスト、デモのリテンション、コミュニティの成長、
トレーラーのエンゲージメント）がリスクを下げる（同上）。

---

## 3. ワンシートのテンプレート（そのまま使える項目リスト）

複数ソースを統合した実用版。**A4で1枚に収める。はみ出したら削る。**

### ヘッダ（5行以内）

```
□ タイトル（できればロゴ）
□ 連絡先
□ ハイコンセプト1文（第4章の型で書く）
□ ジャンル / タグ（Steam等のタグを3〜5個そのまま）
□ 対象プラットフォーム
□ 対象客層（年齢・既プレイ作品で書く。「幅広い層」は禁止）
□ 対象レーティング（CERO / ESRB）
□ 想定発売時期
□ 想定価格
```

### 本体

```
□ サマリ（3〜5行）— 何をするゲームか。動詞で書く
□ コアループ（箇条書き3〜5ステップ）— 「〜する → 〜が起きる → 〜が増える → 最初に戻る」
□ ユニーク・セリング・ポイント（USP）3つ — 他作品にない要素だけ。「面白い」はUSPではない
□ プレイヤーができるクールなこと 3〜5個 — 具体的な動詞で
□ 世界観・トーン・美術の方向（3行 + 参考画像2〜3枚）
□ 物語（あるなら）— 発端・中盤・結末（最低でも引き）を各1行
□ 競合作品 3〜5本 — 実タイトル名。「うちはここが違う」を各1行
□ 想定収益モデル（買い切り / F2P / DLC）
□ 規模と期間 — 想定プレイ時間、開発期間、必要な人数
□ リスク3つと、それをどう潰すか
```

### 出典と根拠

- **一枚もの一般構成**: Game Title / Platform / Genre / Summary / Game Features
  （[財務モデル系まとめ](https://financialmodelslab.com/products/indie-game-development-studio-one-page-business-plan)）。
  より詳細版では「名前とコアコンセプト（何がすごいか、エレベーターピッチ、USP）／コアゲームプレイループ
  （コアシステムとメカニクス）／ストーリーと主要プロット／ムード・トーン・美学／市場訴求力とターゲット層」
  （[The Design Lab](https://thedesignlab.blog/2025/04/28/writing-a-1-pager-concept-document-for-your-game-idea/),
  [Narrative Design](https://www.narrativedesign.net/p/write-one-page-game-design-document)）。
- **Scott Rogers『Level Up!』のワンシート**: 可能なら画像を入れ、タイトル（できればロゴ）と連絡先、
  対象プラットフォーム、対象客層、対象レーティング、想定出荷時期を入れる。
  物語（発端・中盤・結末、最低でも引き）を舞台・登場人物・葛藤に触れつつ書き、
  ゲームプレイの簡潔な説明と「プレイヤーができるクールなこと」を書く。
  ESRBレーティング、ユニーク・セリング・ポイント、競合製品も扱われる。
  **様式より中身が重要**で、目的はチームと管理者の目線合わせだけでなく、
  経営・マーケ・営業・ライセンサーに渡して**わくわくさせる**こと
  （[O'Reilly: The One-Sheet Sample](https://www.oreilly.com/library/view/level-up-the/9780470688670/ch18.html),
  [2nd ed. Bonus Level 1](https://www.oreilly.com/library/view/level-up-the/9781118877197/xhtml/24_9781118877166-bapp01.xhtml)）。
- **ワンシートの合格ライン**: 「誰が見ても **30秒以内に** ゲームの本質を掴める程度まで
  ビジョンを圧縮したもの」（[Press Start Leadership](https://pressstartleadership.com/from-one-sheet-to-pitch-deck-and-beyond-building-game-pitches-that-land-deals/)）。

### ワンシートからピッチデッキへ展開するときの対応表

必要になったときだけ作る（[Press Start Leadership](https://pressstartleadership.com/from-one-sheet-to-pitch-deck-and-beyond-building-game-pitches-that-land-deals/)）:

| スライド | 中身 |
|---|---|
| Title | ゲーム名、スタジオ名/ロゴ、タグライン |
| Vision | エレベーターピッチと高レベルのビジョン |
| Overview | 概要 |
| Gameplay | コアメカニクス、ゲームループ、進行システム |
| Features | 特徴 |
| Visual Style | ムードボード、キーアート、UIサンプル |
| Team | チーム |
| Business | 収益化、マーケ、プラットフォーム計画（必要なら） |

### GDDはどこまで書くか

**結論: フェーズ0では書かない。ワンシートで止める。**

- 「100ページのバインダは死んだ」が「何も書くな」ではない。**形式が変わっただけで必要性は消えていない**
  （[Game Developer](https://www.gamedeveloper.com/design/how-to-write-a-game-design-document),
  [MCV/DEVELOP](https://mcvuk.com/development-news/death-of-the-game-design-document/)）。
- **多くのチームはプリプロダクションを1ページの文書で始め、
  プロトタイプでゲームが自らを証明するにつれて詳細を足していく**
  （[Game Developer](https://www.gamedeveloper.com/design/how-to-write-a-game-design-document)）。
- 初期の文書は最小限に保ち、複数ページを書き直す羽目にならないよう1ページに収め、そこから育てる
  （[Nuclino](https://www.nuclino.com/articles/game-design-document-template)）。
- 中間形式として Scott Rogers の **ten-pager**（1ページ1テーマの10ページ）がある。
  Page1 Title Page / 2 Game Outline / 3 Character / 4 Gameplay / 5 Game World / 6 Game Experience /
  7 Gameplay Mechanics / 8 Enemies / 9 Multiplayer and Bonus Materials / 10 Monetization。
  「大まかな筆致でゲームの背骨を敷く」文書で、細部に立ち入らず基本を素早く理解させるのが意図
  （[Packt: Writing the GDD, Step 2: The Ten-Pager](https://www.packtpub.com/en-us/product/level-up-the-guide-to-great-video-game-design-second-edition-9781118877166/chapter/note-12/section/writing-the-gdd-step-2-the-ten-pager-ch12lvl1sec37),
  [O'Reilly: The Ten-Page Design Document Sample](https://www.oreilly.com/library/view/level-up-the/9780470688670/ch19.html)）。
  ［推測］個人開発なら **G3を通過した後**、プリプロの入口で ten-pager を書くのが妥当な折衷点。
  フェーズ0で書くのは早すぎる（まだ何が残るか分からないため）。

---

## 4. ハイコンセプト文の型と良い例・悪い例

### 定義

ハイコンセプトとは「簡潔に述べた前提でピッチできる作品」のこと。
**掴みやすいアイデアを届けるがゆえに、広い客層に売りやすいと見なされる**
（[Wikipedia: High concept](https://en.wikipedia.org/wiki/High_concept)）。
極端な例は『Snakes on a Plane』『Sharknado』のように**タイトルが前提のすべてを説明している**もの（同上）。

### 型1: 「X meets Y」（比較タイトル型）

比較タイトル形式 'X meets Y' はエレベーターピッチの一般的な手法
（[Curtis Brown Creative](https://www.curtisbrowncreative.co.uk/blog/how-to-write-your-elevator-pitch)）。
例: 「スコットランドの島を舞台にした、インド版『Succession』meets アガサ・クリスティ」（同上）。

```
【Xの既知性】meets【Yの既知性】+【舞台/ひねり】
```

注意: X も Y も**相手が確実に知っている**作品でなければ機能しない。
また X と Y が近すぎると情報量ゼロになる。

### 型2: 「What if 〜?」（前提提示型）

『Jurassic Park』=「恐竜を生き返らせたら何が起きるか」、
『Twilight』=「10代の少女が吸血鬼に恋したら」
（[Jessica Payne](https://jessicapayne.substack.com/p/the-secret-to-why-twilight-worked)）。

```
もし【異常な前提】だったら、【主人公】は【何をする羽目になるか】？
```

### 型3: 「動詞 + 対象 + ひねり」（ゲーム向け）

［推測］映画と違いゲームは**プレイヤーの動詞**が売り物なので、ゲームでは以下が最も機能する。

```
【誰】として【何をする】ゲーム。ただし【一行のひねり】。
```

ひねりの部分が **USPそのもの**でなければならない。

### 良い例・悪い例

以下の「例」は筆者が本文書のために作成したもの（実在作品のピッチ文の引用ではない）。
判定基準は上記出典に沿う。

| 判定 | 例文 | 理由 |
|---|---|---|
| ✕ | 「かわいい柴犬が走る、爽快な横スクロールアクション」 | 動詞が「走る」だけ。ひねりがない。競合と区別できない。「爽快」は主観で検証不能 |
| ✕ | 「誰でも楽しめる、やり込み要素満載のアクションゲーム」 | 客が特定できない。「誰でも」は「誰にも刺さらない」と同義。［推測］ |
| ✕ | 「新感覚のパルクールアクション」 | 「新感覚」は情報がゼロ。何が新しいか一語も言っていない |
| △ | 「Celeste meets どうぶつの森」 | 型としては正しいが、2作の接合面が示されていない。何が起きるのか想像できない |
| ○ | 「走った軌跡がそのまま次の走者の足場になる、リレー式の横スクロールアクション」 | 動詞（走る）＋ひねり（軌跡が足場化）＋ジャンルが1文。検証可能な仮説になっている |
| ○ | 「柴犬の散歩ルートを設計して街の匂いマップを塗り替える、経路づくりのパズルアクション」 | 誰が/何をするか/ひねりが揃い、既存の棚（パズルアクション）に置ける |

**自己チェック**: その1文を読んだ人が「で、プレイヤーは何をするの?」と聞き返したら不合格。
［推測］

---

## 5. ゲート基準のチェックリスト

### 大前提: スコアリングを信じすぎない

分析駆動のグリーンライトを提唱した Lloyd Melnick 自身が、重み付きスプレッドシート（SWOT を土台に
成功要因を重み付けして各案をスコア化し、高得点を承認する）を紹介した上で、
**「多くのゲーム企業が堅牢な分析で新規プロジェクトを承認しようとしたが、実績はスプレッドシートの
予測に全く近づかなかった（実績と予測は無相関だった）」「新規事業をスプレッドシートで分析するのは
無価値か、むしろ負の価値を生む」「新規事業の実績を正確に予測することは不可能」** と結論している
（[Lloyd Melnick](https://lloydmelnick.com/2019/02/26/building-an-analytic-driven-greenlight-process/)）。

一方 Deconstructor of Fun は、複数のシナリオと前提を作って個別にスコアリングし全結果を見る、
関係者全員が同席する場に市場データを持ち込んで **主観とバイアスを具体的なスコアに変換する** ことを
推奨している（[DoF](https://www.deconstructoroffun.com/blog/2019/4/2/from-the-trenches-deconstructing-project-greenlight-and-early-stage-creative-processes)）。

［推測］この2つは矛盾しない。**スコア表の価値は「予測」ではなく「議論の可視化」にある。**
個人開発では議論相手がいないので、スコア表よりも **YES/NO の二値チェックリスト** のほうが機能する。
以下はすべて二値で書いてある。

---

### G1: コンセプト・ゲート（1案あたり10分で判定）

```
□ ハイコンセプトを1文で言える（型3で書けている）
□ その1文に「プレイヤーの動詞」が入っている
□ その1文に「他にない要素」が入っている
□ 買う人を具体的に指せる（「〇〇と△△を遊んだ人」の形で言える）
□ 置く棚（ジャンル/タグ）が決まっており、その棚に自分の規模の成功例がある
□ 自分の技術で作れる（新規に習得が必要な技術が2つ以下）
□ 制約シートの期間の 1/3 以内で「遊べる最小形」に到達できる見込みがある
□ 自分がこの案に半年〜1年飽きない自信がある
□ 30秒トレーラーの絵コンテが12コマ埋まる（見せ場が12個ある）

判定: すべて □ → 通過 / 1つでも欠ける → 落とす
```

---

### G2: FUN ゲート（「面白い」をどう判定するか）

「面白い」は主観なので、**言葉ではなく行動で測る。**

```
【観察で測る（他人5〜10人、説明なしで渡す）】
□ 誰にも促されずに2回目を始めた人が半数以上いる
□ 「もう1回」と口に出した人がいる
□ 詰まった箇所が全員バラバラではない（＝設計の問題が特定できる）
□ プレイ中に自発的に声が出た（笑い・悔しがり・驚き）
□ 自分から独自の遊び方・攻略を発明した人がいる

【自分について】
□ デバッグのつもりで起動して、気づいたら普通に遊んでいたことが週1回以上ある
□ 寝る前に「あの調整を試したい」と思う

【逆向きの警報（1つでも当てはまれば黄信号）】
□ 「ここが面白いんです」と口頭で説明しないと伝わらない
□ 「グラフィックが入れば面白くなる」と自分が思っている
□ 「もっとコンテンツを足せば面白くなる」と自分が思っている
□ 面白くない気がし始めている
```

**最後の項目が最も重要。** Supercell:
「うまくいかなそう／十分に面白くないと感じ始めたら、それは**すでにキルすべきだったサイン**」
（[Supercell](https://supercell.com/en/news/10-learnings-10-years/)）。

参考: 教育ゲームの事例だが、プレイテスト後アンケートで
**「楽しかった、また遊びたい」と答えた学生が90%** という水準が良好な指標として報告されている。
研究文脈での受容性ベンチマークには **「友人に勧める ≥75%」「友人に話す見込み ≥80%」** が使われる。
［推測］商業ゲームのプロトタイプにそのまま適用はできないが、
**「また遊びたいか」が定番のGo/No-Go設問である**ことは共通している。

---

### G3: グリーンライト・ゲート（作ると決める）

```
【作る価値】
□ G2 を通過している（行動として観察された）
□ ワンシートが1枚に収まっている
□ 偽プレスリリース／トレーラー台本が、自分で読んでもわくわくする
□ 「5分・10分を超えて広がるビジョン」がある（何が10時間目の楽しみか言える）

【売れる見込み】
□ 棚（タグ)が確定し、そのタグの直近の売れ筋を10本触った
□ 競合3本に対して「なぜこっちを買うか」を1行ずつ書けた
□ 見た目だけで需要の兆候が出た（WL / CTR / SNS反応のいずれか1つ）
□ 想定価格 × 想定販売本数 が、投入する期間の機会費用を上回る計算になっている

【完走できる】
□ 縦切り（vertical slice）を制約期間の 1/3 で作れる計画がある
□ 新規習得が必要な技術が2つ以下
□ 外注/購入が必要なアセットの費用が予算内
□ 撤退条件を日付付きで書いた（例: 「◯月◯日までにWL 1,000未満なら中止」）

判定: すべて □ → グリーンライト / 1つでも欠ける → S1〜S4 のどこかに戻る
```

**なぜ「撤退条件を先に書く」のか**: Supercell が指摘するとおり、
6人×6ヶ月の損切りは100人×18ヶ月より心理的にも経済的にも楽である
（[Game Developer](https://www.gamedeveloper.com/design/maybe-it-s-time-to-kill-your-game-and-move-on-supercell-on-cutting-its-losses)）。
［推測］個人開発は「1人×N ヶ月」なので、N が大きくなるほど撤退が不可能になる。
**撤退判断は、まだ撤退が苦しくない今のうちに文章にしておくしかない。**

---

## 6. フェーズ0の中にあるループ（3種類）

### ループA: 発散と収束（アイデアを出して絞る）

```
S1 市場調査 → S2 大量に出す → S3 篩う → G1 → (落ちたら) S2 へ
```

- **鉄則: 発散と収束を同じ時間に混ぜない。** 出すときは評価しない。［推測］
- 実データの比率: Voodoo 1,000本 → 4本ローンチ（0.4%）、Double Fine 25案 → 4本プロトタイプ（16%）。
- ［推測］個人開発の現実解は **20案 → 3案 → 2本プロトタイプ**。

### ループB: コンセプト検証（作って遊ばせて直す）

```
S4 ワンシート → S5 プロト → S6 他人テスト → G2 → (落ちたら) S4 または S2 へ
```

- **Rule of the Loop**: テストと改善の回数が多いほどゲームは良くなる
  （[CIRCA / Schell](https://circa.cs.ualberta.ca/index.php/CIRCA:The_Art_of_Game_Design_-_Jesse_Schell)）。
  → **1周を短くして周回数を稼ぐことが目的関数。**
- Schell によれば、ゲームを良くする最も効果的な方法は **粗いプロトタイプを作って実際に試すこと**（同上）。
- Voodoo は 3〜4ヶ月で新作をローンチする（多くの開発者の1〜2年に対して）
  （[DoF](https://www.deconstructoroffun.com/blog/2024/6/3/voodoos-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years)）。
- Double Fine の Amnesia Fortnight は **2週間**（[Double Fine](https://www.doublefine.com/games/amnesia-fortnight)）。
- Supercell の第1フェーズ（ラフプロト）は **数週間**（[case study](https://www.casehero.com/supercell/) — 二次資料）。

### ループC: 市場との往復（コンセプトと需要をすり合わせる）

```
S1 市場調査 → S4 ワンシート → S7 見た目での検証 → G3 → (落ちたら) S1 へ
```

- **トレーラー先行 / Working Backwards**: 完成後のプレスリリースを先に書き、
  魅力的に書けなければ作らない（[Working Backwards](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/)）。
- **ストアページ先行**: ページを早く出してウィッシュリストを集め、
  潜在プレイヤーからデータを取る（[Wayline](https://www.wayline.io/blog/pitch-indie-game-publishers-steam-wishlist-campaign)）。
  ただし **トレーラーなしのストアページは Steam ユーザーの注意持続時間に合わない**（同上）。
- **カプセル画像・最初の4枚のスクショ・トレーラーを執拗に最適化する。**
  これが CTR を決め、CTR がアルゴリズムに直結する（[trapplan](https://www.trapplan.com/en/blog/steam-wishlist-growth-for-indie-games-that-need-momentum-before-launch)）。
- **1週間〜1ヶ月で終わる磨いたプロトタイプ + 小さなランディングページ**を作って
  多数のパブリッシャーに送る／SNSに出す、が資源を無駄にせず即座にフィードバックを得る方法
  （[Stackademic](https://blog.stackademic.com/how-can-a-game-developer-validate-their-ideas-to-create-a-successful-first-indie-game-e0d55da458da)）。

---

## 7. 個人開発向けの圧縮版フロー（時間見積もりつき）

**合計: 実働 3〜6週間（1ループ）。これを最大2〜3周する。**
1周ごとに1案を殺すか、次に進めるかを必ず決める。

| # | ステップ | 実働 | やること（明日そのままできる粒度） | 完了の定義 |
|---|---|---|---|---|
| 0 | 制約を書く | **1時間** | A4に「使える月数 / 使える金額 / 月あたり時間 / 撤退ライン / 絶対にやらないこと」を数字で書く | 5項目すべてに数字が入っている |
| 1 | 棚を選ぶ | **2〜3日** | ①販売先を1つ決める ②候補タグ5個の売れ筋を各10本リストアップ（発売日/価格/レビュー数/開発規模） ③上位5本・中位5本を実際に買って遊ぶ ④棚を1つ選ぶ | 「この棚の客は誰で、今何を買っているか」を3分間しゃべれる |
| 2 | 20案出す | **半日** | タイマー90分。1案1行。評価禁止。20行に届かなければ翌日もう90分 | 20行ある |
| 3 | 3案に絞る | **1時間** | G1チェックリスト（第5章）を1案10分で機械的に適用 | 3案以下に減った + 落とした理由が1行ずつ書いてある |
| 4 | ワンシート | **半日 × 案数** | 第3章のテンプレートをA4 1枚に。はみ出したら削る | 1枚に収まっている |
| 5 | 偽トレーラー | **半日** | 30秒トレーラーの絵コンテを12コマ描く（棒人間可）+ 発売時プレスリリースを1枚書く | 12コマ埋まった & 自分で読んで面白い |
| 6 | 紙プロト | **1〜2日** | コアループだけを紙・カード・Excelで手回し。デジタル化しない | 自分が3回連続で回した |
| 7 | 最小プロト | **1〜2週間** | コアループのみ実装。タイトル画面・メニュー・音・演出・セーブは作らない。既存コード（柴犬ラン）を土台にして高速化してよい | 他人に説明なしで渡せる状態 |
| 8 | 他人テスト | **2〜3日** | 知り合いでない人5〜10人に渡す。横で黙って観察、話しかけない。観察ログを取る | 5人以上のログがある |
| 9 | **G2 判定** | **1時間** | G2チェックリストを正直に埋める | 通過 or 殺す。**両方あり得る前提で臨む** |
| 10 | 市場検証 | **3〜5日** | 絵コンテを動画にして SNS / コミュニティ / (可能なら)ストアページに出す。数字を取る | 反応の数字が1つ以上ある |
| 11 | **G3 判定** | **1時間** | G3チェックリストを埋める。撤退条件を日付付きで書く | グリーンライト or 1周目に戻る |

### 圧縮するときに削ってよいもの・削ってはいけないもの

| | 判断 | 根拠 |
|---|---|---|
| **削ってよい** | 詳細なGDD、ピッチデッキ、財務モデル、綺麗な資料 | プリプロは1ページから始めるのが主流（[Game Developer](https://www.gamedeveloper.com/design/how-to-write-a-game-design-document)） |
| **削ってよい** | プロトタイプの見た目・音・メニュー | 「磨きすぎたプロトタイプの罠」（[Wayline](https://www.wayline.io/blog/polished-prototype-trap-indie-game-innovation)） |
| **削ってよい** | 承認会議・スコアリング表 | Supercell にはグリーンライト手続き自体がない（[Game Developer](https://www.gamedeveloper.com/business/less-management-more-success-inside-supercell-s-upside-down-organization)）。スコア表の予測精度は実証されていない（[Melnick](https://lloydmelnick.com/2019/02/26/building-an-analytic-driven-greenlight-process/)） |
| **削ってはいけない** | 市場調査（棚選び） | ジャンル選択は最大のマーケ判断（[Zukowski](https://howtomarketagame.com/)） |
| **削ってはいけない** | 他人（友人でない）へのプレイテスト | 友人は正直な批判をくれない（[Wayline](https://www.wayline.io/blog/how-to-prototype-game-ideas-quickly-validation-strategies)） |
| **削ってはいけない** | 撤退条件を先に書くこと | 遅い損切りほど心理的・経済的に苦しい（[Game Developer](https://www.gamedeveloper.com/design/maybe-it-s-time-to-kill-your-game-and-move-on-supercell-on-cutting-its-losses)） |
| **削ってはいけない** | 案を2本以上走らせること | 比較対象がないと「これしかない」で判断が歪む［推測］ |

---

## 8. 柴犬ランを商業化する場合の当てはめ（このリポジトリ固有）

［推測］以下は本調査を本プロジェクトに適用した筆者の見解であり、出典による裏付けではない。

1. **柴犬ランは「プロトタイプ」ではなく「技術基盤」として扱うのが正しい。**
   既に敵・ギミックの登録制、面のデータ化、セーブ、リプレイ検証まである。
   これは S7（最小プロト）を **1〜2週間 → 数日** に短縮できる資産であり、
   ループBの周回数を稼ぐ武器になる。**「柴犬ランを商品にする」ではなく
   「柴犬ランのエンジンで20案のうち3案を素早く試す」** という使い方が、本調査の推奨と最も整合する。

2. **ジャンルは正面から見直す必要がある。** platformer は売れにくい側に名指しされている
   （[Zukowski](https://howtomarketagame.com/)）。
   横スクロールアクションの操作感を保ったまま、売れる棚（roguelike/deckbuilder、sandbox、simulator 等）
   と掛け合わせられないか、S2 のアイデア出しで20案の軸にすると効率が良い。

3. **CLAUDE.md の「検証していない場所は壊れていても気づけない」は、そのままフェーズ0にも当てはまる。**
   リプレイ検証がボスに到達していなかったせいで2段階のリファクタリングを素通りしたのと同じ構造で、
   **他人に遊ばせていないコンセプトは、面白くなくても気づけない。**
   G2（他人テスト）は技術検証における replay-check.mjs に相当する。省略してはいけない。

---

## 9. 出典URL一覧

### スタジオの実践（フェーズ0の内部フロー）
- Supercell — 10 Learnings from 10 Years: https://supercell.com/en/news/10-learnings-10-years/
- Supercell on cutting its losses（company playable、キル判断）: https://www.gamedeveloper.com/design/maybe-it-s-time-to-kill-your-game-and-move-on-supercell-on-cutting-its-losses
- Inside Supercell's 'upside-down' organization（グリーンライト手続きの不在）: https://www.gamedeveloper.com/business/less-management-more-success-inside-supercell-s-upside-down-organization
- Supercell が失敗をシャンパンで祝う（Corporate Rebels）: https://www.corporate-rebels.com/blog/failure-sessions-supercell
- Every game Supercell has killed and why: https://esportsinsider.com/every-game-supercell-killed
- 30+ Killed Games: Supercell's Graveyard: https://cellstring.com/news/article/30-killed-games-the-secret-history-of-supercells-graveyard
- Supercell ケーススタディ（二次資料、要注意）: https://www.casehero.com/supercell/
- Voodoo's Secret Sauce（100本並行/年1,000本/0.4%/3〜4ヶ月）: https://www.deconstructoroffun.com/blog/2024/6/3/voodoos-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years
- Voodoo 公式版: https://voodoo.io/news/voodoo-s-secret-sauce-from-0-to-250m-hybridcasual-revenue-in-3-years
- How Voodoo Diversified and Lowered Game Product KPIs（旧ハードルD1 55%/D7 22%/CPI<$0.25 の見直し）: https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis
- Supersonic — 3 Most Important KPIs for Testing Your Hyper-Casual Prototype（CPI < $0.30）: https://supersonic.com/learn/blog/the-3-most-important-kpis-for-testing-your-hyper-casual-prototype
- GameAnalytics — Early Testing Strategies for Hyper-Casual: https://www.gameanalytics.com/blog/early-testing-strategies-to-maximize-your-hyper-casual-games-potential
- Homa — hypercasual を hybridcasual に育てる（CPIよりLTV）: https://www.homagames.com/games/how-to-evolve-a-hypercasual-game-into-a-hybridcasual-success
- Homa — The Hypercasual business model: https://www.homagames.com/blog/the-hypercasual-business-model
- Double Fine — Amnesia Fortnight: https://www.doublefine.com/games/amnesia-fortnight
- Amnesia Fortnight 2017（25案→4本）: https://en.wikipedia.org/wiki/Amnesia_Fortnight_2017
- Amnesia Fortnight のコミュニティ投票: https://www.pcgamesn.com/indie/two-weeks-lunacy-double-fines-amnesia-fortnight-community-voting-begins
- Riot — Project L /dev: Finding our Game（R&D = fun を見つける段階）: https://www.riotgames.com/en/news/project-l-dev-finding-our-game
- Riot — Playtest With Us: https://www.riotgames.com/en/playtest
- GDC 2026 参加記（7段階が3段階に収束、prototype と greenlight の融合）: https://www.invisiblefriends.net/gdc-2026-a-personal-account/

### GDC・書籍
- GDC Vault — Adam Saltsman "Deciding What to Make: A Greenlight Process for Commercial Indies": https://www.gdcvault.com/play/1023532/Deciding-What-to-Make-A
- 同 YouTube 版: https://www.youtube.com/watch?v=PYpHbuF08Mk
- Finji's Adam Saltsman: Tips for deciding which game ideas to pursue: https://www.gamedeveloper.com/business/finji-s-adam-saltsman-tips-for-deciding-which-game-ideas-to-pursue
- Jesse Schell『The Art of Game Design』— Lens of the Eight Filters: https://schellgames.com/blog/lens-of-the-eight-filters
- 同 Lens #15 解説: https://artificials.ch/lens-15-the-lens-of-the-eight-filters/
- 同 CIRCA まとめ（Rule of the Loop）: https://circa.cs.ualberta.ca/index.php/CIRCA:The_Art_of_Game_Design_-_Jesse_Schell
- Tracy Fullerton『Game Design Workshop』第9章 Prototyping: https://www.taylorfrancis.com/chapters/mono/10.1201/9781003460268-9/prototyping-tracy-fullerton
- 同 Game Developer 抜粋: https://www.gamedeveloper.com/design/book-excerpt-game-design-workshop
- Scott Rogers『Level Up!』The One-Sheet Sample: https://www.oreilly.com/library/view/level-up-the/9780470688670/ch18.html
- 同 2nd ed. Bonus Level 1: https://www.oreilly.com/library/view/level-up-the/9781118877197/xhtml/24_9781118877166-bapp01.xhtml
- 同 The Ten-Page Design Document Sample: https://www.oreilly.com/library/view/level-up-the/9780470688670/ch19.html
- 同 Packt「Writing the GDD, Step 2: The Ten-Pager」: https://www.packtpub.com/en-us/product/level-up-the-guide-to-great-video-game-design-second-edition-9781118877166/chapter/note-12/section/writing-the-gdd-step-2-the-ten-pager-ch12lvl1sec37
- Jason Schreier『Blood, Sweat, and Pixels』（Bungie が「次に何を作るか」を決めるのが最難関、可能性を無限から1つに絞る作業）: https://www.goodreads.com/book/show/34376766-blood-sweat-and-pixels

### ワンシート / ピッチ / GDD テンプレート
- Press Start Leadership — From One Sheet to Pitch Deck（30秒で伝わること、デッキ展開表）: https://pressstartleadership.com/from-one-sheet-to-pitch-deck-and-beyond-building-game-pitches-that-land-deals/
- The Design Lab — Writing a 1-Pager Concept Document: https://thedesignlab.blog/2025/04/28/writing-a-1-pager-concept-document-for-your-game-idea/
- Narrative Design — How to write a one-page game design document: https://www.narrativedesign.net/p/write-one-page-game-design-document
- One Page Game Design Document Template (PDF): https://www.renz.is/content/files/2023/10/One-Page-Game-Design-Document-Template-1.pdf
- Game Design Center — One Page Proposal: http://www.gamedesigncenter.org/one-page-proposal
- Alexia Mandeville — Pitch Your Game with this Greenlight Template（未確認、要参照）: https://alexiamandeville.medium.com/pitch-your-game-with-this-greenlight-template-47ecd919734a
- David Mullich — A Template For Game Pitch Powerpoints: https://davidmullich.com/2018/02/19/a-template-for-game-pitch-powerpoints/
- Storydoc — 18 Winning Game Pitch Deck Examples: https://www.storydoc.com/blog/game-pitch-deck-examples
- Game Developer — How to write a Game Design Document in 2024（プリプロは1ページから）: https://www.gamedeveloper.com/design/how-to-write-a-game-design-document
- MCV/DEVELOP — Death of the game design document: https://mcvuk.com/development-news/death-of-the-game-design-document/
- Nuclino — Game Design Document Template: https://www.nuclino.com/articles/game-design-template
- Game Dev Beginner — How to write a game design document: https://gamedevbeginner.com/how-to-write-a-game-design-document-with-examples/

### ハイコンセプト / エレベーターピッチ
- Wikipedia — High concept: https://en.wikipedia.org/wiki/High_concept
- Wikipedia — Elevator pitch: https://en.wikipedia.org/wiki/Elevator_pitch
- Curtis Brown Creative — How to write your elevator pitch（X meets Y）: https://www.curtisbrowncreative.co.uk/blog/how-to-write-your-elevator-pitch
- Jessica Payne — the secret to why twilight worked（What if 型）: https://jessicapayne.substack.com/p/the-secret-to-why-twilight-worked

### ゲート基準 / グリーンライト
- Lloyd Melnick — Building an analytic-driven greenlight process（スコアリングとその限界）: https://lloydmelnick.com/2019/02/26/building-an-analytic-driven-greenlight-process/
- Deconstructor of Fun — The 7 Steps to Successfully Greenlight a Game with an IP: https://www.deconstructoroffun.com/blog/2019/4/2/from-the-trenches-deconstructing-project-greenlight-and-early-stage-creative-processes
- Game Developer — The 5 Stages of Greenlight: https://www.gamedeveloper.com/business/the-5-stages-of-greenlight-how-to-know-when-it-s-time-to-launch-your-game
- Wikipedia — Greenlight: https://en.wikipedia.org/wiki/Greenlight
- Wikipedia — Pre-production: https://en.wikipedia.org/wiki/Pre-production
- Unity Production Milestones（First Playable / Vertical Slice / Alpha / Beta の定義）: https://pctechmag.com/2026/06/unity-production-milestones-what-each-stage-should-deliver/
- Ask a Game Dev — The Game Production Cycle: https://www.tumblr.com/askagamedev/70418936707/the-game-production-cycle

### 検証手法 / トレーラー先行 / Working Backwards
- Working Backwards — The Amazon PR/FAQ Process: https://workingbackwards.com/concepts/working-backwards-pr-faq-process/
- ProductPlan — Working Backward (the Amazon Method): https://www.productplan.com/glossary/working-backward-amazon-method
- Product Strategy — The Amazon PR/FAQ for Product Innovation: https://productstrategy.co/working-backwards-the-amazon-prfaq-for-product-innovation/
- Wayline — How to Prototype Game Ideas Quickly & Validate Them: https://www.wayline.io/blog/how-to-prototype-game-ideas-quickly-validation-strategies
- Wayline — The Polished Prototype Trap: https://www.wayline.io/blog/polished-prototype-trap-indie-game-innovation
- Stackademic — How can a game developer validate their ideas: https://blog.stackademic.com/how-can-a-game-developer-validate-their-ideas-to-create-a-successful-first-indie-game-e0d55da458da
- itch.io フォーラム — how do you know when to kill a prototype: https://itch.io/t/958699/how-do-you-know-when-to-kill-a-prototype

### 市場調査 / マーケット検証
- Chris Zukowski — How To Market A Game: https://howtomarketagame.com/
- Game Developer Podcast ep.34 — Chris Zukowski: https://www.gamedeveloper.com/marketing/game-developer-podcast-36-indie-marketing-advice-from-chris-zukowski
- presskit.gg — Steam Tags Strategy Guide: https://presskit.gg/field-guides/steam-tags-strategy
- presskit.gg — How Many Wishlists Do You Need to Launch（7,000 の閾値）: https://presskit.gg/field-guides/how-many-wishlists-to-launch
- How To Market A Game — Next Fest ウィッシュリスト・ベンチマーク: https://howtomarketagame.com/2025/03/26/benchmarks-how-many-wishlists-can-i-get-from-steam-next-fest/
- Steam Page Analyzer — How Many Wishlists Before Launch: https://www.steampageanalyzer.com/blog/how-many-wishlists-before-launch
- trapplan — Steam wishlist growth（カプセル/スクショ/トレーラーとCTR）: https://www.trapplan.com/en/blog/steam-wishlist-growth-for-indie-games-that-need-momentum-before-launch
- Wayline — Pitch Indie Game Publishers & Steam Wishlist Campaign: https://www.wayline.io/blog/pitch-indie-game-publishers-steam-wishlist-campaign
- The Mind Studios — Pitching Your Game in 2026: What Publishers Are Looking For: https://games.themindstudios.com/post/pitching-your-game/
- IndieGameBusiness — The State of Pitching in 2025: https://indiegamebusiness.com/state-of-pitching-in-2025/
- GameMaker — Indie Game Publishing in 2025: Tips from Akupara Games: https://gamemaker.io/en/blog/indie-game-publishing-2025
