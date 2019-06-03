import json

from sea_battle import constants


def extract_ships_from(ship_indexes):

    """ Function for making ships from their coords """

    ship_indexes = [tuple(idx) for idx in ship_indexes]

    fleet = []

    for item in sorted(set(ship_indexes)):
        x, y = item
        surround = {
            (x - 1, y),
            (x, y - 1),
        }

        related_ships = [ship for ship in fleet if ship & surround]

        if len(related_ships) > 1:
            # merge existing related ships
            new_ship = {item}
            for ship in related_ships:
                new_ship.update(ship)
                fleet.remove(ship)

            fleet.append(new_ship)

        elif related_ships:
            # append to a single ship
            related_ships[0].add(item)

        else:
            # start a new ship
            fleet.append({item})

    return fleet


def check_fleet_composition(fleet, size):

    err = {}
    fc = constants.FLEET_COMPOSITION[size]

    if 'air' in fc:
        current_fleet = dict.fromkeys(['1', '2', '3', '4', 'air'], 0)

    else:
        current_fleet = dict.fromkeys(['1', '2', '3', '4'], 0)

    not_allowed_ships = []

    for ship in fleet:

        if len(ship) == 8:
            current_fleet['air'] += 1
            continue
        if str(len(ship)) in current_fleet:
            key = str(len(ship))
            current_fleet[key] += 1
        else:
            print(2)
            not_allowed_ships.append(ship)

    if not not_allowed_ships:

        not_allowed_ship_count = [
            {k: current_fleet[k]} for k in current_fleet.keys() if fc[k] != current_fleet[k]
        ]
    else:
        not_allowed_ship_count = []

    if not_allowed_ships:
        err['not_allowed_ships'] = not_allowed_ships

    if not_allowed_ship_count:
        err['not_allowed_ship_count'] = not_allowed_ship_count

    ships_errors = []

    for ship in fleet:

        if len(ship) == 8:
            air_error = air_carr_validator(ship)
            if air_error:
                ships_errors.append(air_error)

        else:
            ship_error = linear_ship_validator(ship)
            if ship_error:
                ships_errors.append(ship_error)

    if ships_errors:
        err['invalid_ship_composition'] = ships_errors

    dead_zone = check_dead_zone(fleet)
    if 'forbidden_cells' in dead_zone.keys():
        err['forbidden_cells'] = dead_zone['forbidden_cells']

    return err


def air_carr_validator(ship):

    vert_axle = []
    hor_axle = []

    for cell in ship:
        x, y = cell
        if x and y:
            vert_axle.append(x)
            hor_axle.append(y)
        else:
            return ship

    v_refit_place_bottom = [
        vert_axle.count(max(vert_axle)-1) == 2,
        vert_axle.count(max(vert_axle) - 2) == 2
    ]
    v_refit_place_top = [
        vert_axle.count(min(vert_axle) + 1) == 2,
        vert_axle.count(min(vert_axle) + 2) == 2
    ]
    v_refit_place_right = [
        hor_axle.count(max(hor_axle) - 1) == 2,
        hor_axle.count(max(hor_axle) - 2) == 2
    ]
    v_refit_place_left = [
        hor_axle.count(min(hor_axle) + 1) == 2,
        hor_axle.count(min(hor_axle) + 2) == 2
    ]

    if (len(set(vert_axle)) == 6) and (len((set(hor_axle))) == 2):
        # if refit is placed in right vertical position
        if v_refit_place_bottom == [True, True] or v_refit_place_top == [True, True]:
            return {}

    if (len(set(vert_axle)) == 2) and (len(set(hor_axle)) == 6):
        # if refit is placed in right horizontal position
        if v_refit_place_left == [True, True] or v_refit_place_right == [True, True]:
            return {}

    return ship


def linear_ship_validator(ship):

    vert_axle = []
    hor_axle = []

    for cell in ship:
        x, y = cell
        if x and y:
            vert_axle.append(x)
            hor_axle.append(y)
        else:
            return ship
    ship_position = [
        len(set(vert_axle)) == len(ship),
        len(set(hor_axle)) == len(ship)
    ]

    if True in ship_position:
        return {}

    return ship


def check_dead_zone(fleet):
    dead_zone = {}
    f_cells = []
    for ship in fleet:
        dead_zone[frozenset(ship)] = ship_dead_zone_handler(ship)

    flat_fleet = [cell for ship in fleet for cell in ship]

    for zone in dead_zone.copy().values():
        for cell in zone:
            if cell in flat_fleet:
                f_cells.append(cell)
                dead_zone = {'forbidden_cells': f_cells}
    return dead_zone


def ship_dead_zone_handler(ship):

    ship = [tuple(cell) for cell in ship]

    ship_surr = set()

    for x, y in ship:
        ship_surr.update([
            (x - 1, y - 1),
            (x - 1, y + 1),
            (x - 1, y),
            (x + 1, y),
            (x, y - 1),
            (x, y + 1),
            (x + 1, y + 1),
            (x + 1, y - 1),
        ])

    dead_zone = ship_surr.difference(set(ship))

    return [(x, y) for x, y in dead_zone if x and y]

def prepare_to_store(fleet):

    """ Converting fleet to suitable format for JSONField """

    fleet = [tuple(tuple(part) for part in ship) for ship in fleet]
    return fleet


def mapped_shoots(shoots, fleet):
    _flat_fleet = []
    enemy_shoots = []
    for ship in fleet:
        _flat_fleet.extend(ship)
    for shoot in shoots:

        if shoot in _flat_fleet:
            enemy_shoots.append([*shoot, 'hit'])
        else:
            enemy_shoots.append([*shoot, 'miss'])
    return enemy_shoots


def get_enemy_dead_zone(shoots, fleet):
    enemy_dead_zone = {}

    for ship in fleet:
        tupled_ship = [tuple(item) for item in ship]
        tupled_shoots = [tuple(item) for item in shoots]
        if all(set(t_ship).issubset(set(tupled_shoots)) for t_ship in tupled_ship):
            enemy_dead_zone[json.dumps(ship)] = ship_dead_zone_handler(ship)
    return enemy_dead_zone