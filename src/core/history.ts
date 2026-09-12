/**
 * 履歴管理モジュール
 * 仕様書 第9章（履歴管理）に準拠
 * LocalStorageベース、最大500件保持（FIFO自動パージ）、JSON入出力対応
 */

import type {
  ActivityLog,
  ActivityLogPayload,
  ActivityLogType,
  HistoryStorageInterface,
  ImportResult,
} from '../types';

export const MAX_HISTORY_ITEMS = 500;
export const STORAGE_KEY = 'ai_dev_beginner_navigator_history_v1';

export class LocalStorageHistoryStore implements HistoryStorageInterface {
  private memoryFallback: ActivityLog[] = [];
  private readonly storageKey: string;
  private readonly maxItems: number;

  constructor(storageKey = STORAGE_KEY, maxItems = MAX_HISTORY_ITEMS) {
    this.storageKey = storageKey;
    this.maxItems = maxItems;
  }

  /**
   * LocalStorageが使用可能か判定
   */
  private isStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 内部保存メソッド
   */
  private save(logs: ActivityLog[]): void {
    // 最大件数（FIFO: 新しい順に先頭に追加されるため、末尾を切り捨て）
    const trimmed = logs.slice(0, this.maxItems);
    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
      } catch (err: any) {
        if (err && err.name === 'QuotaExceededError') {
          window.dispatchEvent(new CustomEvent('quota-exceeded'));
        }
        console.error('Failed to save logs to localStorage:', err);
      }
    } else {
      this.memoryFallback = trimmed;
    }
  }

  /**
   * 全履歴を取得（新しい順）
   */
  public getLogs(): ActivityLog[] {
    if (this.isStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(this.storageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.error('Failed to parse logs from localStorage:', err);
        return [];
      }
    }
    return [...this.memoryFallback];
  }

  /**
   * 履歴エントリを追加
   */
  public addLog(entry: { type: ActivityLogType; payload: ActivityLogPayload }): ActivityLog {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      type: entry.type,
      payload: entry.payload,
    };

    const currentLogs = this.getLogs();
    // 先頭に最新のログを追加
    const updated = [newLog, ...currentLogs];
    this.save(updated);

    return newLog;
  }

  /**
   * 単一ログの削除
   */
  public removeLog(id: string): boolean {
    const current = this.getLogs();
    const filtered = current.filter((log) => log.id !== id);
    if (filtered.length !== current.length) {
      this.save(filtered);
      return true;
    }
    return false;
  }

  /**
   * 全履歴の消去
   */
  public clearLogs(): void {
    if (this.isStorageAvailable()) {
      window.localStorage.removeItem(this.storageKey);
    }
    this.memoryFallback = [];
  }

  /**
   * 履歴のJSONエクスポート
   */
  public exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        count: logs.length,
        logs,
      },
      null,
      2
    );
  }

  /**
   * 履歴のJSONインポート
   * @param jsonString エクスポートされたJSON文字列
   * @param mode 'merge'（既存と統合）または 'replace'（全置換）
   */
  public importLogs(jsonString: string, mode: 'merge' | 'replace' = 'merge'): ImportResult {
    try {
      const parsed = JSON.parse(jsonString);
      const incomingLogs: ActivityLog[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.logs)
        ? parsed.logs
        : [];

      // バリデーション: 各要素がActivityLogの構造を満たしているか
      const validLogs = incomingLogs.filter(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.timestamp === 'number' &&
          typeof item.type === 'string' &&
          typeof item.payload === 'object'
      );

      if (validLogs.length === 0 && incomingLogs.length > 0) {
        return {
          success: false,
          importedCount: 0,
          error: 'No valid log entries found in JSON',
        };
      }

      if (mode === 'replace') {
        this.save(validLogs);
        return { success: true, importedCount: validLogs.length };
      }

      // merge モード: IDで重複を排除しながらマージ
      const current = this.getLogs();
      const map = new Map<string, ActivityLog>();
      for (const log of current) {
        map.set(log.id, log);
      }
      for (const log of validLogs) {
        map.set(log.id, log);
      }

      const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
      this.save(merged);

      return {
        success: true,
        importedCount: validLogs.length,
      };
    } catch (err) {
      return {
        success: false,
        importedCount: 0,
        error: err instanceof Error ? err.message : 'Invalid JSON format',
      };
    }
  }
}

/**
 * デフォルトのシングルトンインスタンス
 */
export const defaultHistoryStore = new LocalStorageHistoryStore();
