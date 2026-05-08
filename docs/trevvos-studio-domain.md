# Trevvos Studio Domain

## Visao geral

O dominio atual sustenta o fluxo do Concierge MVP com aprovacao textual e producao visual controlada:

```txt
tenant
  -> onboarding_profile
  -> brand_kit
  -> content_request
    -> content_draft
      -> carousel_slides
    -> approval_events
    -> visual_template
    -> render_specs
      -> image_render_jobs
      -> creative_assets
```

O backend usa schema dedicado `studio` dentro do PostgreSQL e separa responsabilidades por modulo.

## Entidades

### Tenant

Cliente, profissional ou empresa que usa o Studio.

Campos principais:

- `id`
- `name`
- `slug`
- `business_name`
- `niche`

Regra:

- `slug` unico e usado como base segura para paths e URLs internas

### OnboardingProfile

Questionario estrategico do cliente.

Relacionamento:

- `tenant 1:1 onboarding_profile`

### BrandKit

Diretrizes visuais da marca.

Relacionamento:

- `tenant 1:1 brand_kit`

Observacao:

- `logo_url` continua como string nesta fase

### ContentRequest

Pedido de conteudo do tenant.

Relacionamento:

- `tenant 1:N content_requests`

Campos principais:

- `title`
- `format`
- `objective`
- `cta`
- `theme`
- `visual_template_id`
- `status`
- `briefing`

### ContentDraft

Rascunho textual aprovado pelo cliente antes da etapa visual.

Relacionamento:

- `content_request 1:1 content_draft`

Campos principais:

- `title`
- `caption`
- `fixed_comment`
- `stories_suggestion`
- `status`
- `version`

### CarouselSlide

Texto aprovado de cada slide de um carrossel.

Relacionamento:

- `content_draft 1:N carousel_slides`

Regras:

- `slide_number >= 1`
- ordem natural por `slide_number`

### ApprovalEvent

Historico operacional de mudancas de status, aprovacoes e revisoes.

Relacionamento:

- `content_request 1:N approval_events`

### VisualTemplate

Template visual controlado, preparado para uso por tenant e para templates globais no futuro.

Campos principais:

- `tenant_id nullable`
- `name`
- `category`
- `layout_rules`
- `css_theme`
- `default_aspect_ratio`
- `width`
- `height`
- `is_active`

Decisao:

- `css_theme` foi modelado em JSON para snapshot simples de cores e tipografia sem obrigar estrutura rigida cedo demais

### RenderSpec

Snapshot estruturado do que o renderer precisa para gerar a imagem.

Relacionamento:

- `content_request 1:N render_specs`
- `content_draft 1:N render_specs`
- `carousel_slide 1:N render_specs`
- `visual_template 1:N render_specs`

Campos principais:

- `render_type`
- `slide_number`
- `total_slides`
- `width`
- `height`
- `title`
- `body`
- `cta`
- `visual_notes`
- `brand_logo_url`
- `brand_primary_color`
- `brand_secondary_color`
- `brand_accent_color`
- `brand_visual_style`
- `status`

Decisao:

- `RenderSpec` guarda snapshot dos dados visuais no momento da geracao para evitar drift quando o `BrandKit` mudar depois

### ImageRenderJob

Execucao do renderer HTML/CSS.

Campos principais:

- `status`
- `renderer`
- `output_path`
- `error_message`
- `started_at`
- `finished_at`

### CreativeAsset

Arquivo visual gerado pela plataforma.

Campos principais:

- `asset_type`
- `url`
- `file_name`
- `mime_type`
- `width`
- `height`
- `status`

Nesta fase:

- `url` registra um path relativo local, por exemplo `/generated/studio/{tenant_slug}/{content_request_id}/slide-01.png`

## Enums

### `content_request_status`

- `draft`
- `awaiting_text_approval`
- `text_revision_requested`
- `text_approved`
- `visual_prompt_ready`
- `in_manual_production`
- `awaiting_final_approval`
- `final_revision_requested`
- `delivered`
- `cancelled`

### `content_draft_status`

- `draft`
- `awaiting_approval`
- `revision_requested`
- `approved`

### `visual_template_category`

- `institutional_premium`
- `technical_editorial`
- `human_connection`
- `conversion_focused`
- `minimalist_scientific`
- `custom`

### `render_type`

- `cover_slide`
- `carousel_slide`
- `closing_slide`
- `static_post`
- `story`

### `render_spec_status`

- `draft`
- `ready`
- `rendered`
- `discarded`

### `image_render_job_status`

- `pending`
- `running`
- `completed`
- `failed`

### `creative_asset_type`

- `rendered_slide`
- `final_delivery`
- `reference`
- `logo`
- `photo`

### `creative_asset_status`

- `draft`
- `ready_for_review`
- `approved`
- `rejected`
- `discarded`

## Endpoints

### Health

- `GET /health`

### Tenants

- `POST /tenants`
- `GET /tenants`
- `GET /tenants/{tenant_id}`

### Onboarding

- `POST /tenants/{tenant_id}/onboarding`
- `GET /tenants/{tenant_id}/onboarding`
- `PUT /tenants/{tenant_id}/onboarding`

### Brand Kit

- `POST /tenants/{tenant_id}/brand-kit`
- `GET /tenants/{tenant_id}/brand-kit`
- `PUT /tenants/{tenant_id}/brand-kit`

### Content Requests

- `POST /tenants/{tenant_id}/content-requests`
- `GET /tenants/{tenant_id}/content-requests`
- `GET /tenants/{tenant_id}/content-requests/{request_id}`
- `PATCH /tenants/{tenant_id}/content-requests/{request_id}/status`

### Content Drafts

- `POST /tenants/{tenant_id}/content-requests/{request_id}/draft`
- `GET /tenants/{tenant_id}/content-requests/{request_id}/draft`
- `PUT /tenants/{tenant_id}/content-requests/{request_id}/draft`
- `POST /tenants/{tenant_id}/content-requests/{request_id}/draft/submit`
- `POST /tenants/{tenant_id}/content-requests/{request_id}/draft/request-revision`
- `POST /tenants/{tenant_id}/content-requests/{request_id}/draft/approve`
- `GET /tenants/{tenant_id}/content-requests/{request_id}/approval-events`

### Visual Templates

- `POST /tenants/{tenant_id}/visual-templates`
- `GET /tenants/{tenant_id}/visual-templates`
- `GET /tenants/{tenant_id}/visual-templates/{template_id}`
- `PUT /tenants/{tenant_id}/visual-templates/{template_id}`

### Render Specs e Assets

- `POST /tenants/{tenant_id}/content-requests/{request_id}/render-specs/generate`
- `GET /tenants/{tenant_id}/content-requests/{request_id}/render-specs`
- `GET /tenants/{tenant_id}/content-requests/{request_id}/render-specs/{spec_id}`
- `POST /tenants/{tenant_id}/content-requests/{request_id}/render`
- `GET /tenants/{tenant_id}/content-requests/{request_id}/creative-assets`

## Workflow textual

### Submissao para aprovacao

Pre-condicao:

- draft existe e tem conteudo valido

Efeito:

- `ContentDraft.status = awaiting_approval`
- `ContentRequest.status = awaiting_text_approval`
- `ApprovalEvent.text_submitted`

### Pedido de revisao textual

Pre-condicao:

- request em `awaiting_text_approval`

Efeito:

- `ContentDraft.status = revision_requested`
- `ContentRequest.status = text_revision_requested`
- `ApprovalEvent.text_revision_requested`

### Aprovacao textual

Pre-condicao:

- request em `awaiting_text_approval`

Efeito:

- `ContentDraft.status = approved`
- `ContentRequest.status = text_approved`
- `ApprovalEvent.text_approved`

## Workflow visual controlado

### Gerar RenderSpecs

Pre-condicoes:

- `ContentRequest.status == text_approved`
- `ContentDraft.status == approved`

Efeito:

- cria um `RenderSpec` por slide de carrossel, ou um unico spec para conteudo nao-carrossel
- `RenderSpec.status = ready`
- `ContentRequest.status = visual_prompt_ready`
- `ApprovalEvent.status_changed` de `text_approved` para `visual_prompt_ready`

### Renderizar imagens

Pre-condicoes:

- `ContentRequest.status == visual_prompt_ready`
- existe pelo menos um `RenderSpec` em `ready`

Efeito:

- cria `ImageRenderJob`
- executa renderer `html_playwright`
- grava PNG local
- cria `CreativeAsset`
- `RenderSpec.status = rendered`
- `CreativeAsset.status = ready_for_review`
- `ContentRequest.status = in_manual_production`
- `ApprovalEvent.status_changed` de `visual_prompt_ready` para `in_manual_production`

Observacao:

- `in_manual_production` foi mantido por compatibilidade, mas agora significa "producao visual em andamento", inclusive quando a renderizacao ocorre internamente

## Renderer HTML/CSS

Implementacao:

- modulo `app/modules/rendering`
- HTML montado com `Jinja2`
- PNG renderizado com `Playwright`
- fallback local de PNG solido quando o browser nao estiver disponivel

Diretorio padrao:

- `apps/studio-api/generated/studio/{tenant_slug}/{content_request_id}/`

Template inicial validado:

- `Tecnico Editorial`

Caracteristicas:

- fundo off-white
- contador de slide
- titulo forte
- corpo legivel
- rodape com marca
- bloco de direcao visual

## Decisoes tomadas

- O backend segue `modules/*` e `shared/*`, mantendo o dominio separado por contexto.
- O schema PostgreSQL dedicado continua sendo `studio`.
- A tabela de versao do Alembic fica em `studio.alembic_version`.
- O acesso continua multi-tenant com `tenant_id` em todos os agregados do fluxo.
- `VisualTemplate` aceita `tenant_id nullable` para suportar templates globais depois.
- O fluxo visual foi modelado com `RenderSpec` em vez de prompt livre para garantir render deterministico.
- O renderer salva snapshot visual no banco antes de gerar o arquivo.
- O endpoint generico de patch de status nao pode mais forcar status gerenciados do fluxo textual ou visual.

## Migrations e schema studio

Regras operacionais:

- o Alembic usa `settings.database_url` como fonte de verdade, nao a URL padrao do `alembic.ini`
- o schema `studio` e criado automaticamente antes da aplicacao das migrations
- todas as tabelas do dominio atual sao criadas em `studio.*`
- o versionamento fica em `studio.alembic_version`

Reset local seguro:

```powershell
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "DROP SCHEMA IF EXISTS studio CASCADE;"
```

Recriar:

```powershell
cd apps\studio-api
uv run alembic upgrade head
```

Validar:

```powershell
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "\dn"
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "\dt studio.*"
docker exec trevvos-postgres psql -U trevvos -d trevvos -c "select * from studio.alembic_version;"
```

Alerta:

- nao apague `mind`, `controllar` ou estruturas compartilhadas do `public`

## Proximos dominios preparados

- `UploadedAsset`
- `AdminDelivery`
- `ApprovalEvent` de aprovacao final do cliente
- `GeneratedPrompt` ou integracao com IA apenas como camada opcional futura
- `CreditWallet`
- `CreditTransaction`
