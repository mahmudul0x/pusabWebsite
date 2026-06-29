from django.contrib import admin

from .models import GalleryItem


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "year", "created_at"]
    list_filter = ["category", "year"]
    search_fields = ["title", "caption"]
