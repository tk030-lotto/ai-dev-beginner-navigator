/**
 * Fileプラグイン: プロジェクト構成ナビ
 * ID: file-structure
 * 「プロジェクトフォルダの中にファイルがたくさんあってどこに何を置けばいいかわからない」「srcやpublicって何？」初心者に、
 * モダンWeb開発の標準的なフォルダ構成と役割を教える。
 */

import { ProblemPlugin } from '../../types';

export const fileStructurePlugin: ProblemPlugin = {
  metadata: {
    id: 'file-structure',
    name: 'プロジェクト構成ナビ',
    category: 'file',
    description: 'src、public、dist、node_modulesなど、プロジェクト内のフォルダ構成の役割と、新しく作るファイルをどこに配置すべきかを案内します。',
    keywords: [
      'プロジェクト構成',
      'フォルダ構成',
      'ディレクトリ構造',
      'src',
      'public',
      'node_modules',
      'ファイル配置',
    ],
    beginnerPhrases: [
      'どのフォルダに何を置く？',
      'ファイル構成がわからない',
      'フォルダ構成',
      'srcって何？',
      'publicって何？',
      'ディレクトリ構成',
      'ファイルの見取り図',
    ],
  },

  knowledge: {
    summary: 'Web開発プロジェクトは「自分が書くコード（src/）」「画像などの素材（public/）」「外部ライブラリ（node_modules/）」「完成品出力先（dist/）」の4領域に分かれています。自分が編集するのは基本的に src/ の中だけです。',
    steps: [
      {
        step: 1,
        title: 'src/（ソースフォルダ）: 自分が書くプログラム置き場',
        detail: 'TypeScriptやJavaScript、CSS、コンポーネントなど、自分で開発するコードはすべて src/ 配下に配置します。',
      },
      {
        step: 2,
        title: 'public/（静的アセット）: 変換しない画像やアイコン置き場',
        detail: 'faviconやロゴ画像など、プログラムによる変換やバンドルを経ずにそのままブラウザへ配信したい素材を置きます。',
      },
      {
        step: 3,
        title: 'node_modules/ と dist/（自動生成）: 手動で触らない領域',
        detail: 'node_modules/ は npm install で自動ダウンロードされる依存ライブラリ、dist/ はビルド（npm run build）で生成される成果物です。直接編集してはいけません。',
      },
    ],
    cautions: [
      'node_modules/ の中身を手動で編集しても、再インストール時に消えてしまいます。',
      'プロジェクトルート（一番上の階層）にコードファイルを散らかさず、src/ の中に整理して置くこと。',
      '新しいファイルを作る前に「それは src/ のどこに属するファイルか」を先に決める习慣をつけるとプロジェクトが散らかになりません。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'プロジェクトフォルダ構成とファイル配置の設計相談',
      generate: (context) => {
        const lang = context.language || 'TypeScript / Vite';
        const detail = context.detail || '（新しく作りたい機能や、配置に迷っているファイル）';

        return `Web開発の初学者です。プロジェクト内のフォルダ構成（ディレクトリ構造）についてアドバイスをお願いします。

【使用環境・フレームワーク】: ${lang}

【現在追加しようとしているファイル・機能】:
${detail}

【相談したいこと】
1. この機能を作成する場合、一般的にどのフォルダにどんな名前のファイルを作成・配置するのが標準的（ベストプラクティス）ですか？
2. 今後の拡張を見据えた、シンプルで迷いにくいディレクトリ構成案をツリー形式（フォルダツリー）で提示してください。
3. 各フォルダの役割を初心者向けに1行ずつ解説してください。`;
      },
    },
    {
      targetAi: 'Gemini',
      title: 'フォルダ構成の設計違反・リファクタリング相談',
      generate: (context) => {
        const lang = context.language || 'TypeScript / Vite';
        const detail = context.detail || '（現在のフォルダ構成や気になるファイル配置を記載）';

        return `Web開発初学者です。以下のフォルダ構成に問題があるかもしれないと感じています。

使用フレームワーク: ${lang}

現在の構成 / 気になる点:
${detail}

【相談したいこと】
1. 一般的なベストプラクティスから見て、現在の構成の問題点や改善点を具体的に指摘してください。
2. 機能またはファイルタイプごとにフォルダを分けるか、画面（ページ）ごとに分けるか、初心者に適した構成方针をあわせて提案してください。`;
      },
    },
  ],
};
