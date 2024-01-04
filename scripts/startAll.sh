#!/bin/bash

# Description: Start all containers
# Usage: ./scripts/startAll.sh

POSTGRES_PASSWORD=postgres REDIS_PASSWORD=redis docker-compose up