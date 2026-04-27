# Ma.ia API

Backend FastAPI do produto Ma.ia.

Este scaffold inicial cria apenas a base da aplicacao, health checks e pontos de extensao para autenticacao Trevvos, dominios do produto e futura integracao com IA. Banco de dados, JWT real, migrations e filas ainda nao foram implementados.

## Objetivo

`maia-api` sera a API dedicada do produto Ma.ia. Ela deve manter o dominio do produto isolado, validar futuramente JWTs emitidos pela API principal Trevvos e armazenar os dados do Ma.ia em schema proprio no PostgreSQL.

## Instalar dependencias

Use `uv` dentro da pasta da API:

```powershell
cd apps\maia-api
uv sync
```

## Rodar localmente

```powershell
cd apps\maia-api
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3340
```

Endpoints iniciais:

- `GET /health`
- `GET /v1/health`
- `GET /v1/me`

## Rodar testes

```powershell
cd apps\maia-api
uv run pytest
```

## Rodar lint

```powershell
cd apps\maia-api
uv run ruff check .
```

## Checagem de tipos

```powershell
cd apps\maia-api
uv run mypy app
```
