#!/bin/bash

set -e  # 任一錯誤就停止

echo "ref:"
echo "mac:  /Users/jkpan/dev/github/voles"
echo "arm:  /root/app/VOLUMES"
echo "imac: /jkpan/app/VOLUMES"

# ===== 參數設定 =====
REMOTE_USER="tpcaog"
REMOTE_HOST="tpcaog.org.tw"
REMOTE_DIR="/home/tpcaog/app/VOLUMES"
REMOTE_TARGET="tpcaog"
REMOTE_TAR="tpcaog.tar"

LOCAL_DIR=$1
LOCAL_ORI="tpcaog"
LOCAL_FILE="tpcaog.tar"


# setFromMac() {

#     # ===== 參數設定 =====
#     # REMOTE_USER="root"
#     # REMOTE_HOST="192.168.0.91"
#     # REMOTE_DIR="/root/app/VOLUMES"
#     # REMOTE_TARGET="tpcaog"
#     # REMOTE_TAR="tpcaog.tar"

#     LOCAL_DIR="/Users/jkpan/dev/github/voles"
#     LOCAL_ORI="tpcaog"
#     LOCAL_FILE="tpcaog.tar"

# }

# setFromArm() {
#     # ===== 參數設定 =====
#     REMOTE_USER="tpcaog"
#     REMOTE_HOST="tpcaog.org.tw"
#     REMOTE_DIR="/home/tpcaog/app/VOLUMES"
#     REMOTE_TARGET="tpcaog"
#     REMOTE_TAR="tpcaog.tar"

#     LOCAL_DIR="/root/app/VOLUMES"
#     LOCAL_ORI="tpcaog"
#     LOCAL_FILE="tpcaog.tar"
# }

# if [ "$1" = "prod" ]; then
#   setFromArm2Prod
# elif [ "$1" = "mac" ]; then
#   setFromMac2Arm
# else
#   exit 1
# fi


# ===== 建立本地資料夾 =====
# mkdir -p "$LOCAL_DIR"

echo "== Step 1: 遠端打包 =="

cd ${LOCAL_DIR}

# ssh ${REMOTE_USER}@${REMOTE_HOST} "
#   tar -czf ${REMOTE_TAR} -C $(dirname ${REMOTE_DIR}) $(basename ${REMOTE_DIR})
# "

ssh ${REMOTE_USER}@${REMOTE_HOST} "
   cd ${REMOTE_DIR}
   tar cvf ${REMOTE_TAR} ${REMOTE_TARGET}
"

echo "== Step 2: 下載檔案 (SCP) =="

scp ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${REMOTE_TAR} ${LOCAL_DIR}/${LOCAL_FILE}

echo "== Step 3: 刪除遠端檔案 =="

ssh ${REMOTE_USER}@${REMOTE_HOST} "
  rm -f ${REMOTE_DIR}/${REMOTE_TAR}
"

echo "== Step 4: 解壓縮 =="

rm -rf ${LOCAL_ORI}

tar xvf ${LOCAL_FILE}

# -C ${LOCAL_DIR}

echo "== Step 5: 刪除本地檔案 =="

rm ${LOCAL_FILE}

echo "== 完成 =="
