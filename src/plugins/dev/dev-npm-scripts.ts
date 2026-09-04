import { ProblemPlugin } from '../../types';

export const devNpmScriptsPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-npm-scripts',
    name: 'npm scripts活用＆タスク自動化ナビ',
    category: 'dev-support',
    description: 'package.jsonのscriptsセクションを使い、ビルドやテスト、起動コマンドを効率化する方法を解説します。',
    keywords: ['npm', 'package.json', 'scripts', 'npm run', 'ビルド', '自動化'],
    beginnerPhrases: [
      'npm run devって何？',
      'scriptsの書き方がわからない',
      '長いコマンドを短くしたい',
      'package.jsonにコマンドを登録したい',
    ],
  },
  knowledge: {
    summary:
      'npm scripts は、プロジェクトで頻繁に使う長いコマンド（tsc, vite, jest, eslint 等）に短い名前（dev, build, test 等）を付けて一発で実行できるようにするエイリアス機能です。`npx` を付けずにローカルインストールされたツールを直接実行できます。',
    steps: [
      {
        step: 1,
        title: 'package.json の scripts にコマンドを定義する',
        detail:
          'キー名に実行したいショートカット名、値に実際のコマンド文字列を指定します（例: `"build": "tsc && vite build"`）。',
      },
      {
        step: 2,
        title: 'npm run <script-name> で実行する',
        detail:
          'ターミナルから `npm run build` のように実行します（`npm test` や `npm start` は `run` を省略できます）。',
        command: 'npm run build',
      },
      {
        step: 3,
        title: '引数の受け渡しや連続実行を設定する',
        detail:
          '複数のコマンドを順番に実行したい場合は `&&`（前のコマンドが成功したら次を実行）で繋ぎます。',
      },
    ],
    cautions: [
      'Windows環境とMac/Linux環境で共通して動くコマンドを書くため、OS固有のコマンド（rm -rf や dir など）は直接書かず、クロスプラットフォーム対応のパッケージ（rimraf, cross-env等）を使うのが安全です。',
      'JSONファイルのため、各行末尾のカンマ抜けや最後の項目の余計なカンマに注意してください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'npm scripts構成相談プロンプト',
      generate: (context) => {
        const detail = context.detail || 'フロントエンドとバックエンドのビルド・リント・テストを効率化したいです。';
        return `package.json の \`scripts\` セクションの設計について教えてください。

【現在の開発内容・ツール】
${detail}

【お願い】
1. 日常的な開発（開発サーバー起動、型検査、静的解析、本番ビルド、テスト実行）を網羅する推奨 scripts の記述例
2. 初心者にとって使いやすくミスを起こしにくい命名規則と構成の解説`;
      },
    },
  ],
};
