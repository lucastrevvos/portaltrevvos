# Trevvos Studio Web

Dashboard web do Concierge MVP do Trevvos Studio.

## Variavel de ambiente

Crie um `.env.local` a partir do exemplo:

```powershell
cd apps\studio-web
copy .env.example .env.local
```

Valor esperado:

```env
NEXT_PUBLIC_STUDIO_API_URL=http://localhost:3350
```

## Rodar com o backend

Backend:

```powershell
cd apps\studio-api
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3350
```

Frontend:

```powershell
cd apps\studio-web
pnpm dev
```

Abra:

```txt
http://localhost:3010/app
```

## Escopo atual

- visao geral do dashboard
- criacao de tenant
- criacao e edicao de onboarding
- criacao e edicao de brand kit
- upload e gestao de brand assets
- criacao de content request
- criacao e edicao de draft textual com slides
- submissao e aprovacao textual pela UI
- criacao e edicao de visual template
- listagem de templates visuais no tenant
- timeline operacional do pedido
- geracao de draft textual com IA
- quality check do draft com guardrails
- geracao de fundos visuais com IA
- render hibrido com fundo de IA e logo real do cliente
- geracao de render specs
- renderizacao de imagens
- preview de PNGs servidos pelo `studio-api` em `/generated`

## Fluxo manual sugerido

1. criar tenant em `/app/tenants/new`
2. preencher onboarding
3. preencher brand kit
4. abrir `/app/tenants/{tenantId}/assets` e enviar logo/fotos/referencias
5. criar ou editar template visual
6. criar request
7. opcionalmente gerar draft com IA no detalhe do pedido
8. revisar ou editar o draft textual
9. rodar quality check
10. usar o Radar de Conteudo para gerar novos pedidos quando faltar tema
11. submeter e aprovar texto
12. revisar a timeline operacional
13. gerar fundos de IA visual e renderizar com o logo real
14. gerar specs simples e renderizar imagens
15. validar assets no grid

## Operacao visual

- a rota `/app/tenants/[tenantId]/assets` centraliza upload, preview e gestao de logo, foto principal e referencias
- o detalhe do tenant mostra o estado do acervo de marca com atalho para a biblioteca
- o detalhe do pedido mostra a secao `IA Visual` com geracao de fundos e render hibrido
- o detalhe do tenant mostra o card `Radar de Conteudo` com atalho para sugestoes
- se o tenant nao tiver logo principal, o renderer segue funcionando sem logotipo
- `simple` usa a composicao completa do template; `ai_visual` usa o fundo da IA
  como base unica e remove notas internas no export final
- a rota `/app/tenants/[tenantId]/content-radar` gera sugestoes estrategicas e
  permite criar `ContentRequest` a partir delas

## Limitacoes atuais

- sem autenticacao
- sem permissoes por papel
- sem upload real
- sem editor visual avancado
- sem tela dedicada de ideias com IA nesta fase
- sem `template padrao` persistido no backend
- storage local apenas para modo dev/MVP
- frontend usa `NEXT_PUBLIC_STUDIO_API_URL`
- `distDir` do Next configurado como `.next-build`
