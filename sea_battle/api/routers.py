from rest_framework import routers

from sea_battle.api import views as v

router = routers.DefaultRouter()
# router.register(r'users', v.UserViewSet)
# router.register(r'maps', v.BattleMapViewSet)
# router.register(r'games', v.GameViewSet)
router.register(r'active-games', v.ActiveGamesAPIViewSet, basename='active_games')
router.register(r'create-game', v.NewGameAPIViewSet, basename='g_create')
# router.register(r'join-game', v.JoinGameAPIView)
# router.register(r'my-shoots', v.ShootHandlerAPIView)
# router.register(r'enemy-shoots', v.StatementGetAPIView)


# path('cleaning_db/', v.CleaningAPIView.as_view(), name='deleting_fleet'),
# path('shoot/', v.ShootSaverAPIView.as_view(), name='shoot_handler'),
router.register(r'get-state', v.StatementGetAPIViewSet, basename='state')
