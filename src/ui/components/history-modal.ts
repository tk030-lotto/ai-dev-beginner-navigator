/**
 * 履歴モーダルコンポーネント
 * 仕様書第9章準拠（履歴閲覧・個別削除・全消去・JSONエクスポート/インポート）
 */

import { HistoryStorageInterface, ActivityLog } from '../../types';
import { showToast } from '../utils/toast';

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export interface HistoryModalProps {
  historyStore: HistoryStorageInterface;
  onNavigateToPlugin?: (pluginId: string) => void;
  onSearchAgain?: (query: string) => void;
}

export function createHistoryModal(props: HistoryModalProps): {
  element: HTMLElement;
  open: () => void;
  close: () => void;
} {
  const { historyStore } = props;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '利用履歴');

  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">利用履歴</h2>
        <button class="btn btn-ghost btn-sm" id="history-modal-close" title="閉じる">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body" id="history-modal-body">
        <!-- タイムラインがここにレンダリングされる -->
      </div>

      <div class="modal-footer">
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn btn-secondary btn-sm" id="history-export-btn" title="JSON形式でダウンロード">
            エクスポート
          </button>
          <label class="btn btn-secondary btn-sm" style="margin: 0; cursor: pointer;" title="JSONファイルから復元">
            インポート
            <input type="file" id="history-import-input" accept=".json" style="display: none;" />
          </label>
        </div>
        <button class="btn btn-danger btn-sm" id="history-clear-btn" title="全履歴を消去">
          全消去
        </button>
      </div>
    </div>
  `;

  const bodyEl = overlay.querySelector('#history-modal-body')!;
  const closeBtn = overlay.querySelector('#history-modal-close')!;
  const exportBtn = overlay.querySelector('#history-export-btn')!;
  const importInput = overlay.querySelector<HTMLInputElement>('#history-import-input')!;
  const clearBtn = overlay.querySelector('#history-clear-btn')!;

  const closeModal = () => {
    overlay.classList.remove('active');
  };

  const openModal = () => {
    renderHistoryList();
    overlay.classList.add('active');
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  const formatDate = (timestamp: number): string => {
    try {
      const d = new Date(timestamp);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return String(timestamp);
    }
  };

  const getActionLabel = (log: ActivityLog): { type: string; title: string } => {
    switch (log.type) {
      case 'search':
        return {
          type: '検索',
          title: `検索: 「${log.payload.query || ''}」`,
        };
      case 'view_plugin':
        return {
          type: '閲覧',
          title: `閲覧: ${log.payload.pluginName || log.payload.pluginId || ''}`,
        };
      case 'generate_prompt':
        return {
          type: 'プロンプト',
          title: `AI相談プロンプト生成 (${log.payload.pluginId || ''})`,
        };
      default:
        return { type: '操作', title: '操作ログ' };
    }
  };

  const renderHistoryList = () => {
    const logs = historyStore.getLogs();
    if (logs.length === 0) {
      bodyEl.innerHTML = `
        <div class="empty-results" style="padding: 2.5rem 1rem; border-style: none;">
          <p class="empty-title">履歴はありません</p>
          <p class="empty-desc">検索や解決策の閲覧を行うと、ここに履歴が保存されます。</p>
        </div>
      `;
      return;
    }

    const timeline = document.createElement('div');
    timeline.className = 'history-timeline';

    logs.forEach((log) => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const info = getActionLabel(log);
      const safeInfo = {
        type: escapeHtml(info.type),
        title: escapeHtml(info.title),
        timestamp: escapeHtml(formatDate(log.timestamp)),
        id: escapeHtml(log.id),
      };

      item.innerHTML = `
        <div class="history-item-left">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span class="history-type-badge">[${safeInfo.type}]</span>
            <span class="history-item-meta">${safeInfo.timestamp}</span>
          </div>
          <div class="history-item-title">${safeInfo.title}</div>
        </div>
        <button class="history-delete-btn" data-id="${log.id}" title="この履歴を削除">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      `;

      // 個別削除
      item.querySelector('.history-delete-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        historyStore.removeLog(log.id);
        renderHistoryList();
        showToast('履歴を削除しました');
      });

      // クリックによる再実行・再遷移
      item.addEventListener('click', () => {
        if (log.type === 'search' && log.payload.query) {
          closeModal();
          props.onSearchAgain?.(log.payload.query);
        } else if (log.payload.pluginId) {
          closeModal();
          props.onNavigateToPlugin?.(log.payload.pluginId);
        }
      });

      timeline.appendChild(item);
    });

    bodyEl.innerHTML = '';
    bodyEl.appendChild(timeline);
  };

  // 全消去
  clearBtn.addEventListener('click', () => {
    if (historyStore.getLogs().length === 0) return;
    if (window.confirm('すべての利用履歴を消去しますか？（元に戻せません）')) {
      historyStore.clearLogs();
      renderHistoryList();
      showToast('すべての履歴を消去しました');
    }
  });

  // JSONエクスポート
  exportBtn.addEventListener('click', () => {
    const jsonStr = historyStore.exportLogs();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-dev-navigator-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('履歴JSONをダウンロードしました');
  });

  // JSONインポート
  importInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = historyStore.importLogs(content);
        renderHistoryList();
        if (result.success) {
          showToast(`インポート完了: ${result.importedCount}件追加`);
        } else {
          showToast(`インポート失敗: ${result.error || '形式が正しくありません'}`);
        }
      }
      importInput.value = '';
    };
    reader.readAsText(file);
  });

  return {
    element: overlay,
    open: openModal,
    close: closeModal,
  };
}
