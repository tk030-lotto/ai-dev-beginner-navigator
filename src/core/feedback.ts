/**
 * 解決策フィードバック管理モジュール
 * 「役に立った (👍) / 解決しなかった (👎)」の記録と永続化
 */

export interface FeedbackItem {
  pluginId: string;
  helpful: boolean;
  timestamp: number;
}

export const FEEDBACK_STORAGE_KEY = 'ai_dev_beginner_navigator_feedback_v1';

export class FeedbackStore {
  private memoryFallback: Map<string, FeedbackItem> = new Map();
  private readonly storageKey: string;

  constructor(storageKey = FEEDBACK_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  /**
   * LocalStorageが使用可能か判定
   */
  private isStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__storage_test_feedback__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 全フィードバックマップを取得 (pluginId -> FeedbackItem)
   */
  public getAll(): Record<string, FeedbackItem> {
    if (this.isStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(this.storageKey);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed as Record<string, FeedbackItem>;
        }
        return {};
      } catch (err) {
        console.error('Failed to parse feedback from localStorage:', err);
        return {};
      }
    }
    const result: Record<string, FeedbackItem> = {};
    this.memoryFallback.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }

  /**
   * 内部保存メソッド
   */
  private save(data: Record<string, FeedbackItem>): void {
    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (err: any) {
        if (err && err.name === 'QuotaExceededError') {
          window.dispatchEvent(new CustomEvent('quota-exceeded'));
        }
        console.error('Failed to save feedback to localStorage:', err);
      }
    } else {
      this.memoryFallback.clear();
      Object.entries(data).forEach(([k, v]) => {
        this.memoryFallback.set(k, v);
      });
    }
  }

  /**
   * 特定プラグインの評価を取得
   */
  public get(pluginId: string): FeedbackItem | null {
    const all = this.getAll();
    return all[pluginId] || null;
  }

  /**
   * 評価を保存（上書き可能）
   */
  public rate(pluginId: string, helpful: boolean): FeedbackItem {
    const all = this.getAll();
    const item: FeedbackItem = {
      pluginId,
      helpful,
      timestamp: Date.now(),
    };
    all[pluginId] = item;
    this.save(all);
    return item;
  }

  /**
   * 評価を削除
   */
  public remove(pluginId: string): boolean {
    const all = this.getAll();
    if (pluginId in all) {
      delete all[pluginId];
      this.save(all);
      return true;
    }
    return false;
  }

  /**
   * 全クリア
   */
  public clear(): void {
    this.save({});
  }
}
