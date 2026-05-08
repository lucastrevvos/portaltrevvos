# Trevvos Studio API

Backend FastAPI do Trevvos Studio para o Concierge MVP.

O escopo atual implementa:

- `tenants`
- `onboarding_profiles`
- `brand_kits`
- `content_requests`
- `content_drafts`
- `carousel_slides`
- `approval_events`

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

Para inspecionar o SQL gerado sem banco ativo:

```powershell
cd apps\studio-api
uv run alembic upgrade head --sql
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

## Fluxo textual principal

### Criar draft

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/draft ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Organizacao de conteudo nao comeca no Canva\",\"caption\":\"Antes do layout, voce precisa de clareza sobre objetivo e narrativa.\",\"fixed_comment\":\"Qual parte da sua rotina mais trava a constancia?\",\"stories_suggestion\":\"Story 1: onde sua rotina quebra hoje?\",\"slides\":[{\"slide_number\":1,\"title\":\"Organizacao de conteudo\",\"body\":\"Nao comeca no Canva. Comeca na estrategia.\",\"visual_notes\":\"Capa limpa com tipografia forte.\"}]}"
```

### Submeter para aprovacao textual

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/draft/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"actor_type\":\"admin\",\"actor_name\":\"Lucas\",\"comment\":\"Rascunho textual inicial preparado para aprovacao.\"}"
```

### Solicitar revisao textual

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/draft/request-revision ^
  -H "Content-Type: application/json" ^
  -d "{\"actor_type\":\"client\",\"actor_name\":\"Cliente Studio\",\"comment\":\"Reduzir o texto do slide 2 e deixar menos tecnico.\"}"
```

### Aprovar texto

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/draft/approve ^
  -H "Content-Type: application/json" ^
  -d "{\"actor_type\":\"client\",\"actor_name\":\"Cliente Studio\",\"comment\":\"Texto aprovado.\"}"
```

### Listar eventos

```powershell
curl http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/approval-events
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
