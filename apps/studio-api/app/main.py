from pathlib import Path
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.modules.ai_content.router import router as ai_content_router
from app.modules.ai_visual.router import router as ai_visual_router
from app.modules.brand_assets.router import router as brand_assets_router
from app.modules.brand_kits.router import router as brand_kits_router
from app.modules.content_drafts.router import router as content_drafts_router
from app.modules.content_radar.router import router as content_radar_router
from app.modules.content_requests.router import router as content_requests_router
from app.modules.onboarding.router import router as onboarding_router
from app.modules.render_specs.router import router as render_specs_router
from app.modules.tenants.router import router as tenants_router
from app.modules.visual_templates.router import router as visual_templates_router

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()
    project_root = Path(__file__).resolve().parents[1]
    generated_base = Path(settings.generated_assets_dir)
    generated_mount_base = Path(settings.generated_mount_dir)
    uploads_base = Path(settings.uploads_dir)
    generated_storage_root = (
        generated_base
        if generated_base.is_absolute()
        else project_root / generated_base
    )
    generated_mount_root = (
        generated_mount_base
        if generated_mount_base.is_absolute()
        else project_root / generated_mount_base
    )
    uploads_root = (
        uploads_base if uploads_base.is_absolute() else project_root / uploads_base
    )
    generated_storage_root.mkdir(parents=True, exist_ok=True)
    generated_mount_root.mkdir(parents=True, exist_ok=True)
    uploads_root.mkdir(parents=True, exist_ok=True)
    logger.info(
        "Studio static directories configured: generated_mount_root=%s generated_storage_root=%s uploads_root=%s",
        generated_mount_root,
        generated_storage_root,
        uploads_root,
    )

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
    app.include_router(content_radar_router)
    app.include_router(brand_assets_router)
    app.include_router(visual_templates_router)
    app.include_router(render_specs_router)
    app.include_router(ai_content_router)
    app.include_router(ai_visual_router)
    app.mount(
        "/generated",
        StaticFiles(directory=generated_mount_root),
        name="generated",
    )
    app.mount("/uploads", StaticFiles(directory=uploads_root), name="uploads")

    return app


app = create_app()
