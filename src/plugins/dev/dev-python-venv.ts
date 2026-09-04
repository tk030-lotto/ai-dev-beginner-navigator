import { ProblemPlugin } from '../../types';

export const devPythonVenvPlugin: ProblemPlugin = {
  metadata: {
    id: 'dev-python-venv',
    name: 'Python仮想環境（venv）作成ナビ',
    category: 'dev-support',
    description: 'PC全体のPython環境を汚さずに、プロジェクトごとに独立したライブラリ環境を構築する手順です。',
    keywords: ['Python', 'venv', '仮想環境', 'pip', 'requirements.txt', 'activate'],
    beginnerPhrases: [
      'Pythonのパッケージが競合した',
      'venvの作り方がわからない',
      'activateできない',
      'ライブラリをプロジェクトごとに分けたい',
    ],
  },
  knowledge: {
    summary:
      'Pythonでは、プロジェクトごとに `venv`（仮想環境）を作成してライブラリをインストールするのが鉄則です。PC本体のPython環境に直接 `pip install` すると、プロジェクト間でライブラリのバージョンが衝突して動かなくなります。',
    steps: [
      {
        step: 1,
        title: '仮想環境（.venv）を作成する',
        detail: 'プロジェクトフォルダ直下で以下のコマンドを実行し、仮想環境フォルダを作成します。',
        command: 'python -m venv .venv',
      },
      {
        step: 2,
        title: '仮想環境を有効化（Activate）する',
        detail:
          'Windows（PowerShell）の場合は `.venv\\Scripts\\Activate.ps1`、Mac/Linuxの場合は `source .venv/bin/activate` を実行します。ターミナル先頭に `(.venv)` が付けば成功です。',
        command: '.\\.venv\\Scripts\\Activate.ps1',
      },
      {
        step: 3,
        title: 'ライブラリをインストールし、requirements.txtに書き出す',
        detail:
          '仮想環境が有効な状態でpipを使い、最後に現在の依存関係一覧を保存します。',
        command: 'pip freeze > requirements.txt',
      },
    ],
    cautions: [
      'WindowsのPowerShellで「スクリプトの実行が無効になっている」エラーが出た場合は、`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` を実行して許可してください。',
      '`.venv/` フォルダは容量が非常に大きく再生成可能なため、絶対に `.gitignore` に追加してコミットしないでください。',
    ],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'Python環境セットアッププロンプト',
      generate: (context) => {
        const os = context.os || 'Windows';
        const detail = context.detail || '新しいPythonプロジェクトを立ち上げたいです。';
        return `Pythonの仮想環境と依存管理のセットアップについて教えてください。
OS: ${os}

【やりたいこと】
${detail}

【お願い】
1. venv作成からアクティベート、ライブラリのインストール手順
2. VSCodeでこの仮想環境を認識させるためのインタープリター選択手順
3. .gitignore に記載すべきPython用除外設定`;
      },
    },
  ],
};
