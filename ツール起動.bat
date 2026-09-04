@echo off
chcp 932 >nul
cd /d "%~dp0"
title AI開発初心者お助けナビ

echo ===================================================
echo   AI開発初心者お助けナビ を起動しています...
echo ===================================================
echo.

if not exist "node_modules\" (
    echo 初回起動のため、依存パッケージをインストールしています...
    call npm install
    if %errorlevel% neq 0 (
        echo [エラー] npm install に失敗しました。
        pause
        exit /b %errorlevel%
    )
    echo インストールが完了しました。
    echo.
)

echo ブラウザで http://localhost:3000 を開きます...
start http://localhost:3000

echo 開発サーバーを起動中... (終了する場合はこのウィンドウを閉じるか Ctrl+C を押してください)
echo.
call npm run dev

pause