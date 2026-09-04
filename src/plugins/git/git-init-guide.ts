import { ProblemPlugin } from '../../types';

export const gitInitGuidePlugin: ProblemPlugin = {
  metadata: {
    id: 'git-init-guide',
    name: '新規Gitリポジトリ初期化手順ナビ',
    category: 'git',
    description: '作ったばかりのプロジェクトをGitで管理開始し、GitHubに初回プッシュするまでの完全手順です。',
    keywords: ['git init', 'GitHub連携', '初回プッシュ', 'リポジトリ作成', 'リモート登録'],
    beginnerPhrases: [
      'Gitを最初から始めたい',
      '作ったフォルダをGitHubに上げたい',
      'git initのやり方',
      'リモートの繋ぎ方がわからない',
    ],
  },
  knowledge: {
    summary:
      '新しいプロジェクトをGitで管理するには、`git init` で管理を開始し、`.gitignore` を用意した上で初回コミットを行い、GitHubで作成したリモートURLを `git remote add` してプッシュします。',
    steps: [
      {
        step: 1,
        title: 'プロジェクトフォルダでGit初期化を行う',
        detail: 'プロジェクトのルートディレクトリ（一番上の階層）で初期化コマンドを実行します。',
        command: 'git init -b main',
      },
      {
        step: 2,
        title: '.gitignoreを作成し、不要ファイルを除外して初回コミット',
        detail: 'node_modulesや.envなどの不要・機密ファイルを管理対象から外してからコミットします。',
        command: 'git add . && git commit -m "feat: initial commit"',
      },
      {
        step: 3,
        title: 'GitHubリモートリポジトリを紐付けてプッシュする',
        detail: 'GitHub上で空のリポジトリを作成し、表示されたURLを登録して送信します。',
        command: 'git remote add origin <GitHubのURL> && git push -u origin main',
      },
    ],
    cautions: [
      'ホームディレクトリやデスクトップそのもの（親すぎる階層）で git init を実行しないでください。PC全体がGit管理されてしまいます。',
      '初回コミットの前に必ず `.gitignore` が配置されているか確認してください。大容量ファイルやAPIキーがコミット履歴に残ると削除が困難になります。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'Git初期化トラブル相談プロンプト',
      generate: (context) => {
        const os = context.os || 'Windows';
        const detail = context.detail || 'プロジェクトをGit管理し、GitHubにプッシュしようとしたところでエラーが出ました。';
        return `新規プロジェクトをGitで初期化し、GitHubにプッシュする段階で困っています。
OS環境: ${os}

【困っている状況】
${detail}

【質問内容】
1. 現在の状態（ブランチ名、リモート連携状況）を確認するためのコマンドを教えてください。
2. 初回コミットからプッシュまでの安全なリカバリー手順を初心者向けに解説してください。`;
      },
    },
  ],
};
