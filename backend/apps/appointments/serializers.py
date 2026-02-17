from rest_framework import serializers
from .models import Doctor, DoctorAppointment, Prescription

class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for Doctor model"""
    class Meta:
        model = Doctor
        fields = ('id', 'name', 'email', 'phone', 'speciality', 'bio', 'profile_picture',
                  'hospital', 'available_days', 'start_time', 'end_time', 'average_rating')
        read_only_fields = ('id',)


class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer for Prescription"""
    class Meta:
        model = Prescription
        fields = ('id', 'medication_name', 'dosage', 'frequency', 'duration',
                  'instructions', 'side_effects', 'is_completed', 'created_at')
        read_only_fields = ('id', 'created_at')


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Doctor Appointment"""
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    doctor_speciality = serializers.CharField(source='doctor.speciality', read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    is_past = serializers.SerializerMethodField()
    
    class Meta:
        model = DoctorAppointment
        fields = ('id', 'doctor', 'doctor_name', 'doctor_speciality', 'appointment_type',
                  'appointment_date', 'appointment_time', 'duration_minutes', 'status',
                  'reason_for_visit', 'doctor_notes', 'patient_notes', 'video_call_link',
                  'location', 'rating', 'review', 'is_upcoming', 'is_past', 'prescriptions',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_is_upcoming(self, obj):
        return obj.is_upcoming()
    
    def get_is_past(self, obj):
        return obj.is_past()


class DoctorAppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments"""
    class Meta:
        model = DoctorAppointment
        fields = ('doctor', 'appointment_type', 'appointment_date', 'appointment_time',
                  'reason_for_visit', 'patient_notes')
    
    def validate(self, data):
        # Add additional validation if needed
        return data


class AppointmentStatsSerializer(serializers.Serializer):
    """Serializer for appointment statistics"""
    total_appointments = serializers.IntegerField()
    completed_appointments = serializers.IntegerField()
    upcoming_appointments = serializers.IntegerField()
    cancelled_appointments = serializers.IntegerField()
