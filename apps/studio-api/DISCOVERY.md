# Trevvos Studio — Discovery

## Objetivo deste documento
Este arquivo registra o estado atual real de `apps/studio-api` com base em código, configuração, migrations, testes e README. O foco é reduzir custo de contexto para próximas sessões com IA e para manutenção humana.

## 1. Visão geral do Trevvos Studio
O `studio-api` é um backend FastAPI para o produto Trevvos Studio. Hoje ele expõe uma API para:

- cadastro de tenants
- onboarding estratégico
- brand kit
- content requests
- content drafts com workflow de aprovação textual
- templates visuais
- geração de render specs
- renderização de PNGs
- upload de brand assets
- geração de fundos com IA visual
- geração textual com IA
- radar de conteúdo com IA

O output principal confirmado no código atual é:

- registros persistidos em banco PostgreSQL schema `studio`
- PNGs renderizados em `generated/studio/...`
- assets auxiliares em `uploads/...`
- URLs públicas como `/generated/...` e `/uploads/...`
- HTML e logs de debug por slide em `generated/studio/...`

## 2. Stack técnica

### Linguagem e framework
- Python 3.11+
- FastAPI

### Persistência
- SQLAlchemy 2 com `asyncio`
- `asyncpg` para PostgreSQL
- Alembic para migrations

### Renderização e imagem
- Playwright para screenshot HTML -> PNG
- Jinja2 para template HTML
- Pillow para leitura/dimensões de imagens

### IA
- SDK `openai`
- geração textual com `responses.create` e JSON Schema estrito
- geração de imagem com `images.generate`

### Testes e qualidade
- pytest
- httpx
- aiosqlite
- ruff

### Comandos relevantes confirmados
```powershell
uv sync
uv run playwright install chromium
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3350
uv run pytest
uv run ruff check .
```

## 3. Estrutura de pastas

```text
apps/studio-api/
├─ app/
│  ├─ core/
│  ├─ modules/
│  ├─ shared/
│  └─ main.py
├─ alembic/
│  ├─ env.py
│  └─ versions/
├─ tests/
├─ generated/
├─ uploads/
├─ .env.example
├─ README.md
└─ pyproject.toml
```

### Responsabilidades
- `app/main.py`: cria a aplicação FastAPI, registra CORS, healthcheck, routers e `StaticFiles`.
- `app/core/`: config, logging e setup de banco.
- `app/modules/`: domínio principal da aplicação, organizado por recurso.
- `app/shared/`: enums, helpers de path/storage/texto, erros comuns.
- `alembic/`: migrations do schema `studio`.
- `tests/`: suíte com `TestClient`, SQLite em memória e validação do fluxo principal.
- `generated/`: saída local dos PNGs renderizados e dos arquivos de debug.
- `uploads/`: brand assets e fundos de IA visual no modo local/MVP.

## 4. Arquitetura atual

### `app/main.py`
Responsável por:
- criar `FastAPI()`
- configurar CORS para `localhost:3010`
- expor `/health`
- incluir todos os routers
- montar `/generated` e `/uploads`

Pontos importantes:
- usa `Path(__file__).resolve().parents[1]` para resolver a raiz de `apps/studio-api`
- hoje separa:
  - `generated_assets_dir = generated/studio`
  - `generated_mount_dir = generated`
- monta `/generated` a partir de `generated/`
- monta `/uploads` a partir de `uploads/`

### `app/core/config.py`
Centraliza settings via `pydantic-settings`. Lê `.env` com prefixo `STUDIO_`.

### `app/core/database.py`
Configura:
- `Base.metadata` com schema padrão `studio`
- engine async
- session factory
- helper `studio_enum()` para enums persistidos com valores lowercase

### `app/modules/rendering/service.py`
`HtmlCssRenderer` é a peça central do pipeline visual:
- recebe `RenderSpec` + `VisualTemplate`
- gera HTML via `render_html()`
- salva debug HTML/log
- usa Playwright para gerar PNG
- em fallback, gera PNG sólido quando permitido
- resolve URLs locais `/generated/...` e `/uploads/...` para `data:` URLs quando necessário

Saídas principais:
- arquivo PNG em disco
- URL pública `/generated/studio/...`
- debug files `debug-slide-XX.html` e `debug-slide-XX.txt`

### `app/modules/render_specs`
Responsável por:
- gerar specs visuais a partir de draft aprovado
- renderizar specs prontos
- registrar jobs de render
- registrar creative assets
- controlar transições do fluxo visual

Dependências:
- `ContentRequestService`
- `VisualTemplateService`
- `BrandAssetService`
- `HtmlCssRenderer`

### `app/modules/content_drafts`
Responsável por:
- criar/editar draft
- workflow textual
- submissão para aprovação
- pedido de revisão
- aprovação
- histórico `ApprovalEvent`

### `app/modules/content_requests`
Responsável por:
- CRUD parcial de `ContentRequest`
- patch de status com restrições

Observação confirmada:
- vários status são gerenciados apenas por endpoints de workflow, não por patch manual

### `app/modules/ai_content`
Responsável por:
- gerar ideias de conteúdo
- gerar draft textual estruturado
- rodar quality check determinístico

Dependências:
- OpenAI
- onboarding obrigatório
- brand kit opcional
- content request

### `app/modules/content_radar`
Responsável por:
- gerar sugestões estratégicas de posts
- usa tenant, onboarding, brand kit opcional e últimos pedidos

Limitação confirmada:
- não há pesquisa web real no backend atual

### `app/modules/ai_visual`
Responsável por:
- gerar fundos de imagem com IA
- persistir os fundos em `uploads/ai-visual/...`
- listar fundos associados a um request

### `app/modules/brand_assets`
Responsável por:
- upload/list/update/delete de assets de marca
- manter asset principal por tipo
- gerar URL pública em `/uploads/...`

### `app/modules/tenants`, `onboarding`, `brand_kits`, `visual_templates`
Módulos CRUD do contexto do cliente e do template visual.

## 5. Fluxo principal de geração

Fluxo confirmado no código e reforçado por `tests/test_domain_flow.py`:

1. Criação de `Tenant`
2. Criação de `OnboardingProfile`
3. Criação opcional de `BrandKit`
4. Criação de `ContentRequest`
5. Criação manual ou por IA de `ContentDraft`
6. Submissão do draft para aprovação textual
7. Aprovação textual do draft
8. Geração de `RenderSpec` com um `VisualTemplate`
9. Mudança de status do request para `visual_prompt_ready`
10. Renderização de PNGs
11. Persistência de `ImageRenderJob` e `CreativeAsset`
12. Mudança de status do request para `in_manual_production`
13. Exposição dos PNGs em `/generated/studio/...`

Fluxo com IA visual:

1. request já precisa estar em `visual_prompt_ready`
2. gerar backgrounds em `/tenants/{tenant_id}/content-requests/{request_id}/ai/generate-visual-backgrounds`
3. backgrounds viram `CreativeAsset` com `asset_type=generated_background`
4. render final com `mode=ai_visual`

Fluxo com IA textual:

1. onboarding obrigatório
2. `POST /tenants/{tenant_id}/ai/content-ideas`
3. ou `POST /tenants/{tenant_id}/content-requests/{request_id}/ai/generate-draft`
4. saída estruturada validada por JSON Schema
5. draft salvo no banco
6. quality check retornado junto

## 6. Sistema de arquivos gerados

### Estado atual confirmado
- diretório de escrita dos renders: `generated/studio`
- diretório montado publicamente em `StaticFiles`: `generated`
- URL pública dos PNGs: `/generated/studio/{tenant_slug}/{content_request_id}/{file_name}`

### Caminho local
Exemplo real validado nesta sessão:
```text
C:\dev\PROJETOS\portaltrevvos\apps\studio-api\generated\studio\laissmeha\bc8887a9-5006-43f2-a628-843249e87933\laissmeha-fontes-de-proteina-nas-dietas-vegetarianas-para-atletas-slide-01.png
```

### URL pública
Exemplo real validado nesta sessão:
```text
/generated/studio/laissmeha/bc8887a9-5006-43f2-a628-843249e87933/laissmeha-fontes-de-proteina-nas-dietas-vegetarianas-para-atletas-slide-01.png
```

### Formação de paths
- `HtmlCssRenderer.render()` salva em:
  - `generated_root / tenant_slug / request_id / file_name`
- `generated_root` hoje resolve para `apps/studio-api/generated/studio`
- `public_url` é montada como:
```python
f"/generated/studio/{tenant_slug}/{request_id}/{file_name}"
```

### StaticFiles
Em `app/main.py`:
- `/generated` é montado a partir de `generated_mount_root`
- `generated_mount_root` resolve para `apps/studio-api/generated`

### Histórico técnico da correção do 404
Bug recente confirmado:
- `/generated` estava efetivamente alinhado de forma incompatível com `generated_assets_dir`
- isso levava a procurar `generated/studio/studio/...`

Arquitetura atual esperada:
- `generated_assets_dir = "generated/studio"`
- `generated_mount_dir = "generated"`
- renderer grava em `generated/studio/...`
- FastAPI serve `/generated/...` a partir de `generated/`

### Compatibilidade Windows + Linux/Render
Decisões confirmadas:
- uso de `Path(__file__).resolve()` evita dependência do current working directory
- `build_public_url()` normaliza `\` para `/`
- não há hardcode de separador de path de Windows

## 7. Configurações e variáveis de ambiente

Configurações confirmadas em `app/core/config.py` e `.env.example`:

| Variável | Default | Finalidade |
|---|---|---|
| `STUDIO_ENV` | `development` | controla comportamento de ambiente e `echo` do SQLAlchemy |
| `STUDIO_API_NAME` | `Trevvos Studio API` | nome da API |
| `STUDIO_API_VERSION` | `0.1.0` | versão da API |
| `STUDIO_API_PORT` | `3350` | porta lógica do app |
| `STUDIO_DATABASE_URL` | `postgresql+asyncpg://...` | conexão com PostgreSQL |
| `STUDIO_DB_SCHEMA` | `studio` | schema padrão do banco |
| `STUDIO_GENERATED_ASSETS_DIR` | `generated/studio` | diretório real de escrita dos PNGs |
| `STUDIO_GENERATED_MOUNT_DIR` | `generated` | diretório montado em `/generated` |
| `STUDIO_UPLOADS_DIR` | `uploads` | diretório base para uploads locais |
| `STUDIO_OPENAI_API_KEY` | `None` | habilita fluxos IA que dependem da OpenAI |
| `STUDIO_AI_MODEL` | `gpt-4.1-mini` | modelo textual |
| `STUDIO_IMAGE_MODEL` | `gpt-image-2` | modelo de imagem |
| `STUDIO_ENABLE_AI_VISUAL` | `true` | liga/desliga geração de IA visual |

## 8. Banco de dados

### ORM e migrations
- ORM: SQLAlchemy 2 async
- migrations: Alembic
- schema principal: `studio`
- tabela de versão do Alembic: `studio.alembic_version`

### Tabelas principais confirmadas
- `tenants`
- `onboarding_profiles`
- `brand_kits`
- `brand_assets`
- `content_requests`
- `content_drafts`
- `carousel_slides`
- `approval_events`
- `visual_templates`
- `render_specs`
- `image_render_jobs`
- `creative_assets`

### Relações principais
- `Tenant` -> `OnboardingProfile` 1:1
- `Tenant` -> `BrandKit` 1:1
- `Tenant` -> `BrandAsset` 1:N
- `Tenant` -> `ContentRequest` 1:N
- `Tenant` -> `VisualTemplate` 1:N
- `ContentRequest` -> `ContentDraft` 1:1
- `ContentDraft` -> `CarouselSlide` 1:N
- `ContentRequest`/`ContentDraft` -> `ApprovalEvent` 1:N
- `ContentRequest` -> `RenderSpec` 1:N
- `RenderSpec` -> `ImageRenderJob` 1:N
- `RenderSpec` -> `CreativeAsset` 1:N

### Migrations encontradas
- `202605072200_create_studio_initial_domain.py`
- `202605072330_add_textual_workflow_domain.py`
- `202605080030_add_visual_render_domain.py`
- `202605081200_add_brand_assets_and_ai_visuals.py`

## 9. Endpoints da API

Status aqui significa o quanto o código e os testes atuais confirmam o fluxo.

| Método | Rota | Módulo | Função | Status |
|---|---|---|---|---|
| `GET` | `/health` | `app.main` | healthcheck | funcional |
| `POST` | `/tenants` | `tenants` | criar tenant | funcional |
| `GET` | `/tenants` | `tenants` | listar tenants | funcional |
| `GET` | `/tenants/{tenant_id}` | `tenants` | obter tenant | funcional |
| `POST` | `/tenants/{tenant_id}/onboarding` | `onboarding` | criar onboarding | funcional |
| `GET` | `/tenants/{tenant_id}/onboarding` | `onboarding` | obter onboarding | funcional |
| `PUT` | `/tenants/{tenant_id}/onboarding` | `onboarding` | atualizar onboarding | funcional |
| `POST` | `/tenants/{tenant_id}/brand-kit` | `brand_kits` | criar brand kit | funcional |
| `GET` | `/tenants/{tenant_id}/brand-kit` | `brand_kits` | obter brand kit | funcional |
| `PUT` | `/tenants/{tenant_id}/brand-kit` | `brand_kits` | atualizar brand kit | funcional |
| `GET` | `/tenants/{tenant_id}/brand-assets` | `brand_assets` | listar assets | funcional |
| `POST` | `/tenants/{tenant_id}/brand-assets` | `brand_assets` | upload asset | funcional |
| `PUT` | `/tenants/{tenant_id}/brand-assets/{asset_id}` | `brand_assets` | editar asset | funcional |
| `DELETE` | `/tenants/{tenant_id}/brand-assets/{asset_id}` | `brand_assets` | remover asset | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests` | `content_requests` | criar pedido | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests` | `content_requests` | listar pedidos | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}` | `content_requests` | obter pedido | funcional |
| `PATCH` | `/tenants/{tenant_id}/content-requests/{request_id}/status` | `content_requests` | alterar status manual | funcional com restrições |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/draft` | `content_drafts` | criar draft | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}/draft` | `content_drafts` | obter draft | funcional |
| `PUT` | `/tenants/{tenant_id}/content-requests/{request_id}/draft` | `content_drafts` | atualizar draft | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/draft/submit` | `content_drafts` | submeter draft | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/draft/request-revision` | `content_drafts` | pedir revisão | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/draft/approve` | `content_drafts` | aprovar draft | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}/approval-events` | `content_drafts` | listar eventos | funcional |
| `POST` | `/tenants/{tenant_id}/ai/content-ideas` | `ai_content` | ideias de conteúdo | funcional/experimental |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/ai/generate-draft` | `ai_content` | gerar draft IA | funcional/experimental |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/ai/check-draft-quality` | `ai_content` | quality check | funcional |
| `POST` | `/tenants/{tenant_id}/content-radar/suggestions` | `content_radar` | radar IA | funcional/experimental |
| `POST` | `/tenants/{tenant_id}/visual-templates` | `visual_templates` | criar template | funcional |
| `GET` | `/tenants/{tenant_id}/visual-templates` | `visual_templates` | listar templates | funcional |
| `GET` | `/tenants/{tenant_id}/visual-templates/{template_id}` | `visual_templates` | obter template | funcional |
| `PUT` | `/tenants/{tenant_id}/visual-templates/{template_id}` | `visual_templates` | atualizar template | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/render-specs/generate` | `render_specs` | gerar specs | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}/render-specs` | `render_specs` | listar specs | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}/render-specs/{spec_id}` | `render_specs` | obter spec | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/render` | `render_specs` | renderizar | funcional |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}/creative-assets` | `render_specs` | listar assets | funcional |
| `POST` | `/tenants/{tenant_id}/content-requests/{request_id}/ai/generate-visual-backgrounds` | `ai_visual` | gerar fundos IA | funcional/experimental |
| `GET` | `/tenants/{tenant_id}/content-requests/{request_id}/ai/visual-backgrounds` | `ai_visual` | listar fundos IA | funcional |

## 10. Testes existentes

### Infra de teste
- `tests/conftest.py`
- banco de teste: `sqlite+aiosqlite:///:memory:`
- anexa um banco em memória como schema `studio`
- usa `TestClient`
- sobrescreve `generated_assets_dir` e `uploads_dir` para `tmp_path`

### Arquivos e foco
- `tests/test_health.py`: valida `/health`
- `tests/test_domain_flow.py`: valida fluxo principal de tenant -> onboarding -> brand kit -> request -> draft -> aprovação -> render specs -> render -> creative assets
- `tests/test_rendering.py`: valida HTML renderizado, PNG, debug HTML/log e falha de Playwright
- `tests/test_ai_content.py`: valida ideias, draft IA, overwrite, qualidade e requisitos de onboarding/API key
- `tests/test_ai_content_schema.py`: valida compatibilidade de JSON Schema da OpenAI
- `tests/test_content_radar.py`: valida radar, onboarding obrigatório e regras de nicho
- `tests/test_content_radar_schema.py`: valida schema e prompt do radar
- `tests/test_brand_assets_ai_visual.py`: valida upload de logo principal, uso do logo no render, geração e uso de fundos IA
- `tests/test_enum_mapping.py`: valida enums persistidos em lowercase

### Validação recente de `/generated`
Não há um teste dedicado em repositório exclusivamente para o bug do `StaticFiles`, mas nesta sessão foi validado via `FastAPI TestClient`:
- arquivo existente em `/generated/studio/...` -> `200 image/png`
- arquivo inexistente -> `404`

## 11. Estado atual

### O que já funciona
- CRUD básico de tenant/onboarding/brand kit
- fluxo textual com aprovação e eventos
- geração de render specs após aprovação textual
- renderização de PNG com debug HTML/log
- persistência de jobs e assets
- upload de brand assets
- geração de fundos IA visual
- radar de conteúdo e IA textual com saída estruturada
- exposição local de `/generated` e `/uploads`

### O que está parcial
- fluxo final pós `in_manual_production` até entrega final não aparece completo no código atual
- não há endpoint específico de “galeria”, “ZIP”, “download final” ou aprovação visual final além dos status existentes
- algumas operações parecem orientadas a MVP local, não a storage externo

### O que está experimental
- geração textual com OpenAI
- radar de conteúdo
- IA visual

### O que ainda falta validar
- comportamento em servidor real fora de `TestClient`
- deploy e persistência de arquivos em ambiente Render/Linux
- estratégia de storage externo
- concorrência e volume maior de renders

### Principais riscos técnicos
- assets ainda dependem de filesystem local
- Playwright é dependência operacional sensível
- sem storage externo, deploy stateless pode perder outputs
- fluxos IA dependem de configuração correta de OpenAI e custo operacional

## 12. Decisões técnicas importantes

- manter URL pública de PNG como `/generated/studio/...`
- salvar PNGs em `generated/studio/...`
- montar `StaticFiles("/generated")` a partir de `generated/`
- separar `generated_assets_dir` de `generated_mount_dir`
- usar `Path(__file__).resolve()` para não depender do diretório de execução
- manter `uploads/` separado de `generated/`
- usar JSON Schema estrito para respostas estruturadas da OpenAI
- impedir alteração manual de certos status via patch genérico
- manter aprovação textual explícita antes da geração visual

## 13. Inconsistências encontradas

- há sinais de texto com encoding incorreto em partes do README e em alguns literais de teste, por exemplo strings com `Ã`. Isso não prova erro de runtime do produto, mas indica inconsistência de encoding em arquivos do repositório.
- `README.md` mistura documentação estável com detalhes de MVP local; ainda não existe um documento único de arquitetura.
- a validação recente do bug de `/generated` foi feita nesta sessão e ainda não aparece como teste dedicado de regressão no repositório.

## 14. Próximos passos recomendados

### P0 — estabilização
- adicionar teste de regressão dedicado para `StaticFiles("/generated")`
- validar fluxo completo com `uvicorn` real e requisição HTTP externa
- revisar encoding UTF-8 dos arquivos de documentação e testes
- reforçar logs estruturados para render e IA

### P1 — produto mínimo utilizável
- fechar workflow pós-render até aprovação final/entrega
- definir contrato de frontend para consumo dos assets gerados
- documentar melhor status machine do `ContentRequest`
- criar endpoint ou convenção clara para entrega final

### P2 — escala/deploy
- migrar assets para storage externo
- validar Playwright e filesystem no Render/Linux
- definir política de retenção/limpeza de `generated/` e `uploads/`
- adicionar testes de integração com PostgreSQL real

### P3 — features futuras
- galeria/histórico de gerações
- exportação ZIP
- versionamento de templates
- versionamento de drafts aprovados
- aprovação visual final mais explícita

## 15. Instruções para próximas sessões com IA

- antes de implementar qualquer mudança, ler este `DISCOVERY.md`
- não alterar paths públicos sem verificar impacto no frontend e nos assets já persistidos
- não hardcodar caminho Windows
- preservar compatibilidade Windows + Linux/Render
- não mover `generated/` ou `uploads/` sem revisar `app.main`, renderer e helpers de storage
- preferir mudanças pequenas, localizadas e testáveis
- ao mexer em render ou storage, validar sempre path local + URL pública
- ao mexer em IA, validar dependência de `STUDIO_OPENAI_API_KEY` e cenários sem key
- sempre retornar arquivos alterados, comandos executados e resultado dos testes

