from datetime import datetime

from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    # Basic identity
    name = db.Column(db.String(120), nullable=True)

    # Phone authentication
    phone = db.Column(
        db.String(20),
        nullable=False,
        unique=True,
        index=True
    )

    phone_verified = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    # Account role
    # customer | worker | cooperative | admin
    role = db.Column(
        db.String(30),
        nullable=False,
        default="customer"
    )

    # Account status
    # active | suspended | pending
    status = db.Column(
        db.String(30),
        nullable=False,
        default="pending"
    )

    # Timestamps
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "phone_verified": self.phone_verified,
            "role": self.role,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
        }


class OTPVerification(db.Model):
    __tablename__ = "otp_verifications"

    id = db.Column(db.Integer, primary_key=True)

    phone = db.Column(
        db.String(20),
        nullable=False,
        index=True
    )

    # NEVER store the actual OTP.
    otp_hash = db.Column(
        db.String(255),
        nullable=False
    )

    expires_at = db.Column(
        db.DateTime,
        nullable=False
    )

    attempts = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    verified = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def is_expired(self):
        return datetime.utcnow() >= self.expires_at


class Worker(db.Model):
    __tablename__ = "workers"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(120),
        nullable=False
    )

    phone = db.Column(
        db.String(20),
        nullable=False,
        unique=True
    )

    email = db.Column(
        db.String(120),
        unique=True
    )

    profession = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(db.Text)

    experience_years = db.Column(
        db.Integer,
        default=0
    )

    city = db.Column(db.String(100))

    service_area = db.Column(
        db.String(255)
    )

    latitude = db.Column(db.Float)

    longitude = db.Column(db.Float)

    is_verified = db.Column(
        db.Boolean,
        default=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    emergency_available = db.Column(
        db.Boolean,
        default=False
    )

    skills = db.Column(
        db.ARRAY(db.String),
        default=list
    )

    certifications = db.Column(
        db.ARRAY(db.String),
        default=list
    )

    rating = db.Column(
        db.Numeric(2, 1),
        default=0
    )

    review_count = db.Column(
        db.Integer,
        default=0
    )

    starting_price = db.Column(
        db.Numeric(10, 2),
        default=0
    )

    price_unit = db.Column(
        db.String(20),
        default="job"
    )

    available_days = db.Column(
        db.ARRAY(db.String),
        default=list
    )

    languages = db.Column(
        db.ARRAY(db.String),
        default=list
    )

    insurance_status = db.Column(
        db.String(30),
        default="not_registered"
    )

    insurance_provider = db.Column(
        db.String(100)
    )

    cooperative_id = db.Column(
        db.Integer
    )

    profile_image_url = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )