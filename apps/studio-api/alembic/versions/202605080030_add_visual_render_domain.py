"""add visual render domain

Revision ID: 202605080030
Revises: 202605072330
Create Date: 2026-05-08 00:30:00.000000

"""
# ruff: noqa: E501

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "202605080030"
down_revision: str | None = "202605072330"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None

schema_name = "studio"

visual_template_category_enum = postgresql.ENUM(
    "institutional_premium",
    "technical_editorial",
    "human_connection",
    "conversion_focused",
    "minimalist_scientific",
    "custom",
    create_type=False,
    name="visual_template_category_enum",
    schema=schema_name,
)
render_type_enum = postgresql.ENUM(
    "cover_slide",
    "carousel_slide",
    "closing_slide",
    "static_post",
    "story",
    create_type=False,
    name="render_type_enum",
    schema=schema_name,
)
render_spec_status_enum = postgresql.ENUM(
    "draft",
    "ready",
    "rendered",
    "discarded",
    create_type=False,
    name="render_spec_status_enum",
    schema=schema_name,
)
image_render_job_status_enum = postgresql.ENUM(
    "pending",
    "running",
    "completed",
    "failed",
    create_type=False,
    name="image_render_job_status_enum",
    schema=schema_name,
)
creative_asset_type_enum = postgresql.ENUM(
    "rendered_slide",
    "final_delivery",
    "reference",
    "logo",
    "photo",
    create_type=False,
    name="creative_asset_type_enum",
    schema=schema_name,
)
creative_asset_status_enum = postgresql.ENUM(
    "draft",
    "ready_for_review",
    "approved",
    "rejected",
    "discarded",
    create_type=False,
    name="creative_asset_status_enum",
    schema=schema_name,
)


def upgrade() -> None:
    bind = op.get_bind()
    visual_template_category_enum.create(bind, checkfirst=True)
    render_type_enum.create(bind, checkfirst=True)
    render_spec_status_enum.create(bind, checkfirst=True)
    image_render_job_status_enum.create(bind, checkfirst=True)
    creative_asset_type_enum.create(bind, checkfirst=True)
    creative_asset_status_enum.create(bind, checkfirst=True)

    op.create_table(
        "visual_templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", visual_template_category_enum, nullable=False),
        sa.Column("layout_rules", sa.Text(), nullable=False),
        sa.Column("css_theme", sa.JSON(), nullable=False),
        sa.Column("default_aspect_ratio", sa.String(length=50), server_default="1:1", nullable=False),
        sa.Column("width", sa.Integer(), server_default="1080", nullable=False),
        sa.Column("height", sa.Integer(), server_default="1080", nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], [f"{schema_name}.tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_visual_templates_tenant_id",
        "visual_templates",
        ["tenant_id"],
        unique=False,
        schema=schema_name,
    )

    op.create_foreign_key(
        "fk_content_requests_visual_template_id",
        "content_requests",
        "visual_templates",
        ["visual_template_id"],
        ["id"],
        source_schema=schema_name,
        referent_schema=schema_name,
        ondelete="SET NULL",
    )

    op.create_table(
        "render_specs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_draft_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("carousel_slide_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("visual_template_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("render_type", render_type_enum, nullable=False),
        sa.Column("slide_number", sa.Integer(), nullable=True),
        sa.Column("total_slides", sa.Integer(), nullable=True),
        sa.Column("width", sa.Integer(), nullable=False),
        sa.Column("height", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("cta", sa.String(length=255), nullable=True),
        sa.Column("visual_notes", sa.Text(), nullable=True),
        sa.Column("brand_logo_url", sa.String(length=2048), nullable=True),
        sa.Column("brand_primary_color", sa.String(length=50), nullable=True),
        sa.Column("brand_secondary_color", sa.String(length=50), nullable=True),
        sa.Column("brand_accent_color", sa.String(length=50), nullable=True),
        sa.Column("brand_visual_style", sa.Text(), nullable=True),
        sa.Column("photo_url", sa.String(length=2048), nullable=True),
        sa.Column("status", render_spec_status_enum, server_default=sa.text("'draft'"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], [f"{schema_name}.tenants.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["content_request_id"], [f"{schema_name}.content_requests.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["content_draft_id"], [f"{schema_name}.content_drafts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["carousel_slide_id"], [f"{schema_name}.carousel_slides.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["visual_template_id"], [f"{schema_name}.visual_templates.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        schema=schema_name,
    )
    for index_name, column_name in [
        ("ix_studio_render_specs_tenant_id", "tenant_id"),
        ("ix_studio_render_specs_content_request_id", "content_request_id"),
        ("ix_studio_render_specs_content_draft_id", "content_draft_id"),
        ("ix_studio_render_specs_carousel_slide_id", "carousel_slide_id"),
        ("ix_studio_render_specs_visual_template_id", "visual_template_id"),
    ]:
        op.create_index(index_name, "render_specs", [column_name], unique=False, schema=schema_name)

    op.create_table(
        "image_render_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("render_spec_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", image_render_job_status_enum, server_default=sa.text("'pending'"), nullable=False),
        sa.Column("renderer", sa.String(length=255), server_default="html_playwright", nullable=False),
        sa.Column("output_path", sa.String(length=2048), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], [f"{schema_name}.tenants.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["content_request_id"], [f"{schema_name}.content_requests.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["render_spec_id"], [f"{schema_name}.render_specs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        schema=schema_name,
    )
    for index_name, column_name in [
        ("ix_studio_image_render_jobs_tenant_id", "tenant_id"),
        ("ix_studio_image_render_jobs_content_request_id", "content_request_id"),
        ("ix_studio_image_render_jobs_render_spec_id", "render_spec_id"),
    ]:
        op.create_index(index_name, "image_render_jobs", [column_name], unique=False, schema=schema_name)

    op.create_table(
        "creative_assets",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("render_spec_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("image_render_job_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("asset_type", creative_asset_type_enum, nullable=False),
        sa.Column("url", sa.String(length=2048), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("mime_type", sa.String(length=100), server_default="image/png", nullable=False),
        sa.Column("width", sa.Integer(), nullable=True),
        sa.Column("height", sa.Integer(), nullable=True),
        sa.Column("status", creative_asset_status_enum, server_default=sa.text("'draft'"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], [f"{schema_name}.tenants.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["content_request_id"], [f"{schema_name}.content_requests.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["render_spec_id"], [f"{schema_name}.render_specs.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["image_render_job_id"], [f"{schema_name}.image_render_jobs.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        schema=schema_name,
    )
    for index_name, column_name in [
        ("ix_studio_creative_assets_tenant_id", "tenant_id"),
        ("ix_studio_creative_assets_content_request_id", "content_request_id"),
        ("ix_studio_creative_assets_render_spec_id", "render_spec_id"),
        ("ix_studio_creative_assets_image_render_job_id", "image_render_job_id"),
    ]:
        op.create_index(index_name, "creative_assets", [column_name], unique=False, schema=schema_name)


def downgrade() -> None:
    for index_name in [
        "ix_studio_creative_assets_image_render_job_id",
        "ix_studio_creative_assets_render_spec_id",
        "ix_studio_creative_assets_content_request_id",
        "ix_studio_creative_assets_tenant_id",
    ]:
        op.drop_index(index_name, table_name="creative_assets", schema=schema_name)
    op.drop_table("creative_assets", schema=schema_name)

    for index_name in [
        "ix_studio_image_render_jobs_render_spec_id",
        "ix_studio_image_render_jobs_content_request_id",
        "ix_studio_image_render_jobs_tenant_id",
    ]:
        op.drop_index(index_name, table_name="image_render_jobs", schema=schema_name)
    op.drop_table("image_render_jobs", schema=schema_name)

    for index_name in [
        "ix_studio_render_specs_visual_template_id",
        "ix_studio_render_specs_carousel_slide_id",
        "ix_studio_render_specs_content_draft_id",
        "ix_studio_render_specs_content_request_id",
        "ix_studio_render_specs_tenant_id",
    ]:
        op.drop_index(index_name, table_name="render_specs", schema=schema_name)
    op.drop_table("render_specs", schema=schema_name)

    op.drop_constraint(
        "fk_content_requests_visual_template_id",
        "content_requests",
        schema=schema_name,
        type_="foreignkey",
    )

    op.drop_index("ix_studio_visual_templates_tenant_id", table_name="visual_templates", schema=schema_name)
    op.drop_table("visual_templates", schema=schema_name)

    bind = op.get_bind()
    creative_asset_status_enum.drop(bind, checkfirst=True)
    creative_asset_type_enum.drop(bind, checkfirst=True)
    image_render_job_status_enum.drop(bind, checkfirst=True)
    render_spec_status_enum.drop(bind, checkfirst=True)
    render_type_enum.drop(bind, checkfirst=True)
    visual_template_category_enum.drop(bind, checkfirst=True)
