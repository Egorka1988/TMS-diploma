from rest_framework import routers

from sea_battle.api import views as v

router = routers.DefaultRouter()

router.register(r'active-games', v.ActiveGamesAPIViewSet, basename='active_games')
# router.register(r'games', v.NewGameAPIViewSet, basename='g_create')
# router.register(r'my-shoots', v.ShootHandlerAPIView)

# path('cleaning_db/', v.CleaningAPIView.as_view(), name='deleting_fleet'),
# path('shoot/', v.ShootSaverAPIView.as_view(), name='shoot_handler'),
router.register(r'games', v.GamesAPIViewSet, basename='games')
