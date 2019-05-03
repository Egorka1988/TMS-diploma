from rest_framework import routers

from sea_battle.api import views as v

router = routers.DefaultRouter()

router.register(r'main-menu', v.ActiveGamesAPIViewSet, basename='active_games')
# path('cleaning_db/', v.CleaningAPIView.as_view(), name='deleting_fleet'),
router.register(r'games', v.GamesAPIViewSet, basename='games')
