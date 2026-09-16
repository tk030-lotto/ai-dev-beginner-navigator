import os

TARGET_DIR = r"C:\Users\tk030\Desktop\AI開発初心者ナビ記事"
FILES = [
    "1.txt",
    "2.txt",
    "3.txt",
    "4.txt",
    "5.txt",
    "6.txt",
    "【ツール公開】AI開発初心者お助けナビを公開しました.txt"
]

TOP_LINE = "🔗 **Webアプリ（GitHub Pages）**: https://tk030-lotto.github.io/ai-dev-beginner-navigator/"

BOTTOM_BLOCK = """---

### 関連リンク
- 🌐 **Webアプリ（GitHub Pages）**: https://tk030-lotto.github.io/ai-dev-beginner-navigator/
- 📦 **GitHub リポジトリ**: https://github.com/tk030-lotto/ai-dev-beginner-navigator"""

def update_file(filename):
    filepath = os.path.join(TARGET_DIR, filename)
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filepath}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 重複追加防止チェック
    if "https://tk030-lotto.github.io/ai-dev-beginner-navigator/" in content:
        print(f"[SKIP] Already updated: {filename}")
        return

    lines = content.splitlines()
    new_lines = []
    inserted_top = False

    for line in lines:
        new_lines.append(line)
        if not inserted_top and line.startswith("# "):
            new_lines.append("")
            new_lines.append(TOP_LINE)
            inserted_top = True

    updated_body = "\n".join(new_lines).rstrip()
    updated_content = updated_body + "\n\n" + BOTTOM_BLOCK + "\n"

    with open(filepath, "w", encoding="utf-8", newline="\n") as f:
        f.write(updated_content)

    print(f"[SUCCESS] Updated {filename}")

def main():
    print(f"Target directory: {TARGET_DIR}")
    for filename in FILES:
        update_file(filename)

if __name__ == "__main__":
    main()
