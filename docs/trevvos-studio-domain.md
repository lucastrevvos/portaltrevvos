# Trevvos Studio Domain

## Visao geral

O dominio inicial do Trevvos Studio foi modelado para sustentar o fluxo do Concierge MVP:

```txt
tenant -> onboarding_profile -> brand_kit -> content_request
```

O backend usa schema dedicado `studio` dentro do PostgreSQL e separa responsabilidades por modulo.

## Entidades iniciais

### Tenant

Representa o cliente, profissional ou empresa que usa o Studio.

Campos:

- `id`
- `name`
- `slug`
- `business_name`
- `niche`
- `created_at`
- `updated_at`

Regras:

- `slug` deve ser unico
- base para multi-tenant desde o inicio

### OnboardingProfile

Representa o questionario estrategico do cliente.

Relacionamento:

- `tenant 1:1 onboarding_profile`

Campos principais:

- `professional_name`
- `instagram_handle`
- `website_url`
- `whatsapp_number`
- `city`
- `service_mode`
- `target_audience`
- `audience_pain_points`
- `main_services`
- `desired_positioning`
- `tone_of_voice`
- `avoid_communication`
- `brand_phrase`
- `main_cta`

### BrandKit

Representa diretrizes visuais iniciais da marca.

Relacionamento:

- `tenant 1:1 brand_kit`

Campos principais:

- `logo_url`
- `primary_color`
- `secondary_color`
- `accent_color`
- `font_preferences`
- `visual_style`
- `photo_usage_preference`
- `layout_preference`

Observacao:

- `logo_url` e demais referencias de assets permanecem como string nesta fase

### ContentRequest

Representa um pedido de conteudo feito pelo tenant.

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

Regra inicial:

- quando nenhum status e informado, o request nasce como `draft`

## Relacionamentos

```txt
Tenant
  ├─ 1:1 OnboardingProfile
  ├─ 1:1 BrandKit
  └─ 1:N ContentRequest
```

## Enums

### `service_mode`

- `online`
- `presencial`
- `hibrido`

### `photo_usage_preference`

- `frequent`
- `occasional`
- `avoid`
- `unknown`

### `content_format`

- `static_post`
- `carousel`
- `story_sequence`
- `reel_script`
- `landing_page`
- `logo`
- `visual_identity`

### `content_objective`

- `authority`
- `engagement`
- `conversion`
- `education`
- `lead_generation`
- `brand_awareness`

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

## Endpoints iniciais

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

## Fluxo do Concierge MVP

1. Criar tenant.
2. Preencher onboarding estrategico.
3. Registrar brand kit.
4. Abrir content request.
5. Evoluir status conforme aprovacao textual e producao manual futura.

## Decisoes tomadas

- O backend foi organizado por `modules/*` e `shared/*`, mantendo o dominio mais legivel para crescimento por contexto.
- O schema PostgreSQL dedicado e `studio`.
- As tabelas ficam todas dentro do schema `studio`.
- O modelo ja nasce multi-tenant com `tenant_id` como fronteira de acesso.
- Onboarding e brand kit foram modelados como `1:1` por tenant no MVP.
- `visual_template_id` fica apenas como placeholder para integracao futura.
- Nenhum fluxo de auth, IA, imagem ou billing foi implementado nesta task.

## Proximos dominios preparados conceitualmente

- `ContentDraft`
- `CarouselSlide`
- `VisualTemplate`
- `GeneratedPrompt`
- `CreditWallet`
- `CreditTransaction`
- `UploadedAsset`
- `AdminDelivery`
- `ApprovalEvent`
