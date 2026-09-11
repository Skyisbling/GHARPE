from flask import Blueprint, jsonify, request
from sqlalchemy import text

from .extensions import db
from .models import Worker

api = Blueprint("api", __name__, url_prefix="/api")


@api.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "gharpe-backend"
    })


@api.get("/health/db")
def database_health():
    db.session.execute(text("SELECT 1"))

    return jsonify({
        "status": "ok",
        "database": "connected"
    })


@api.get("/workers")
def get_workers():
    service = request.args.get("service", "").strip()
    location = request.args.get("location", "").strip()

    query = Worker.query.filter_by(is_active=True)

    if service:
        query = query.filter(
            Worker.profession.ilike(f"%{service}%")
        )

    if location:
        query = query.filter(
            (Worker.city.ilike(f"%{location}%")) |
            (Worker.service_area.ilike(f"%{location}%"))
        )

    workers = query.all()

    return jsonify([
        {
            "id": worker.id,
            "name": worker.name,
            "phone": worker.phone,
            "email": worker.email,
            "avatarInitials": "".join(
                word[0] for word in worker.name.split()[:2]
            ).upper(),
            "category": worker.profession.lower(),
            "location": worker.city or worker.service_area or "Location not specified",
            "yearsExperience": worker.experience_years or 0,
            "skills": [worker.profession],
            "startingPrice": 0,
            "cooperativeId": None,
            "rating": 0,
            "reviewCount": 0,
            "verified": worker.is_verified,
            "bio": worker.description or "No description available.",
            "certifications": [],
            "availableDays": [],
            "emergencyAvailable": False,
        }
        for worker in workers
    ])

@api.post("/workers")
def create_worker():
    from flask import request

    data = request.get_json()

    worker = Worker(
        name=data["name"],
        phone=data["phone"],
        email=data.get("email"),
        profession=data["profession"],
        description=data.get("description"),
        experience_years=data.get("experience_years", 0),
        city=data.get("city"),
        service_area=data.get("service_area"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        is_verified=data.get("is_verified", False),
    )

    db.session.add(worker)
    db.session.commit()

    return jsonify({
        "message": "Worker created successfully",
        "id": worker.id
    }), 201