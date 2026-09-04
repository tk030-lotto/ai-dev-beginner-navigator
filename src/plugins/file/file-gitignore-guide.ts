import { ProblemPlugin } from '../../types';

export const fileGitignoreGuidePlugin: ProblemPlugin = {
  metadata: {
    id: 'file-gitignore-guide',
    name: '.gitignore記述ガイド＆除外トラブル解決',
    category: 'file',
    description: '.gitignoreの書き方と、「書いたのにGitの追跡から消えない」現象の解消法を案内します。',
    keywords: ['.gitignore', '除外', 'キャッシュ削除', 'node_modules', '.env', '追跡解除'],
    beginnerPhrases: [
      '.gitignoreに書いたのに消えない',
      'gitignoreの書き方',
      'Gitから除外したい',
      'node_modulesが上がってしまう',
    ],
  },
  knowledge: {
    summary:
      '.gitignore は Git の管理対象から除外したいファイルやディレクトリを指定するファイルです。すでに一度コミットされてGitの管理対象に入ってしまったファイルは、.gitignore に追記するだけでは除外されず、`git rm --cached` でインデックスから削除する必要があります。',
    steps: [
      {
        step: 1,
        title: '.gitignore に除外対象のパスを記述する',
        detail:
          'ディレクトリを除外する場合は末尾にスラッシュを付けます（例: `node_modules/`, `dist/`）。環境変数は `.env` と記述します。',
      },
      {
        step: 2,
        title: 'すでに追跡されているファイルのキャッシュを削除する',
        detail:
          '「.gitignoreに書いたのにまだ変更検知される」場合は、ローカルのファイル自体は残したままGitの追跡のみを解除します。',
        command: 'git rm --cached <対象ファイルパス>',
      },
      {
        step: 3,
        title: 'キャッシュ削除をコミットする',
        detail: '追跡解除の変更をコミットしてリモートに反映させます。',
        command: 'git commit -m "chore: remove tracked files ignored in .gitignore"',
      },
    ],
    cautions: [
      '`git rm -f` を使うとローカルの実ファイルまで消去されてしまうため、必ず `--cached` を付けてください。',
      '.gitignore 自体は Git でコミットしてチームやリモートリポジトリと共有する必要があります。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: '環境別.gitignore生成プロンプト',
      generate: (context) => {
        const lang = context.language || 'Node.js, TypeScript, React';
        const os = context.os || 'Windows';
        return `以下の開発環境に最適な \`.gitignore\` ファイルを作成してください。

【開発環境】
- 言語・フレームワーク: ${lang}
- OS環境: ${os}

【要件】
1. OS固有のゴミファイル（.DS_Store や Thumbs.db 等）を網羅
2. ビルド生成物（dist, build）や依存パッケージ（node_modules）を確実に除外
3. APIキーやシークレットファイル（.env）の漏洩防止
4. 各行に何を除外しているかのコメントを記載`;
      },
    },
  ],
};
