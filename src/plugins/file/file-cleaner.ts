/**
 * Fileプラグイン: 不要ファイル整理ナビ
 * ID: file-cleaner
 * 「どれを消してよくて、どれを消したら壊れるのかわからない」「node_modulesを消して大丈夫？」初心者に、
 * 再生成可能なキャッシュや一時ファイルと、絶対に消してはいけない重要ファイルの安全な見分け方を教える。
 */

import { ProblemPlugin } from '../../types';

export const fileCleanerPlugin: ProblemPlugin = {
  metadata: {
    id: 'file-cleaner',
    name: '不要ファイル整理ナビ',
    category: 'file',
    description: 'キャッシュ、ビルド生成物（dist）、ログファイルなど安全に削除・再生成できるファイルと、消すとプロジェクトが壊れるファイルを整理します。',
    keywords: [
      'ファイル整理',
      '不要ファイル',
      'node_modules削除',
      'キャッシュクリア',
      'dist削除',
      '容量削減',
      'クリーンアップ',
    ],
    beginnerPhrases: [
      'どれを消していい？',
      'node_modulesって消して平気？',
      '不要ファイルの削除',
      'ファイル整理',
      '容量が重い',
      'ゴミファイル',
      '消していいファイルの見分け方',
    ],
  },

  knowledge: {
    summary: '「いつでもコマンドで再生成できるファイル」は消しても無傷です。例えば node_modules/ は npm install で、dist/ は npm run build で完全に復活します。逆に package.json や src/ の中は手作業で書いたものなので消すと復元できません。',
    steps: [
      {
        step: 1,
        title: 'いつでも消して再生成できる「安全フォルダ」',
        detail: 'node_modules/（ライブラリ実体）、dist/（ビルド成果物）、.cache/（一時キャッシュ）は消してもコマンドでいつでも作り直せます。',
      },
      {
        step: 2,
        title: 'Gitでバージョン管理されているか確認する',
        detail: '削除前に git status を打ち、変更中のファイルが残っていないか確認します。Gitにコミット済みのファイルなら、万一誤って消しても「git checkout」で戻せます。',
        command: 'git status',
      },
      {
        step: 3,
        title: 'node_modulesのクリーン再インストールの手順',
        detail: '動作がおかしいときは、node_modules フォルダを丸ごと削除してから再度「npm install」を実行すると、破損したライブラリが綺麗に直ります。',
        command: 'npm install',
      },
    ],
    cautions: [
      'src/ や public/ の中身、package.json、tsconfig.json は絶対に手動でゴミ箱へ放り込まないこと。',
      'OSのコマンドラインで「rm -rf *」のような一括消去コマンドを安易に打たない。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'ファイル・フォルダの削除可否とクリーンアップ相談',
      generate: (context) => {
        const detail = context.detail || '（消そうか迷っているフォルダやファイル名、例: .vite, dist, package-lock.jsonなど）';

        return `プログラミング初学者です。プロジェクト内の容量を減らしたい（または整理したい）のですが、誤って大切なファイルを消してしまわないか不安です。

【消そうか迷っているファイル / フォルダ】:
${detail}

【教えてほしいこと】
1. このファイル/フォルダは削除しても問題ありませんか？（安全に再生成できるか、あるいは消すと動かなくなるか）
2. 削除した場合、どのようなコマンドを実行すれば再生成（復元）できますか？
3. 初心者がプロジェクトを安全にクリーンアップするための推奨手順を教えてください。`;
      },
    },
  ],
};
