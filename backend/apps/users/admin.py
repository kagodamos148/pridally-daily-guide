from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, UserProfile

@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Health Info', {'fields': ('health_pathway', 'onboarding_completed')}),
        ('Additional Info', {'fields': ('phone_number', 'profile_picture', 'bio', 'date_of_birth')}),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'height', 'weight', 'blood_type', 'created_at')
    search_fields = ('user__email',)
