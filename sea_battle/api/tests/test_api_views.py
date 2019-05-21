import json

import pytest

from rest_framework.test import APIClient, APITestCase

from sea_battle import constants
from sea_battle.models import Game, BattleMap
from sea_battle.tests.factories import UserFactory, ActiveGameFactory, GameFactory


@pytest.mark.django_db
class TestWatchGamesAPIViewSet(APITestCase):

    """check, if list of active games is provided
    for authenticated users and forbidden for anonymous"""

    def test_list_active_games(self):

        test_user = UserFactory()
        client = APIClient()

        ActiveGameFactory()
        ActiveGameFactory()
        ActiveGameFactory()

        GameFactory()

        response = client.get('/rest/games-for-watching/')
        assert response.status_code == 403

        client.force_authenticate(user=test_user)
        response = client.get('/rest/games-for-watching/')

        self.assertEqual(len(response.data), 3)
        assert response.status_code == 200


class TestGamesAPIViewSet(APITestCase):

    def test_list(self):

        """check, if list of available games is provided
        for authenticated users and forbidden for anonymous"""

        test_user = UserFactory()
        client = APIClient()

        ActiveGameFactory()
        ActiveGameFactory()
        ActiveGameFactory()

        GameFactory()

        response = client.get('/rest/games/')
        assert response.status_code == 403

        client.force_authenticate(user=test_user)
        response = client.get('/rest/games/')
        print(response.data)

        self.assertEqual(len(response.data), 1)
        assert response.status_code == 200

    def test_create(self):

        """check, if game can be created
        for authenticated users and forbidden for anonymous"""

        test_user = UserFactory()
        client = APIClient()

        data = {
            'name': 'name',
            'size': 10,
            'fleet': [[0, 0], [1, 0], [9, 9]],
            'user_id': test_user.id
        }

        response = client.post('/rest/games/', data, format='json')
        assert response.status_code == 403

        client.force_authenticate(user=test_user)
        response = client.post('/rest/games/', data, format='json')
        self.assertEqual(2, len(BattleMap.objects.get(user=test_user).fleet))
        assert response.status_code == 201

    def test_shoot(self):

        """check, if shoot is being handled properly
        for authenticated users and forbidden for anonymous"""

        test_user = UserFactory()
        client = APIClient()

        game = ActiveGameFactory(
            creator=test_user,
            turn=test_user,
            size=10
        )
        enemy_map = BattleMap.objects.get(user=game.joiner, game=game)
        enemy_map.fleet = [[[0, 0], [0, 1]]]
        enemy_map.save()

        data = {
            'shoot': [0, 0],
            'game_id': game.pk,
            'size': 10,
            'user_id': test_user.id
        }

        url = '/rest/games/' + str(game.pk) + '/shoot/'

        response = client.patch(url, data, format='json')
        assert response.status_code == 403

        client.force_authenticate(user=test_user)

        response = client.patch(url, data, format='json')
        resp_assert = {'state': constants.ACTIVE, 'shoot': constants.SHOOT_RESULT_HIT}
        self.assertEqual(resp_assert, json.loads(response.content))
        assert response.status_code == 200

    def test_join(self):

        """check, if joining is being handled properly
        for authenticated users and forbidden for anonymous"""

        test_user = UserFactory()
        client = APIClient()

        game = GameFactory()

        url = '/rest/games/' + str(game.pk) + '/join/'

        data = {
            'game_id': game.pk,
            'user_id': test_user.id
        }

        response = client.post(url, data, format='json')
        assert response.status_code == 403

        client.force_authenticate(user=test_user)

        response = client.post(url, data, format='json')
        self.assertEqual(test_user, Game.objects.get(pk=game.pk).joiner)
        assert response.status_code == 202

        url = '/rest/games/' + str(game.pk*2) + '/join/'
        response = client.post(url, data, format='json')

        assert response.status_code == 406

    def test_join_fleet(self):

        """check, if joining_fleet is being handled properly
        for authenticated users and forbidden for anonymous"""

        test_user = UserFactory()
        client = APIClient()

        game = ActiveGameFactory(joiner=test_user)
        battlemap = BattleMap.objects.get(game=game, user=test_user)
        battlemap.fleet = [[[0, 0], [1, 0]], [[9, 9]]]
        battlemap.save()

        url = '/rest/games/' + str(game.pk) + '/join_fleet/'

        data = {
            'game_id': game.pk,
            'user_id': test_user.id,
            'fleet': [[0, 0], [1, 0], [9, 9]]
        }

        response = client.post(url, data, format='json')
        assert response.status_code == 403

        client.force_authenticate(user=test_user)

        response = client.post(url, data, format='json')
        assert response.status_code == 201

    def test_state(self):

        """check, if state is being retrieved
        for authenticated users and forbidden for anonymous"""

        test_user = UserFactory()
        client = APIClient()

        game = ActiveGameFactory(joiner=test_user)
        j_battlemap = BattleMap.objects.get(game=game, user=game.joiner)
        j_battlemap.shoots = [[0, 0], [1, 1]]
        c_battlemap = BattleMap.objects.get(game=game, user=game.creator)
        c_battlemap.fleet = [[9, 9]]
        c_battlemap.save()
        j_battlemap.save()

        url = '/rest/games/' + str(game.pk) + '/state/'

        response = client.get(url)
        assert response.status_code == 403

        client.force_authenticate(user=game.creator)

        response = client.get(url)
        resp_assert = {'state': constants.ACTIVE, 'shoots_of_enemy': [[0, 0], [1, 1]]}
        self.assertEqual(resp_assert, json.loads(response.content))
        assert response.status_code == 200


@pytest.mark.django_db
class TestRegisterFormAPIViewSet(APITestCase):

    """check, if list of active games is provided
    for authenticated users and forbidden for anonymous"""

    def test_create(self):

        client = APIClient()

        data = json.dumps({"username": "test", "password": "test123"})


        response = client.post('/rest/signup/', data=data, content_type='application/json')


        assert response.status_code == 201
