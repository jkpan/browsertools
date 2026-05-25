#!/bin/bash

set -e  # 任一錯誤就停止


# ===== 參數設定 =====
REMOTE_USER="tpcaog"
REMOTE_HOST="tpcaog.org.tw"
REMOTE_DIR="/home/tpcaog/app/VOLUMES"
REMOTE_TARGET="tpcaog/songbase.json"

LOCAL_TARGET="./songbase.json"

echo "== Step 1: backup local data =="

mv songbase.json songbase.json.bak

echo "== Step 2: 下載檔案 (SCP) =="

scp ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${REMOTE_TARGET} ${LOCAL_TARGET}

echo "== 完成 =="