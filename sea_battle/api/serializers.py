from django.contrib.auth.models import User
from rest_framework import serializers

from sea_battle.models import Game, BattleMap


# Serializers define the API representation.
from sea_battle.services import get_game_state, get_enemy_shoots


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')


class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ('pk', 'name', 'size', 'turn', 'creator', 'joiner', 'winner', 'creating_date')


class BattleMapSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BattleMap
        fields = ('pk', 'game', 'user', 'fleet', 'shoots', 'rating', 'template')


class ActiveGamesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ('creator', 'id', 'size', 'name')


class StatmentGetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = [
            'pk',
            'creator',
            'joiner',
            'creating_date',
            'turn',
            'size',
            'winner'
            ]
