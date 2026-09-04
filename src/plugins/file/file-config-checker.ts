/**
 * Fileプラグイン: 設定ファイル見取り図
 * ID: file-config-checker
 * 「package.jsonやtsconfig.jsonって何が書いてあるの？」「scriptsとdependenciesの違いは？」初心者に、
 * プロジェクト設定ファイルの構造と、安全に編集・コマンド実行するための知識を提供する。
 */

import { ProblemPlugin } from '../../types';

export const fileConfigCheckerPlugin: ProblemPlugin = {
  metadata: {
    id: 'file-config-checker',
    name: '設定ファイル見取り図',
    category: 'file',
    description: 'package.json、tsconfig.json、vite.config.ts など、プロジェクト直下にある設定ファイルの役割と基本構造を解説します。',
    keywords: [
      '設定ファイル',
      'package.json',
      'tsconfig.json',
      'scripts',
      'dependencies',
      'devDependencies',
      'vite.config.ts',
    ],
    beginnerPhrases: [
      'package.jsonの読み方',
      'tsconfigって何？',
      '設定ファイルの見方',
      'scriptsって何？',
      'dependenciesの違い',
      '設定ファイルが多すぎる',
      'package.jsonをいじっていい？',
    ],
  },

  knowledge: {
    summary: 'package.jsonは「プロジェクトの説明書兼レシピ」です。特に重要なのは「scripts（実行できるショートカットコマンド一覧）」と「dependencies（使っている外部ライブラリ一覧）」の2項目です。',
    steps: [
      {
        step: 1,
        title: 'scriptsセクション: npm run で動かすコマンド集',
        detail: '"dev": "vite" なら npm run dev、"build": "vite build" なら npm run build で動きます。ここを見れば何ができるかがわかります。',
      },
      {
        step: 2,
        title: 'dependencies vs devDependencies の違い',
        detail: 'dependencies は完成したアプリがブラウザで動くのに必須な部品、devDependencies は開発作業中やテスト時だけに使う開発者専用の道具です。',
      },
      {
        step: 3,
        title: 'tsconfig.json: TypeScriptの厳しさ・変換設定',
        detail: 'TypeScriptコンパイラに「どのフォルダを読み込むか」「型チェックをどこまで厳密にするか（strict）」を指示する設定ファイルです。',
      },
    ],
    cautions: [
      'package.json のバージョン番号やカンマを手動で消すと構文エラーになり npm install が動かなくなります。パッケージ追加は「npm install パッケージ名」コマンドで行うのが安全です。',
      'package-lock.json は依存関係の固定台帳なので手動で書き換えてはいけません。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: '設定ファイルの内容解説・設定追加の相談',
      generate: (context) => {
        const detail = context.detail || '（package.jsonやtsconfig.jsonの気になる部分）';

        return `プログラミング初学者です。プロジェクトの設定ファイルについて知りたいです。

【対象の設定内容】:
\`\`\`json
${detail}
\`\`\`

【教えてほしいこと】
1. この設定項目（キー）はどのような役割・機能を果たしていますか？
2. 新しいコマンドやライブラリを追加したい場合、どのように安全に書き足せばよいですか？
3. 初心者が誤って書き換えて壊してしまいがちなNG例があれば教えてください。`;
      },
    },
  ],
};
