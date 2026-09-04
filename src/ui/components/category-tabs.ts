/**
 * カテゴリ切り替えタブコンポーネント
 */

import { CategoryType } from '../../types';

export type CategoryFilter = CategoryType | 'all' | 'favorites';

export interface CategoryTabsProps {
  onSelectCategory: (category: CategoryFilter) => void;
  counts?: Record<CategoryFilter, number>;
  activeCategory?: CategoryFilter;
}

export interface CategoryTabItem {
  id: CategoryFilter;
  label: string;
}

export const CATEGORY_DEFINITIONS: CategoryTabItem[] = [
  { id: 'all', label: 'すべて' },
  { id: 'favorites', label: '★ お気に入り' },
  { id: 'error', label: 'エラー解決' },
  { id: 'ai', label: 'AI連携・質問' },
  { id: 'git', label: 'Git・コマンド' },
  { id: 'file', label: 'ファイル・環境' },
  { id: 'dev-support', label: '開発補助' },
];

export function createCategoryTabs(props: CategoryTabsProps): {
  element: HTMLElement;
  setActive: (category: CategoryFilter) => void;
  updateCounts: (counts: Record<CategoryFilter, number>) => void;
} {
  const nav = document.createElement('nav');
  nav.className = 'category-tabs-container';
  nav.setAttribute('aria-label', 'カテゴリ絞り込み');

  let currentCategory: CategoryFilter = props.activeCategory || 'all';
  let counts: Record<CategoryFilter, number> = props.counts || {
    all: 0,
    favorites: 0,
    error: 0,
    ai: 0,
    git: 0,
    file: 0,
    'dev-support': 0,
  };

  const render = () => {
    nav.innerHTML = CATEGORY_DEFINITIONS.map((cat) => {
      const isActive = cat.id === currentCategory;
      const count = counts[cat.id] ?? 0;
      return `
        <button
          type="button"
          class="category-tab ${isActive ? 'active' : ''}"
          data-category="${cat.id}"
        >
          <span>${cat.label}</span>
          <span class="tab-count">${count}</span>
        </button>
      `;
    }).join('');

    nav.querySelectorAll<HTMLButtonElement>('.category-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category') as CategoryFilter;
        if (cat && cat !== currentCategory) {
          currentCategory = cat;
          render();
          props.onSelectCategory(cat);
        }
      });
    });
  };

  render();

  return {
    element: nav,
    setActive: (cat: CategoryFilter) => {
      currentCategory = cat;
      render();
    },
    updateCounts: (newCounts: Record<CategoryFilter, number>) => {
      counts = newCounts;
      render();
    },
  };
}
