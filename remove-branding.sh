#!/bin/bash

echo "ブランド名を削除しています..."

# HTMLファイル
find . -name "*.html" -type f -exec sed -i \
    -e 's/採用管理システム採用管理システム/採用管理システム/g' \
    -e 's/採用管理システム採用/採用管理/g' \
    -e 's/採用管理システム/採用管理システム/g' \
    -e 's/Sunstar Recruitment/Recruitment System/g' \
    -e 's/Sunstar/Recruitment System/g' \
    -e 's/recruitment-recruitment/recruitment-system/g' \
    -e 's/recruitment_recruitment/recruitment_system/g' \
    -e 's/recruitment/recruitment/g' \
    -e 's/admin@recruitment\.com/admin@company\.com/g' \
    -e 's/admin@recruitment\.local/admin@company\.local/g' \
    {} \;

# JavaScriptファイル
find . -name "*.js" -type f -exec sed -i \
    -e 's/recruitment_recruitment/recruitment_system/g' \
    -e 's/採用管理システム/採用管理システム/g' \
    {} \;

# SQLファイル  
find . -name "*.sql" -type f -exec sed -i \
    -e 's/recruitment_recruitment/recruitment_system/g' \
    -e 's/採用管理システム/会社/g' \
    {} \;

# YAMLファイル
find . -name "*.yml" -o -name "*.yaml" -type f -exec sed -i \
    -e 's/recruitment-recruitment/recruitment-system/g' \
    -e 's/recruitment_recruitment/recruitment_system/g' \
    -e 's/recruitment_/recruitment_/g' \
    -e 's/recruitment/recruitment/g' \
    {} \;

# Markdownファイル
find . -name "*.md" -type f -exec sed -i \
    -e 's/採用管理システム採用管理システム/採用管理システム/g' \
    -e 's/採用管理システム/採用管理システム/g' \
    -e 's/Sunstar Recruitment/Recruitment System/g' \
    -e 's/recruitment-recruitment/recruitment-system/g' \
    -e 's/admin@recruitment\.com/admin@company\.com/g' \
    {} \;

# バッチファイル
find . -name "*.bat" -type f -exec sed -i \
    -e 's/採用管理システム採用管理システム/採用管理システム/g' \
    -e 's/採用管理システム/採用管理システム/g' \
    {} \;

# シェルスクリプト
find . -name "*.sh" -type f -exec sed -i \
    -e 's/recruitment_/recruitment_/g' \
    -e 's/recruitment/recruitment/g' \
    -e 's/採用管理システム/採用管理システム/g' \
    {} \;

echo "完了しました！"