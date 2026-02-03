How to build and run docker containers:

Backend exposé sur le port 8001 (au lieu de 8000) pour éviter les conflits avec un autre projet.
API backend accessible en local sur http://localhost:8001

1. Build docker images: docker compose -f docker-compose.yml build
2. Start docker containers: docker compose -f docker-compose.yml up -d
3. Run web container scripts (not mandatory):
  3.1 Apply migrations: docker compose -f docker-compose.yml exec backend ./manage.py migrate or 
  docker exec -it projet_awards-backend-1 bash ans python manage.py migrate
  3.2 Apply Collecstatic: docker compose -f docker-compose.yml exec backend ./manage.py collectstatic --noinput
4. Restart everything: docker compose -f docker-compose.yml stop && docker compose -f docker-compose.yml up -d
5. Stopping and deleting orphan containers : docker compose -f docker-compose.yml up -d --remove-orphans
6. backends logs : docker logs -f projet_awards-backend-1
Production: Use prod.yml file => docker compose -f prod.yml [...]
