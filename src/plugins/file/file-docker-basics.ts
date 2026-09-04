import { ProblemPlugin } from '../../types';

export const fileDockerBasicsPlugin: ProblemPlugin = {
  metadata: {
    id: 'file-docker-basics',
    name: 'Dockerfile・Compose基礎ナビ',
    category: 'file',
    description: 'コンテナ環境を作るDockerfileとdocker-compose.ymlの基本的な構造と起動方法を解説します。',
    keywords: ['Docker', 'Dockerfile', 'docker-compose', 'コンテナ', 'イメージ', 'build', 'up'],
    beginnerPhrases: [
      'Dockerの使い方がわからない',
      'Dockerfileって何？',
      'docker compose upとは？',
      'コンテナが立ち上がらない',
    ],
  },
  knowledge: {
    summary:
      'Dockerは「アプリが動く最小限の仮想PC環境（コンテナ）」をコードで定義するツールです。Dockerfileは「コンテナの設計図（OSやNode.js等のインストール手順）」、docker-compose.ymlは「複数のコンテナ（Webアプリとデータベース等）をまとめて起動・連携する設定」です。',
    steps: [
      {
        step: 1,
        title: 'Dockerfileの基本3行を確認する',
        detail:
          'FROM（ベースにするOS・言語イメージ）、COPY（手元のファイルをコンテナ内にコピー）、CMD（起動時に実行するコマンド）の順で書かれます。',
      },
      {
        step: 2,
        title: 'コンテナイメージをビルドする',
        detail: 'Dockerfileをもとにコンテナイメージをローカルに構築します。',
        command: 'docker build -t my-app .',
      },
      {
        step: 3,
        title: 'docker-composeで一括起動・停止する',
        detail:
          'docker-compose.ymlがあるフォルダで起動・バックグラウンド実行を行います。停止時はdownを使います。',
        command: 'docker compose up -d',
      },
    ],
    cautions: [
      '.dockerignore を作成せずにビルドすると、手元の node_modules や不要なキャッシュが丸ごとコピーされてビルドが極端に遅くなります。',
      'コンテナを停止（down）すると、コンテナ内のデータは消去されます。データを永続化したい場合は volumes の指定が必要です。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'Docker環境構築サポートプロンプト',
      generate: (context) => {
        const lang = context.language || 'Node.js / TypeScript';
        const detail = context.detail || 'Web開発用のDocker環境を構築したいです。';
        return `以下の要件に合わせた初心者向けの最小構成 Dockerfile と docker-compose.yml を作成してください。

【対象の技術スタック】
${lang}

【用途・詳細】
${detail}

【お願い】
1. Dockerfileの各行にコメントで「何をしているのか」を日本語で分かりやすく解説してください。
2. ホストPCのコード変更がコンテナに即座に反映されるホットリロードの設定を含めてください。
3. .dockerignore に記述すべきファイル一覧も提示してください。`;
      },
    },
  ],
};
