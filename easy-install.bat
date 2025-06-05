@echo off
chcp 65001 >nul
title 採用管理システム - インストーラー

echo ========================================
echo   採用管理システム
echo   簡単インストーラー
echo ========================================
echo.

:: 管理者権限の確認
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ 管理者権限が必要です。
    echo 右クリックして「管理者として実行」を選択してください。
    pause
    exit /b 1
)

:: Docker Desktopの確認
echo 📋 必要なソフトウェアを確認中...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Docker Desktopがインストールされていません。
    echo.
    echo Docker Desktopをインストールしますか？
    echo これには数分かかる場合があります。
    echo.
    choice /C YN /M "インストールしますか？ (Y=はい / N=いいえ)"
    if errorlevel 2 goto :NO_DOCKER
    if errorlevel 1 goto :INSTALL_DOCKER
)

:START_SYSTEM
echo.
echo ✅ Docker Desktopが検出されました。
echo.
echo 📦 システムを起動しています...
cd /d %~dp0
docker-compose down >nul 2>&1
docker-compose up -d

echo.
echo ⏳ システムの起動を待っています（約20秒）...
timeout /t 20 /nobreak >nul

echo.
echo 🌐 ブラウザでシステムを開いています...
start http://localhost:5000/dashboard.html

echo.
echo ========================================
echo ✅ インストール完了！
echo ========================================
echo.
echo システムURL: http://localhost:5000/dashboard.html
echo.
echo このウィンドウは閉じても大丈夫です。
echo システムはバックグラウンドで動作しています。
echo.
echo 【システムを停止する場合】
echo stop-system.bat を実行してください。
echo.
pause
exit /b 0

:INSTALL_DOCKER
echo.
echo 📥 Docker Desktopをダウンロード中...
curl -L -o "%TEMP%\docker-desktop-installer.exe" "https://desktop.docker.com/win/main/amd64/Docker%%20Desktop%%20Installer.exe"
echo.
echo 📦 Docker Desktopをインストール中...
"%TEMP%\docker-desktop-installer.exe" install --quiet --accept-license
echo.
echo ✅ Docker Desktopのインストールが完了しました。
echo.
echo ⚠ コンピュータを再起動する必要があります。
echo 再起動後、このインストーラーを再度実行してください。
echo.
choice /C YN /M "今すぐ再起動しますか？ (Y=はい / N=あとで)"
if errorlevel 2 goto :END
if errorlevel 1 shutdown /r /t 10
goto :END

:NO_DOCKER
echo.
echo ❌ インストールを中止しました。
echo Docker Desktopは以下からダウンロードできます：
echo https://www.docker.com/products/docker-desktop
echo.
pause
exit /b 1

:END
pause
exit /b 0