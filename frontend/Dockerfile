FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Créer les dossiers nécessaires avec les bonnes permissions
RUN mkdir -p .next && chmod -R 777 /app

EXPOSE 3000
CMD ["npm", "run", "dev"]