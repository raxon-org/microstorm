#!/bin/sh
mv docker-compose.prod.yml docker-compose.yml
docker-compose up -d --build
mv docker-compose.yml docker-compose.prod.yml
docker exec -it docker-13.2-core /bin/bash
