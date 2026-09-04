/**
 * 代表プラグインおよびCore基盤統合動作検証テスト
 */

import { PluginRegistry } from '../src/core/registry';
import { SearchEngine } from '../src/core/search';
import {
  initialPlugins,
  registerInitialPlugins,
  errExplainerPlugin,
  aiPromptCreatorPlugin,
  cmdRiskAnalyzerPlugin,
  fileEnvSafetyPlugin,
  devJsonValidatorPlugin,
} from '../src/plugins';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Plugins & E2E Integration Tests ===\n');

// 1. 各プラグインのメタデータ・構造検証
console.log('1. Validating Plugin Data Structures...');
const plugins = [
  errExplainerPlugin,
  aiPromptCreatorPlugin,
  cmdRiskAnalyzerPlugin,
  fileEnvSafetyPlugin,
  devJsonValidatorPlugin,
];

for (const p of plugins) {
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
  const samplePrompt = p.promptTemplates[0].generate({
    os: 'Windows',
    language: 'TypeScript',
    detail: 'テスト用の詳細情報',
  });
  assert(typeof samplePrompt === 'string' && samplePrompt.length > 20, `Prompt generation failed for ${p.metadata.id}`);
}
console.log('✓ All 5 representative plugins validated.\n');

// 2. Registry一括登録テスト
console.log('2. Testing Registry Bulk Registration...');
const registry = new PluginRegistry();
const registeredCount = registerInitialPlugins(registry);
assert(registeredCount === 5, `Expected 5 plugins registered, got ${registeredCount}`);
assert(registry.count() === 5, 'Registry count should be 5');

// カテゴリ別取得テスト
assert(registry.getByCategory('error').length === 1, 'Error category should have 1 plugin');
assert(registry.getByCategory('ai').length === 1, 'AI category should have 1 plugin');
assert(registry.getByCategory('git').length === 1, 'Git category should have 1 plugin');
assert(registry.getByCategory('file').length === 1, 'File category should have 1 plugin');
assert(registry.getByCategory('dev-support').length === 1, 'Dev Support category should have 1 plugin');
console.log('✓ Registry bulk registration and category filtering passed.\n');

// 3. 初心者語句による検索エンジン結合テスト
console.log('3. Testing Search Engine with Beginner Phrases...');
const searchEngine = new SearchEngine();
const allPlugins = registry.getAll();

// テストケース1: 「赤い文字」→ err-explainer がスコア最上位
const resultsRedText = searchEngine.search(allPlugins, { keyword: '赤い文字' });
assert(resultsRedText.length > 0, 'Search for "赤い文字" should return results');
assert(resultsRedText[0].plugin.metadata.id === 'err-explainer', 'Top result for "赤い文字" must be err-explainer');
console.log(`- "赤い文字" -> Hit: ${resultsRedText[0].plugin.metadata.name} (Score: ${resultsRedText[0].score})`);

// テストケース2: 「AIにどう頼めばいい」→ ai-prompt-creator がスコア最上位
const resultsAiPrompt = searchEngine.search(allPlugins, { keyword: 'AIにどう頼めばいい' });
assert(resultsAiPrompt.length > 0, 'Search for "AIにどう頼めばいい" should return results');
assert(resultsAiPrompt[0].plugin.metadata.id === 'ai-prompt-creator', 'Top result for "AIにどう頼めばいい" must be ai-prompt-creator');
console.log(`- "AIにどう頼めばいい" -> Hit: ${resultsAiPrompt[0].plugin.metadata.name} (Score: ${resultsAiPrompt[0].score})`);

// テストケース3: 「危険コマンド」→ cmd-risk-analyzer がスコア最上位
const resultsRisk = searchEngine.search(allPlugins, { keyword: '危険コマンド' });
assert(resultsRisk.length > 0, 'Search for "危険コマンド" should return results');
assert(resultsRisk[0].plugin.metadata.id === 'cmd-risk-analyzer', 'Top result for "危険コマンド" must be cmd-risk-analyzer');
console.log(`- "危険コマンド" -> Hit: ${resultsRisk[0].plugin.metadata.name} (Score: ${resultsRisk[0].score})`);

// テストケース4: 「APIキーの隠し方」→ file-env-safety がスコア最上位
const resultsEnv = searchEngine.search(allPlugins, { keyword: 'APIキーの隠し方' });
assert(resultsEnv.length > 0, 'Search for "APIキーの隠し方" should return results');
assert(resultsEnv[0].plugin.metadata.id === 'file-env-safety', 'Top result for "APIキーの隠し方" must be file-env-safety');
console.log(`- "APIキーの隠し方" -> Hit: ${resultsEnv[0].plugin.metadata.name} (Score: ${resultsEnv[0].score})`);

// テストケース5: 「カンマの位置」→ dev-json-validator がスコア最上位
const resultsJson = searchEngine.search(allPlugins, { keyword: 'カンマの位置' });
assert(resultsJson.length > 0, 'Search for "カンマの位置" should return results');
assert(resultsJson[0].plugin.metadata.id === 'dev-json-validator', 'Top result for "カンマの位置" must be dev-json-validator');
console.log(`- "カンマの位置" -> Hit: ${resultsJson[0].plugin.metadata.name} (Score: ${resultsJson[0].score})`);

// テストケース6: カテゴリ絞り込み検索
const errorFiltered = searchEngine.search(allPlugins, { keyword: 'エラー', category: 'error' });
assert(errorFiltered.every((r) => r.plugin.metadata.category === 'error'), 'Filtered search must only include error plugins');

console.log('✓ All search test cases passed.\n');
console.log('=== All Plugin & Integration Tests Passed Successfully ===');
