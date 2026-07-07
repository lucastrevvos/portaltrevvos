# Trevvos Infra Status

## Produção atual

- Frontend: Vercel
- DNS principal: Vercel DNS
- API: VPS Hostinger
- Reverse proxy: Caddy
- Containers: Docker Compose
- Banco: Neon Postgres
- Domínio da API: https://api.trevvos.com.br
- CI/CD: GitHub Actions via SSH

## Serviços

- trevvos-api
- trevvos-caddy

## Pastas da VPS

```txt
/opt/portaltrevvos
/opt/trevvos
/opt/trevvos/secrets/api.env
/opt/trevvos/bin

/opt/trevvos/bin/status.sh
/opt/trevvos/bin/logs-api.sh
/opt/trevvos/bin/restart.sh

cd /opt/portaltrevvos
./deploy/vps/deploy.sh

curl -i https://api.trevvos.com.br/health


