import graphene
import graphql_jwt

# class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
#     user = graphene.Field(UserType)
#
#     @classmethod
#     def resolve(cls, root, info, **kwargs):
#         return cls(user=info.context.user)


class AuthMutations(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
