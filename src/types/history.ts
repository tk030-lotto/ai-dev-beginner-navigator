/**
 * 履歴管理の型定義
 * 仕様書 第9章（履歴管理）に準拠
 */

/**
 * 記録対象のアクティビティ種別
 */
export type ActivityLogType =
  | 'search'
  | 'view_plugin'
  | 'generate_prompt';

/**
 * 履歴ログペイロード
 */
export interface ActivityLogPayload {
  query?: string;
  pluginId?: string;
  pluginName?: string;
  generatedPrompt?: string;
}

/**
 * アクティビティログレコード
 */
export interface ActivityLog {
  id: string;
  timestamp: number;
  type: ActivityLogType;
  payload: ActivityLogPayload;
}

/**
 * インポート結果
 */
export interface ImportResult {
  success: boolean;
  importedCount: number;
  error?: string;
}

/**
 * ストレージ抽象インターフェース
 * LocalStorageや将来的なIndexedDBへの切り替えを可能にする疎結合設計
 */
export interface HistoryStorageInterface {
  getLogs: () => ActivityLog[];
  addLog: (entry: { type: ActivityLogType; payload: ActivityLogPayload }) => ActivityLog;
  removeLog: (id: string) => boolean;
  clearLogs: () => void;
  exportLogs: () => string;
  importLogs: (jsonString: string, mode?: 'merge' | 'replace') => ImportResult;
}
