from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.modules.ai_content.router import router as ai_content_router
from app.modules.brand_kits.router import router as brand_kits_router
from app.modules.content_drafts.router import router as content_drafts_router
from app.modules.content_requests.router import router as content_requests_router
from app.modules.onboarding.router import router as onboarding_router
from app.modules.render_specs.router import router as render_specs_router
from app.modules.tenants.router import router as tenants_router
from app.modules.visual_templates.router import router as visual_templates_router


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()
    project_root = Path(__file__).resolve().parents[1]
    generated_root = project_root / "generated"

    app = FastAPI(
        title=settings.api_name,
        version=settings.api_version,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Dev/MVP dashboard access from the Studio web app.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3010",
            "http://127.0.0.1:3010",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def healthcheck() -> dict[str, str]:
        return {
            "status": "ok",
            "service": "trevvos-studio-api",
        }

    app.include_router(tenants_router)
    app.include_router(onboarding_router)
    app.include_router(brand_kits_router)
    app.include_router(content_requests_router)
    app.include_router(content_drafts_router)
    app.include_router(visual_templates_router)
    app.include_router(render_specs_router)
    app.include_router(ai_content_router)
    app.mount("/generated", StaticFiles(directory=generated_root), name="generated")

    return app


app = create_app()
