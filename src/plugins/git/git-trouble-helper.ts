/**
 * Gitプラグイン: Gitトラブル救助隊
 * ID: git-trouble-helper
 * 「コンフリクト（衝突）してプッシュできない」「間違えて変なコミットをしてしまった」「プッシュが弾かれた」初心者に、
 * 発生頻度の高い3大Gitトラブルの解決ステップを提供する。
 */

import { ProblemPlugin } from '../../types';

export const gitTroubleHelperPlugin: ProblemPlugin = {
  metadata: {
    id: 'git-trouble-helper',
    name: 'Gitトラブル救助隊',
    category: 'git',
    description: 'コンフリクト（衝突）、プッシュ拒否（rejected）、直前のコミット間違いなど、初心者が遭遇しやすいGitトラブルを安全に解決します。',
    keywords: [
      'Gitトラブル',
      'コンフリクト解消',
      'conflict',
      'push rejected',
      'コミット取り消し',
      'プッシュできない',
      '競合',
    ],
    beginnerPhrases: [
      'コンフリクトした',
      '間違えてコミットした',
      '戻したい',
      'プッシュが拒否された',
      'conflict',
      'コミットを取り消したい',
      'GitHubに送れない',
    ],
  },

  knowledge: {
    summary: 'Gitトラブルで多いのは「GitHub側が新しくなっていてローカルからpushできない（rejected）」と「同じ行を別々に直して衝突した（conflict）」です。どちらも「まずpullして、衝突マーク（<<<<<<<）を手で直して再度コミットする」ことで解決できます。',
    steps: [
      {
        step: 1,
        title: 'プッシュ拒否（rejected）のときはまず pull する',
        detail: 'GitHub上の最新コミットをローカルに取り込むため、git pull origin main を実行します。',
        command: 'git pull origin main',
      },
      {
        step: 2,
        title: 'コンフリクト記号（<<<<<<<）を探して整理する',
        detail: 'ファイル内に「<<<<<<< HEAD（自分の変更）」「=======」「>>>>>>>（相手の変更）」という記号が挿入されるので、残したいコードだけを残して記号の行を消します。',
      },
      {
        step: 3,
        title: '直したファイルを add して再度コミットする',
        detail: 'コンフリクト記号を全て消したら、ファイルを保存してコミットし、再度プッシュします。',
        command: 'git commit -m "fix: resolve merge conflict"',
      },
    ],
    cautions: [
      'コンフリクト記号（<<<<<<< や =======）が残ったままだと、プログラムが文法エラーで動きません。必ず消すこと。',
      '直前のコミットメッセージを打ち間違えただけなら「git commit --amend」で書き直せます。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'Gitコンフリクト・エラーログ救済相談',
      generate: (context) => {
        const detail = context.detail || '（ターミナルに表示されたGitのエラー文、またはコンフリクト箇所）';

        return `Gitの操作中にエラー（またはコンフリクト）が発生して作業が止まってしまいました。助けてください。

【発生したエラーログ / 状況】
\`\`\`
${detail}
\`\`\`

【教えてほしいこと】
1. なぜこのエラー・競合が起きたのか、何が原因かを平易に教えてください。
2. 自分の大切な変更コードを消さずに、安全にこの状態を解消するための具体的な手順（コマンドとファイルの操作）をステップ順に示してください。
3. 今後同じトラブルを起こさないためのGit運用の予防策を教えてください。`;
      },
    },
  ],
};
