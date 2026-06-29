from rest_framework import viewsets

from config.permissions import IsAdminOrReadOnly

from .models import Program
from .serializers import ProgramSerializer


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAdminOrReadOnly]
