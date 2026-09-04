/**
 * プラグイン集約エントリポイント
 * 全30プラグインをエクスポートし、Registryへの一括登録ユーティリティを提供する
 */

import { ProblemPlugin } from '../types';
import { PluginRegistry } from '../core';

// Error カテゴリ (5件)
import { errExplainerPlugin } from './error/err-explainer';
import { errCauseFinderPlugin } from './error/err-cause-finder';
import { errLogCleanerPlugin } from './error/err-log-cleaner';
import { errAiConsultantPlugin } from './error/err-ai-consultant';
import { errFixCheckerPlugin } from './error/err-fix-checker';

// AI カテゴリ (10件)
import { aiPromptCreatorPlugin } from './ai/ai-prompt-creator';
import { aiInstructionCheckPlugin } from './ai/ai-instruction-check';
import { aiTaskDelegationPlugin } from './ai/ai-task-delegation';
import { aiResponseOrganizerPlugin } from './ai/ai-response-organizer';
import { aiTodoExtractorPlugin } from './ai/ai-todo-extractor';
import { aiAnswerComparePlugin } from './ai/ai-answer-compare';
import { aiDiffAnalyzerPlugin } from './ai/ai-diff-analyzer';
import { aiInputSanitizerPlugin } from './ai/ai-input-sanitizer';
import { aiPreCheckPlugin } from './ai/ai-pre-check';
import { aiPostCheckPlugin } from './ai/ai-post-check';

// Git カテゴリ (6件)
import { cmdExplainerPlugin } from './git/cmd-explainer';
import { cmdRiskAnalyzerPlugin } from './git/cmd-risk-analyzer';
import { gitConceptPlugin } from './git/git-concept';
import { gitRiskCheckerPlugin } from './git/git-risk-checker';
import { gitTermsPlugin } from './git/git-terms';
import { gitTroubleHelperPlugin } from './git/git-trouble-helper';

// File カテゴリ (5件)
import { fileStructurePlugin } from './file/file-structure';
import { fileExtExplainerPlugin } from './file/file-ext-explainer';
import { fileConfigCheckerPlugin } from './file/file-config-checker';
import { fileEnvSafetyPlugin } from './file/file-env-safety';
import { fileCleanerPlugin } from './file/file-cleaner';

// Dev Support カテゴリ (4件)
import { devMdFormatterPlugin } from './dev/dev-md-formatter';
import { devMdTablePlugin } from './dev/dev-md-table';
import { devJsonValidatorPlugin } from './dev/dev-json-validator';
import { devAiVsHumanPlugin } from './dev/dev-ai-vs-human';

// 個別プラグインのエクスポート
export {
  // Error
  errExplainerPlugin,
  errCauseFinderPlugin,
  errLogCleanerPlugin,
  errAiConsultantPlugin,
  errFixCheckerPlugin,
  // AI
  aiPromptCreatorPlugin,
  aiInstructionCheckPlugin,
  aiTaskDelegationPlugin,
  aiResponseOrganizerPlugin,
  aiTodoExtractorPlugin,
  aiAnswerComparePlugin,
  aiDiffAnalyzerPlugin,
  aiInputSanitizerPlugin,
  aiPreCheckPlugin,
  aiPostCheckPlugin,
  // Git
  cmdExplainerPlugin,
  cmdRiskAnalyzerPlugin,
  gitConceptPlugin,
  gitRiskCheckerPlugin,
  gitTermsPlugin,
  gitTroubleHelperPlugin,
  // File
  fileStructurePlugin,
  fileExtExplainerPlugin,
  fileConfigCheckerPlugin,
  fileEnvSafetyPlugin,
  fileCleanerPlugin,
  // Dev Support
  devMdFormatterPlugin,
  devMdTablePlugin,
  devJsonValidatorPlugin,
  devAiVsHumanPlugin,
};

/**
 * 全30プラグイン配列（仕様書第8章定義準拠）
 */
export const allPlugins: ProblemPlugin[] = [
  // Error (5件)
  errExplainerPlugin,
  errCauseFinderPlugin,
  errLogCleanerPlugin,
  errAiConsultantPlugin,
  errFixCheckerPlugin,
  // AI (10件)
  aiPromptCreatorPlugin,
  aiInstructionCheckPlugin,
  aiTaskDelegationPlugin,
  aiResponseOrganizerPlugin,
  aiTodoExtractorPlugin,
  aiAnswerComparePlugin,
  aiDiffAnalyzerPlugin,
  aiInputSanitizerPlugin,
  aiPreCheckPlugin,
  aiPostCheckPlugin,
  // Git (6件)
  cmdExplainerPlugin,
  cmdRiskAnalyzerPlugin,
  gitConceptPlugin,
  gitRiskCheckerPlugin,
  gitTermsPlugin,
  gitTroubleHelperPlugin,
  // File (5件)
  fileStructurePlugin,
  fileExtExplainerPlugin,
  fileConfigCheckerPlugin,
  fileEnvSafetyPlugin,
  fileCleanerPlugin,
  // Dev Support (4件)
  devMdFormatterPlugin,
  devMdTablePlugin,
  devJsonValidatorPlugin,
  devAiVsHumanPlugin,
];

/**
 * 代表5プラグイン（後方互換用）
 */
export const initialPlugins: ProblemPlugin[] = [
  errExplainerPlugin,
  aiPromptCreatorPlugin,
  cmdRiskAnalyzerPlugin,
  fileEnvSafetyPlugin,
  devJsonValidatorPlugin,
];

/**
 * 全プラグイン群をPluginRegistryへ一括登録する
 * @param registry 登録先のPluginRegistryインスタンス
 * @returns 登録されたプラグインの件数
 */
export function registerAllPlugins(registry: PluginRegistry): number {
  for (const plugin of allPlugins) {
    registry.register(plugin);
  }
  return allPlugins.length;
}

/**
 * 初期代表プラグイン群をPluginRegistryへ一括登録する（後方互換用）
 */
export function registerInitialPlugins(registry: PluginRegistry): number {
  return registerAllPlugins(registry);
}
