import graphene
from django.contrib.auth.models import User
from graphene_django import DjangoObjectType

from sea_battle.models import Game
from sea_battle.services import get_game_state, get_enemy_shoots


class UserAlreadyExists(graphene.ObjectType):
    err_msg = graphene.String()


class PasswordTooWeak(graphene.ObjectType):
    err_msg = graphene.String()


class CreateUserSuccess(graphene.ObjectType):
    token = graphene.String()


class GameType(DjangoObjectType):

    class Meta:
        model = Game


class UserType(DjangoObjectType):

    class Meta:
        model = User


class InitialForJoinerType(graphene.ObjectType):
    name = graphene.Field(graphene.String)
    creator = graphene.Field(graphene.String)
    size = graphene.Field(graphene.Int)
    game_id = graphene.Field(graphene.Int)


class ActiveGameType(graphene.ObjectType):
    my_dead_zone = graphene.List(graphene.List(graphene.Int))
    enemy_dead_zone = graphene.List(graphene.List(graphene.Int))
    fleet = graphene.List(graphene.List(graphene.List(graphene.Int)))
    enemy_shoots = graphene.List(graphene.List(graphene.String))
    game_state = graphene.String()
    my_shoots = graphene.List(graphene.List(graphene.String))
    curr_user = graphene.String()
    game_details = graphene.Field(GameType)


class GameStateDataType(graphene.ObjectType):
    state = graphene.Field(graphene.String)
    turn = graphene.Field(graphene.String)
    joiner = graphene.Field(graphene.String)
    shoots_of_enemy = graphene.List(graphene.List(graphene.String))
    my_dead_zone = graphene.List(graphene.List(graphene.Int))

    def resolve_state(self, info, **kwargs):
        return get_game_state(self, info.context.user)

    def resolve_shoots_of_enemy(self, info, **kwargs):

        shoots_of_enemy = None
        if self.joiner and self.battle_maps.filter(user=self.joiner):
            current_user = info.context.user
            shoots_of_enemy, my_dead_zone = get_enemy_shoots(self.pk, current_user)

        return shoots_of_enemy

    def resolve_my_dead_zone(self, info, **kwargs):

        my_dead_zone = None
        if self.joiner and self.battle_maps.filter(user=self.joiner):
            current_user = info.context.user
            shoots_of_enemy, my_dead_zone = get_enemy_shoots(self.pk, current_user)

        return my_dead_zone


class FleetErrorsType(graphene.ObjectType):
    not_allowed_ship_count = graphene.JSONString()
    forbidden_cells = graphene.List(graphene.List(graphene.Int))
    not_allowed_ships = graphene.List(graphene.List(graphene.List(graphene.Int)))
    invalid_ship_composition = graphene.List(graphene.List(graphene.List(graphene.Int)))
    err_msg = graphene.String()

