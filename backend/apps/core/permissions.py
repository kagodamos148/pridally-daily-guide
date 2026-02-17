from rest_framework import permissions


class IsPatient(permissions.BasePermission):
    """Allow only patient users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'patient'


class IsDoctor(permissions.BasePermission):
    """Allow only doctor users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'doctor'


class IsAdmin(permissions.BasePermission):
    """Allow only admin users"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsPatientOrReadOnly(permissions.BasePermission):
    """
    Allow patients to access their own data.
    Allow doctors to view their patients' data.
    Allow admins to view all data.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.role == 'admin':
            return True
        
        # Patient can only access their own data
        if request.user.role == 'patient':
            return obj.user == request.user
        
        # Doctor can view their patients' data
        if request.user.role == 'doctor':
            from apps.users.models import DoctorPatient
            is_my_patient = DoctorPatient.objects.filter(
                doctor=request.user,
                patient=obj.user,
                is_active=True
            ).exists()
            return is_my_patient
        
        return False


class CanViewUserData(permissions.BasePermission):
    """
    Control access to user data based on roles:
    - Admins: see all users
    - Doctors: see their assigned patients
    - Patients: see only themselves
    """
    def has_object_permission(self, request, view, obj):
        # Admin can see all users
        if request.user.role == 'admin':
            return True
        
        # Patient can see only themselves
        if request.user.role == 'patient':
            return request.user == obj
        
        # Doctor can see their patients
        if request.user.role == 'doctor':
            from apps.users.models import DoctorPatient
            is_my_patient = DoctorPatient.objects.filter(
                doctor=request.user,
                patient=obj,
                is_active=True
            ).exists()
            return is_my_patient
        
        return False
