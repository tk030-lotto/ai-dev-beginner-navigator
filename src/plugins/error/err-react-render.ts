import { ProblemPlugin } from '../../types';

export const errReactRenderPlugin: ProblemPlugin = {
  metadata: {
    id: 'err-react-render',
    name: 'Reactレンダリング・Hookエラー解決',
    category: 'error',
    description: 'Rendered fewer hooks than expected や無限再レンダリングのエラーを解消します。',
    keywords: ['React', 'Hook', 'useEffect', 'useState', 'render', 'too many re-renders', '無限ループ'],
    beginnerPhrases: [
      'Reactのエラーが消えない',
      '画面が真っ白になった',
      'Too many re-renders',
      'Hookのルール違反',
    ],
  },
  knowledge: {
    summary:
      'Reactではコンポーネントの実行順序やHook（useState/useEffect）の呼び出し順が厳格に管理されています。条件分岐（if文）の内側でHookを呼んだり、useEffect内で依存配列を指定せずに状態更新を行うとレンダリングエラーが発生します。',
    steps: [
      {
        step: 1,
        title: 'Hookの呼び出し位置を確認する',
        detail:
          'useStateやuseEffectなどのHookは、コンポーネントの最上位（トップレベル）でのみ呼び出す必要があります。if文やfor文の内側に配置していないか確認してください。',
      },
      {
        step: 2,
        title: '無限再レンダリングの原因を特定する',
        detail:
          '「Too many re-renders」が発生している場合、onClick={handleClick()}のように即時実行関数を渡していないか（正しくはonClick={() => handleClick()}）、またはuseEffect内で依存配列なしにsetStateしていないか確認します。',
      },
      {
        step: 3,
        title: 'React DevToolsとコンソールエラーのスタックトレースを確認する',
        detail:
          'ブラウザの開発者ツール（F12）のConsoleタブで、赤文字で出力されているエラーの先頭行に表示されたコンポーネント名をクリックし、問題のある行にジャンプします。',
      },
    ],
    cautions: [
      'エラーを消すために無理やりHookを条件分岐の外へ移動し、値がundefinedのまま使わないように初期値を設定してください。',
      'useEffectの依存配列（第二引数）を空配列[]にしたまま依存している変数を無視すると、古い値（stale closure）が参照され続けるバグになります。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'Reactエラーの解消プロンプト',
      generate: (context) => {
        const detail = context.detail || '画面が真っ白になり、コンソールにReactエラーが出ています。';
        return `Reactコンポーネントでエラーが発生して困っています。
以下のエラー内容とコードを確認し、原因と安全な修正コードを教えてください。

【発生している現象・エラー】
${detail}

【お願い】
1. なぜこのエラーが発生したのか、初心者にわかる言葉で説明してください。
2. Hookのルール（呼び出し順序や依存配列）に沿った正しいコードを提示してください。
3. 今後同じエラーを防ぐためのチェックポイントを教えてください。`;
      },
    },
  ],
};
