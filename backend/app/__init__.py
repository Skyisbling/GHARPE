from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate

from .extensions import db, init_db


load_dotenv()

migrate = Migrate()


def create_app():
    app = Flask(__name__)
    CORS(app)

    init_db(app)
    migrate.init_app(app, db)

    from . import models
    from .routes import api

    app.register_blueprint(api)

    return app