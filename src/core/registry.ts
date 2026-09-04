/**
 * プラグインレジストリ
 * 個別プラグインの知識を一切持たず、登録・検索・カテゴリ取得を提供する基盤モジュール
 */

import type { CategoryType, ProblemPlugin } from '../types';

export class PluginRegistry {
  private plugins: Map<string, ProblemPlugin> = new Map();

  /**
   * 単一プラグインを登録
   * @throws 既に同じIDのプラグインが登録されている場合はErrorを投げる
   */
  public register(plugin: ProblemPlugin): void {
    if (!plugin || !plugin.metadata || !plugin.metadata.id) {
      throw new Error('Plugin must have a valid metadata.id');
    }

    const id = plugin.metadata.id;
    if (this.plugins.has(id)) {
      throw new Error(`Plugin with ID "${id}" is already registered.`);
    }

    this.plugins.set(id, plugin);
  }

  /**
   * 複数プラグインを一括登録
   */
  public registerAll(plugins: ProblemPlugin[]): void {
    for (const plugin of plugins) {
      this.register(plugin);
    }
  }

  /**
   * IDによるプラグイン取得
   */
  public getById(id: string): ProblemPlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * 登録されている全プラグインを取得
   */
  public getAll(): ProblemPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 指定カテゴリのプラグイン一覧を取得
   */
  public getByCategory(category: CategoryType): ProblemPlugin[] {
    return this.getAll().filter((plugin) => plugin.metadata.category === category);
  }

  /**
   * プラグインの登録解除
   */
  public unregister(id: string): boolean {
    return this.plugins.delete(id);
  }

  /**
   * レジストリをクリア
   */
  public clear(): void {
    this.plugins.clear();
  }

  /**
   * 登録プラグイン数
   */
  public count(): number {
    return this.plugins.size;
  }
}
