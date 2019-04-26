from datetime import timedelta

from django.contrib.auth.models import User

from django.db.models import Q
from django.http import JsonResponse
from django.utils.timezone import now

from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from sea_battle.api import serializers
from sea_battle.models import BattleMap, Game
from sea_battle.services import get_game, get_enemy_shoots, get_game_state, handle_shoot


class CleaningAPIView(generics.GenericAPIView):

    # deleting map of player, when the window is being hidden by him

    def get(self, request, *args, **kwargs):
        BattleMap.objects.filter(user=request.user).delete()
        resp = {"window.onclose event": "Deleting map successfully completed"}
        self.get_queryset()
        return JsonResponse(resp)


class ActiveGamesAPIViewSet(viewsets.GenericViewSet):

    def get_queryset(self):
        starting_time = now() - timedelta(seconds=60)

        online_users = User.objects.filter(
            onlineuseractivity__last_activity__gte=starting_time
        )

        games = Game.objects.filter(creator__in=online_users, joiner=None)

        return games

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        serializer = serializers.ActiveGamesSerializer(queryset, many=True)

        return Response(serializer.data)


class NewGameAPIViewSet(viewsets.GenericViewSet):
    pass


# class JoinGameAPIView(generics.GenericAPIView):
#     pass

# class ShootHandlerAPIView(generics.GenericAPIView):
#
#     def post(self, request, *args, **kwargs):
#         data = json.loads(request.body)
#         last_shoot = data['target'].split(',')
#         prepared_shoot = [int(last_shoot[0]), int(last_shoot[1])]
#
#         game = get_game(data['game_id'], request.user)
#
#         if not game.turn == request.user:
#             raise PermissionDenied
#
#         shoot_result = handle_shoot(
#             last_shoot=prepared_shoot,
#             game=game,
#             current_user=request.user
#         )
#
#         return JsonResponse({
#             'state': get_game_state(game, request.user),
#             'shoot_result': shoot_result,
#         })
#
#


class GamesAPIViewSet(viewsets.GenericViewSet):

    serializer_class = serializers.StatmentGetSerializer
    lookup_url_kwarg = 'game_id'
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        current_user = self.request.user
        return Game.objects.filter(Q(creator=current_user) | Q(joiner=current_user))

    def create(self, request):
        # create game
        pass

    def update(self):
        pass

    @action(methods=['POST'], detail=True)
    def join(self, request, **kwargs):

        game = Game.objects.get(
            pk=request.data['game_id'],
        )
        game.joiner = self.request.user
        game.save()

        return Response(
            {
                'size': game.size,
                'sizeiterator': list(range(int(game.size))),
                'opponent': game.creator_id,
                'game_id': game.pk,
            }
        )

    @action(methods=['GET'], detail=True)
    def state(self, request, **kwargs):
        game = self.get_object()

        serializer = self.get_serializer(game)
        return Response(serializer.data)
