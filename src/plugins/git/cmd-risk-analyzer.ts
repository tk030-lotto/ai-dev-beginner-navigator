/**
 * Git代表プラグイン: 危険コマンド判定
 * ID: cmd-risk-analyzer
 * 初心者の「実行したら危ない？」「黒い画面が怖い」という不安に対し、
 * 不可逆な変更やデータ損失のリスクを判定・警告する。
 */

import { ProblemPlugin } from '../../types';

export const cmdRiskAnalyzerPlugin: ProblemPlugin = {
  metadata: {
    id: 'cmd-risk-analyzer',
    name: '危険コマンド判定',
    category: 'git',
    description: 'ターミナルで実行しようとしているGitコマンドやシェルの命令に、ファイル削除や履歴破壊などの危険がないかを確認します。',
    keywords: [
      'Git',
      'コマンド',
      '危険',
      'reset',
      'push -f',
      'force push',
      'rm',
      'clean',
      'データ消える',
      '元に戻せない',
      '破壊的',
    ],
    beginnerPhrases: [
      '実行したら危ないコマンド？',
      '黒い画面で警告が出た',
      '消えそうで怖い',
      'resetして大丈夫？',
      'push -fって何？',
      'コマンドの意味がわからない',
      'データが消えないか心配',
    ],
  },

  knowledge: {
    summary: 'コマンドライン（黒い画面）の操作には「ゴミ箱に入らず即座に完全消去されるコマンド」や「リモートの履歴を強制的に上書きするコマンド」があります。実行前に引数（オプション）の意味を確認することが重要です。',
    steps: [
      {
        step: 1,
        title: '危険なキーワード（引数）が含まれていないか確認する',
        detail: '「--hard」「-f」「--force」「rm -rf」「clean -fd」などの文字列が含まれている場合、警告なしにローカルの作業内容や履歴が消去されるリスクがあります。',
      },
      {
        step: 2,
        title: '現在の状態（git status）を確認する',
        detail: '変更がコミットされていない状態で危険なコマンドを実行すると復元が極めて困難になります。必ず作業前に状態を確認します。',
        command: 'git status',
      },
      {
        step: 3,
        title: '退避用の安全なバックアップブランチを作成する',
        detail: '不安な操作を行う前は、現在の一時退避用ブランチを作っておくことで、いつでも元の状態に戻せます。',
        command: 'git branch backup-before-operation',
      },
    ],
    cautions: [
      'git reset --hard HEAD~1 は、コミットしていないローカルの変更を完全に破棄します。',
      'git push --force (または -f) は、GitHub上のチームメンバーのコミットを上書き・消去してしまう重大なリスクがあります。',
      'rm -rf や del /f は、ゴミ箱を経由せずにフォルダごと永久消去するため、パスの指定ミスに最大限注意してください。',
      'AIから提示されたコマンドであっても、意味がわからない場合はそのまま貼り付けてEnterを押さないでください。',
    ],
  },

  promptTemplates: [
    {
      targetAi: 'All',
      title: 'コマンド実行前の安全性確認プロンプト',
      generate: (context) => {
        const os = context.os || 'Windows (PowerShell)';
        const detail = context.detail || '（実行しようとしているコマンド。例: git reset --hard HEAD）';

        return `【環境】
OS/ターミナル: ${os}

【実行を検討しているコマンド】
\`\`\`bash
${detail}
\`\`\`

【確認したい事項】
1. このコマンドを実行すると、何が起こりますか？
2. ファイルの削除、変更の消失、リモート履歴の上書きなどの危険（リスク）はありますか？
3. 初心者がより安全に同じ目的を達成するための代替コマンドや事前バックアップ手順を教えてください。`;
      },
    },
    {
      targetAi: 'Gemini',
      title: '危険箇所のハイライトと代替コマンドの相談',
      generate: (context) => {
        const os = context.os || 'Windows';
        const detail = context.detail || '（コマンドライン）';

        return `Gitおよびシェルコマンドの安全確認をお願いします。
環境: ${os}
対象コマンド: ${detail}

上記コマンドの各オプション（引数）の役割とリスクレベル（安全 / 注意 / 危険）を判定し、実行前にすべき確認事項を教えてください。`;
      },
    },
  ],
};
