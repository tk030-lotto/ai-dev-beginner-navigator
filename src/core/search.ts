/**
 * 検索エンジン
 * 仕様書 第6章（検索エンジン）および 第7章（シノニム展開）に準拠
 */

import type { ProblemPlugin, SearchQuery, SearchResult, FieldMatchDetail } from '../types';
import { expandSynonyms } from './synonyms';

/**
 * 仕様書第6.2章で定義されたスコア重み係数
 */
export const SEARCH_WEIGHTS = {
  beginnerPhrases: 3,
  name: 2,
  keywords: 2,
  description: 1,
  summary: 1,
} as const;

export class SearchEngine {
  /**
   * プラグインリストからクエリに合致するものを重み付きスコア順で検索
   * @param plugins 検索対象プラグイン一覧
   * @param query 検索クエリ（キーワード、カテゴリ）
   * @returns スコア降順にソートされた検索結果一覧
   */
  public search(plugins: ProblemPlugin[], query: SearchQuery): SearchResult[] {
    const rawKeyword = query.keyword ? query.keyword.trim() : '';
    const targetCategory = query.category && query.category !== 'all' ? query.category : null;

    // カテゴリフィルタ
    let candidates = plugins;
    if (targetCategory) {
      candidates = candidates.filter((p) => p.metadata.category === targetCategory);
    }

    // キーワードが空の場合は、カテゴリ内全件（または全件）をスコア1で返す
    if (!rawKeyword) {
      return candidates.map((plugin) => ({
        plugin,
        score: 1,
        matchDetails: [],
        matchedBeginnerPhrases: [],
      }));
    }

    // シノニム展開を含めた検索語リスト
    const searchTerms = expandSynonyms(rawKeyword);

    const results: SearchResult[] = [];

    for (const plugin of candidates) {
      const matchDetails: FieldMatchDetail[] = [];
      const matchedBeginnerPhrases: string[] = [];
      let totalScore = 0;

      // 1. beginnerPhrases (重み 3)
      const matchedPhrases: string[] = [];
      for (const phrase of plugin.metadata.beginnerPhrases) {
        const lowerPhrase = phrase.toLowerCase();
        const isMatched = searchTerms.some(
          (term) => lowerPhrase.includes(term) || term.includes(lowerPhrase)
        );
        if (isMatched) {
          matchedPhrases.push(phrase);
          matchedBeginnerPhrases.push(phrase);
        }
      }
      if (matchedPhrases.length > 0) {
        const points = matchedPhrases.length * SEARCH_WEIGHTS.beginnerPhrases;
        totalScore += points;
        matchDetails.push({
          field: 'beginnerPhrases',
          weight: SEARCH_WEIGHTS.beginnerPhrases,
          matchedTerms: matchedPhrases,
        });
      }

      // 2. name (重み 2)
      const lowerName = plugin.metadata.name.toLowerCase();
      const matchedNameTerms = searchTerms.filter((term) => lowerName.includes(term));
      if (matchedNameTerms.length > 0) {
        const points = SEARCH_WEIGHTS.name;
        totalScore += points;
        matchDetails.push({
          field: 'name',
          weight: SEARCH_WEIGHTS.name,
          matchedTerms: matchedNameTerms,
        });
      }

      // 3. keywords (重み 2)
      const matchedKeywords: string[] = [];
      for (const kw of plugin.metadata.keywords) {
        const lowerKw = kw.toLowerCase();
        if (searchTerms.some((term) => lowerKw.includes(term) || term.includes(lowerKw))) {
          matchedKeywords.push(kw);
        }
      }
      if (matchedKeywords.length > 0) {
        const points = matchedKeywords.length * SEARCH_WEIGHTS.keywords;
        totalScore += points;
        matchDetails.push({
          field: 'keywords',
          weight: SEARCH_WEIGHTS.keywords,
          matchedTerms: matchedKeywords,
        });
      }

      // 4. description (重み 1)
      const lowerDesc = plugin.metadata.description.toLowerCase();
      const matchedDescTerms = searchTerms.filter((term) => lowerDesc.includes(term));
      if (matchedDescTerms.length > 0) {
        const points = SEARCH_WEIGHTS.description;
        totalScore += points;
        matchDetails.push({
          field: 'description',
          weight: SEARCH_WEIGHTS.description,
          matchedTerms: matchedDescTerms,
        });
      }

      // 5. summary (重み 1)
      const lowerSummary = (plugin.knowledge.summary || '').toLowerCase();
      const matchedSummaryTerms = searchTerms.filter((term) => lowerSummary.includes(term));
      if (matchedSummaryTerms.length > 0) {
        const points = SEARCH_WEIGHTS.summary;
        totalScore += points;
        matchDetails.push({
          field: 'summary',
          weight: SEARCH_WEIGHTS.summary,
          matchedTerms: matchedSummaryTerms,
        });
      }

      // スコアが1以上あればヒットとみなす
      if (totalScore > 0) {
        results.push({
          plugin,
          score: totalScore,
          matchDetails,
          matchedBeginnerPhrases: Array.from(new Set(matchedBeginnerPhrases)),
        });
      }
    }

    // スコア降順ソート
    results.sort((a, b) => b.score - a.score);

    return results;
  }
}
