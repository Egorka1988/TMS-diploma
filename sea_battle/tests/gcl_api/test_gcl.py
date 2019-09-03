import json

from django.contrib.auth import get_user_model
from graphene_django.utils import GraphQLTestCase
from graphql_jwt.testcases import JSONWebTokenTestCase

from sea_battle.gql_api import schema


class UsersTests(JSONWebTokenTestCase):

    def setUp(self):
        self.user = get_user_model().objects.create(username='test')
        self.client.authenticate(self.user)

    def test_get_user(self):
        query = '''
            query GetUser($username: String!) {
            user(username: $username) {
            id
            }
            }'''
        variables = {
            'username': self.user.username,
        }
        self.client.execute(query, variables)


class MyFancyTestCase(GraphQLTestCase):
    # Here you need to inject your test case's schema
    GRAPHQL_SCHEMA = schema

    # def test_some_query(self):
    #     response = self.query(
    #         '''
    #         query {
    #             myModel {
    #                 id
    #                 name
    #             }
    #         }
    #         ''',
    #         op_name='myModel'
    #     )
    #
    #     content = json.loads(response.content)
    #
    #     # This validates the status code and if you get errors
    #     self.assertResponseNoErrors(response)
    #
    #     # Add some more asserts if you like
    #     ...

    def test_some_mutation(self):

        

        response = self.query(
            '''
                mutation TokenAuth($username: String!, $password: String!) {
                    tokenAuth(username: $username, password: $password) {
                        token
                    }
                }
            ''',
            # op_name='TokenAuth',
            input_data={'username': 'qwerty', 'password': 'qwerty'}
        )

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
