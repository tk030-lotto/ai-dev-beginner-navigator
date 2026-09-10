@echo off
chcp 932 >nul
cd /d "%~dp0"
title AI開発初心者ナビ

echo ===================================================
echo   AI開発初心者ナビ を起動しています...
echo ===================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [エラー] Node.js がインストールされていません。
    echo 本ツールの実行には Node.js が必要です。
    echo.
    echo 公式サイトを開きます。インストール後に再実行してください:
    echo   https://nodejs.org/ja/
    echo.
    start "" "https://nodejs.org/ja/"
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo 初回起動のため、依存パッケージをインストールしています...
    call npm install
    if errorlevel 1 (
        echo [エラー] npm install に失敗しました。
        pause
        exit /b 1
    )
    echo インストールが完了しました。
    echo.
)

echo ブラウザで http://localhost:3000 を開きます...
start "" "http://localhost:3000"

echo 開発サーバーを起動中... (終了する場合はこのウィンドウを閉じるか Ctrl+C を押してください)
echo.
call npm run dev

pause
