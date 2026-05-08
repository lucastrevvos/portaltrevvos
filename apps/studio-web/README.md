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
- criacao de content request
- criacao e edicao de draft textual com slides
- submissao e aprovacao textual pela UI
- criacao e edicao de visual template
- listagem de templates visuais no tenant
- timeline operacional do pedido
- geracao de draft textual com IA
- quality check do draft com guardrails
- geracao de render specs
- renderizacao de imagens
- preview de PNGs servidos pelo `studio-api` em `/generated`

## Fluxo manual sugerido

1. criar tenant em `/app/tenants/new`
2. preencher onboarding
3. preencher brand kit
4. criar ou editar template visual
5. criar request
6. opcionalmente gerar draft com IA no detalhe do pedido
7. revisar ou editar o draft textual
8. rodar quality check
9. submeter e aprovar texto
10. revisar a timeline operacional
11. gerar specs
12. renderizar imagens
13. validar assets no grid

## Limitacoes atuais

- sem autenticacao
- sem permissoes por papel
- sem upload real
- sem editor visual avancado
- sem tela dedicada de ideias com IA nesta fase
- sem `template padrao` persistido no backend
- storage local apenas para modo dev/MVP
- `distDir` do Next configurado como `.next-build`
