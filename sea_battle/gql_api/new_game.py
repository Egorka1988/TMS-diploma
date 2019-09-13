import logging

import graphene
from graphql_jwt.decorators import login_required

from sea_battle import constants
from sea_battle.api import validators
from sea_battle.gql_api.types import FleetErrorsType
from sea_battle.services import create_game

logger = logging.getLogger(__name__)


class NewGameQueries(graphene.ObjectType):
    fleet_composition = graphene.JSONString()

    @login_required
    def resolve_fleet_composition(self, info, **kwargs):
        return constants.FLEET_COMPOSITION


class CreateGameMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        fleet = graphene.List(graphene.List(graphene.Int))
        size = graphene.Int()

    game_id = graphene.Int()
    fleet_errors = graphene.Field(FleetErrorsType)

    @login_required
    def mutate(self, info, *args, **kwargs):

        validator = validators.NewGameValidator(data=kwargs)
        validator.is_valid(raise_exception=True)

        fleet_composition_errors = validator.check_fleet_composition()

        if fleet_composition_errors:
            logger.debug(
                "%s tried to create game. These errors occur: %s" % (info.context.user, fleet_composition_errors))
            return CreateGameMutation(fleet_errors=fleet_composition_errors, game_id=None)

        # Pass validated data to business logic (service)
        game, battlemap = create_game(validator.validated_data, info.context.user)

        return CreateGameMutation(game_id=game.id)


class NewGameMutations(graphene.ObjectType):
    create_game = CreateGameMutation.Field()

