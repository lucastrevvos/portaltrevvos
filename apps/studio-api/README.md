# Trevvos Studio API

Bootstrap inicial do backend FastAPI do Trevvos Studio.

## Rodar localmente

```powershell
cd apps\studio-api
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 3350
```

## Endpoint inicial

- `GET /health`
