import { ProblemPlugin } from '../../types';

export const fileTsconfigGuidePlugin: ProblemPlugin = {
  metadata: {
    id: 'file-tsconfig-guide',
    name: 'tsconfig.json主要オプション解説ナビ',
    category: 'file',
    description: 'TypeScriptの設定ファイル「tsconfig.json」の重要項目と初心者が陥りやすいエラーを防ぐ設定を解説します。',
    keywords: ['TypeScript', 'tsconfig.json', 'strict', 'target', 'moduleResolution', '型チェック'],
    beginnerPhrases: [
      'tsconfigの書き方がわからない',
      'Cannot find moduleエラー',
      'strictモードとは？',
      'TypeScriptの設定',
    ],
  },
  knowledge: {
    summary:
      'tsconfig.json は TypeScript コンパイラ（tsc）に「どのJavaScriptバージョンに変換するか」「型チェックをどこまで厳格に行うか」を指示する設定ファイルです。特に `strict: true`（厳格モード）と `moduleResolution`（モジュール解決法）が重要です。',
    steps: [
      {
        step: 1,
        title: 'compilerOptions の主要4項目を確認する',
        detail:
          'target（出力JSの世代: ES2022等）、module（import/exportの形式: ESNext等）、strict（厳格な型検査: true推奨）、noEmit（型検査のみ行いJSを出力しないか）を確認します。',
      },
      {
        step: 2,
        title: 'include と exclude の設定を確認する',
        detail:
          'TypeScriptがコンパイル対象にするフォルダ（例: `include: ["src/**/*"]`）と、対象外にするフォルダ（例: `exclude: ["node_modules", "dist"]`）を明記します。',
      },
      {
        step: 3,
        title: '型エラーをコマンドラインで事前チェックする',
        detail: 'ビルドを実行せずに型エラーのみを高速に検査します。',
        command: 'npx tsc --noEmit',
      },
    ],
    cautions: [
      '型エラーを消す目的で安易に `strict: false` に戻すと、ランタイムで undefined エラーが多発する原因になります。',
      'tsconfig.json は JSON フォーマットのため、末尾の余計なカンマ（Trailing Comma）があると構文エラーになります。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'tsconfig設定相談プロンプト',
      generate: (context) => {
        const detail = context.detail || 'モダンなフロントエンド開発向けのtsconfig.jsonを設定したいです。';
        return `TypeScriptの \`tsconfig.json\` の設定について教えてください。

【現在の開発環境・目的】
${detail}

【知りたいこと】
1. この用途に最適な推奨 tsconfig.json の設定例
2. 各設定オプション（target, moduleResolution, strict 等）の目的と意味の解説
3. よく発生する「モジュールが見つからない」「JSXが解釈されない」等の典型エラーの防ぎ方`;
      },
    },
  ],
};
