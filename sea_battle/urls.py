from django.urls import path
from sea_battle.views import \
                                RegisterFormView, \
                                HelloView, \
                                SeeUsersView, \
                                GameNewView, \
                                GameJoinView, \
                                GamePlayViewForCreator, \
                                AwaitedFleetView, \
                                CleaningView, \
                                StatementSendView, \
                                StatementGetView

urlpatterns = [
    path('', HelloView.as_view(), name='index'),
    path('accounts/signup/', RegisterFormView.as_view(), name='signup'),
    path('accounts/logged_in/', SeeUsersView.as_view(), name='see_users'),
    path('game_create/', GameNewView.as_view(), name='game_new'),
    path('game_join/', GameJoinView.as_view(), name='game_join'),
    path('game/', GamePlayViewForCreator.as_view(), name='gameplay'),
    path('awaited_fleet/', AwaitedFleetView.as_view(), name='awaited_fleet'),
    path('cleaning_db/', CleaningView.as_view(), name='deleting_fleet'),
    path('statement_exchange/', StatementSendView.as_view(), name='statement_send'),
    path('statement_get/', StatementGetView.as_view(), name='statement_get'),
]
