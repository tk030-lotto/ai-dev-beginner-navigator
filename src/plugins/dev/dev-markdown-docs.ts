import { ProblemPlugin } from '../../types';

export const devMarkdownDocsPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-markdown-docs',
    name: '技術ドキュメント・仕様書Markdown作成ナビ',
    category: 'dev-support',
    description: '見やすく保守しやすいREADMEやAPI仕様書、アーキテクチャ設計書のMarkdown構成法を解説します。',
    keywords: ['Markdown', 'ドキュメント', '仕様書', '設計書', 'Mermaid', 'README'],
    beginnerPhrases: [
      '仕様書の書き方がわからない',
      '設計書をMarkdownで書きたい',
      'きれいなドキュメントの構成',
      '図や表を入れたい',
    ],
  },
  knowledge: {
    summary:
      '優れた技術ドキュメントは「読む人の目的（環境構築したいのか、APIを叩きたいのか、内部構造を知りたいのか）」に応じて目次と見出しが整理されています。GitHub Flavored Markdownの表やMermaid記法によるダイアグラムを活用すると、視覚的に伝わるドキュメントが作れます。',
    steps: [
      {
        step: 1,
        title: '対象読者と「クイックスタート」を冒頭に配置する',
        detail:
          'ドキュメントの最上部には「このシステムは何をするものか（1行サマリー）」と「最短で手元で動かすための3コマンド」を記載します。',
      },
      {
        step: 2,
        title: '見出しレベル（#〜###）を論理的に階層化する',
        detail:
          '大見出し（#）は文書全体で1つとし、セクションは##、サブ項目は###と一貫した深さを保ちます。',
      },
      {
        step: 3,
        title: 'Mermaidでアーキテクチャ図やシーケンス図を描画する',
        detail:
          'GitHubや多くのMarkdownビューアでネイティブ対応している```mermaidブロックを使い、テキストベースで図を保守できるようにします。',
      },
    ],
    cautions: [
      '画像ファイル（スクリーンショット）だけに依存した説明は、UIが変わった際に差し替えが難しく検索性も低いため、テキスト情報を併記してください。',
      '環境構築手順でコマンドを記載する際は、実行するディレクトリ（作業フォルダ）を明記してください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: '技術仕様書Markdown生成プロンプト',
      generate: (context) => {
        const detail = context.detail || 'Webアプリケーションのアーキテクチャと仕様をドキュメント化したいです。';
        return `以下のシステムに関する技術仕様書（Markdown形式）を作成してください。

【システム概要・機能】
${detail}

【含めるべき構成】
1. システム概要と目的
2. システムアーキテクチャ図（Mermaidフローチャート記法）
3. 主要データ構造・インターフェース定義
4. 環境構築・起動手順（Prerequisites, Setup, Run）
5. ディレクトリ構造の解説`;
      },
    },
  ],
};
