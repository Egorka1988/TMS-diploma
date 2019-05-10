
from rest_framework import serializers

from sea_battle.models import Game

# Serializers define the API representation.
from sea_battle.services import get_game_state, get_enemy_shoots


class ActiveGamesSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    name = serializers.CharField()
    size = serializers.IntegerField()
    creator_id = serializers.IntegerField()
    joiner_id = serializers.IntegerField()


class AvailableGamesSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    name = serializers.CharField()
    size = serializers.IntegerField()
    creator_id = serializers.IntegerField()


class ShootResultSerializer(serializers.Serializer):

    state = serializers.CharField()
    shoot = serializers.CharField()


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
