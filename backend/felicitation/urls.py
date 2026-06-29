from rest_framework.routers import DefaultRouter

from .views import FelicitationEntryViewSet

router = DefaultRouter()
router.register("felicitation", FelicitationEntryViewSet, basename="felicitation")

urlpatterns = router.urls
