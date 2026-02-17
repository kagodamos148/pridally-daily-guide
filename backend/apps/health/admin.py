from django.contrib import admin
from .models import DailyCheckIn, HealthGoal, HealthMetric

@admin.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'check_in_date', 'mood', 'energy_level', 'sleep_hours')
    list_filter = ('check_in_date', 'mood', 'energy_level')
    search_fields = ('user__email',)
    date_hierarchy = 'check_in_date'

@admin.register(HealthGoal)
class HealthGoalAdmin(admin.ModelAdmin):
    list_display = ('user', 'goal_type', 'progress', 'is_active', 'created_at')
    list_filter = ('goal_type', 'is_active', 'created_at')
    search_fields = ('user__email',)

@admin.register(HealthMetric)
class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ('user', 'metric_type', 'value', 'unit', 'recorded_at')
    list_filter = ('metric_type', 'recorded_at')
    search_fields = ('user__email',)
    date_hierarchy = 'recorded_at'
