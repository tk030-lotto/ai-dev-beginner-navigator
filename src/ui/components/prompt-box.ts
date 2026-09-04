/**
 * AIプロンプト生成ボックスコンポーネント
 * 仕様書第10章（秘匿情報サニタイズ）および第13.3章（AI質問生成）準拠
 */

import { PromptTemplate } from '../../types';
import { sanitizeInput } from '../../core/sanitizer';
import { showToast } from '../utils/toast';

export interface PromptBoxProps {
  templates: PromptTemplate[];
  onPromptGenerated?: (promptText: string) => void;
}

export function createPromptBox(props: PromptBoxProps): HTMLElement {
  const { templates } = props;
  const container = document.createElement('div');
  container.className = 'prompt-generator-card';

  // テンプレート選択肢の生成
  const templateOptionsHtml = templates.map((t, index) => {
    return `<option value="${index}">[${t.targetAi}] ${t.title}</option>`;
  }).join('');

  container.innerHTML = `
    <div class="prompt-inputs-grid">
      <div class="form-group">
        <label class="form-label" for="prompt-template-select">プロンプト用途</label>
        <select class="form-select" id="prompt-template-select">
          ${templateOptionsHtml || '<option value="0">標準プロンプト</option>'}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="prompt-os-select">実行環境 (OS)</label>
        <select class="form-select" id="prompt-os-select">
          <option value="Windows 11">Windows</option>
          <option value="macOS">macOS</option>
          <option value="Linux / Ubuntu">Linux / Ubuntu</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="prompt-lang-select">使用言語 / フレームワーク</label>
        <select class="form-select" id="prompt-lang-select">
          <option value="TypeScript / Node.js">TypeScript / Node.js</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Go">Go</option>
          <option value="Rust">Rust</option>
          <option value="Git / シェル">Git / シェル</option>
          <option value="指定なし">指定なし</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="prompt-input-summary">困っていること・行いたいこと</label>
        <input
          type="text"
          class="form-input"
          id="prompt-input-summary"
          placeholder="例: コマンドを実行したらエラーが出た"
        />
      </div>
    </div>

    <div class="form-group" style="margin-bottom: 0.85rem;">
      <label class="form-label" for="prompt-detail-input">エラーログ・コード詳細（任意）</label>
      <textarea
        class="form-textarea"
        id="prompt-detail-input"
        placeholder="画面に表示されたエラーメッセージや、試したことを貼り付けてください"
      ></textarea>
    </div>

    <div class="redact-alert" id="prompt-redact-alert">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <span>APIキー・パスワード等の秘匿情報を検知し、自動で <code>[REDACTED]</code> に保護・置換しました。</span>
    </div>

    <div class="generated-prompt-wrapper">
      <textarea
        class="prompt-textarea-preview"
        id="prompt-preview-area"
        readonly
        title="生成されたプロンプト"
      ></textarea>
    </div>

    <div class="prompt-actions-bar">
      <button class="btn btn-primary" id="prompt-copy-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>プロンプトをコピー</span>
      </button>

      <div class="ai-links-group">
        <span style="font-size: var(--text-xs); color: var(--text-muted); margin-right: 0.2rem;">AIを開く:</span>
        <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" class="ai-link-btn">ChatGPT</a>
        <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" class="ai-link-btn">Gemini</a>
        <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" class="ai-link-btn">Claude</a>
      </div>
    </div>
  `;

  const templateSelect = container.querySelector<HTMLSelectElement>('#prompt-template-select')!;
  const osSelect = container.querySelector<HTMLSelectElement>('#prompt-os-select')!;
  const langSelect = container.querySelector<HTMLSelectElement>('#prompt-lang-select')!;
  const summaryInput = container.querySelector<HTMLInputElement>('#prompt-input-summary')!;
  const detailInput = container.querySelector<HTMLTextAreaElement>('#prompt-detail-input')!;
  const previewArea = container.querySelector<HTMLTextAreaElement>('#prompt-preview-area')!;
  const copyBtn = container.querySelector<HTMLButtonElement>('#prompt-copy-btn')!;
  const redactAlert = container.querySelector<HTMLElement>('#prompt-redact-alert')!;

  // プロンプト生成実行
  const updatePrompt = () => {
    const rawDetail = detailInput.value.trim();
    const sanitizeResult = sanitizeInput(rawDetail);

    // 秘匿情報マスク警告
    if (sanitizeResult.hasSecrets) {
      redactAlert.classList.add('visible');
    } else {
      redactAlert.classList.remove('visible');
    }

    const templateIndex = parseInt(templateSelect.value, 10) || 0;
    const currentTemplate = templates[templateIndex];

    const context = {
      os: osSelect.value,
      language: langSelect.value,
      userInput: summaryInput.value.trim() || undefined,
      detail: sanitizeResult.sanitizedText || undefined,
    };

    if (currentTemplate && typeof currentTemplate.generate === 'function') {
      previewArea.value = currentTemplate.generate(context);
    } else {
      // フォールバック生成
      previewArea.value = [
        '# 開発相談',
        `環境: ${context.os} / ${context.language}`,
        context.userInput ? `状況: ${context.userInput}` : '',
        context.detail ? `詳細ログ:\n\`\`\`\n${context.detail}\n\`\`\`` : '',
      ].filter(Boolean).join('\n');
    }
  };

  templateSelect.addEventListener('change', updatePrompt);
  osSelect.addEventListener('change', updatePrompt);
  langSelect.addEventListener('change', updatePrompt);
  summaryInput.addEventListener('input', updatePrompt);
  detailInput.addEventListener('input', updatePrompt);

  // 初期生成
  updatePrompt();

  // コピー処理
  copyBtn.addEventListener('click', async () => {
    const textToCopy = previewArea.value;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('プロンプトをクリップボードにコピーしました');
      props.onPromptGenerated?.(textToCopy);
    } catch {
      previewArea.select();
      document.execCommand('copy');
      showToast('プロンプトをコピーしました');
      props.onPromptGenerated?.(textToCopy);
    }
  });

  return container;
}
