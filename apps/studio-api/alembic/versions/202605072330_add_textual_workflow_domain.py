"""add textual workflow domain

Revision ID: 202605072330
Revises: 202605072200
Create Date: 2026-05-07 23:30:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "202605072330"
down_revision: str | None = "202605072200"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None

schema_name = "studio"

content_draft_status_enum = postgresql.ENUM(
    "draft",
    "awaiting_approval",
    "revision_requested",
    "approved",
    create_type=False,
    name="content_draft_status_enum",
    schema=schema_name,
)
approval_event_type_enum = postgresql.ENUM(
    "text_submitted",
    "text_revision_requested",
    "text_approved",
    "status_changed",
    create_type=False,
    name="approval_event_type_enum",
    schema=schema_name,
)
approval_actor_type_enum = postgresql.ENUM(
    "admin",
    "client",
    "system",
    create_type=False,
    name="approval_actor_type_enum",
    schema=schema_name,
)


def upgrade() -> None:
    bind = op.get_bind()
    content_draft_status_enum.create(bind, checkfirst=True)
    approval_event_type_enum.create(bind, checkfirst=True)
    approval_actor_type_enum.create(bind, checkfirst=True)

    op.create_table(
        "content_drafts",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("caption", sa.Text(), nullable=True),
        sa.Column("fixed_comment", sa.Text(), nullable=True),
        sa.Column("stories_suggestion", sa.Text(), nullable=True),
        sa.Column(
            "status",
            content_draft_status_enum,
            server_default=sa.text("'draft'"),
            nullable=False,
        ),
        sa.Column("version", sa.Integer(), server_default="1", nullable=False),
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
        sa.ForeignKeyConstraint(
            ["content_request_id"],
            [f"{schema_name}.content_requests.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "content_request_id",
            name="uq_content_drafts_content_request_id",
        ),
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_content_drafts_tenant_id",
        "content_drafts",
        ["tenant_id"],
        unique=False,
        schema=schema_name,
    )

    op.create_table(
        "carousel_slides",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_draft_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("slide_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("visual_notes", sa.Text(), nullable=True),
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
        sa.ForeignKeyConstraint(
            ["content_draft_id"],
            [f"{schema_name}.content_drafts.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "content_draft_id",
            "slide_number",
            name="uq_carousel_slides_draft_slide_number",
        ),
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_carousel_slides_tenant_id",
        "carousel_slides",
        ["tenant_id"],
        unique=False,
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_carousel_slides_content_draft_id",
        "carousel_slides",
        ["content_draft_id"],
        unique=False,
        schema=schema_name,
    )

    op.create_table(
        "approval_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content_draft_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("event_type", approval_event_type_enum, nullable=False),
        sa.Column(
            "actor_type",
            approval_actor_type_enum,
            server_default=sa.text("'system'"),
            nullable=False,
        ),
        sa.Column("actor_name", sa.String(length=255), nullable=True),
        sa.Column("from_status", sa.String(length=255), nullable=True),
        sa.Column("to_status", sa.String(length=255), nullable=True),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            [f"{schema_name}.tenants.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["content_request_id"],
            [f"{schema_name}.content_requests.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["content_draft_id"],
            [f"{schema_name}.content_drafts.id"],
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_approval_events_tenant_id",
        "approval_events",
        ["tenant_id"],
        unique=False,
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_approval_events_content_request_id",
        "approval_events",
        ["content_request_id"],
        unique=False,
        schema=schema_name,
    )
    op.create_index(
        "ix_studio_approval_events_content_draft_id",
        "approval_events",
        ["content_draft_id"],
        unique=False,
        schema=schema_name,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_studio_approval_events_content_draft_id",
        table_name="approval_events",
        schema=schema_name,
    )
    op.drop_index(
        "ix_studio_approval_events_content_request_id",
        table_name="approval_events",
        schema=schema_name,
    )
    op.drop_index(
        "ix_studio_approval_events_tenant_id",
        table_name="approval_events",
        schema=schema_name,
    )
    op.drop_table("approval_events", schema=schema_name)

    op.drop_index(
        "ix_studio_carousel_slides_content_draft_id",
        table_name="carousel_slides",
        schema=schema_name,
    )
    op.drop_index(
        "ix_studio_carousel_slides_tenant_id",
        table_name="carousel_slides",
        schema=schema_name,
    )
    op.drop_table("carousel_slides", schema=schema_name)

    op.drop_index(
        "ix_studio_content_drafts_tenant_id",
        table_name="content_drafts",
        schema=schema_name,
    )
    op.drop_table("content_drafts", schema=schema_name)

    bind = op.get_bind()
    approval_actor_type_enum.drop(bind, checkfirst=True)
    approval_event_type_enum.drop(bind, checkfirst=True)
    content_draft_status_enum.drop(bind, checkfirst=True)
