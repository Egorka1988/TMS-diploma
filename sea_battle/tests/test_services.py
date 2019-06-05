from sea_battle.constants import SHOOT_RESULT_MISS, SHOOT_RESULT_HIT, SHOOT_RESULT_KILL, WAITING_FOR_JOINER
from sea_battle.models import BattleMap, Game
from sea_battle.services import handle_shoot, get_game_state

import pytest

from sea_battle.tests.factories import ActiveGameFactory, GameFactory, UserFactory


@pytest.mark.django_db
class TestShootHandlerServices:

    def test_miss(self):
        last_shoot = [8, 8]

        game = ActiveGameFactory()

        enemy = BattleMap.objects.get(
            game=game,
            user=game.joiner
        )
        enemy.fleet = [[(0, 0), (0, 2), (0, 3)]]
        enemy.save()
        res = (SHOOT_RESULT_MISS, [], [])

        assert res == handle_shoot(last_shoot, game, game.creator)
        assert Game.objects.get(pk=game.pk).turn == game.joiner

    def test_hit(self):

        last_shoot = [0, 3]

        game = ActiveGameFactory()

        enemy = BattleMap.objects.get(
            game=game,
            user=game.joiner
        )
        enemy.fleet = [[(0, 0), (0, 2), (0, 3)]]
        enemy.save()
        res = (SHOOT_RESULT_HIT, [], [])
        assert res == handle_shoot(last_shoot, game, game.creator)
        assert Game.objects.get(pk=game.pk).turn == game.creator

    def test_kill(self):
        shoots = [[1, 5], [1, 1], [1, 2]]
        last_shoot = [1, 3]

        game = ActiveGameFactory()
        my_bm = BattleMap.objects.get(
            game=game,
            user=game.creator
        )
        my_bm.shoots = shoots
        my_bm.save()
        enemy = BattleMap.objects.get(
            game=game,
            user=game.joiner
        )
        enemy.fleet = [[(1, 1), (1, 2), (1, 3)]]
        enemy.save()
        res = (SHOOT_RESULT_KILL, [(2, 2), (2, 1), (1, 4), (2, 3), (2, 4)], {(1, 1), (1, 2), (1, 3)})
        assert res == handle_shoot(last_shoot, game, game.creator)
        assert Game.objects.get(pk=game.pk).turn == game.creator


@pytest.mark.django_db
class TestGetGameState:

    def test_wait_for_joiner(self):

        game = GameFactory()
        joiner = UserFactory()
        c_bm = game.battle_maps.filter(user=game.creator).first()
        c_bm.fleet = [[(1, 1), (1, 2), (1, 3)]]
        j_bm = game.battle_maps.filter(user=game.joiner).first()
        j_bm.fleet = []
        game.joiner = joiner
        j_bm.save()
        c_bm.save()
        game.save()

        assert WAITING_FOR_JOINER == get_game_state(game, game.creator)