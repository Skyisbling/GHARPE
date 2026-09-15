from datetime import datetime
from .extensions import db
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=False, unique=True, index=True)
    email = db.Column(db.String(160), unique=True, index=True)
    address = db.Column(db.String(500))
    preferred_language = db.Column(db.String(50))
    password_hash = db.Column(db.String(255))
    terms_accepted = db.Column(db.Boolean, nullable=False, default=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    phone_verified = db.Column(db.Boolean, nullable=False, default=False)
    role = db.Column(db.String(30), nullable=False, default="customer")
    status = db.Column(db.String(30), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "phone": self.phone, "email": self.email,
            "address": self.address, "preferred_language": self.preferred_language,
            "terms_accepted": self.terms_accepted, "latitude": self.latitude, "longitude": self.longitude,
            "phone_verified": self.phone_verified, "role": self.role, "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class OTPVerification(db.Model):
    __tablename__ = "otp_verifications"
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), nullable=False, index=True)
    otp_hash = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    attempts = db.Column(db.Integer, nullable=False, default=0)
    verified = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def is_expired(self):
        return datetime.utcnow() >= self.expires_at


class Worker(db.Model):
    __tablename__ = "workers"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True)
    profession = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    experience_years = db.Column(db.Integer, default=0)
    city = db.Column(db.String(100))
    service_area = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    emergency_available = db.Column(db.Boolean, default=False)
    skills = db.Column(db.ARRAY(db.String), default=list)
    certifications = db.Column(db.ARRAY(db.String), default=list)
    rating = db.Column(db.Numeric(2, 1), default=0)
    review_count = db.Column(db.Integer, default=0)
    starting_price = db.Column(db.Numeric(10, 2), default=0)
    price_unit = db.Column(db.String(20), default="job")
    available_days = db.Column(db.ARRAY(db.String), default=list)
    languages = db.Column(db.ARRAY(db.String), default=list)
    insurance_status = db.Column(db.String(30), default="not_registered")
    insurance_provider = db.Column(db.String(100))
    cooperative_id = db.Column(db.Integer)
    profile_image_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WorkerApplication(db.Model):
    __tablename__ = "worker_applications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    name = db.Column(db.String(160), nullable=False)
    phone = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(160))
    address = db.Column(db.String(500), nullable=False)
    profile_photo_data = db.Column(db.Text)
    profession = db.Column(db.String(100), nullable=False)
    experience_years = db.Column(db.Integer, default=0, nullable=False)
    skills = db.Column(db.ARRAY(db.String), default=list, nullable=False)
    certifications = db.Column(db.ARRAY(db.String), default=list, nullable=False)
    available_days = db.Column(db.ARRAY(db.String), default=list, nullable=False)
    start_time = db.Column(db.String(10))
    end_time = db.Column(db.String(10))
    availability_type = db.Column(db.String(40))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    id_type = db.Column(db.String(50), nullable=False)
    id_number = db.Column(db.String(100), nullable=False)
    id_proof_data = db.Column(db.Text, nullable=False)
    verification_status = db.Column(db.String(30), default="pending", nullable=False)
    official_worker_id = db.Column(db.Integer, db.ForeignKey("workers.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id, "name": self.name, "phone": self.phone,
            "email": self.email, "address": self.address, "profession": self.profession,
            "experience_years": self.experience_years, "skills": self.skills or [],
            "certifications": self.certifications or [], "available_days": self.available_days or [],
            "start_time": self.start_time, "end_time": self.end_time,
            "availability_type": self.availability_type, "city": self.city, "state": self.state,
            "district": self.district, "pincode": self.pincode, "id_type": self.id_type,
            "verification_status": self.verification_status, "official_worker_id": self.official_worker_id,
        }


class Booking(db.Model):
    __tablename__ = "bookings"
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("workers.id"), nullable=False, index=True)
    service = db.Column(db.String(120), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(30), nullable=False, default="pending", index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self, customer=None, worker=None):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "worker_id": self.worker_id,
            "customer_name": customer.name if customer else None,
            "customer_phone": customer.phone if customer else None,
            "worker_name": worker.name if worker else None,
            "worker_phone": worker.phone if worker else None,
            "service": self.service,
            "date": self.date,
            "time": self.time,
            "address": self.address,
            "description": self.description or "",
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
