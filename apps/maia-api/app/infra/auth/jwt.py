from typing import Any

import jwt
from pydantic import BaseModel, Field

from app.core.config import Settings

ALLOWED_APP_ROLES = frozenset({"OWNER", "ADMIN", "EDITOR", "AUTHOR", "READER"})


class TrevvosAuthError(Exception):
    detail = "Token Trevvos invalido."


class MissingTokenError(TrevvosAuthError):
    detail = "Token de autenticacao ausente."


class ExpiredTokenError(TrevvosAuthError):
    detail = "Token de autenticacao expirado."


class InvalidTokenError(TrevvosAuthError):
    detail = "Token de autenticacao invalido."


class AppAccessDeniedError(TrevvosAuthError):
    detail = "Token sem acesso ao app Ma.ia."


class AuthConfigurationError(TrevvosAuthError):
    detail = "Configuracao de autenticacao Trevvos ausente."


class CurrentUser(BaseModel):
    id: str
    email: str | None = None
    global_role: str
    app_role: str
    raw_claims: dict[str, Any] = Field(default_factory=dict)


def validate_trevvos_jwt(token: str | None, settings: Settings) -> CurrentUser:
    if not token:
        raise MissingTokenError

    if not settings.trevvos_auth_jwt_secret:
        raise AuthConfigurationError

    try:
        claims = jwt.decode(
            token,
            settings.trevvos_auth_jwt_secret,
            algorithms=["HS256"],
            issuer=settings.trevvos_auth_issuer,
            options={"require": ["exp", "sub"]},
        )
    except jwt.ExpiredSignatureError as exc:
        raise ExpiredTokenError from exc
    except jwt.InvalidTokenError as exc:
        raise InvalidTokenError from exc

    subject = claims.get("sub")
    if not isinstance(subject, str) or not subject.strip():
        raise InvalidTokenError

    apps = claims.get("apps")
    if not isinstance(apps, dict):
        raise AppAccessDeniedError

    app_role = apps.get(settings.trevvos_auth_app_slug)
    if not isinstance(app_role, str):
        raise AppAccessDeniedError

    if app_role not in ALLOWED_APP_ROLES:
        raise AppAccessDeniedError

    global_role = claims.get("globalRole")
    if not isinstance(global_role, str):
        global_role = ""

    email = claims.get("email")
    if not isinstance(email, str):
        email = None

    return CurrentUser(
        id=subject,
        email=email,
        global_role=global_role,
        app_role=app_role,
        raw_claims=claims,
    )
