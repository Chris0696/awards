#!/bin/bash

# Script pour réinitialiser la base de données Django

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Réinitialisation de la base de données Django ===${NC}"

# 1. Vérifier quel type de base de données est utilisé
read -p "Quelle base de données utilisez-vous? (postgres/mysql): " DB_TYPE

# 2. Réinitialiser la base de données
echo -e "${YELLOW}\n[1/6] Réinitialisation de la base de données...${NC}"

if [ "$DB_TYPE" = "postgres" ]; then
    read -p "Nom du service PostgreSQL dans docker-compose (défaut: postgres): " DB_SERVICE
    DB_SERVICE=${DB_SERVICE:-postgres_db}
    
    read -p "Nom d'utilisateur PostgreSQL (défaut: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -p "Nom de la base de données (défaut: postgres): " DB_NAME
    DB_NAME=${DB_NAME:-postgres}
    
    echo "Suppression et recréation du schéma public..."
    docker compose exec $DB_SERVICE psql -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    
elif [ "$DB_TYPE" = "mysql" ]; then
    read -p "Nom du service MySQL dans docker-compose (défaut: db): " DB_SERVICE
    DB_SERVICE=${DB_SERVICE:-db}
    
    read -p "Nom d'utilisateur MySQL (défaut: root): " DB_USER
    DB_USER=${DB_USER:-root}
    
    read -p "Mot de passe MySQL: " DB_PASS
    
    read -p "Nom de la base de données: " DB_NAME
    
    echo "Suppression et recréation de la base de données..."
    docker compose exec $DB_SERVICE mysql -u $DB_USER -p$DB_PASS -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"
    
else
    echo -e "${RED}Type de base de données non supporté. Sortie du script.${NC}"
    exit 1
fi

# 3. Supprimer les fichiers de migration existants
echo -e "${YELLOW}\n[2/6] Suppression des fichiers de migration existants...${NC}"
docker compose exec backend sh -c "find . -path '*/migrations/*.py' -not -name '__init__.py' -delete"
docker compose exec backend sh -c "find . -path '*/migrations/*.pyc' -delete"

# 4. Création de nouvelles migrations
echo -e "${YELLOW}\n[3/6] Création de nouvelles migrations...${NC}"
docker compose exec backend python manage.py makemigrations

# 5. Application des migrations
echo -e "${YELLOW}\n[4/6] Application des migrations...${NC}"
docker compose exec backend python manage.py migrate

# 7. Création d'un superutilisateur
echo -e "${YELLOW}\n[6/6] Création d'un superutilisateur...${NC}"
read -p "Voulez-vous créer un superutilisateur? (o/n): " CREATE_USER

if [ "$CREATE_USER" = "o" ] || [ "$CREATE_USER" = "O" ]; then
    docker compose exec backend python manage.py createsuperuser
fi

echo -e "${GREEN}\nRéinitialisation terminée avec succès!${NC}"
echo -e "La base de données a été réinitialisée, les migrations ont été recréées, et les migrations ont été appliquées."

exit 0