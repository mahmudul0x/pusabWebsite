from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from .serializers import AdminUserSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Create a new account. New users are NOT admins by default."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    """Return the currently authenticated user (incl. is_admin flag)."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    """Admin-only: list users and grant/revoke the admin role."""

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["get", "patch", "delete"]

    def perform_update(self, serializer):
        # Don't let an admin remove their own admin access (avoid lock-out).
        if serializer.instance == self.request.user and serializer.validated_data.get(
            "is_staff"
        ) is False:
            raise PermissionDenied("You can't remove your own admin access.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise PermissionDenied("You can't delete your own account.")
        instance.delete()
