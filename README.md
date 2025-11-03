🎓 Attendify 2.0 — AI-Powered Attendance System

Attendify 2.0 is a smart AI-based attendance system that uses face recognition + geofencing to ensure accurate and secure attendance marking for educational institutions.

🚀 Features

Face Recognition Attendance

Geolocation-verified check-ins

Role-based access (Student, Teacher, Admin)

Real-time attendance logs

Analytics dashboard

Manual override for teachers

Notifications & alerts

Cross-platform: Android, iOS, Web

🏗️ Tech Stack
Category	Technology
Frontend	Flutter (Android, iOS, Web)
Backend	Firebase Auth, Firestore, Storage
AI Service	FastAPI / Flask + FaceNet / TensorFlow
Location	Geolocator (Flutter)
📁 Project Architecture (High-level)
Attendify-2.0/
 ├── frontend/        # Flutter app
 ├── backend/         # Firebase + backend logic
 ├── face_service/    # AI microservice (FaceNet)
 └── README.md

🧠 How It Works

User logs in (role-based)

Facial recognition verifies identity

Geofence checks if user is on campus

Attendance gets recorded in Firestore

Dashboard shows reports & stats

📊 Dashboard Capabilities

Student attendance history

Class-wise attendance

Defaulter list

Insights & graphs

✅ Future Enhancements

Multi-institute support

Location + Face hybrid verification

Admin web console

Reward / streak system

👨‍💻 Team

Built by Hackedemics

Lead Developer: Anuj Sharma

⭐ Support

If this project helped or inspired you, please consider giving it a ⭐ on GitHub!

