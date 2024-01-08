#!/bin/bash

# Description: Start Redis and Postgres containers
# This is useful for development, where you change the code and want to see the changes
# reflected in the running application. This script will start the database and cache servers
# For the application server, use ./scripts/startAll.sh

# Usage: ./scripts/startRedisAndPostgres.sh
POSTGRES_PASSWORD=postgres REDIS_PASSWORD=redis docker-compose up postgres cache --build