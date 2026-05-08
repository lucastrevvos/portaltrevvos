from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    business_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    niche: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    onboarding_profile = relationship(
        "OnboardingProfile",
        back_populates="tenant",
        cascade="all, delete-orphan",
        uselist=False,
    )
    brand_kit = relationship(
        "BrandKit",
        back_populates="tenant",
        cascade="all, delete-orphan",
        uselist=False,
    )
    brand_assets = relationship(
        "BrandAsset",
        back_populates="tenant",
        cascade="all, delete-orphan",
        order_by="BrandAsset.created_at",
    )
    content_requests = relationship(
        "ContentRequest",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )
    visual_templates = relationship(
        "VisualTemplate",
        back_populates="tenant",
    )
