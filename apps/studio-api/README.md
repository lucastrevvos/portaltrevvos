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
- `visual_templates`
- `render_specs`
- `image_render_jobs`
- `creative_assets`

Tudo fica no schema PostgreSQL `studio`, com SQLAlchemy 2, Alembic e sessao async.

## Instalar dependencias

```powershell
cd apps\studio-api
uv sync
```

## Instalar o renderer

```powershell
cd apps\studio-api
uv run playwright install chromium
```

## Configurar ambiente

Crie um `.env` local a partir do exemplo:

```powershell
cd apps\studio-api
copy .env.example .env
```

Variaveis principais:

- `STUDIO_DATABASE_URL=postgresql+asyncpg://trevvos:trevvos@localhost:5432/trevvos`
- `STUDIO_DB_SCHEMA=studio`
- `STUDIO_ENV=development`
- `STUDIO_GENERATED_ASSETS_DIR=generated/studio`

## Migrations e schema studio

O Studio usa sempre o schema PostgreSQL `studio`.

Decisao atual:

- as tabelas da aplicacao ficam em `studio.*`
- a tabela de versionamento do Alembic fica em `studio.alembic_version`
- o `alembic/env.py` sobrescreve explicitamente a URL com `settings.database_url`
- o schema `studio` e criado automaticamente antes do Alembic tentar versionar ou aplicar migrations

### Reset local seguro

Este reset remove apenas o schema do Studio no banco local. Nao apague `mind`, `controllar` ou objetos do `public`.

```powershell
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "DROP SCHEMA IF EXISTS studio CASCADE;"
```

Como o versionamento fica em `studio.alembic_version`, o drop do schema ja remove a tabela de versao.

### Recriar do zero

```powershell
cd apps\studio-api
uv run alembic upgrade head
```

### Verificar schema e tabelas

```powershell
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "\dn"
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "\dt studio.*"
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "select * from studio.alembic_version;"
```

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

## Fluxo textual

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

### Aprovar texto

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/draft/approve ^
  -H "Content-Type: application/json" ^
  -d "{\"actor_type\":\"client\",\"actor_name\":\"Cliente Studio\",\"comment\":\"Texto aprovado.\"}"
```

## Fluxo visual controlado

### Criar template visual

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/visual-templates ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Tecnico Editorial\",\"description\":\"Layout clean e cientifico para carrosseis educativos.\",\"category\":\"technical_editorial\",\"layout_rules\":\"Fundo off-white, titulos grandes, blocos de texto com respiro, logo no topo e rodape discreto.\",\"css_theme\":{\"background\":\"#F7F2EA\",\"primary\":\"#506044\",\"secondary\":\"#E7DDCF\",\"accent\":\"#B5895A\",\"titleFont\":\"Georgia\",\"bodyFont\":\"Arial\"},\"default_aspect_ratio\":\"1:1\",\"width\":1080,\"height\":1080,\"is_active\":true}"
```

### Gerar render specs

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/render-specs/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"visual_template_id\":\"{template_id}\",\"comment\":\"Render specs geradas para carrossel aprovado.\"}"
```

### Renderizar imagens

```powershell
curl -X POST http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/render ^
  -H "Content-Type: application/json" ^
  -d "{\"comment\":\"Render visual iniciado.\"}"
```

### Listar assets gerados

```powershell
curl http://localhost:3350/tenants/{tenant_id}/content-requests/{request_id}/creative-assets
```

## Onde os PNGs sao salvos

- caminho padrao local: `apps/studio-api/generated/studio/{tenant_slug}/{content_request_id}/`
- URL registrada no banco: `/generated/studio/{tenant_slug}/{content_request_id}/{file_name}`

## Texto e UTF-8

- O conteudo textual aprovado pelo cliente preserva UTF-8 no banco e no renderer: acentos, cedilha, pontuacao e quebras de linha devem aparecer no `title`, `body`, `caption`, `fixed_comment` e `stories_suggestion`.
- Nao use normalizacao ASCII para texto exibido no post. Isso inclui `ContentDraft`, `CarouselSlide` e `RenderSpec`.
- A normalizacao com `slugify` existe apenas para `tenant_slug`, nomes de arquivo e paths gerados pelo renderer.
- O renderer salva o HTML final de debug em `generated/studio/{tenant_slug}/{content_request_id}/debug-slide-XX.html`, preservando o texto original em UTF-8.

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
