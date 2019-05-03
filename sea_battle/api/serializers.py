
from rest_framework import serializers

from sea_battle.models import Game

# Serializers define the API representation.
from sea_battle.services import get_game_state, get_enemy_shoots


class ActiveGameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    size = serializers.IntegerField()
    creator_id = serializers.IntegerField()
    joiner_id = serializers.IntegerField()


class ActiveAndAvailableGamesSerializer(serializers.Serializer):

    active_games = serializers.SerializerMethodField()
    available_games = serializers.SerializerMethodField()

    def get_active_games(self, *args, **kwargs):
        user = self.context['request'].user
        games = Game.objects.active_games().exclude(creator=user)
        active_games = []
        for game in games:
            item = {
                'game.id': game.pk,
                'name': game.name,
                'size': game.size,
                'creator_id': game.creator_id,
                'joiner_id':game.joiner_id
            }
            active_games.append(item)
        return active_games

    def get_available_games(self, *args, **kwargs):

        user = self.context['request'].user
        games = Game.objects.available_games().exclude(creator=user)
        available_games = []
        for game in games:
            item = {
                'game.id': game.pk,
                'name': game.name,
                'size': game.size,
                'creator_id': game.creator_id
            }
            available_games.append(item)
        return available_games



class ShootResultSerializer(serializers.Serializer):

    state = serializers.CharField()
    shoot_result = serializers.CharField()


class StatmentGetSerializer(serializers.Serializer):

    state = serializers.SerializerMethodField()
    shoots_of_enemy = serializers.SerializerMethodField()

    def get_user(self):
        return self.context['request'].user

    def get_state(self, game):
        user = self.get_user()
        return get_game_state(game, user)

    def get_shoots_of_enemy(self, game):
        if game.joiner:
            current_user = self.get_user()
            return get_enemy_shoots(game.pk, current_user)
        return []


class NewGameSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    size = serializers.IntegerField()
    turn = serializers.IntegerField(source='turn_id')


class JoinFleetSerializer(serializers.Serializer):

    fleet = serializers.ListField()
