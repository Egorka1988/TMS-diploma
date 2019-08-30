
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models
from datetime import timedelta

from django.db.models.query_utils import Q
from django.utils import timezone

from sea_battle.constants import \
    ACTIVE_GAME_TIME_LIMIT, \
    AVAILABLE_GAME_TIME_LIMIT


class GamesManager(models.Manager):

    def clean_expired_games(self):
        pass


class GamesQuerySet(models.QuerySet):

    def my_games(self, user):
        # games of request.user
        return self.filter(Q(creator=user) | Q(joiner=user), Q(winner=None))

    def active_games(self):
        now = timezone.now()
        delta = timedelta(seconds=ACTIVE_GAME_TIME_LIMIT)
        return self.filter(
            Q(last_activity__gt=(now - delta)),
            Q(winner=None),
            ~Q(joiner=None)
        )

    def available_games(self, user):
        # now = timezone.now()
        # delta = timedelta(seconds=AVAILABLE_GAME_TIME_LIMIT)
        return self.filter(
            # last_activity__gt=(now - delta),
            joiner=None,
        ).exclude(creator=user)


class Game(models.Model):

    name = models.CharField(
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
        verbose_name='Winner',
        null=True,
    )

    creating_date = models.DateField(
        verbose_name='Date of game'
    )

    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Game creator',
        null=True,
        related_name='game_creator',
    )

    joiner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Game joiner',
        null=True,
        related_name='game_joiner',
    )

    last_activity = models.DateTimeField(
        null=True
    )

    objects = GamesManager.from_queryset(GamesQuerySet)()


class BattleMap(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Player',
        null=True
    )
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        verbose_name='Game Id',
        related_name='battle_maps',
    )

    shoots = ArrayField(
        ArrayField(
            models.PositiveSmallIntegerField(),
            default=list,
            verbose_name='Shoots'
        )
    )

    fleet = JSONField(
        verbose_name='Fleet_new',
        default=list
    )

    rating = models.IntegerField(
        default=0,
        verbose_name='Rating'
    )

    template = models.BooleanField(
        default=False,
        verbose_name='Is template?'
    )
