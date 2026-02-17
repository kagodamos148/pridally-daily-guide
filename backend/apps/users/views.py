from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .models import UserProfile
from .serializers import (
    UserSerializer, UserDetailSerializer, UserSignUpSerializer,
    UserProfileSerializer, ChangePasswordSerializer
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User operations"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserDetailSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user details"""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'detail': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'detail': 'Password changed successfully'})
    
    @action(detail=False, methods=['post'])
    def complete_onboarding(self, request):
        """Mark onboarding as completed"""
        user = request.user
        user.onboarding_completed = True
        user.save()
        return Response({'detail': 'Onboarding completed'})


class UserSignUpView(generics.CreateAPIView):
    """User registration endpoint"""
    serializer_class = UserSignUpSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        # Create user profile
        UserProfile.objects.create(user=user)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for User Profile operations"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        obj, created = UserProfile.objects.get_or_create(user=self.request.user)
        return obj
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        """Get or update current user profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'PUT':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
