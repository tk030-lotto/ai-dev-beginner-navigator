/**
 * 秘匿情報サニタイザー
 * 仕様書 第10章（セキュリティ・プライバシー）に準拠
 * APIキー、トークン、秘密鍵等のパターンを検出し [REDACTED] へマスクする
 */

export interface SecretPattern {
  name: string;
  regex: RegExp;
}

/**
 * 検出対象の秘匿情報パターン群
 */
export const SECRET_PATTERNS: SecretPattern[] = [
  // 1. OpenAI / Anthropic 等のAPIキー
  {
    name: 'AI API Key',
    regex: /\b(sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,})\b/g,
  },
  // 2. GitHub Personal Access Token
  {
    name: 'GitHub Token',
    regex: /\b(ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{30,}|gho_[a-zA-Z0-9]{20,}|ghs_[a-zA-Z0-9]{20,})\b/g,
  },
  // 3. AWS Access Key ID & Secret Key
  {
    name: 'AWS Key',
    regex: /\b(AKIA[0-9A-Z]{16}|aws_secret_access_key\s*=\s*[a-zA-Z0-9/+=]{40})\b/g,
  },
  // 4. RSA / EC / SSH 秘密鍵ブロック
  {
    name: 'Private Key Block',
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  },
  // 5. 一般的なBearerトークン・JWT
  {
    name: 'Bearer Token / JWT',
    regex: /\bBearer\s+[a-zA-Z0-9\-._~+/]+=*/gi,
  },
  // 6. 設定ファイル内のパスワード / シークレット値 (password=xxx, secret:xxx, password xxx 等)
  {
    name: 'Password / Secret Value',
    regex: /(["']?(?:password|secret|api[_-]?key|access[_-]?token)["']?\s*[:=,]\s*["']?)([^"'\s,;]{4,})(["']?)/gi,
  },
];

export interface SanitizeResult {
  /** サニタイズ済みテキスト */
  sanitizedText: string;
  /** 秘匿情報が検出・置換されたかどうか */
  hasSecrets: boolean;
  /** 置換された箇所数 */
  redactedCount: number;
  /** 検出された秘匿情報の種類名 */
  detectedTypes: string[];
}

/**
 * 入力文字列に含まれるAPIキーやシークレットを検出し [REDACTED] に置換する
 * @param input サニタイズ対象文字列
 */
export function sanitizeInput(input: string): SanitizeResult {
  if (!input) {
    return {
      sanitizedText: '',
      hasSecrets: false,
      redactedCount: 0,
      detectedTypes: [],
    };
  }

  let sanitized = input;
  let redactedCount = 0;
  const detectedTypesSet = new Set<string>();

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.name === 'Password / Secret Value') {
      // キャプチャグループを利用して値の部分のみ [REDACTED] に置換
      const matches = sanitized.match(pattern.regex);
      if (matches && matches.length > 0) {
        redactedCount += matches.length;
        detectedTypesSet.add(pattern.name);
        sanitized = sanitized.replace(pattern.regex, '$1[REDACTED]$3');
      }
    } else {
      const matches = sanitized.match(pattern.regex);
      if (matches && matches.length > 0) {
        redactedCount += matches.length;
        detectedTypesSet.add(pattern.name);
        sanitized = sanitized.replace(pattern.regex, '[REDACTED]');
      }
    }
  }

  return {
    sanitizedText: sanitized,
    hasSecrets: redactedCount > 0,
    redactedCount,
    detectedTypes: Array.from(detectedTypesSet),
  };
}

/**
 * 入力文字列に秘匿情報が含まれているか高速判定する
 */
export function detectSecrets(input: string): boolean {
  if (!input) return false;
  return SECRET_PATTERNS.some((pattern) => {
    pattern.regex.lastIndex = 0;
    return pattern.regex.test(input);
  });
}
