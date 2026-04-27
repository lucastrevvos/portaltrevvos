from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_app_settings
from app.core.config import Settings
from app.core.security import describe_auth_strategy

router = APIRouter(tags=["me"])
AppSettings = Annotated[Settings, Depends(get_app_settings)]


@router.get("/me")
def me(settings: AppSettings) -> dict[str, object]:
    return {
        "message": "A autenticacao Trevvos sera implementada depois.",
        "auth": describe_auth_strategy(settings),
    }
