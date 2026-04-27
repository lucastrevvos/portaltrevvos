from app.domain.couples.model import Couple
from app.domain.couples.normalization import normalize_partner_ids
from app.domain.couples.repository import CoupleRepository
from app.domain.couples.schemas import CoupleCreate
from app.domain.couples.status import CoupleStatus


class CreateCoupleService:
    def __init__(self, repository: CoupleRepository) -> None:
        self._repository = repository

    async def execute(self, payload: CoupleCreate) -> Couple:
        partner_a_user_id, partner_b_user_id = normalize_partner_ids(
            payload.partner_a_user_id,
            payload.partner_b_user_id,
        )
        couple = Couple(
            partner_a_user_id=partner_a_user_id,
            partner_b_user_id=partner_b_user_id,
            status=CoupleStatus.PENDING.value,
        )
        return await self._repository.add(couple)
