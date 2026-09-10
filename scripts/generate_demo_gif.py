import os
import time
import shutil
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from PIL import Image
from playwright.sync_api import sync_playwright

PORT = 8899
DIST_DIR = os.path.abspath("dist")
FRAMES_DIR = os.path.abspath("temp_frames")

class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, *args):
        pass

def run_server(httpd):
    httpd.serve_forever()

def capture_frames():
    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR, exist_ok=True)

    httpd = HTTPServer(("127.0.0.1", PORT), QuietHandler)
    server_thread = threading.Thread(target=run_server, args=(httpd,), daemon=True)
    server_thread.start()

    frame_count = 0
    frame_files = []

    def snap(page, count=1, delay=0.08):
        nonlocal frame_count
        for _ in range(count):
            frame_count += 1
            filename = os.path.join(FRAMES_DIR, f"frame_{frame_count:04d}.png")
            page.screenshot(path=filename)
            frame_files.append(filename)
            if delay > 0:
                time.sleep(delay)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            channel="msedge",
            headless=True,
            args=[
                "--force-color-profile=srgb",
                "--font-render-hinting=medium",
                "--enable-font-antialiasing"
            ]
        )
        context = browser.new_context(
            viewport={"width": 960, "height": 540},
            device_scale_factor=1
        )
        page = context.new_page()
        page.goto(f"http://127.0.0.1:{PORT}")
        page.wait_for_selector("#hero-search-input")
        page.wait_for_timeout(400)

        # 1. 初期トップ画面 (約1.0秒)
        snap(page, count=10, delay=0.1)

        # 2. 検索バーにタイピング (約1.2秒)
        input_el = page.locator("#hero-search-input")
        input_el.click()
        snap(page, count=2, delay=0.08)

        query = "赤い文字が出た"
        for i in range(len(query)):
            input_el.fill(query[:i+1])
            snap(page, count=2, delay=0.07)

        page.wait_for_timeout(300)
        snap(page, count=8, delay=0.1)

        # 3. カードホバー & クリック
        card = page.locator(".result-card").first
        card.hover()
        snap(page, count=4, delay=0.1)

        card.click()
        page.wait_for_selector(".solution-container")
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(300)
        snap(page, count=6, delay=0.1)

        # 4. お気に入りトグル
        fav_btn = page.locator("#solution-fav-toggle")
        if fav_btn.count() > 0:
            fav_btn.hover()
            snap(page, count=2, delay=0.08)
            fav_btn.click()
            snap(page, count=6, delay=0.1)

        # 5. プロンプトコピーへスクロール & コピー
        copy_btn = page.locator("#prompt-copy-btn")
        if copy_btn.count() > 0:
            copy_btn.scroll_into_view_if_needed()
            snap(page, count=4, delay=0.1)
            copy_btn.hover()
            snap(page, count=2, delay=0.08)
            copy_btn.click()
            # トースト表示を見せる
            snap(page, count=10, delay=0.1)

        # 6. 一覧に戻る
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(200)
        back_btn = page.locator("#solution-back-btn")
        if back_btn.count() > 0:
            back_btn.hover()
            snap(page, count=2, delay=0.08)
            back_btn.click()
            page.wait_for_selector(".hero-search-section")
            page.wait_for_timeout(300)
            
            # 入力をクリアしてループを自然に
            clear_btn = page.locator("#hero-search-clear")
            if clear_btn.is_visible():
                clear_btn.click()
                page.wait_for_timeout(200)

            snap(page, count=10, delay=0.1)

        browser.close()

    httpd.shutdown()
    print(f"Captured {len(frame_files)} frames.")
    return frame_files

def create_optimized_gif(frame_files, output_path, fps=12):
    print(f"Creating GIF: {output_path}...")
    duration = int(1000 / fps)

    images = [Image.open(f).convert("RGB") for f in frame_files]
    if not images:
        return

    # Quantize
    quantized = [im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG) for im in images]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    quantized[0].save(
        output_path,
        save_all=True,
        append_images=quantized[1:],
        duration=duration,
        loop=0,
        optimize=True
    )

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"GIF generation complete! File size: {size_mb:.2f} MB")

    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)

if __name__ == "__main__":
    frames = capture_frames()
    out = os.path.abspath("articles/ai_dev_navigator_demo.gif")
    create_optimized_gif(frames, out, fps=12)
