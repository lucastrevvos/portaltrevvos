from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import STUDIO_SCHEMA, Base, studio_enum
from app.shared.enums import (
    CreativeAssetStatus,
    CreativeAssetType,
    ImageRenderJobStatus,
    RenderSpecStatus,
    RenderType,
)


class RenderSpec(Base):
    __tablename__ = "render_specs"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    content_request_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_requests.id", ondelete="CASCADE"),
        index=True,
    )
    content_draft_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_drafts.id", ondelete="CASCADE"),
        index=True,
    )
    carousel_slide_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.carousel_slides.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    visual_template_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.visual_templates.id", ondelete="CASCADE"),
        index=True,
    )
    render_type: Mapped[RenderType] = mapped_column(
        studio_enum(RenderType, name="render_type_enum")
    )
    slide_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_slides: Mapped[int | None] = mapped_column(Integer, nullable=True)
    width: Mapped[int] = mapped_column(Integer)
    height: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    cta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    visual_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    brand_logo_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    brand_primary_color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    brand_secondary_color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    brand_accent_color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    brand_visual_style: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    status: Mapped[RenderSpecStatus] = mapped_column(
        studio_enum(RenderSpecStatus, name="render_spec_status_enum"),
        default=RenderSpecStatus.DRAFT,
        server_default=RenderSpecStatus.DRAFT.value,
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

    content_request = relationship("ContentRequest", back_populates="render_specs")
    content_draft = relationship("ContentDraft", back_populates="render_specs")
    carousel_slide = relationship("CarouselSlide", back_populates="render_specs")
    visual_template = relationship("VisualTemplate", back_populates="render_specs")
    image_render_jobs = relationship(
        "ImageRenderJob",
        back_populates="render_spec",
        cascade="all, delete-orphan",
        order_by="ImageRenderJob.created_at",
    )
    creative_assets = relationship(
        "CreativeAsset",
        back_populates="render_spec",
        cascade="all, delete-orphan",
        order_by="CreativeAsset.created_at",
    )


class ImageRenderJob(Base):
    __tablename__ = "image_render_jobs"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    content_request_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_requests.id", ondelete="CASCADE"),
        index=True,
    )
    render_spec_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.render_specs.id", ondelete="CASCADE"),
        index=True,
    )
    status: Mapped[ImageRenderJobStatus] = mapped_column(
        studio_enum(
            ImageRenderJobStatus,
            name="image_render_job_status_enum",
        ),
        default=ImageRenderJobStatus.PENDING,
        server_default=ImageRenderJobStatus.PENDING.value,
    )
    renderer: Mapped[str] = mapped_column(
        String(255),
        default="html_playwright",
        server_default="html_playwright",
    )
    output_path: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
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

    render_spec = relationship("RenderSpec", back_populates="image_render_jobs")
    creative_assets = relationship("CreativeAsset", back_populates="image_render_job")


class CreativeAsset(Base):
    __tablename__ = "creative_assets"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.tenants.id", ondelete="CASCADE"),
        index=True,
    )
    content_request_id: Mapped[UUID] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.content_requests.id", ondelete="CASCADE"),
        index=True,
    )
    render_spec_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.render_specs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    image_render_job_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(f"{STUDIO_SCHEMA}.image_render_jobs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    asset_type: Mapped[CreativeAssetType] = mapped_column(
        studio_enum(CreativeAssetType, name="creative_asset_type_enum")
    )
    url: Mapped[str] = mapped_column(String(2048))
    file_name: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(
        String(100),
        default="image/png",
        server_default="image/png",
    )
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[CreativeAssetStatus] = mapped_column(
        studio_enum(
            CreativeAssetStatus,
            name="creative_asset_status_enum",
        ),
        default=CreativeAssetStatus.DRAFT,
        server_default=CreativeAssetStatus.DRAFT.value,
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

    content_request = relationship("ContentRequest", back_populates="creative_assets")
    render_spec = relationship("RenderSpec", back_populates="creative_assets")
    image_render_job = relationship("ImageRenderJob", back_populates="creative_assets")
