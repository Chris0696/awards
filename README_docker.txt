How to build and run docker containers:
1. Build docker images: docker compose -f docker-compose.yml build
2. Start docker containers: docker compose -f docker-compose.yml up -d
3. Run web container scripts (not mandatory):
  3.1 Apply migrations: docker compose -f docker-compose.yml exec web ./manage.py migrate
  3.2 Apply Collecstatic: docker compose -f docker-compose.yml exec web ./manage.py collectstatic --noinput
4. Restart everything: docker compose -f docker-compose.yml stop && docker compose -f docker-compose.yml up -d
5. Stopping and deleting orphan containers : docker compose -f docker-compose.yml up -d --remove-orphans
Production: Use prod.yml file => docker compose -f prod.yml [...]
