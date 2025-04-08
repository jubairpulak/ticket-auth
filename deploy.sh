#!/bin/bash

docker-compose -f docker-compose.test.yml --env-file .env.test down
docker-compose -p spay_dev -f docker-compose.test.yml --env-file .env.test up