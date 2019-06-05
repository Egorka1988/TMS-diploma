from django.urls import path, include
from rest_framework.authtoken.views import ObtainAuthToken
from sea_battle.api.routers import router


urlpatterns = [
    path('rest/login/', ObtainAuthToken.as_view(), name='login'),
    path('rest/', include(router.urls)),
]
