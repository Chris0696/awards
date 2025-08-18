# Utiliser une image Python officielle
FROM python:3.13-bullseye

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Installer les dépendances système pour PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*


# Installer les dépendances Python
COPY requirements.txt /usr/src/app/
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

# Create directories with permissions
RUN mkdir -p /usr/src/app/log /usr/src/app/media/logos /usr/src/app/static /usr/src/app/collectstatic /usr/src/app/frontend /usr/src/app/locale /var/lib/celery && \
    chmod 755 /usr/src/app/log /usr/src/app/media /usr/src/app/media/logos /usr/src/app/static  /usr/src/app/collectstatic /usr/src/app/frontend /usr/src/app/locale /var/lib/celery


# Copier le code source
COPY . .

WORKDIR /usr/src/app

# Exposer le port
EXPOSE 8000

# Commande par défaut
CMD ["gunicorn", "awards.wsgi:application", "--name", "awards", "--workers", "3", "-b", ":8000"]