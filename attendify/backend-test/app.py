from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS   # ✅ add this
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    # ✅ Enable CORS for all routes (frontend can call backend)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # import blueprints
    from auth_routes import auth_bp
    from attendance_routes import attendance_bp
    from teacher_routes import teacher_bp
    from student_routes import student_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(attendance_bp, url_prefix="/api")
    app.register_blueprint(teacher_bp, url_prefix="/api/teacher")
    app.register_blueprint(student_bp, url_prefix="/api/student")

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app
