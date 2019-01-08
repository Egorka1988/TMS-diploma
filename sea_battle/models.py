
from django.contrib.postgres.fields import JSONField
from django.db import models



class GameData(models.Model): # creating usertable for using it`s data in game

    user_name = models.CharField(max_length=30, default='player1')
    email_address = models.EmailField(blank=True, default='')
    score = models.PositiveSmallIntegerField(default=0)
    opponent_user_name = models.CharField(max_length=30, default='player2')


class BattleMap(models.Model):

    map1_of_btlfld = JSONField(default=dict, null=True)
    map2_of_btlfld = JSONField(default=dict, null=True)
    # userfld = models.OneToOneField(
    #     GameData,
    #     related_name='owner_of_map1',
    #     on_delete=models.CASCADE,
    #     default=None
    # )

# class GamePlay(models.Model):
#
#     battlemap = models.ForeignKey(
#         BattleMap,
#         on_delete=models.CASCADE,
#         related_name='gameplay'
#     )

