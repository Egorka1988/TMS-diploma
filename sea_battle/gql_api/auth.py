import logging
from datetime import datetime

import graphene
import redis
from django.contrib.auth import logout
from django.contrib.auth.models import User, AnonymousUser
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken, Token, AccessToken
from rest_framework_simplejwt.views import TokenViewBase

from sea_battle import constants
from sea_battle.gql_api.types import CreateUserSuccess, PasswordTooWeak, UserAlreadyExists

logger = logging.getLogger(__name__)


class CreateUserOutput(graphene.Union):
    class Meta:
        types = (CreateUserSuccess, PasswordTooWeak, UserAlreadyExists)


class CreateNewUserMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        password = graphene.String()

    Output = CreateUserOutput

    def mutate(self, info, *args, username, password, **kwargs):

        if User.objects.filter(username=username):
            return UserAlreadyExists(err_msg=constants.USER_ALREADY_EXISTS)
        if len(password) < 6:
            return PasswordTooWeak(err_msg=constants.SHORT_PASSWORD)

        user = User.objects.create_user(username=username, password=password)
        r_token = RefreshToken.for_user(user)
        refresh = str(r_token)
        access = str(r_token.access_token)
        logger.info('new user came: %s'%(user.username))
        return CreateUserSuccess(access=access, refresh=refresh)


class TokenObtainPairView(TokenViewBase):

    def post(self, *args, **kwargs):
        serializer = TokenObtainPairSerializer(data=kwargs)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return serializer.validated_data


class ObtainJWTToken(graphene.Mutation):

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    username = graphene.Field(graphene.String)
    access = graphene.Field(graphene.String)
    refresh = graphene.Field(graphene.String)

    def mutate(self, info, *args, **kwargs):
        resp = TokenObtainPairView.post(self=TokenObtainPairView, **kwargs)

        return ObtainJWTToken(
            username=kwargs['username'],
            access=resp['access'],
            refresh=resp['refresh'])


class Logout(graphene.Mutation):
    class Arguments:
        refresh_token = graphene.String()

    logout_success = graphene.String()

    def mutate(self, info, refresh_token, *args, **kwargs):

        result = "ok"
        r = redis.Redis()
        access = info.context.headers.get('Authorization')
        refresh = refresh_token
        if access:
            try:
                AccessToken(access)
                r.set(access, "access")
            except Exception as e:
                result = "fail. Access token is not valid"
                print(e)
        if refresh:
            try:
                RefreshToken(refresh)
                r.set(refresh, "refresh")
            except Exception as e:
                result = "fail. Refresh token is not valid"
                print(e)

        return Logout(logout_success=result)


class AuthMutations(graphene.ObjectType):
    token_auth = ObtainJWTToken.Field()
    revoke_token = Logout.Field()
    # refresh_token = graphene.Field()
    create_new_user = CreateNewUserMutation.Field()
