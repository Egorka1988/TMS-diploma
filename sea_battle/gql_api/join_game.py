import graphene
from graphql_jwt.decorators import login_required

from sea_battle.api import validators
from sea_battle.gql_api.types import InitialForJoinerType, FleetErrorsType, GameType
from sea_battle.models import Game
from sea_battle.services import join_fleet, join_game


class JoinGameQueries(graphene.ObjectType):
    initial_for_joiner = graphene.Field(InitialForJoinerType, game_id=graphene.Int())

    @login_required
    def resolve_initial_for_joiner(self, info, game_id, **kwargs):
        game = Game.objects.filter(pk=game_id, joiner=info.context.user).first()
        if game:
            return InitialForJoinerType(
                name=game.name,
                creator=game.creator.username,
                size=game.size,
                game_id=game.pk
            )

        else:
            return {}


class JoinFleetMutation(graphene.Mutation):
    class Arguments:
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
            print("schema", fleet_composition_errors)
            return JoinFleetMutation(game_id=None, fleet_errors={**fleet_composition_errors})

        fleet = validator.validated_data['fleet']
        err = join_fleet(game_id, info.context.user, fleet)
        if err:
            return JoinFleetMutation(game_id=None, fleet_errors={"err_msg": err})
        return JoinFleetMutation(game_id=game_id, fleet_errors=None)


class JoinGameMutation(graphene.Mutation):
    class Arguments:
        game_id = graphene.Int()

    game = graphene.Field(GameType)
    fail_message = graphene.String()

    @login_required
    def mutate(self, info, *args, game_id, **kwargs):
        game, fail_message = join_game(game_id, info.context.user)
        return JoinGameMutation(
            fail_message=fail_message,
            game=game
        )


class JoinGameMutations(graphene.ObjectType):
    join_game = JoinGameMutation.Field()
    join_fleet = JoinFleetMutation.Field()
