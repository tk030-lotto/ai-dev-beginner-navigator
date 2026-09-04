import { ProblemPlugin } from '../../types';

export const devPerformanceCheckPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-performance-check',
    name: 'Webパフォーマンス・表示速度改善ナビ',
    category: 'dev-support',
    description: 'Webサイトの初期表示が遅い、動作がカクつく原因の特定とLighthouseを活用した改善手順です。',
    keywords: ['パフォーマンス', 'Lighthouse', '速度改善', 'Core Web Vitals', 'バンドルサイズ', '遅延読み込み'],
    beginnerPhrases: [
      'ページを開くのが遅い',
      '画面がカクカクする',
      'Lighthouseの点数を上げたい',
      '画像が重い',
    ],
  },
  knowledge: {
    summary:
      'Webパフォーマンスの低下は、多くの場合「巨大な未圧縮画像」「不要な外部ライブラリの一括読み込み」「レンダリングをブロックする同期スクリプト」の3点が原因です。ブラウザの開発者ツールやLighthouseを使うことで、改善すべきボトルネックを客観的に数値化できます。',
    steps: [
      {
        step: 1,
        title: 'Chrome Lighthouseでスコアとボトルネックを測定する',
        detail:
          'F12キーで開発者ツールを開き、「Lighthouse」タブで「Analyze page load」を実行します。パフォーマンススコアと主要な警告を確認します。',
      },
      {
        step: 2,
        title: '画像の最適化（WebP変換・サイズ指定・遅延読み込み）',
        detail:
          '画像をモダン形式（WebP/AVIF）に圧縮し、HTMLのimgタグに `loading="lazy"` と `width`/`height` 属性を必ず付与します。',
      },
      {
        step: 3,
        title: 'JavaScriptの動的インポート（Code Splitting）',
        detail:
          '初期画面で使わないモーダルや巨大なライブラリを、`import()` 構文で必要になった瞬間に遅延読み込みします。',
      },
    ],
    cautions: [
      'パフォーマンス改善の前に必ず測定を行ってください。「遅い気がする」という推測だけでコードを複雑化させる早期最適化（Premature Optimization）は避けるべきです。',
      'ローカル開発環境（開発サーバー）は本番ビルドよりもバンドルサイズが大きいため、速度測定は必ず `npm run build` した成果物で行ってください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'Webパフォーマンス改善相談プロンプト',
      generate: (context) => {
        const detail = context.detail || 'ページの読み込み速度を高速化し、Lighthouseのスコアを改善したいです。';
        return `Webサイトの表示速度とパフォーマンスを改善したいです。

【現在の状況・ボトルネック】
${detail}

【アドバイスしてほしいこと】
1. Core Web Vitals（LCP, INP, CLS）を改善するための最優先アクション上位3つ
2. バンドルサイズ肥大化の調査方法と解消手順
3. 初心者でも導入しやすい画像・アセットの最適化手法`;
      },
    },
  ],
};
