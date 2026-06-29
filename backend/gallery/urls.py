from rest_framework.routers import DefaultRouter

from .views import GalleryItemViewSet

router = DefaultRouter()
router.register("gallery", GalleryItemViewSet, basename="gallery")

urlpatterns = router.urls
