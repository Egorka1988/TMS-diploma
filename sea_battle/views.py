

import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.http.response import HttpResponseBase, HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import FormView, TemplateView
import online_users.models
from datetime import timedelta
from django.db import models
from sea_battle.forms import GameAttrForm, StatementForm
from sea_battle.models import BattleMap
from django_postgres_extensions.models.functions import *


class HelloView(TemplateView):

    template_name = 'index.html'

    def get(self, request, *args, **kwargs):

        template = HelloView.template_name

        return render(
            request,
            template)


class RegisterFormView(FormView):

    form_class = UserCreationForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('see_users')

    def form_valid(self, form):
        form.save()
        user = authenticate( # for redirecting after registration to success_url with ontime authentificate
            request=self.request,
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1']
        )
        login(self.request, user)
        return super(RegisterFormView, self).form_valid(form)


class SeeUsersView(FormView):

    template_name = 'playerlist.html'

    # your opponents in game.
    # You point the user that you want to create a game with
    # https://stackoverflow.com/questions/29663777/how-to-check-whether-a-user-is-online-in-django-template
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        user_status = online_users.models.OnlineUserActivity.get_user_activities(timedelta(seconds=60))
        users = (user for user in user_status)
        cleared_users = []
        # preventing view self username in available games list:
        for user in users:
            if user.user == request.user:
                continue
            else:
                cleared_users.append(user.user)
        return render(
            request,
            SeeUsersView.template_name,
            context={
                 "online_users": cleared_users,
            }
        )


class GameNewView(FormView):

    template_name = 'pre_battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        size = int(request.POST.get('fld_size'))
        sizeiterator = list(range(size))
        opponent = request.POST.get('opponent_username')

        return render(
            request,
            GameNewView.template_name,
            context={
                'size': size,
                'sizeiterator': sizeiterator,
                'opponent': opponent,
            }
        )


class GameJoinView(FormView):

    template_name = 'pre_battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        opponent = request.POST.get('opponent_username')
        username_id = User.objects.get(username=opponent).id

        # retrieving size of created game

        size = BattleMap.objects.get(user=username_id).map_of_bf['size']

        # set joined username as opponent at user, who has created game

        tmp = BattleMap.objects.get(user=username_id).map_of_bf
        tmp['opponent_username'] = request.user.username
        BattleMap.objects.filter(user=username_id).update(map_of_bf=tmp)
        sizeiterator = list(range(int(size)))

        return render(
            request,
            GameJoinView.template_name,
            context={
                'size': size,
                'sizeiterator': sizeiterator,
                'opponent': opponent,
            }
        )

class GamePlayView(FormView):

    template_name = 'battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        if request.method == 'POST':
            form = GameAttrForm({
                'map_of_bf': request.POST.get('json_form')
            })
            if form.is_valid():

                print('form of ', request.user, ' is ok')

                if not BattleMap.objects.filter(user=request.user):
                    battlemap = form.save(commit=False)
                    battlemap.user = request.user
                    battlemap.save()
                    print("map1 Created!")
                    fleet = {k: v for k, v in battlemap.map_of_bf.items() if v and ',' in k}

                    fleet_keys = fleet.keys()

                    fleet_keys_list = []
                    for coord in fleet_keys:
                        fleet_keys_list.append([int(c) for c in coord.split(",")])
                        print("fleet_list_keys: ", fleet_keys_list)

                    sorted_fleet_list = list()

                    def sorted_fleet(item):

                        if sorted_fleet_list:

                            ship = list()
                            ship.append(item)
                            print("ship1:", ship)

                            sorted_fleet_list.append(ship)

                        else:
                            for ship in sorted_fleet_list:

                                    vnl_item = [item[0]-1, item[1]-1]
                                    vnr_item = [item[0]-1, item[1]+1]
                                    vn_item = [item[0]-1, item[1]]
                                    hn_item = [item[0], item[1]-1]

                                    surround = [vnl_item, vnr_item, vn_item, hn_item]
                                    print("ship: ", ship, "surround: ", surround)

                                    for i in surround:
                                        if i in ship:

                                            ship.append(i)

                                            print("sorted_ship:", ship)
                                        else:
                                            continue

                                        ship = list()

                                        ship.append(item1)
                                        print("ship2:", ship)

                                        sorted_fleet_list.append(ship)

                    for i in fleet_keys_list:
                        sorted_fleet(i)

                    print(sorted_fleet_list)




                else:
                    battlemap = form.save(commit=False)
                    battlemap.user = request.user
                    tmp = BattleMap.objects.filter(user=request.user)
                    tmp.update(map_of_bf=form.cleaned_data['map_of_bf'])
                    print("map1 Updated!")
            else:
                print('form is invalid: ',form.errors)

            respjson = BattleMap.objects.get(user=request.user).map_of_bf
            opponent = respjson['opponent_username']
            sizeiterator = list(range(int(respjson['size'])))
            data = json.dumps(respjson)
            try:
                # for joiner this block has success, as joiner has particular opponent
                # here we try to get enemy's map
                username_id = User.objects.get(username=opponent).id
                joined_resp = BattleMap.objects.get(user=username_id).map_of_bf
                joined_resp = json.dumps(joined_resp)
            except:
                joined_resp = {}
            return render(
                request,
                GamePlayView.template_name,

                context={
                    'form':         data,
                    'sizeiterator': sizeiterator,
                    'size':         respjson['size'],
                    'opponent':     opponent,
                    'joined_map':   joined_resp
                }
            )


class AwaitedFleetView(FormView):

    # class checks if enemy's fleet has arrived and gives
    # an answer to battle.html via ajax
    # class is being used by player, who creates game

    def get(self,request, *args, **kwargs):

        opponent = BattleMap.objects.get(user=request.user).map_of_bf['opponent_username']
        print("Waiting for a fleet of ", opponent, " by ", request.user)
        try:
            username_id = User.objects.get(username=opponent).id
            respjson2 = BattleMap.objects.get(user=username_id).map_of_bf
        except:
            respjson2 = {}
        return JsonResponse(respjson2)


class CleaningView(FormView):

    # deleting map of player, when the window is being hidden by him

    def get(self, request, *args, **kwargs):
        BattleMap.objects.filter(user=request.user).delete()
        print("Map of ", request.user, " deleted from db")
        resp = {"window.onclose event": "Deleting map successfully completed"}
        return JsonResponse(resp)


class StatementSendView(FormView):

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


class StatementGetView(FormView):

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

