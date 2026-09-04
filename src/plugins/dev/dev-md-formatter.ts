/**
 * Dev Supportプラグイン: Markdown作成ナビ
 * ID: dev-md-formatter
 * 「README.mdをきれいに書きたい」「メモを見やすくまとめたいがMarkdownの書き方がわからない」初心者に、
 * 最低限知っておくべき主要Markdown記法（見出し・箇条書き・コードブロック・リンク）を教える。
 */

import { ProblemPlugin } from '../../types';

export const devMdFormatterPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-md-formatter',
    name: 'Markdown作成ナビ',
    category: 'dev-support',
    description: 'GitHubのREADMEや仕様書、開発メモで使われるMarkdown（マークダウン）記法の基本と、伝わりやすい文書構造をガイドします。',
    keywords: [
      'Markdown',
      'マークダウン',
      'README',
      'ドキュメント作成',
      '見出し記法',
      'コードブロック',
      '箇条書き',
    ],
    beginnerPhrases: [
      'READMEの書き方',
      'メモをきれいにまとめたい',
      'マークダウン記法',
      'Markdownの書き方',
      '見出しの付け方',
      'コードの囲み方',
    ],
  },

  knowledge: {
    summary: 'Markdownは「#（見出し）」「-（箇条書き）」「```（コード枠）」の3つを覚えるだけで、8割の文書が美しく書けます。HTMLのようにタグを閉じる必要がなく、読みやすく保守しやすいのが特徴です。',
    steps: [
      {
        step: 1,
        title: '見出し（#）で大・中・小の階層をつくる',
        detail: '# タイトル（h1）、## 大見出し（h2）、### 小見出し（h3）のように、#の数で階層を整理します。#の後には必ず半角スペースを入れます。',
      },
      {
        step: 2,
        title: '箇条書き（- ）と強調（**太字**）',
        detail: '行頭に「- 」（ハイフンと半角スペース）を置くと箇条書きになります。重要な言葉は **太字** で挟みます。',
      },
      {
        step: 3,
        title: 'コードブロック（バッククォート3つ ```）',
        detail: '```typescript のように3つのバッククォートと言語名でコードを挟むと、シンタックスハイライト（色付け）されてきれいに表示されます。',
      },
    ],
    cautions: [
      '# や - の後ろに半角スペースを忘れると、記号がそのまま文字として表示されてしまいます。',
      '見出しレベルを飛ばさないこと（# h1 の直後に #### h4 に飛ばすなどは避ける）。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'README / ドキュメントのMarkdown整形依頼',
      generate: (context) => {
        const detail = context.detail || '（作成したいアプリの概要や箇条書きメモ）';

        return `開発ドキュメント（README.md）を作成したいです。以下の下書き・メモを元に、GitHubで映えるきれいなMarkdown形式に整形してください。

【プロジェクト概要・メモ】:
${detail}

【含めてほしい構成】
1. # プロジェクト名 & 概要（一言説明）
2. ## 主な機能（箇条書き）
3. ## 技術スタック（言語・フレームワーク）
4. ## セットアップ & 起動手順（コードブロック付きコマンド）
5. ## ライセンス表示（MITなど）

初学者でもコピペでそのまま使える完成されたMarkdownコードブロック形式で出力してください。`;
      },
    },
  ],
};
