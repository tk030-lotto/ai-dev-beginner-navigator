# AI開発初心者お助けナビ（AI Dev Beginner Navigator）

> **「専門用語を知らなくても、困りごとから解決策とAIへの聞き方にたどり着ける」**

🔗 **Web公開URL**: [https://tk030-lotto.github.io/ai-dev-beginner-navigator/](https://tk030-lotto.github.io/ai-dev-beginner-navigator/)

AIを使った開発で初心者が遭遇する、

* 「何がわからないのかわからない」
* 「エラーが出たけど、何を聞けばいいかわからない」
* 「AIに聞いたけど説明が難しくて先へ進めない」
* 「AIから言われたコマンドを実行して大丈夫なのかわからない」

といった問題を、**初心者の言葉から逆引きして解決へ導く完全クライアントサイド完結型ナビゲーションツール**です。

単なる30個のツール集ではなく、**「困りごと → 技術概念 → 解決方法 → AIへの質問」**を一本の流れとして提供します。

---

## コンセプト

AI開発では、技術知識そのものよりも、

> **「自分が何に困っているのかを技術的な言葉に変換できない」**

ことが初心者の大きな障壁になります。

本プロジェクトでは、専門用語を知らなくても、

* 「GitHubに載せたい」
* 「ファイルが消えた」
* 「赤い文字がいっぱい出た」
* 「AIにどう頼めばいい？」
* 「このコマンドを実行して大丈夫？」
* 「AIの答えが難しくてわからない」

といった自然な言葉から検索できます。

検索結果では、

1. **まず知っておくこと**: いま何が起きているのかを初心者目線で解説
2. **解決手順**: 具体的な確認事項や対処ステップ（参考コマンド付き）
3. **注意・やってはいけないこと**: 破壊的操作やデータ消失を防ぐ警告
4. **AIに相談する**: 環境（OS・言語）を反映した質問文の自動生成・ワンクリックコピー
5. **関連する困りごと**: 次に遭遇しやすい問題のサジェスト

を順番に提示します。

---

## 主な特徴

### 1. 完全ブラウザ完結（サーバーレス・APIキー不要）
* アカウント登録不要
* 専用バックエンドサーバー不要
* AI APIキー不要
* すべての処理はブラウザ（ローカル）内で完結
* 入力内容や履歴を外部サーバーへ一切送信しないプライバシー保護設計

### 2. 初心者の言葉から検索（シノニム辞書 & 重み付きスコアリング）
専門用語だけでなく、初心者が実際に使う日常表現を検索対象とします。

| 初心者の言葉 | 関連する概念 |
| :--- | :--- |
| GitHubに載せたい | push / publish / deploy |
| 消えたファイルを戻したい | restore / reset / checkout |
| 赤い文字が出た | error / exception / traceback |
| AIにどう頼めばいい？ | prompt / instruction / template |

### 3. Micro-Core & Plugin指向アーキテクチャ
Core基盤（登録・検索・履歴・ルーティング）と知識コンテンツ（Plugin）を完全に分離。全30個のプラグインは同一の共通インターフェース（`ProblemPlugin`）に準拠して実装されており、高い拡張性を持ちます。

### 4. 状況に応じたAI質問文の生成 & 秘匿情報サニタイズ
各問題に応じて、OSやプログラミング言語、ユーザーの状況を差し込んだAI向け質問文を自動生成します。
* 生成文のクリップボードワンクリックコピー
* ChatGPT / Claude / Gemini Web版への直接リンク
* APIキーやトークン等の秘匿情報が入力された場合、自動で `[REDACTED]` へ置換し警告するサニタイズ機能を標準搭載

### 5. 学習履歴のローカル管理
* 検索クエリ、閲覧プラグイン、生成プロンプトをブラウザ内（LocalStorage）に最大500件まで自動記録
* 履歴の個別削除・全消去
* JSONファイルによる履歴のエクスポートおよびインポート機能

---

## 初期30プラグイン一覧（全件実装完了）

仕様書第8章に定義された全30プラグインがすべて実装・検証済みです。

### Error（エラー解決系: 5件）
1. **エラー翻訳・要約ナビ** (`err-explainer`): 赤い文字が出た / エラーの意味がわからない
2. **原因切り分けガイド** (`err-cause-finder`): なんで動かないの / 原因がわからない
3. **ログ抜粋・整理ツール** (`err-log-cleaner`): ログが長すぎる / どこをAIに見せればいい？
4. **エラー相談プロンプト生成** (`err-ai-consultant`): AIにエラーをどう聞く？ / 直し方を聞きたい
5. **修正案安全性チェッカー** (`err-fix-checker`): AIの言った通りにして大丈夫？ / コードを上書きしていい？

### AI（AI活用・指示出し系: 10件）
6. **開発用プロンプト作成ナビ** (`ai-prompt-creator`): AIへの指示の書き方 / プロンプトのテンプレート
7. **指示文抜け漏れ診断** (`ai-instruction-check`): 伝わらない / AIが意図と違うコードを出す
8. **AIへの作業依頼分割ガイド** (`ai-task-delegation`): 一気に頼みすぎて失敗した / 小分けにして頼みたい
9. **回答整理・要点抽出** (`ai-response-organizer`): AIの回答が長くて難しい / 結局何すればいい？
10. **次のアクション抽出** (`ai-todo-extractor`): 次に何をすればいい？ / TODOの整理
11. **AI回答比較・検証** (`ai-answer-compare`): 別のAIにも聞きたい / どっちの答えが正しい？
12. **コード差分確認ナビ** (`ai-diff-analyzer`): どこが変わったかわからない / 変更点だけ知りたい
13. **送信前情報サニタイザー** (`ai-input-sanitizer`): パスワードやキーをAIに送って大丈夫？ / 秘密情報消したい
14. **実行前セーフティチェック** (`ai-pre-check`): このコード動かして壊れない？ / 実行前の確認
15. **生成コード動作検証ガイド** (`ai-post-check`): ちゃんと動いてるか確認したい / テストのやり方

### Git / Command（コマンド・バージョン管理系: 6件）
16. **コマンド解説ナビ** (`cmd-explainer`): この黒い画面のコマンド何？ / 意味を知りたい
17. **危険コマンド判定** (`cmd-risk-analyzer`): 実行したら危ないコマンド？ / 消去コマンドの警告
18. **Git概念超入門** (`git-concept`): コミットって何？ / プッシュとプルの違い
19. **Git危険操作チェッカー** (`git-risk-checker`): resetして大丈夫？ / 強制プッシュの危険
20. **Git用語辞典** (`git-terms`): originって何？ / HEADって何？ / ブランチとは
21. **Gitトラブル救助隊** (`git-trouble-helper`): コンフリクトした / 間違えてコミットした / 戻したい

### File（ファイル・構成理解系: 5件）
22. **プロジェクト構成ナビ** (`file-structure`): どのフォルダに何を置く？ / ファイル構成がわからない
23. **拡張子ガイド** (`file-ext-explainer`): .jsonって何？ / .envって何？ / ファイルの種類
24. **設定ファイル見取り図** (`file-config-checker`): package.jsonの読み方 / tsconfigって何？
25. **環境変数・.env保護ガイド** (`file-env-safety`): .envをGitHubに上げちゃダメ？ / APIキーの隠し方
26. **不要ファイル整理ナビ** (`file-cleaner`): どれを消していい？ / node_modulesって消して平気？

### Dev Support（開発補助系: 4件）
27. **Markdown作成ナビ** (`dev-md-formatter`): READMEの書き方 / メモをきれいにまとめたい
28. **Markdown表生成ツール** (`dev-md-table`): 表を作りたい / テーブルの書き方
29. **JSON構文チェッカー** (`dev-json-validator`): JSONエラーが出た / カンマの位置がわからない
30. **AI任せ vs 人間確認境界ガイド** (`dev-ai-vs-human`): どこまでAIに任せていい？ / 自分で確認すべきところ

---

## ディレクトリ構成

```text
ai-dev-beginner-navigator/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions 自動デプロイ設定
├── public/
│   └── favicon.svg            # ファビコンアセット
├── src/
│   ├── core/                  # Micro-Core基盤
│   │   ├── history.ts         # 履歴ストア（LocalStorage / FIFO 500件）
│   │   ├── index.ts           # Core一括エクスポート
│   │   ├── registry.ts        # プラグイン登録・重複検証
│   │   ├── sanitizer.ts       # 秘匿情報マスク
│   │   ├── search.ts          # 重み付きスコア検索エンジン
│   │   └── synonyms.ts        # 初心者語句シノニム辞書
│   ├── plugins/               # 全30プラグイン実装
│   │   ├── ai/                # AI系（10プラグイン）
│   │   ├── dev/               # Dev Support系（4プラグイン）
│   │   ├── error/             # Error系（5プラグイン）
│   │   ├── file/              # File系（5プラグイン）
│   │   ├── git/               # Git/Command系（6プラグイン）
│   │   └── index.ts           # プラグイン一括登録・集計
│   ├── types/                 # 厳格なTypeScript型定義
│   │   ├── history.ts         # 履歴・ストレージ型
│   │   ├── index.ts           # 型定義一括エクスポート
│   │   ├── plugin.ts          # プラグイン・メタデータ・ステップ型
│   │   └── search.ts          # 検索クエリ・結果型
│   ├── ui/                    # UIコンポーネント & スタイル
│   │   ├── components/        # 検索バー、カテゴリタブ、解決ビュー等
│   │   ├── styles/            # ミニマル・ダークUIデザインシステム
│   │   ├── utils/             # Toast通知等のUIユーティリティ
│   │   └── router.ts          # ハッシュルーター（#/、#/plugin/:id）
│   └── main.ts                # エントリーポイント & 初期化ブートストラップ
├── tests/                     # 自動テストスイート
│   ├── audit.test.ts          # 仕様書第19章完成条件（全15項目）自動監査
│   ├── core.test.ts           # Core基盤単体テスト
│   └── plugins.test.ts        # 全30プラグイン構造・初心者フレーズ検索テスト
├── index.html                 # メインHTML
├── LICENSE                    # MIT License
├── package.json               # プロジェクト定義 & スクリプト
├── tsconfig.json              # TypeScript Strict Mode 設定
├── vite.config.ts             # Viteビルド設定
├── ツール起動.bat              # Windows用ワンクリック簡単起動バッチ
├── 仕様書.md                  # 仕様書 (Ver 1.0.0 確定版)
├── 実装計画書.md              # 全体実装計画書
├── RECORD.md                  # 開発記録・決定事項ログ
└── README.md                  # 本ドキュメント
```

---

## セットアップ & ローカル起動手順

### 動作要件
* Node.js: 20.x / 22.x 推奨
* npm: 10.x 以上

### 簡単起動（Windows）
プロジェクト直下の **`ツール起動.bat`** をダブルクリックするだけで、初回依存パッケージのインストールからブラウザの自動起動まで自動的に実行されます。

### コマンドラインからの起動手順

#### 1. リポジトリのクローン
```bash
git clone https://github.com/tk030-lotto/ai-dev-beginner-navigator.git
cd ai-dev-beginner-navigator
```

#### 2. 依存パッケージのインストール
```bash
npm install
```

#### 3. 開発サーバーの起動
```bash
npm run dev
```
起動後、ブラウザで `http://localhost:3000` にアクセスしてください。

### 4. 自動テストの実行
```bash
npm test
```
Core基盤テスト、全30プラグイン構造テスト、および仕様書第19章（完成条件チェックリスト15項目）の監査テストが実行されます。

### 5. 本番ビルド
```bash
npm run build
```
型チェック（`tsc`）が行われた後、`dist/` ディレクトリに最適化された静的ファイル群が出力されます。

---

## プライバシー & セキュリティ方針

* **外部通信ゼロ**: ユーザーが入力したキーワード、閲覧履歴、生成したプロンプトはブラウザ内部（LocalStorage）でのみ保持され、外部サーバーへ送信されることは一切ありません。
* **破壊的操作の抑止**: `rm -rf` や `git reset --hard` 等の危険コマンドをアプリから自動実行する仕組みは存在せず、安全な代替手順や確認手順のみを提示します。
* **秘匿情報サニタイズ**: APIキー（OpenAI, GitHub, AWS, 秘密鍵等）が誤って入力・コピーされるのを防ぐため、自動検出および `[REDACTED]` 置換機能が動作します。

---

## ライセンス

本ソフトウェアは [MIT License](LICENSE) のもとで公開されています。

```text
MIT License

Copyright (c) 2026 tk030-lotto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

