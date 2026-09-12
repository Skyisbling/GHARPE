import os
import random
from datetime import datetime, timedelta

import jwt

from flask import Blueprint, jsonify, request

from werkzeug.security import check_password_hash

from sqlalchemy import text

from .extensions import db
from .models import User, OTPVerification, Worker


api = Blueprint(
    "api",
    __name__,
    url_prefix="/api"
)


# ============================================================
# CONFIG
# ============================================================

OTP_EXPIRY_MINUTES = 5
MAX_OTP_ATTEMPTS = 5

JWT_EXPIRY_HOURS = 24

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "gharpe-development-secret-change-this"
)


# ============================================================
# HELPERS
# ============================================================

def normalize_phone(phone):
    """
    Normalize Indian phone numbers.

    Accepted examples:

    9876543210
    +919876543210
    919876543210
    """

    if not phone:
        return None

    phone = str(phone).strip()

    # Remove spaces, hyphens and brackets
    phone = (
        phone
        .replace(" ", "")
        .replace("-", "")
        .replace("(", "")
        .replace(")", "")
    )

    if phone.startswith("+91"):
        phone = phone[3:]

    elif phone.startswith("91") and len(phone) == 12:
        phone = phone[2:]

    if len(phone) != 10:
        return None

    if not phone.isdigit():
        return None

    if phone[0] not in "6789":
        return None

    return phone


def generate_otp():
    return str(
        random.randint(100000, 999999)
    )


def create_token(user):
    payload = {
        "user_id": user.id,
        "role": user.role,
        "phone": user.phone,
        "exp": datetime.utcnow()
        + timedelta(hours=JWT_EXPIRY_HOURS),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256"
    )


def get_auth_user():
    authorization = request.headers.get(
        "Authorization",
        ""
    )

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.split(
        " ",
        1
    )[1]

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        user = db.session.get(
            User,
            payload.get("user_id")
        )

        return user

    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError
    ):
        return None


def send_otp(phone, otp):
    """
    DEVELOPMENT OTP SENDER

    For now we print the OTP in the backend terminal.

    Later this function will be replaced by
    a real SMS provider without changing the
    registration / verification architecture.
    """

    print("")
    print("=" * 60)
    print("GHARPE OTP")
    print("=" * 60)
    print(f"Phone: {phone}")
    print(f"OTP:   {otp}")
    print("Valid for: 5 minutes")
    print("=" * 60)
    print("")

    return True


# ============================================================
# HEALTH
# ============================================================

@api.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "gharpe-backend"
    })


@api.get("/health/db")
def database_health():
    db.session.execute(
        text("SELECT 1")
    )

    return jsonify({
        "status": "ok",
        "database": "connected"
    })


# ============================================================
# AUTH — REGISTER
# ============================================================

@api.post("/auth/register")
def register():

    data = request.get_json(
        silent=True
    ) or {}

    name = str(
        data.get("name", "")
    ).strip()

    phone = normalize_phone(
        data.get("phone")
    )

    role = str(
        data.get("role", "customer")
    ).strip().lower()

    allowed_roles = {
        "customer",
        "worker",
        "cooperative"
    }

    if not name:
        return jsonify({
            "error": "Name is required"
        }), 400

    if not phone:
        return jsonify({
            "error": "Valid Indian phone number is required"
        }), 400

    if role not in allowed_roles:
        return jsonify({
            "error": "Invalid registration role"
        }), 400

    user = User.query.filter_by(
        phone=phone
    ).first()

    if user:

        if user.phone_verified:
            return jsonify({
                "error": "An account with this phone number already exists",
                "user": user.to_dict()
            }), 409

        user.name = name
        user.role = role

    else:

        user = User(
            name=name,
            phone=phone,
            role=role,
            phone_verified=False,
            status="pending"
        )

        db.session.add(user)

    # Invalidate old OTPs
    OTPVerification.query.filter_by(
        phone=phone,
        verified=False
    ).update({
        "verified": True
    })

    otp = generate_otp()

    otp_record = OTPVerification(
        phone=phone,
        otp_hash=__import__(
            "werkzeug.security",
            fromlist=["generate_password_hash"]
        ).generate_password_hash(otp),
        expires_at=datetime.utcnow()
        + timedelta(minutes=OTP_EXPIRY_MINUTES),
        attempts=0,
        verified=False
    )

    db.session.add(
        otp_record
    )

    db.session.commit()

    send_otp(
        phone,
        otp
    )

    return jsonify({
        "message": "OTP sent successfully",
        "phone": phone,
        "expires_in": OTP_EXPIRY_MINUTES * 60,
        "user_id": user.id
    }), 200


# ============================================================
# AUTH — VERIFY OTP
# ============================================================

@api.post("/auth/verify-otp")
def verify_otp():

    data = request.get_json(
        silent=True
    ) or {}

    phone = normalize_phone(
        data.get("phone")
    )

    otp = str(
        data.get("otp", "")
    ).strip()

    if not phone:
        return jsonify({
            "error": "Valid phone number is required"
        }), 400

    if not otp.isdigit() or len(otp) != 6:
        return jsonify({
            "error": "OTP must be 6 digits"
        }), 400

    otp_record = (
        OTPVerification.query
        .filter_by(
            phone=phone,
            verified=False
        )
        .order_by(
            OTPVerification.created_at.desc()
        )
        .first()
    )

    if not otp_record:
        return jsonify({
            "error": "No active OTP found. Please request a new OTP."
        }), 400

    if otp_record.is_expired():
        return jsonify({
            "error": "OTP has expired. Please request a new OTP."
        }), 400

    if otp_record.attempts >= MAX_OTP_ATTEMPTS:
        return jsonify({
            "error": "Too many OTP attempts. Please request a new OTP."
        }), 429

    otp_record.attempts += 1

    if not check_password_hash(
        otp_record.otp_hash,
        otp
    ):

        db.session.commit()

        return jsonify({
            "error": "Invalid OTP",
            "attempts_remaining":
                MAX_OTP_ATTEMPTS
                - otp_record.attempts
        }), 400

    otp_record.verified = True

    user = User.query.filter_by(
        phone=phone
    ).first()

    if not user:
        db.session.rollback()

        return jsonify({
            "error": "User account not found"
        }), 404

    user.phone_verified = True
    user.status = "active"

    db.session.commit()

    token = create_token(
        user
    )

    return jsonify({
        "message": "Phone verified successfully",
        "token": token,
        "user": user.to_dict()
    }), 200


# ============================================================
# AUTH — RESEND OTP
# ============================================================

@api.post("/auth/resend-otp")
def resend_otp():

    data = request.get_json(
        silent=True
    ) or {}

    phone = normalize_phone(
        data.get("phone")
    )

    if not phone:
        return jsonify({
            "error": "Valid phone number is required"
        }), 400

    user = User.query.filter_by(
        phone=phone
    ).first()

    if not user:
        return jsonify({
            "error": "No account found for this phone number"
        }), 404

    if user.phone_verified:
        return jsonify({
            "error": "Phone number is already verified"
        }), 400

    OTPVerification.query.filter_by(
        phone=phone,
        verified=False
    ).update({
        "verified": True
    })

    otp = generate_otp()

    otp_record = OTPVerification(
        phone=phone,
        otp_hash=__import__(
            "werkzeug.security",
            fromlist=["generate_password_hash"]
        ).generate_password_hash(otp),
        expires_at=datetime.utcnow()
        + timedelta(minutes=OTP_EXPIRY_MINUTES),
        attempts=0,
        verified=False
    )

    db.session.add(
        otp_record
    )

    db.session.commit()

    send_otp(
        phone,
        otp
    )

    return jsonify({
        "message": "OTP resent successfully",
        "phone": phone,
        "expires_in": OTP_EXPIRY_MINUTES * 60
    }), 200


# ============================================================
# AUTH — CURRENT USER
# ============================================================

@api.get("/auth/me")
def current_user():

    user = get_auth_user()

    if not user:
        return jsonify({
            "error": "Authentication required"
        }), 401

    return jsonify({
        "user": user.to_dict()
    })


# ============================================================
# WORKERS
# ============================================================

@api.get("/workers")
def get_workers():

    service = request.args.get(
        "service",
        ""
    ).strip()

    location = request.args.get(
        "location",
        ""
    ).strip()

    query = Worker.query.filter_by(
        is_active=True
    )

    if service:
        query = query.filter(
            Worker.profession.ilike(
                f"%{service}%"
            )
        )

    if location:
        query = query.filter(
            (
                Worker.city.ilike(
                    f"%{location}%"
                )
            )
            |
            (
                Worker.service_area.ilike(
                    f"%{location}%"
                )
            )
        )

    workers = query.all()

    return jsonify([
        {
            "id": worker.id,
            "name": worker.name,
            "phone": worker.phone,
            "email": worker.email,

            "avatarInitials": "".join(
                word[0]
                for word in worker.name.split()[:2]
            ).upper(),

            "category": worker.profession.lower(),

            "location":
                worker.city
                or worker.service_area
                or "Location not specified",

            "yearsExperience":
                worker.experience_years or 0,

            "skills":
                worker.skills
                if worker.skills
                else [worker.profession],

            "startingPrice":
                float(worker.starting_price or 0),

            "cooperativeId":
                worker.cooperative_id,

            "rating":
                float(worker.rating or 0),

            "reviewCount":
                worker.review_count or 0,

            "verified":
                bool(worker.is_verified),

            "bio":
                worker.description
                or "No description available.",

            "certifications":
                worker.certifications
                if worker.certifications
                else [],

            "availableDays":
                worker.available_days
                if worker.available_days
                else [],

            "emergencyAvailable":
                bool(worker.emergency_available),
        }

        for worker in workers
    ])


@api.post("/workers")
def create_worker():

    data = request.get_json(
        silent=True
    ) or {}

    required_fields = [
        "name",
        "phone",
        "profession"
    ]

    for field in required_fields:

        if not data.get(field):

            return jsonify({
                "error":
                    f"{field} is required"
            }), 400

    phone = normalize_phone(
        data["phone"]
    )

    if not phone:

        return jsonify({
            "error":
                "Valid Indian phone number is required"
        }), 400

    existing_worker = Worker.query.filter_by(
        phone=phone
    ).first()

    if existing_worker:

        return jsonify({
            "error":
                "Worker with this phone already exists"
        }), 409

    worker = Worker(
        name=data["name"],
        phone=phone,
        email=data.get("email"),
        profession=data["profession"],
        description=data.get("description"),
        experience_years=data.get(
            "experience_years",
            0
        ),
        city=data.get("city"),
        service_area=data.get(
            "service_area"
        ),
        latitude=data.get(
            "latitude"
        ),
        longitude=data.get(
            "longitude"
        ),

        # IMPORTANT:
        # Publicly-created workers are NOT
        # automatically official/verified.
        is_verified=False,
        is_active=data.get(
            "is_active",
            True
        ),

        emergency_available=data.get(
            "emergency_available",
            False
        ),

        skills=data.get(
            "skills",
            []
        ),

        certifications=data.get(
            "certifications",
            []
        ),

        available_days=data.get(
            "available_days",
            []
        ),

        languages=data.get(
            "languages",
            []
        ),

        starting_price=data.get(
            "starting_price",
            0
        ),

        cooperative_id=data.get(
            "cooperative_id"
        )
    )

    db.session.add(
        worker
    )

    db.session.commit()

    return jsonify({
        "message":
            "Worker created successfully",
        "id":
            worker.id,
        "verified":
            worker.is_verified
    }), 201