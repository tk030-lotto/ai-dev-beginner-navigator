/**
 * ヘッダーコンポーネント
 */

export interface HeaderProps {
  onOpenHistory: () => void;
  onNavigateHome: () => void;
}

export function createHeader(props: HeaderProps): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';

  header.innerHTML = `
    <div class="header-inner">
      <div class="brand-group" id="header-brand">
        <div class="brand-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="brand-title">
          <span>AI開発初心者お助けナビ</span>
          <span class="brand-badge">v1.0</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-sm" id="header-history-btn" title="利用履歴を表示">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>履歴</span>
        </button>
      </div>
    </div>
  `;

  const brand = header.querySelector('#header-brand');
  if (brand) {
    brand.addEventListener('click', () => {
      props.onNavigateHome();
    });
  }

  const historyBtn = header.querySelector('#header-history-btn');
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      props.onOpenHistory();
    });
  }

  return header;
}
