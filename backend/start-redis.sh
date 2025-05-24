#!/usr/bin/env bash

REDIS_CONTAINER_NAME="redis"
REDIS_PORT=6379

if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "Docker daemon is not running. Please start Docker and try again."
  exit 1
fi

if [ "$(docker ps -q -f name=$REDIS_CONTAINER_NAME)" ]; then
  echo "Database container '$REDIS_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$REDIS_CONTAINER_NAME)" ]; then
  docker start "$REDIS_CONTAINER_NAME"
  echo "Existing database container '$REDIS_CONTAINER_NAME' started"
  exit 0
fi

docker run -d \
  --name $REDIS_CONTAINER_NAME \
  -p "$REDIS_PORT":6379 \
  docker.io/redis:alpine3.21 && echo "Redis container '$REDIS_CONTAINER_NAME' was successfully created"