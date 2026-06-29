from rest_framework.routers import DefaultRouter

from .views import PublicityPostViewSet

router = DefaultRouter()
router.register("publicity", PublicityPostViewSet, basename="publicity")

urlpatterns = router.urls
