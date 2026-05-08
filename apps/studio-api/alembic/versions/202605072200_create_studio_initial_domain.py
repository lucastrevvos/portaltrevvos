"""create studio initial domain

Revision ID: 202605072200
Revises: None
Create Date: 2026-05-07 22:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "202605072200"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None

schema_name = "studio"

service_mode_enum = postgresql.ENUM(
    "online",
    "presencial",
    "hibrido",
    create_type=False,
    name="service_mode_enum",
    schema=schema_name,
)
photo_usage_preference_enum = postgresql.ENUM(
    "frequent",
    "occasional",
    "avoid",
    "unknown",
    create_type=False,
    name="photo_usage_preference_enum",
    schema=schema_name,
)
content_format_enum = postgresql.ENUM(
    "static_post",
    "carousel",
    "story_sequence",
    "reel_script",
    "landing_page",
    "logo",
    "visual_identity",
    create_type=False,
    name="content_format_enum",
    schema=schema_name,
)
content_objective_enum = postgresql.ENUM(
    "authority",
    "engagement",
    "conversion",
    "education",
    "lead_generation",
    "brand_awareness",
    create_type=False,
    name="content_objective_enum",
    schema=schema_name,
)
content_request_status_enum = postgresql.ENUM(
    "draft",
    "awaiting_text_approval",
    "text_revision_requested",
    "text_approved",
    "visual_prompt_ready",
    "in_manual_production",
    "awaiting_final_approval",
    "final_revision_requested",
    "delivered",
    "cancelled",
    create_type=False,
    name="content_request_status_enum",
    schema=schema_name,
)


def upgrade() -> None:
    op.execute(sa.text(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"'))

    bind = op.get_bind()
    service_mode_enum.create(bind, checkfirst=True)
    photo_usage_preference_enum.create(bind, checkfirst=True)
    content_format_enum.create(bind, checkfirst=True)
    content_objective_enum.create(bind, checkfirst=True)
    content_request_status_enum.create(bind, checkfirst=True)

    op.create_table(
        "tenants",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("business_name", sa.String(length=255), nullable=True),
        sa.Column("niche", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug", name="uq_tenants_slug"),
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_tenants_slug",
        "tenants",
        ["slug"],
        unique=False,
        schema=schema_name,
    )

    op.create_table(
        "onboarding_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("professional_name", sa.String(length=255), nullable=False),
        sa.Column("instagram_handle", sa.String(length=255), nullable=True),
        sa.Column("website_url", sa.String(length=500), nullable=True),
        sa.Column("whatsapp_number", sa.String(length=50), nullable=True),
        sa.Column("city", sa.String(length=255), nullable=True),
        sa.Column("service_mode", service_mode_enum, nullable=False),
        sa.Column("target_audience", sa.Text(), nullable=False),
        sa.Column("audience_pain_points", sa.Text(), nullable=False),
        sa.Column("main_services", sa.Text(), nullable=False),
        sa.Column("desired_positioning", sa.Text(), nullable=False),
        sa.Column("tone_of_voice", sa.Text(), nullable=False),
        sa.Column("avoid_communication", sa.Text(), nullable=True),
        sa.Column("brand_phrase", sa.Text(), nullable=True),
        sa.Column("main_cta", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            [f"{schema_name}.tenants.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("tenant_id", name="uq_onboarding_profiles_tenant_id"),
        schema=schema_name,
    )

    op.create_table(
        "brand_kits",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("logo_url", sa.String(length=500), nullable=True),
        sa.Column("primary_color", sa.String(length=32), nullable=True),
        sa.Column("secondary_color", sa.String(length=32), nullable=True),
        sa.Column("accent_color", sa.String(length=32), nullable=True),
        sa.Column("font_preferences", sa.Text(), nullable=True),
        sa.Column("visual_style", sa.Text(), nullable=True),
        sa.Column(
            "photo_usage_preference",
            photo_usage_preference_enum,
            nullable=False,
        ),
        sa.Column("layout_preference", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            [f"{schema_name}.tenants.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("tenant_id", name="uq_brand_kits_tenant_id"),
        schema=schema_name,
    )

    op.create_table(
        "content_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("format", content_format_enum, nullable=False),
        sa.Column("objective", content_objective_enum, nullable=False),
        sa.Column("cta", sa.String(length=255), nullable=True),
        sa.Column("theme", sa.String(length=255), nullable=False),
        sa.Column("visual_template_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "status",
            content_request_status_enum,
            server_default=sa.text("'draft'"),
            nullable=False,
        ),
        sa.Column("briefing", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            [f"{schema_name}.tenants.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_content_requests_tenant_id",
        "content_requests",
        ["tenant_id"],
        unique=False,
        schema=schema_name,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_studio_content_requests_tenant_id",
        table_name="content_requests",
        schema=schema_name,
    )
    op.drop_table("content_requests", schema=schema_name)
    op.drop_table("brand_kits", schema=schema_name)
    op.drop_table("onboarding_profiles", schema=schema_name)
    op.drop_index("ix_studio_tenants_slug", table_name="tenants", schema=schema_name)
    op.drop_table("tenants", schema=schema_name)

    bind = op.get_bind()
    content_request_status_enum.drop(bind, checkfirst=True)
    content_objective_enum.drop(bind, checkfirst=True)
    content_format_enum.drop(bind, checkfirst=True)
    photo_usage_preference_enum.drop(bind, checkfirst=True)
    service_mode_enum.drop(bind, checkfirst=True)
