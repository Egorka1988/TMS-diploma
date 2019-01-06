from django.urls import path
from sea_battle.views import RegisterFormView, HelloView, GameView

urlpatterns = [
    path('', HelloView.index, name='index'),
    path('accounts/logged_in/', GameView.see_users, name='see_users'),
    path('accounts/signup/', RegisterFormView.as_view()),
    path('game_create/', GameView.game_new, name='game_new'),
    path('game/', GameView.gameplay, name='gameplay'),
]