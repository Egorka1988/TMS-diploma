from django.contrib.auth.models import User
from django.contrib.postgres.fields import HStoreField
from django.db import models


class BattleMap(models.Model):

    map_of_bf = HStoreField(default=dict)
    user = models.OneToOneField(
        User,
        unique=True,
        on_delete=models.CASCADE,
        verbose_name='player', null=True)
