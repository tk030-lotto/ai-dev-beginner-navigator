/**
 * File代表プラグイン: 環境変数・.env保護ガイド
 * ID: file-env-safety
 * 初心者の「APIキーの隠し方」「GitHubに上げちゃダメ？」という疑問を、
 * .envと.gitignoreを使った安全管理と情報漏洩防止手順へと翻訳する。
 */

import { ProblemPlugin } from '../../types';

export const fileEnvSafetyPlugin: ProblemPlugin = {
  metadata: {
    id: 'file-env-safety',
    name: '環境変数・.env保護ガイド',
    category: 'file',
    description: 'APIキーやパスワードなどの機密情報をコードに直書きせず、.envと.gitignoreで安全に管理する手順を解説します。',
    keywords: [
      '.env',
      '環境変数',
      'gitignore',
      'APIキー',
      'パスワード',
      'シークレット',
      'secret',
      'token',
      '情報漏洩',
      'セキュリティ',
      'credentials',
    ],
    beginnerPhrases: [
      '.envって何？',
      'APIキーの隠し方',
      'GitHubに上げちゃダメ？',
      'パスワードがバレる',
      'クレデンシャルの管理',
      '鍵の置き場所',
      '秘密情報を隠したい',
    ],
  },

  knowledge: {
    summary: 'APIキーやDB接続パスワードは、プログラム本体（ソースコード）に直接書き込んではいけません。プロジェクト直下の「.env」に分離し、「.gitignore」でGit管理対象から除外するのが業界の標準ルールです。',
    steps: [
      {
        step: 1,
        title: '.gitignore に「.env」を追加する',
        detail: 'リポジトリ直下の .gitignore ファイルを開き、末尾に「.env」および「.env.local」を追記して保存します。',
        command: 'echo .env >> .gitignore',
      },
      {
        step: 2,
        title: '公開用のテンプレート「.env.example」を作成する',
        detail: '実際の秘密キーではなく、「API_KEY=your_api_key_here」のようなダミー値を記載した .env.example を作成し、こちらはGitでコミットして他の開発者と共有します。',
      },
      {
        step: 3,
        title: 'Git追跡から除外されているか git status で確認する',
        detail: 'ターミナルで git status を実行し、Untracked files または Changes に .env が表示されないことを確認します。',
        command: 'git status',
      },
    ],
    cautions: [
      '一度でもGitHubなどの公開リポジトリにPushしてしまったAPIキーは、ファイルを削除してもGit履歴（Commit Log）に残るため、直ちに該当サービスの管理画面でキーを無効化（Revoke/Regenerate）してください。',
      'フロントエンド（ブラウザ上で動くJavaScript/HTML）に埋め込まれた環境変数は、訪問者全員から閲覧可能です。ブラウザ側で秘密のAPIキーを扱わないでください。',
      '.envファイルをチャットツールやメールでそのまま送受信しないようにしましょう。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: '環境変数の読み込み実装と安全性チェック',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'Node.js / TypeScript';
        const detail = context.detail || '（使用したいAPIやライブラリ名。例: OpenAI API, Supabase）';

        return `【環境】
OS: ${os}
使用環境: ${lang}
利用対象: ${detail}

【相談内容】
1. 上記の環境において、APIキー等の秘密情報を「.env」ファイルから安全に読み込むための具体的なコードと設定手順を教えてください。
2. 間違ってGitHubなどのリモートリポジトリに送信してしまわないための設定（.gitignoreの書き方など）を提示してください。
3. もし誤って公開リポジトリにPushしてしまった場合の初動対応を教えてください。`;
      },
    },
    {
      targetAi: 'ChatGPT',
      title: '漏洩時の緊急対応プロンプト',
      generate: (context) => {
        const lang = context.language || 'Node.js';
        const detail = context.detail || '（漏洩したキーの種類やリポジトリの状況）';

        return `緊急対応の相談です。
GitHubのリポジトリにAPIキーや環境変数が含まれるファイルを誤ってPushしてしまいました。

状況:
${detail}
言語/環境: ${lang}

1. 被害を食い止めるために今すぐ行うべき緊急手順（最優先事項）を教えてください。
2. Gitのコミット履歴から完全に秘密情報を抹消する方法を教えてください。`;
      },
    },
  ],
};
