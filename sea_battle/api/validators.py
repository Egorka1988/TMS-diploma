from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from rest_framework import serializers, exceptions

from sea_battle import constants
from sea_battle.utils import extract_ships_from, check_fleet_composition, ship_dead_zone_handler


class NewGameValidator(serializers.Serializer):

    name = serializers.CharField(allow_blank=True)
    size = serializers.IntegerField()
    fleet = serializers.ListField()

    def validate_fleet(self, fleet, *args, **kwargs):
        if fleet:
            return extract_ships_from(fleet)
        raise exceptions.ValidationError(constants.EMPTY_FLEET)

    def validate_size(self, *args, **kwargs):
        data = self.get_initial()
        if 15 < int(data['size']) < 10:
            raise exceptions.ValidationError(constants.INVALID_SIZE)
        size = data['size']
        return size

    def check_fleet_composition(self):
        data = self.validated_data
        fleet = data['fleet']
        size = data['size']

        return check_fleet_composition(fleet, size)


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


class SignUpValidator(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField()

    def validate_username(self, username, *args, **kwargs):

        if User.objects.filter(username=username):
            raise exceptions.ValidationError(constants.USER_ALREADY_EXISTS)

        return username
    def validate_password(self, password, *args, **kwargs):

        if len(password) < 6:
            raise exceptions.ValidationError(constants.SHORT_PASSWORD)

        return password
