import { ProblemPlugin } from '../../types';

export const devReactHooksPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-react-hooks',
    name: 'React Hooks入門＆頻出アンチパターン回避',
    category: 'dev-support',
    description: 'useStateとuseEffectの正しい役割分担と、初心者がハマりがちな不要なState更新を防ぐ指針です。',
    keywords: ['React', 'Hooks', 'useState', 'useEffect', 'State', 'Props', 'アンチパターン'],
    beginnerPhrases: [
      'useStateの使いどころがわからない',
      'useEffectが何度も動く',
      '不要なStateを作ってしまう',
      '値の更新が1テンポ遅れる',
    ],
  },
  knowledge: {
    summary:
      'React Hooksでは「Propsや他のStateから計算できる値は、新しいStateにせず通常の変数で計算する（Derived State）」のが原則です。また、API通信やDOM操作などの外部連携以外でむやみにuseEffectを使ってStateを同期させようとすると無限ループの原因になります。',
    steps: [
      {
        step: 1,
        title: '「本当にStateが必要か？」を判定する',
        detail:
          'Propsや既存のStateから `const fullName = firstName + " " + lastName` のように計算できる値は、useStateを使わずに通常のローカル変数として計算します。',
      },
      {
        step: 2,
        title: 'State更新の非同期性に注意する',
        detail:
          'setCount(count + 1)を実行した直後の行でcountを読んでも値はまだ増えていません。次のレンダリングで初めて更新されます。',
      },
      {
        step: 3,
        title: 'useEffectは「Reactの外の世界との接続」に限定する',
        detail:
          'タイマー（setInterval）、ブラウザイベントリスナーの登録、バックエンドAPIからのデータフェッチなどの副作用（Side Effects）にのみ使います。クリーンアップ関数（return () => ...）も忘れずに記述します。',
      },
    ],
    cautions: [
      'useEffect内でStateを更新し、そのStateを依存配列に入れると無限ループ（Too many re-renders）が発生します。',
      'イベントハンドラーで処理できること（ボタンを押した時の処理など）を、わざわざuseEffectで監視して実行しないでください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'Hooks設計レビュープロンプト',
      generate: (context) => {
        const detail = context.detail || 'コンポーネント内のuseStateとuseEffectが多すぎて複雑になっています。';
        return `以下のReactコンポーネントのHooksの使い方について、最新の公式ドキュメント（React 18/19推奨ベストプラクティス）の観点からレビューと改善案をお願いします。

【対象コードと課題】
${detail}

【診断してほしい点】
1. 不要なuseState（他の値から計算可能なもの）はないか
2. 不要なuseEffect（イベントハンドラで済むもの）はないか
3. 無限ループや不要な再レンダリングの原因になりそうな箇所はないか`;
      },
    },
  ],
};
