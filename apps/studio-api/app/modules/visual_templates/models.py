from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base, studio_enum
from app.shared.enums import VisualTemplateCategory


class VisualTemplate(Base):
    __tablename__ = "visual_templates"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[VisualTemplateCategory] = mapped_column(
        studio_enum(
            VisualTemplateCategory,
            name="visual_template_category_enum",
        )
    )
    layout_rules: Mapped[str] = mapped_column(Text)
    css_theme: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    default_aspect_ratio: Mapped[str] = mapped_column(
        String(50),
        default="1:1",
        server_default="1:1",
    )
    width: Mapped[int] = mapped_column(Integer, default=1080, server_default="1080")
    height: Mapped[int] = mapped_column(Integer, default=1080, server_default="1080")
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default="true",
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

    tenant = relationship("Tenant", back_populates="visual_templates")
    content_requests = relationship("ContentRequest")
    render_specs = relationship("RenderSpec", back_populates="visual_template")
