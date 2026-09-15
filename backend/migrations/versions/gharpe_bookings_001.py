"""add bookings table

Revision ID: gharpe_bookings_001
Revises: 2f8c0ad7b580
"""
from alembic import op
import sqlalchemy as sa

revision = "gharpe_bookings_001"
down_revision = "2f8c0ad7b580"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("worker_id", sa.Integer(), nullable=False),
        sa.Column("service", sa.String(length=120), nullable=False),
        sa.Column("date", sa.String(length=20), nullable=False),
        sa.Column("time", sa.String(length=20), nullable=False),
        sa.Column("address", sa.String(length=500), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["customer_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["worker_id"], ["workers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_bookings_customer_id", "bookings", ["customer_id"])
    op.create_index("ix_bookings_worker_id", "bookings", ["worker_id"])
    op.create_index("ix_bookings_status", "bookings", ["status"])


def downgrade():
    op.drop_index("ix_bookings_status", table_name="bookings")
    op.drop_index("ix_bookings_worker_id", table_name="bookings")
    op.drop_index("ix_bookings_customer_id", table_name="bookings")
    op.drop_table("bookings")
