from rest_framework.routers import DefaultRouter

from .views import ProgramViewSet

router = DefaultRouter()
router.register("programs", ProgramViewSet, basename="programs")

urlpatterns = router.urls
