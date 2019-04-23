from rest_framework import routers

from sea_battle.api.views import UserViewSet, BattleMapViewSet, GameViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'maps', BattleMapViewSet)
router.register(r'games', GameViewSet)