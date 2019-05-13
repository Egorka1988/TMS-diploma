from django.contrib.auth.views import LoginView
from django.urls import path, include

from sea_battle import views
from sea_battle.api.routers import router

# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
#     TokenVerifyView
# )

urlpatterns = [

    path('rest/', include(router.urls)),
    #
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('login/', LoginView.as_view(), name='login'),

    path('', views.HelloView.as_view(), name='index'),
    path('accounts/signup/', views.RegisterFormView.as_view(), name='signup'),
    path('accounts/logged_in/', views.SeeUsersView.as_view(), name='see_users'),
    path('game_create/', views.GameNewView.as_view(), name='game_new'),
    # path('game_join/', views.GameJoinView.as_view(), name='game_join'),
    path('c_game/', views.GamePlayViewForCreator.as_view(), name='gameplay_for_creator'),
    path('j_game/', views.GamePlayViewForJoiner.as_view(), name='gameplay_for_joiner'),

]
