# Trevvos Studio Web

Dashboard web do Concierge MVP do Trevvos Studio.

## Variável de ambiente

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

- visão geral do dashboard
- criação de tenant
- criação e edição de onboarding
- criação e edição de brand kit
- criação de content request
- criação e edição de draft textual com slides
- submissão e aprovação textual pela UI
- criação de visual template
- geração de render specs
- renderização de imagens
- preview de PNGs servidos pelo `studio-api` em `/generated`

## Fluxo manual sugerido

1. criar tenant em `/app/tenants/new`
2. preencher onboarding
3. preencher brand kit
4. criar template visual
5. criar request
6. criar draft textual
7. submeter e aprovar texto
8. gerar specs
9. renderizar imagens
10. validar assets no grid

## Limitações atuais

- sem autenticação
- sem permissões por papel
- sem upload real
- sem edição visual avançada
- storage local apenas para modo dev/MVP
- `distDir` do Next configurado como `.next-build`
