/**
 * AIプラグイン: 送信前情報サニタイザー
 * ID: ai-input-sanitizer
 * 「APIキーやパスワードをAIにそのまま貼り付けて送信していいのか」「漏洩が心配」という初心者に、
 * 秘匿情報（APIキー、トークン、秘密鍵、個人情報、DBパスワード）の見分け方と伏字（[REDACTED]）化の手法を教える。
 */

import { ProblemPlugin } from '../../types';

export const aiInputSanitizerPlugin: ProblemPlugin = {
  metadata: {
    id: 'ai-input-sanitizer',
    name: '送信前情報サニタイザー',
    category: 'ai',
    description: 'プロンプトやコードをAIへ送信する前に、APIキー、トークン、DBパスワード、個人名などの秘匿情報が含まれていないかチェック・マスキングします。',
    keywords: [
      'サニタイズ',
      '秘匿情報',
      'APIキー漏洩',
      'パスワード保護',
      'マスキング',
      '個人情報保護',
      'セキュリティ',
    ],
    beginnerPhrases: [
      'パスワードやキーをAIに送って大丈夫？',
      '秘密情報消したい',
      'APIキー送っちゃった',
      'マスキング',
      '個人情報を隠す',
      '機密チェック',
    ],
  },

  knowledge: {
    summary: 'OpenAIやAnthropic等のWebインターフェースに入力した内容は、設定によってはAIの学習データとして使われる可能性があります。一度送信したキーは外部へ漏洩したとみなされるため、必ず伏字（例: YOUR_API_KEY や [REDACTED]）に置き換えてから送信します。',
    steps: [
      {
        step: 1,
        title: '代表的な秘密情報のパターンを知る',
        detail: '「sk-」で始まるOpenAIキー、「ghp_」で始まるGitHubトークン、「postgres://user:password@...」のようなDB接続URL、.envファイルの内容などは絶対に送信してはいけません。',
      },
      {
        step: 2,
        title: 'ダミー値に置換する',
        detail: '実際のキーを「sk-abcdef123456...」ではなく「your_openai_api_key_here」などの明らかなダミー文字列に手動で書き換えます。',
      },
      {
        step: 3,
        title: '万が一送信してしまった場合の対処',
        detail: 'もし本物のAPIキーをAIに送信してしまった場合は、速やかに該当サービス（OpenAIやGitHub等）の管理画面からキーを失効（Revoke/Delete）させ、再発行します。',
      },
    ],
    cautions: [
      '「あとで消せばいい」は通用しません。送信ボタンを押した瞬間に外部サーバーへ届きます。',
      '社内プロジェクトの顧客データや個人を特定できる氏名・電話番号・メールアドレスも必ず伏字にすること。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'ダミー値を用いた安全な実装相談テンプレート',
      generate: (context) => {
        const lang = context.language || 'TypeScript / Node.js';
        const detail = context.detail || '（API呼び出しや認証周りのコード）';

        return `【開発環境】
言語/環境: ${lang}

【相談の前提】
※セキュリティ保護のため、APIキーや接続パスワードはすべてダミー値（例: "DUMMY_KEY"）に置き換えています。

【実装したい内容・コード】
${detail}

【相談したいこと】
1. 上記コードにおいて、環境変数を安全に読み込んでAPIクライアントを初期化する正しい書き方を教えてください。
2. キーがフロントエンド（ブラウザ）に露出しないようにするための設計上の注意点を教えてください。`;
      },
    },
  ],
};
