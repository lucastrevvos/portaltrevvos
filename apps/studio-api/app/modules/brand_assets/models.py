from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base, studio_enum
from app.shared.enums import BrandAssetType


class BrandAsset(Base):
    __tablename__ = "brand_assets"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    asset_type: Mapped[BrandAssetType] = mapped_column(
        studio_enum(BrandAssetType, name="brand_asset_type_enum")
    )
    label: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_name: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(String(100))
    storage_path: Mapped[str] = mapped_column(String(2048))
    public_url: Mapped[str] = mapped_column(String(2048))
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="false",
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

    tenant = relationship("Tenant", back_populates="brand_assets")
