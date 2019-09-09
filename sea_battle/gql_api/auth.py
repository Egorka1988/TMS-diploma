import logging

import graphene
import graphql_jwt
from django.contrib.auth.models import User
from graphql import GraphQLError
from graphql_jwt.shortcuts import get_token

from sea_battle import constants


# class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
#     user = graphene.Field(UserType)
#
#     @classmethod
#     def resolve(cls, root, info, **kwargs):
#         return cls(user=info.context.user)
from sea_battle.gql_api.types import CreateUserSuccess, PasswordTooWeak, UserAlreadyExists

logger = logging.getLogger(__name__)


class CreateUserOutput(graphene.Union):
    class Meta:
        types = (CreateUserSuccess, PasswordTooWeak, UserAlreadyExists)


class CreateNewUserMutation(graphene.Mutation):
    class Input:
        username = graphene.String()
        password = graphene.String()

    Output = CreateUserOutput

    def mutate(self, info, *args, username, password, **kwargs):

        if User.objects.filter(username=username):
            return UserAlreadyExists(err_msg=constants.USER_ALREADY_EXISTS)
        if len(password) < 6:
            return PasswordTooWeak(err_msg=constants.SHORT_PASSWORD)

        user = User.objects.create_user(username=username, password=password)
        token = get_token(user, info.context)
        logger.info('new user came: %s'%(user.username))
        return CreateUserSuccess(token=token)


class AuthMutations(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    create_new_user = CreateNewUserMutation.Field()
