#!/bin/bash

echo "共收到 $# 個參數"

for arg in "$@"; do
    echo "處理參數：$arg"
    sudo docker stop $arg
    sudo docker rm $arg
done

sudo docker rmi app
sudo docker build -t app .
sudo docker compose up -d

echo "end"
