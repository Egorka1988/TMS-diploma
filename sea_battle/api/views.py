import json
from datetime import timedelta

from django.contrib.auth.models import User

from django.http import JsonResponse
from django.utils.timezone import now

from rest_framework import viewsets, generics
from rest_framework.response import Response
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
class StatementGetAPIViewSet(viewsets.GenericViewSet):

    def get_queryset(self):

        game_id = self.request.query_params['game_id']
        print(game_id)

        game = Game.objects.filter(pk=game_id)

        resp = "todo"

        return Response(resp)

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        serializer = serializers.StatmentGetSerializer(queryset, many=True)

        return Response(serializer.data)



    # def get(self, request, game_id):
    #
    #     game = get_game(game_id, request.user)
    #
    #     if not game:
    #         raise Response("No games're created yet", status=status.HTTP_404_NOT_FOUND)
    #
    #     return Response({
    #         'state': get_game_state(game, request.user),
    #         'shoots': get_enemy_shoots(game_id, request.user),
    #     })
