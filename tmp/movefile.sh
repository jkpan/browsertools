#!/bin/bash

# 設定要移動的檔案和目標目錄
files_to_move=("/Users/jkpan/Downloads/bg00.png" 
               "/Users/jkpan/Downloads/bg01.png" 
               "/Users/jkpan/Downloads/bg02.png" 
               "/Users/jkpan/Downloads/bg03.png" 
               "/Users/jkpan/Downloads/bg04.png" 
               "/Users/jkpan/Downloads/bg05.png" 
               "/Users/jkpan/Downloads/bg06.png" 
               "/Users/jkpan/Downloads/bg07.png" 
               "/Users/jkpan/Downloads/bg08.png" 
               "/Users/jkpan/Downloads/bg09.png" 
               "/Users/jkpan/Downloads/bg10.png")

target_directory="/Users/jkpan/Documents/PlanetAsteroid/Resources"

# 確認目標目錄存在，如果不存在就建立它
if [ ! -d "$target_directory" ]; then
  #mkdir -p "$target_directory"
  echo "目標不存在"
  exit 1
fi

# 使用迴圈處理每個檔案
for file_to_move in "${files_to_move[@]}"; do

  # 確認檔案存在，如果不存在就顯示錯誤並繼續處理下一個檔案
  if [ ! -f "$file_to_move" ]; then
    echo "檔案 $file_to_move 不存在"
    continue
  fi

  # 強制移動檔案到目標目錄
  mv -f "$file_to_move" "$target_directory"

  # 確認移動成功
  if [ $? -eq 0 ]; then
    echo "檔案 $file_to_move 移動成功"
  else
    echo "檔案 $file_to_move 移動失敗"
  fi

done