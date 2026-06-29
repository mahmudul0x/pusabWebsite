from django.contrib import admin

from .models import EcMember, LeaderMessage


@admin.register(EcMember)
class EcMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "role", "year", "is_current"]
    list_filter = ["year", "is_current"]
    search_fields = ["name", "role", "university"]


@admin.register(LeaderMessage)
class LeaderMessageAdmin(admin.ModelAdmin):
    list_display = ["role", "name", "session", "updated_at"]
