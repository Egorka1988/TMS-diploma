import graphene
from django.contrib.auth.models import User
from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required
from graphene_django import DjangoObjectType

from sea_battle.gql_api.types import GameType
from sea_battle.models import Game


class GameNode(DjangoObjectType):

    game_id = graphene.Field(graphene.Int)

    def resolve_game_id(self, info):
        return self.pk

    class Meta:
        model = Game
        filter_fields = ["name", "id", "creator", "joiner", "size"]
        interfaces = (graphene.relay.Node, )


class DashboardQueries(graphene.ObjectType):

    available_games_count = graphene.Field(graphene.Int)
    all_my_games_count = graphene.Field(graphene.Int)
    available_games = DjangoFilterConnectionField(GameNode)
    all_my_games = DjangoFilterConnectionField(GameNode)

    @login_required
    def resolve_available_games(self, info, **kwargs):
        return Game.objects.available_games(User.objects.get(username=info.context.user))

    @login_required
    def resolve_all_my_games(self, info, **kwargs):
        return Game.objects.my_games(info.context.user)

    @login_required
    def resolve_all_my_games_count(self, info, **kwargs):
        return Game.objects.my_games(info.context.user).count()

    @login_required
    def resolve_available_games_count(self, info, **kwargs):
        return Game.objects.available_games(User.objects.get(username=info.context.user)).count()
