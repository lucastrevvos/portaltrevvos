from collections.abc import AsyncGenerator
from types import SimpleNamespace
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.exc import IntegrityError

from app.api.deps import get_app_settings, get_db_session
from app.api.v1.couples import get_create_couple_service
from app.core.config import Settings
from app.domain.couples.schemas import CoupleCreate
from app.domain.couples.status import CoupleStatus
from app.main import create_app
from tests.test_me_auth import TEST_SECRET, make_token


class FakeSession:
    def __init__(self) -> None:
        self.committed = False
        self.rolled_back = False

    async def commit(self) -> None:
        self.committed = True

    async def rollback(self) -> None:
        self.rolled_back = True


class FakeCreateCoupleService:
    def __init__(self) -> None:
        self.received_payload: CoupleCreate | None = None

    async def execute(self, payload: CoupleCreate) -> SimpleNamespace:
        self.received_payload = payload
        return SimpleNamespace(
            id=uuid4(),
            partner_a_user_id=payload.partner_a_user_id,
            partner_b_user_id=payload.partner_b_user_id,
            status=CoupleStatus.PENDING.value,
            created_at="2026-04-27T00:00:00Z",
            updated_at="2026-04-27T00:00:00Z",
        )


class DuplicateCoupleService:
    async def execute(self, payload: CoupleCreate) -> SimpleNamespace:
        raise IntegrityError("insert into couples", {}, Exception("duplicate"))


def make_client(
    service: object,
    session: FakeSession | None = None,
) -> tuple[TestClient, FakeSession]:
    app = create_app()
    fake_session = session or FakeSession()

    async def override_db_session() -> AsyncGenerator[FakeSession, None]:
        yield fake_session

    app.dependency_overrides[get_app_settings] = lambda: Settings(
        trevvos_auth_jwt_secret=TEST_SECRET,
    )
    app.dependency_overrides[get_db_session] = override_db_session
    app.dependency_overrides[get_create_couple_service] = lambda: service

    return TestClient(app), fake_session


def test_post_couples_without_authorization_returns_401() -> None:
    client, _session = make_client(FakeCreateCoupleService())

    with client:
        response = client.post(
            "/v1/couples",
            json={"partner_user_id": "user-456"},
        )

    assert response.status_code == 401
    assert response.json()["detail"] == "Token de autenticacao ausente."


def test_post_couples_with_valid_token_creates_couple() -> None:
    service = FakeCreateCoupleService()
    client, session = make_client(service)
    token = make_token()

    with client:
        response = client.post(
            "/v1/couples",
            headers={"Authorization": f"Bearer {token}"},
            json={"partner_user_id": "user-456"},
        )

    assert response.status_code == 201
    body = response.json()
    assert body["partner_a_user_id"] == "user-123"
    assert body["partner_b_user_id"] == "user-456"
    assert body["status"] == "pending"
    assert service.received_payload is not None
    assert service.received_payload.partner_a_user_id == "user-123"
    assert service.received_payload.partner_b_user_id == "user-456"
    assert session.committed is True
    assert session.rolled_back is False


def test_post_couples_with_same_partner_returns_400() -> None:
    service = FakeCreateCoupleService()
    client, session = make_client(service)
    token = make_token()

    with client:
        response = client.post(
            "/v1/couples",
            headers={"Authorization": f"Bearer {token}"},
            json={"partner_user_id": "user-123"},
        )

    assert response.status_code == 400
    assert response.json()["detail"] == "A couple requires two distinct Trevvos users."
    assert service.received_payload is None
    assert session.committed is False
    assert session.rolled_back is True


def test_post_couples_with_duplicate_pair_returns_409() -> None:
    client, session = make_client(DuplicateCoupleService())
    token = make_token()

    with client:
        response = client.post(
            "/v1/couples",
            headers={"Authorization": f"Bearer {token}"},
            json={"partner_user_id": "user-456"},
        )

    assert response.status_code == 409
    assert response.json()["detail"] == "Couple already exists."
    assert session.committed is False
    assert session.rolled_back is True
