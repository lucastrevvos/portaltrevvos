from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
import pytest

from app.core.config import Settings
from app.infra.auth.jwt import (
    AppAccessDeniedError,
    CurrentUser,
    ExpiredTokenError,
    InvalidTokenError,
    validate_trevvos_jwt,
)

TEST_SECRET = "test-secret-with-at-least-32-bytes"


def make_settings() -> Settings:
    return Settings(trevvos_auth_jwt_secret=TEST_SECRET)


def make_token(
    claims_overrides: dict[str, Any] | None = None,
    secret: str = TEST_SECRET,
) -> str:
    claims: dict[str, Any] = {
        "sub": "user-123",
        "email": "user@example.com",
        "globalRole": "USER",
        "apps": {"maia": "READER"},
        "iss": "trevvos-auth",
        "iat": datetime.now(UTC),
        "exp": datetime.now(UTC) + timedelta(minutes=15),
    }
    if claims_overrides:
        claims.update(claims_overrides)

    return jwt.encode(claims, secret, algorithm="HS256")


def test_validate_trevvos_jwt_accepts_valid_token() -> None:
    current_user = validate_trevvos_jwt(make_token(), make_settings())

    assert isinstance(current_user, CurrentUser)
    assert current_user.id == "user-123"
    assert current_user.email == "user@example.com"
    assert current_user.global_role == "USER"
    assert current_user.app_role == "READER"
    assert current_user.raw_claims["sub"] == "user-123"


def test_validate_trevvos_jwt_rejects_expired_token() -> None:
    token = make_token({"exp": datetime.now(UTC) - timedelta(seconds=1)})

    with pytest.raises(ExpiredTokenError):
        validate_trevvos_jwt(token, make_settings())


def test_validate_trevvos_jwt_rejects_invalid_signature() -> None:
    token = make_token(secret="wrong-secret-with-at-least-32-bytes")

    with pytest.raises(InvalidTokenError):
        validate_trevvos_jwt(token, make_settings())


def test_validate_trevvos_jwt_rejects_missing_sub() -> None:
    token = make_token({"sub": ""})

    with pytest.raises(InvalidTokenError):
        validate_trevvos_jwt(token, make_settings())


def test_validate_trevvos_jwt_rejects_missing_maia_app_role() -> None:
    token = make_token({"apps": {"portal": "ADMIN"}})

    with pytest.raises(AppAccessDeniedError):
        validate_trevvos_jwt(token, make_settings())


def test_validate_trevvos_jwt_rejects_invalid_app_role() -> None:
    token = make_token({"apps": {"maia": "INVALID"}})

    with pytest.raises(AppAccessDeniedError):
        validate_trevvos_jwt(token, make_settings())
