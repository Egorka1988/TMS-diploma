from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import serializers, exceptions

from sea_battle.models import Game, BattleMap

# Serializers define the API representation.
from sea_battle.services import get_game_state, get_enemy_shoots, set_joiner



class ActiveGamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id', 'name', 'creator', 'size')


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
