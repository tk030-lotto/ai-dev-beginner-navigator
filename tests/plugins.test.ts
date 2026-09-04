/**
 * 全30プラグインおよびCore基盤統合動作検証テスト
 */

import { PluginRegistry } from '../src/core/registry';
import { SearchEngine } from '../src/core/search';
import {
  allPlugins,
  registerAllPlugins,
} from '../src/plugins';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting All 30 Plugins & E2E Integration Tests ===\n');

// 1. 全30プラグインのデータ構造およびプロンプト生成検証
console.log('1. Validating All 30 Plugin Data Structures...');
assert(allPlugins.length === 30, `Expected 30 plugins in allPlugins, got ${allPlugins.length}`);

const seenIds = new Set<string>();

for (const p of allPlugins) {
  // IDの一意性確認
  assert(!seenIds.has(p.metadata.id), `Duplicate plugin ID detected: ${p.metadata.id}`);
  seenIds.add(p.metadata.id);

  // 必須フィールド確認
  assert(Boolean(p.metadata.id), `Plugin must have id: ${p.metadata.name}`);
  assert(Boolean(p.metadata.name), `Plugin must have name: ${p.metadata.id}`);
  assert(Boolean(p.metadata.category), `Plugin must have category: ${p.metadata.id}`);
  assert(p.metadata.keywords.length > 0, `Plugin must have keywords: ${p.metadata.id}`);
  assert(p.metadata.beginnerPhrases.length > 0, `Plugin must have beginnerPhrases: ${p.metadata.id}`);
  assert(Boolean(p.knowledge.summary), `Plugin must have summary: ${p.metadata.id}`);
  assert(p.knowledge.steps.length > 0, `Plugin must have steps: ${p.metadata.id}`);
  assert(p.knowledge.cautions.length > 0, `Plugin must have cautions: ${p.metadata.id}`);
  assert(p.promptTemplates.length > 0, `Plugin must have promptTemplates: ${p.metadata.id}`);

  // プロンプト生成関数の実行確認
  for (const t of p.promptTemplates) {
    const samplePrompt = t.generate({
      os: 'Windows',
      language: 'TypeScript',
      detail: 'テスト用の詳細コンテキスト',
    });
    assert(
      typeof samplePrompt === 'string' && samplePrompt.length > 20,
      `Prompt generation failed for ${p.metadata.id} - ${t.title}`
    );
  }
}
console.log(`✓ All ${allPlugins.length} plugins validated without duplicate IDs or missing fields.\n`);

// 2. Registry一括登録およびカテゴリ件数テスト
console.log('2. Testing Registry Bulk Registration...');
const registry = new PluginRegistry();
const registeredCount = registerAllPlugins(registry);
assert(registeredCount === 30, `Expected 30 plugins registered, got ${registeredCount}`);
assert(registry.count() === 30, 'Registry count should be 30');

// カテゴリ別件数検証（仕様書第8章: Error 5, AI 10, Git 6, File 5, Dev Support 4）
const errorList = registry.getByCategory('error');
const aiList = registry.getByCategory('ai');
const gitList = registry.getByCategory('git');
const fileList = registry.getByCategory('file');
const devList = registry.getByCategory('dev-support');

assert(errorList.length === 5, `Error category should have 5 plugins, got ${errorList.length}`);
assert(aiList.length === 10, `AI category should have 10 plugins, got ${aiList.length}`);
assert(gitList.length === 6, `Git category should have 6 plugins, got ${gitList.length}`);
assert(fileList.length === 5, `File category should have 5 plugins, got ${fileList.length}`);
assert(devList.length === 4, `Dev Support category should have 4 plugins, got ${devList.length}`);
console.log('✓ Category distribution verified: Error=5, AI=10, Git=6, File=5, Dev=4 (Total: 30).\n');

// 3. 初心者語句による検索エンジン結合テスト
console.log('3. Testing Search Engine with Beginner Phrases Across All 30 Plugins...');
const searchEngine = new SearchEngine();
const pluginsList = registry.getAll();

const testQueries = [
  { query: '赤い文字', expectedId: 'err-explainer' },
  { query: 'さっきまで動いてた', expectedId: 'err-cause-finder' },
  { query: 'ログが長すぎる', expectedId: 'err-log-cleaner' },
  { query: 'AIにエラーをどう聞く？', expectedId: 'err-ai-consultant' },
  { query: 'AIの言った通りにして大丈夫？', expectedId: 'err-fix-checker' },
  { query: '指示の書き方', expectedId: 'ai-prompt-creator' },
  { query: '伝わらない', expectedId: 'ai-instruction-check' },
  { query: '一気に頼みすぎて失敗した', expectedId: 'ai-task-delegation' },
  { query: 'AIの回答が長くて難しい', expectedId: 'ai-response-organizer' },
  { query: '次に何をすればいい？', expectedId: 'ai-todo-extractor' },
  { query: 'どっちの答えが正しい？', expectedId: 'ai-answer-compare' },
  { query: 'どこが変わったかわからない', expectedId: 'ai-diff-analyzer' },
  { query: 'パスワードやキーをAIに送って大丈夫？', expectedId: 'ai-input-sanitizer' },
  { query: 'このコード動かして壊れない？', expectedId: 'ai-pre-check' },
  { query: 'ちゃんと動いてるか確認したい', expectedId: 'ai-post-check' },
  { query: 'この黒い画面のコマンド何？', expectedId: 'cmd-explainer' },
  { query: '危険コマンド', expectedId: 'cmd-risk-analyzer' },
  { query: 'コミットって何？', expectedId: 'git-concept' },
  { query: 'resetして大丈夫？', expectedId: 'git-risk-checker' },
  { query: 'originって何？', expectedId: 'git-terms' },
  { query: 'コンフリクトした', expectedId: 'git-trouble-helper' },
  { query: 'どのフォルダに何を置く？', expectedId: 'file-structure' },
  { query: '.jsonって何？', expectedId: 'file-ext-explainer' },
  { query: 'package.jsonの読み方', expectedId: 'file-config-checker' },
  { query: 'APIキーの隠し方', expectedId: 'file-env-safety' },
  { query: 'どれを消していい？', expectedId: 'file-cleaner' },
  { query: 'READMEの書き方', expectedId: 'dev-md-formatter' },
  { query: '表を作りたい', expectedId: 'dev-md-table' },
  { query: 'カンマの位置', expectedId: 'dev-json-validator' },
  { query: 'どこまでAIに任せていい？', expectedId: 'dev-ai-vs-human' },
];

for (const tc of testQueries) {
  const results = searchEngine.search(pluginsList, { keyword: tc.query });
  assert(results.length > 0, `Search for "${tc.query}" should return results`);
  assert(
    results[0].plugin.metadata.id === tc.expectedId,
    `Top result for "${tc.query}" should be "${tc.expectedId}", but got "${results[0].plugin.metadata.id}"`
  );
  console.log(`  - "${tc.query}" -> Top Hit: [${results[0].plugin.metadata.id}] ${results[0].plugin.metadata.name} (Score: ${results[0].score})`);
}

// 4. カテゴリ絞り込みテスト
const aiCategoryResults = searchEngine.search(pluginsList, { keyword: 'コード', category: 'ai' });
assert(
  aiCategoryResults.every((r) => r.plugin.metadata.category === 'ai'),
  'Filtered search must strictly contain only AI plugins'
);

console.log('\n✓ All 30 beginner phrase test queries and category filters passed successfully.');
console.log('=== All 30 Plugins & Integration Tests Passed Successfully ===');
