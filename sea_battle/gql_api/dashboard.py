import graphene
from django.contrib.auth.models import User
from graphql_jwt.decorators import login_required

from sea_battle.gql_api.types import GameType
from sea_battle.models import Game


class DashboardQueries(graphene.ObjectType):
    my_games = graphene.List(GameType)
    av_games = graphene.List(GameType)

    @login_required
    def resolve_my_games(self, info, **kwargs):
        return Game.objects.my_games(info.context.user)

    @login_required
    def resolve_av_games(self, info, **kwargs):
        return Game.objects.available_games(User.objects.get(username=info.context.user))
