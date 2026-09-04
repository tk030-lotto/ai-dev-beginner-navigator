/**
 * Fileプラグイン: 拡張子ガイド
 * ID: file-ext-explainer
 * 「.ts、.json、.env、.md... ファイルの末尾についている文字の意味がわからない」初心者に、
 * Web開発で遭遇する主要な拡張子の役割と、開くべきエディタや編集時の注意点を教える。
 */

import { ProblemPlugin } from '../../types';

export const fileExtExplainerPlugin: ProblemPlugin = {
  metadata: {
    id: 'file-ext-explainer',
    name: '拡張子ガイド',
    category: 'file',
    description: '.ts、.js、.json、.env、.md、.svg など、Web開発で頻出するファイル拡張子の種類・用途・編集時の注意点を一覧解説します。',
    keywords: [
      '拡張子',
      'ファイル形式',
      '.ts',
      '.js',
      '.json',
      '.env',
      '.md',
      '.gitignore',
      'ファイルの種類',
    ],
    beginnerPhrases: [
      '.jsonって何？',
      '.envって何？',
      'ファイルの種類',
      '.tsと.jsの違い',
      '拡張子の意味',
      'ファイル名の後ろの文字',
      'ドットから始まるファイル',
    ],
  },

  knowledge: {
    summary: '拡張子はコンピュータに「このファイルの中身が何語で書かれているか」を伝える目印です。Web開発では「.ts（TypeScriptコード）」「.json（設定データ）」「.env（秘密の設定値）」「.md（説明メモ）」の4つが最頻出です。',
    steps: [
      {
        step: 1,
        title: 'コード系拡張子: .ts, .js, .html, .css',
        detail: '.ts は型検査ができる現代的なJavaScriptです。.js はブラウザが解釈する標準スクリプト、.html は骨組み、.css は見た目を飾るファイルです。',
      },
      {
        step: 2,
        title: 'データ・設定系拡張子: .json, .env, .yaml',
        detail: '.json は設定やデータをキーと値のペアで書くファイルです。.env はAPIキーなどの秘密の環境変数を書くファイルで、GitHubには載せません。',
      },
      {
        step: 3,
        title: 'ドキュメント・特殊系拡張子: .md, .gitignore',
        detail: '.md は見出しや箇条書きを手軽に書けるMarkdown文書です。.gitignore はGitにセーブ（追跡）させたくないファイルを指定する特殊ファイルです。',
      },
    ],
    cautions: [
      '拡張子を手動で書き換えると（例: .ts を .json に変更など）、エディタやビルドツールが読み込めなくなります。',
      'Windowsの標準設定では「登録されている拡張子を表示しない」になっていることがあるため、エクスプローラーで拡張子表示を有効にすることをお勧めします。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: '未知の拡張子と用途・編集方法の質問',
      generate: (context) => {
        const detail = context.detail || '（意味を知りたい拡張子やファイル名、例: .config.js, .lock, .d.ts など）';

        return `プログラミング初学者です。プロジェクト内に見慣れない拡張子のファイルがあって用途がわかりません。

【調べたいファイル / 拡張子】:
${detail}

【教えてほしいこと】
1. この拡張子は何の略で、どのような役割を持つファイルですか？
2. 自分が手動で中身を書き換えてよいファイルですか？それともツールが自動生成するファイルですか？
3. 編集する場合の文法規則や、初心者がよくやるミスがあれば教えてください。`;
      },
    },
  ],
};
