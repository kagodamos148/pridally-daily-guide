# Django Backend Setup Guide

## Overview
This is the Django REST API backend for the Pridal Daily Health Guide application. It uses PostgreSQL for data storage and JWT tokens for authentication.

## Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Installation

### 1. Setup Virtual Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your values
```

### 4. Create PostgreSQL Database
```bash
createdb pridal_db
```

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Run Development Server
```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

## API Documentation

### Authentication Endpoints

#### Get Token
```
POST /api/auth/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Refresh Token
```
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Sign Up
```
POST /api/auth/signup/
Content-Type: application/json

{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123",
  "password_confirm": "password123"
}
```

### User Endpoints

#### Get Current User
```
GET /api/users/me/
Authorization: Bearer <access_token>
```

#### Update User Profile
```
PUT /api/profiles/me/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "height": 180,
  "weight": 75,
  "blood_type": "O+",
  "allergies": "Peanuts",
  "medications": "Aspirin"
}
```

### Health Check-in Endpoints

#### Create Check-in
```
POST /api/checkins/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "mood": "good",
  "energy_level": "high",
  "sleep_hours": 8,
  "exercise_minutes": 30,
  "water_intake": 2000,
  "notes": "Feel great today",
  "symptoms": ""
}
```

#### Get Today's Check-in
```
GET /api/checkins/today/
Authorization: Bearer <access_token>
```

#### Get Weekly Check-ins
```
GET /api/checkins/weekly/
Authorization: Bearer <access_token>
```

#### Get Statistics
```
GET /api/checkins/stats/
Authorization: Bearer <access_token>
```

### Health Goals Endpoints

#### Create Goal
```
POST /api/goals/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "goal_type": "fitness",
  "description": "Run 5km without stopping",
  "target_value": "5km",
  "target_date": "2024-02-28"
}
```

#### Get Active Goals
```
GET /api/goals/active/
Authorization: Bearer <access_token>
```

#### Update Goal Progress
```
POST /api/goals/{id}/update_progress/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "progress": 50
}
```

### Health Metrics Endpoints

#### Record Metric
```
POST /api/metrics/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "metric_type": "blood_pressure",
  "value": "120/80",
  "unit": "mmHg"
}
```

#### Get Metrics by Type
```
GET /api/metrics/by_type/?type=blood_pressure
Authorization: Bearer <access_token>
```

### Doctor Endpoints

#### Get All Doctors
```
GET /api/doctors/
Authorization: Bearer <access_token>
```

#### Get Doctors by Specialty
```
GET /api/doctors/by_specialty/?specialty=cardiology
Authorization: Bearer <access_token>
```

#### Get Available Doctors
```
GET /api/doctors/available/
Authorization: Bearer <access_token>
```

### Appointment Endpoints

#### Create Appointment
```
POST /api/appointments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "doctor": 1,
  "appointment_type": "in_person",
  "appointment_date": "2024-02-15",
  "appointment_time": "10:00",
  "reason_for_visit": "Regular checkup"
}
```

#### Get Upcoming Appointments
```
GET /api/appointments/upcoming/
Authorization: Bearer <access_token>
```

#### Get Past Appointments
```
GET /api/appointments/past/
Authorization: Bearer <access_token>
```

#### Cancel Appointment
```
POST /api/appointments/{id}/cancel/
Authorization: Bearer <access_token>
```

#### Rate Appointment
```
POST /api/appointments/{id}/rate/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "rating": 5,
  "review": "Excellent service!"
}
```

#### Get Appointment Statistics
```
GET /api/appointments/stats/
Authorization: Bearer <access_token>
```

## API Documentation (Swagger UI)
Visit: `http://localhost:8000/api/docs/`

## Database Models

### Users App
- **CustomUser**: Extended user model with health info
- **UserProfile**: Detailed user profile with health metrics

### Health App
- **DailyCheckIn**: Daily mood, energy, and health metrics
- **HealthGoal**: User health goals and progress tracking
- **HealthMetric**: Detailed health metrics (BP, HR, etc.)

### Appointments App
- **Doctor**: Doctor/Healthcare provider information
- **DoctorAppointment**: Doctor appointment scheduling
- **Prescription**: Medication prescriptions

## Deployment

### Using Gunicorn
```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Using Docker
Create a Dockerfile in the backend directory and build/run the image.

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in .env file
- Verify database exists: `createdb pridal_db`

### Migration Issues
```bash
# Reset migrations (development only)
python manage.py migrate appointments zero
python manage.py migrate
```

### CORS Errors
- Update CORS_ALLOWED_ORIGINS in .env
- Ensure React frontend URL is in the list

## API Response Format

### Success Response (200/201)
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  ...
}
```

### Error Response
```json
{
  "detail": "Error message here"
}

or

{
  "field_name": ["Error message"]
}
```

## Support
For issues or questions, please refer to the main project README.
