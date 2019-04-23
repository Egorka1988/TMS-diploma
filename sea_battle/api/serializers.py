from django.contrib.auth.models import User
from rest_framework import serializers

from sea_battle.models import Game, BattleMap


# Serializers define the API representation.
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
