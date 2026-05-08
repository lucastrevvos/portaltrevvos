from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base
from app.shared.enums import ContentFormat, ContentObjective, ContentRequestStatus


class ContentRequest(Base):
    __tablename__ = "content_requests"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255))
    format: Mapped[ContentFormat] = mapped_column(
        Enum(ContentFormat, name="content_format_enum", schema=STUDIO_SCHEMA)
    )
    objective: Mapped[ContentObjective] = mapped_column(
        Enum(ContentObjective, name="content_objective_enum", schema=STUDIO_SCHEMA)
    )
    cta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    theme: Mapped[str] = mapped_column(String(255))
    visual_template_id: Mapped[UUID | None] = mapped_column(nullable=True)
    status: Mapped[ContentRequestStatus] = mapped_column(
        Enum(
            ContentRequestStatus,
            name="content_request_status_enum",
            schema=STUDIO_SCHEMA,
        ),
        default=ContentRequestStatus.DRAFT,
        server_default=ContentRequestStatus.DRAFT.value,
    )
    briefing: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    tenant = relationship("Tenant", back_populates="content_requests")
    draft = relationship(
        "ContentDraft",
        back_populates="content_request",
        cascade="all, delete-orphan",
        uselist=False,
    )
    approval_events = relationship(
        "ApprovalEvent",
        back_populates="content_request",
        cascade="all, delete-orphan",
        order_by="ApprovalEvent.created_at",
    )
