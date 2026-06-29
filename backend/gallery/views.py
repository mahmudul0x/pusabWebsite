from rest_framework import viewsets

from config.permissions import IsAdminOrReadOnly

from .models import GalleryItem
from .serializers import GalleryItemSerializer


class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["category", "year"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs
