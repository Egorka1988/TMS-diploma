
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
    creator = serializers.CharField()


class ShootResultSerializer(serializers.Serializer):

    state = serializers.CharField()
    shoot = serializers.CharField()
    dead_zone = serializers.ListField()


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
    turn = serializers.CharField()


class JoinFleetSerializer(serializers.Serializer):

    fleet = serializers.ListField()
    dead_zone = serializers.JSONField()


class InitialStateSerializer(serializers.Serializer):

    creator = serializers.CharField()
    id = serializers.IntegerField()
    size = serializers.IntegerField()
    name = serializers.CharField(default='')
    joiner = serializers.CharField()
    turn = serializers.CharField()
    winner = serializers.CharField(default='')
    # game_state = serializers.CharField()
    # fleet = serializers.ListField()
    # my_dead_zone = serializers.JSONField()
    # enemy_dead_zone = serializers.JSONField()
    # my_shoots = serializers.JSONField(default={'my_shoots': []})
    # enemy_shoots = serializers.JSONField(default={'enemy_shoots': []})

