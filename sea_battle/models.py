from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models



class Game(models.Model):

    game_name = models.CharField(
        max_length=50,
        verbose_name='Name of the game',
        blank=True,
    )

    size = models.PositiveSmallIntegerField(
        default=10,
    )

    turn = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Turn of',
        null=True,
        related_name='turn'
    )

    winner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Winner', null=True
    )

    date = models.DateField(
        verbose_name='Date of game'
    )

    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Game creator',
        null=True,
        related_name='Game_creator',
    )

    joiner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Game joiner',
        null=True,
        related_name='Game_joiner',
    )


class BattleMap(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Player', null=True
    )
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        verbose_name='Game Id',
        related_name='battle_maps'
        # db_column='id',
        # default=int,
    )

    shoots = ArrayField(
        ArrayField(
            models.PositiveSmallIntegerField(),
            default=list,
            verbose_name='Shoots'

        )
    )

    fleet_new = JSONField(
        verbose_name='Fleet_new',
        default=list
    )

    fleet_old = ArrayField(  # list of ships
        ArrayField(  # ship as is
            ArrayField(
                models.PositiveSmallIntegerField(),
                default=list,
                null=True,

            ),
            default=list
        ),
        default=list,
        verbose_name='Fleet_old'
    )

    rating = models.IntegerField(
        default=0,
        verbose_name='Rating'
    )



