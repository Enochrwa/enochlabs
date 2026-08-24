"""create inquiries table

Revision ID: 0001
Revises:
Create Date: 2026-08-23

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "inquiries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("business", sa.String(length=200), nullable=True),
        sa.Column("contact", sa.String(length=200), nullable=False),
        sa.Column("problem", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="new"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("inquiries")
