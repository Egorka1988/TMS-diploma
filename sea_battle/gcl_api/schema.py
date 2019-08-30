import graphene
import graphql_jwt
from django.contrib.auth.models import User
from django.utils import timezone
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from sea_battle import constants
from sea_battle.api import validators, serializers
from sea_battle.models import Game
import logging

from sea_battle.services import create_game, get_game_battle_maps, get_game_state, get_enemy_shoots, join_game, \
    join_fleet
from sea_battle.utils import mapped_shoots

logger = logging.getLogger(__name__)


class GameType(DjangoObjectType):

    class Meta:
        model = Game


class UserType(DjangoObjectType):

    class Meta:
        model = User


# class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
#     user = graphene.Field(UserType)
#
#     @classmethod
#     def resolve(cls, root, info, **kwargs):
#         return cls(user=info.context.user)

class GameStateDataType(graphene.ObjectType):
    state = graphene.Field(graphene.String)
    turn = graphene.Field(graphene.String)
    joiner = graphene.Field(graphene.String)
    shoots_of_enemy = graphene.List(graphene.List(graphene.JSONString))
    my_dead_zone = graphene.List(graphene.List(graphene.Int))

    def resolve_state(self, info, **kwargs):
        # return get_game_state(self, info.context.user)
        return "win"
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


class InitialForJoinerType(graphene.ObjectType):
    name = graphene.Field(graphene.String)
    creator = graphene.Field(graphene.String)
    size = graphene.Field(graphene.Int)
    game_id = graphene.Field(graphene.Int)

class Query(graphene.ObjectType):
    my_games = graphene.List(GameType)
    av_games = graphene.List(GameType)
    fleet_composition = graphene.JSONString()
    active_game = graphene.Field(graphene.JSONString, game_id=graphene.Int())
    game_state_data = graphene.Field(GameStateDataType, game_id=graphene.Int())
    initial_for_joiner = graphene.Field(InitialForJoinerType, game_id=graphene.Int())

    @login_required
    def resolve_my_games(self, info, **kwargs):
        return Game.objects.my_games(info.context.user)

    @login_required
    def resolve_av_games(self, info, **kwargs):
        print("777777777777", info.context.user)
        return Game.objects.available_games(User.objects.get(username=info.context.user))

    @login_required
    def resolve_fleet_composition(self, info, **kwargs):
        return constants.FLEET_COMPOSITION

    @login_required
    def resolve_active_game(self, info, **kwargs):
        game = Game.objects.get(pk=kwargs["game_id"])
        my_bm, enemy_bm = get_game_battle_maps(game, info.context.user)

        my_shoots, enemy_dead_zone = [], []
        e_shoots, my_dead_zone = [], []
        my_fleet = []

        if my_bm:
            my_fleet = my_bm.fleet
            my_shoots = my_bm.shoots

        if enemy_bm:
            e_shoots = enemy_bm.shoots
            e_fleet = enemy_bm.fleet

            if e_shoots:
                e_shoots, my_dead_zone = mapped_shoots(e_shoots, my_fleet)
            if my_shoots:
                my_shoots, enemy_dead_zone = mapped_shoots(my_shoots, e_fleet)

        serializer = serializers.InitialStateSerializer(game)

        data = serializer.data
        data['my_dead_zone'] = my_dead_zone
        data['enemy_dead_zone'] = enemy_dead_zone
        data['fleet'] = my_fleet
        data['enemy_shoots'] = e_shoots
        data['game_state'] = get_game_state(game, info.context.user)
        data['my_shoots'] = my_shoots
        data['current_user'] = info.context.user.username
        return data


    @login_required
    def resolve_game_state_data(self, info, **kwargs):
        game = Game.objects.get(pk=kwargs["game_id"])
        game.last_activity = timezone.now()
        game.save()

        return game

    @login_required
    def resolve_initial_for_joiner(self, info, **kwargs):
        game = Game.objects.filter(pk=kwargs["game_id"], joiner=info.context.user).first()
        if game:
            return InitialForJoinerType(
                name=game.name,
                creator=game.creator.username,
                size=game.size,
                game_id=game.pk
            )

        else:
            return {}

class CreateGameMutation(graphene.Mutation):
    class Input:
        name = graphene.String()
        fleet = graphene.List(graphene.List(graphene.Int))
        size = graphene.Int()

    game_id = graphene.Int()
    fleet_errors = graphene.JSONString()

    @login_required
    def mutate(self, info, *args, **kwargs):

        validator = validators.NewGameValidator(data=kwargs)
        validator.is_valid(raise_exception=True)

        fleet_composition_errors = validator.check_fleet_composition()
        print("8888888888", info.context.user)
        if fleet_composition_errors:
            logger.debug(
                "%s tried to create game. These errors occur: %s" % (info.context.user, fleet_composition_errors))
            return CreateGameMutation(fleet_errors=fleet_composition_errors, game_id=None)

        # Pass validated data to business logic (service)
        game, battlemap = create_game(validator.validated_data, info.context.user)

        # Serialization
        data = serializers.NewGameSerializer(game).data
        print("resp: ", data)
        return CreateGameMutation(game_id=data['id'])

class FleetErrorsType(graphene.ObjectType):
    not_allowed_ship_count = graphene.JSONString()
    forbidden_cells = graphene.List(graphene.List(graphene.Int))
    not_allowed_ships = graphene.List(graphene.List(graphene.List(graphene.Int)))
    invalid_ship_composition = graphene.List(graphene.List(graphene.List(graphene.Int)))
    err_msg = graphene.String()

class JoinFleetMutation(graphene.Mutation):
    class Input:
        game_id = graphene.Int()
        fleet = graphene.List(graphene.List(graphene.Int))
        size = graphene.Int()

    game_id = graphene.Int()
    fleet_errors = graphene.Field(FleetErrorsType)

    @login_required
    def mutate(self, info, *args, game_id, **kwargs):

        validator = validators.JoinFleetValidator(data=kwargs)
        validator.is_valid(raise_exception=True)

        fleet_composition_errors = validator.check_fleet_composition()
        if fleet_composition_errors:
            return JoinFleetMutation(game_id=None, fleet_errors={**fleet_composition_errors})

        fleet = validator.validated_data['fleet']
        err = join_fleet(game_id, info.context.user, fleet)
        if err:
            return JoinFleetMutation(game_id=None, fleet_errors={"err_msg": err})
        return JoinFleetMutation(game_id=game_id, fleet_errors=None)


class JoinGameMutation(graphene.Mutation):
    class Input:
        game_id = graphene.Int()

    result = graphene.Boolean()
    size = graphene.Int()
    creator = graphene.String()
    name = graphene.String()
    game_id = graphene.Int()
    reason = graphene.String()

    @login_required
    def mutate(self, info, *args, **kwargs):
        game = join_game(kwargs['game_id'], info.context.user)
        result = True
        reason, name = "", ""
        size, game_id, creator = None, None, None
        if game == constants.FAIL_TO_JOIN:
            reason = constants.FAIL_TO_JOIN
            result = False

        if game == constants.GAME_NOT_FOUND:
            reason = constants.GAME_NOT_FOUND
            result = False

        if result == True:
            size = game.size
            creator = game.creator.username
            game_id = game.pk
            name = game.name

        return JoinGameMutation(
            result=result,
            reason=reason,
            size=size, creator=creator,
            game_id=game_id,
            name=name
        )

class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    create_game = CreateGameMutation.Field()
    join_game = JoinGameMutation.Field()
    join_fleet = JoinFleetMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
