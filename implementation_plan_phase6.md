# 実装計画書: Phase 6 公開準備（設定整備・ドキュメント整合・ライセンス配置・最終検証）

* **対象プロジェクト**: AI開発初心者お助けナビ (`ai-dev-beginner-navigator`)
* **作成日**: 2026-09-04
* **準拠仕様**: 仕様書.md (Version 1.0.0 確定版)

---

## 目的とスコープ
本計画は、全30プラグインの実装（Phase 4）および仕様書第19章（完成条件15項目）監査（Phase 5）の完了を受け、将来のWeb公開に向けた設定整備、ドキュメント整合、ライセンス配置、およびローカル最終検証を完了させるための計画です。

※GitHub Pagesによる実際の公開・運用は後日実施とし、今回は公開準備（設定整備・ローカル検証）のみを実施します。

---

## 実施内容

### 1. ライセンス整備
- プロジェクト直下に `LICENSE`（MIT License, Copyright 2026 tk030-lotto）を配置。

### 2. ドキュメント整合（仕様書 第19章 項目15）
- `README.md` を現行の実装構成に合わせて全面改訂。
- ディレクトリ構成（`src/core/`, `src/plugins/`, `tests/` 等）の正確な反映。
- 全30プラグインの実装完了ステータス、ローカルセットアップ・テスト・ビルド手順の記載。
- ライセンス表示の明記。

### 3. デプロイ設定の準備
- 後日GitHub Pagesを有効化した際に自動動作する `.github/workflows/deploy.yml`（GitHub Actions ワークフロー）を作成。
- Node 22、`npm test`、`npm run build`、`upload-pages-artifact`、`deploy-pages` の一連のCI/CDパイプラインを事前定義。

### 4. ローカル最終検証
- `npm test`: Coreテスト、全30プラグイン構造・初心者フレーズ検索テスト、仕様書第19章完成条件15項目監査の全件パス確認。
- `npm run build`: TypeScript Strict Mode コンパイルエラー0件、静的アセット生成確認。

### 5. バージョン管理と記録永続化
- `RECORD.md` の更新。
- `walkthrough_phase6.md` の作成。
- Git コミットおよびリモート（`origin/main`）へのプッシュ。
