# 【安全設計】AIに渡すプロンプトからAPIキー・個人情報を自動マスキングするサニタイザーの仕組み

## はじめに

生成AIの活用において、企業でも個人開発でも最も恐れられているセキュリティ事故の一つが**「機密情報・クレデンシャルの誤送信」**です。

特に開発初心者の場合、以下のようなミスが頻発します。
- エラーログを丸ごとコピーしたら、中にデータベースのパスワードが含まれていた
- `.env` ファイルの内容をそのまま貼り付けて質問した
- コード内にハードコードされた OpenAI や GitHub の API トークンに気づかず送信した

「AI開発初心者ナビ」では、生成されるプロンプトに含まれる機密情報をブラウザ上で即座に検知し、安全なプレースホルダーに強制置換する**「サニタイザー（sanitizer.ts）」**を実装しました。

本記事では、その正規表現パターン設計と、UI側でのセーフティ機構について解説します。

---

## サニタイザーの基本要件

1. **外部送信を行わない完全ローカル処理**:
   マスキングのためにテキストを外部サーバーに送っては本末転倒です。すべてブラウザのJavaScriptエンジン内で完結させます。
2. **高精度なパターン検知**:
   APIキーだけでなく、一般的なパスワード代入文や秘密鍵形式、個人情報（メール、電話番号）もカバーします。
3. **可逆的なプレースホルダーへの置換**:
   単に削除するのではなく、`[OPENAI_API_KEY_MASKED]` のように「何が隠されたか」がAIにも伝わる形式に置き換えます。これにより、AIが「あ、ここには本来APIキーが入るんだな」と文脈を理解したまま回答を生成できます。

---

## 検出パターンの実装（sanitizer.ts）

主要な機密情報パターンを以下のように定義しています。

```typescript
export interface MaskPattern {
  name: string;
  regex: RegExp;
  placeholder: string;
}

export const SENSITIVE_PATTERNS: MaskPattern[] = [
  // OpenAI API Key (sk-...)
  {
    name: 'OpenAI API Key',
    regex: /sk-[a-zA-Z0-9]{32,}/g,
    placeholder: '[OPENAI_API_KEY_MASKED]',
  },
  // Anthropic API Key (sk-ant-...)
  {
    name: 'Anthropic API Key',
    regex: /sk-ant-[a-zA-Z0-9_-]{32,}/g,
    placeholder: '[ANTHROPIC_API_KEY_MASKED]',
  },
  // GitHub Personal Access Token (ghp_... / github_pat_...)
  {
    name: 'GitHub Token',
    regex: /(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9_]{50,}/g,
    placeholder: '[GITHUB_TOKEN_MASKED]',
  },
  // AWS Access Key ID (AKIA...)
  {
    name: 'AWS Access Key',
    regex: /(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}/g,
    placeholder: '[AWS_KEY_MASKED]',
  },
  // Bearer トークン
  {
    name: 'Bearer Token',
    regex: /bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi,
    placeholder: 'Bearer [BEARER_TOKEN_MASKED]',
  },
  // パスワード・シークレット代入パターン (password = "xxxx")
  {
    name: 'Password / Secret assignment',
    regex: /(?:password|passwd|secret|api_key|apikey|token)\s*[:=]\s*["']([^"']{4,})["']/gi,
    placeholder: '$1: "[SECRET_MASKED]"',
  },
  // 個人情報（メールアドレス・電話番号）
  {
    name: 'Email Address',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    placeholder: '[EMAIL_MASKED]',
  },
  {
    name: 'Phone Number',
    regex: /(?:\d{2,4}-\d{2,4}-\d{4}|\d{10,11})/g,
    placeholder: '[PHONE_MASKED]',
  },
];
```

### サニタイズ処理関数

```typescript
export interface SanitizeResult {
  maskedText: string;
  detectedCount: number;
  detectedTypes: string[];
}

export function sanitizePrompt(text: string): SanitizeResult {
  let maskedText = text;
  let detectedCount = 0;
  const detectedTypesSet = new Set<string>();

  for (const pattern of SENSITIVE_PATTERNS) {
    const matches = maskedText.match(pattern.regex);
    if (matches && matches.length > 0) {
      detectedCount += matches.length;
      detectedTypesSet.add(pattern.name);
      maskedText = maskedText.replace(pattern.regex, pattern.placeholder);
    }
  }

  return {
    maskedText,
    detectedCount,
    detectedTypes: Array.from(detectedTypesSet),
  };
}
```

---

## UIでの可視化とセーフティ機構（prompt-box.ts）

いくら裏側でマスキングを行っていても、ユーザーにそれが伝わらなければ「本当に安全なのか？」という不安が残ります。
また、ユーザー自身が「あっ、自分は危険な文字列を貼っていたんだ」と学習する機会も失われます。

そこで、UI（プロンプト生成ボックス）上で以下のような演出とガードを実装しました。

### 1. 警告バナーの即時表示
検知数が1件以上ある場合、プロンプト欄の上部に目立つ警告メッセージを出力します。

> ⚠️ **注意: 機密情報が検知されたため、安全にマスキングされました。**  
> 検知項目: `OpenAI API Key`, `Password / Secret assignment` (合計2箇所)

### 2. 「コピー」操作時の二重防御
ユーザーが「プロンプトをコピー」ボタンを押した際、クリップボードに書き込まれるのは**常にマスキング処理が完了した後の文字列**です。

### 3. 要約プレビュー欄でのマスキング漏れを防ぐ
コードレビュー時に発覚した落とし穴として、**「メインのプロンプト本文はサニタイズしていたが、画面上部に表示していた一行要約（Summary）が未サニタイズのまま表示されていた」**というケースがありました。

```typescript
// 修正前:
// this.summaryEl.textContent = rawSummary; // 危険！APIキーが生で表示される

// 修正後:
const sanitizedSummary = sanitizePrompt(rawSummary).maskedText;
this.summaryEl.textContent = sanitizedSummary; // 安全！
```
このように、ユーザーの入力が表示・コピーされる全導線で漏れなくサニタイザーを通すことが不可欠です。

---

## まとめ

初心者に「セキュリティに気をつけよう」「APIキーを貼り付けてはいけない」と口頭やテキストで啓発するだけでは、事故は防げません。

**「人間は間違える前提で、システム側で無害化する」**

このセーフティ・バイ・デザイン（Safety by Design）の姿勢こそが、初心者向けツールにおいて最も重要です。

次回は、開発終盤のコードレビューで発覚した**「AIが生成したコードに潜むDOM XSS脆弱性3選と修正の記録」**をお届けします。
