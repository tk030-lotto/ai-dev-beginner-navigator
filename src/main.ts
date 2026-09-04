/**
 * AI開発初心者お助けナビ (AI Dev Beginner Navigator)
 * エントリポイント
 */

console.log('AI Dev Beginner Navigator initialized.');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <main style="font-family: 'Noto Sans JP', sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6;">
      <h1 style="color: #0284c7;">AI開発初心者お助けナビ</h1>
      <p style="color: #475569;">プロジェクト基盤の初期化が完了しました。Core基盤とUIを順次読み込みます。</p>
    </main>
  `;
}
