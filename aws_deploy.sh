#! /bin/bash

set -e

if [ -z "$EC2_IP_ADDRESS" ]; then
  echo "Error: EC2_IP_ADDRESS not defined"
  exit 1
fi

if [ -z "$EC2_KEY_PATH" ]; then
  echo "Error: EC2_KEY_PATH environment variable is not defined"
  exit 1
fi

cleanup_local() {
  echo "Cleaning up local temporary files..."
  rm -rf ./project.tar
}

trap cleanup_local EXIT

echo "Cleaning project archive from main branch..."
git archive --format tar --output ./project.tar main

echo "Uploading project... Please be patient"

rsync -avz --progress -e "ssh -i $EC2_KEY_PATH -o StrictHostKeyChecking=no" ./project.tar ubuntu@$EC2_IP_ADDRESS:/tmp/project.tar

echo "Building and deploying on the server..."

ssh -i "$EC2_KEY_PATH" -o StrictHostKeyChecking=no ubuntu@$EC2_IP_ADDRESS << 'ENDSSH'

set -e

cleanup_remote() {
  echo "Clening up remote temporary files and directories"
  rm -rf /tmp/project.tar
  rm -rf /tmp/project_extract
}

trap cleanup_remote EXIT

echo "Preparing extraction directory..."
rm -rf /tmp/project_extract
mkdir -p /tmp/project_extract

echo "Extracting project..."
tar -xf /tmp/project.tar -C /tmp/project_extract

cd /tmp/project_extract

echo "Stopping and removing existing containers"
docker compose -f production.yml down --remove-orphans

echo "Pruning unused Docker resources..."
docker system prune -af

echo "Building and starting new containers..."
docker compose -f production.yml up --build -d --remove-orphans

ENDSSH

echo "Deployment completed successfully."