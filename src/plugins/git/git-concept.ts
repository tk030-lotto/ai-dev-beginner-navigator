/**
 * Gitプラグイン: Git概念超入門
 * ID: git-concept
 * 「コミットとプッシュの違いがわからない」「リポジトリって何？」という初心者に、
 * セーブデータ・手紙の郵送に例えた直感的なメンタルモデルを提供する。
 */

import { ProblemPlugin } from '../../types';

export const gitConceptPlugin: ProblemPlugin = {
  metadata: {
    id: 'git-concept',
    name: 'Git概念超入門',
    category: 'git',
    description: 'コミット、プッシュ、プル、ステージング、リポジトリといったGitの基本概念を、ゲームのセーブや荷物の発送に例えて分かりやすく解説します。',
    keywords: [
      'Git概念',
      'コミット',
      'プッシュ',
      'プル',
      'ステージング',
      'リポジトリ',
      'バージョン管理入門',
    ],
    beginnerPhrases: [
      'コミットって何？',
      'プッシュとプルの違い',
      'Gitがわからない',
      'リポジトリって何？',
      'ステージングって何？',
      'GitHubに送る仕組み',
    ],
  },

  knowledge: {
    summary: 'Gitは「ゲームのセーブデータ管理」です。変更したファイルを段ボール箱に入れる（ステージング: git add）、箱にラベルを貼って自分の部屋に保管する（コミット: git commit）、保管した箱をクラウドの倉庫へ送る（プッシュ: git push）という3段階で動きます。',
    steps: [
      {
        step: 1,
        title: '作業場（ワークツリー）から荷造り箱へ入れる: git add',
        detail: 'ファイルを編集した後、「今回のセーブに含めたいファイル」を選んで箱に詰める作業が add（ステージング）です。',
        command: 'git add .',
      },
      {
        step: 2,
        title: 'セーブポイントを自分のPCに記録する: git commit',
        detail: '「何を変更したか」のメモ（メッセージ）を添えて、自分のPC内の歴史にセーブデータを確定させるのが commit です。',
        command: 'git commit -m "feat: ボタンの見た目を修正"',
      },
      {
        step: 3,
        title: 'クラウド（GitHub）の金庫へアップロードする: git push',
        detail: '自分のPCに溜まったコミットを、ネット上の共有リポジトリ（GitHub）へ転送して同期するのが push です。',
        command: 'git push origin main',
      },
    ],
    cautions: [
      'コミットしただけではGitHubには反映されません（プッシュして初めてネット上に届きます）。',
      'コミットメッセージは「変更」「修正」だけではなく、「何を追加/修正したか」を具体的に書く習慣をつけましょう。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'Gitの基本操作と状態確認の質問',
      generate: () => {
        return `プログラミング初学者です。Gitを使って自分のコードをGitHubで管理したいのですが、概念やコマンドの流れがまだ曖昧です。

【現在の状態】
PCローカルでファイルを編集し終えたところです。

【質問したいこと】
1. 「git add」「git commit」「git push」の3つの操作が、それぞれPCとGitHubのどこに対して何をしているのか、図解や日常の例え（ゲームのセーブや荷物発送など）を用いて初心者向けに教えてください。
2. 今自分のGitがどんな状態にあるか（セーブ漏れがないか）を確認するための最も安全なコマンド（git status等）と、その見方を教えてください。`;
      },
    },
  ],
};
