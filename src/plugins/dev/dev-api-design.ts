import { ProblemPlugin } from '../../types';

export const devApiDesignPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-api-design',
    name: 'REST API設計＆エンドポイント命名ナビ',
    category: 'dev-support',
    description: '直感的で崩れにくいRESTful APIのエンドポイント設計とHTTPメソッド・ステータスコードの使い分けを解説します。',
    keywords: ['API', 'REST', 'GET', 'POST', 'PUT', 'DELETE', 'エンドポイント', 'JSON'],
    beginnerPhrases: [
      'APIのURLどう決めればいい？',
      'GETとPOSTの違いがわからない',
      '404と500の違い',
      'REST APIの作り方',
    ],
  },
  knowledge: {
    summary:
      'REST APIの基本原則は「URLは名詞の複数形（リソース）を表し、操作はHTTPメソッド（GET/POST/PUT/DELETE）で表す」ことです。URLの中に `getUser` や `deleteItem` のような動詞を入れないのが綺麗な設計の鉄則です。',
    steps: [
      {
        step: 1,
        title: 'リソース名（名詞の複数形）でURLを統一する',
        detail:
          '例: ユーザー一覧は `GET /api/users`、特定ユーザーは `GET /api/users/:id`、作成は `POST /api/users` とします。',
      },
      {
        step: 2,
        title: 'HTTPメソッドを正しく使い分ける',
        detail:
          '取得はGET、新規作成はPOST、更新はPUT/PATCH、削除はDELETEを使います。GETメソッドでサーバー側のデータを変更してはいけません。',
      },
      {
        step: 3,
        title: '適切なHTTPステータスコードを返却する',
        detail:
          '成功（200 OK / 201 Created）、クライアントの入力ミス（400 Bad Request / 404 Not Found / 401 Unauthorized）、サーバー側の不具合（500 Internal Server Error）を明確に区別します。',
      },
    ],
    cautions: [
      'エラー時にもステータスコード 200 を返し、JSON本文の中に `{ status: "error" }` とだけ書く設計は、フロントエンド側のエラーハンドリングを複雑にするため避けてください。',
      '機密情報（パスワードやトークン）をURLのクエリパラメータに含めないでください（サーバーのアクセスログに残ってしまいます）。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'REST APIエンドポイント設計プロンプト',
      generate: (context) => {
        const detail = context.detail || 'ブログアプリのAPIを設計したいです。';
        return `以下の機能要件に対する、RESTful APIの仕様設計書（エンドポイント一覧）を作成してください。

【機能要件】
${detail}

【出力内容】
1. 各エンドポイント（HTTPメソッド + URLパス）
2. リクエスト（ヘッダー、ボディ、クエリパラメータのJSON構造）
3. レスポンス（成功時のステータスコードとJSON、エラー時のステータスコードとJSON）
4. 初心者が設計で注意すべきポイント`;
      },
    },
  ],
};
