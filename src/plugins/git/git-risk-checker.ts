/**
 * Gitプラグイン: Git危険操作チェッカー
 * ID: git-risk-checker
 * 「AIに git reset --hard や git push -f を実行しろと言われたが大丈夫か」「コミットが消えそうで怖い」初心者に、
 * 取り返しのつかない破壊的コマンドの危険性と、安全な代替手段（git revert, git stash）を教える。
 */

import { ProblemPlugin } from '../../types';

export const gitRiskCheckerPlugin: ProblemPlugin = {
  metadata: {
    id: 'git-risk-checker',
    name: 'Git危険操作チェッカー',
    category: 'git',
    description: 'git reset --hard、git push -f、git clean -fd など、ローカルやリモートの変更を不可逆的に消去してしまう破壊的コマンドのリスクと安全策を解説します。',
    keywords: [
      'Git危険操作',
      'reset --hard',
      'push -f',
      '強制プッシュ',
      'ファイル消去',
      '歴史改変',
      '安全なロールバック',
    ],
    beginnerPhrases: [
      'resetして大丈夫？',
      '強制プッシュの危険',
      'git reset --hard',
      'push -f',
      '歴史を消す',
      '戻したら消える？',
      '過去のコミットに戻したい',
    ],
  },

  knowledge: {
    summary: 'Gitで最も警戒すべき2大危険コマンドは「git reset --hard（未コミットの作業ファイルを跡形もなく完全消去する）」と「git push -f（GitHub上の歴史を強制上書きしてチームや過去のコミットを破壊する）」です。絶対に無思考で打ってはいけません。',
    steps: [
      {
        step: 1,
        title: '作業中の変更を避難させる: git stash',
        detail: '今の作業を消さずに一時的に棚上げしたいときは、resetではなく stash（引き出しにしまう）を使います。',
        command: 'git stash',
      },
      {
        step: 2,
        title: '過去のコミットを打ち消す安全なコミットを作る: git revert',
        detail: '歴史を消す（reset）のではなく、「直前のコミットを取り消す新しいコミット」を追加する revert を使うと安全です。',
        command: 'git revert HEAD',
      },
      {
        step: 3,
        title: '消えたように見えても git reflog で探せる場合がある',
        detail: 'もし誤って reset してしまった場合でも、直後なら PC内の操作ログ（reflog）から救出できる可能性があります。慌ててターミナルを閉じないこと。',
        command: 'git reflog',
      },
    ],
    cautions: [
      '「git push -f」や「--force」が付いたプッシュは、共同作業者がいるリポジトリでは絶対に実行しない（他人のコードを吹き飛ばします）。',
      '「git reset --hard」を実行すると、まだコミットしていないファイルはGitのゴミ箱にも残らず完全に復元不能になります。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'Git安全な取り消し・巻き戻し方法の相談',
      generate: (context) => {
        const detail = context.detail || '（取り消したいコミットや、AIに提案されたコマンド）';

        return `Gitの操作で困っています。作業を取り消したいのですが、データを失う事故（ファイル完全消去）が怖いです。

【現在の状況】
${detail}

【相談したいこと】
1. この状況で「git reset --hard」や強制プッシュ（--force）を使わずに、安全に変更を戻す手順を教えてください。
2. 作業中の未コミットファイル（まだadd/commitしていないファイル）を失わないための事前バックアップ手順を教えてください。
3. 実行すべきコマンドとその意味を初心者向けに丁寧に解説してください。`;
      },
    },
  ],
};
