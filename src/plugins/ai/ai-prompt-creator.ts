/**
 * AI代表プラグイン: 開発用プロンプト作成ナビ
 * ID: ai-prompt-creator
 * 初心者の「AIにどう頼めばいい？」「指示が伝わらない」という困りごとを、
 * 具体的かつ手戻りのないプロンプト構成へと翻訳する。
 */

import { ProblemPlugin } from '../../types';

export const aiPromptCreatorPlugin: ProblemPlugin = {
  metadata: {
    id: 'ai-prompt-creator',
    name: '開発用プロンプト作成ナビ',
    category: 'ai',
    description: 'AIにプログラミングの質問やコード生成を依頼する際、的確な回答を引き出すためのプロンプト設計をサポートします。',
    keywords: [
      'プロンプト',
      'prompt',
      'AI指示',
      'ChatGPT',
      'Claude',
      'Gemini',
      '質問のコツ',
      'コード生成',
      '指示文',
      'エンジニアリング',
    ],
    beginnerPhrases: [
      'AIにどう頼めばいい？',
      'プロンプトの書き方',
      '指示が伝わらない',
      '思ったのと違うコードが出る',
      'AIの返事が的外れ',
      '何て聞けばいいかわからない',
      '質問文の作り方',
    ],
  },

  knowledge: {
    summary: 'AIは文脈（Context）が不足していると、一般的な推測で回答してしまいます。「役割」「前提条件（OSや言語）」「目的」「制約」の4点を整理して伝えることで、精度が劇的に向上します。',
    steps: [
      {
        step: 1,
        title: '前提条件（OS・言語・バージョン）を明記する',
        detail: '同じJavaScriptでもブラウザなのかNode.jsなのか、どのフレームワークを使っているかで正解が異なります。まず環境を1行で伝えます。',
      },
      {
        step: 2,
        title: '「やりたいこと（Goal）」と「現在の問題」を分ける',
        detail: '「動かない」だけではなく、「期待していた動作」と「実際に起きた現象（エラーや無反応）」を分けて伝えます。',
      },
      {
        step: 3,
        title: '出力形式や制約条件を指定する',
        detail: '「初心者向けにステップ解説してください」「変更が必要なファイルとコード差分だけを提示してください」など、欲しい形式を指定します。',
      },
    ],
    cautions: [
      '「アプリを丸ごと作って」と一度に大量の要件を指示しない（小さく1機能ずつ依頼する）。',
      '生成されたコードの意味を全く理解しないまま、コピペだけで作業を進めない。',
      'APIキーや本番データベースのパスワードなどの秘密情報をプロンプトに貼り付けない。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: '標準・開発依頼プロンプト（汎用）',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript / Node.js';
        const detail = context.detail || '（実現したい機能や修正したい挙動を記載）';

        return `あなたは経験豊富なシニアソフトウェアエンジニアです。
プログラミング初心者の私をサポートしてください。

【実行環境】
- OS: ${os}
- 言語/フレームワーク: ${lang}

【実現したいこと・目標】
${detail}

【回答時の制約・希望】
1. 初心者にも理解できるよう、専門用語には平易な解説を添えてください。
2. 修正すべきファイルパスと、該当するコード差分（または完成コード）を提示してください。
3. コードを動かすための実行コマンドやテスト手順も合わせて教えてください。`;
      },
    },
    {
      targetAi: 'ChatGPT',
      title: 'ステップバイステップ実装プロンプト',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript';
        const detail = context.detail || '（機能概要）';

        return `以下の機能を段階的に実装したいです。一気に大量のコードを書くのではなく、ステップごとに解説してください。

【環境】${os} / ${lang}
【作成したい機能】
${detail}

まずは「全体の設計方針」と「ステップ1で行うこと」だけを提示してください。私が確認した後に次のステップへ進みます。`;
      },
    },
  ],
};
