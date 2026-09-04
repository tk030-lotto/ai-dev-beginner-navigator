/**
 * Error代表プラグイン: エラー翻訳・要約ナビ
 * ID: err-explainer
 * 初心者の「赤い文字が出た」「英語がいっぱい」という困りごとを、
 * エラー箇所の特定と原因の切り分け手順へと翻訳する。
 */

import { ProblemPlugin } from '../../types';

export const errExplainerPlugin: ProblemPlugin = {
  metadata: {
    id: 'err-explainer',
    name: 'エラー翻訳・要約ナビ',
    category: 'error',
    description: '英語のエラーログやスタックトレースから、何が起きているのか・どこを見ればよいのかを整理して解説します。',
    keywords: [
      'エラー',
      'error',
      '例外',
      'exception',
      'スタックトレース',
      'stack trace',
      '動かない',
      'クラッシュ',
      'TypeError',
      'ReferenceError',
      'SyntaxError',
    ],
    beginnerPhrases: [
      '赤い文字が出た',
      'エラーって書いてある',
      '動かなくなった',
      '英語がいっぱい',
      'コンソールエラー',
      'Traceback',
      '何が書いてあるかわからない',
    ],
  },

  knowledge: {
    summary: 'プログラミングのエラーメッセージは「どこで、何が原因で停止したか」を教えてくれるコンピュータからの手紙です。全文を理解しようとせず、最初と最後に着目するのが解決の第一歩です。',
    steps: [
      {
        step: 1,
        title: 'エラーログの一番下（最下行）を確認する',
        detail: 'エラー文（スタックトレース）の多くは、一番下の行に具体的なエラーの種類（TypeError、Cannot read propertyなど）と直接の理由が書かれています。まずは最下行の1〜2行を読みます。',
      },
      {
        step: 2,
        title: '自分が書いたファイル名と行番号を探す',
        detail: 'ログの中に「src/index.ts:42」のように、自分で編集したファイル名と行番号（:の後の数字）が含まれている行を探します。node_modulesなどの外部ライブラリの行は読み飛ばして問題ありません。',
      },
      {
        step: 3,
        title: '直前の変更箇所とエラー行を突き合わせる',
        detail: '指摘された行番号の前後5行を確認し、スペルミス、カッコの閉じ忘れ、未定義の変数を使っていないかをチェックします。',
      },
    ],
    cautions: [
      'エラーメッセージを読まずにコードをあちこち適当に変更しない（問題が複雑化します）。',
      'エラーログをAIに相談する際は、ログ内にAPIキーや個人パスなどの秘密情報が含まれていないか確認する。',
      '外部ライブラリ（node_modules内など）のコードを直接書き換えて修正しようとしない。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'エラー原因と解決策の質問',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript / Node.js';
        const detail = context.detail || '（ここにターミナルやコンソールに表示されたエラーメッセージ全文を貼り付けてください）';

        return `【開発環境】
OS: ${os}
使用言語/フレームワーク: ${lang}

【発生しているエラー】
${detail}

【相談したいこと】
1. このエラーは何が原因で発生していますか？初心者向けにわかりやすく説明してください。
2. 自分が作成したコードのどこをどのように修正すべきか、具体的なコード例を含めて教えてください。
3. 今後同じエラーを防ぐための注意点があれば教えてください。`;
      },
    },
    {
      targetAi: 'Claude',
      title: 'エラー文の詳細解説と段階的トラブルシューティング',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript / JavaScript';
        const detail = context.detail || '（エラーログ全文）';

        return `あなたはプログラミング初学者を支援するエンジニアです。
以下のエラーが発生して困っています。段階を追って原因特定と解決方法を案内してください。

環境: ${os}, ${lang}
エラーログ:
\`\`\`
${detail}
\`\`\`

回答要件:
- エラー文の中で最も重要な1行を抜き出して日本語訳してください。
- なぜこのエラーが発生したのか、背後にある仕組みを平易に解説してください。
- 修正ステップを番号付きで提示してください。`;
      },
    },
  ],
};
