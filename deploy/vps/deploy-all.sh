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
curl -fsSI https://trevvos.com.br >/dev/null
curl -fsSI https://www.trevvos.com.br >/dev/null
curl -fsSI https://api.trevvos.com.br >/dev/null
curl -fsSI https://kmone.trevvos.com.br >/dev/null
curl -fsSI https://kmoneconnect.trevvos.com.br >/dev/null

echo "==> Deploy finished"
