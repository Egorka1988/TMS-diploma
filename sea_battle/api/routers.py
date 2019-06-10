from rest_framework import routers

from sea_battle.api import views as v

router = routers.DefaultRouter()


router.register(r'games', v.GamesAPIViewSet,
                basename='games'
                )
router.register(r'games-for-watching', v.WatchGamesAPIViewSet,
                basename='w_games'
                )
router.register(r'signup', v.RegisterFormAPIViewSet,
                basename='signup'
                )
router.register(r'initial-data', v.InitialDataAPIViewSet,
                basename='fleet_composition'
                )
