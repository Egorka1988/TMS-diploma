
def sorted_fleet(ship_indexes):
    # function for sorting ships by their coords

    ship_indexes = [tuple(idx) for idx in ship_indexes]

    fleet = []

    for item in sorted(set(ship_indexes)):
        x, y = item
        surround = {(x - 1, y - 1), (x - 1, y + 1), (x - 1, y), (x, y - 1)}

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


def prepare_to_store(fleet):

    fleet = [list(ship) for ship in fleet]

    return fleet

