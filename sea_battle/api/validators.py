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
        raise exceptions.ValidationError("Your fleet is incorrect")

    def validate_size(self, *args, **kwargs):
        data = self.get_initial()
        if 15 < data['size'] < 10:
            raise exceptions.ValidationError("Size must be between 10 and 15")
        size = data['size']
        return size


class JoinFleetValidator(serializers.Serializer):

    fleet = serializers.ListField()

    def validate_fleet(self, fleet):
        if fleet:
            return extract_ships_from(fleet)
        raise exceptions.ValidationError("Your fleet is incorrect")


class ShootValidator(serializers.Serializer):

    shoot = serializers.ListField()

    def validate_shoot(self, shoot):

        data = self.get_initial()
        if not len(shoot) == 2 or \
            not all(type(item) is int and item < data['size'] for item in shoot):
                raise exceptions.ValidationError("Shoot is invalid")



