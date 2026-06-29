from django.contrib import admin

from .models import FelicitationEntry


@admin.register(FelicitationEntry)
class FelicitationEntryAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "year", "title"]
    list_filter = ["category", "year"]
    search_fields = ["name", "title", "note"]
