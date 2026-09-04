/**
 * AI開発初心者お助けナビ (AI Dev Beginner Navigator)
 * エントリポイント
 */

import {
  PluginRegistry,
  SearchEngine,
  LocalStorageHistoryStore,
  sanitizeInput,
  expandSynonyms,
} from './core';

// Core基盤シングルトンインスタンス
export const registry = new PluginRegistry();
export const searchEngine = new SearchEngine();
export const historyStore = new LocalStorageHistoryStore();

export { sanitizeInput, expandSynonyms };

console.log('AI Dev Beginner Navigator Core initialized.', {
  registryCount: registry.count(),
  historyCount: historyStore.getLogs().length,
});

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <main style="font-family: 'Noto Sans JP', sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6;">
      <h1 style="color: #0284c7;">AI開発初心者お助けナビ</h1>
      <p style="color: #475569;">Core基盤モジュールの初期化が完了しました。（PluginRegistry, SearchEngine, LocalStorageHistoryStore, Sanitizer, Synonyms）</p>
    </main>
  `;
}
