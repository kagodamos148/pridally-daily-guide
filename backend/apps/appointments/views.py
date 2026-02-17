from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Doctor, DoctorAppointment, Prescription
from .serializers import (
    DoctorSerializer, DoctorAppointmentSerializer, DoctorAppointmentCreateSerializer,
    PrescriptionSerializer, AppointmentStatsSerializer
)

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Doctor model (read-only)"""
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_specialty(self, request):
        """Get doctors by specialty"""
        specialty = request.query_params.get('specialty')
        if not specialty:
            return Response({'detail': 'specialty parameter required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        doctors = Doctor.objects.filter(speciality=specialty)
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available doctors"""
        today = timezone.now().date()
        day_name = today.strftime('%A')
        
        doctors = Doctor.objects.all()
        available_doctors = [d for d in doctors if day_name in d.available_days]
        
        serializer = self.get_serializer(available_doctors, many=True)
        return Response(serializer.data)


class DoctorAppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Doctor Appointments"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return DoctorAppointment.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DoctorAppointmentCreateSerializer
        return DoctorAppointmentSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments"""
        today = timezone.now().date()
        appointments = DoctorAppointment.objects.filter(
            user=request.user,
            appointment_date__gte=today,
            status__in=['scheduled', 'rescheduled']
        ).order_by('appointment_date', 'appointment_time')
        
        serializer = DoctorAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def past(self, request):
        """Get past appointments"""
        today = timezone.now().date()
        appointments = DoctorAppointment.objects.filter(
            user=request.user,
            appointment_date__lt=today
        ).order_by('-appointment_date', '-appointment_time')
        
        serializer = DoctorAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel appointment"""
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule appointment"""
        appointment = self.get_object()
        appointment.appointment_date = request.data.get('appointment_date', appointment.appointment_date)
        appointment.appointment_time = request.data.get('appointment_time', appointment.appointment_time)
        appointment.status = 'rescheduled'
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.doctor_notes = request.data.get('doctor_notes', appointment.doctor_notes)
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate appointment"""
        appointment = self.get_object()
        appointment.rating = request.data.get('rating')
        appointment.review = request.data.get('review', '')
        appointment.save()
        
        # Update doctor's average rating
        doctor = appointment.doctor
        all_ratings = [a.rating for a in doctor.appointments.all() if a.rating]
        if all_ratings:
            doctor.average_rating = sum(all_ratings) / len(all_ratings)
            doctor.save()
        
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get appointment statistics"""
        today = timezone.now().date()
        appointments = DoctorAppointment.objects.filter(user=request.user)
        
        stats_data = {
            'total_appointments': appointments.count(),
            'completed_appointments': appointments.filter(status='completed').count(),
            'upcoming_appointments': appointments.filter(
                appointment_date__gte=today,
                status__in=['scheduled', 'rescheduled']
            ).count(),
            'cancelled_appointments': appointments.filter(status='cancelled').count(),
        }
        
        serializer = AppointmentStatsSerializer(stats_data)
        return Response(serializer.data)
