from rest_framework import serializers

from .models import FelicitationEntry


class FelicitationEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = FelicitationEntry
        fields = ["id", "name", "title", "category", "year", "image_url", "note", "created_at"]
        read_only_fields = ["id", "created_at"]
