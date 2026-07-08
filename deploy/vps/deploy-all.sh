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
  local name="$1"
  local url="$2"

  echo "Checking $name: $url"

  local status
  status="$(curl -L -sS -o /dev/null -w "%{http_code}" --retry 5 --retry-delay 2 --max-time 20 "$url")"

  if [ "$status" -lt 200 ] || [ "$status" -ge 400 ]; then
    echo "Healthcheck failed for $name: HTTP $status"
    exit 1
  fi

  echo "OK $name: HTTP $status"
}

check_url "Portal" "https://trevvos.com.br/"
check_url "Portal www" "https://www.trevvos.com.br/"
check_url "API health" "https://api.trevvos.com.br/health"
check_url "KM One" "https://kmone.trevvos.com.br/"
check_url "KM One Connect" "https://kmoneconnect.trevvos.com.br/"

echo "==> Deploy finished"
