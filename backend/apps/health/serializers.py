from rest_framework import serializers
from .models import DailyCheckIn, HealthGoal, HealthMetric

class DailyCheckInSerializer(serializers.ModelSerializer):
    """Serializer for Daily Check-in"""
    class Meta:
        model = DailyCheckIn
        fields = ('id', 'mood', 'energy_level', 'sleep_hours', 'exercise_minutes',
                  'water_intake', 'notes', 'symptoms', 'meals_logged', 'check_in_date',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'check_in_date', 'created_at', 'updated_at')


class HealthGoalSerializer(serializers.ModelSerializer):
    """Serializer for Health Goals"""
    class Meta:
        model = HealthGoal
        fields = ('id', 'goal_type', 'description', 'target_value', 'progress',
                  'is_active', 'start_date', 'target_date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'start_date', 'created_at', 'updated_at')


class HealthMetricSerializer(serializers.ModelSerializer):
    """Serializer for Health Metrics"""
    class Meta:
        model = HealthMetric
        fields = ('id', 'metric_type', 'value', 'unit', 'notes', 'recorded_at')
        read_only_fields = ('id', 'recorded_at')


class CheckInStatsSerializer(serializers.Serializer):
    """Serializer for check-in statistics"""
    total_checkins = serializers.IntegerField()
    average_mood = serializers.CharField()
    average_energy = serializers.CharField()
    average_sleep = serializers.FloatField()
    total_exercise_minutes = serializers.IntegerField()
