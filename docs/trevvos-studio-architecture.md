# Trevvos Studio Architecture

## Visao geral

Trevvos Studio nasce como um produto web separado dentro do monorepo Trevvos, com frontend e backend proprios, preparados para multi-tenant, creditos internos e evolucao gradual de automacao com IA.

Estrutura inicial:

```txt
apps/
  studio-web/
  studio-api/
```

## Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query no roadmap
- Framer Motion no roadmap

### Backend

- Python 3.11+
- FastAPI
- SQLAlchemy 2
- Alembic
- Pydantic Settings
- PostgreSQL

## Fronteiras dos apps

### `apps/studio-web`

Responsavel por:

- landing publica do Studio
- dashboard logado
- onboarding do cliente
- solicitacao e aprovacao de conteudo
- area de entregas e creditos

### `apps/studio-api`

Responsavel por:

- API do Studio
- regras de negocio do produto
- persistencia por schema dedicado
- orquestracao futura de IA, creditos e pipeline operacional

## Modulos futuros do backend

Estrutura recomendada por dominio:

```txt
app/
  api/
  core/
  domain/
    tenants/
    users/
    onboarding/
    content_ideas/
    content_requests/
    content_drafts/
    generated_prompts/
    uploaded_assets/
    deliveries/
    credits/
```

## Entidades previstas

- Tenant
- User
- BrandKit
- OnboardingProfile
- ContentPillar
- ContentIdea
- ContentRequest
- ContentDraft
- CarouselSlide
- VisualTemplate
- GeneratedPrompt
- CreditWallet
- CreditTransaction
- UploadedAsset
- AdminDelivery

## Fluxo do Concierge MVP

1. Cliente conclui onboarding.
2. Cliente solicita conteudo.
3. Sistema gera rascunho textual no futuro.
4. Cliente aprova ou pede revisao do texto.
5. Sistema gera prompts visuais operacionais no futuro.
6. Admin produz imagens manualmente fora da plataforma.
7. Admin faz upload dos ativos finais.
8. Cliente aprova ou baixa a entrega.

## Status previstos para pedidos

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

## Fases de escalonamento

### Fase 1: Concierge MVP

- onboarding manualmente orientado
- pedido de conteudo
- aprovacao textual
- prompt visual operacional
- upload manual pelo admin
- entrega final ao cliente

### Fase 2: Semi-automacao

- sugestoes de pilares e temas
- pre-preenchimento de briefing
- organizacao assistida de backlog
- automacao de status e notificacoes

### Fase 3: API de imagem interna

- pipeline interno de prompts
- processamento padronizado de ativos
- historico e versionamento visual

### Fase 4: Self-service com creditos

- carteira de creditos
- consumo por acao
- recarga de creditos
- operacao com menor dependencia manual

## Decisoes iniciais

- Multi-tenant deve existir desde a modelagem base.
- Creditos sao um conceito nativo do produto, mesmo antes de billing real.
- Auth completa fica para task futura.
- Integracao com OpenAI e imagem ficam para fases posteriores.
- Deploy do Studio sera configurado separadamente apos validacao do bootstrap.
