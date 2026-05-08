from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base, studio_enum
from app.shared.enums import (
    ApprovalActorType,
    ApprovalEventType,
    ContentDraftStatus,
)


class ContentDraft(Base):
    __tablename__ = "content_drafts"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    content_request_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_requests.id", ondelete="CASCADE"),
        unique=True,
    )
    title: Mapped[str] = mapped_column(String(255))
    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    fixed_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    stories_suggestion: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ContentDraftStatus] = mapped_column(
        studio_enum(
            ContentDraftStatus,
            name="content_draft_status_enum",
        ),
        default=ContentDraftStatus.DRAFT,
        server_default=ContentDraftStatus.DRAFT.value,
    )
    version: Mapped[int] = mapped_column(Integer, default=1, server_default="1")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    content_request = relationship("ContentRequest", back_populates="draft")
    slides = relationship(
        "CarouselSlide",
        back_populates="content_draft",
        cascade="all, delete-orphan",
        order_by="CarouselSlide.slide_number",
    )
    approval_events = relationship(
        "ApprovalEvent",
        back_populates="content_draft",
    )
    render_specs = relationship(
        "RenderSpec",
        back_populates="content_draft",
        cascade="all, delete-orphan",
        order_by="RenderSpec.slide_number",
    )


class CarouselSlide(Base):
    __tablename__ = "carousel_slides"
    __table_args__ = (
        UniqueConstraint(
            "content_draft_id",
            "slide_number",
            name="uq_carousel_slides_draft_slide_number",
        ),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    content_draft_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_drafts.id", ondelete="CASCADE"),
        index=True,
    )
    slide_number: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    visual_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    content_draft = relationship("ContentDraft", back_populates="slides")
    render_specs = relationship(
        "RenderSpec",
        back_populates="carousel_slide",
    )


class ApprovalEvent(Base):
    __tablename__ = "approval_events"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    content_request_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_requests.id", ondelete="CASCADE"),
        index=True,
    )
    content_draft_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_drafts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    event_type: Mapped[ApprovalEventType] = mapped_column(
        studio_enum(
            ApprovalEventType,
            name="approval_event_type_enum",
        )
    )
    actor_type: Mapped[ApprovalActorType] = mapped_column(
        studio_enum(
            ApprovalActorType,
            name="approval_actor_type_enum",
        ),
        default=ApprovalActorType.SYSTEM,
        server_default=ApprovalActorType.SYSTEM.value,
    )
    actor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    from_status: Mapped[str | None] = mapped_column(String(255), nullable=True)
    to_status: Mapped[str | None] = mapped_column(String(255), nullable=True)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    content_request = relationship("ContentRequest", back_populates="approval_events")
    content_draft = relationship("ContentDraft", back_populates="approval_events")
