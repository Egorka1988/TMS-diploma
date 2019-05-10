from datetime import datetime

import factory

from django.contrib.auth.models import User
from django.utils import timezone

from sea_battle.models import BattleMap, Game


class UserFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = User

    username = factory.Sequence(lambda n: 'john%s' % n)

class GameFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Game

    creator = factory.SubFactory(UserFactory)
    turn = factory.SelfAttribute('creator')
    creating_date = datetime.now()
    last_activity = timezone.now()

    @factory.post_generation
    def creator_battle_map(obj, create, extracted, **kwargs):
        if create and not extracted:
            BattleMapFactory(game=obj, user=obj.creator, **kwargs)


class ActiveGameFactory(GameFactory):
    joiner = factory.SubFactory(UserFactory)
    last_activity = timezone.now()

    @factory.post_generation
    def joiner_battle_map(obj, create, extracted, **kwargs):
        if create and not extracted:
            BattleMapFactory(game=obj, user=obj.joiner, **kwargs)


class BattleMapFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = BattleMap

    game = factory.SubFactory(GameFactory)
    user = factory.SubFactory(UserFactory)
    shoots = []


