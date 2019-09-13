
from sea_battle.utils import \
    extract_ships_from, \
    check_fleet_composition, \
    air_carr_validator, \
    ship_dead_zone_handler,\
    check_dead_zone
import pytest


class TestUtilsSortedFleet:

    def test_empty(self):

        data = []
        assert extract_ships_from(data) == []

    @pytest.mark.xfail(raises=TypeError)
    def test_type(self):
        data = [int(), None]
        for i in data:
            extract_ships_from(i)

    def test_general(self):

        fleet = [[0, 5], [0, 5], [0, 5], [1, 0], [1, 1], [1, 2], [1, 3],
                 [2, 7], [2, 8], [2, 9], [3, 0], [3, 4], [4, 0], [5, 0],
                 [5, 3], [5, 7], [6, 7], [7, 4], [8, 1], [8, 4], [8, 4],
                 [8, 9], [9, 1]]

        res = [{(0, 5)},
               {(1, 0), (1, 1), (1, 2), (1, 3)},
               {(2, 7), (2, 8), (2, 9)},
               {(3, 0), (4, 0), (5, 0)},
               {(3, 4)},
               {(5, 3)},
               {(5, 7), (6, 7)},
               {(7, 4), (8, 4)},
               {(8, 1), (9, 1)},
               {(8, 9)}]
        assert extract_ships_from(fleet) == res

    def test_aircraft_carrier_horizontal(self):

        fleet = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [1, 4],
                 [1, 5], [3, 2], [3, 3], [3, 4], [4, 1], [4, 2], [4, 3], [4, 4],
                 [4, 5], [4, 6], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
                 [7, 2], [7, 3], [7, 4], [8, 6], [8, 7], [8, 8], [9, 4], [9, 5],
                 [9, 6], [9, 7], [9, 8], [9, 9]]

        res = [{(0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (1, 3), (1, 4), (1, 5)},
               {(3, 2), (3, 3), (3, 4), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6)},
               {(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (7, 2), (7, 3), (7, 4)},
               {(8, 6), (8, 7), (8, 8), (9, 4), (9, 5), (9, 6), (9, 7), (9, 8), (9, 9)}]
        assert extract_ships_from(fleet) == res

    def test_aircraft_carrier_vertical(self):

        fleet = [[3, 0], [3, 4], [3, 9], [4, 0], [4, 1], [4, 4], [4, 9], [5, 0],
                 [5, 1], [5, 4], [5, 5], [5, 8], [5, 9], [6, 0], [6, 1], [6, 4],
                 [6, 8], [6, 9], [7, 0], [7, 4], [7, 5], [7, 8], [7, 9], [8, 0],
                 [8, 4], [8, 9], [6, 5]]

        res = [{(3, 0), (4, 0), (4, 1), (5, 0), (5, 1), (6, 0), (6, 1), (7, 0), (8, 0)},
               {(3, 4), (4, 4), (5, 4), (5, 5), (6, 4), (6, 5), (7, 4), (7, 5), (8, 4)},
               {(3, 9), (4, 9), (5, 8), (5, 9), (6, 8), (6, 9), (7, 8), (7, 9), (8, 9)}]
        assert extract_ships_from(fleet) == res


class TestUtilsCheckFleetComposition:

    def test_pass(self):
        size = 10
        fleet = [
                {(10, 6)},
                {(3, 4)},
                {(5, 3)},
                {(8, 9)},
                {(5, 7), (6, 7)},
                {(7, 4), (8, 4)},
                {(8, 1), (9, 1)},
                {(2, 7), (2, 8), (2, 9)},
                {(3, 1), (4, 1), (5, 1)},
                {(1, 1), (1, 4), (1, 2), (1, 3)},
        ]
        assert check_fleet_composition(fleet, size) == {}

    def test_fail_ship_type(self):
        size = 10
        fleet = [
                {(10, 6), (10, 7), (10, 8), (10, 9), (10, 10)},
                {(3, 4)},
                {(5, 3)},
                {(8, 9)},
                {(5, 7), (6, 7)},
                {(7, 4), (8, 4)},
                {(8, 1), (9, 1)},
                {(2, 7), (2, 8), (2, 9)},
                {(3, 1), (4, 1), (5, 1)},
                {(1, 1), (1, 4), (1, 2), (1, 3)},
        ]
        real_case = check_fleet_composition(fleet, size)
        real_keys = real_case.keys()
        assert real_keys.__contains__("not_allowed_ships")
        assert sorted(real_case['not_allowed_ships'][0]) == sorted([(10, 6), (10, 7), (10, 8), (10, 9), (10, 10)])

    def test_fail_ship_count(self):
        size = 10
        fleet = [
                {(10, 6)},
                {(10, 10)},
                {(3, 4)},
                {(5, 3)},
                {(8, 9)},
                {(5, 7), (6, 7)},
                {(8, 1), (9, 1)},
                {(2, 7), (2, 8), (2, 9)},
                {(3, 1), (4, 1), (5, 1)},
                {(1, 1), (1, 4), (1, 2), (1, 3)},
        ]
        assert check_fleet_composition(fleet, size) == {
            'not_allowed_ship_count': [{'1': 5}, {'2': 2}]
            }

    def test_fail_provided_ship(self):
        size = 10
        fleet = [
            {(10, 6)},
            {(10, 10)},
            {(3, 4)},
            {(5, 3)},
            {(8, 9)},
            {(2, 7), (2, 8), (2, 9)},
            {(3, 1), (4, 1), (5, 1)},
            {(1, 1), (1, 4), (1, 2), (1, 3)},
        ]
        assert check_fleet_composition(fleet, size) == {
            'not_allowed_ship_count': [{'1': 5}, {'2': 0}]
        }

    def test_fail_linear_ship(self):
        size = 10
        fleet = [
            {(10, 6)},
            {(3, 4)},
            {(5, 3)},
            {(8, 9)},
            {(5, 7), (6, 7)},
            {(7, 4), (8, 4)},
            {(8, 1), (9, 1)},
            {(2, 7), (2, 8), (1, 8)},
            {(3, 1), (4, 1), (5, 1)},
            {(1, 1), (1, 4), (1, 2), (1, 3)},
        ]
        assert check_fleet_composition(fleet, size) == {
            'invalid_ship_composition': [
                [(2, 7), (2, 8), (1, 8)]
                ]
            }


class TestUtilsAirCarrValidator:

    def test_pass(self):

        fleet = [
            {(3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (4, 2), (5, 2)},
            {(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (2, 2), (2, 3)},
            {(3, 6), (4, 6), (5, 6), (6, 6), (7, 6), (8, 6), (6, 5), (7, 5)},
            {(10, 5), (10, 6), (10, 7), (10, 8), (10, 9), (10, 10), (9, 8), (9, 9)}
        ]

        for ship in fleet:
            assert air_carr_validator(ship) == {}

    def test_failed(self):

        ship = {
            (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (4, 2), (3, 2)}

        assert air_carr_validator(ship) == {

            (3, 2), (7, 1), (8, 1), (6, 1), (3, 1), (4, 2), (5, 1), (4, 1)
        }


class TestShipDeadZoneHandler:

    ship = {
        (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (4, 2), (5, 2)
    }
    assert sorted(ship_dead_zone_handler(ship)) == sorted([
        (3, 2), (9, 1), (3, 3), (8, 2), (9, 2), (2, 1), (6, 3), (6, 2), (2, 2), (5, 3), (4, 3), (7, 2)
    ])


class TestCheckDeadZone:

    def test_failed(self):

        fleet = [
            {(9, 9)},
            {(8, 8)}
        ]
        assert check_dead_zone(fleet) == [(8, 8), (9, 9)]

    def test_passed(self):
        fleet = [
                {(7, 4), (8, 4)},
                {(8, 1), (9, 1)},
        ]
        assert check_dead_zone(fleet) == []
