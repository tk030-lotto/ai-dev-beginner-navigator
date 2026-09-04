import { ProblemPlugin } from '../../types';

export const gitTagReleasePlugin: ProblemPlugin = {
  metadata: {
    id: 'git-tag-release',
    name: 'Gitタグ＆リリース管理ナビ',
    category: 'git',
    description: 'バージョンタグの作成方法とGitHub Releasesでの公開手順を分かりやすく解説します。',
    keywords: ['git tag', 'release', 'セマンティックバージョニング', 'v1.0.0', 'リリースノート'],
    beginnerPhrases: [
      'バージョンを付けたい',
      'タグの付け方がわからない',
      'GitHub Releaseを作りたい',
      'v1.0.0はどう打つ？',
    ],
  },
  knowledge: {
    summary:
      'Gitの「タグ（Tag）」は、特定のコミットに名前（v1.0.0など）を付けて永続的な目印にする機能です。リリースしたバージョンごとにタグを打つことで、過去の特定バージョンのコードをいつでも呼び出せるようになります。',
    steps: [
      {
        step: 1,
        title: 'タグを作成する（注釈付きタグ）',
        detail:
          'メッセージ付きのタグ（Annotated Tag）を作成します。セマンティックバージョニング（v主.副.パッチ）に従うのが一般的です。',
        command: 'git tag -a v1.0.0 -m "Release version 1.0.0"',
      },
      {
        step: 2,
        title: 'タグをリモートリポジトリへ送信する',
        detail: '通常のgit pushではタグは送信されないため、--tagsオプションを指定してプッシュします。',
        command: 'git push origin --tags',
      },
      {
        step: 3,
        title: 'GitHubでリリースノートを作成する',
        detail:
          'GitHubのリポジトリ画面右側「Releases」から「Draft a new release」を開き、プッシュしたタグを選択して変更点（リリースノート）を公開します。',
      },
    ],
    cautions: [
      'すでにプッシュしたタグの名前を後から変更したり削除して再作成すると、他の開発者のローカル環境と不整合が起きるため避けてください。',
      'タグを打つ前に、テストや本番ビルドがエラーなく完了していることを必ず確認してください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'リリースノート作成プロンプト',
      generate: (context) => {
        const detail = context.detail || '新機能の追加とバグ修正、パフォーマンス改善を行いました。';
        return `今回のリリースに向けた「リリースノート（Changelog）」を作成してください。

【更新内容の概要】
${detail}

【フォーマット】
- **What's Changed**: 「Features（新機能）」「Bug Fixes（不具合修正）」「Improvements（改善）」に分類
- ユーザーにとってどのようなメリットがあるかを簡潔・明快に記載
- バージョン番号の提案（メジャー / マイナー / パッチの根拠）`;
      },
    },
  ],
};
