/**
 * Gitプラグイン: Git用語辞典
 * ID: git-terms
 * 「origin、main、HEAD、branch、merge... Gitの英語用語が多すぎて意味不明」という初心者に、
 * 最頻出の10大Git用語を日常の言葉に置き換えて解説する。
 */

import { ProblemPlugin } from '../../types';

export const gitTermsPlugin: ProblemPlugin = {
  metadata: {
    id: 'git-terms',
    name: 'Git用語辞典',
    category: 'git',
    description: 'origin、HEAD、ブランチ、マージ、クローン、フェッチなど、Gitで頻出する専門用語をわかりやすく解説します。',
    keywords: [
      'Git用語',
      'origin',
      'HEAD',
      'ブランチ',
      'branch',
      'マージ',
      'merge',
      'clone',
      'fetch',
    ],
    beginnerPhrases: [
      'originって何？',
      'HEADって何？',
      'ブランチとは',
      'Gitの言葉がわからない',
      'リモートって何？',
      'マージって何？',
      '用語辞典',
    ],
  },

  knowledge: {
    summary: 'Gitの用語は「場所」「状態」「動作」の3つに分類するとすっきり整理できます。「origin = GitHubという場所のあだ名」「HEAD = 今立っている現在地」「ブランチ = 並行して進める別世界」です。',
    steps: [
      {
        step: 1,
        title: 'originとmain（master）の正体を知る',
        detail: '「origin」は接続先であるGitHubのリポジトリURLの別名（ショートカット名）です。「main」は標準の本線ブランチ（幹）の名前です。',
      },
      {
        step: 2,
        title: 'HEADとブランチの正体を知る',
        detail: '「HEAD」は「あなたが今開いて作業している最新コミット」を指す看板（カーソル）です。「ブランチ（枝）」は本線を汚さずに新機能を試す作業スペースです。',
      },
      {
        step: 3,
        title: 'クローン（clone）とプル（pull）の違いを知る',
        detail: 'クローンは「初回に丸ごとGitHubからPCにダウンロードして部屋を作る」こと、プルは「すでにPCにある部屋を、GitHubの最新状態に更新する」ことです。',
      },
    ],
    cautions: [
      'master と main は呼び方が違うだけで基本的に同じ「本線」を指します（最近は main が標準です）。',
      'HEADが孤立する（detached HEAD）状態になってもファイルが消えたわけではないので慌てないこと。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'Git用語の平易な解説・日常例えの質問',
      generate: (context) => {
        const detail = context.detail || '（意味がわからなかったGit用語、例: origin, HEAD, rebaseなど）';

        return `プログラミング初学者です。Gitを使っていて以下の用語の意味がよくわかりません。

【知りたい用語】:
${detail}

【解説の要望】
1. この用語が「何を指しているのか」を、ITの専門知識がない人でもイメージできるように、日常の例え（本、手紙、セーブデータなど）を使って1つずつ解説してください。
2. その用語がターミナルのメッセージやコマンドで出てきたとき、初心者は何を意識すればよいですか？`;
      },
    },
  ],
};
