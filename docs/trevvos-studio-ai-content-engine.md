# Trevvos Studio AI Content Engine

## Objetivo

Validar o primeiro motor textual do Trevvos Studio no fluxo real do Concierge
MVP, sem substituir a revisao humana.

## Escopo atual

- gerar ideias de conteudo por tenant
- gerar draft textual com IA para `content_request`
- gerar slides de carrossel
- gerar legenda, comentario fixado e sugestao de stories
- aplicar regras globais de seguranca
- aplicar regras de nicho para `nutrition`
- rodar quality check deterministico
- manter o draft editavel na UI

## Variaveis de ambiente

No `apps/studio-api/.env`:

```env
STUDIO_OPENAI_API_KEY=
STUDIO_AI_MODEL=gpt-4.1-mini
```

## Endpoints

- `POST /tenants/{tenant_id}/ai/content-ideas`
- `POST /tenants/{tenant_id}/content-requests/{request_id}/ai/generate-draft`
- `POST /tenants/{tenant_id}/content-requests/{request_id}/ai/check-draft-quality`

## Regras globais

- nao prometer resultado garantido
- nao inventar credenciais, precos, depoimentos ou numeros nao informados
- nao fazer diagnostico ou prescricao individual
- nao usar sensacionalismo ou garantias absolutas
- preservar portugues/UTF-8 no conteudo final

## Regras de nutricao

- nao prescrever dieta individualizada em conteudo publico
- nao prometer emagrecimento, hipertrofia, cura ou desempenho garantido
- nao demonizar alimentos
- nao tratar suplemento como regra universal
- usar linguagem educativa e contextual

## Quality check

O quality check atual e deterministico. Ele:

- procura termos de risco no draft
- eleva `risk_level` para `medium` ou `high` conforme a gravidade
- gera `warnings`
- gera `suggested_changes`
- devolve um score basico de clareza, autoridade, niche fit, brand voice e
  potencial de conversao

## Testar sem chave real

Os testes backend usam provider fake via monkeypatch e nao chamam a OpenAI.

```powershell
cd apps\studio-api
uv run pytest -q
```

Coberturas principais:

- onboarding obrigatorio
- UTF-8 preservado no draft gerado
- bloqueio de overwrite para draft aprovado
- detection de termos de risco
- geracao de slides para carrossel

## Testar com IA real

1. Configure `STUDIO_OPENAI_API_KEY` no `apps/studio-api/.env`.
2. Suba o backend:

```powershell
cd apps\studio-api
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3350
```

3. Suba o frontend:

```powershell
cd apps\studio-web
pnpm dev
```

4. Abra `http://localhost:3010/app`.
5. No detalhe do pedido, use a secao `IA de Conteudo`.
6. Gere o draft com IA.
7. Revise, rode o quality check e edite manualmente se necessario.
8. Submeta o texto e siga o fluxo normal de aprovacao, specs e render.

## Limitacoes atuais

- sem reviewer com IA separado
- sem versionamento de draft aprovado
- sem persistencia de ideias no banco
- sem publicacao automatica
- sem geracao de imagem com IA
