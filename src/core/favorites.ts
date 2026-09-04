/**
 * お気に入り管理モジュール
 * LocalStorageベース、プラグインIDの永続化・トグル・一覧取得
 */

export const FAVORITES_STORAGE_KEY = 'ai_dev_beginner_navigator_favorites_v1';

export class FavoritesStore {
  private memoryFallback: Set<string> = new Set();
  private readonly storageKey: string;

  constructor(storageKey = FAVORITES_STORAGE_KEY) {
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
      const testKey = '__storage_test_fav__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 全お気に入りIDを取得
   */
  public getAll(): string[] {
    if (this.isStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(this.storageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string');
        }
        return [];
      } catch (err) {
        console.error('Failed to parse favorites from localStorage:', err);
        return [];
      }
    }
    return Array.from(this.memoryFallback);
  }

  /**
   * 内部保存メソッド
   */
  private save(ids: string[]): void {
    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(ids));
      } catch (err) {
        console.error('Failed to save favorites to localStorage:', err);
      }
    } else {
      this.memoryFallback = new Set(ids);
    }
  }

  /**
   * お気に入りに登録されているか判定
   */
  public has(pluginId: string): boolean {
    const list = this.getAll();
    return list.includes(pluginId);
  }

  /**
   * お気に入りに追加
   */
  public add(pluginId: string): boolean {
    const list = this.getAll();
    if (!list.includes(pluginId)) {
      list.push(pluginId);
      this.save(list);
      return true;
    }
    return false;
  }

  /**
   * お気に入りから削除
   */
  public remove(pluginId: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((id) => id !== pluginId);
    if (filtered.length !== list.length) {
      this.save(filtered);
      return true;
    }
    return false;
  }

  /**
   * トグル（登録・解除を切り替え）
   * @returns トグル後の状態（true: 登録中, false: 解除済み）
   */
  public toggle(pluginId: string): boolean {
    if (this.has(pluginId)) {
      this.remove(pluginId);
      return false;
    } else {
      this.add(pluginId);
      return true;
    }
  }

  /**
   * 全クリア
   */
  public clear(): void {
    this.save([]);
  }
}
