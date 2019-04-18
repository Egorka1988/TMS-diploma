import json

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Subquery
from django.http import JsonResponse, HttpResponse
from django.urls import resolve
from django.views import View


from sea_battle.models import BattleMap, Game


class AwaitedFleetView(View):

    # class checks if enemy's fleet has arrived and gives
    # an answer to battle.html via ajax
    # class is being used by player, who created game

    def get(self,request, *args, **kwargs):

        game_id = resolve(request.path_info).kwargs['game_id']

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

        if request.method == 'POST':

            data = json.loads(request.body)
            shoot = data['target'].split(',')
            prepared_shoot = (int(shoot[0]), int(shoot[1]))

            battlemap = BattleMap.objects.get(
                game=data['game_id'],
                user=request.user,
            )
            if battlemap.game.turn == request.user:

                battlemap.shoots.append(prepared_shoot)
                battlemap.save()
            else:
                return HttpResponse('shoot was rejected')

            return HttpResponse('shoot was stored')


class StatementGetView(View):

    def post(self, request, *args, **kwargs):

        if request.method == 'POST':

            game_id = json.loads(request.body)['game_id']
            identity = json.loads(request.body)['identity']

            print("entry:", game_id, identity)
            game = Game.objects.get(pk=game_id)
            if identity == 'creator':
                opponent = game.joiner.pk
            else:
                opponent = game.creator.pk

            if game.winner and game.winner != request.user:
                resp = {'game_result': 'Looser'}
                return JsonResponse(resp)
            else:
                if request.user == game.turn:
                    battlemap = BattleMap.objects.get(
                        user=request.user,
                        game=game_id
                    )
                    try:
                        enemy_fleet = BattleMap.objects.get(
                            user=opponent,
                            game=game_id
                        )
                    except ObjectDoesNotExist:
                        return HttpResponse('Enemy has left')

                    shoots = battlemap.shoots
                    if shoots:
                        last_shoot = shoots[len(shoots)-1]
                    else:
                        return HttpResponse('No shoots yet')
                    for ship in enemy_fleet.fleet:

                        game_result = 'go on'
                        start_cell = []

                        if last_shoot in ship:

                            if set(ship).issubset(set(shoots)):
                                shoot_result = 'Killed'
                                start_cell = ship[0]

                                if all(set(ship) in set(shoots) for ship in enemy_fleet.fleet):
                                    game_result = 'Winner'
                                    game.winner = request.user
                                    break
                            else:
                                shoot_result = 'Hit'
                            break
                        else:
                            shoot_result = 'Miss'

                            if game.turn == game.creator:  # change shooter in db after miss
                                game.turn = game.joiner
                            else:
                                game.turn = game.creator
                    game.save()
                    resp = {
                        'shoot': [last_shoot, shoot_result],
                        'game_result': game_result,
                        'start_cell': start_cell,
                    }
                else:
                    if request.user == game.creator:
                        user = game.joiner
                    else:
                        user = game.creator
                    battlemap = BattleMap.objects.get(
                        user=user,
                        game=game_id
                    )
                    resp = {'shoots': battlemap.shoots}

        return JsonResponse(resp)


