#!/bin/bash

echo setting credentials for db and mypy...

export DB_NAME=sea_battle_db
export DB_USER=egor
export DB_PASSWORD=root
export DB_HOST=localhost
export PYTHONPATH=${PYTHONPATH}:${PWD}
echo ...
echo done

pytest -v  --no-migrations ./sea_battle/