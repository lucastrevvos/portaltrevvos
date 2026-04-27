from fastapi import APIRouter

from app.api.v1.router import v1_router
from app.core.config import get_settings

api_router = APIRouter()


@api_router.get("/health")
def health() -> dict[str, str]:
    settings = get_settings()
    return {
        "status": "ok",
        "service": settings.api_name,
        "version": settings.api_version,
    }


api_router.include_router(v1_router, prefix="/v1")
