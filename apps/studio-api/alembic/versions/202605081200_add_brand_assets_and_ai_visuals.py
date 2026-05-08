"""add brand assets and ai visual backgrounds

Revision ID: 202605081200
Revises: 202605080030
Create Date: 2026-05-08 12:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "202605081200"
down_revision: str | None = "202605080030"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None

schema_name = "studio"

brand_asset_type_enum = postgresql.ENUM(
    "logo",
    "profile_photo",
    "brand_reference",
    "post_reference",
    "product_photo",
    "general_asset",
    create_type=False,
    name="brand_asset_type_enum",
    schema=schema_name,
)


def upgrade() -> None:
    bind = op.get_bind()
    brand_asset_type_enum.create(bind, checkfirst=True)
    op.execute(
        "ALTER TYPE studio.creative_asset_type_enum "
        "ADD VALUE IF NOT EXISTS 'generated_background'"
    )

    op.create_table(
        "brand_assets",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("asset_type", brand_asset_type_enum, nullable=False),
        sa.Column("label", sa.String(length=255), nullable=True),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("storage_path", sa.String(length=2048), nullable=False),
        sa.Column("public_url", sa.String(length=2048), nullable=False),
        sa.Column("width", sa.Integer(), nullable=True),
        sa.Column("height", sa.Integer(), nullable=True),
        sa.Column(
            "is_primary",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
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
        "ix_studio_brand_assets_tenant_id",
        "brand_assets",
        ["tenant_id"],
        unique=False,
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_brand_assets_asset_type",
        "brand_assets",
        ["asset_type"],
        unique=False,
        schema=schema_name,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_studio_brand_assets_asset_type",
        table_name="brand_assets",
        schema=schema_name,
    )
    op.drop_index(
        "ix_studio_brand_assets_tenant_id",
        table_name="brand_assets",
        schema=schema_name,
    )
    op.drop_table("brand_assets", schema=schema_name)
    bind = op.get_bind()
    brand_asset_type_enum.drop(bind, checkfirst=True)
