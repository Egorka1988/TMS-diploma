
from rest_framework import serializers

# Serializers define the API representation.
from sea_battle.services import get_game_state, get_enemy_shoots
import logging

logger = logging.getLogger(__name__)

class ActiveGamesSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    name = serializers.CharField()
    size = serializers.IntegerField()
    creator_id = serializers.IntegerField()
    joiner_id = serializers.IntegerField()


class GamesListSerializer(serializers.Serializer):
    games = serializers.SerializerMethodField()

    def get_games(self, *args, **kwargs):
        data = self.instance
        res = {}
        for game_bulk in data.keys():
            game_items = []
            for game in data[game_bulk]:
                print(game)
                content = {}
                content["id"] = game.id
                content["creator"] = game.creator.username
                content["size"] = game.size
                content["name"] = game.name
                if game_bulk == "my_games":
                    content["joiner"] = game.joiner.username if game.joiner else ""
                    content["turn"] = game.turn.username
                game_items.append(content)
            res.update({game_bulk: game_items})
        return res


class ShootResultSerializer(serializers.Serializer):

    state = serializers.CharField()
    shoot = serializers.CharField()
    dead_zone = serializers.ListField()
    dead_ship = serializers.ListField()


class StatmentGetSerializer(serializers.Serializer):

    state = serializers.SerializerMethodField()
    turn = serializers.CharField()
    joiner = serializers.CharField()

    def get_user(self):
        return self.context['request'].user

    def get_state(self, game):
        user = self.get_user()
        return get_game_state(game, user)

    def to_representation(self, game):
        data = super().to_representation(game)

        if game.joiner and game.battle_maps.filter(user=game.joiner):
            current_user = self.get_user()
            shoots, dead_zone = get_enemy_shoots(game.pk, current_user)
            data['shoots_of_enemy'] = shoots
            data['my_dead_zone'] = dead_zone

        return data


class NewGameSerializer(serializers.Serializer):

    id = serializers.IntegerField()


class JoinFleetSerializer(serializers.Serializer):

    fleet = serializers.ListField()


class InitialStateSerializer(serializers.Serializer):

    creator = serializers.CharField()
    id = serializers.IntegerField()
    size = serializers.IntegerField()
    name = serializers.CharField(default='')
    joiner = serializers.CharField()
    turn = serializers.CharField()
    winner = serializers.CharField(default='')
