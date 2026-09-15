from werkzeug.security import generate_password_hash

from app import create_app
from app.extensions import db
from app.models import User, Worker


app = create_app()


with app.app_context():

    # ============================================================
    # CUSTOMER TEST ACCOUNT
    # ============================================================

    customer_phone = "9876543211"
    customer_email = "customer@gharpe.test"

    customer = User.query.filter(
        (User.phone == customer_phone) |
        (User.email == customer_email)
    ).first()

    if not customer:
        customer = User(
            name="Test Customer",
            phone=customer_phone,
            email=customer_email,
            address="Test Address, Kolkata, West Bengal",
            preferred_language="English",
            password_hash=generate_password_hash("Customer@123"),
            terms_accepted=True,
            phone_verified=True,
            role="customer",
            status="active",
        )

        db.session.add(customer)
        print("Created customer account.")

    else:
        customer.name = "Test Customer"
        customer.phone = customer_phone
        customer.email = customer_email
        customer.password_hash = generate_password_hash("Customer@123")
        customer.phone_verified = True
        customer.role = "customer"
        customer.status = "active"
        customer.terms_accepted = True

        print("Updated customer account.")


    # ============================================================
    # WORKER USER ACCOUNT
    # ============================================================

    worker_phone = "9876543212"
    worker_email = "worker@gharpe.test"

    worker_user = User.query.filter(
        (User.phone == worker_phone) |
        (User.email == worker_email)
    ).first()

    if not worker_user:
        worker_user = User(
            name="Test Worker",
            phone=worker_phone,
            email=worker_email,
            address="Test Worker Address, Kolkata, West Bengal",
            preferred_language="English",
            password_hash=generate_password_hash("Worker@123"),
            terms_accepted=True,
            phone_verified=True,
            role="worker",
            status="active",
        )

        db.session.add(worker_user)
        db.session.flush()

        print("Created worker user account.")

    else:
        worker_user.name = "Test Worker"
        worker_user.phone = worker_phone
        worker_user.email = worker_email
        worker_user.password_hash = generate_password_hash("Worker@123")
        worker_user.phone_verified = True
        worker_user.role = "worker"
        worker_user.status = "active"
        worker_user.terms_accepted = True

        db.session.flush()

        print("Updated worker user account.")


    # ============================================================
    # OFFICIAL WORKER RECORD
    # ============================================================

    official_worker = Worker.query.filter_by(
        phone=worker_phone
    ).first()

    if not official_worker:
        official_worker = Worker(
            name="Test Worker",
            phone=worker_phone,
            email=worker_email,
            profession="Electrician",
            description="Test verified worker account for GHARPE prototype.",
            experience_years=5,
            city="Kolkata",
            service_area="Kolkata",
            is_verified=True,
            is_active=True,
            emergency_available=True,
            skills=[
                "Wiring",
                "Electrical Repair",
                "Installation"
            ],
            certifications=[
                "Test Certification"
            ],
            rating=4.8,
            review_count=12,
            starting_price=350,
            price_unit="job",
            available_days=[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ],
            languages=[
                "English",
                "Hindi",
                "Bengali"
            ],
            insurance_status="active",
        )

        db.session.add(official_worker)

        print("Created official worker record.")

    else:
        official_worker.name = "Test Worker"
        official_worker.email = worker_email
        official_worker.profession = "Electrician"
        official_worker.is_verified = True
        official_worker.is_active = True

        print("Updated official worker record.")


    db.session.commit()


    print("")
    print("======================================")
    print("GHARPE TEST ACCOUNTS READY")
    print("======================================")
    print("")
    print("CUSTOMER")
    print("Email:    customer@gharpe.test")
    print("Phone:    9876543211")
    print("Password: Customer@123")
    print("")
    print("WORKER")
    print("Email:    worker@gharpe.test")
    print("Phone:    9876543212")
    print("Password: Worker@123")
    print("")
    print("Worker is marked as VERIFIED.")
    print("======================================")