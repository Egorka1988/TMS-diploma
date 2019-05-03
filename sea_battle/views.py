
import json
import logging

from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.generic import View
from datetime import timedelta
from sea_battle.models import Game
from sea_battle.services import create_game, join_game

from sea_battle.utils import extract_ships_from

logging.basicConfig(filename='views.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')


class HelloView(View):

    template_name = 'index.html'

    def get(self, request, *args, **kwargs):

        template = HelloView.template_name

        return render(
            request,
            template)


class RegisterFormView(View):

    form_class = UserCreationForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('see_users')

    def form_valid(self, form):
        form.save()
        user = authenticate(
            # for redirecting after registration to success_url with ontime authentificate
            request=self.request,
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1']
        )
        login(self.request, user)
        return super(RegisterFormView, self).form_valid(form)


class SeeUsersView(View):

    """ your opponents in game.
    You point the user that you want to create a game with """

    template_name = 'playerlist.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        starting_time = now() - timedelta(seconds=60)

        online_users = User.objects.filter(
            onlineuseractivity__last_activity__gte=starting_time
        )

        # games = Game.available_games.filter(creator__in=online_users)\
        #     .exclude(creator=request.user)
        games = Game.objects.available_games()

        print(repr(games))

        cleared_users = games.values_list('creator__username', 'id', 'size', 'name')

        cleared_users = json.dumps(list(cleared_users))

        return render(
            request,
            SeeUsersView.template_name,
            context={
                "online_users": cleared_users,
            }
        )


class GameNewView(View):

    """ view for setting the fleet for user, who created game"""

    template_name = 'pre_battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        size = int(request.POST.get('fld_size'))

        return render(
            request,
            GameNewView.template_name,
            context={
                'size': size,
                'sizeiterator': list(range(size)),
                'identity': "creator",
                'game_name': request.POST.get('Name_of_game'),
            }
        )


class GameJoinView(View):

    """ view for setting the fleet for user, who joined the game"""

    template_name = 'pre_battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        game = Game.objects.get(
            pk=request.POST.get('game_id'),
        )

        return render(
            request,
            GameJoinView.template_name,
            context={
                'size':         game.size,
                'sizeiterator': list(range(int(game.size))),
                'opponent':     game.creator_id,
                'game_id':      game.pk,
            }
        )


class GamePlayViewForCreator(View):

    """here we render the main template, where the game acts."""

    template_name = 'battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        data = json.loads(request.POST.get('json_form'))
        fleet = extract_ships_from(data['fleet'])

        if data['game_name'] != 'Name of your game':
            game_name = data['game_name']
        else:
            game_name = 'No name'

        game, battlemap = set_game_params_to_db_for_creator(
            data['size'],
            request.user,
            game_name,
            fleet,
        )

        return render(
            request,
            GamePlayViewForCreator.template_name,
            context={
                'game_id':       game.pk,
                'fleet':         json.dumps(battlemap.fleet),
                'sizeiterator':  list(range(game.size)),
                'size':          game.size,
                'turn_to_shoot': True,
            }
        )


class GamePlayViewForJoiner(View):

    """here we render the main template, where the game acts for joiner."""

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        data = json.loads(request.POST.get('json_form'))
        fleet = extract_ships_from(data['fleet'])

        game, battlemap = join_game(
            data['game_id'],
            request.user,
            fleet
        )
        return render(
            request,
            GamePlayViewForCreator.template_name,
            context={
                'game_id':       game.pk,
                'fleet':         json.dumps(battlemap.fleet),
                'sizeiterator':  list(range(game.size)),
                'size':          game.size,
                'turn_to_shoot': False,
            }
        )