/**
 * Core基盤モジュールの自律動作検証テスト
 */

import { PluginRegistry } from '../src/core/registry';
import { expandSynonyms } from '../src/core/synonyms';
import { SearchEngine } from '../src/core/search';
import { sanitizeInput, detectSecrets } from '../src/core/sanitizer';
import { LocalStorageHistoryStore } from '../src/core/history';
import { FavoritesStore } from '../src/core/favorites';
import { FeedbackStore } from '../src/core/feedback';
import type { ProblemPlugin } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Core Infrastructure Tests ===\n');

// 1. PluginRegistry Test
console.log('1. Testing PluginRegistry...');
const registry = new PluginRegistry();
const mockPlugin: ProblemPlugin = {
  metadata: {
    id: 'test-err-plugin',
    name: 'エラー翻訳ナビ',
    category: 'error',
    description: 'エラーメッセージを分かりやすく翻訳します',
    keywords: ['エラー', '翻訳', 'error'],
    beginnerPhrases: ['赤い文字が出た', 'エラーの意味がわからない'],
  },
  knowledge: {
    summary: 'エラーログを読み解く手順を解説します',
    steps: [{ step: 1, title: 'ログ確認', detail: 'エラーの最後の行を見ます' }],
    cautions: ['秘密情報を貼り付けないでください'],
  },
  promptTemplates: [
    {
      targetAi: 'ChatGPT',
      title: 'エラー相談',
      generate: (ctx) => `エラー内容: ${ctx.userInput}`,
    },
  ],
};

registry.register(mockPlugin);
assert(registry.count() === 1, 'Registry should have 1 plugin');
assert(registry.getById('test-err-plugin')?.metadata.name === 'エラー翻訳ナビ', 'getById should return correct plugin');
assert(registry.getByCategory('error').length === 1, 'getByCategory should return 1 plugin');
assert(registry.getByCategory('git').length === 0, 'getByCategory for other should return 0 plugins');

// 重複登録エラーテスト
let errorThrown = false;
try {
  registry.register(mockPlugin);
} catch {
  errorThrown = true;
}
assert(errorThrown, 'Registering duplicate ID must throw error');
console.log('✓ PluginRegistry test passed.\n');

// 2. Synonyms Test
console.log('2. Testing Synonyms Expansion...');
const expandedPush = expandSynonyms('載せたい');
assert(expandedPush.includes('push'), '載せたい should expand to push');
assert(expandedPush.includes('deploy'), '載せたい should expand to deploy');

const expandedError = expandSynonyms('赤文字が出た');
assert(expandedError.includes('error'), '赤文字が出た should expand to error');
console.log('✓ Synonyms test passed.\n');

// 3. SearchEngine Test
console.log('3. Testing SearchEngine Scoring...');
const searchEngine = new SearchEngine();

// 初心者フレーズ一致（重み3）テスト
const resultsPhrase = searchEngine.search([mockPlugin], { keyword: '赤い文字' });
assert(resultsPhrase.length === 1, 'Should find plugin by beginner phrase');
assert(resultsPhrase[0].score >= 3, `Score should be at least 3 for beginner phrase, got: ${resultsPhrase[0].score}`);
assert(resultsPhrase[0].matchedBeginnerPhrases.includes('赤い文字が出た'), 'Matched phrase should be recorded');

// シノニム展開による一致テスト（「動かない」→ error → keywords: error(重み2)）
const resultsSynonym = searchEngine.search([mockPlugin], { keyword: '動かない' });
assert(resultsSynonym.length === 1, 'Should find plugin via synonym expansion');
assert(resultsSynonym[0].score >= 2, `Score should be at least 2, got: ${resultsSynonym[0].score}`);

// カテゴリ絞り込みテスト
const resultsCatMismatch = searchEngine.search([mockPlugin], { keyword: 'エラー', category: 'git' });
assert(resultsCatMismatch.length === 0, 'Category mismatch should filter out result');

const resultsCatMatch = searchEngine.search([mockPlugin], { keyword: 'エラー', category: 'error' });
assert(resultsCatMatch.length === 1, 'Category match should return result');
console.log('✓ SearchEngine test passed.\n');

// 4. Sanitizer Test
console.log('4. Testing Sanitizer...');
const secretApiKey = 'sk-abcdef1234567890abcdef123456';
const sampleText = `私のキーは ${secretApiKey} です。`;
assert(detectSecrets(sampleText) === true, 'detectSecrets should return true for OpenAI key');

const sanitized = sanitizeInput(sampleText);
assert(sanitized.hasSecrets === true, 'hasSecrets should be true');
assert(sanitized.redactedCount === 1, 'redactedCount should be 1');
assert(sanitized.sanitizedText.includes('[REDACTED]'), 'Text should contain [REDACTED]');
assert(!sanitized.sanitizedText.includes(secretApiKey), 'Text should not contain original key');

// GitHub Token test
const ghText = 'トークン: ghp_123456789012345678901234567890123456';
const ghSanitized = sanitizeInput(ghText);
assert(ghSanitized.hasSecrets === true, 'GitHub token should be detected');
assert(ghSanitized.sanitizedText.includes('[REDACTED]'), 'GitHub token should be redacted');
console.log('✓ Sanitizer test passed.\n');

// 5. History Store Test (メモリフォールバック動作)
console.log('5. Testing HistoryStore...');
const historyStore = new LocalStorageHistoryStore('test_history_key', 5);
historyStore.clearLogs();

const log1 = historyStore.addLog({
  type: 'search',
  payload: { query: '赤い文字' },
});
assert(historyStore.getLogs().length === 1, 'Should have 1 log');
assert(historyStore.getLogs()[0].id === log1.id, 'Log ID should match');

// 5件上限テスト
for (let i = 0; i < 10; i++) {
  historyStore.addLog({
    type: 'search',
    payload: { query: `クエリ ${i}` },
  });
}
assert(historyStore.getLogs().length === 5, 'History must be capped at maxItems (5)');

// エクスポート＆インポートテスト
const exported = historyStore.exportLogs();
assert(typeof exported === 'string' && exported.includes('クエリ'), 'Exported JSON should contain queries');

const newStore = new LocalStorageHistoryStore('test_history_key_2', 10);
const importRes = newStore.importLogs(exported, 'replace');
assert(importRes.success === true, 'Import should succeed');
assert(newStore.getLogs().length === 5, 'Imported count should be 5');

historyStore.clearLogs();
newStore.clearLogs();
console.log('✓ HistoryStore test passed.\n');

// 6. FavoritesStore Test
console.log('6. Testing FavoritesStore...');
const favStore = new FavoritesStore('test_fav_key');
favStore.clear();
assert(favStore.getAll().length === 0, 'Initial favorites should be empty');
assert(favStore.has('plugin-a') === false, 'Should not have plugin-a initially');

// 追加
assert(favStore.add('plugin-a') === true, 'add should return true for new item');
assert(favStore.has('plugin-a') === true, 'Should have plugin-a');
assert(favStore.add('plugin-a') === false, 'add should return false for duplicate');
assert(favStore.getAll().length === 1, 'Length should be 1');

// トグル
const toggledOff = favStore.toggle('plugin-a');
assert(toggledOff === false, 'toggle should remove plugin-a');
assert(favStore.has('plugin-a') === false, 'plugin-a should not exist');

const toggledOn = favStore.toggle('plugin-b');
assert(toggledOn === true, 'toggle should add plugin-b');
assert(favStore.has('plugin-b') === true, 'plugin-b should exist');

// 削除 & クリア
favStore.remove('plugin-b');
assert(favStore.getAll().length === 0, 'remove should empty the list');

favStore.add('p1');
favStore.add('p2');
assert(favStore.getAll().length === 2, 'Should have 2 items');
favStore.clear();
assert(favStore.getAll().length === 0, 'clear should empty all');
console.log('✓ FavoritesStore test passed.\n');

// 7. FeedbackStore Test
console.log('7. Testing FeedbackStore...');
const fbStore = new FeedbackStore('test_feedback_key');
fbStore.clear();
assert(Object.keys(fbStore.getAll()).length === 0, 'Initial feedback should be empty');
assert(fbStore.get('plugin-1') === null, 'Should return null for non-existing feedback');

// 役に立った (helpful = true)
const fb1 = fbStore.rate('plugin-1', true);
assert(fb1.helpful === true, 'Rate should record helpful=true');
assert(fbStore.get('plugin-1')?.helpful === true, 'get should retrieve recorded helpful');
assert(Object.keys(fbStore.getAll()).length === 1, 'Length should be 1');

// 解決しなかった (helpful = false) で上書き
const fb2 = fbStore.rate('plugin-1', false);
assert(fb2.helpful === false, 'Rate overwrite should record helpful=false');
assert(fbStore.get('plugin-1')?.helpful === false, 'get should return updated helpful=false');

// 削除
assert(fbStore.remove('plugin-1') === true, 'remove should return true');
assert(fbStore.get('plugin-1') === null, 'get should return null after removal');

// クリア
fbStore.rate('p1', true);
fbStore.rate('p2', false);
assert(Object.keys(fbStore.getAll()).length === 2, 'Should have 2 items');
fbStore.clear();
assert(Object.keys(fbStore.getAll()).length === 0, 'clear should empty all items');
console.log('✓ FeedbackStore test passed.\n');

console.log('=== All Core Infrastructure Tests Passed Successfully! ===');
