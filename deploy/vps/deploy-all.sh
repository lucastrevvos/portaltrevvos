#!/usr/bin/env bash
set -euo pipefail

cd /opt/portaltrevvos

echo "==> Deploying containers"
if [ "$(id -u)" -eq 0 ]; then
  runuser -u deploy -- ./deploy/vps/deploy.sh
else
  ./deploy/vps/deploy.sh
fi

echo "==> Deploying static fronts"
./deploy/vps/deploy-fronts.sh

echo "==> Healthcheck"

check_url() {
  local url="$1"
  echo "Checking $url"
  curl -fsS --retry 5 --retry-delay 2 --max-time 20 "$url" -o /dev/null
}

check_url "https://trevvos.com.br/"
check_url "https://www.trevvos.com.br/"
check_url "https://api.trevvos.com.br/health"
check_url "https://kmone.trevvos.com.br/"
check_url "https://kmoneconnect.trevvos.com.br/"

echo "==> Deploy finished"
