/**
 * Dev Supportプラグイン: Markdown表生成ツール
 * ID: dev-md-table
 * 「Markdownで表（テーブル）を作りたいが縦棒（|）とハイフン（-）を合わせるのが面倒」「表の書き方がわからない」初心者に、
 * Markdownテーブルの記法ルールと、AIに表を綺麗に作成させるプロンプトを提供する。
 */

import { ProblemPlugin } from '../../types';

export const devMdTablePlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-md-table',
    name: 'Markdown表生成ツール',
    category: 'dev-support',
    description: '縦棒（|）とハイフン（-）を用いたMarkdownテーブル（表）の書き方と、テキストデータから見やすい表組を生成する支援を提供します。',
    keywords: [
      'Markdown表',
      'テーブル作成',
      '表組み',
      'Markdown table',
      'パイプ記号',
      'アライメント',
    ],
    beginnerPhrases: [
      '表を作りたい',
      'テーブルの書き方',
      'Markdownの表',
      '表組の書き方',
      'パイプ記号の表',
      'Markdownで表を作る',
    ],
  },

  knowledge: {
    summary: 'Markdownの表は「1行目: ヘッダー」「2行目: 区切り線（|---|）」「3行目以降: データ行」という3段構成です。各列をパイプ「|」で区切るだけで成立し、半角スペースの個数を完全に揃えなくてもブラウザは自動で揃えて表示してくれます。',
    steps: [
      {
        step: 1,
        title: '基本の枠組み（ヘッダーと区切り線）を書く',
        detail: '| 項目名 | 説明 | 必須 | のように1行目を書き、2行目に | :--- | :--- | :---: | と区切り線を入れます。',
      },
      {
        step: 2,
        title: '文字の配置（左揃え・中央揃え・右揃え）',
        detail: 'コロン「:」の位置で配置が決まります。「:---」は左揃え、「:---:」は中央揃え、「---:」は右揃え（数値向け）です。',
      },
      {
        step: 3,
        title: 'セル内の改行に注意する',
        detail: 'Markdown表の1マスの中でEnterキーを押すと行が分かれてしまいます。改行したい場合は「<br>」タグを挟みます。',
      },
    ],
    cautions: [
      'パイプ記号「|」自体をセル内の文字として書きたい場合は「\\|」のようにバックスラッシュでエスケープする。',
      '手動でスペースを合わせて綺麗にするのは大変なので、AIに「表にして」と頼むのが一番速いです。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'テキストデータからのMarkdown表生成依頼',
      generate: (context) => {
        const detail = context.detail || '（表にしたいデータや項目のメモ）';

        return `以下の情報・データを元に、見やすいGitHub互換のMarkdown表（テーブル）を作成してください。

【元データ・項目】:
${detail}

【要望】
1. 項目が直感的に把握できるよう、適切なヘッダー列（項目名、型、説明、デフォルト値など）を設定してください。
2. 数値は右揃え（---:）、テキストは左揃え（:---）に指定してください。
3. コピペでそのままREADMEに貼り付けられるよう、コードブロックで出力してください。`;
      },
    },
  ],
};
