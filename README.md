# Trevvos

Plataforma multi-app para conteúdo, produtos digitais e operações com IA em um monorepo moderno.

## Visão geral

Trevvos é um ecossistema de aplicações construído para reunir presença digital, publicação de conteúdo, APIs de produto e fluxos operacionais apoiados por IA em uma única base técnica.

O repositório organiza diferentes frentes da plataforma em um monorepo: portal público, API central, dashboard e API do Trevvos Studio, API dedicada ao produto Ma.ia e pacotes compartilhados. Essa composição permite evoluir produtos relacionados com consistência técnica, mantendo responsabilidades bem definidas entre frontend, backend, domínio e contratos compartilhados.

Como peça de portfólio, o projeto apresenta uma visão completa de produto digital: interface pública, serviços backend, modelagem de dados, autenticação, integrações externas, workflows de conteúdo e separação de domínios.

## Problema

Marcas e produtos digitais que combinam conteúdo, aplicações próprias e recursos de IA precisam de uma base capaz de crescer sem transformar cada nova iniciativa em um sistema isolado.

A Trevvos atende esse contexto ao oferecer uma fundação para:

- publicar conteúdo editorial com boa experiência de leitura;
- centralizar autenticação, CMS e módulos de produto;
- operar fluxos de criação de conteúdo com apoio de IA;
- validar produtos digitais em domínios separados;
- compartilhar contratos entre aplicações TypeScript;
- manter uma estrutura clara para evolução de novas frentes.

## Solução

A solução foi construída como um monorepo com aplicações especializadas e responsabilidades bem distribuídas.

- O **portal web** apresenta a marca, conteúdos editoriais e produtos da Trevvos em uma aplicação Next.js.
- A **API principal** centraliza autenticação, CMS, newsletter, uploads e módulos de produto em NestJS com Prisma.
- O **Trevvos Studio** combina uma API FastAPI com um dashboard Next.js para apoiar fluxos de conteúdo, brand assets, drafts, aprovações e geração visual.
- A **Ma.ia API** mantém um backend FastAPI dedicado para um produto com domínio próprio.
- O pacote **`@trevvos/types`** concentra tipos compartilhados para integração entre aplicações TypeScript.

Essa organização cria uma base de plataforma: cada aplicação tem autonomia técnica, mas permanece conectada por padrões, scripts e estrutura de workspace.

## Funcionalidades

### Portal Trevvos

- Home pública em Next.js para apresentação da Trevvos.
- Listagem e exibição de posts.
- Páginas dinâmicas para conteúdo editorial.
- Páginas institucionais e de apps/produtos.
- Renderização de conteúdo Markdown com suporte a GFM, headings, sanitização e destaque de código.
- Recursos de SEO como sitemap, robots e JSON-LD.
- Integração com a API para consumo de conteúdo.

### API principal

- Autenticação com registro, login, refresh token, logout e endpoint de usuário autenticado.
- Gestão de usuários, papéis globais e papéis por aplicação.
- CMS para posts, categorias e tags.
- Newsletter com assinantes e rotina agendada.
- Uploads com storage compatível com S3.
- Health check.
- Módulo de sugestões com IA para itens de lista.
- Módulo de To-do colaborativo com guests, listas, membros, itens, convites, expiração e versionamento de itens.

### Trevvos Studio

- API FastAPI organizada por módulos de domínio.
- Dashboard Next.js dedicado ao Studio.
- Cadastro de tenants.
- Fluxo de onboarding estratégico.
- Gestão de brand kits e assets de marca.
- Pedidos de conteúdo.
- Rascunhos textuais e fluxo de aprovação.
- Radar de conteúdo com apoio de IA.
- Templates visuais, render specs e geração/renderização de assets.
- Integração configurável com OpenAI para conteúdo e recursos visuais.
- Diretórios estáticos para uploads e arquivos gerados.

### Ma.ia API

- API FastAPI separada para o produto Ma.ia.
- Rotas versionadas.
- Health check.
- Domínio inicial de couples.
- Configuração para validação de JWT emitido pela autenticação Trevvos.
- Migrations próprias com Alembic.

## Stack

### Monorepo e base

- pnpm workspaces
- TurboRepo
- TypeScript
- PostgreSQL
- Docker Compose

### Frontend

- Next.js 14
- React 18
- Tailwind CSS 4
- React Hook Form
- Zod
- Lucide React
- React Markdown
- Remark/Rehype

### Backend TypeScript

- NestJS 11
- Prisma 6
- Passport JWT
- bcrypt
- class-validator / class-transformer
- Swagger
- AWS SDK S3
- node-cron
- Jest

### Backend Python

- FastAPI
- SQLAlchemy async
- Alembic
- Pydantic Settings
- asyncpg
- OpenAI SDK
- Playwright
- Pillow
- pytest
- Ruff

## Arquitetura

```txt
.
├── apps
│   ├── api          # API principal NestJS + Prisma
│   ├── web          # Portal público Trevvos em Next.js
│   ├── studio-api   # Backend FastAPI do Trevvos Studio
│   ├── studio-web   # Dashboard Next.js do Trevvos Studio
│   └── maia-api     # Backend FastAPI do produto Ma.ia
├── packages
│   └── types        # Tipos compartilhados para apps TypeScript
├── docs             # Documentação de domínio, arquitetura e decisões
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

A arquitetura segue uma separação por aplicações e domínios. O portal web concentra a experiência pública, a API principal reúne recursos compartilhados da plataforma e os produtos com necessidades específicas são mantidos em serviços próprios.

No backend TypeScript, a API NestJS utiliza uma estrutura modular para autenticação, conteúdo, newsletter, uploads, IA e To-do colaborativo. No backend Python, as APIs FastAPI organizam domínios como Studio e Ma.ia em serviços independentes, com migrations e configurações próprias.

O pacote compartilhado `@trevvos/types` reforça a consistência entre aplicações TypeScript, enquanto o workspace com pnpm e TurboRepo facilita execução, manutenção e evolução coordenada do monorepo.

## Como rodar

### 1. Instale as dependências do workspace

```bash
pnpm install
```

### 2. Suba o banco local

```bash
docker compose up -d
```

### 3. Configure as variáveis de ambiente

Crie os arquivos `.env` necessários para cada aplicação. Para a API principal, use o exemplo versionado:

```bash
cp apps/api/.env.example apps/api/.env
```

### 4. Gere o Prisma Client e execute as migrations

```bash
pnpm db:gen
pnpm db:migrate
```

### 5. Rode as aplicações TypeScript

Para iniciar os apps com script `dev` no workspace:

```bash
pnpm dev
```

Ou execute aplicações específicas:

```bash
pnpm --filter @trevvos/api dev
pnpm --filter web dev
pnpm --filter @trevvos/studio-web dev
```

### 6. Rode as APIs Python

Studio API:

```bash
cd apps/studio-api
uv sync
uv run uvicorn app.main:app --reload --port 3350
```

Ma.ia API:

```bash
cd apps/maia-api
uv sync
uv run uvicorn app.main:app --reload --port 3340
```

## Configuração

Não exponha valores reais em repositórios públicos. Use secrets no ambiente de deploy e valores locais apenas nos arquivos `.env` não versionados.

### API principal (`apps/api`)

```env
DATABASE_URL=
DATABASE_URL_CONTROLLAR=
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
AUTH_ADMIN_EMAIL=
AUTH_ADMIN_PASSWORD=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
S3_PUBLIC_BASE_URL=
OPENAI_API_KEY=
```

### Portal web (`apps/web`)

```env
NEXT_PUBLIC_API_URL=
NEXT_API_BASE_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_SLUG=
NEXT_PUBLIC_ACCESS_COOKIE=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_EDIT_BASE=
NEXT_PUBLIC_WHATSAPP_TESTS_URL=
NEXT_PUBLIC_PODCAST_SPOTIFY_URL=
NEXT_PUBLIC_TODO_GOOGLEPLAY_PROD_URL=
NEXT_PUBLIC_TODO_YOUTUBE_URL=
```

### Studio API (`apps/studio-api`)

```env
STUDIO_ENV=
STUDIO_API_NAME=
STUDIO_API_VERSION=
STUDIO_API_PORT=
STUDIO_DB_SCHEMA=
STUDIO_DATABASE_URL=
STUDIO_GENERATED_ASSETS_DIR=
STUDIO_GENERATED_MOUNT_DIR=
STUDIO_UPLOADS_DIR=
STUDIO_OPENAI_API_KEY=
STUDIO_AI_MODEL=
STUDIO_IMAGE_MODEL=
STUDIO_ENABLE_AI_VISUAL=
```

### Studio Web (`apps/studio-web`)

```env
NEXT_PUBLIC_STUDIO_API_URL=
```

### Ma.ia API (`apps/maia-api`)

```env
MAIA_ENV=
MAIA_API_NAME=
MAIA_API_VERSION=
MAIA_API_PORT=
MAIA_DB_SCHEMA=
MAIA_DATABASE_URL=
TREVVOS_AUTH_ISSUER=
TREVVOS_AUTH_JWT_SECRET=
TREVVOS_AUTH_APP_SLUG=
```

## Decisões técnicas

### Monorepo com workspaces

O monorepo permite manter várias aplicações relacionadas no mesmo contexto técnico, compartilhando scripts, dependências e pacotes internos sem remover a autonomia de cada produto.

### Separação por domínio

A divisão entre `api`, `web`, `studio-api`, `studio-web` e `maia-api` mantém responsabilidades claras. A API principal concentra recursos de plataforma, enquanto Studio e Ma.ia evoluem como domínios próprios.

### NestJS para a API central

NestJS foi utilizado na API principal por sua estrutura modular, boa integração com TypeScript e aderência a padrões de backend como controllers, services, guards, decorators e validação de DTOs.

### Prisma e PostgreSQL

Prisma oferece uma camada tipada para modelagem e acesso ao banco, com migrations versionadas e integração direta com PostgreSQL.

### FastAPI para produtos com workflows específicos

FastAPI foi adotado nas APIs Python para domínios que se beneficiam de uma stack enxuta, com boa experiência para serviços assíncronos, IA, validação com Pydantic e organização modular.

### Contratos compartilhados

O pacote `@trevvos/types` centraliza tipos reutilizáveis entre aplicações TypeScript, reduzindo divergências de contrato e favorecendo consistência na integração entre frontend e backend.

## Status

O projeto está em evolução ativa como uma plataforma de portfólio com múltiplas aplicações funcionais e domínios bem definidos.

- **Portal e API principal:** base estruturada para conteúdo, autenticação e módulos de produto.
- **To-do colaborativo:** domínio modelado para listas, membros, guests, convites e itens versionados.
- **Trevvos Studio:** MVP operacional com backend, dashboard e fluxos de conteúdo apoiados por IA.
- **Ma.ia API:** backend dedicado para evolução independente do produto Ma.ia.

## Roadmap

- [ ] Publicar screenshots do portal, Studio e fluxos principais.
- [ ] Incluir diagramas visuais da arquitetura e dos fluxos de produto.
- [ ] Expandir a documentação de deploy por aplicação.
- [ ] Ampliar exemplos de configuração local para todos os apps.
- [ ] Evoluir a autenticação compartilhada entre produtos.
- [ ] Fortalecer observabilidade com logs estruturados, métricas e tracing.
- [ ] Expandir a cobertura de testes de integração para fluxos essenciais.
- [ ] Refinar experiências de dashboard e onboarding no Trevvos Studio.

## O que este projeto demonstra

Este projeto evidencia competências importantes para desenvolvimento de produtos digitais modernos:

- organização de monorepo com múltiplas aplicações;
- construção de frontend público com Next.js, SEO e conteúdo dinâmico;
- desenvolvimento de backend modular com NestJS;
- criação de APIs Python com FastAPI para domínios especializados;
- modelagem relacional com Prisma, SQLAlchemy e migrations;
- autenticação com JWT, refresh token e papéis por aplicação;
- integração com storage externo compatível com S3;
- uso de IA em fluxos de produto sem acoplar toda a plataforma a um único serviço;
- construção de dashboard operacional para workflows de conteúdo;
- separação clara entre plataforma, produto, domínio e interface;
- documentação técnica orientada a arquitetura e evolução de produto.

Trevvos mostra a capacidade de transformar uma visão de produto em uma base técnica organizada, escalável e preparada para evoluir com novas aplicações.
