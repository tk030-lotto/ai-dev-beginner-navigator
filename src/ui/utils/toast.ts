/**
 * トースト通知ユーティリティ
 */

let toastContainer: HTMLElement | null = null;

export function showToast(message: string, durationMs = 2500): void {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all 150ms ease';
    setTimeout(() => {
      toast.remove();
    }, 160);
  }, durationMs);
}
