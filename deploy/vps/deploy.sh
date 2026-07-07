#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/portaltrevvos"
DEPLOY_DIR="/opt/trevvos"

echo "==> Indo para o repo"
cd "$APP_DIR"

echo "==> Atualizando branch master"
git fetch origin master
git checkout master
git pull --ff-only origin master

echo "==> Garantindo arquivos de deploy no runtime"
mkdir -p "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/secrets"

cp "$APP_DIR/deploy/vps/docker-compose.yml" "$DEPLOY_DIR/docker-compose.yml"
cp "$APP_DIR/deploy/vps/Caddyfile" "$DEPLOY_DIR/Caddyfile"

echo "==> Validando arquivo de ambiente"
if [ ! -f "$DEPLOY_DIR/secrets/api.env" ]; then
  echo "ERRO: $DEPLOY_DIR/secrets/api.env não existe"
  exit 1
fi

echo "==> Buildando e subindo containers"
cd "$DEPLOY_DIR"
docker compose up -d --build

echo "==> Limpando imagens antigas"
docker image prune -f

echo "==> Status dos containers"
docker ps

echo "==> Aguardando API ficar saudável"

for i in {1..30}; do
  if curl -fsS https://api.trevvos.com.br/health > /dev/null; then
    echo "Healthcheck OK"
    echo ""
    echo "Deploy finalizado com sucesso."
    exit 0
  fi

  echo "Tentativa $i/30: API ainda não respondeu. Aguardando 3s..."
  sleep 3
done

echo "ERRO: API não ficou saudável após 90 segundos"
echo "==> Logs da API"
docker logs trevvos-api --tail=120
echo "==> Logs do Caddy"
docker logs trevvos-caddy --tail=80
exit 1
