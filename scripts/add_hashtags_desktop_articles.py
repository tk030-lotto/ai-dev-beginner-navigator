import os

TARGET_DIR = r"C:\Users\tk030\Desktop\AI開発初心者ナビ記事"

HASHTAGS_MAP = {
    "1.txt": "#AIプログラミング #プログラミング初心者 #Web開発 #TypeScript #個人開発",
    "2.txt": "#UXデザイン #検索機能 #プログラミング初心者 #個人開発 #JavaScript",
    "3.txt": "#セキュリティ #APIキー #AIプログラミング #情報セキュリティ #プログラミング初心者",
    "4.txt": "#コードレビュー #Webセキュリティ #XSS #AIプログラミング #フロントエンド",
    "5.txt": "#Windows #バッチファイル #ローカル開発 #業務効率化 #便利ツール",
    "6.txt": "#AI開発 #ペアプログラミング #個人開発 #AIエージェント #開発プロセス",
    "【ツール公開】AI開発初心者お助けナビを公開しました.txt": "#個人開発 #AIプログラミング #プログラミング初心者 #便利ツール #Webアプリ"
}

def add_hashtags(filename, tags):
    filepath = os.path.join(TARGET_DIR, filename)
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filepath}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 既にハッシュタグが存在するかチェック
    if tags in content:
        print(f"[SKIP] Hashtags already exist: {filename}")
        return

    # 末尾をトリムし、空行を挟んでハッシュタグを追加
    updated_content = content.rstrip() + "\n\n" + tags + "\n"

    with open(filepath, "w", encoding="utf-8", newline="\n") as f:
        f.write(updated_content)

    print(f"[SUCCESS] Added hashtags to {filename}")

def main():
    print(f"Target directory: {TARGET_DIR}")
    for filename, tags in HASHTAGS_MAP.items():
        add_hashtags(filename, tags)

if __name__ == "__main__":
    main()
