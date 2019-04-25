from sea_battle.models import BattleMap, Game
from sea_battle.services import shoot_handler

import pytest

from sea_battle.tests.factories import UserFactory, GameFactory, BattleMapFactory, ActiveGameFactory


@pytest.mark.django_db
class TestShootHandlerServices:

    def test_miss(self):
        shoots = [[0, 5]]
        last_shoot = [8, 8]

        game = ActiveGameFactory()

        enemy = BattleMap.objects.get(
            game=game,
            user=game.joiner
        )
        enemy.fleet = [[(0, 0), (0, 2), (0, 3)]]
        res = {'state': 'Miss'}
        assert shoot_handler(shoots, last_shoot, game, enemy.fleet, c_user) == res
        assert Game.objects.get(pk=game.pk).turn == game.joiner

    def test_hit