/**
 * 解決ビューコンポーネント
 * 仕様書第13.3章準拠の「5段構成」表示
 */

import { ProblemPlugin } from '../../types';
import { FavoritesStore } from '../../core/favorites';
import { createPromptBox } from './prompt-box';
import { showToast } from '../utils/toast';

export interface SolutionViewProps {
  plugin: ProblemPlugin;
  relatedPlugins: ProblemPlugin[];
  favoritesStore?: FavoritesStore;
  onBack: () => void;
  onSelectPlugin: (pluginId: string) => void;
  onPromptGenerated?: (promptText: string) => void;
}

export function createSolutionView(props: SolutionViewProps): HTMLElement {
  const { plugin, relatedPlugins, favoritesStore, onBack, onSelectPlugin, onPromptGenerated } = props;
  const { metadata, knowledge, promptTemplates } = plugin;

  const container = document.createElement('div');
  container.className = 'solution-container';

  // ヘッダーナビゲーション
  const navDiv = document.createElement('div');
  navDiv.className = 'solution-nav';
  navDiv.innerHTML = `
    <button class="btn btn-ghost btn-sm" id="solution-back-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      <span>検索一覧に戻る</span>
    </button>
  `;
  navDiv.querySelector('#solution-back-btn')?.addEventListener('click', onBack);
  container.appendChild(navDiv);

  // タイトルヘッダー
  const isFav = favoritesStore ? favoritesStore.has(metadata.id) : false;
  const headerDiv = document.createElement('div');
  headerDiv.className = 'solution-header';
  headerDiv.innerHTML = `
    <div class="solution-meta-row">
      <span class="card-category-badge badge-${metadata.category}">
        ${metadata.category.toUpperCase()}
      </span>
      <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
        ${metadata.id}
      </span>
      ${favoritesStore ? `
        <button type="button" class="btn btn-sm btn-ghost solution-fav-btn ${isFav ? 'fav-active' : ''}" id="solution-fav-btn" style="margin-left: auto; display: inline-flex; align-items: center; gap: 0.35rem;">
          <span class="fav-icon" style="color: #f59e0b; font-size: 1rem;">${isFav ? '★' : '☆'}</span>
          <span class="fav-text" style="font-size: var(--text-xs); font-weight: 500;">${isFav ? 'お気に入り登録中' : 'お気に入りに追加'}</span>
        </button>
      ` : ''}
    </div>
    <h1 class="solution-title">${metadata.name}</h1>
    <p class="solution-desc">${metadata.description}</p>
  `;

  if (favoritesStore) {
    const favBtn = headerDiv.querySelector<HTMLButtonElement>('#solution-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const nextState = favoritesStore.toggle(metadata.id);
        const iconSpan = favBtn.querySelector('.fav-icon');
        const textSpan = favBtn.querySelector('.fav-text');
        if (iconSpan) iconSpan.textContent = nextState ? '★' : '☆';
        if (textSpan) textSpan.textContent = nextState ? 'お気に入り登録中' : 'お気に入りに追加';
        if (nextState) {
          favBtn.classList.add('fav-active');
          showToast('★ お気に入りに追加しました');
        } else {
          favBtn.classList.remove('fav-active');
          showToast('お気に入りを解除しました');
        }
      });
    }
  }

  container.appendChild(headerDiv);

  // 1段目: まず知っておくこと
  const section1 = document.createElement('section');
  section1.className = 'solution-section';
  section1.innerHTML = `
    <div class="section-label">
      <span class="section-num">1</span>
      <span>まず知っておくこと</span>
    </div>
    <p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-primary);">
      ${knowledge.summary}
    </p>
  `;
  container.appendChild(section1);

  // 2段目: 解決手順 (Steps)
  const section2 = document.createElement('section');
  section2.className = 'solution-section';
  section2.innerHTML = `
    <div class="section-label">
      <span class="section-num">2</span>
      <span>具体的な解決手順</span>
    </div>
    <div class="step-list" id="solution-step-list"></div>
  `;
  const stepList = section2.querySelector('#solution-step-list')!;
  knowledge.steps.forEach((step, idx) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'step-item';

    let commandHtml = '';
    if (step.command) {
      commandHtml = `
        <div class="command-box">
          <code class="command-text">${step.command}</code>
          <button class="command-copy-btn" data-command="${encodeURIComponent(step.command)}" title="コマンドをコピー">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>コピー</span>
          </button>
        </div>
      `;
    }

    stepEl.innerHTML = `
      <div class="step-indicator">${step.step || idx + 1}</div>
      <div class="step-body">
        <h2 class="step-title">${step.title}</h2>
        <p class="step-desc">${step.detail}</p>
        ${commandHtml}
      </div>
    `;

    // コマンドコピーボタンのバインド
    const copyBtn = stepEl.querySelector<HTMLButtonElement>('.command-copy-btn');
    if (copyBtn && step.command) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(step.command!);
          showToast('コマンドをコピーしました');
        } catch {
          showToast('コピーできませんでした');
        }
      });
    }

    stepList.appendChild(stepEl);
  });
  container.appendChild(section2);

  // 3段目: 注意・やってはいけないこと (Cautions)
  if (knowledge.cautions && knowledge.cautions.length > 0) {
    const section3 = document.createElement('section');
    section3.className = 'solution-section';
    section3.innerHTML = `
      <div class="section-label" style="color: var(--accent-rose);">
        <span class="section-num" style="color: var(--accent-rose);">3</span>
        <span>注意・やってはいけないこと</span>
      </div>
      <div>
        ${knowledge.cautions.map(caution => `
          <div class="caution-box">
            <p class="caution-text">${caution}</p>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(section3);
  }

  // 4段目: AIに相談する (PromptBox)
  const section4 = document.createElement('section');
  section4.className = 'solution-section';
  section4.innerHTML = `
    <div class="section-label">
      <span class="section-num">4</span>
      <span>AIに相談する（質問プロンプト自動生成）</span>
    </div>
  `;
  const promptBoxEl = createPromptBox({
    templates: promptTemplates || [],
    onPromptGenerated,
  });
  section4.appendChild(promptBoxEl);
  container.appendChild(section4);

  // 5段目: 関連する困りごと
  if (relatedPlugins.length > 0) {
    const section5 = document.createElement('section');
    section5.className = 'solution-section';
    section5.innerHTML = `
      <div class="section-label">
        <span class="section-num">5</span>
        <span>関連する困りごと</span>
      </div>
      <div class="results-grid" style="grid-template-columns: 1fr; gap: 0.5rem;" id="related-plugin-list"></div>
    `;
    const listEl = section5.querySelector('#related-plugin-list')!;
    relatedPlugins.forEach(rp => {
      const btn = document.createElement('button');
      btn.className = 'result-card';
      btn.style.padding = '0.75rem';
      btn.innerHTML = `
        <div class="card-top">
          <span class="card-category-badge badge-${rp.metadata.category}">${rp.metadata.category}</span>
        </div>
        <div class="card-title" style="font-size: var(--text-sm);">${rp.metadata.name}</div>
        <p class="card-description" style="font-size: var(--text-xs); margin-bottom: 0;">${rp.metadata.description}</p>
      `;
      btn.addEventListener('click', () => onSelectPlugin(rp.metadata.id));
      listEl.appendChild(btn);
    });
    container.appendChild(section5);
  }

  return container;
}
