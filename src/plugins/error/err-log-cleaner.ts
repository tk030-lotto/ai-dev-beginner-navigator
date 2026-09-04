/**
 * Errorプラグイン: ログ抜粋・整理ツール
 * ID: err-log-cleaner
 * 「ログが長すぎてどこを見ればいいかわからない」「AIにどう見せればいいかわからない」という初心者に、
 * ログの重要箇所（先頭・末尾・エラー行）の抽出方法と提示のコツを教える。
 */

import { ProblemPlugin } from '../../types';

export const errLogCleanerPlugin: ProblemPlugin = {
  metadata: {
    id: 'err-log-cleaner',
    name: 'ログ抜粋・整理ツール',
    category: 'error',
    description: 'ターミナルに流れる何十行ものログから、AIやメンターへの相談に必要な重要箇所だけを安全に抽出・整形します。',
    keywords: [
      'ログ抽出',
      'ログ整理',
      'スタックトレース抜粋',
      '長文ログ',
      'コンソール出力',
      'エラーログ',
      'ターミナル出力',
    ],
    beginnerPhrases: [
      'ログが長すぎる',
      'どこをAIに見せればいい？',
      '長文エラー',
      'ターミナルが文字で埋まった',
      'エラーログの整理',
      'エラーが多すぎて読めない',
    ],
  },

  knowledge: {
    summary: '長大なログの9割は正常な進行記録や内部ライブラリの呼び出しです。AIに相談する際は「実行したコマンド」「エラー名（最下行）」「自分が作成したファイルへの言及」の3点に絞ると、的確な回答が得られます。',
    steps: [
      {
        step: 1,
        title: '実行した直前のコマンドを控える',
        detail: '「どのコマンド（npm run dev、git pushなど）を実行した結果ログが出たのか」を1行目に明記します。',
      },
      {
        step: 2,
        title: 'エラー発生の契機となった最下行〜前後10行を抽出する',
        detail: 'ログの一番最後（またはError:と赤字で書かれている箇所）から上下10行程度をコピーします。途中の何百行もの進行ログは省略して構いません。',
      },
      {
        step: 3,
        title: '秘匿情報（パスワード・APIキー）の有無を目視確認する',
        detail: '環境変数の値やホームディレクトリ名、APIトークンなどが文字列に含まれていないか確認し、あれば伏字（[REDACTED]）にします。',
      },
    ],
    cautions: [
      '何千行ものログをそのままAIに貼り付けると、AIが肝心のエラー行を見失い見当違いな回答をする原因になります。',
      'APIキーやDB接続URL（パスワード付き）を絶対にそのまま貼り付けない。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: '抜粋エラーログの構造化相談プロンプト',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript / Node.js';
        const detail = context.detail || '（ここに抜粋したエラーメッセージの重要部分を貼り付け）';

        return `【実行環境】
OS: ${os}
言語/ツール: ${lang}

【実行したコマンド】
（例: npm run build / npm start など）

【発生したエラーログ（抜粋）】
\`\`\`
${detail}
\`\`\`

【依頼事項】
上記ログから、問題の根本原因を特定してください。
また、修正すべきファイルと具体的な修正コードをわかりやすく提示してください。`;
      },
    },
  ],
};
