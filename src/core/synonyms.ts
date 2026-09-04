/**
 * シノニム辞書および語句展開ユーティリティ
 * 仕様書 第7章（シノニム）に完全準拠
 */

export interface SynonymMapping {
  /** 初心者表現・類似表現リスト */
  phrases: string[];
  /** 内部概念・関連技術用語リスト */
  concepts: string[];
}

/**
 * 仕様書第7章に準拠した基本シノニム定義
 */
export const SYNONYM_DICTIONARY: SynonymMapping[] = [
  // 1. アップロード・公開系
  {
    phrases: ['アップしたい', '載せたい', '公開したい', '送りたい', 'アップロード', 'あげたい', '反映したい'],
    concepts: ['push', 'deploy', 'publish', 'commit', 'upload'],
  },
  // 2. 復旧・取消系
  {
    phrases: ['消えた', '戻したい', '取り消したい', 'やり直したい', '消去', '消した', '復元', '元に戻す'],
    concepts: ['restore', 'revert', 'reset', 'undo', 'recover'],
  },
  // 3. エラー・障害系（仕様書第7章準拠）
  {
    phrases: ['動かない', '落ちる', '赤文字', '止まった', '動かなくなった', 'バグ', 'クラッシュ'],
    concepts: ['error', 'exception', 'failed', 'trouble', 'crash', 'bug'],
  },
  // 4. プロンプト・指示系
  {
    phrases: ['書き方', 'どう指示する', 'テンプレ', 'テンプレート', '聞き方', 'AIへの指示', 'プロンプト'],
    concepts: ['prompt', 'instruction', 'template'],
  },
  // 5. ターミナル・黒い画面系
  {
    phrases: ['黒い画面', 'コマンド', '画面', 'ターミナル', 'コマンドプロンプト', '黒画面'],
    concepts: ['terminal', 'command', 'cli', 'bash', 'powershell'],
  },
  // 6. Git・バージョン管理系
  {
    phrases: ['衝突', 'コンフリクト', '混ざった', 'ぶつかった', '競合'],
    concepts: ['conflict', 'merge', 'git'],
  },
  // 7. 秘匿情報・環境変数系
  {
    phrases: ['キー', 'パスワード', '秘密', '隠したい', '漏洩', '公開したくない'],
    concepts: ['env', 'api-key', 'secret', 'token', 'credentials', 'security'],
  },
  // 8. 曖昧・漠然エラー系（初心者の最多パターン）
  {
    phrases: ['うまくいかない', 'なんかおかしい', '変になった', 'おかしくなった', 'よくわからない', '意味がわからない', 'なんか出た'],
    concepts: ['error', 'debug', 'trouble', 'unexpected', 'unknown'],
  },
  // 9. 画面・表示系
  {
    phrases: ['真っ白', '何も出ない', '白い画面', '何も表示されない', '画面が変', '表示されない', '映らない', '画面が崩れた'],
    concepts: ['blank', 'render', 'display', 'white screen', 'layout', 'css', 'html'],
  },
  // 10. インストール・環境構築系
  {
    phrases: ['インストール', '入れたい', '追加したい', '環境構築', '準備', 'セットアップ', '使い始め'],
    concepts: ['install', 'npm', 'package', 'setup', 'environment', 'node_modules'],
  },
  // 11. サンプル・書き方系
  {
    phrases: ['どう書けばいい', 'サンプルがほしい', '例を見たい', '書き方を教えて', 'どう使う', '使い方', '使い方がわからない'],
    concepts: ['example', 'template', 'how to', 'usage', 'sample', 'tutorial'],
  },
  // 12. ファイル・パス系
  {
    phrases: ['ファイルが開かない', '見つからない', 'ファイルがない', 'パスが違う', '場所がわからない', 'フォルダがない'],
    concepts: ['file not found', 'path', 'directory', 'import', 'module', 'require'],
  },
  // 13. 保存・リロード系
  {
    phrases: ['保存できない', '変更が反映されない', '更新されない', 'リロードしても変わらない', '保存しても変わらない'],
    concepts: ['save', 'hot reload', 'refresh', 'cache', 'build'],
  },
  // 14. 開発サーバー・ローカル確認系
  {
    phrases: ['ローカルで確認したい', 'プレビューしたい', '手元で動かしたい', '自分のPCで試したい', 'localhost'],
    concepts: ['localhost', 'dev server', 'preview', 'npm run dev', 'local'],
  },
  // 15. API・ネットワーク系
  {
    phrases: ['APIが使えない', '繋がらない', 'データが取れない', 'リクエストが失敗する', '通信できない', 'fetch失敗'],
    concepts: ['api', 'network', 'fetch', 'connection', 'request', 'cors', 'http'],
  },
  // 16. 認証・ログイン系
  {
    phrases: ['認証がわからない', 'ログインを作りたい', 'ログインできない', 'サインイン', 'アカウント', 'ユーザー管理'],
    concepts: ['auth', 'authentication', 'login', 'jwt', 'session', 'password'],
  },
  // 17. テスト・デバッグ系
  {
    phrases: ['テストを書きたい', 'テストが落ちる', 'デバッグしたい', '原因がわからない', 'どこが悪いか調べたい'],
    concepts: ['test', 'debug', 'unit test', 'assertion', 'vitest', 'jest'],
  },
  // 18. Git ブランチ・切り替え系
  {
    phrases: ['ブランチを作りたい', 'ブランチを切り替えたい', '別のブランチ', 'main に戻したい', 'ブランチがわからない'],
    concepts: ['branch', 'checkout', 'switch', 'git branch', 'git checkout'],
  },
  // 19. GitHub PR・レビュー系
  {
    phrases: ['プルリクエスト', 'PR', 'レビューしてもらいたい', 'マージしたい', 'コードを見てもらいたい'],
    concepts: ['pull request', 'PR', 'merge', 'review', 'github'],
  },
  // 20. 型・TypeScript系
  {
    phrases: ['型エラー', 'TypeScriptエラー', '型が合わない', '型を付けたい', 'tsエラー', '型定義'],
    concepts: ['typescript', 'type error', 'type definition', 'interface', 'generic'],
  },
  // 21. 依存関係・バージョン系
  {
    phrases: ['バージョンが合わない', 'パッケージが古い', '依存関係のエラー', 'npm install に失敗', 'node_modulesを消したい'],
    concepts: ['dependency', 'version', 'npm', 'package.json', 'lock file', 'node_modules'],
  },
  // 22. データベース系
  {
    phrases: ['データを保存したい', 'DBを使いたい', 'データベース', 'データが消える', '永続化したい'],
    concepts: ['database', 'db', 'storage', 'persist', 'sql', 'nosql'],
  },
  // 23. デプロイ・本番公開系
  {
    phrases: ['本番に出したい', '公開環境', 'デプロイしたい', 'リリースしたい', 'サーバーに上げたい'],
    concepts: ['deploy', 'production', 'release', 'hosting', 'vercel', 'netlify', 'github pages'],
  },
  // 24. スタイル・CSS系
  {
    phrases: ['デザインを変えたい', '見た目がおかしい', 'CSSが効かない', 'スタイルが当たらない', 'レイアウトが崩れた'],
    concepts: ['css', 'style', 'layout', 'design', 'class', 'selector'],
  },
  // 25. コピー・貼り付け・参考コード系
  {
    phrases: ['コピペしたら動かない', '参考コードが動かない', '写したら違うエラーになった', 'そのまま使えない'],
    concepts: ['copy paste', 'reference', 'compatibility', 'version mismatch'],
  },
  // 26. ループ・処理系
  {
    phrases: ['止まらない', '無限ループ', 'ぐるぐる回る', '処理が終わらない', 'フリーズした'],
    concepts: ['infinite loop', 'hang', 'freeze', 'performance', 'async'],
  },
  // 27. 非同期・await系
  {
    phrases: ['await', 'async', '非同期', 'Promiseがわからない', 'データが後から来る', 'タイミングがずれる'],
    concepts: ['async', 'await', 'promise', 'asynchronous', 'callback'],
  },
  // 28. コミット・履歴系
  {
    phrases: ['コミットしたい', 'どこを変えたか確認したい', '変更履歴', '差分を見たい', 'gitログ'],
    concepts: ['commit', 'git log', 'git diff', 'history', 'change log'],
  },
  // 29. エラーメッセージ解読系
  {
    phrases: ['英語のエラーが読めない', 'エラーの意味がわからない', '英語で怒られた', 'エラー文が長すぎる'],
    concepts: ['error message', 'english', 'translate', 'stack trace', 'log'],
  },
  // 30. AI回答の理解・活用系
  {
    phrases: ['AIの回答が難しい', 'AIが言ってることがわからない', 'AIのコードをどう使う', 'AIの説明を噛み砕いてほしい'],
    concepts: ['explanation', 'simplify', 'ai response', 'understand', 'beginner'],
  },

];

/**
 * 検索入力テキストをトークン化し、シノニム辞書に基づいて展開された全用語リストを返す
 * @param queryText ユーザー入力文字列
 * @returns 重複のない検索展開語リスト（小文字化済み）
 */
export function expandSynonyms(queryText: string): string[] {
  if (!queryText || !queryText.trim()) {
    return [];
  }

  const normalized = queryText.toLowerCase().trim();
  const resultSet = new Set<string>();

  // 入力された元の文字列を追加
  resultSet.add(normalized);

  // 空白区切りでトークン化して個別単語も追加
  const tokens = normalized.split(/[\s,、。]+/g).filter((t) => t.length > 0);
  for (const token of tokens) {
    resultSet.add(token);
  }

  // シノニム辞書との照合
  // 部分一致（includes）とトークン完全一致の両方でマッチ判定する
  // 例: 「赤文字が出た」は normalized.includes('赤文字') でヒットする
  for (const mapping of SYNONYM_DICTIONARY) {
    const matchesPhrase = mapping.phrases.some(
      (phrase) =>
        normalized.includes(phrase.toLowerCase()) ||
        tokens.includes(phrase.toLowerCase())
    );
    const matchesConcept = mapping.concepts.some(
      (concept) =>
        normalized.includes(concept.toLowerCase()) ||
        tokens.includes(concept.toLowerCase())
    );

    if (matchesPhrase || matchesConcept) {
      // マッチした場合、phrasesとconceptsの全語句を展開対象として追加
      for (const p of mapping.phrases) {
        resultSet.add(p.toLowerCase());
      }
      for (const c of mapping.concepts) {
        resultSet.add(c.toLowerCase());
      }
    }
  }

  return Array.from(resultSet);
}
