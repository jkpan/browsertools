#!/bin/bash

cd /home/tpcaog/app

DATE=$(date +"%Y%m%d")
FOLD="backup$DATE"
echo "create folder $FOLD"

mkdir -p backup
cd backup
mkdir -p "./$FOLD"

cp -R ../VOLUMES/* "./$FOLD"

#TODAY=$(date +"%Y%m%d")

for DIR in backup*/; do
    [ -d "$DIR" ] || continue

    NAME="${DIR%/}"

    echo $NAME

    if [[ "$NAME" == backup* && "$NAME" != "$FOLD" ]]; then
        rm -rf -- "$DIR"
        echo "Deleted: $NAME"
    fi
done

cd ..
