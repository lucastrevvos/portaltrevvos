from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_app_settings, get_current_maia_user
from app.core.config import Settings
from app.infra.auth.jwt import CurrentUser

router = APIRouter(tags=["me"])
AppSettings = Annotated[Settings, Depends(get_app_settings)]
MaiaUser = Annotated[CurrentUser, Depends(get_current_maia_user)]


@router.get("/me")
def me(current_user: MaiaUser, settings: AppSettings) -> dict[str, object]:
    return {
        "id": current_user.id,
        "email": current_user.email,
        "global_role": current_user.global_role,
        "app_role": current_user.app_role,
        "app_slug": settings.trevvos_auth_app_slug,
    }
