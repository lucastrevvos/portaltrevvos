"""Create Ma.ia schema.

Revision ID: 202604270001
Revises:
Create Date: 2026-04-27
"""

from sqlalchemy import text

from alembic import op
from app.core.config import get_settings
from app.infra.db.schema import create_schema_sql

revision = "202604270001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    settings = get_settings()
    op.execute(text(create_schema_sql(settings.db_schema)))


def downgrade() -> None:
    pass
