from django.contrib import admin

from .models import Program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "date", "ongoing", "status"]
    list_filter = ["category", "ongoing"]
    search_fields = ["title", "description", "location"]
