from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base
from app.shared.enums import PhotoUsagePreference


class BrandKit(Base):
    __tablename__ = "brand_kits"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        unique=True,
    )
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    primary_color: Mapped[str | None] = mapped_column(String(32), nullable=True)
    secondary_color: Mapped[str | None] = mapped_column(String(32), nullable=True)
    accent_color: Mapped[str | None] = mapped_column(String(32), nullable=True)
    font_preferences: Mapped[str | None] = mapped_column(Text, nullable=True)
    visual_style: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_usage_preference: Mapped[PhotoUsagePreference] = mapped_column(
        Enum(
            PhotoUsagePreference,
            name="photo_usage_preference_enum",
            schema=STUDIO_SCHEMA,
        ),
        default=PhotoUsagePreference.UNKNOWN,
    )
    layout_preference: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    tenant = relationship("Tenant", back_populates="brand_kit")
