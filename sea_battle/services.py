from datetime import datetime

from django.db.models import Q

from sea_battle.consts import SHOOT_RESULT_MISS, SHOOT_RESULT_HIT, SHOOT_RESULT_KILL
from sea_battle.models import BattleMap, Game
from sea_battle.utils import prepare_to_store


def handle_shoot(last_shoot, game, current_user):

    """ func gives a state-message of shooting result,
    saves shoot in db  """

    last_shoot = tuple(last_shoot)
    my_map, enemy_map = get_game_battle_maps(game, current_user)

    if not my_map or not enemy_map:
        raise ValueError('Invalid game')

    my_map.shoots.append(last_shoot)
    my_map.save()

    shoots = set(map(tuple, my_map.shoots))

    shoot_result = SHOOT_RESULT_MISS

    for ship in enemy_map.fleet:
        ship = set(map(tuple, ship))
        if last_shoot in ship:
            shoot_result = SHOOT_RESULT_HIT

            if ship.issubset(shoots):
                shoot_result = SHOOT_RESULT_KILL
            break

    # update game state if necessary
    update_game_state(game, shoot_result, current_user, shoots, enemy_map)

    return shoot_result


def update_game_state(game, shoot_result, current_user, shoots, enemy_map):

    """ changes turn between users if res of shoot is 'miss'
    or sets winner to game, if shooter killed the whole enemy's fleet"""

    if shoot_result == SHOOT_RESULT_MISS:
        if game.turn_id == game.creator_id:
            game.turn_id = game.joiner_id
        else:
            game.turn_id = game.creator_id

    if shoot_result == SHOOT_RESULT_KILL:
        if all(set(ship).issubset(shoots) for ship in enemy_map.fleet):
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
        return 'waiting_for_joiner'

    if game.winner_id and game.winner_id == current_user.pk:
        return 'win'

    if game.winner_id:
        return 'loose'

    return 'active'


def get_enemy_shoots(game_id, current_user):

    """ We get array of enemy's shoots, if exists,
    for further sending it to frontend.
    Using that info player paints his own map,
    according to current state """

    battle_map = BattleMap.objects.filter(~Q(user=current_user), game_id=game_id).first()
    if battle_map:
        return battle_map.shoots
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


def set_game_params_to_db_for_creator(size, user, name, fleet):

    """set start params of the game to db by the player, who created game"""

    game = Game.objects.create(
        size=size,
        turn=user,
        creating_date=datetime.now(),
        creator=user,
        joiner=None,
        name=name,
    )

    battle_map = BattleMap.objects.create(
        user=user,
        fleet=prepare_to_store(fleet),
        shoots=[],
        game=game,
    )
    return game, battle_map


def set_game_params_to_db_for_joiner(game_id, user, fleet):

    """set params of the game to db by the player, who joined game"""

    game = Game.objects.get(pk=game_id)
    game.joiner = user
    game.save()

    battle_map = BattleMap.objects.create(
        user=user,
        fleet=prepare_to_store(fleet),
        shoots=[],
        game=game,
    )

    return game, battle_map


