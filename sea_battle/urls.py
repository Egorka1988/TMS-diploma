from django.urls import path
from diploma.sea_battle.views import RegisterFormView, HelloView, GameView

urlpatterns = [
    path('', HelloView, name='index'),
    path('accounts/logged_in/', RegisterFormView.as_view(), name='see_users'),
    path('accounts/signup/', RegisterFormView.as_view()),
    path('game_create/', GameView, name='game_new'),
    path('game/', GameView, name='gameplay'),
]