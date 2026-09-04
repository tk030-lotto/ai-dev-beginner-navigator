/**
 * Errorプラグイン: 原因切り分けガイド
 * ID: err-cause-finder
 * 「さっきまで動いていたのに動かない」「原因がどこにあるかわからない」という初心者の疑問を、
 * 変更履歴・環境・入力値の3つの軸から切り分ける手順へと導く。
 */

import { ProblemPlugin } from '../../types';

export const errCauseFinderPlugin: ProblemPlugin = {
  metadata: {
    id: 'err-cause-finder',
    name: '原因切り分けガイド',
    category: 'error',
    description: '動かない原因がコード・環境・入力のどこにあるかを段階的に切り分け、最短で原因を特定するためのガイドです。',
    keywords: [
      '切り分け',
      '原因特定',
      'トラブルシューティング',
      '動かない',
      'デバッグ',
      'debug',
      '環境要因',
      '再現手順',
    ],
    beginnerPhrases: [
      'なんで動かないの',
      'さっきまで動いてた',
      '原因がわからない',
      '突然動かなくなった',
      'どこがおかしいかわからない',
      '急にエラーになった',
    ],
  },

  knowledge: {
    summary: 'プログラムが急に動かなくなった場合、原因は「直前に変更したコード」「インストールしたパッケージ」「実行時の設定やデータ」のいずれかにあります。一度にすべてを疑わず、1つずつ確認していきます。',
    steps: [
      {
        step: 1,
        title: '直前に触ったファイルを特定する',
        detail: '最後に正常に動いていた時点から、どのファイルを編集したかをGitの差分（git diff）またはエディタの変更履歴で確認します。',
        command: 'git status',
      },
      {
        step: 2,
        title: '直前の変更を一時的に戻して試す',
        detail: '直前に追加・変更したコードをコメントアウトするか一時的に元に戻し、エラーが消えるか確認します。エラーが消えればその変更箇所に原因があります。',
      },
      {
        step: 3,
        title: '再起動とキャッシュクリアを試す',
        detail: '開発サーバーの再起動、ブラウザの強力再読み込み（Ctrl + F5 / Cmd + Shift + R）、またはnode_modules再生成を試して、環境キャッシュによる一時的な不具合を排除します。',
      },
    ],
    cautions: [
      '原因がわからない状態で複数の設定やファイルを同時に変更しない（何が効いたか特定不能になります）。',
      '直前の変更を保存・コミットせずに破棄しない。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: '原因切り分け・再現性分析プロンプト',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript / JavaScript';
        const detail = context.detail || '（直前の操作、起きたこと、試したことを記載）';

        return `【開発環境】
OS: ${os}
使用言語/環境: ${lang}

【状況】
さっきまで動いていたプログラムが動かなくなりました。
${detail}

【相談したいこと】
1. この状況から考えられる原因の候補を、可能性が高い順に3つ挙げてください。
2. どの候補が原因かを特定するための「切り分け手順（試すべき操作）」を具体的に教えてください。
3. 初心者でも安全に検証できるコマンドやログの出し方を提示してください。`;
      },
    },
    {
      targetAi: 'Claude',
      title: '切り分け・再現手順の逐次指導',
      generate: (context) => {
        const os = context.os || 'Windows';
        const lang = context.language || 'TypeScript';
        const detail = context.detail || '（変更内容や挑價してみたこと）';

        return `プログラミング初学者です。直前まで動いていたコードが動かなくなりました。

「動かなくなった」状況を一緒に整理して、原因を特定する手順を段階的に案内してください。

環境: ${os} / ${lang}

状況:
${detail}

【依頼】
1. 原因候補を可能性が高い順に3つ挙げてください。
2. 各候補を安全に検証する具体的なコマンドや操作を教えてください。
3. 原因特定後の修正時に注意すべき副作用はありますか？`;
      },
    },
  ],
};
