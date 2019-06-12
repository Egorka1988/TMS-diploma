from django.urls import path, include
from sea_battle.api.routers import router
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('rest/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('rest/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('rest/', include(router.urls)),
]
