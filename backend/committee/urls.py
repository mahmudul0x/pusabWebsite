from rest_framework.routers import DefaultRouter

from .views import EcMemberViewSet, LeaderMessageViewSet

router = DefaultRouter()
router.register("committee", EcMemberViewSet, basename="committee")
router.register("leader-messages", LeaderMessageViewSet, basename="leader-messages")

urlpatterns = router.urls
