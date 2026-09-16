import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

DIR = r"C:\Users\tk030\Desktop\AI開発初心者ナビ記事"
FILES = [
    "1.txt",
    "2.txt",
    "3.txt",
    "4.txt",
    "5.txt",
    "6.txt",
    "【ツール公開】AI開発初心者お助けナビを公開しました.txt"
]

def verify():
    for f in FILES:
        path = os.path.join(DIR, f)
        with open(path, "r", encoding="utf-8") as fp:
            lines = fp.readlines()
        print(f"=== {f} ===")
        print(f"H1: {lines[0].strip()}")
        print(f"Line 2: {lines[2].strip()}")
        print("Tail:")
        for line in lines[-4:]:
            print(f"  {line.strip()}")
        print()

if __name__ == "__main__":
    verify()
