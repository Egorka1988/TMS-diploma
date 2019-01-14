from django.urls import path, reverse_lazy
from sea_battle.views import \
                                RegisterFormView, \
                                HelloView, \
                                SeeUsersView, \
                                GameNewView, \
                                GamePlayView

urlpatterns = [
    path('', HelloView.as_view(), name='index'),
    path('accounts/signup/', RegisterFormView.as_view(), name='signup'),
    path('accounts/logged_in/', SeeUsersView.as_view(), name='see_users'),
    path('game_create/', GameNewView.as_view(), name='game_new'),
    path('game/', GamePlayView.as_view(), name='gameplay'),
]
