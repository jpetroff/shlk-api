#!/bin/sh
PURPLE='\033[1;35m'
BIRed='\033[1;91m'
IRed='\033[0;91m'
NC='\033[0m' # No Color

DOCKER_IMAGE=""
DOCKER_FILE="./"
REMOTE_HOST=""
REMOTE_PATH=""

echo "Building and packing docker image ${PURPLE}$DOCKER_IMAGE${NC} for ${PURPLE}$REMOTE_HOST${NC}"

echo "\n[${BIGreen}Docker build${NC}]\n"
docker build . -t ${DOCKER_IMAGE} --compress -o ${DOCKER_FILE}.tar.gz

if [ "$?" -ne "0" ]; then
  echo "\n${BIRed}Cannot build a Docker image${NC}"
	exit 0
fi

echo "\n[${BIGreen}SCP upload${NC}]\n"
scp ${DOCKER_FILE} ${REMOTE_HOST}:${REMOTE_PATH}

if [ "$?" -ne "0" ]; then
  echo "\n${BIRed}Upload failed${NC}"
	exit 0
fi

echo "\n[${BIGreen}SSH exec docker load${NC}]\n"
REMOTE_CMD=`ssh -n -f ${REMOTE_HOST} "sh -c 'cd ${REMOTE_PATH} && docker load < ${DOCKER_FILE}.tag.gz'"`
echo $REMOTE_CMD










