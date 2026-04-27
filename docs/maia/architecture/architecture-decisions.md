# Ma.ia - Decisoes de Arquitetura

## Contexto

O monorepo Trevvos hoje usa pnpm workspaces e Turbo, com apps em `apps/*` e pacotes compartilhados em `packages/*`. A API principal fica em `apps/api`, usa NestJS, Prisma e Postgres. O frontend web fica em `apps/web`, usando Next.js. Tipos TypeScript compartilhados ficam em `packages/types`.

Ma.ia deve entrar no monorepo como um produto novo, com backend e mobile proprios, sem acoplar seu dominio aos produtos existentes.

## Decisao: criar `apps/maia-api` em Python/FastAPI

Quando a implementacao comecar, a API do Ma.ia deve viver em `apps/maia-api`.

Motivos:

- mantem consistencia com a convencao atual de apps em `apps/*`;
- permite backend dedicado ao produto;
- FastAPI e adequado para APIs HTTP, OpenAPI nativo e integracoes futuras com IA;
- Python reduz atrito para bibliotecas de IA, processamento de texto, embeddings e pipelines futuros.

Essa decisao adiciona um segundo ecossistema de runtime ao monorepo, entao a API Python deve ter configuracao propria de dependencias, testes, formatacao e deploy.

## Decisao: criar `apps/maia-mobile` em React Native/Expo

Quando a implementacao comecar, o app mobile do Ma.ia deve viver em `apps/maia-mobile`.

Motivos:

- segue o padrao de apps do monorepo;
- Expo acelera validacao mobile;
- React Native permite compartilhar conhecimento de React/TypeScript ja usado no repo;
- o app pode consumir pacotes TypeScript futuros sem misturar dominio com o backend Python.

O mobile deve se comunicar com `maia-api` por HTTP, usando contratos explicitos.

## Decisao: reaproveitar identidade/autenticacao da API principal Trevvos

A API principal ja possui uma base de identidade com `User`, `App`, `UserAppRole`, `Session`, `ApiKey` e JWT com roles por app.

Ma.ia deve reaproveitar essa identidade sempre que possivel:

- registrar um app com slug `maia`;
- usar `UserAppRole` para permissoes especificas do produto;
- validar tokens com issuer e claims compativeis;
- usar `apps.maia` no payload para autorizacao.

Ma.ia nao deve assumir que todas as regras de negocio da API principal se aplicam ao seu dominio. A identidade pode ser compartilhada, mas o dominio deve permanecer separado.

## Decisao: isolar dominio do Ma.ia em schema proprio

Os dados do Ma.ia devem ficar em schema ou database proprio, por exemplo `maia`.

Motivos:

- evita misturar tabelas do Ma.ia com blog, todo, newsletter ou Controllar;
- permite migracoes independentes;
- reduz risco de acoplamento com Prisma;
- facilita evolucao futura para outro banco, servico ou estrategia de armazenamento.

Se o mesmo Postgres for usado, o isolamento minimo recomendado e um schema dedicado e uma variavel `MAIA_DATABASE_URL` ou equivalente.

## Decisao: nao importar codigo NestJS/Prisma dentro do FastAPI

`maia-api` nao deve importar codigo de `apps/api`, Prisma Client, services NestJS ou modules internos da API principal.

Motivos:

- evita acoplamento entre runtimes;
- impede dependencia circular entre produtos;
- preserva autonomia de deploy;
- deixa claro que autenticacao compartilhada acontece por contrato, nao por importacao de implementacao.

Compartilhamento deve acontecer por:

- tokens JWT;
- endpoints HTTP estaveis;
- OpenAPI;
- tipos ou clientes gerados;
- configuracao de ambiente bem documentada.

## Riscos Tecnicos

- Dois ecossistemas no mesmo monorepo: Node/pnpm/Turbo e Python.
- CI/CD mais complexo, com instalacao, cache e testes separados.
- Possivel duplicacao de logica de autenticacao se os contratos nao forem bem definidos.
- Risco de segredo compartilhado em HS256 entre NestJS e FastAPI.
- Migracoes concorrentes se Prisma e Alembic apontarem para os mesmos schemas.
- Divergencia de tipos entre API Python e app TypeScript.
- Aumento de superficie operacional: observabilidade, logs, deploy e variaveis por servico.
- Custos e limites de provedores de IA quando a integracao for adicionada.

## Decisoes Futuras

- JWKS: avaliar migracao para validacao de JWT por chave publica.
- Assinatura: considerar tokens RS256/ES256 para evitar segredo simetrico compartilhado.
- IA: definir provedor inicial, estrategia de prompts, limites, fallback e auditoria.
- Filas: avaliar jobs assincronos para tarefas demoradas, chamadas de IA e processamento de contexto.
- Observabilidade: padronizar logs estruturados, traces, metricas e correlacao por request.
- Contratos: decidir entre cliente TypeScript gerado por OpenAPI ou pacote manual.
- Banco: confirmar se Ma.ia usara schema dedicado no Postgres atual ou database separado.
- Seguranca mobile: definir armazenamento seguro de access token e refresh token no Expo.
