from datetime import datetime
from typing import List, NamedTuple, Tuple, Dict, Union, Set, Optional, Iterable, TypeVar, Any, Collection

from django.contrib.auth.models import User
from django.core import exceptions
from django.db import transaction
from django.db.models import Q
from django.db.models.expressions import Combinable
from django.db.models.fields import AutoField
from django.db.models.query import QuerySet
from django.utils import timezone

from sea_battle import constants
from sea_battle.models import BattleMap, Game
from sea_battle.utils import \
    prepare_to_store, \
    ship_dead_zone_handler, \
    mapped_shoots

import logging

logger = logging.getLogger(__name__)


# class for using in annotating
class ShootResult(NamedTuple):
    result: str
    dead_zone: List[Tuple[int, int]]
    dead_ship: List[Tuple[int, int]]


class GameType(Game):
    creator_id: AutoField
    joiner_id: AutoField
    winner_id: AutoField
    turn_id: AutoField
    battle_maps: QuerySet


T = TypeVar("T", List, Tuple)


def handle_shoot(
        last_shoot: List[int],
        game: GameType,
        current_user: User):

    logger.info("handle shoot. Args: \n last_shoot: %s %s", last_shoot, type(last_shoot))
    """ func gives a state-message of shooting result,
    saves shoot in db  """

    my_map, enemy_map = get_game_battle_maps(game, current_user)
    last_shoot = tuple(last_shoot)
    dead_zone: List = []
    dead_ship: List = []

    if not my_map or not enemy_map:
        raise ValueError('Invalid game')

    my_map.shoots.append(last_shoot)  # type: ignore
    my_map.save()

    shoots = list(map(tuple, my_map.shoots))  # type: ignore
    print(type(shoots[0]), type(shoots[0][0]))

    shoots = set(shoots)

    shoot_result = constants.SHOOT_RESULT_MISS

    for ship in enemy_map.fleet:
        ship = set(map(tuple, ship))
        if last_shoot in ship:
            shoot_result = constants.SHOOT_RESULT_HIT

            if ship.issubset(shoots):
                shoot_result = constants.SHOOT_RESULT_KILL
                dead_zone = ship_dead_zone_handler(ship)
                dead_ship = ship

            break

    # update game state if necessary
    update_game_state(game, shoot_result, current_user, shoots, enemy_map)  # type: ignore

    return ShootResult(shoot_result, dead_zone, dead_ship)


def update_game_state(
        game: GameType,
        shoot_result: str,
        current_user: User,
        shoots: Set[Tuple[int, int]],
        enemy_map: BattleMap) -> None:

    """ changes turn between users if res of shoot is 'miss'
    or sets winner to game, if shooter killed the whole enemy's fleet"""

    if shoot_result == constants.SHOOT_RESULT_MISS:
        if game.turn_id == game.creator_id:
            game.turn_id = game.joiner_id
        else:
            game.turn_id = game.creator_id

    if shoot_result == constants.SHOOT_RESULT_KILL:

        tupled_fleet = [
            tuple(item) for ship in enemy_map.fleet for item in ship
        ]
        if set(tupled_fleet).issubset(shoots):
            game.winner_id = current_user.pk

    game.save()
    return


def get_game(game_id, current_user):

    """ Suitable both for joiner and for creator.
    Using this info, first, we check whose turn of shooting is now. """

    return (
        Game.objects
            .filter(Q(creator=current_user) | Q(joiner=current_user))
            .filter(pk=game_id)
            .select_related('turn', 'creator', 'joiner')
            .first()
    )


def get_game_state(game, current_user):

    """ apart func for generating current game
    state message for using in response"""

    if not game.joiner_id:
        return constants.WAITING_FOR_JOINER
    else:
        fleet = []
        try:
            fleet = game.battle_maps\
                .filter(user_id=game.joiner_id)\
                .first().fleet
        except:
            return constants.WAITING_FOR_JOINER

        if not fleet:
            return constants.WAITING_FOR_JOINER

    if game.winner_id and game.winner_id == current_user.pk:
        return constants.WIN

    if game.winner_id:
        return constants.LOOSE

    return constants.ACTIVE


def get_enemy_shoots(
        game_id: int,
        current_user: User):

    """ We get array of enemy's shoots, if exists,
    for further sending it to frontend.
    Using that info player paints his own map,
    according to current state """

    bm1, bm2 = BattleMap.objects.filter(game_id=game_id)
    if bm1.user == current_user:
        return mapped_shoots(bm2.shoots, bm1.fleet)
    if bm2.user == current_user:
        return mapped_shoots(bm1.shoots, bm2.fleet)
    return []


def get_game_battle_maps(game: GameType, current_user: User) -> \
        Tuple[Optional[BattleMap], Optional[BattleMap]]:

    """ Necessary for inspection,
    whether ship is hurt, fleet is alive """

    battle_maps = list(game.battle_maps.all())

    if battle_maps and len(battle_maps) == 2:
        m1, m2 = battle_maps
        if m1.user_id == current_user.pk:
            return m1, m2
        return m2, m1

    elif battle_maps:
        m = battle_maps[0]
        if m.user_id == current_user.pk:
            return m, None
        return None, m

    return None, None


def create_user(data: Dict) -> User:

    user = User.objects.create_user(
        username=data['username'],
        password=data['password']
    )
    return user


def create_game(data: Dict, user: User) -> Tuple[Game, BattleMap]:

    """set start params of the game to db by the player,
    who creates the game"""

    with transaction.atomic():

        game = Game.objects.create(

            size=data['size'],
            turn=user,
            creating_date=datetime.now(),
            creator=user,
            joiner=None,
            name=data['name'],
            last_activity=timezone.now(),
        )

        battle_map = BattleMap.objects.create(
            user=user,
            fleet=prepare_to_store(data['fleet']),
            shoots=[],
            game=game,
            template=False
        )
        return game, battle_map


def join_game(game_id, user):

    """try to join to the particular game"""

    with transaction.atomic():
        fail_message = ""
        try:
            game = Game.objects\
                .filter(Q(pk=game_id), ~Q(creator=user))\
                .select_for_update()\
                .first()

        except exceptions.ObjectDoesNotExist:
                fail_message = constants.GAME_NOT_FOUND
                game = None
                return game, fail_message

        if game.joiner:
            fail_message = constants.FAIL_TO_JOIN
            game = None
            return game, fail_message

        game.joiner = user
        game.save()
        return game, fail_message


def join_fleet(game_id, user, fleet):

    with transaction.atomic():
        map_number = BattleMap.objects.filter(game_id=game_id).count()
        if map_number == 1:
            BattleMap.objects.create(
                user=user,
                fleet=prepare_to_store(fleet),
                shoots=[],
                game_id=game_id,
            )
        else:
            return constants.FAIL_TO_ADD_FLEET
