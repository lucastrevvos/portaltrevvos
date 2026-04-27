from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, DateTime, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.couples.status import CoupleStatus
from app.infra.db.base import Base


class Couple(Base):
    __tablename__ = "couples"
    __table_args__ = (
        CheckConstraint(
            "partner_a_user_id <> partner_b_user_id",
            name="ck_couples_distinct_partners",
        ),
        CheckConstraint(
            "status IN ('pending', 'active', 'ended')",
            name="ck_couples_status",
        ),
        UniqueConstraint(
            "partner_a_user_id",
            "partner_b_user_id",
            name="uq_couples_partner_pair",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PostgresUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    partner_a_user_id: Mapped[str] = mapped_column(String(255), index=True)
    partner_b_user_id: Mapped[str] = mapped_column(String(255), index=True)
    status: Mapped[str] = mapped_column(
        String(20),
        default=CoupleStatus.PENDING.value,
        server_default=CoupleStatus.PENDING.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
