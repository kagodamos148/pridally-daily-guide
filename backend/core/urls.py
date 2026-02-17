from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import ViewSets
from apps.users.views import UserViewSet, UserProfileViewSet, UserSignUpView
from apps.health.views import DailyCheckInViewSet, HealthGoalViewSet, HealthMetricViewSet
from apps.appointments.views import DoctorViewSet, DoctorAppointmentViewSet

# Create router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'checkins', DailyCheckInViewSet, basename='checkin')
router.register(r'goals', HealthGoalViewSet, basename='health-goal')
router.register(r'metrics', HealthMetricViewSet, basename='health-metric')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'appointments', DoctorAppointmentViewSet, basename='appointment')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/signup/', UserSignUpView.as_view(), name='user_signup'),
    
    # API
    path('api/', include(router.urls)),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
