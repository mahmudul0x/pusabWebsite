from rest_framework import viewsets

from config.permissions import IsAdminOrReadOnly

from .models import FelicitationEntry
from .serializers import FelicitationEntrySerializer


class FelicitationEntryViewSet(viewsets.ModelViewSet):
    queryset = FelicitationEntry.objects.all()
    serializer_class = FelicitationEntrySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        year = self.request.query_params.get("year")
        category = self.request.query_params.get("category")
        if year:
            qs = qs.filter(year=year)
        if category:
            qs = qs.filter(category=category)
        return qs
