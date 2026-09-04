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
  // 3. エラー・障害系
  {
    phrases: ['動かない', '落ちる', '赤文字', '止まった', '動かなくなった', 'バグ', 'クラッシュ', '失敗'],
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
  for (const mapping of SYNONYM_DICTIONARY) {
    const matchesPhrase = mapping.phrases.some(
      (phrase) => normalized.includes(phrase.toLowerCase()) || tokens.includes(phrase.toLowerCase())
    );
    const matchesConcept = mapping.concepts.some(
      (concept) => normalized.includes(concept.toLowerCase()) || tokens.includes(concept.toLowerCase())
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
