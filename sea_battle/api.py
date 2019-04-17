import json

from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.urls import resolve
from django.views import View

from sea_battle.forms import StatementForm
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


class StatementSendView(View):

    def post(self, request, *args, **kwargs):

        if request.method == 'POST':

            data = json.loads(json.loads(request.body))['cell']
            shoot_form = StatementForm({

                'shoots': data

            })
            if shoot_form.is_valid():

                print('statement ', request.user, ' is ok')

                ins = shoot_form.cleaned_data['shoots']
                res = ins[0]+","+ ins[1]

                tmp = BattleMap.objects.filter(user=request.user)
                tmp.update(shoots=ArrayAppend(BattleMap.shoots.field_name, res))

                print("shoots of", request.user, " Updated!")

            else:
                print('statement is invalid: ', shoot_form.errors)

        return HttpResponse('shoot was stored')


class StatementGetView(View):

    def post(self, request, *args, **kwargs):

        if request.method == 'POST':

            got_shoot = []

            try:

                tmp = BattleMap.objects.get(user=request.user)
                opponent = tmp.map_of_bf['opponent_username']
                print(opponent)
                username_id = User.objects.get(username=opponent).id
                got_shoot = BattleMap.objects.get(user=username_id).shoots
                print(got_shoot)
                resp = {}
                tmp = {'shooted cells': got_shoot}
                resp.update(tmp)

            except:

                if not opponent:

                    print("Can't get opponent_username for ", request.user.username)

                if not got_shoot:

                    got_shoot = "no shoots yet"
                    resp = {}
                    tmp = {'shooted cells': got_shoot}
                    resp.update(tmp)

        return JsonResponse(resp)
