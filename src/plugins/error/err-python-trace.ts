import { ProblemPlugin } from '../../types';

export const errPythonTracePlugin: ProblemPlugin = {
  metadata: {
    id: 'err-python-trace',
    name: 'Python Traceback読み解きナビ',
    category: 'error',
    description: '長いPythonのTraceback（スタックトレース）から本当の原因行を素早く見つけます。',
    keywords: ['Python', 'Traceback', 'IndentationError', 'KeyError', 'TypeError', 'SyntaxError'],
    beginnerPhrases: [
      'Tracebackと出た',
      'Pythonのエラーの読み方がわからない',
      'インデントエラー',
      'KeyErrorが出た',
    ],
  },
  knowledge: {
    summary:
      'Pythonのエラー（Traceback）は、下に行けば行くほど「実際にクラッシュした現場」に近くなります。一番最後の行にエラーの種類（NameError, TypeErrorなど）と理由が書かれており、その直前にある「自分の書いたスクリプトの行番号」が修正対象です。',
    steps: [
      {
        step: 1,
        title: 'Tracebackの最下行を確認する',
        detail:
          '画面に出力された長いエラーメッセージの「一番下」を見ます。例: `KeyError: "user"` や `TypeError: unsupported operand type(s)` がエラーの原因そのものです。',
      },
      {
        step: 2,
        title: '自分が作成したファイルの行番号を逆順に探す',
        detail:
          '最下行から上に向かって目を通し、`File "app.py", line 42, in <module>` のように自分が書いたファイル名と行番号が書かれている箇所を特定します（ライブラリ内の行番号は通常無視して構いません）。',
      },
      {
        step: 3,
        title: '該当行の変数の中身と型を確認する',
        detail:
          '指定された行番号のコードで、Noneや未定義の変数、辞書に存在しないキーを参照していないかを確認します。直前に `print(repr(variable))` を入れて実行すると中身を確認できます。',
      },
    ],
    cautions: [
      'IndentationError（インデント不正）の場合は、スペースとタブが混在している可能性があります。VSCode等のエディタ設定で「タブをスペースに変換」を有効にしてください。',
      'ライブラリ（site-packages）のコードを直接書き換えて修正しようとしないでください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'Claude',
      title: 'Python Traceback解析プロンプト',
      generate: (context) => {
        const detail = context.detail || 'Pythonコードを実行したところ、Tracebackエラーが出力されました。';
        return `Pythonスクリプトの実行時に以下のTracebackエラーが発生しました。
エラーの原因箇所と、安全な修正方法を段階的に教えてください。

【エラー内容（Traceback）】
${detail}

【回答時の希望】
1. 一番下の行に示されたエラーの意味を初心者にわかりやすく解説してください。
2. 自分が修正すべきファイルと行番号を特定してください。
3. なぜそのエラーが起きたのか、変数の型や状態の観点から原因を説明してください。
4. 修正済みの完全なコードスニペットを提示してください。`;
      },
    },
  ],
};
