# Ma.ia API

Backend FastAPI do produto Ma.ia.

Este scaffold inicial cria a base da aplicacao, health checks, infraestrutura de banco PostgreSQL com SQLAlchemy async/Alembic e pontos de extensao para autenticacao Trevvos, dominios do produto e futura integracao com IA. JWT real, tabelas de dominio e filas ainda nao foram implementados.

## Objetivo

`maia-api` sera a API dedicada do produto Ma.ia. Ela deve manter o dominio do produto isolado, validar futuramente JWTs emitidos pela API principal Trevvos e armazenar os dados do Ma.ia em schema proprio no PostgreSQL.

## Instalar dependencias

Use `uv` dentro da pasta da API:

```powershell
cd apps\maia-api
uv sync
```

## Configurar ambiente

Crie um `.env` local a partir de `.env.example` e ajuste a URL do banco:

```powershell
cd apps\maia-api
copy .env.example .env
```

Variaveis de banco:

- `MAIA_DATABASE_URL`: URL PostgreSQL async, usando o driver `postgresql+asyncpg`.
- `MAIA_DB_SCHEMA`: schema dedicado do Ma.ia. O padrao e `maia`.

## Rodar localmente

```powershell
cd apps\maia-api
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3340
```

Endpoints iniciais:

- `GET /health`
- `GET /v1/health`
- `GET /v1/me`

## Rodar migrations

As migrations usam Alembic e gravam a tabela de versao dentro do schema configurado em `MAIA_DB_SCHEMA`.

```powershell
cd apps\maia-api
uv run alembic upgrade head
```

Para criar uma nova migration depois que houver modelos SQLAlchemy:

```powershell
cd apps\maia-api
uv run alembic revision --autogenerate -m "describe change"
```

A migration inicial apenas garante a existencia do schema da Ma.ia. Ela nao cria tabelas de dominio.

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
