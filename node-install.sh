#!/usr/bin/env bash
set -euo pipefail

# Install Node.js and NPM on the Build Server
if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

node -v
npm -v
