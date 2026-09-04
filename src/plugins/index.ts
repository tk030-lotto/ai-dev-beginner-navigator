/**
 * プラグイン集約エントリポイント
 * 各カテゴリのプラグインをエクスポートし、Registryへの一括登録ユーティリティを提供する
 */

import { ProblemPlugin } from '../types';
import { PluginRegistry } from '../core';

import { errExplainerPlugin } from './error/err-explainer';
import { aiPromptCreatorPlugin } from './ai/ai-prompt-creator';
import { cmdRiskAnalyzerPlugin } from './git/cmd-risk-analyzer';
import { fileEnvSafetyPlugin } from './file/file-env-safety';
import { devJsonValidatorPlugin } from './dev/dev-json-validator';

// 代表5プラグインのエクスポート
export {
  errExplainerPlugin,
  aiPromptCreatorPlugin,
  cmdRiskAnalyzerPlugin,
  fileEnvSafetyPlugin,
  devJsonValidatorPlugin,
};

/**
 * 初期ロード対象プラグイン（Phase 3 代表5プラグイン）
 */
export const initialPlugins: ProblemPlugin[] = [
  errExplainerPlugin,
  aiPromptCreatorPlugin,
  cmdRiskAnalyzerPlugin,
  fileEnvSafetyPlugin,
  devJsonValidatorPlugin,
];

/**
 * 初期プラグイン群をPluginRegistryへ一括登録する
 * @param registry 登録先のPluginRegistryインスタンス
 * @returns 登録されたプラグインの件数
 */
export function registerInitialPlugins(registry: PluginRegistry): number {
  for (const plugin of initialPlugins) {
    registry.register(plugin);
  }
  return initialPlugins.length;
}
