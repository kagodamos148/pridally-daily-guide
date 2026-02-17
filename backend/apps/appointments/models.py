from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Doctor(models.Model):
    """Doctor/Healthcare provider information"""
    SPECIALTIES = [
        ('general_practice', 'General Practice'),
        ('cardiology', 'Cardiology'),
        ('neurology', 'Neurology'),
        ('orthopedics', 'Orthopedics'),
        ('dermatology', 'Dermatology'),
        ('psychiatry', 'Psychiatry'),
        ('nutrition', 'Nutrition'),
        ('physical_therapy', 'Physical Therapy'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    speciality = models.CharField(max_length=50, choices=SPECIALTIES)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='doctors/', null=True, blank=True)
    hospital = models.CharField(max_length=100, blank=True)
    
    # Availability
    available_days = models.CharField(
        max_length=50,
        default='Monday,Tuesday,Wednesday,Thursday,Friday',
        help_text="Comma-separated days"
    )
    start_time = models.TimeField(default='09:00')
    end_time = models.TimeField(default='17:00')
    
    # Rating
    average_rating = models.FloatField(default=0, help_text="Average rating out of 5")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Dr. {self.name} ({self.speciality})"


class DoctorAppointment(models.Model):
    """Doctor appointment scheduling"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    APPOINTMENT_TYPES = [
        ('in_person', 'In Person'),
        ('video_call', 'Video Call'),
        ('phone_call', 'Phone Call'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='appointments')
    
    # Appointment details
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES, default='in_person')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration_minutes = models.IntegerField(default=30)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Notes
    reason_for_visit = models.TextField()
    doctor_notes = models.TextField(blank=True, help_text="Notes from doctor after appointment")
    patient_notes = models.TextField(blank=True, help_text="Patient's additional notes")
    
    # Link to video call or location
    video_call_link = models.URLField(blank=True, help_text="Zoom/Meet link for video appointments")
    location = models.CharField(max_length=200, blank=True, help_text="Hospital/Clinic location")
    
    # Rating
    rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
        verbose_name_plural = 'Doctor Appointments'
    
    def __str__(self):
        return f"{self.user.email} - Dr. {self.doctor.name} - {self.appointment_date}"
    
    def is_upcoming(self):
        """Check if appointment is upcoming"""
        appointment_datetime = timezone.datetime.combine(self.appointment_date, self.appointment_time)
        return appointment_datetime > timezone.now()
    
    def is_past(self):
        """Check if appointment has passed"""
        appointment_datetime = timezone.datetime.combine(self.appointment_date, self.appointment_time)
        return appointment_datetime < timezone.now()


class Prescription(models.Model):
    """Prescription tracking"""
    appointment = models.ForeignKey(DoctorAppointment, on_delete=models.CASCADE, related_name='prescriptions')
    
    medication_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50, help_text="e.g., 500mg")
    frequency = models.CharField(max_length=100, help_text="e.g., Twice daily")
    duration = models.CharField(max_length=100, help_text="e.g., 10 days")
    
    instructions = models.TextField(blank=True)
    side_effects = models.TextField(blank=True)
    
    # Tracking
    is_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.medication_name} - {self.dosage}"
