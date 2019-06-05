#!/bin/sh
import pytest

from diploma import settings


@pytest.fixture(scope='session')
def django_db_setup():
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'localhost',
        'NAME': 'sea_battle_db',
    }
# DB_NAME="sea_battle_db"
# DB_USER="postgres"
# DB_PASSWORD="root"
# DB_HOST="localhost"


# ytest /home/egor/PycharmProjects/TMS-diploma/sea_battle/api/tests/test_api_views.py::TestRegisterFormAPIViewSet
#
# export DB_NAME=sea_battle_db
# export DB_USER=egorka
# export DB_PASSWORD=root
# export DB_HOST=localhost