from fastapi import FastAPI

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.modules.brand_kits.router import router as brand_kits_router
from app.modules.content_drafts.router import router as content_drafts_router
from app.modules.content_requests.router import router as content_requests_router
from app.modules.onboarding.router import router as onboarding_router
from app.modules.tenants.router import router as tenants_router


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()

    app = FastAPI(
        title=settings.api_name,
        version=settings.api_version,
        docs_url="/docs",
        redoc_url="/redoc",
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

    return app


app = create_app()
