#! /bin/bash

PUBLIC_DIST="../shlk-app/dist/*"

export NODE_ENV=production

npm run build

mkdir ./dist/public

cp -r ${PUBLIC_DIST} ./dist/public

docker build . -t shlk_main:latest

mv shlk_main.tar.gz shlk_main_prev_build.tar.gz

docker save shlk_main | gzip > shlk_main.tar.gz