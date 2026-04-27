"""Create couples table.

Revision ID: 202604270002
Revises: 202604270001
Create Date: 2026-04-27
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op
from app.core.config import get_settings

revision = "202604270002"
down_revision = "202604270001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    settings = get_settings()
    op.create_table(
        "couples",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("partner_a_user_id", sa.String(length=255), nullable=False),
        sa.Column("partner_b_user_id", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint(
            "partner_a_user_id <> partner_b_user_id",
            name="ck_couples_distinct_partners",
        ),
        sa.CheckConstraint(
            "status IN ('pending', 'active', 'ended')",
            name="ck_couples_status",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "partner_a_user_id",
            "partner_b_user_id",
            name="uq_couples_partner_pair",
        ),
        schema=settings.db_schema,
    )
    op.create_index(
        "ix_couples_partner_a_user_id",
        "couples",
        ["partner_a_user_id"],
        schema=settings.db_schema,
    )
    op.create_index(
        "ix_couples_partner_b_user_id",
        "couples",
        ["partner_b_user_id"],
        schema=settings.db_schema,
    )


def downgrade() -> None:
    settings = get_settings()
    op.drop_index(
        "ix_couples_partner_b_user_id",
        table_name="couples",
        schema=settings.db_schema,
    )
    op.drop_index(
        "ix_couples_partner_a_user_id",
        table_name="couples",
        schema=settings.db_schema,
    )
    op.drop_table("couples", schema=settings.db_schema)
