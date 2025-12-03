#!/usr/bin/env bash
set -euo pipefail

# Usage: docker-compose-script.sh IMAGE_NAME
if [ "$#" -lt 1 ]; then
	echo "Usage: $0 IMAGE_NAME"
	exit 1
fi

IMAGE_NAME="$1"

# Install docker-compose binary if not present
if ! command -v docker-compose >/dev/null 2>&1; then
	echo "Installing docker-compose..."
	sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	if [ ! -e /usr/bin/docker-compose ]; then
		sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
	fi
fi

echo "Using IMAGE_NAME=${IMAGE_NAME}"

COMPOSE_FILE="/home/ubuntu/docker-compose.yml"
if [ ! -f "${COMPOSE_FILE}" ]; then
	echo "Compose file ${COMPOSE_FILE} not found, falling back to ./docker-compose.yml"
	COMPOSE_FILE="./docker-compose.yml"
fi

echo "Starting docker-compose with ${COMPOSE_FILE}..."
# Pass IMAGE_NAME through sudo's environment explicitly
sudo env IMAGE_NAME="${IMAGE_NAME}" docker-compose -f "${COMPOSE_FILE}" up -d

docker-compose --version