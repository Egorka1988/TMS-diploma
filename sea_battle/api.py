import json

from django.core.exceptions import PermissionDenied

from django.http import JsonResponse, HttpResponseForbidden
from django.views import View

from sea_battle.models import BattleMap, Game
from sea_battle.services import get_game, get_enemy_shoots, get_game_state, handle_shoot


class AwaitedFleetView(View):

    # class checks if enemy's fleet has arrived and gives
    # an answer to battle.html via ajax
    # class is being used by player, who created game

    def get(self, request, game_id):

        # game_id = resolve(request.path_info).kwargs['game_id']

        try:
            joiner = Game.objects.get(pk=game_id).joiner.username
        except AttributeError:
            joiner = "Nobody yet"

        return JsonResponse(joiner, safe=False)


class CleaningView(View):

    # deleting map of player, when the window is being hidden by him

    def get(self, request, *args, **kwargs):
        BattleMap.objects.filter(user=request.user).delete()
        resp = {"window.onclose event": "Deleting map successfully completed"}
        return JsonResponse(resp)


class ShootSaverView(View):

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        last_shoot = data['target'].split(',')
        prepared_shoot = [int(last_shoot[0]), int(last_shoot[1])]

        game = get_game(data['game_id'], request.user)

        if not game.turn == request.user:
            raise PermissionDenied

        shoot_result = handle_shoot(
            last_shoot=prepared_shoot,
            game=game,
            current_user=request.user
        )

        return JsonResponse({
            'state': get_game_state(game, request.user),
            'shoot_result': shoot_result,
        })


class StatementGetView(View):
    def get(self, request, game_id):
        game = get_game(game_id, request.user)

        if not game:
            raise HttpResponseForbidden()

        return JsonResponse({
            'state': get_game_state(game, request.user),
            'shoots': get_enemy_shoots(game_id, request.user),
        })
