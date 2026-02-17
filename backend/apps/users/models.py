from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class CustomUser(AbstractUser):
    """Extended user model with health-related fields and role-based access"""
    # User roles
    ROLE_CHOICES = [
        ('patient', 'Patient/User'),
        ('doctor', 'Doctor'),
        ('admin', 'Administrator'),
    ]
    
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    
    # Override groups and permissions related_names to avoid clash with auth.User
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True
    )
    
    # Health pathway (for patients)
    HEALTH_PATHWAYS = [
        ('fitness', 'Fitness'),
        ('nutrition', 'Nutrition'),
        ('mental_health', 'Mental Health'),
        ('general', 'General Wellness'),
    ]
    health_pathway = models.CharField(
        max_length=20,
        choices=HEALTH_PATHWAYS,
        default='general'
    )
    
    # Onboarding status
    onboarding_completed = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email


class DoctorPatient(models.Model):
    """Relationship between doctor and patient"""
    doctor = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'doctor'},
        related_name='patients_list'
    )
    patient = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'patient'},
        related_name='doctors_list'
    )
    
    # Relationship metadata
    assigned_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('doctor', 'patient')
        verbose_name_plural = 'Doctor-Patient Relationships'
    
    def __str__(self):
        return f"Dr. {self.doctor.first_name} - {self.patient.email}"


class UserProfile(models.Model):
    """Detailed user profile information"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    
    # Health metrics
    height = models.FloatField(null=True, blank=True)  # in cm
    weight = models.FloatField(null=True, blank=True)  # in kg
    blood_type = models.CharField(
        max_length=5,
        choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), 
                 ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')],
        blank=True
    )
    
    # Preferences
    notification_enabled = models.BooleanField(default=True)
    theme_preference = models.CharField(
        max_length=10,
        choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')],
        default='auto'
    )
    
    # Medical info
    allergies = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    medical_conditions = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email}'s Profile"
