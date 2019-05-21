from rest_framework import routers

from sea_battle.api import views as v

router = routers.DefaultRouter()

# path('cleaning_db/', v.CleaningAPIView.as_view(), name='deleting_fleet'),
router.register(r'games', v.GamesAPIViewSet, basename='games')
router.register(r'games-for-watching', v.WatchGamesAPIViewSet, basename='w_games')
router.register(r'signup', v.RegisterFormAPIViewSet, basename='signup')

