# Trevvos Studio Dashboard Preview

## Objetivo

Transformar o fluxo já validado no `studio-api` em uma experiência visual no
`studio-web`, permitindo operar o Concierge MVP sem depender de `curl`.

## Rotas criadas

- `/app`
- `/app/tenants`
- `/app/tenants/new`
- `/app/tenants/[tenantId]`
- `/app/tenants/[tenantId]/onboarding`
- `/app/tenants/[tenantId]/brand-kit`
- `/app/tenants/[tenantId]/visual-templates/new`
- `/app/tenants/[tenantId]/requests/new`
- `/app/tenants/[tenantId]/requests/[requestId]`
- `/app/tenants/[tenantId]/requests/[requestId]/draft`

## Variável de ambiente

No frontend:

```env
NEXT_PUBLIC_STUDIO_API_URL=http://localhost:3350
```

Arquivo de exemplo:

```txt
apps/studio-web/.env.example
```

## Como rodar o backend

```powershell
cd apps\studio-api
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3350
```

Observações:

- o backend serve assets estáticos em `/generated` para o modo dev/MVP
- CORS local foi liberado para `http://localhost:3010` e `http://127.0.0.1:3010`

## Como rodar o frontend

```powershell
cd apps\studio-web
pnpm dev
```

Ou:

```powershell
pnpm --filter @trevvos/studio-web dev
```

## Como acessar o preview

Abra:

```txt
http://localhost:3010/app
```

## O que a tela do pedido mostra

- cabeçalho do request com título, tema, formato, objetivo, CTA e status
- trilha visual das etapas do workflow
- draft textual com slides ordenados
- render specs com status e resumo de conteúdo
- ações para submissão textual, aprovação, geração de specs e renderização
- grid com preview dos PNGs e link direto para o asset

## Operação pela UI

Fluxo manual esperado:

1. abrir `/app/tenants/new`
2. criar um tenant
3. abrir `/app/tenants/{tenantId}/onboarding`
4. preencher o onboarding estratégico
5. abrir `/app/tenants/{tenantId}/brand-kit`
6. preencher o brand kit
7. abrir `/app/tenants/{tenantId}/visual-templates/new`
8. usar o atalho do template Técnico Editorial ou criar um template manualmente
9. abrir `/app/tenants/{tenantId}/requests/new`
10. criar um content request
11. abrir `/app/tenants/{tenantId}/requests/{requestId}/draft`
12. criar ou editar o draft textual, incluindo slides para carrossel
13. voltar ao detalhe do pedido e usar `Submeter texto para aprovação`
14. usar `Aprovar texto`
15. selecionar um template visual e usar `Gerar Render Specs`
16. usar `Renderizar imagens`
17. validar os PNGs no grid e abrir o asset em nova aba

## Limitações da versão atual

- sem autenticação
- sem permissões por papel
- sem upload real
- sem edição visual avançada
- sem storage remoto
- modo dev/admin temporário
