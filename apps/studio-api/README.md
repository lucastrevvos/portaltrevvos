# Trevvos Studio API

Backend FastAPI do Trevvos Studio para o Concierge MVP.

O escopo atual implementa a base inicial de dominio para:

- `tenants`
- `onboarding_profiles`
- `brand_kits`
- `content_requests`

Tudo dentro do schema PostgreSQL `studio`, com SQLAlchemy 2, Alembic e sessao async.

## Instalar dependencias

```powershell
cd apps\studio-api
uv sync
```

## Configurar ambiente

Crie um `.env` local a partir do exemplo:

```powershell
cd apps\studio-api
copy .env.example .env
```

Variaveis principais:

- `STUDIO_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/trevvos`
- `STUDIO_DB_SCHEMA=studio`
- `STUDIO_ENV=development`

## Rodar migrations

```powershell
cd apps\studio-api
uv run alembic upgrade head
```

Para gerar novas migrations no futuro:

```powershell
cd apps\studio-api
uv run alembic revision --autogenerate -m "describe change"
```

## Rodar a API

```powershell
cd apps\studio-api
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3350
```

## Validar healthcheck

```powershell
curl http://localhost:3350/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "trevvos-studio-api"
}
```

## Rodar testes

```powershell
cd apps\studio-api
uv run pytest
```

## Rodar lint

```powershell
cd apps\studio-api
uv run ruff check .
```
