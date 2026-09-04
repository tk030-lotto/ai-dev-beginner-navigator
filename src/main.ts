/**
 * AI開発初心者お助けナビ (AI Dev Beginner Navigator)
 * アプリケーション エントリーポイント
 */

import './ui/styles/variables.css';
import './ui/styles/base.css';
import './ui/styles/components.css';

import {
  PluginRegistry,
  SearchEngine,
  LocalStorageHistoryStore,
  FavoritesStore,
} from './core';
import { registerAllPlugins } from './plugins';
import {
  createHeader,
  createSearchBar,
  createCategoryTabs,
  createResultCard,
  createSolutionView,
  createHistoryModal,
  HashRouter,
  CategoryFilter,
} from './ui';
import { SearchResult, ProblemPlugin, CategoryType } from './types';

// Coreシングルトンインスタンス
export const registry = new PluginRegistry();
export const searchEngine = new SearchEngine();
export const historyStore = new LocalStorageHistoryStore();
export const favoritesStore = new FavoritesStore();
export const router = new HashRouter();

// 全30プラグインの登録
registerAllPlugins(registry);

// アプリケーション状態
let currentQuery = '';
let currentCategory: CategoryFilter = 'all';

// DOMルート要素のセットアップ
const app = document.getElementById('app');
if (!app) {
  throw new Error('Root #app element not found');
}
app.innerHTML = '';
app.className = 'app-container';

// 履歴モーダルの生成
const historyModal = createHistoryModal({
  historyStore,
  onNavigateToPlugin: (pluginId) => {
    router.navigate(`/plugin/${pluginId}`);
  },
  onSearchAgain: (q) => {
    currentQuery = q;
    router.navigate('/');
    searchBarInstance?.setQuery(q);
    executeSearch();
  },
});
document.body.appendChild(historyModal.element);

// ヘッダーの生成・追加
const header = createHeader({
  onOpenHistory: () => historyModal.open(),
  onNavigateHome: () => {
    currentQuery = '';
    searchBarInstance?.clear();
    router.navigate('/');
  },
});
app.appendChild(header);

// メインコンテンツコンテナ
const mainContainer = document.createElement('main');
mainContainer.className = 'main-content';
app.appendChild(mainContainer);

// 検索バーインスタンス参照
let searchBarInstance: ReturnType<typeof createSearchBar> | null = null;
let categoryTabsInstance: ReturnType<typeof createCategoryTabs> | null = null;

/**
 * カテゴリ別プラグイン件数の集計
 */
function getCategoryCounts(): Record<CategoryFilter, number> {
  const allPlugins = registry.getAll();
  const favIds = new Set(favoritesStore.getAll());
  const counts: Record<CategoryFilter, number> = {
    all: allPlugins.length,
    favorites: 0,
    error: 0,
    ai: 0,
    git: 0,
    file: 0,
    'dev-support': 0,
  };

  for (const p of allPlugins) {
    if (favIds.has(p.metadata.id)) {
      counts.favorites++;
    }
    const cat = p.metadata.category;
    if (cat in counts) {
      counts[cat]++;
    }
  }
  return counts;
}

/**
 * 検索またはカテゴリ絞り込みを実行して結果を描画
 */
function executeSearch(resultsGridEl?: HTMLElement, headerInfoEl?: HTMLElement): void {
  const grid = resultsGridEl || document.getElementById('results-grid-container');
  const countEl = headerInfoEl || document.getElementById('results-count-label');
  if (!grid) return;

  const plugins = registry.getAll();
  let results: SearchResult[] = [];

  if (currentQuery.trim()) {
    results = searchEngine.search(plugins, {
      keyword: currentQuery,
      category: currentCategory === 'favorites' ? undefined : currentCategory,
    });
    if (currentCategory === 'favorites') {
      const favIds = new Set(favoritesStore.getAll());
      results = results.filter((r) => favIds.has(r.plugin.metadata.id));
    }
    // 検索履歴の記録
    historyStore.addLog({
      type: 'search',
      payload: { query: currentQuery },
    });
  } else {
    // クエリが空の場合は全件またはカテゴリ別一覧をスコア1扱いで表示
    let filtered: ProblemPlugin[];
    if (currentCategory === 'all') {
      filtered = plugins;
    } else if (currentCategory === 'favorites') {
      const favIds = new Set(favoritesStore.getAll());
      filtered = plugins.filter((p) => favIds.has(p.metadata.id));
    } else {
      filtered = registry.getByCategory(currentCategory as CategoryType);
    }

    results = filtered.map((p) => ({
      plugin: p,
      score: 1,
      matchDetails: [],
      matchedBeginnerPhrases: [],
    }));
  }

  if (countEl) {
    countEl.textContent = `${results.length} 件の解決策`;
  }

  grid.innerHTML = '';
  if (results.length === 0) {
    const isFavEmpty = currentCategory === 'favorites' && !currentQuery.trim();
    grid.innerHTML = `
      <div class="empty-results" style="grid-column: 1 / -1;">
        <div class="empty-icon">${isFavEmpty ? '★' : '🔍'}</div>
        <h3 class="empty-title">${isFavEmpty ? 'お気に入りがまだ登録されていません' : '該当する解決策が見つかりませんでした'}</h3>
        <p class="empty-desc">
          ${isFavEmpty ? '解決ビューの右上にある「お気に入りに追加」を押すと、ここに保存されます。' : '検索キーワードを変えるか、上部の「検索のヒント」から初心者フレーズを試してみてください。'}
        </p>
      </div>
    `;
    return;
  }

  results.forEach((res) => {
    const card = createResultCard({
      result: res,
      onSelect: (id) => {
        router.navigate(`/plugin/${id}`);
      },
    });
    grid.appendChild(card);
  });
}

/**
 * トップ一覧 & 検索画面の描画
 */
function renderHomeView(): void {
  mainContainer.innerHTML = '';

  // ヒーロー検索セクション
  searchBarInstance = createSearchBar({
    initialQuery: currentQuery,
    onSearch: (q) => {
      currentQuery = q;
      executeSearch();
    },
  });
  mainContainer.appendChild(searchBarInstance.element);

  // カテゴリタブ
  categoryTabsInstance = createCategoryTabs({
    activeCategory: currentCategory,
    counts: getCategoryCounts(),
    onSelectCategory: (cat) => {
      currentCategory = cat;
      executeSearch();
    },
  });
  mainContainer.appendChild(categoryTabsInstance.element);

  // 検索結果セクションヘッダー
  const resultsHeader = document.createElement('div');
  resultsHeader.className = 'results-header';
  resultsHeader.innerHTML = `
    <span id="results-count-label">読み込み中...</span>
    <span style="font-family: var(--font-mono);">SCORE-BASED RANKING</span>
  `;
  mainContainer.appendChild(resultsHeader);

  // 検索結果グリッド
  const resultsGrid = document.createElement('div');
  resultsGrid.className = 'results-grid';
  resultsGrid.id = 'results-grid-container';
  mainContainer.appendChild(resultsGrid);

  // 初回検索描画
  executeSearch(resultsGrid, resultsHeader.querySelector('#results-count-label') as HTMLElement);
}

/**
 * 詳細解決ビュー画面の描画
 */
function renderDetailView(pluginId: string): void {
  mainContainer.innerHTML = '';

  const plugin = registry.getById(pluginId);
  if (!plugin) {
    const notFound = document.createElement('div');
    notFound.className = 'empty-results';

    const title = document.createElement('h2');
    title.className = 'empty-title';
    title.textContent = 'プラグインが見つかりません';

    const desc = document.createElement('p');
    desc.className = 'empty-desc';
    desc.textContent = `指定されたID「${pluginId}」のプラグインは存在しないか、未登録です。`;

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = '1rem';
    backBtn.id = 'notfound-back-btn';
    backBtn.textContent = '一覧に戻る';
    backBtn.addEventListener('click', () => router.navigate('/'));

    notFound.appendChild(title);
    notFound.appendChild(desc);
    notFound.appendChild(backBtn);
    mainContainer.appendChild(notFound);
    return;
  }

  // 閲覧履歴を記録
  historyStore.addLog({
    type: 'view_plugin',
    payload: {
      pluginId: plugin.metadata.id,
      pluginName: plugin.metadata.name,
    },
  });

  // 関連プラグインの取得（現時点では同一カテゴリの他プラグインをサジェスト）
  const relatedPlugins: ProblemPlugin[] = registry
    .getByCategory(plugin.metadata.category)
    .filter((p) => p.metadata.id !== plugin.metadata.id)
    .slice(0, 3);

  const view = createSolutionView({
    plugin,
    relatedPlugins,
    favoritesStore,
    onBack: () => {
      router.navigate('/');
    },
    onSelectPlugin: (id) => {
      router.navigate(`/plugin/${id}`);
    },
    onPromptGenerated: (promptText) => {
      historyStore.addLog({
        type: 'generate_prompt',
        payload: {
          pluginId: plugin.metadata.id,
          generatedPrompt: promptText.slice(0, 80),
        },
      });
    },
  });

  mainContainer.appendChild(view);
}

// ルーター変更イベントのリスナー
router.onRouteChange((route) => {
  // 次画面に移行する前にシーク・タイマー・リスナーを解放
  searchBarInstance?.destroy();
  searchBarInstance = null;

  window.scrollTo({ top: 0, behavior: 'instant' });
  if (route.path === '/plugin' && route.pluginId) {
    renderDetailView(route.pluginId);
  } else {
    renderHomeView();
  }
});

// ルーター起動
router.init();
