from django.contrib import admin

from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ["email", "phone", "members", "updated_at"]

    def has_add_permission(self, request):
        # Only the singleton row should exist.
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
