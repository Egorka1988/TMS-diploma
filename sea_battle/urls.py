from django.urls import path

from sea_battle.api import \
                            AwaitedFleetView, \
                            CleaningView, \
                            ShootSaverView, \
                            StatementGetView
from sea_battle.views import \
                            RegisterFormView, \
                            HelloView, \
                            SeeUsersView, \
                            GameNewView, \
                            GameJoinView, \
                            GamePlayViewForCreator, \
                            GamePlayViewForJoiner

urlpatterns = [
    path('', HelloView.as_view(), name='index'),
    path('accounts/signup/', RegisterFormView.as_view(), name='signup'),
    path('accounts/logged_in/', SeeUsersView.as_view(), name='see_users'),
    path('game_create/', GameNewView.as_view(), name='game_new'),
    path('game_join/', GameJoinView.as_view(), name='game_join'),
    path('c_game/', GamePlayViewForCreator.as_view(), name='gameplay_for_creator'),
    path('j_game/', GamePlayViewForJoiner.as_view(), name='gameplay_for_joiner'),

    path('awaited_fleet/<int:game_id>', AwaitedFleetView.as_view(), name='awaited_fleet'),
    path('cleaning_db/', CleaningView.as_view(), name='deleting_fleet'),
    path('shoot/', ShootSaverView.as_view(), name='shoot_saver'),
    path('statement_get/', StatementGetView.as_view(), name='statement_get'),
]
