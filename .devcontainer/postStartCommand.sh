#!/bin/sh

cd /app
NODE_ENV=development APP_TARGET=webapp npm run start &

cd /shlk-app
NODE_ENV=development APP_TARGET=webapp npm run start