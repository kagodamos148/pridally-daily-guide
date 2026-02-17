from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class DailyCheckIn(models.Model):
    """Daily health check-in tracking"""
    MOOD_CHOICES = [
        ('very_bad', 'Very Bad'),
        ('bad', 'Bad'),
        ('neutral', 'Neutral'),
        ('good', 'Good'),
        ('very_good', 'Very Good'),
    ]
    
    ENERGY_CHOICES = [
        ('very_low', 'Very Low'),
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('very_high', 'Very High'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_checkins')
    
    # Mood and energy tracking
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    energy_level = models.CharField(max_length=20, choices=ENERGY_CHOICES)
    
    # Health metrics
    sleep_hours = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(24)],
        help_text="Hours of sleep"
    )
    exercise_minutes = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Minutes of exercise"
    )
    water_intake = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Water intake in ml"
    )
    
    # Wellness notes
    notes = models.TextField(blank=True, help_text="Any additional health notes")
    symptoms = models.TextField(blank=True, help_text="Any symptoms experienced")
    
    # Nutrition tracking
    meals_logged = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    # Timestamps
    check_in_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-check_in_date']
        unique_together = ('user', 'check_in_date')
        verbose_name_plural = 'Daily Check-ins'
    
    def __str__(self):
        return f"{self.user.email} - {self.check_in_date} ({self.mood})"


class HealthGoal(models.Model):
    """User health goals"""
    GOAL_TYPES = [
        ('weight', 'Weight Management'),
        ('fitness', 'Fitness'),
        ('sleep', 'Sleep Improvement'),
        ('stress', 'Stress Reduction'),
        ('nutrition', 'Nutrition'),
        ('hydration', 'Hydration'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_goals')
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    description = models.TextField()
    target_value = models.CharField(max_length=100, help_text="e.g., '10000 steps/day'")
    progress = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    start_date = models.DateField(auto_now_add=True)
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.goal_type}"


class HealthMetric(models.Model):
    """Detailed health metrics tracking"""
    METRIC_TYPES = [
        ('blood_pressure', 'Blood Pressure'),
        ('heart_rate', 'Heart Rate'),
        ('blood_sugar', 'Blood Sugar'),
        ('temperature', 'Temperature'),
        ('weight', 'Weight'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_metrics')
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPES)
    value = models.CharField(max_length=50)  # Can store "120/80" for BP, "72" for HR, etc.
    unit = models.CharField(max_length=20, blank=True)  # mmHg, bpm, mg/dL, °C, kg
    notes = models.TextField(blank=True)
    
    # Timestamp
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-recorded_at']
        verbose_name_plural = 'Health Metrics'
    
    def __str__(self):
        return f"{self.user.email} - {self.metric_type}: {self.value}{self.unit}"
