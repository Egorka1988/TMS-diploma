import graphene

from sea_battle.gql_api.active_game import ActiveGameMutations, ActiveGameQueries
from sea_battle.gql_api.auth import AuthMutations
from sea_battle.gql_api.dashboard import DashboardQueries
from sea_battle.gql_api.join_game import JoinGameMutations, JoinGameQueries
from sea_battle.gql_api.new_game import NewGameMutations, NewGameQueries


class Query(
    ActiveGameQueries,
    NewGameQueries,
    JoinGameQueries,
    DashboardQueries,
):
    """Accumulates all queries available on the platform"""


class Mutation(
    ActiveGameMutations,
    JoinGameMutations,
    NewGameMutations,
    AuthMutations
):
    """Accumulates all mutations available on the platform"""


schema = graphene.Schema(query=Query, mutation=Mutation)
