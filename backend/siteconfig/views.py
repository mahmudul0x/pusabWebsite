from rest_framework import generics

from config.permissions import IsAdminOrReadOnly

from .models import SiteSettings
from .serializers import SiteSettingsSerializer


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    """Read publicly (the website uses it); update by admins only."""

    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        return SiteSettings.load()
