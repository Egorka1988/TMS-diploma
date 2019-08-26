import json

import graphene
import graphql_jwt
from django.contrib.auth.models import User
from graphene_django import DjangoObjectType

from sea_battle import constants
from sea_battle.models import Game


class GameType(DjangoObjectType):

    class Meta:
        model = Game
class UserType(DjangoObjectType):

    class Meta:
        model = User


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        print("123*****", info.context.user)
        print(cls)
        return cls(user=info.context.user)


class Query(graphene.ObjectType):
    my_games = graphene.List(GameType)
    av_games = graphene.List(GameType)
    fleet_composition = graphene.JSONString()

    def resolve_my_games(self, info, **kwargs):
        print("*********", info.context.headers)
        return Game.objects.my_games(info.context.user)

    def resolve_av_games(self, info, **kwargs):
        return Game.objects.available_games(User.objects.get(username="qwerty"))

    def resolve_fleet_composition(self, info, **kwargs):
        return constants.FLEET_COMPOSITION


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)
