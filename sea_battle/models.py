from django.db import models
from jsonfield import JSONField


class GameData(models.Model): # creating usertable for using it`s data in game

    user_name = models.CharField(max_length=30, default='player1')
    email_address = models.EmailField(blank=True, default='')
    score = models.PositiveSmallIntegerField(default=0)
    opponent_user_name = models.CharField(max_length=30, default='player2')


class BattleMap(models.Model):

    field_size = models.PositiveSmallIntegerField(default=10)
    map_of_btlfld = JSONField()
    userfld = models.OneToOneField(
        GameData,
        related_name='user_btlfld',
        on_delete=models.CASCADE,
        default=None
    )

class GamePlay(models.Model):

    battleship = JSONField()
    battlemap = models.ForeignKey(
        BattleMap,
        on_delete=models.CASCADE,
        related_name='gameplay'
    )

