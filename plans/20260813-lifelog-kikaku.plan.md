---
title: 人生ログアプリ — 企画の進め方（調査と決定）
status: draft
created: 2026-08-13
planner: Claude（Web調査エージェント4本の結果を統合）
target: 新規プロジェクト。shiba-runとは別物で、置き場が決まるまでの仮置き
---

# 調査報告: 「人生ログ」の企画をどうまとめるか

経緯: 「自分の行動・言葉・思考・Claudeへの質問を全部記録し、復習問題として出題され、
知識の結びつけや行動の示唆まで届く仕組みを作りたい。まず企画が必要だが、
どうまとめるべきか。専用のスキル・プラグイン・フレームワークを調査してほしい」という依頼。

Webを4方向（企画手法／学習科学とPKM／ライフログ先行事例／技術的実現可能性）から調査した結果を
ここに統合する。企画書のたたき台は [20260813-lifelog-kikaku-v0.md](20260813-lifelog-kikaku-v0.md)。

## 1. 結論

**大きな仕様書は書かない。1〜3枚の企画書と、コードを書かない2週間の検証から始める。**

1. **企画書の型は「JTBD＋Shape Up式pitch」の組み合わせ（合計1〜3枚）。**
   この構想は少なくとも4つの別々の用事（①漏らさず残したい ②忘れたくない ③点を線にしたい
   ④次の行動を決めたい）を束ねている。JTBDでまず主用事を1つ選び、
   pitchの5要素（problem / appetite / solution / rabbit holes / no-gos）に落とす。
   個人開発の最大の死因は「全部盛りで完成しないこと」で、appetite（先に使う時間の上限を切る）と
   no-gos（やらないことの明文化）がその直接の対策になる。
2. **最初に検証すべきはコードではなく自分の行動。**
   この企画の最リスク仮説は「Claudeのログが取れるか」（→調査で解決済み、§4d）ではなく、
   **「出題されたとき、自分は2週間後も答え続けているか」**。これは既存ツールと手動運用だけで
   確かめられる。作ってから確かめると、失敗したときに失うものが最大になる。
3. **技術的には公式機能だけで成立する。ただし収集の入口はClaude Codeに寄せる。**
   claude.ai（Web/アプリ）の履歴を自動取得する公式手段は存在せず、自動化ハックは規約違反で
   BAN事例まである。一方Claude Codeは全プロンプトをhooksで公式に記録でき、
   GitHubへのpush・復習問題の定期生成・スマホ通知まで公式機能の組み合わせで完結する。
4. **競合はいる。作る前に Rember（公式MCPで「Claudeとの会話→暗記カード化」済み）を触り、
   何が足りないかを自作範囲の定義にする。**

## 2. 判断記録

| # | 論点 | 選択肢 | 採用 | 理由（却下理由を含む） |
|---|---|---|---|---|
| 1 | 企画書の型 | 重量級の要件定義書 / Lean Canvas / PR-FAQ一式 / **JTBD＋pitch 1〜3枚** | JTBD＋pitch | 要件定義書はチーム受託の作法の輸入で、個人開発の死因（完成しない）を悪化させる。Lean Canvasは収益・顧客セグメント欄が非商用・自分ユーザーでは空欄になり形骸化。PR-FAQはFAQと承認プロセスが過剰（ただし「未来のプレスリリース」半ページだけはやる気の維持に効くので任意採用）。JTBDは問題の未分化に、pitchはスコープ爆発に、それぞれ最も直接に効く |
| 2 | 検証の順番 | 作ってから使って確かめる / **最リスク仮説をコード0行で先に検証** | 先に検証 | Running Leanの核心の翻訳。最大の不確実性は技術でなく「自分が続けるか」という行動仮説で、手動運用2週間で判定できる。SRS研究でも挫折要因の筆頭は「復習債務」で、続かない設計は機能で救えない |
| 3 | 書く量 | 網羅的な仕様 / **意思決定だけ書いて反復更新** | 後者 | Big Design Up Front批判と日本語圏の個人開発実践知が同じ結論。「短く・更新され・やらないことと検証したい仮説を明記」した文書だけが価値を持つ。書くこと自体は思考の明晰化に必須なので「書かない」も誤り |
| 4 | データの置き場 | 専用クラウド/SaaS / **Markdown＋git（privateリポジトリ）** | 後者 | 先行事例で10年生きているのはローカル＋開放形式（Markdown/SQLite/JSONL）だけ。クラウド独自形式のRewind→Limitlessは買収で消滅しユーザーはエクスポート期限を切られた。本人の「GitHubに自動push」という直感は正しい |
| 5 | 作るか借りるか | 全部自作 / **復習エンジンとUIは借り、収集と蒸留だけ自作** | 後者 | 間隔反復アルゴリズムはFSRS（17億レビューでベンチマーク済み、ts-fsrs/py-fsrs）に個人で勝てない。復習UIもAnki/Mochiが枯れている。独自価値は「本人が実際に抱いた疑問」というデータ側にあり、そこ（収集・蒸留・結びつけ）だけが自作に値する |
| 6 | 質問の収集経路 | claude.aiを自動スクレイプ / **Claude Code hooksを正とし、claude.aiは月1手動エクスポート** | 後者 | claude.aiの自動取得は公式手段なし・規約違反・BAN事例あり（2026-02に取り締まり明確化）。Claude Codeの `UserPromptSubmit` hookは全プロンプトを決定論的に記録できる公式機能。ローカルJSONL（`~/.claude/projects/`）はデフォルト30日で消えるので回収を仕組みにする |
| 7 | 出題の配信 | 専用アプリ・通知基盤 / **GitHub ActionsまたはRoutinesでIssue作成＋self-assign** | 後者 | GitHub公式チュートリアルの構成そのまま。Issueに自分をassignすればGitHub Mobileのプッシュ通知が公式機能だけで届く。先行事例の教訓「既存の日常動線への相乗り」（GitHub日記が続いた理由は仕事と同じ操作だから）にも合致 |
| 8 | 復習問題の作り方 | 全自動生成 / **LLMが下書き→本人が編集・承認** | 後者 | 学習科学の生成効果（自作カードは既製カードより定着する）と2026年のSmartFlash研究（透明で編集可能でないと学習の自己調整が壊れる）の両方が全自動を否定。自動化するのは「下書きと配達」まで |
| 9 | 知識の結びつけ（⑤） | 最初から作る / **データが貯まるまで作らない** | 後者 | 素材ゼロでは検証も価値実証もできない。埋め込みベースの関連提示は既製品（Obsidian Smart Connections等）や週次のClaudeレポートで後から安く足せる。初期スコープから外すことをno-gosに明記する |

## 3. 最初の2週間の手順

**今週（企画を書く。合計5〜6時間、タイムボックス厳守）:**

- Day 1（90分）: JTBDメモ1枚。「これが欲しい」と感じた最近の具体的場面を10個書き出し、
  4つの用事に分類して主用事を1つ選ぶ。各場面に「今は何で済ませているか」を併記する
- Day 2（60分）: 未来のプレスリリース半ページ（たたき台v0の§2を清書）
- Day 3〜4（計2〜3時間）: pitch 1〜2枚（v0の§1・§4〜§7を清書。appetiteを必ず数字で切る）

**今週〜再来週（コードを書かずに検証する）:**

- 質問の入口を意識的にClaude Codeへ寄せる（または一度だけclaude.aiの手動エクスポートを実行）
- 週2回、Claudeに「先週の私の質問から復習問題を3問作って」と手で頼み、自分が答える。
  **2週間後も答えていたら企画は生きている。答えなくなっていたら、機能ではなく企画を作り直す**
- 並行して Rember（公式MCP）を試し、「これで足りないこと」を書き出す。それが自作範囲になる

**生き残ったら:** v0.1の実行計画書を `plan-handoff` スキルで作る。最小構成は
「hook → privateリポジトリへ自動push → Actions/Routinesが週次で問題を下書き → Issueで出題 → 自己申告で正誤記録」。

## 4. 調査ダイジェスト

### 4a. 企画フレームワーク（7手法を比較）

- **Shape Up pitch ◎**: appetite（見積りの逆。「何週間かかるか」でなく「何週間までなら使うか」を先に固定）、
  rabbit holes（ハマる穴の事前列挙）、no-gos（やらないこと）。スコープ爆発への直接対策
- **JTBD ◎**: 「人は製品を雇う」。構想が束ねる4つの用事を分離し、主用事を選ばせる。調査は
  「最近の具体的場面を10個書く」だけで済み、ユーザーが自分なのでコスト最小
- **1枚PRD ◎**: 思考法ではなく器。飛び飛びに作業する趣味開発では「未来の自分への引き継ぎ書」
  かつ「AIに渡すコンテキスト」として機能する
- **PR-FAQ ○**: プレスリリース部分のみ採用価値あり。顧客体験からの逆算を強制する
- **Running Lean △**: キャンバス自体は非商用だと形骸化。ただし「最リスク仮説から検証」の思想だけは核心
- **インセプションデッキ △〜○**: 合意形成向け項目がソロでは空回り。縮約4項目版はpitchとほぼ等価
- **Opportunity Solution Tree ○**: 樹形図として一回使うと「全部やる」が「どの機会から攻めるか」に変換される

### 4b. 反復復習・PKMの学習科学と先行ツール

- 構想の学習科学的裏付けは強い。「答えを知る前に問いを立てると後の学習が強化される」（プレテスト効果）、
  「好奇心状態で符号化された記憶は定着しやすい」（Gruber et al. 2014）——**Claudeへの質問は
  まさにこの2条件を満たした符号化済みの「知識の穴」の記録**で、教材として上質
- アルゴリズムはFSRSが標準（Anki 25.07から既定。SM-2比で同じ定着率なら復習回数2〜3割減）。
  ts-fsrs / py-fsrs として借りられる
- 挫折要因の筆頭は**復習債務**（数日サボると期限切れが数百枚積み上がり崩壊）。日次上限・
  自動間引き・「毎朝少量が届く」Readwise型の設計が対策
- LLM生成カードの品質規範は Andy Matuschak の "How to write good prompts"
  （1カード1事実・想起を強制・多角度）をシステムプロンプトに流用できる
- **Rember が公式MCPで「Claudeとの会話から暗記カード生成」を既に提供。着手前に必ず試す**

### 4c. ライフログ先行事例の教訓（生死の分かれ目）

| 教訓 | 根拠となる事例 |
|---|---|
| 挫折要因の第一は「集める」より「使う」の欠如。毎週必ず起きる活用の瞬間から逆算する | Quantified Self運動は収集がコモディティ化した瞬間に運動として消えた。Memexは収集・整理だけで開発停止。逆にLLMが活用コストを下げた2026年にDogsheepが再燃 |
| 保存形式が寿命を決める。ローカル＋開放形式だけが10年生きる | Rewind→Limitless（クラウド・独自形式）はMeta買収で消滅、ユーザーはエクスポート期限を突きつけられた。Dogsheep・HPI・screenpipe・claude-memは揃ってSQLite/プレーンテキスト |
| 一人メンテの取り込みパイプラインは最大の負債。ソースは少数精鋭に絞る | HPIが7年続くのは作者が毎日自分で使いパーサを直し続けているから。「全ソース網羅」は個人には無理 |
| AIメモリ層を再発明しない。プレーンな保存を自分が所有し、MCPで既存AIに読ませる側に回る | 会話メモリはChatGPT/Claude本体に標準搭載済み。汎用メモリAPIはmem0（$24M調達）等の資本競争になった。個人ノートがMCPサーバーを出したReflectが好例 |
| 続く仕組み＝既存の日常動線への相乗り。新しい習慣を要求するほど脱落する | GitHub直置き日記が1年続いた理由は「仕事の開発と同じ操作で頭の切り替えが不要」 |
| プライバシーは機能でなく生存条件。除外ルールと削除可能性を最初から | 全録画系のscreenpipeですら「100%ローカル」を前面に出す。自動メモリへの「勝手に人物像を作られる」批判も既にある |

### 4d. 実現可能性（◎公式で自動化可 / ○手動あり / △ハック / ×不可）

**収集:**

| 経路 | 判定 | 要点 |
|---|---|---|
| claude.ai（Web/アプリ）の履歴を自動取得 | **×** | 個人向け公式APIは存在しない。Messages APIはステートレスで履歴を持たない |
| claude.ai の手動データエクスポート | ○ | Settings > Privacy > Export data。ZIP内 `conversations.json`。リンク24時間失効・モバイル不可・自動化不可 |
| ブラウザ拡張・非公式APIでの自動巡回 | **△（非推奨）** | 規約の自動アクセス禁止に抵触。2026-02に取り締まり明確化、BAN事例あり |
| Claude Code のローカルログ | **◎** | `~/.claude/projects/**.jsonl`（公式文書化）。`type=="user"` 行が質問そのもの。**デフォルト30日で自動削除**（`cleanupPeriodDays` で延長） |
| Claude Code の hooks | **◎（本命）** | `UserPromptSubmit` hookで全プロンプトを決定論的に任意の場所へ記録できる公式機能 |
| 自前アプリ/ゲートウェイ経由のClaude API | ◎ | LiteLLM等でログ完全所有。ただしその窓口でした会話しか残らない |
| MCPメモリサーバー | ○ | モデルがツールを呼んだときしか記録されず、全量ログには不適。要点メモ向き |

**配信:**

| 経路 | 判定 | 要点 |
|---|---|---|
| GitHub Actions cron → Issue作成＋self-assign | **◎** | 公式チュートリアルが存在する構成。self-assignでGitHub Mobileのプッシュ通知が届く。cronはUTC・遅延あり。privateリポジトリなら60日無活動での自動停止も対象外 |
| メール | ◎ | Issue通知メールで追加実装ゼロ |
| Slack Incoming Webhook | ◎ | Actionsから叩くだけ。（Claude in Slackは2026-08からClaude Tagへ移行中なので土台にしない） |
| Claude Code Routines（クラウドcron） | **◎** | 公式（research preview、Pro/Max可、最小間隔1時間）。リポジトリをcloneして問題生成→Issue/Slack投稿まで1本で完結。PCを閉じていても動く |
| Anki自動生成→AnkiWeb無人同期 | △ | .apkg生成（genanki）は◎だがAnkiWebに公開APIがなく無人同期は不可。手動インポートか自前同期サーバが妥協点 |

**成立する最短の全公式構成:** hookで質問を記録 → privateリポジトリへ自動push →
Routines/Actionsが定期的に復習問題を下書きしてIssue作成（self-assign）→ スマホに通知 → 自己申告で正誤を記録。

## 5. 道具箱

**手元にあるスキル（この環境で使える）:**

- `issue-card` — 構想の背後にある構造課題（記録の散逸・復習習慣の欠如）を事実/解釈/提案に分けて整理する
- `plan-handoff` — 企画が固まったあと、v0.1の実装を実行計画書に落とす
- `skill-creator` — 運用が固まったら「週次復習問題の生成」自体をスキル化する

**追加できるプラグイン:** Anthropic公式マーケットプレイスの **Product Management**
（`/product-management:write-spec` で問題定義→スペック作成）。インストール提案カードを会話に出した。

**借りる外部部品:** ts-fsrs / py-fsrs（復習間隔）、genanki・Mochi API（復習UIの借用先）、
Rember MCP（competitor兼部品候補。まず試す）、Obsidian Smart Connections（関連ノート提示）、
claude-mem（Claude Codeセッションの自動記憶。コミュニティ最大手）。

## 6. 主要な出典

- Shape Up "Write the Pitch": https://basecamp.com/shapeup/1.5-chapter-06
- Working Backwards PR/FAQ: https://workingbackwards.com/concepts/working-backwards-pr-faq-process/
- JTBD（HBS Online）: https://online.hbs.edu/blog/post/jobs-to-be-done-examples
- Ash Maurya「最リスク仮説から検証」: https://www.leanfoundry.com/articles/reorder-your-chain-of-beliefs-with-a-leaner-lean-canvas
- Nielsen "Augmenting Long-term Memory": https://augmentingcognition.com/ltm.html
- Matuschak "How to write good prompts": https://andymatuschak.org/prompts/
- FSRS: https://github.com/open-spaced-repetition/ts-fsrs / https://faqs.ankiweb.net/what-spaced-repetition-algorithm
- 自作カード優位（Pan 2022）: https://sc-pan.github.io/pdf/PZIZQ_2022.pdf
- 好奇心と記憶（Gruber 2014）: https://pubmed.ncbi.nlm.nih.gov/25284006/
- Rember MCP: https://github.com/rember/rember-mcp
- Dogsheep: https://dogsheep.github.io/ / Datasette Agent: https://simonwillison.net/2026/May/21/datasette-agent/
- HPI: https://github.com/karlicoss/HPI
- claude.aiエクスポート: https://support.claude.com/en/articles/9450526-export-your-claude-data
- Claude Codeのデータ保持（30日/`cleanupPeriodDays`）: https://code.claude.com/docs/en/data-usage
- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Routines: https://code.claude.com/docs/en/routines
- GitHub「Scheduling issue creation」: https://docs.github.com/en/actions/tutorials/manage-your-work/schedule-issue-creation
- 個人開発の挫折と完成（Zenn）: https://zenn.dev/takaaki3333/articles/8336c134d0db8f
