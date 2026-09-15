import os
import random
from datetime import datetime, timedelta

import jwt
from flask import Blueprint, jsonify, request
from sqlalchemy import text
from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db
from .models import User, OTPVerification, Worker, WorkerApplication, Booking

api = Blueprint("api", __name__, url_prefix="/api")

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
    if not phone:
        return None

    phone = (
        str(phone)
        .strip()
        .replace(" ", "")
        .replace("-", "")
        .replace("(", "")
        .replace(")", "")
    )

    if phone.startswith("+91"):
        phone = phone[3:]
    elif phone.startswith("91") and len(phone) == 12:
        phone = phone[2:]

    if (
        len(phone) != 10
        or not phone.isdigit()
        or phone[0] not in "6789"
    ):
        return None

    return phone


def validate_email(email):
    if not email:
        return False

    email = str(email).strip().lower()

    if "@" not in email:
        return False

    domain = email.split("@")[-1]

    return "." in domain and len(domain) > 1


def generate_otp():
    return str(random.randint(100000, 999999))


def create_token(user):
    return jwt.encode(
        {
            "user_id": user.id,
            "role": user.role,
            "phone": user.phone,
            "exp": datetime.utcnow()
            + timedelta(hours=JWT_EXPIRY_HOURS),
        },
        JWT_SECRET,
        algorithm="HS256",
    )


def get_auth_user():
    auth = request.headers.get("Authorization", "")

    if not auth.startswith("Bearer "):
        return None

    try:
        token = auth.split(" ", 1)[1]

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
        )

        return db.session.get(
            User,
            payload.get("user_id")
        )

    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError,
    ):
        return None


def require_auth():
    user = get_auth_user()

    if (
        not user
        or not user.phone_verified
        or user.status != "active"
    ):
        return None, (
            jsonify({
                "error": "Authentication required"
            }),
            401,
        )

    return user, None


def send_otp(phone, otp):
    print("\n" + "=" * 60)
    print("GHARPE OTP (LOCAL DEVELOPMENT)")
    print("Phone:", phone)
    print("OTP:", otp)
    print("Valid for: 5 minutes")
    print("=" * 60 + "\n")

    return True


def parse_list(value):
    if isinstance(value, list):
        return [
            str(x).strip()
            for x in value
            if str(x).strip()
        ]

    if isinstance(value, str):
        return [
            x.strip()
            for x in value.split(",")
            if x.strip()
        ]

    return []


def parse_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


# ============================================================
# HEALTH
# ============================================================

@api.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "gharpe-backend",
    })


@api.get("/health/db")
def database_health():
    db.session.execute(text("SELECT 1"))

    return jsonify({
        "status": "ok",
        "database": "connected",
    })


# ============================================================
# REGISTER
# ============================================================

@api.post("/auth/register")
def register():
    data = request.get_json(silent=True) or {}

    role = str(
        data.get("role", "customer")
    ).strip().lower()

    name = str(
        data.get("name", "")
    ).strip()

    phone = normalize_phone(
        data.get("phone")
    )

    email = str(
        data.get("email", "")
    ).strip().lower()

    password = str(
        data.get("password", "")
    )

    confirm_password = str(
        data.get("confirm_password", "")
    )

    # --------------------------------------------------------
    # BASIC VALIDATION
    # --------------------------------------------------------

    if role not in {"customer", "worker"}:
        return jsonify({
            "error": "Invalid registration role"
        }), 400

    if not name:
        return jsonify({
            "error": "Full name is required"
        }), 400

    if not phone:
        return jsonify({
            "error": "Valid Indian phone number is required"
        }), 400

    if not validate_email(email):
        return jsonify({
            "error": "Valid email address is required"
        }), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters"
        }), 400

    if password != confirm_password:
        return jsonify({
            "error": "Passwords do not match"
        }), 400

    if not bool(data.get("terms_accepted")):
        return jsonify({
            "error": (
                "You must agree to the "
                "Terms and Conditions"
            )
        }), 400

    # --------------------------------------------------------
    # DUPLICATE ACCOUNT CHECK
    # --------------------------------------------------------

    existing_email = User.query.filter(
        User.email == email
    ).first()

    if existing_email and existing_email.phone != phone:
        return jsonify({
            "error": (
                "An account with this email "
                "already exists"
            )
        }), 409

    user = User.query.filter_by(
        phone=phone
    ).first()

    if user and user.phone_verified:
        return jsonify({
            "error": (
                "An account with this phone "
                "number already exists"
            )
        }), 409

    if not user:
        user = User(phone=phone)
        db.session.add(user)

    # --------------------------------------------------------
    # USER DATA
    # --------------------------------------------------------

    user.name = name
    user.email = email
    user.address = (
        str(data.get("address", "")).strip()
        or None
    )

    user.preferred_language = (
        str(
            data.get(
                "preferred_language",
                "English"
            )
        ).strip()
        or "English"
    )

    user.password_hash = generate_password_hash(
        password
    )

    user.terms_accepted = True

    user.latitude = data.get("latitude")
    user.longitude = data.get("longitude")

    user.role = role
    user.phone_verified = False
    user.status = "pending"

    # --------------------------------------------------------
    # CUSTOMER VALIDATION
    # --------------------------------------------------------

    if role == "customer" and not user.address:
        return jsonify({
            "error": "Address is required"
        }), 400

    # --------------------------------------------------------
    # WORKER REGISTRATION
    # --------------------------------------------------------

    if role == "worker":

        required = [
            "address",
            "profession",
            "city",
            "state",
            "district",
            "pincode",
            "id_type",
            "id_number",
            "id_proof_data",
        ]

        missing = [
            field
            for field in required
            if not str(
                data.get(field, "")
            ).strip()
        ]

        if missing:
            return jsonify({
                "error": (
                    "Missing worker fields: "
                    + ", ".join(missing)
                )
            }), 400

        pincode = str(
            data.get("pincode", "")
        ).strip()

        if len(pincode) != 6 or not pincode.isdigit():
            return jsonify({
                "error": "Pincode must be 6 digits"
            }), 400

        application = WorkerApplication.query.filter_by(
            user_id=user.id
        ).first()

        if not application:
            application = WorkerApplication(
                user_id=user.id
            )

            db.session.add(application)

        application.name = name
        application.phone = phone
        application.email = email

        application.address = str(
            data.get("address")
        ).strip()

        application.profile_photo_data = (
            data.get("profile_photo_data")
        )

        application.profession = str(
            data.get("profession")
        ).strip()

        application.experience_years = parse_int(
            data.get("experience_years")
        )

        application.skills = parse_list(
            data.get("skills")
        )

        application.certifications = parse_list(
            data.get("certifications")
        )

        application.available_days = parse_list(
            data.get("available_days")
        )

        application.start_time = (
            str(
                data.get("start_time", "")
            ).strip()
            or None
        )

        application.end_time = (
            str(
                data.get("end_time", "")
            ).strip()
            or None
        )

        application.availability_type = (
            str(
                data.get(
                    "availability_type",
                    "regular"
                )
            ).strip()
            or "regular"
        )

        application.city = str(
            data.get("city")
        ).strip()

        application.state = str(
            data.get("state")
        ).strip()

        application.district = str(
            data.get("district")
        ).strip()

        application.pincode = pincode

        application.id_type = str(
            data.get("id_type")
        ).strip()

        application.id_number = str(
            data.get("id_number")
        ).strip()

        application.id_proof_data = str(
            data.get("id_proof_data")
        ).strip()

        application.verification_status = "pending"

    # --------------------------------------------------------
    # CREATE OTP
    # --------------------------------------------------------

    OTPVerification.query.filter_by(
        phone=phone,
        verified=False
    ).update({
        "verified": True
    })

    otp = generate_otp()

    db.session.add(
        OTPVerification(
            phone=phone,
            otp_hash=generate_password_hash(otp),
            expires_at=(
                datetime.utcnow()
                + timedelta(
                    minutes=OTP_EXPIRY_MINUTES
                )
            ),
            attempts=0,
            verified=False,
        )
    )

    db.session.commit()

    send_otp(phone, otp)

    return jsonify({
        "message": "OTP sent successfully",
        "phone": phone,
        "expires_in": OTP_EXPIRY_MINUTES * 60,
        "user_id": user.id,
    }), 200


# ============================================================
# LOGIN
# ============================================================

@api.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}

    identifier = str(
        data.get("identifier", "")
    ).strip()

    password = str(
        data.get("password", "")
    )

    # --------------------------------------------------------
    # VALIDATE INPUT
    # --------------------------------------------------------

    if not identifier:
        return jsonify({
            "error": (
                "Email address or phone number "
                "is required"
            )
        }), 400

    if not password:
        return jsonify({
            "error": "Password is required"
        }), 400

    # --------------------------------------------------------
    # FIND ACCOUNT
    #
    # identifier can be:
    #   email
    #   OR
    #   phone
    # --------------------------------------------------------

    user = None

    normalized_phone = normalize_phone(
        identifier
    )

    if normalized_phone:
        user = User.query.filter_by(
            phone=normalized_phone
        ).first()

    else:
        normalized_email = (
            identifier.lower()
        )

        if not validate_email(
            normalized_email
        ):
            return jsonify({
                "error": (
                    "Enter a valid email "
                    "address or phone number"
                )
            }), 400

        user = User.query.filter_by(
            email=normalized_email
        ).first()

    # --------------------------------------------------------
    # ACCOUNT CHECK
    # --------------------------------------------------------

    if not user:
        return jsonify({
            "error": (
                "No account found with "
                "that email or phone number"
            )
        }), 401

    # --------------------------------------------------------
    # PASSWORD CHECK
    # --------------------------------------------------------

    if (
        not user.password_hash
        or not check_password_hash(
            user.password_hash,
            password
        )
    ):
        return jsonify({
            "error": "Incorrect password"
        }), 401

    # --------------------------------------------------------
    # PHONE VERIFICATION CHECK
    # --------------------------------------------------------

    if not user.phone_verified:
        return jsonify({
            "error": (
                "Phone number is not verified. "
                "Please complete registration first."
            )
        }), 403

    # --------------------------------------------------------
    # CREATE LOGIN OTP
    # --------------------------------------------------------

    OTPVerification.query.filter_by(
        phone=user.phone,
        verified=False
    ).update({
        "verified": True
    })

    otp = generate_otp()

    db.session.add(
        OTPVerification(
            phone=user.phone,
            otp_hash=generate_password_hash(otp),
            expires_at=(
                datetime.utcnow()
                + timedelta(
                    minutes=OTP_EXPIRY_MINUTES
                )
            ),
            attempts=0,
            verified=False,
        )
    )

    db.session.commit()

    send_otp(user.phone, otp)

    return jsonify({
        "message": "Login OTP sent successfully",
        "phone": user.phone,
        "expires_in": OTP_EXPIRY_MINUTES * 60,
        "user_id": user.id,
    }), 200


# ============================================================
# VERIFY OTP
# ============================================================

@api.post("/auth/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}

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

    record = (
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

    if not record:
        return jsonify({
            "error": (
                "No active OTP found. "
                "Please request a new OTP."
            )
        }), 400

    if record.is_expired():
        return jsonify({
            "error": (
                "OTP has expired. "
                "Please request a new OTP."
            )
        }), 400

    if record.attempts >= MAX_OTP_ATTEMPTS:
        return jsonify({
            "error": (
                "Too many OTP attempts. "
                "Please request a new OTP."
            )
        }), 429

    record.attempts += 1

    if not check_password_hash(
        record.otp_hash,
        otp
    ):
        db.session.commit()

        return jsonify({
            "error": "Invalid OTP",
            "attempts_remaining": (
                MAX_OTP_ATTEMPTS
                - record.attempts
            ),
        }), 400

    record.verified = True

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

    return jsonify({
        "message": "Phone verified successfully",
        "token": create_token(user),
        "user": user.to_dict(),
    }), 200


# ============================================================
# RESEND OTP
# ============================================================

@api.post("/auth/resend-otp")
def resend_otp():
    data = request.get_json(silent=True) or {}

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
            "error": (
                "No account found for "
                "this phone number"
            )
        }), 404

    OTPVerification.query.filter_by(
        phone=phone,
        verified=False
    ).update({
        "verified": True
    })

    otp = generate_otp()

    db.session.add(
        OTPVerification(
            phone=phone,
            otp_hash=generate_password_hash(otp),
            expires_at=(
                datetime.utcnow()
                + timedelta(
                    minutes=OTP_EXPIRY_MINUTES
                )
            ),
            attempts=0,
            verified=False,
        )
    )

    db.session.commit()

    send_otp(phone, otp)

    return jsonify({
        "message": "OTP resent successfully",
        "phone": phone,
        "expires_in": OTP_EXPIRY_MINUTES * 60,
    }), 200


# ============================================================
# CURRENT USER
# ============================================================

@api.get("/auth/me")
def current_user():
    user, error = require_auth()

    if error:
        return error

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
        is_active=True,
        is_verified=True
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

    workers = (
        query
        .order_by(
            Worker.rating.desc(),
            Worker.id.asc()
        )
        .all()
    )

    return jsonify([
        {
            "id": w.id,
            "name": w.name,
            "phone": w.phone,
            "email": w.email,
            "avatarInitials": "".join(
                word[0]
                for word in w.name.split()[:2]
            ).upper(),
            "category": (
                w.profession.lower()
                if w.profession
                else ""
            ),
            "location": (
                w.city
                or w.service_area
                or "Location not specified"
            ),
            "yearsExperience": (
                w.experience_years or 0
            ),
            "skills": (
                w.skills
                or [w.profession]
            ),
            "startingPrice": float(
                w.starting_price or 0
            ),
            "cooperativeId": w.cooperative_id,
            "rating": float(
                w.rating or 0
            ),
            "reviewCount": (
                w.review_count or 0
            ),
            "verified": bool(
                w.is_verified
            ),
            "bio": (
                w.description
                or "No description available."
            ),
            "certifications": (
                w.certifications or []
            ),
            "availableDays": (
                w.available_days or []
            ),
            "emergencyAvailable": bool(
                w.emergency_available
            ),
        }
        for w in workers
    ])


# ============================================================
# WORKER APPLICATION
# ============================================================

@api.get("/workers/me")
def worker_application_me():
    user, error = require_auth()

    if error:
        return error

    if user.role != "worker":
        return jsonify({
            "error": "Worker account required"
        }), 403

    application = WorkerApplication.query.filter_by(
        user_id=user.id
    ).first()

    return jsonify({
        "application": (
            application.to_dict()
            if application
            else None
        )
    })


# ============================================================
# BOOKINGS - GET
# ============================================================

@api.get("/bookings")
def get_bookings():
    user, error = require_auth()

    if error:
        return error

    if user.role == "worker":

        worker = Worker.query.filter_by(
            phone=user.phone
        ).first()

        if not worker:
            return jsonify([])

        bookings = (
            Booking.query
            .filter_by(
                worker_id=worker.id
            )
            .order_by(
                Booking.date.asc(),
                Booking.time.asc(),
                Booking.id.desc()
            )
            .all()
        )

    else:

        bookings = (
            Booking.query
            .filter_by(
                customer_id=user.id
            )
            .order_by(
                Booking.date.asc(),
                Booking.time.asc(),
                Booking.id.desc()
            )
            .all()
        )

    return jsonify([
        b.to_dict(
            customer=db.session.get(
                User,
                b.customer_id
            ),
            worker=db.session.get(
                Worker,
                b.worker_id
            ),
        )
        for b in bookings
    ])


# ============================================================
# BOOKINGS - CREATE
# ============================================================

@api.post("/bookings")
def create_booking():
    user, error = require_auth()

    if error:
        return error

    if user.role != "customer":
        return jsonify({
            "error": (
                "Only customers can "
                "create bookings"
            )
        }), 403

    data = request.get_json(
        silent=True
    ) or {}

    try:
        worker_id = int(
            data.get("worker_id")
        )
    except (
        TypeError,
        ValueError
    ):
        worker_id = 0

    worker = db.session.get(
        Worker,
        worker_id
    )

    if (
        not worker
        or not worker.is_active
        or not worker.is_verified
    ):
        return jsonify({
            "error": "Verified worker not found"
        }), 404

    service = str(
        data.get(
            "service",
            worker.profession
        )
    ).strip()

    date = str(
        data.get("date", "")
    ).strip()

    time = str(
        data.get("time", "")
    ).strip()

    address = str(
        data.get("address", "")
    ).strip()

    description = str(
        data.get("description", "")
    ).strip()

    if (
        not service
        or not date
        or not time
        or not address
    ):
        return jsonify({
            "error": (
                "Service, date, time "
                "and address are required"
            )
        }), 400

    booking = Booking(
        customer_id=user.id,
        worker_id=worker.id,
        service=service,
        date=date,
        time=time,
        address=address,
        description=description,
        status="pending",
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Booking created successfully",
        "booking": booking.to_dict(
            user,
            worker
        ),
    }), 201


# ============================================================
# BOOKINGS - UPDATE STATUS
# ============================================================

@api.patch(
    "/bookings/<int:booking_id>/status"
)
def update_booking_status(booking_id):
    user, error = require_auth()

    if error:
        return error

    booking = db.session.get(
        Booking,
        booking_id
    )

    if not booking:
        return jsonify({
            "error": "Booking not found"
        }), 404

    data = request.get_json(
        silent=True
    ) or {}

    status = str(
        data.get("status", "")
    ).strip().lower()

    allowed = {
        "pending",
        "confirmed",
        "completed",
        "cancelled",
    }

    if status not in allowed:
        return jsonify({
            "error": "Invalid booking status"
        }), 400

    worker = (
        Worker.query.filter_by(
            phone=user.phone
        ).first()
        if user.role == "worker"
        else None
    )

    if (
        user.role == "worker"
        and (
            not worker
            or booking.worker_id != worker.id
        )
    ):
        return jsonify({
            "error": "Not allowed"
        }), 403

    if (
        user.role == "customer"
        and booking.customer_id != user.id
    ):
        return jsonify({
            "error": "Not allowed"
        }), 403

    booking.status = status

    db.session.commit()

    return jsonify({
        "message": "Booking updated",
        "booking": booking.to_dict(
            db.session.get(
                User,
                booking.customer_id
            ),
            db.session.get(
                Worker,
                booking.worker_id
            ),
        ),
    })