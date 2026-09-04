/**
 * 検索関連の型定義
 * 仕様書 第6章（検索エンジン）に準拠
 */

import type { CategoryType, ProblemPlugin } from './plugin';

/**
 * 検索クエリパラメータ
 */
export interface SearchQuery {
  keyword: string;
  category?: CategoryType | 'all';
}

/**
 * スコア計算で一致したフィールド種別
 */
export type SearchMatchField =
  | 'beginnerPhrases'
  | 'name'
  | 'keywords'
  | 'description'
  | 'summary';

/**
 * フィールドごとのマッチ詳細
 */
export interface FieldMatchDetail {
  field: SearchMatchField;
  weight: number;
  matchedTerms: string[];
}

/**
 * 検索結果アイテム
 */
export interface SearchResult {
  plugin: ProblemPlugin;
  score: number;
  matchDetails: FieldMatchDetail[];
  matchedBeginnerPhrases: string[];
}
