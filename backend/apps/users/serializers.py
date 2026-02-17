from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 
                  'profile_picture', 'health_pathway', 'onboarding_completed', 'created_at')
        read_only_fields = ('id', 'created_at')


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    class Meta:
        model = UserProfile
        fields = ('id', 'height', 'weight', 'blood_type', 'notification_enabled',
                  'theme_preference', 'allergies', 'medications', 'medical_conditions')


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer with profile info"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number',
                  'profile_picture', 'health_pathway', 'onboarding_completed',
                  'profile', 'created_at')
        read_only_fields = ('id', 'created_at')


class UserSignUpSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password_confirm')
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
