import { ProblemPlugin } from '../../types';

export const gitPrTemplatePlugin: ProblemPlugin = {
  metadata: {
    id: 'git-pr-template',
    name: 'プルリクエスト（PR）作成ナビ',
    category: 'git',
    description: '変更内容をレビュアーにわかりやすく伝えるプルリクエスト説明文の作成手順を案内します。',
    keywords: ['PR', 'Pull Request', 'プルリク', 'GitHub', 'マージ', 'レビュー依頼'],
    beginnerPhrases: [
      'プルリクの書き方がわからない',
      'PRの概要どう書く？',
      'GitHubでレビューを頼みたい',
      '変更内容の説明文',
    ],
  },
  knowledge: {
    summary:
      'プルリクエスト（PR）は、自分の作業ブランチの変更をメインブランチに取り込んでもらうための申請です。「変更の目的（Why）」「変更内容（What）」「動作確認手順（How to test）」を簡潔に書くことで、スムーズに承認（Approve）を得られます。',
    steps: [
      {
        step: 1,
        title: '作業ブランチをリモートにプッシュする',
        detail: 'ローカルでコミットしたブランチをGitHubへ送信します。',
        command: 'git push -u origin <branch-name>',
      },
      {
        step: 2,
        title: 'GitHubで「Compare & pull request」をクリックする',
        detail:
          'リポジトリ画面の上部に表示される黄色のバー、または「Pull requests」タブの「New pull request」ボタンをクリックします。',
      },
      {
        step: 3,
        title: 'テンプレートに沿ってPR説明文を記述する',
        detail:
          'タイトルは「feat: お気に入り登録機能の追加」のように接頭辞を付け、本文には背景・変更点・確認済みテスト結果を記載します。',
      },
    ],
    cautions: [
      '1つのPRで無関係な複数の改修（機能追加と無関係なファイル整形など）を混ぜないでください。レビューが難航します。',
      'マージ先（Base branch）が main や master など意図したブランチになっているか必ず確認してください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'PR説明文生成プロンプト',
      generate: (context) => {
        const detail = context.detail || '新機能の追加と軽微なバグ修正を行いました。';
        return `GitHubのプルリクエスト（Pull Request）を作成するための説明文を作成してください。

【今回の作業内容】
${detail}

【出力フォーマット】
以下のMarkdown構成で作成してください。
1. **PRタイトル**（feat / fix / docs などのプレフィックス付き）
2. **概要・背景**（なぜこの変更が必要だったのか）
3. **主な変更点**（箇条書きで分かりやすく）
4. **動作確認手順**（レビュアーが手元で動作を再現・検証する方法）
5. **レビュアーへの特記事項**（特に見てほしい箇所や懸念点）`;
      },
    },
  ],
};
