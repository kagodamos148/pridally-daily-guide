from django.contrib import admin
from .models import Doctor, DoctorAppointment, Prescription

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'speciality', 'email', 'phone', 'average_rating')
    list_filter = ('speciality', 'average_rating')
    search_fields = ('name', 'email')

@admin.register(DoctorAppointment)
class DoctorAppointmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'doctor', 'appointment_date', 'appointment_time', 'status')
    list_filter = ('status', 'appointment_date', 'appointment_type')
    search_fields = ('user__email', 'doctor__name')
    date_hierarchy = 'appointment_date'

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('medication_name', 'dosage', 'frequency', 'is_completed')
    list_filter = ('is_completed', 'created_at')
    search_fields = ('medication_name',)
