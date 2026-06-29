from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public profile — `is_admin` tells the frontend whether to show the dashboard."""

    is_admin = serializers.BooleanField(source="is_staff", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "is_admin"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class AdminUserSerializer(serializers.ModelSerializer):
    """For admins to list users and grant/revoke the admin role (is_staff)."""

    is_admin = serializers.BooleanField(source="is_staff")

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "is_admin", "is_active", "date_joined"]
        read_only_fields = ["id", "email", "date_joined"]
