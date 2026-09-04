/**
 * Dev Support代表プラグイン: JSON構文チェッカー
 * ID: dev-json-validator
 * 初心者の「JSONエラーが出た」「カンマの位置がわからない」という困りごとを、
 * 構文ルールの理解と修正手順へと翻訳する。
 */

import { ProblemPlugin } from '../../types';

export const devJsonValidatorPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-json-validator',
    name: 'JSON構文チェッカー',
    category: 'dev-support',
    description: 'package.jsonや設定ファイルで発生しやすいJSON構文エラー（末尾カンマ、クォーテーション違い等）の原因と修正方法を解説します。',
    keywords: [
      'JSON',
      '構文エラー',
      'SyntaxError',
      'Unexpected token',
      'JSON.parse',
      'カンマ',
      'クォート',
      'package.json',
      'tsconfig.json',
      'パースエラー',
    ],
    beginnerPhrases: [
      'JSONエラーが出た',
      'カンマの位置がわからない',
      'Unexpected token',
      '赤い波線が出た',
      'JSONが壊れた',
      '設定ファイルが読めない',
      'JSONの書き方がわからない',
    ],
  },

  knowledge: {
    summary: 'JSON（JavaScript Object Notation）は機械が厳格に解析するためのデータ形式です。JavaScriptのオブジェクト記法と似ていますが、「シングルクォート禁止」「末尾カンマ禁止」「コメント禁止」という厳格な3大ルールがあります。',
    steps: [
      {
        step: 1,
        title: '末尾の余分なカンマ（Trailing Comma）を削除する',
        detail: '配列 `[1, 2,]` や オブジェクト `{"a": 1,}` のように、最後の要素の後ろに置かれたカンマはJSONでは文法エラーになります。最後のカンマを消去します。',
      },
      {
        step: 2,
        title: 'すべての文字列とキーをダブルクォーテーション（"）で囲む',
        detail: 'シングルクォーテーション（\'）やバッククォート（`）はJSONでは使用できません。必ず半角の二重引用符（"）を使います。',
      },
      {
        step: 3,
        title: 'コメント行（// や /* */）を削除する',
        detail: '標準のJSON仕様ではコメントを書くことができません。説明のために書いたメモや一時的なコメントアウトを削除します。',
      },
    ],
    cautions: [
      '全角スペースや全角クォーテーション（”、’）が混入していると、見た目では気付きにくいエラーになります。',
      'VS Code等のエディタで赤い波線が表示されている箇所だけでなく、その直前の行のカンマ抜け・余分なカンマも確認してください。',
      'package.json が壊れると npm コマンド全般が動作しなくなります。修正前にファイルのバックアップをとることを推奨します。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'JSON構文チェックと修正依頼',
      generate: (context) => {
        const detail = context.detail || '（エラーが発生しているJSONテキストを貼り付けてください）';

        return `以下のJSONデータで構文エラーが発生しています。

\`\`\`json
${detail}
\`\`\`

【依頼事項】
1. 文法的に間違っている箇所（行番号と理由）をすべて指摘してください。
2. 正しい構文に修正した完全なJSONコードを提示してください。
3. 初心者がJSONを書く際につまずきやすいポイントを簡潔に教えてください。`;
      },
    },
    {
      targetAi: 'Claude',
      title: 'package.json破損リカバリプロンプト',
      generate: (context) => {
        const detail = context.detail || '（package.jsonの内容）';

        return `Node.jsプロジェクトの package.json が構文エラーで破損し、npmコマンドが実行できなくなりました。

現在の package.json:
\`\`\`json
${detail}
\`\`\`

エラーを修正した有効な package.json を生成してください。依存関係（dependencies）やスクリプト（scripts）の構造を壊さないよう注意してください。`;
      },
    },
  ],
};
