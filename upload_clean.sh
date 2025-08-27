#!/bin/bash
# 用法: ./cleanup.sh 7   → 刪除 7 天前的目錄

# N 天前
DAYS_AGO=${1:-31}   # 預設 7 天

echo "處理 $2"
cd $2

# 算出日期 (格式 YYYYMMDD)
TARGET_DATE=$(date --date="$DAYS_AGO days ago" +"%Y%m%d")

echo "刪除 $TARGET_DATE 以前的資料夾..."

for dir in [0-9]*; do
  #echo "all : $dir"
  # 只處理名稱是 8 位數的目錄 (YYYYMMDD)
  if [[ -d "$dir" && "$dir" =~ ^[0-9]{8}$ ]]; then
    echo "dir : $dir"
    if [[ "$dir" -lt "$TARGET_DATE" ]]; then
      echo "刪除 $dir"
      rm -rf "$dir"
    fi
  fi
done
