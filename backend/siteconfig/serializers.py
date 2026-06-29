from rest_framework import serializers

from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "email",
            "phone",
            "members",
            "founded",
            "founded_at",
            "address",
            "facebook",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]
