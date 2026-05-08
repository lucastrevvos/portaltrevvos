# Trevvos Studio Discovery

## Resumo executivo

O monorepo atual ja suporta a entrada do Trevvos Studio como apps dedicados em `apps/*`.
Ha dois precedentes importantes:

- `apps/web`: frontend Next.js consolidado para a presenca publica da Trevvos.
- `apps/maia-api`: backend FastAPI modular por produto, isolado do backend principal.

A recomendacao tecnica para o Studio neste momento e criar apps independentes:

- `apps/studio-web`
- `apps/studio-api`

Essa abordagem preserva o produto atual, evita acoplamento prematuro com `apps/web` e reaproveita o padrao de isolamento ja iniciado com `maia-api`.

## Estrutura atual do projeto

### Raiz

- `package.json`: workspace raiz com `pnpm`.
- `pnpm-workspace.yaml`: inclui `apps/*` e `packages/*`.
- `turbo.json`: pipeline simples para `build`, `dev` e `lint`.
- `docker-compose.yml`: sobe PostgreSQL local compartilhado.
- `render.yaml`: deploy atual apenas do `apps/api`.

### Apps existentes

- `apps/web`: Next.js com App Router, TypeScript e Tailwind CSS v4.
- `apps/api`: backend NestJS com Prisma, auth, posts, newsletter e uploads.
- `apps/maia-api`: backend FastAPI com SQLAlchemy async, Alembic, Pydantic Settings e organizacao modular.

### Packages existentes

- `packages/types`: tipos compartilhados TypeScript.

## Stack detectada

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS v4
- React Hook Form
- Zod

### Backend

- NestJS + Prisma no backend principal
- FastAPI + SQLAlchemy 2 + Alembic + Pydantic Settings no produto `maia-api`

### Monorepo

- `pnpm` como package manager
- `turbo` como orquestrador

## Onde encaixar o Studio

## Recomendacao principal

Criar apps dedicados:

```txt
apps/
  studio-web/
  studio-api/
```

### Motivos

- O workspace ja aceita novos apps sem mudanca estrutural.
- O Studio tem identidade de produto, dominio e fluxo proprios.
- O dashboard logado do Studio nao combina com a funcao atual de `apps/web`, que hoje opera como site/plataforma publica da Trevvos.
- O precedente de `apps/maia-api` mostra que a Trevvos ja iniciou uma estrategia de backends especializados por produto.
- A separacao facilita multi-tenant, creditos, uploads, pipeline editorial e evolucao para IA sem poluir `apps/web` nem `apps/api`.

## Alternativa considerada

Integrar inicialmente o Studio dentro de `apps/web`.

### Trade-off

Vantagem:
- Menor custo imediato de bootstrap e deploy.

Desvantagens:
- Mistura landing publica, blog, login atual e dashboard do Studio no mesmo app.
- Aumenta o risco de regressao no frontend ja existente.
- Dificulta evolucao independente de stack, ritmo de release e UX do produto.
- Torna mais confusa a separacao entre site institucional Trevvos e produto Studio.

Conclusao:
- So faria sentido usar `apps/web` se houvesse exigencia forte de reaproveitar rotas e deploy agora.
- Para o MVP atual, `apps/studio-web` e a opcao mais segura.

## Riscos de integracao

- `render.yaml` ainda nao contempla deploy do Studio.
- O script raiz `pnpm dev` continua voltado ao universo Node; o backend Python precisa rodar separado.
- O repositrio contem alteracoes locais em `apps/maia-api`, entao qualquer tentativa de reaproveitamento direto ali aumentaria risco de conflito.
- Ainda nao existe padrao unificado de auth cross-app entre `apps/api`, `apps/web` e `apps/maia-api`.
- Ainda nao existe convencao de portas por produto documentada na raiz.

## Dominio inicial recomendado para o Studio

Organizar o backend futuro por dominios, desde o inicio, pensando em:

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

## Plano incremental recomendado

### Etapa 1

- Criar `apps/studio-web` com landing e dashboard placeholder.
- Criar `apps/studio-api` com `GET /health`.
- Documentar arquitetura e fases.

### Etapa 2

- Modelar modulo `tenants`, `users` e `onboarding`.
- Definir estrategia de auth compartilhada com Trevvos.
- Configurar schema PostgreSQL dedicado, migrations e tabela base por tenant.

### Etapa 3

- Criar fluxo de `content_requests`, `content_drafts` e status do MVP.
- Implementar aprovacao textual antes da etapa visual.

### Etapa 4

- Introduzir `credit_wallet` e `credit_transactions`.
- Preparar comandos administrativos para operacao concierge.

### Etapa 5

- Conectar geracao assistida por IA, prompts visuais e pipeline de entrega.

## Decisao desta task

Foi escolhido o bootstrap isolado em:

```txt
apps/studio-web
apps/studio-api
```

Sem alterar:

- `apps/web`
- `apps/api`
- `apps/maia-api`
- `render.yaml`
- configuracoes globais de deploy
