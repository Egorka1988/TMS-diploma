from urllib.request import Request

from django.contrib.auth.models import User
from graphene.test import Client
from rest_framework_simplejwt.tokens import RefreshToken

from sea_battle import constants
from sea_battle.gql_api import schema
from sea_battle.tests.factories import UserFactory
import pytest

@pytest.mark.django_db
class TestAuth:

    client = Client(schema.schema)
    user_password = "testtest"

    def test_login(self):
        password = "testtest"
        user = UserFactory()
        user.set_password(password)

        user.save()


        mutation = '''
                mutation TokenAuth($username: String!, $password: String!) {
                  tokenAuth(username: $username, password: $password) {
                    username
                    access
                    refresh
                  }
                }
            '''
        executed = self.client.execute(
            mutation,
            variables={'username': user.username, 'password': password}
        )
        assert not executed.get("errors")
        tokens = executed.get('data').get("tokenAuth")
        assert tokens
        assert tokens.get("access")
        assert tokens.get("refresh")
        assert tokens.get("username")
        for k,v in tokens.items():
            assert v
        assert user.is_authenticated

    def test_sign_up(self):

        mutation = '''
          mutation CREATE_NEW_USER($username: String, $password: String) {
            createNewUser(username: $username, password: $password) {
              __typename
              ... on PasswordTooWeak {
                errMsg
              }
              ... on UserAlreadyExists {
                errMsg
              }
              ... on CreateUserSuccess {
                access
                refresh
              }
            }
          }
        '''
        sign_up_success = self.client.execute(
            mutation,
            variables={'username': "test", 'password': "testtest"}
        )
        assert User.objects.get(username="test")
        assert sign_up_success['data']['createNewUser']['access']
        assert sign_up_success['data']['createNewUser']['refresh']

        sign_up_fail_1 = self.client.execute(
            mutation,
            variables={'username': "test", 'password': "testtest"}
        )
        assert sign_up_fail_1['data']['createNewUser']['errMsg'] == constants.USER_ALREADY_EXISTS

        sign_up_fail_2 = self.client.execute(
            mutation,
            variables={'username': "another_test", 'password': "1"}
        )
        assert sign_up_fail_2['data']['createNewUser']['errMsg'] == constants.SHORT_PASSWORD

    def test_logout(self):
        user = UserFactory()
        r_token = RefreshToken.for_user(user)
        refresh = str(r_token)
        access = str(r_token.access_token)
        token = access
        context = Request("http://monkey_url/")
        context.user = user
        context.add_header(key="Authorization", val=token)
        mutation = '''
          mutation Logout($refreshToken: String!) {
            revokeToken(refreshToken: $refreshToken) {
              logoutSuccess
            }
          }
        '''
        logout_success = self.client.execute(
            mutation,
            variables={'refreshToken': refresh},
            context=context
        )
        assert logout_success['data']['revokeToken']['logoutSuccess'] == "ok"
        assert not logout_success.keys().__contains__('errors')








# @pytest.mark.django_db
# class MyFancyTestCase(GraphQLTestCase):
#     # Here you need to inject your test case's schema
#     GRAPHQL_SCHEMA = schema.schema
#
#     def test_obtain_jwt(self):
#
#         user = UserFactory(
#             password="testtest"
#         )
#         # import pdb; pdb.set_trace()
#         response = self.query(
#             '''
#                 mutation TokenAuth($username: String!, $password: String!) {
#                   tokenAuth(username: $username, password: $password) {
#                     username
#                     access
#                     refresh
#                   }
#                 }
#             ''',
#             op_name='TokenAuth',
#             # input_data={'username': user.username, 'password': user.password}
#             input_data={'username': "qwerty", 'password': "qwerty"}
#         )
#
#         # import pdb; pdb.set_trace()
#         # This validates the status code and if you get errors
#         self.assertResponseNoErrors(response)
