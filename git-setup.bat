@echo off
echo Git セットアップを開始します...

:: Gitの初期化
git init

:: mainブランチに変更
git branch -m main

:: すべてのファイルを追加
git add .

:: 初回コミット
git commit -m "Initial commit: 採用管理システム"

echo.
echo ✅ Gitリポジトリの初期化が完了しました！
echo.
echo 次のステップ:
echo 1. GitHubでリポジトリを作成
echo 2. 以下のコマンドを実行:
echo    git remote add origin https://github.com/YOUR_USERNAME/recruitment-system.git
echo    git push -u origin main
echo.
pause