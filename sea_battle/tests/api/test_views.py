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
        assert response.status_code == 401

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
        assert response.status_code == 401

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
            'fleet': [
                [5, 1], [3, 1], [4, 1], [2, 1],
                [4, 4], [3, 4], [3, 6], [3, 8],
                [3, 10], [5, 6], [6, 6], [6, 10],
                [7, 3], [7, 2], [7, 1], [8, 8],
                [7, 8], [9, 5], [9, 3], [9, 4]
            ],
            'user': test_user.username
        }

        response = client.post('/rest/games/', data, format='json')
        assert response.status_code == 401

        client.force_authenticate(user=test_user)
        response = client.post('/rest/games/', data, format='json')
        self.assertEqual(10, len(BattleMap.objects.get(user=test_user).fleet))
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
        enemy_map.fleet = [
            [[5, 1], [3, 1], [4, 1], [2, 1]],
            [[4, 4], [3, 4]],
            [[3, 6]],
            [[3, 8]],
            [[3, 10]],
            [[5, 6], [6, 6]],
            [[6, 10]],
            [[7, 3], [7, 2], [7, 1]],
            [[8, 8], [7, 8]],
            [[9, 5], [9, 3], [9, 4]]
        ]
        enemy_map.save()

        data = {
            'shoot': [5, 1],
        }

        url = '/rest/games/' + str(game.pk) + '/shoot/'

        response = client.patch(url, data, format='json')
        assert response.status_code == 401

        client.force_authenticate(user=test_user)

        response = client.patch(url, data, format='json')
        resp_assert = {
            'state': constants.ACTIVE,
            'shoot': constants.SHOOT_RESULT_HIT,
            'dead_zone': [],
            'dead_ship': []
        }
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
        assert response.status_code == 401

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

        game = GameFactory(joiner=test_user)

        url = '/rest/games/' + str(game.pk) + '/join_fleet/'

        data = {
            'size': game.size,
            'fleet': [
                [5, 1], [3, 1], [4, 1], [2, 1],
                [4, 4], [3, 4], [3, 6], [3, 8],
                [3, 10], [5, 6], [6, 6], [6, 10],
                [7, 3], [7, 2], [7, 1], [8, 8],
                [7, 8], [9, 5], [9, 3], [9, 4]
            ]
        }

        response = client.post(url, data, format='json')
        assert response.status_code == 401

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
        j_battlemap.shoots = [[8, 9], [4, 3]]
        c_battlemap = BattleMap.objects.get(game=game, user=game.creator)
        c_battlemap.shoots = [[1, 1], [6, 5]]
        c_battlemap.fleet = [
            [[5, 1], [3, 1], [4, 1], [2, 1]],
            [[4, 4], [3, 4]],
            [[3, 6]],
            [[3, 8]],
            [[3, 10]],
            [[5, 6], [6, 6]],
            [[6, 10]],
            [[7, 3], [7, 2], [7, 1]],
            [[8, 8], [7, 8]],
            [[9, 5], [9, 3], [9, 4]]
        ]
        j_battlemap.fleet = c_battlemap.fleet
        c_battlemap.save()
        j_battlemap.save()

        url = '/rest/games/' + str(game.pk) + '/state/'

        response = client.get(url)
        assert response.status_code == 401

        client.force_authenticate(user=game.creator)

        response = client.get(url)
        resp_assert = {
            'state': constants.ACTIVE,
            'shoots_of_enemy': [[8, 9, "miss"], [4, 3, "miss"]],
            "my_dead_zone": [],
            "joiner": test_user.username,
            "turn": game.creator.username,
        }
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
