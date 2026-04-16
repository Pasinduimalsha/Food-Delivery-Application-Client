#!/usr/bin/env bash
set -euo pipefail

# Usage: docker-compose-script.sh IMAGE_NAME
if [ "$#" -lt 1 ]; then
	echo "Usage: $0 IMAGE_NAME"
	exit 1
fi

IMAGE_NAME="$1"

# Upgrade docker-compose binary to modern v2 to fix KeyError 'ContainerConfig'
CURRENT_VERSION=$(docker-compose --version 2>/dev/null || echo "none")
if [[ "$CURRENT_VERSION" == *"1.29"* ]] || ! command -v docker-compose >/dev/null 2>&1; then
	echo "Installing/Upgrading docker-compose to v2.29.2..."
	sudo curl -L "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
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

# Forcefully kill and delete the old container so Docker compose v2 doesn't hit a naming collision from v1.29
sudo docker rm -f food-delivery-application-client || true
sudo env IMAGE_NAME="${IMAGE_NAME}" docker-compose -f "${COMPOSE_FILE}" down || true

# Pull the absolute newest image from Docker Hub first!
sudo env IMAGE_NAME="${IMAGE_NAME}" docker-compose -f "${COMPOSE_FILE}" pull
# Then start the containers using the newly downloaded image
sudo env IMAGE_NAME="${IMAGE_NAME}" docker-compose -f "${COMPOSE_FILE}" up -d --remove-orphans

docker-compose --version