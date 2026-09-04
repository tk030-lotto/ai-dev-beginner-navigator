import { ProblemPlugin } from '../../types';

export const fileVscodeSettingsPlugin: ProblemPlugin = {
  metadata: {
    id: 'file-vscode-settings',
    name: 'VSCode設定・.vscodeフォルダ見取り図',
    category: 'file',
    description: '.vscode/settings.json や extensions.json の役割と開発効率を上げる推奨設定を解説します。',
    keywords: ['VSCode', '.vscode', 'settings.json', 'extensions.json', 'エディタ設定', 'フォーマッタ'],
    beginnerPhrases: [
      'VSCodeの設定が保存されない',
      '.vscodeフォルダって何？',
      '保存時に自動整形したい',
      '推奨拡張機能の共有',
    ],
  },
  knowledge: {
    summary:
      'プロジェクト直下の `.vscode` フォルダは、そのプロジェクト限定のVSCode設定を管理する場所です。`settings.json`（保存時自動フォーマットやインデント幅）、`extensions.json`（推奨拡張機能一覧）を配置することで、チーム全員で同じ開発環境を共有できます。',
    steps: [
      {
        step: 1,
        title: '.vscode/settings.json を作成して基本設定を記述',
        detail:
          '「ファイル保存時にPrettierなどで自動整形する（editor.formatOnSave: true）」を設定するのが最も効果的です。',
      },
      {
        step: 2,
        title: '.vscode/extensions.json で推奨拡張機能を登録',
        detail:
          'GitLens, ESLint, Prettierなどの拡張機能IDを recommendations 配列にリストアップしておくと、プロジェクトを開いた時にインストール推奨が表示されます。',
      },
      {
        step: 3,
        title: 'Gitの管理対象に含めるかどうかを判断する',
        detail:
          'チーム共通の設定（settings.json, extensions.json）はGitコミットし、個人固有の画面レイアウト設定などは除外します。',
      },
    ],
    cautions: [
      '.vscode/settings.json に個人のローカルファイルパス（C:\\Users\\...）をハードコードすると、他の人のPCでエラーになります。',
      'グローバル設定（ユーザー設定）とプロジェクト設定（ワークスペース設定）が競合した場合、プロジェクト設定が優先されます。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'VSCodeおすすめ設定json作成プロンプト',
      generate: (context) => {
        const lang = context.language || 'TypeScript / Web開発';
        return `VSCodeで快適に${lang}を開発するための、プロジェクト用 \`.vscode/settings.json\` と \`.vscode/extensions.json\` の推奨構成を作成してください。

【重視したい点】
1. ファイル保存時の自動フォーマット（Prettier/ESLint）の有効化
2. 末尾スペースの自動削除とファイル末尾の空行自動挿入
3. 初心者が導入しておくべき必須の推奨拡張機能（extensions.json）`;
      },
    },
  ],
};
