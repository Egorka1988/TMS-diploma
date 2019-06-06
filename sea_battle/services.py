from datetime import datetime

from django.contrib.auth.models import User
from django.core import exceptions
from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from sea_battle import constants
from sea_battle.models import BattleMap, Game
from sea_battle.utils import \
    prepare_to_store, \
    ship_dead_zone_handler, \
    mapped_shoots


def handle_shoot(last_shoot, game, current_user):

    """ func gives a state-message of shooting result,
    saves shoot in db  """

    last_shoot = tuple(last_shoot)
    my_map, enemy_map = get_game_battle_maps(game, current_user)
    dead_zone = []
    dead_ship = []

    if not my_map or not enemy_map:
        raise ValueError('Invalid game')

    my_map.shoots.append(last_shoot)
    my_map.save()

    shoots = set(map(tuple, my_map.shoots))

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
    update_game_state(game, shoot_result, current_user, shoots, enemy_map)

    return shoot_result, dead_zone, dead_ship


def update_game_state(game, shoot_result, current_user, shoots, enemy_map):

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


def get_enemy_shoots(game_id, current_user):

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


def get_game_battle_maps(game, current_user):

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


def create_user(data):

    user = User.objects.create_user(
        username=data['username'],
        password=data['password']
    )
    return user


def create_game(data, user):

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
        try:
            game = Game.objects.available_games(). \
                select_for_update().\
                get(pk=game_id)
        except exceptions.ObjectDoesNotExist:
            return constants.GAME_NOT_FOUND

        if game.joiner:
            return constants.FAIL_TO_JOIN

        game.joiner = user
        game.save()
    return game


def join_fleet(game_id, user, fleet):

    with transaction.atomic():
        qs = BattleMap.objects.filter(game_id=game_id)
        if len(qs) == 1:
            BattleMap.objects.create(
                user=user,
                fleet=prepare_to_store(fleet),
                shoots=[],
                game_id=game_id,
            )
        else:
            return constants.FAIL_TO_ADD_FLEET
