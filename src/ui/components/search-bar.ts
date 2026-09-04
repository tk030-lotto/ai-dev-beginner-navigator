/**
 * ヒーロー検索バーコンポーネント
 */

export interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export interface SearchBarInstance {
  element: HTMLElement;
  setQuery: (query: string) => void;
  clear: () => void;
  destroy: () => void;
}

const PLACEHOLDER_CANDIDATES = [
  '「赤い文字が出た」「エラーの意味がわからない」',
  '「GitHubに載せたい」「プッシュって何？」',
  '「AIにどう聞けばいい？」「プロンプトの書き方」',
  '「.envって何？」「APIキーを隠したい」',
  '「コードを上書きして大丈夫？」「危ないコマンド」',
  '「さっきまで動いてたのに」「原因の切り分け」',
];

const SUGGEST_QUERIES = [
  '赤い文字が出た',
  'GitHubに載せたい',
  'AIへの聞き方',
  '.env保護',
  '危険コマンド',
  'コミットって何？',
  'JSONエラー',
];

export function createSearchBar(props: SearchBarProps): SearchBarInstance {
  const container = document.createElement('section');
  container.className = 'hero-search-section';

  container.innerHTML = `
    <div class="hero-tagline">Beginner Developer Navigator</div>
    <h1 class="hero-heading">日常の言葉から解決手順を逆引き</h1>
    <p class="hero-description">
      専門用語がわからなくても大丈夫。「困った状態」や「やりたいこと」をそのまま入力してください。
    </p>

    <div class="search-box-wrapper">
      <div class="search-input-container">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          class="search-input"
          id="hero-search-input"
          placeholder="${PLACEHOLDER_CANDIDATES[0]}"
          autocomplete="off"
          spellcheck="false"
        />
        <button class="search-clear-btn" id="hero-search-clear" style="display: none;" title="入力をクリア">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="quick-suggest-list">
        <span class="suggest-label">検索のヒント:</span>
        ${SUGGEST_QUERIES.map(
          (q) => `<button type="button" class="suggest-chip" data-query="${q}">${q}</button>`
        ).join('')}
      </div>
    </div>
  `;

  const input = container.querySelector<HTMLInputElement>('#hero-search-input')!;
  const clearBtn = container.querySelector<HTMLButtonElement>('#hero-search-clear')!;
  input.value = props.initialQuery || '';

  // プレースホルダーの自動切り替え
  let placeholderIndex = 0;
  const placeholderTimer = window.setInterval(() => {
    if (document.activeElement !== input && !input.value) {
      placeholderIndex = (placeholderIndex + 1) % PLACEHOLDER_CANDIDATES.length;
      input.placeholder = PLACEHOLDER_CANDIDATES[placeholderIndex];
    }
  }, 4000);

  const updateClearBtnVisibility = () => {
    clearBtn.style.display = input.value.trim() ? 'flex' : 'none';
  };
  updateClearBtnVisibility();

  // 入力デバウンス (120ms)
  let debounceTimer: number | undefined;
  const handleInput = () => {
    updateClearBtnVisibility();
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      props.onSearch(input.value.trim());
    }, 120);
  };

  input.addEventListener('input', handleInput);

  clearBtn.addEventListener('click', () => {
    input.value = '';
    updateClearBtnVisibility();
    input.focus();
    props.onSearch('');
  });

  // クイックサジェストのクリック
  const suggestButtons = container.querySelectorAll<HTMLButtonElement>('.suggest-chip');
  suggestButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query') || '';
      input.value = q;
      updateClearBtnVisibility();
      input.focus();
      props.onSearch(q);
    });
  });

  return {
    element: container,
    setQuery: (query: string) => {
      input.value = query;
      updateClearBtnVisibility();
    },
    clear: () => {
      input.value = '';
      updateClearBtnVisibility();
    },
    destroy: () => {
      window.clearInterval(placeholderTimer);
      window.clearTimeout(debounceTimer);
    },
  };
}
