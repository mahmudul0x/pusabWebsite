from rest_framework import viewsets

from config.permissions import IsAdminOrReadOnly

from .models import PublicityPost
from .serializers import PublicityPostSerializer


class PublicityPostViewSet(viewsets.ModelViewSet):
    serializer_class = PublicityPostSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = PublicityPost.objects.all()
        # Public visitors only see published posts; admins see everything.
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(published=True)
        post_type = self.request.query_params.get("type")
        if post_type:
            qs = qs.filter(type=post_type)
        return qs
