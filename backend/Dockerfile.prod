# Utiliser une image Python officielle
FROM python:3.13-bullseye

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Installer les dépendances Python
COPY requirements.txt /usr/src/app/
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

# Créer un utilisateur non-root
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Créer les répertoires avec les permissions
RUN mkdir -p /usr/src/app/log /usr/src/app/media/logos /usr/src/app/collectstatic /usr/src/app/frontend /usr/src/app/locale /var/lib/celery && \
    chmod 755 /usr/src/app/log /usr/src/app/media /usr/src/app/media/logos /usr/src/app/collectstatic /usr/src/app/frontend /usr/src/app/locale /var/lib/celery && \
    chown -R appuser:appuser /usr/src/app

# Copier le code source
COPY . .
RUN chown -R appuser:appuser /usr/src/app

# Changer vers l'utilisateur non-root
USER appuser

# Exposer le port (par défaut 8000 pour Django)
EXPOSE 8000

# Commande pour lancer le serveur Django avec Gunicorn
CMD ["gunicorn", "awards.wsgi:application", "--name", "awards", "--workers", "3", "-b", ":8000"]