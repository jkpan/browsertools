#!/bin/bash

echo "$# containers"

for arg in "$@"; do
    echo "container: $arg"
    sudo docker stop $arg
    sudo docker rm $arg
done

sudo docker rmi app
sudo docker build -t app .
sudo docker compose up -d

echo "end."
