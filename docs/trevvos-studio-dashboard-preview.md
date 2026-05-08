# Trevvos Studio Dashboard Preview

## Objetivo

Transformar o fluxo validado no `studio-api` em uma experiencia visual no
`studio-web`, permitindo operar o Concierge MVP sem depender de `curl`.

## Rotas criadas

- `/app`
- `/app/tenants`
- `/app/tenants/new`
- `/app/tenants/[tenantId]`
- `/app/tenants/[tenantId]/assets`
- `/app/tenants/[tenantId]/onboarding`
- `/app/tenants/[tenantId]/brand-kit`
- `/app/tenants/[tenantId]/visual-templates/new`
- `/app/tenants/[tenantId]/visual-templates/[templateId]`
- `/app/tenants/[tenantId]/requests/new`
- `/app/tenants/[tenantId]/requests/[requestId]`
- `/app/tenants/[tenantId]/requests/[requestId]/draft`
- `/app/tenants/[tenantId]/content-radar`

## Variavel de ambiente

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

Observacoes:

- o backend serve assets estaticos em `/generated` para o modo dev/MVP
- CORS local foi liberado para `http://localhost:3010` e
  `http://127.0.0.1:3010`

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

- cabecalho do request com titulo, tema, formato, objetivo, CTA e status
- trilha visual das etapas do workflow
- secao de IA de conteudo para gerar draft e rodar quality check
- secao de IA visual para gerar fundos e render hibrido
- draft textual com slides ordenados
- render specs com status e resumo de conteudo
- timeline operacional baseada em `approval_events`
- acoes para submissao textual, aprovacao, geracao de specs e renderizacao
- grid com preview dos PNGs e link direto para o asset
- biblioteca de brand assets com upload, preview e marcacao de principal

## Operacao pela UI

Fluxo manual esperado:

1. abrir `/app/tenants/new`
2. criar um tenant
3. abrir `/app/tenants/{tenantId}/onboarding`
4. preencher o onboarding estrategico
5. abrir `/app/tenants/{tenantId}/brand-kit`
6. preencher o brand kit
7. abrir `/app/tenants/{tenantId}/assets`
8. enviar logo, foto principal e referencias visuais
9. abrir `/app/tenants/{tenantId}/visual-templates/new`
10. usar o atalho do template Tecnico Editorial ou criar um template manualmente
11. abrir `/app/tenants/{tenantId}/requests/new`
12. criar um content request
13. abrir `/app/tenants/{tenantId}/requests/{requestId}`
14. usar `Gerar draft com IA` ou criar/editar o draft manualmente
15. rodar `Verificar qualidade do draft`
16. revisar o draft e ajustar se necessario
17. usar `Submeter texto para aprovacao`
18. usar `Aprovar texto`
19. selecionar um template visual e usar `Gerar Render Specs`
20. usar `Gerar fundos com IA`
21. usar `Renderizar com IA visual`
22. validar os PNGs no grid e abrir o asset em nova aba

## Timeline operacional

- os eventos sao carregados do endpoint real `GET /approval-events`
- a UI exibe os eventos em ordem cronologica reversa
- cada item mostra tipo do evento, ator, comentario, data/hora e transicao de
  status quando existir
- se nao houver eventos, a interface mostra
  `Nenhum evento operacional registrado ainda.`

## Templates visuais

- o detalhe do tenant lista templates visuais com nome, categoria, descricao,
  status, cores e tamanho
- templates ativos sao destacados na UI
- templates editaveis do tenant exibem botao `Editar`
- o detalhe do pedido pre-seleciona `visual_template_id` quando existir
- se houver apenas um template ativo, ele e pre-selecionado automaticamente
- `template padrao por tenant` ainda nao foi modelado no backend; o destaque de
  ativo e o comportamento MVP atual

## IA de conteudo

- a UI chama o backend real; a chave OpenAI nunca vai para o frontend
- o draft gerado por IA continua editavel e nao e aprovado automaticamente
- se o pedido ja tiver draft aberto, a UI oferece `Sobrescrever com IA`
- se o draft estiver aprovado, a sobrescrita fica bloqueada
- o quality check atual e deterministico e mostra risco, alertas e sugestoes
- no render final `ai_visual`, o fundo da IA vira a base unica e o renderer
  exporta apenas a camada editorial, sem notas internas ou caixas de preview

## Radar de Conteudo

- a rota `/app/tenants/[tenantId]/content-radar` gera sugestoes estrategicas
- o radar usa tenant, onboarding, brand kit e pedidos recentes
- nesta versao nao ha pesquisa web, trends reais ou concorrentes
- cada sugestao pode virar um novo `ContentRequest` pre-preenchido

## Limitacoes da versao atual

- sem autenticacao
- sem permissoes por papel
- sem editor visual avancado
- sem tela dedicada de ideias com IA nesta fase
- sem `is_default` por tenant no backend
- sem storage remoto
- sem editor visual de backgrounds por slide
- modo dev/admin temporario
