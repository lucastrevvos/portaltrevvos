from datetime import datetime
from typing import Self
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator

from app.domain.couples.normalization import normalize_partner_ids
from app.domain.couples.status import CoupleStatus


class CoupleCreate(BaseModel):
    partner_a_user_id: str
    partner_b_user_id: str

    @model_validator(mode="after")
    def normalize_partner_order(self) -> Self:
        self.partner_a_user_id, self.partner_b_user_id = normalize_partner_ids(
            self.partner_a_user_id,
            self.partner_b_user_id,
        )
        return self


class CoupleRead(BaseModel):
    id: UUID
    partner_a_user_id: str
    partner_b_user_id: str
    status: CoupleStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
