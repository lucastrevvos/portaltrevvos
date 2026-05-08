from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base, studio_enum
from app.shared.enums import ServiceMode


class OnboardingProfile(Base):
    __tablename__ = "onboarding_profiles"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        unique=True,
    )
    professional_name: Mapped[str] = mapped_column(String(255))
    instagram_handle: Mapped[str | None] = mapped_column(String(255), nullable=True)
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    whatsapp_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    city: Mapped[str | None] = mapped_column(String(255), nullable=True)
    service_mode: Mapped[ServiceMode] = mapped_column(
        studio_enum(ServiceMode, name="service_mode_enum")
    )
    target_audience: Mapped[str] = mapped_column(Text)
    audience_pain_points: Mapped[str] = mapped_column(Text)
    main_services: Mapped[str] = mapped_column(Text)
    desired_positioning: Mapped[str] = mapped_column(Text)
    tone_of_voice: Mapped[str] = mapped_column(Text)
    avoid_communication: Mapped[str | None] = mapped_column(Text, nullable=True)
    brand_phrase: Mapped[str | None] = mapped_column(Text, nullable=True)
    main_cta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    tenant = relationship("Tenant", back_populates="onboarding_profile")
