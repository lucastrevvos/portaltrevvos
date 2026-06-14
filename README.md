# Trevvos

**Um monorepo de produtos digitais da Trevvos: portal editorial, API central, To-do colaborativo, Trevvos Studio e uma API dedicada ao produto Ma.ia.**

A Trevvos não é apenas uma landing page nem um backend isolado. Este repositório reúne uma base de produto em evolução: conteúdo público, autenticação, CMS, módulos de app, APIs em NestJS e FastAPI, dashboards em Next.js e domínios separados para experimentos com IA.

A proposta mais interessante do projeto está justamente nessa combinação: transformar uma marca de conteúdo e produtos em uma plataforma técnica capaz de sustentar novas frentes sem começar tudo do zero a cada ideia.

---

## Visão geral

O repositório funciona como um **workspace multi-app**. Ele concentra aplicações web, APIs, pacotes compartilhados, documentação técnica e migrações de banco em uma estrutura única.

Em termos práticos, o projeto cobre quatro frentes principais:

1. **Portal Trevvos** — site público em Next.js com conteúdo editorial, página de apps, SEO, feed de posts e integração com a API.
2. **API Trevvos** — backend NestJS com autenticação, posts, categorias, tags, newsletter, upload, sugestões de IA e módulo de listas colaborativas.
3. **Trevvos Studio** — MVP concierge para operação de conteúdo estratégico com IA, incluindo tenants, onboarding, brand kits, pedidos, drafts, assets, templates visuais e renderização.
4. **Ma.ia API** — backend FastAPI separado, com domínio próprio e integração prevista com autenticação Trevvos.

O resultado é um portfólio que mostra não só telas, mas também **modelagem de produto, separação de domínios, integração entre serviços e decisões reais de arquitetura**.

---

## O problema

Projetos digitais que começam pequenos costumam enfrentar o mesmo dilema: no início, tudo cabe em uma aplicação simples; depois, surgem novos produtos, novas áreas de negócio, integrações com IA, autenticação compartilhada, dados sensíveis, painéis internos e fluxos operacionais mais complexos.

Sem uma base bem organizada, cada nova iniciativa vira um sistema paralelo, com regras duplicadas, autenticação desconectada e pouca previsibilidade para evoluir.

Este repositório ataca esse problema de forma incremental: ele cria uma fundação técnica para que a Trevvos consiga publicar conteúdo, validar apps, operar produtos com IA e isolar domínios quando necessário.

---

## A solução

A solução adotada é um monorepo com aplicações especializadas, mas conectadas por uma visão comum de plataforma.

- O **portal web** consome conteúdo publicado pela API e apresenta a marca, os posts e os produtos em validação.
- A **API principal** centraliza autenticação, CMS e módulos de produto em NestJS com Prisma.
- O **Trevvos Studio** usa FastAPI e Next.js para um fluxo operacional próprio, mais próximo de um SaaS/concierge MVP.
- A **Ma.ia API** nasce separada para preservar o domínio do produto e permitir evolução independente.
- O pacote **`@trevvos/types`** indica uma preocupação com contratos compartilhados entre aplicações TypeScript.

Essa divisão evita que tudo vire um único backend genérico, mas também não fragmenta o projeto em repositórios sem contexto.

---

## Principais funcionalidades identificadas no código

### Portal e experiência pública

- Home editorial com destaque para conteúdo, IA aplicada e produtos da Trevvos.
- Listagem de posts publicados, hero editorial, feed incremental, categorias e tags.
- Páginas institucionais e páginas de apps/pilotos.
- SEO técnico com sitemap, robots, JSON-LD e páginas dinâmicas de post.
- Renderização de conteúdo Markdown com plugins para GFM, headings, sanitização e destaque de código.

### API principal Trevvos

- Autenticação com registro, login, refresh token, logout e endpoint `me`.
- Controle de usuários, papéis globais e papéis por app.
- CMS para posts, categorias e tags.
- Newsletter com assinantes e rotina agendada.
- Uploads com integração a storage compatível com S3.
- Health check.
- Módulo de sugestões de IA para itens de lista, com guarda de rate limit.
- Módulo To-do colaborativo com guests, listas, membros, itens, convites, expiração e controle de versão dos itens.

### Trevvos Studio

- API FastAPI com módulos por domínio.
- Dashboard Next.js dedicado ao Studio.
- Cadastro de tenants.
- Onboarding estratégico.
- Brand kits e assets de marca.
- Pedidos de conteúdo.
- Rascunhos textuais e fluxo de aprovação.
- Radar de conteúdo com apoio de IA.
- Templates visuais, render specs e geração/renderização de assets.
- Integração configurável com OpenAI para conteúdo e visual.
- Diretórios estáticos para uploads e arquivos gerados.

### Ma.ia API

- API FastAPI separada para o produto Ma.ia.
- Rotas versionadas.
- Health check.
- Domínio inicial de couples.
- Configuração para validação de JWT emitido pela autenticação Trevvos.
- Migrations próprias com Alembic.

---

## Stack utilizada

### Monorepo e base

- **pnpm workspaces**
- **TurboRepo**
- **TypeScript**
- **PostgreSQL**
- **Docker Compose** para banco local

### Frontend

- **Next.js 14**
- **React 18**
- **Tailwind CSS 4**
- **React Hook Form**
- **Zod**
- **Lucide React**
- **React Markdown + Remark/Rehype**

### Backend TypeScript

- **NestJS 11**
- **Prisma 6**
- **Passport JWT**
- **bcrypt**
- **class-validator / class-transformer**
- **Swagger**
- **AWS SDK S3**
- **node-cron**
- **Jest**

### Backend Python

- **FastAPI**
- **SQLAlchemy async**
- **Alembic**
- **Pydantic Settings**
- **asyncpg**
- **OpenAI SDK**
- **Playwright**
- **Pillow**
- **pytest**
- **Ruff**

---

## Arquitetura / estrutura do projeto

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

A organização sugere uma estratégia de plataforma: a API central resolve necessidades compartilhadas, enquanto produtos com domínio próprio podem evoluir em aplicações separadas.

---

## Decisões técnicas interessantes

### 1. Monorepo com domínios separados

A escolha por workspaces permite compartilhar contexto, scripts e tipos, mas cada aplicação mantém sua responsabilidade. Isso aparece especialmente na separação entre `api`, `web`, `studio-api`, `studio-web` e `maia-api`.

### 2. Backend principal em NestJS

A API principal usa uma estrutura modular típica de NestJS. Autenticação, posts, tags, categorias, newsletter, uploads, IA e To-do aparecem como módulos separados, o que facilita manutenção e expansão.

### 3. Prisma com schemas PostgreSQL isolados

O schema principal usa `public` para autenticação/CMS e `trevvos_todo` para o módulo de listas colaborativas. Essa separação deixa claro que o To-do é um domínio próprio, mesmo dentro do mesmo banco.

### 4. FastAPI para produtos e operações específicas

Studio e Ma.ia foram criados como APIs Python independentes. Essa decisão faz sentido para produtos com forte presença de IA, workflows próprios ou necessidade de iteração rápida fora do ciclo do backend principal.

### 5. Trevvos Studio modelado como fluxo operacional

O Studio não se limita a “gerar conteúdo com IA”. O código e a documentação apontam para um fluxo com tenant, onboarding, brand kit, pedido, draft, aprovação, template visual, render spec e asset final. Isso demonstra visão de processo, não apenas chamada de API.

### 6. Preparação para autenticação compartilhada

O modelo de usuários, apps, papéis por app e JWT aponta para uma base de SSO interno. A Ma.ia API também já possui configurações para validar tokens emitidos pela autenticação Trevvos.

### 7. Produto real em vez de demo isolada

Há sinais de produto em produção ou validação: página de apps, app To-do publicado, piloto KM One, newsletter, conteúdo editorial, Studio e documentação de arquitetura. Isso torna o repositório uma peça de portfólio mais forte do que um CRUD isolado.

---

## Como rodar localmente

> Os comandos abaixo descrevem o fluxo provável com base nos scripts existentes. Alguns passos podem exigir ajustes conforme o ambiente local e as variáveis disponíveis.

### 1. Instale as dependências do workspace

```bash
pnpm install
```

### 2. Suba o banco local

```bash
docker compose up -d
```

### 3. Configure as variáveis de ambiente

Crie os arquivos `.env` necessários a partir dos exemplos e das variáveis listadas abaixo.

Para a API principal:

```bash
cp apps/api/.env.example apps/api/.env
```

### 4. Gere o Prisma Client e rode migrations

```bash
pnpm db:gen
pnpm db:migrate
```

### 5. Rode as aplicações TypeScript

Para iniciar tudo que possui script `dev` no workspace:

```bash
pnpm dev
```

Ou rode cada app separadamente:

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

---

## Variáveis de ambiente necessárias

> Não inclua valores reais em repositórios públicos. Use apenas exemplos locais e secrets no ambiente de deploy.

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

As configurações usam prefixo `STUDIO_`.

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

As configurações usam prefixo `MAIA_`, com algumas chaves de autenticação Trevvos por alias explícito.

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

---

## Status atual do projeto

O projeto parece estar em **evolução ativa**, com partes em estágios diferentes de maturidade:

- **Portal e API principal:** base funcional de conteúdo, autenticação e módulos de produto.
- **To-do colaborativo:** domínio modelado com guests, listas, itens, membros e convites.
- **Trevvos Studio:** MVP estruturado com backend, dashboard, testes e documentação de domínio.
- **Ma.ia API:** base inicial de produto com domínio próprio e integração planejada com autenticação Trevvos.

Alguns pontos ainda precisam ser confirmados antes de apresentar o projeto como “pronto para produção” em todos os módulos, especialmente autenticação final entre apps, deploy completo, observabilidade e políticas de segurança por ambiente.

---

## Roadmap

Itens sugeridos a partir do que já existe no código:

- [ ] Documentar o fluxo completo de deploy de cada app.
- [ ] Adicionar `.env.example` para `web`, `studio-api`, `studio-web` e `maia-api`.
- [ ] Consolidar uma estratégia de autenticação compartilhada entre todos os produtos.
- [ ] Melhorar observabilidade com logs estruturados, métricas e tracing.
- [ ] Incluir screenshots reais do portal, Studio e fluxos principais.
- [ ] Adicionar diagramas de arquitetura e sequência para os fluxos mais relevantes.
- [ ] Definir política de permissões por app e por tenant.
- [ ] Confirmar e documentar o status de produção de cada módulo.
- [ ] Criar uma suíte de testes de integração cobrindo os principais fluxos de produto.
- [ ] Revisar arquivos gerados/versionados e separar melhor o que deve ou não ir para o repositório público.

---

## O que este projeto demonstra tecnicamente

Este repositório é relevante como portfólio porque mostra decisões que aparecem em produtos reais:

- desenho de monorepo com múltiplas aplicações;
- backend modular em NestJS;
- APIs Python com FastAPI para domínios específicos;
- modelagem relacional com Prisma e SQLAlchemy;
- migrations versionadas;
- autenticação com JWT e refresh token;
- separação de papéis globais e papéis por aplicação;
- integração com storage externo;
- integração com IA sem acoplar toda a plataforma a um único fluxo;
- frontend público com SEO, conteúdo dinâmico e páginas de produto;
- dashboard operacional para workflows internos;
- documentação de arquitetura e domínio;
- preocupação com evolução incremental de produto.

Mais do que uma coleção de tecnologias, o projeto mostra uma capacidade importante para times de produto: **organizar complexidade sem perder velocidade de entrega**.

---

## Prints, GIFs ou imagens sugeridas

Para deixar este repositório ainda mais forte no GitHub, vale adicionar uma pasta como `docs/assets` com:

- screenshot da home do portal Trevvos;
- screenshot da página de apps;
- screenshot do dashboard do Trevvos Studio;
- GIF curto criando um pedido de conteúdo no Studio;
- diagrama simples do monorepo;
- diagrama do fluxo `tenant → request → draft → approval → render`;
- imagem do app To-do List Trevvos em uso.

Esses materiais ajudam recrutadores e tech leads a entender rapidamente que o projeto tem produto, domínio e interface — não apenas código.

---

## Observações finais

A Trevvos é uma boa peça de portfólio porque combina visão de produto com engenharia aplicada. O código mostra um ecossistema em construção: há conteúdo, apps, IA, autenticação, operações internas, módulos independentes e documentação de domínio.

O ponto forte não está em fingir que tudo está finalizado. Está em mostrar uma base técnica realista, com decisões claras e espaço para evolução. Para avaliação profissional, isso comunica maturidade: entender o problema, modularizar a solução e construir uma plataforma que pode crescer sem perder o controle.
