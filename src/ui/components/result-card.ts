/**
 * 検索結果カードコンポーネント
 */

import { SearchResult, CategoryType } from '../../types';

export interface ResultCardProps {
  result: SearchResult;
  onSelect: (pluginId: string) => void;
}

const CATEGORY_LABEL_MAP: Record<CategoryType, string> = {
  error: 'エラー解決',
  ai: 'AI連携',
  git: 'Git・コマンド',
  file: 'ファイル・環境',
  'dev-support': '開発補助',
};

export function createResultCard(props: ResultCardProps): HTMLElement {
  const { plugin, score, matchDetails, matchedBeginnerPhrases } = props.result;
  const { metadata } = plugin;

  const card = document.createElement('article');
  card.className = 'result-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${metadata.name} の解決策を表示`);

  const categoryLabel = CATEGORY_LABEL_MAP[metadata.category] || metadata.category;
  const badgeClass = `badge-${metadata.category}`;

  // マッチ理由のサマリーテキスト
  let matchSummary = '';
  if (matchedBeginnerPhrases && matchedBeginnerPhrases.length > 0) {
    matchSummary = '日常語一致';
  } else if (matchDetails.some((m) => m.field === 'keywords')) {
    matchSummary = 'キーワード一致';
  } else if (score > 1) {
    matchSummary = '関連ヒット';
  }

  // 初心者フレーズリスト（マッチしているものはハイライト）
  const phrasesHtml = metadata.beginnerPhrases
    .slice(0, 4)
    .map((phrase) => {
      const isMatched = matchedBeginnerPhrases?.includes(phrase);
      return `<span class="phrase-tag ${isMatched ? 'matched' : ''}"># ${phrase}</span>`;
    })
    .join('');

  card.innerHTML = `
    <div class="card-top">
      <span class="card-category-badge ${badgeClass}">${categoryLabel}</span>
      ${matchSummary ? `<span class="card-match-reason">${matchSummary}</span>` : ''}
    </div>
    <h2 class="card-title">${metadata.name}</h2>
    <p class="card-description">${metadata.description}</p>
    <div class="card-phrases-container">
      ${phrasesHtml}
    </div>
  `;

  const handleClick = () => {
    props.onSelect(metadata.id);
  };

  card.addEventListener('click', handleClick);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  });

  return card;
}
