import { ProblemPlugin } from '../../types';

export const devAccessibilityBasicsPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-accessibility-basics',
    name: 'Webアクセシビリティ（a11y）超入門',
    category: 'dev-support',
    description: 'セマンティックHTMLやキーボード操作、コントラスト比など、誰でも使いやすいWebサイトを作る基礎です。',
    keywords: ['アクセシビリティ', 'a11y', 'セマンティックHTML', 'aria', 'コントラスト', 'キーボード操作'],
    beginnerPhrases: [
      'キーボードで操作できない',
      'ボタンをdivで作ってしまった',
      'スクリーンリーダー対応',
      'アクセシビリティって何？',
    ],
  },
  knowledge: {
    summary:
      'Webアクセシビリティ（a11y）は、障害の有無や利用デバイスに関わらず、すべての人が情報にアクセスできるようにする設計思想です。最も手軽で強力な対策は「クリックできる要素にはdivではなく適切なHTMLタグ（<button>や<a>）を使う」ことです。',
    steps: [
      {
        step: 1,
        title: 'クリック可能な要素には <button> または <a> を使う',
        detail:
          '`<div onClick=...>` でボタンを作ると、キーボード（TabやEnter）でフォーカス・実行できず、音声読み上げソフトからも認識されません。必ず `<button type="button">` を使います。',
      },
      {
        step: 2,
        title: '画像に適切な alt 属性を付与する',
        detail:
          '情報を持つ画像にはその内容を説明するテキストを `alt="..."` に記述し、単なる装飾目的の画像は `alt=""` と指定して読み上げをスキップさせます。',
      },
      {
        step: 3,
        title: '文字と背景のコントラスト比を確認する',
        detail:
          '文字が薄すぎて読めない状態を防ぐため、通常テキストでコントラスト比 4.5:1 以上を確保します（ブラウザ開発ツールのカラーピッカーで判定可能）。',
      },
    ],
    cautions: [
      'CSSで `outline: none` を指定してフォーカスリング（選択枠）を完全に消去すると、キーボード利用者が現在どこを選択しているか見失うため絶対に避けてください。',
      'WAI-ARIA属性（`aria-label` 等）を過剰に使う前に、まず標準のネイティブHTML要素を正しく使う（First rule of ARIA）ことを意識してください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'UIアクセシビリティ監査プロンプト',
      generate: (context) => {
        const detail = context.detail || '作成したWeb画面のアクセシビリティを検証したいです。';
        return `以下のHTML/Reactコンポーネントについて、Webアクセシビリティ（WCAG 2.1 AAレベル）の観点から監査と改善案の提示をお願いします。

【監査対象コード】
${detail}

【評価項目】
1. セマンティックなHTML要素の適切な使い分け（button, a, nav, main, heading等）
2. キーボード操作性（Tab移動順、Enter/Space押下時の動作）
3. スクリーンリーダーへの配慮（alt属性、aria-labelの要否）
4. フォーカス状態の視認性`;
      },
    },
  ],
};
