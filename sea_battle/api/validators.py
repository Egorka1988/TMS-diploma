from rest_framework import serializers, exceptions

from sea_battle import constants
from sea_battle.utils import extract_ships_from


class NewGameValidator(serializers.Serializer):

    name = serializers.CharField(allow_blank=True)
    size = serializers.IntegerField()
    fleet = serializers.ListField()

    def validate_fleet(self, fleet):
        if fleet:
            return extract_ships_from(fleet)
        raise exceptions.ValidationError(constants.INVALID_FLEET)

    def validate_size(self, *args, **kwargs):
        data = self.get_initial()
        if 15 < data['size'] < 10:
            raise exceptions.ValidationError(constants.INVALID_SIZE)
        size = data['size']
        return size


class JoinFleetValidator(serializers.Serializer):

    fleet = serializers.ListField()

    def validate_fleet(self, fleet):
        if fleet:
            return extract_ships_from(fleet)
        raise exceptions.ValidationError(constants.INVALID_FLEET)


class ShootValidator(serializers.Serializer):

    shoot = serializers.ListField()
    size = serializers.IntegerField()

    def validate_shoot(self, shoot, *args, **kwargs):

        data = self.get_initial()
        if not len(shoot) == 2 or \
                not all(type(item) is int and item < data['size'] for item in shoot):
            raise exceptions.ValidationError(constants.INVALID_SHOOT)
        return shoot
