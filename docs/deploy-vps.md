# Deploy VPS - Trevvos API

## Arquitetura atual

- DNS: Vercel DNS
- API: VPS Hostinger
- Reverse proxy: Caddy
- Runtime: Docker Compose
- Banco: Neon Postgres
- Domínio da API: https://api.trevvos.com.br

## Pastas na VPS

```txt
/opt/portaltrevvos
/opt/trevvos
/opt/trevvos/secrets/api.env
