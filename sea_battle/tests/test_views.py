
import pytest
from django.http import JsonResponse
from django.test import RequestFactory, TestCase

from sea_battle.api import StatementGetView
from sea_battle.models import BattleMap
from .factories import \
                        UserFactory, \
                        GameFactory,\
                        BattleMapFactory, \
                        ActiveGameFactory


@pytest.mark.django_db
class TestStatementGetView(TestCase):

    def test_way_without_joiner(self):

        user = UserFactory()
        game = GameFactory(
            creator=user,
            joiner=None,
            turn=user
        )

        BattleMapFactory(
            user=user,
            game=game,
            fleet=[((0, 0), (0, 1), (0, 2)), ((5, 6),)]
        )

        data = {}
        data['game_id'] = game.pk
        data['identity'] = 'creator'
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = user
        response = StatementGetView().post(request)

        assert response.status_code == 200
        assert response.content.decode("utf-8") == 'Enemy has not come yet'

    def test_way_for_joiner(self):

        j_user = UserFactory(username='Bob')
        c_user = UserFactory(username='John')
        game = GameFactory(
            creator=c_user,
            joiner=j_user,
            turn=c_user
        )

        BattleMap.objects.get(
            user=c_user,
            game=game,
        )

        BattleMapFactory(
            user=j_user,
            game=game,

        )

        data = {'game_id': game.pk}
        data.update({'identity': 'joiner'})
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = j_user
        response = StatementGetView().post(request)

        assert response.status_code == 200
        assert response.content.decode("utf-8") == '{"shoots": []}'

    def test_hit(self):

        j_user = UserFactory(username='Bob')
        c_user = UserFactory(username='John')

        game = ActiveGameFactory(
            creator=c_user,
            joiner=j_user,
            turn=c_user
        )

        c_battlemap = BattleMap.objects.get(
            user=c_user,
            game=game,
        )

        c_battlemap.fleet = [((0, 0), (0, 1), (0, 2)), ((5, 6),)]
        c_battlemap.shoots = [(7, 0)]
        c_battlemap.save()

        j_battlemap = BattleMap.objects.get(
            user=j_user,
            game=game,
        )
        j_battlemap.fleet = [((7, 0), (7, 1), (7, 2)), ((7, 6),)]
        j_battlemap.save()

        data = {'game_id': game.pk}
        data.update({'identity': 'creator'})
        data.update({'target': "7,0"})
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = c_user
        response = StatementGetView().post(request)

        awaited_response = JsonResponse({
                                        'shoot_result': [(7, 0), 'Hit'],
                                        'game_result': 'go on',
                                        'start_cell': (),
                                        }
        )

        assert response.status_code == 200
        assert response.content == awaited_response.content

    def test_miss(self):
        j_user = UserFactory(username='Bob')
        c_user = UserFactory(username='John')

        game = ActiveGameFactory(
            creator=c_user,
            joiner=j_user,
            turn=c_user
        )

        c_battlemap = BattleMap.objects.get(
            user=c_user,
            game=game,
        )

        c_battlemap.fleet = [((0, 0), (0, 1), (0, 2)), ((5, 6),)]
        c_battlemap.shoots = [(7, 7)]
        c_battlemap.save()

        j_battlemap = BattleMap.objects.get(
            user=j_user,
            game=game,
        )
        j_battlemap.fleet = [((7, 0), (7, 1), (7, 2)), ((7, 6),)]
        j_battlemap.save()

        data = {'game_id': game.pk}
        data.update({'identity': 'creator'})
        data.update({'target': "7,7"})
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = c_user
        response = StatementGetView().post(request)

        awaited_response = JsonResponse({
            'shoot_result': [(7, 7), 'Miss'],
            'game_result': 'go on',
            'start_cell': (),
        }
        )

        assert response.status_code == 200
        assert response.content == awaited_response.content

    def test_killed(self):
        j_user = UserFactory(username='Bob')
        c_user = UserFactory(username='John')

        game = ActiveGameFactory(
            creator=c_user,
            joiner=j_user,
            turn=c_user
        )

        c_battlemap = BattleMap.objects.get(
            user=c_user,
            game=game,
        )

        c_battlemap.fleet = [((0, 0), (0, 1), (0, 2)), ((5, 6),)]
        c_battlemap.shoots = [(7, 6)]
        c_battlemap.save()

        j_battlemap = BattleMap.objects.get(
            user=j_user,
            game=game,
        )
        j_battlemap.fleet = [((7, 0), (7, 1), (7, 2)), ((7, 6),)]
        j_battlemap.save()

        data = {'game_id': game.pk}
        data.update({'identity': 'creator'})
        data.update({'target': "7,6"})
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = c_user
        response = StatementGetView().post(request)

        awaited_response = JsonResponse({
            'shoot_result': [(7, 6), 'Killed'],
            'game_result': 'go on',
            'start_cell': (7, 6),
        }
        )

        assert response.status_code == 200
        assert response.content == awaited_response.content

    def test_looser(self):
        j_user = UserFactory(username='Bob')
        c_user = UserFactory(username='John')

        game = ActiveGameFactory(
            creator=c_user,
            joiner=j_user,
            turn=j_user,
            winner=j_user
        )

        c_battlemap = BattleMap.objects.get(
            user=c_user,
            game=game,
        )

        c_battlemap.fleet = [((0, 0), (0, 1), (0, 2)), ((5, 6),)]
        c_battlemap.shoots = [(7, 6)]
        c_battlemap.save()

        j_battlemap = BattleMap.objects.get(
            user=j_user,
            game=game,
        )
        j_battlemap.fleet = [((7, 0), (7, 1), (7, 2)), ((7, 6),)]
        j_battlemap.shoots = [(0, 0), (0, 1), (0, 2), (5, 6)]
        j_battlemap.save()

        data = {'game_id': game.pk}
        data.update({'identity': 'creator'})
        data.update({'target': ""})
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = c_user
        response = StatementGetView().post(request)

        awaited_response = JsonResponse({
            'game_result': 'Looser',
            'shoots': [(0, 0), (0, 1), (0, 2), (5, 6)]
        }
        )

        assert response.status_code == 200
        assert response.content == awaited_response.content

    def test_winner(self):
        j_user = UserFactory(username='Bob')
        c_user = UserFactory(username='John')

        game = ActiveGameFactory(
            creator=c_user,
            joiner=j_user,
            turn=c_user,
            winner=c_user
        )

        c_battlemap = BattleMap.objects.get(
            user=c_user,
            game=game,
        )

        c_battlemap.fleet = [((0, 0), (0, 1), (0, 2)), ((5, 6),)]
        c_battlemap.shoots = [(7, 0), (7, 6), (7, 2), (7, 1)]
        c_battlemap.save()

        j_battlemap = BattleMap.objects.get(
            user=j_user,
            game=game,
        )
        j_battlemap.fleet = [((7, 0), (7, 1), (7, 2)), ((7, 6),)]
        j_battlemap.shoots = [(0, 0), (0, 1), (0, 2)]
        j_battlemap.save()

        data = {'game_id': game.pk}
        data.update({'identity': 'creator'})
        data.update({'target': "7,1"})
        request = RequestFactory().post(
            'statement_get/',
            data,
            content_type='application/json'
        )
        request.user = c_user
        response = StatementGetView().post(request)

        awaited_response = JsonResponse({
            'shoot_result': [(7, 1), 'Killed'],
            'game_result': 'Winner',
            'start_cell': (7, 0),
        }
        )

        assert response.status_code == 200
        assert response.content == awaited_response.content
