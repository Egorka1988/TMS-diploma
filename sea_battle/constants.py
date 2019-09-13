SHOOT_RESULT_HIT = 'hit'
SHOOT_RESULT_MISS = 'miss'
SHOOT_RESULT_KILL = 'kill'

#  state messages
WAITING_FOR_JOINER = 'waiting_for_joiner'
WIN = 'win'
LOOSE = 'loose'
ACTIVE = 'active'

# exception messages
FAIL_TO_JOIN = "Oop's... Somebody has already joined. Try another game"
FAIL_TO_ADD_FLEET = 'Both battleMaps for that game already exist'
NOT_YOUR_TURN = "Don't cheat! Now it's not your turn to shoot"
INVALID_SHOOT = "Shoot is invalid"
EMPTY_FLEET = "Your empty fleet won't scare anyone. " \
              "Please, set your fleet according to the schema"
INVALID_SIZE = "Size must be between 10 and 15"
GAME_NOT_FOUND = "Game with current id not found"

USER_ALREADY_EXISTS = "User with that username already exists. " \
                      "Please, try another"
SHORT_PASSWORD = "This password is too short. " \
                 "It should contain at least 6 symbols"

FLEET_COMPOSITION = {
    10: {'4': 1, '3': 2, '2': 3, '1': 4},
    11: {'4': 1, '3': 3, '2': 4, '1': 5},
    12: {'4': 1, '3': 4, '2': 4, '1': 6},
    13: {'4': 1, '3': 2, '2': 3, '1': 5, 'air': 1},
    14: {'4': 2, '3': 2, '2': 3, '1': 8, 'air': 1},
    15: {'4': 2, '3': 3, '2': 3, '1': 8, 'air': 2},
}

ACTIVE_GAME_TIME_LIMIT = 60
AVAILABLE_GAME_TIME_LIMIT = 200

