import asyncio

import pytest
from pydantic import ValidationError

from app.domain.couples.model import Couple
from app.domain.couples.normalization import normalize_partner_ids
from app.domain.couples.schemas import CoupleCreate
from app.domain.couples.service import CreateCoupleService
from app.domain.couples.status import CoupleStatus


class InMemoryCoupleRepository:
    def __init__(self) -> None:
        self.saved_couples: list[Couple] = []

    async def add(self, couple: Couple) -> Couple:
        self.saved_couples.append(couple)
        return couple


def test_normalize_partner_ids_orders_ids_lexically() -> None:
    assert normalize_partner_ids("user-z", "user-a") == ("user-a", "user-z")


def test_normalize_partner_ids_rejects_equal_ids() -> None:
    with pytest.raises(ValueError):
        normalize_partner_ids("same-user", "same-user")


def test_couple_create_schema_normalizes_partner_order() -> None:
    payload = CoupleCreate(
        partner_a_user_id="trevvos-user-2",
        partner_b_user_id="trevvos-user-1",
    )

    assert payload.partner_a_user_id == "trevvos-user-1"
    assert payload.partner_b_user_id == "trevvos-user-2"


def test_couple_create_schema_rejects_equal_partner_ids() -> None:
    with pytest.raises(ValidationError):
        CoupleCreate(
            partner_a_user_id="trevvos-user-1",
            partner_b_user_id="trevvos-user-1",
        )


def test_create_couple_service_normalizes_and_creates_pending_couple() -> None:
    repository = InMemoryCoupleRepository()
    service = CreateCoupleService(repository)
    payload = CoupleCreate.model_construct(
        partner_a_user_id="user-b",
        partner_b_user_id="user-a",
    )

    couple = asyncio.run(service.execute(payload))

    assert couple.partner_a_user_id == "user-a"
    assert couple.partner_b_user_id == "user-b"
    assert couple.status == CoupleStatus.PENDING.value
    assert repository.saved_couples == [couple]
