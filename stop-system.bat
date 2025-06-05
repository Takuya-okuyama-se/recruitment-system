@echo off
chcp 65001 >nul
title 採用管理システム - 停止

echo ========================================
echo   採用管理システム
echo   システム停止
echo ========================================
echo.

echo 🛑 システムを停止しています...
cd /d %~dp0
docker-compose down

echo.
echo ✅ システムを停止しました。
echo.
echo 再度起動する場合は easy-install.bat を実行してください。
echo.
pause