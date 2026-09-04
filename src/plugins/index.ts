/**
 * プラグイン集約エントリポイント
 * 全50プラグインをエクスポートし、Registryへの一括登録ユーティリティを提供する
 */

import { ProblemPlugin } from '../types';
import { PluginRegistry } from '../core';

// Error カテゴリ (7件)
import { errExplainerPlugin } from './error/err-explainer';
import { errCauseFinderPlugin } from './error/err-cause-finder';
import { errLogCleanerPlugin } from './error/err-log-cleaner';
import { errAiConsultantPlugin } from './error/err-ai-consultant';
import { errFixCheckerPlugin } from './error/err-fix-checker';
import { errReactRenderPlugin } from './error/err-react-render';
import { errPythonTracePlugin } from './error/err-python-trace';

// AI カテゴリ (13件)
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
import { aiCodeReviewRequestPlugin } from './ai/ai-code-review-request';
import { aiRefactorGuidePlugin } from './ai/ai-refactor-guide';
import { aiDebugPairPlugin } from './ai/ai-debug-pair';

// Git カテゴリ (9件)
import { cmdExplainerPlugin } from './git/cmd-explainer';
import { cmdRiskAnalyzerPlugin } from './git/cmd-risk-analyzer';
import { gitConceptPlugin } from './git/git-concept';
import { gitRiskCheckerPlugin } from './git/git-risk-checker';
import { gitTermsPlugin } from './git/git-terms';
import { gitTroubleHelperPlugin } from './git/git-trouble-helper';
import { gitPrTemplatePlugin } from './git/git-pr-template';
import { gitTagReleasePlugin } from './git/git-tag-release';
import { gitInitGuidePlugin } from './git/git-init-guide';

// File カテゴリ (9件)
import { fileStructurePlugin } from './file/file-structure';
import { fileExtExplainerPlugin } from './file/file-ext-explainer';
import { fileConfigCheckerPlugin } from './file/file-config-checker';
import { fileEnvSafetyPlugin } from './file/file-env-safety';
import { fileCleanerPlugin } from './file/file-cleaner';
import { fileDockerBasicsPlugin } from './file/file-docker-basics';
import { fileVscodeSettingsPlugin } from './file/file-vscode-settings';
import { fileGitignoreGuidePlugin } from './file/file-gitignore-guide';
import { fileTsconfigGuidePlugin } from './file/file-tsconfig-guide';

// Dev Support カテゴリ (12件)
import { devMdFormatterPlugin } from './dev/dev-md-formatter';
import { devMdTablePlugin } from './dev/dev-md-table';
import { devJsonValidatorPlugin } from './dev/dev-json-validator';
import { devAiVsHumanPlugin } from './dev/dev-ai-vs-human';
import { devReactHooksPlugin } from './dev/dev-react-hooks';
import { devPythonVenvPlugin } from './dev/dev-python-venv';
import { devNpmScriptsPlugin } from './dev/dev-npm-scripts';
import { devApiDesignPlugin } from './dev/dev-api-design';
import { devRegexBuilderPlugin } from './dev/dev-regex-builder';
import { devMarkdownDocsPlugin } from './dev/dev-markdown-docs';
import { devPerformanceCheckPlugin } from './dev/dev-performance-check';
import { devAccessibilityBasicsPlugin } from './dev/dev-accessibility-basics';

// 個別プラグインのエクスポート
export {
  // Error (7)
  errExplainerPlugin,
  errCauseFinderPlugin,
  errLogCleanerPlugin,
  errAiConsultantPlugin,
  errFixCheckerPlugin,
  errReactRenderPlugin,
  errPythonTracePlugin,
  // AI (13)
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
  aiCodeReviewRequestPlugin,
  aiRefactorGuidePlugin,
  aiDebugPairPlugin,
  // Git (9)
  cmdExplainerPlugin,
  cmdRiskAnalyzerPlugin,
  gitConceptPlugin,
  gitRiskCheckerPlugin,
  gitTermsPlugin,
  gitTroubleHelperPlugin,
  gitPrTemplatePlugin,
  gitTagReleasePlugin,
  gitInitGuidePlugin,
  // File (9)
  fileStructurePlugin,
  fileExtExplainerPlugin,
  fileConfigCheckerPlugin,
  fileEnvSafetyPlugin,
  fileCleanerPlugin,
  fileDockerBasicsPlugin,
  fileVscodeSettingsPlugin,
  fileGitignoreGuidePlugin,
  fileTsconfigGuidePlugin,
  // Dev Support (12)
  devMdFormatterPlugin,
  devMdTablePlugin,
  devJsonValidatorPlugin,
  devAiVsHumanPlugin,
  devReactHooksPlugin,
  devPythonVenvPlugin,
  devNpmScriptsPlugin,
  devApiDesignPlugin,
  devRegexBuilderPlugin,
  devMarkdownDocsPlugin,
  devPerformanceCheckPlugin,
  devAccessibilityBasicsPlugin,
};

/**
 * 全50プラグイン配列
 */
export const allPlugins: ProblemPlugin[] = [
  // Error (7)
  errExplainerPlugin,
  errCauseFinderPlugin,
  errLogCleanerPlugin,
  errAiConsultantPlugin,
  errFixCheckerPlugin,
  errReactRenderPlugin,
  errPythonTracePlugin,
  // AI (13)
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
  aiCodeReviewRequestPlugin,
  aiRefactorGuidePlugin,
  aiDebugPairPlugin,
  // Git (9)
  cmdExplainerPlugin,
  cmdRiskAnalyzerPlugin,
  gitConceptPlugin,
  gitRiskCheckerPlugin,
  gitTermsPlugin,
  gitTroubleHelperPlugin,
  gitPrTemplatePlugin,
  gitTagReleasePlugin,
  gitInitGuidePlugin,
  // File (9)
  fileStructurePlugin,
  fileExtExplainerPlugin,
  fileConfigCheckerPlugin,
  fileEnvSafetyPlugin,
  fileCleanerPlugin,
  fileDockerBasicsPlugin,
  fileVscodeSettingsPlugin,
  fileGitignoreGuidePlugin,
  fileTsconfigGuidePlugin,
  // Dev Support (12)
  devMdFormatterPlugin,
  devMdTablePlugin,
  devJsonValidatorPlugin,
  devAiVsHumanPlugin,
  devReactHooksPlugin,
  devPythonVenvPlugin,
  devNpmScriptsPlugin,
  devApiDesignPlugin,
  devRegexBuilderPlugin,
  devMarkdownDocsPlugin,
  devPerformanceCheckPlugin,
  devAccessibilityBasicsPlugin,
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
