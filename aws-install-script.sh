#!/usr/bin/env bash
set -euo pipefail

# Ensure AWS CLI is installed on the Jenkins server (Master)
# We need it to sync connection files to S3

if ! command -v aws >/dev/null 2>&1; then
    echo "AWS CLI not found. Installing..."
    sudo apt-get update
    sudo apt-get install unzip -y
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -o awscliv2.zip
    sudo ./aws/install --update
    rm -rf awscliv2.zip aws/
fi

# Ensure workspace binary path exists for the pipeline env
mkdir -p ${WORKSPACE}/aws-bin
ln -sf $(which aws) ${WORKSPACE}/aws-bin/aws

echo "AWS CLI version: $(aws --version)"
