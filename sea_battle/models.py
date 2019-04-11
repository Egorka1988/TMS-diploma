from django.contrib.auth.models import User
from django.contrib.postgres.fields import HStoreField
from django_postgres_extensions.models.fields import ArrayField
from django.db import models


class BattleMap(models.Model):

    map_of_bf = HStoreField(default=dict
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='player', null=True
    )
    shoots = ArrayField(
        models.CharField(max_length=10),
        default=list
    )

    # fleet = ArrayField(
    #     ArrayField(
    #         models.CharField(max_length=10),
    #         default=list
    #     )
    # )
