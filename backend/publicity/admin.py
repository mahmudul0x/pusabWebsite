from django.contrib import admin

from .models import PublicityPost


@admin.register(PublicityPost)
class PublicityPostAdmin(admin.ModelAdmin):
    list_display = ["title", "type", "date", "published"]
    list_filter = ["type", "published"]
    search_fields = ["title", "excerpt", "body"]
