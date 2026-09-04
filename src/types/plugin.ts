/**
 * プラグイン基本型定義
 * 仕様書 第5章（Pluginインターフェース）に完全準拠
 */

/**
 * プラグインの5大カテゴリ
 */
export type CategoryType =
  | 'error'
  | 'ai'
  | 'git'
  | 'file'
  | 'dev-support';

/**
 * 解決手順の各ステップ
 */
export interface ProblemStep {
  step: number;
  title: string;
  detail: string;
  command?: string;
}

/**
 * AI相談用プロンプトテンプレート
 */
export interface PromptTemplateContext {
  os?: string;
  language?: string;
  userInput?: string;
  detail?: string;
}

export interface PromptTemplate {
  targetAi: 'ChatGPT' | 'Gemini' | 'Claude' | 'All';
  title: string;
  generate: (context: PromptTemplateContext) => string;
}

/**
 * プラグインメタデータ
 */
export interface PluginMetadata {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  keywords: string[];
  beginnerPhrases: string[];
}

/**
 * 問題解決プラグイン定義
 */
export interface ProblemPlugin {
  metadata: PluginMetadata;

  knowledge: {
    summary: string;
    steps: ProblemStep[];
    cautions: string[];
  };

  promptTemplates: PromptTemplate[];

  renderCustomTool?: () => HTMLElement | unknown;
}
