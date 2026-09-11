from datetime import datetime

from .extensions import db


class Worker(db.Model):
    __tablename__ = "workers"

    # Basic identity
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

    # Contact
    phone = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True)

    # Professional information
    profession = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    experience_years = db.Column(db.Integer, default=0)

    # Location
    city = db.Column(db.String(100))
    service_area = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    # Verification / availability
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    emergency_available = db.Column(db.Boolean, default=False)

    # Skills and certifications
    skills = db.Column(db.ARRAY(db.String), default=list)
    certifications = db.Column(db.ARRAY(db.String), default=list)

    # Ratings
    rating = db.Column(db.Numeric(2, 1), default=0)
    review_count = db.Column(db.Integer, default=0)

    # Pricing
    starting_price = db.Column(db.Numeric(10, 2), default=0)
    price_unit = db.Column(db.String(20), default="job")

    # Scheduling
    available_days = db.Column(db.ARRAY(db.String), default=list)

    # Languages
    languages = db.Column(db.ARRAY(db.String), default=list)

    # Worker welfare / insurance
    insurance_status = db.Column(
        db.String(30),
        default="not_registered"
    )
    insurance_provider = db.Column(db.String(100))

    # Cooperative
    cooperative_id = db.Column(db.Integer)

    # Profile
    profile_image_url = db.Column(db.Text)

    # Timestamps
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