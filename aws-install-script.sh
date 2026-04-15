#!/usr/bin/env bash
set -euo pipefail

# Ensure AWS CLI is installed on the Jenkins server
# We install it locally in the workspace if it's not present globally
# This avoids 'sudo' password prompts.

AWS_LOCAL_BIN="${WORKSPACE}/aws-bin/aws"

if ! command -v aws >/dev/null 2>&1 && [ ! -f "$AWS_LOCAL_BIN" ]; then
    echo "AWS CLI not found. Installing locally in workspace..."
    
    mkdir -p "${WORKSPACE}/aws-install-tmp"
    cd "${WORKSPACE}/aws-install-tmp"
    
    curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    
    # Check if unzip is available
    if ! command -v unzip >/dev/null 2>&1; then
        echo "Error: unzip is required to install AWS CLI locally. Please install unzip on the host or use a different agent."
        exit 1
    fi
    
    unzip -q awscliv2.zip
    
    # Install to workspace directories
    ./aws/install -i "${WORKSPACE}/aws-cli-inner" -b "${WORKSPACE}/aws-bin" --update
    
    cd "${WORKSPACE}"
    rm -rf "${WORKSPACE}/aws-install-tmp"
    echo "AWS CLI installed locally at ${WORKSPACE}/aws-bin/aws"
else
    if command -v aws >/dev/null 2>&1; then
        echo "AWS CLI already installed globally."
        mkdir -p "${WORKSPACE}/aws-bin"
        ln -sf $(which aws) "${WORKSPACE}/aws-bin/aws"
    else
        echo "AWS CLI already installed locally in workspace."
    fi
fi

# Verify
${WORKSPACE}/aws-bin/aws --version
