"""expand auth/profile fields and add worker applications

Revision ID: gharpe_profile_auth_002
Revises: gharpe_bookings_001
"""
from alembic import op
import sqlalchemy as sa

revision = "gharpe_profile_auth_002"
down_revision = "gharpe_bookings_001"
branch_labels = None
depends_on = None


def upgrade():
    # User registration/authentication fields
    op.add_column("users", sa.Column("email", sa.String(length=160), nullable=True))
    op.add_column("users", sa.Column("address", sa.String(length=500), nullable=True))
    op.add_column("users", sa.Column("preferred_language", sa.String(length=50), nullable=True))
    op.add_column("users", sa.Column("password_hash", sa.String(length=255), nullable=True))
    op.add_column("users", sa.Column("terms_accepted", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("users", sa.Column("latitude", sa.Float(), nullable=True))
    op.add_column("users", sa.Column("longitude", sa.Float(), nullable=True))
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # A separate intake database/table for workers who have registered themselves.
    # The existing workers table remains the official/approved marketplace registry.
    op.create_table(
        "worker_applications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("email", sa.String(length=160), nullable=True),
        sa.Column("address", sa.String(length=500), nullable=False),
        sa.Column("profile_photo_data", sa.Text(), nullable=True),
        sa.Column("profession", sa.String(length=100), nullable=False),
        sa.Column("experience_years", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("skills", sa.ARRAY(sa.String()), nullable=False, server_default=sa.text("ARRAY[]::varchar[]")),
        sa.Column("certifications", sa.ARRAY(sa.String()), nullable=False, server_default=sa.text("ARRAY[]::varchar[]")),
        sa.Column("available_days", sa.ARRAY(sa.String()), nullable=False, server_default=sa.text("ARRAY[]::varchar[]")),
        sa.Column("start_time", sa.String(length=10), nullable=True),
        sa.Column("end_time", sa.String(length=10), nullable=True),
        sa.Column("availability_type", sa.String(length=40), nullable=True),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("district", sa.String(length=100), nullable=False),
        sa.Column("pincode", sa.String(length=10), nullable=False),
        sa.Column("id_type", sa.String(length=50), nullable=False),
        sa.Column("id_number", sa.String(length=100), nullable=False),
        sa.Column("id_proof_data", sa.Text(), nullable=False),
        sa.Column("verification_status", sa.String(length=30), nullable=False, server_default="pending"),
        sa.Column("official_worker_id", sa.Integer(), sa.ForeignKey("workers.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_worker_applications_phone", "worker_applications", ["phone"])
    op.create_index("ix_worker_applications_status", "worker_applications", ["verification_status"])


def downgrade():
    op.drop_index("ix_worker_applications_status", table_name="worker_applications")
    op.drop_index("ix_worker_applications_phone", table_name="worker_applications")
    op.drop_table("worker_applications")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_column("users", "longitude")
    op.drop_column("users", "latitude")
    op.drop_column("users", "terms_accepted")
    op.drop_column("users", "password_hash")
    op.drop_column("users", "preferred_language")
    op.drop_column("users", "address")
    op.drop_column("users", "email")
