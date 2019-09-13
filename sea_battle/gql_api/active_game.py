import graphene
from django.utils import timezone
from graphql_jwt.decorators import login_required

from sea_battle import constants
from sea_battle.api import validators
from sea_battle.gql_api.types import ActiveGameType, GameStateDataType
from sea_battle.models import Game
from sea_battle.services import get_game_battle_maps, get_game_state, handle_shoot, get_game
from sea_battle.utils import mapped_shoots


class ActiveGameQueries(graphene.ObjectType):
    active_game = graphene.Field(ActiveGameType, game_id=graphene.Int())
    game_state_data = graphene.Field(GameStateDataType, game_id=graphene.Int())

    @login_required
    def resolve_active_game(self, info, game_id, **kwargs):

        game = Game.objects.get(pk=game_id)
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

        return ActiveGameType(
            my_dead_zone=my_dead_zone,
            enemy_dead_zone=enemy_dead_zone,
            my_shoots=my_shoots,
            enemy_shoots=e_shoots,
            game_details=game,
            fleet=my_fleet,
            game_state=get_game_state(game, info.context.user),
            curr_user=info.context.user.username
        )

    @login_required
    def resolve_game_state_data(self, info, game_id, **kwargs):
        game = Game.objects.get(pk=game_id)
        game.last_activity = timezone.now()
        game.save()

        return game


class ShootMutation(graphene.Mutation):
    class Arguments:
        shoot = graphene.List(graphene.Int)
        game_id = graphene.Int()

    state = graphene.String()
    shoot_error = graphene.String()
    shoot_result = graphene.String()
    dead_zone = graphene.List(graphene.List(graphene.Int))
    dead_ship = graphene.List(graphene.List(graphene.Int))

    @login_required
    def mutate(self, info, **kwargs):
        shoot_error = shoot_result = state = dead_ship = dead_zone = None

        user = info.context.user
        game = get_game(kwargs['game_id'], user)
        if game.turn == user:

            validator = validators.ShootValidator(data=kwargs)
            validator.is_valid(raise_exception=True)
            shoot = validator.validated_data['shoot']

            shoot_result, dead_zone, dead_ship = handle_shoot(
                shoot,
                game,
                user
            )
            state = get_game_state(game, user)

        else:
            shoot_error = constants.NOT_YOUR_TURN

        return ShootMutation(
            state=state,
            shoot_result=shoot_result,
            shoot_error=shoot_error,
            dead_zone=dead_zone,
            dead_ship=dead_ship
        )


class ActiveGameMutations(graphene.ObjectType):
    shoot = ShootMutation.Field()
