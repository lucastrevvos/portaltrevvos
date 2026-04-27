from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from fastapi.testclient import TestClient

from app.api.deps import get_app_settings
from app.core.config import Settings
from app.main import create_app

TEST_SECRET = "test-secret-with-at-least-32-bytes"


def make_token(claims_overrides: dict[str, Any] | None = None) -> str:
    claims: dict[str, Any] = {
        "sub": "user-123",
        "email": "user@example.com",
        "globalRole": "USER",
        "apps": {"maia": "ADMIN"},
        "iss": "trevvos-auth",
        "iat": datetime.now(UTC),
        "exp": datetime.now(UTC) + timedelta(minutes=15),
    }
    if claims_overrides:
        claims.update(claims_overrides)

    return jwt.encode(claims, TEST_SECRET, algorithm="HS256")


def make_client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_app_settings] = lambda: Settings(
        trevvos_auth_jwt_secret=TEST_SECRET,
    )
    return TestClient(app)


def test_get_me_without_authorization_returns_401() -> None:
    with make_client() as client:
        response = client.get("/v1/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Token de autenticacao ausente."


def test_get_me_with_valid_token_returns_current_user() -> None:
    token = make_token()

    with make_client() as client:
        response = client.get(
            "/v1/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    assert response.json() == {
        "id": "user-123",
        "email": "user@example.com",
        "global_role": "USER",
        "app_role": "ADMIN",
        "app_slug": "maia",
    }
