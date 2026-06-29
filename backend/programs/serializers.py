from rest_framework import serializers

from .models import Program


class ProgramSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Program
        fields = [
            "id",
            "title",
            "category",
            "description",
            "location",
            "image_url",
            "date",
            "ongoing",
            "recurrence",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]
