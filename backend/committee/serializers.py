from rest_framework import serializers

from .models import EcMember, LeaderMessage


class EcMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcMember
        fields = [
            "id",
            "name",
            "role",
            "university",
            "year",
            "is_current",
            "is_convening",
            "photo_url",
        ]
        read_only_fields = ["id"]


class LeaderMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderMessage
        fields = [
            "id",
            "role",
            "name",
            "designation",
            "session",
            "photo_url",
            "quote",
            "body",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]
