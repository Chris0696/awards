#!/bin/bash

set -e

DOMAIN="projectawards.scarsoft.net"
EMAIL="contact@scarsoft.net"

echo "🚀 Démarrage du déploiement..."

# 1. Arrêter les conteneurs existants
echo "📦 Arrêt des conteneurs existants..."
docker compose -f docker-compose.prod.yml down || true

# 2. Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p nginx/ssl nginx/www

# 3. Créer une configuration nginx temporaire (sans SSL)
echo "🔧 Création de la configuration nginx temporaire..."
cat > nginx/nginx.temp.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name projectawards.scarsoft.net;
        
        # Pour Let's Encrypt
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
            try_files $uri $uri/ =404;
        }
        
        # Réponse temporaire pour les autres requêtes
        location / {
            return 200 'Server is setting up SSL...';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# 4. Sauvegarder la configuration nginx finale
cp nginx/nginx.conf nginx/nginx.final.conf

# 5. Démarrer nginx temporaire pour l'obtention du certificat
echo "🌐 Démarrage de nginx temporaire..."
docker run -d --name temp-nginx \
    -p 80:80 \
    -v $(pwd)/nginx/nginx.temp.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/nginx/www:/var/www/certbot \
    nginx:alpine

# Attendre que nginx soit prêt
sleep 5

# 6. Vérifier si le certificat existe déjà
if [ ! -f "nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    echo "🔒 Obtention du certificat SSL..."
    
    # Obtenir le certificat SSL
    docker run --rm \
        -v $(pwd)/nginx/ssl:/etc/letsencrypt \
        -v $(pwd)/nginx/www:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        -d $DOMAIN
    
    if [ $? -eq 0 ]; then
        echo "✅ Certificat SSL obtenu avec succès!"
    else
        echo "❌ Échec de l'obtention du certificat SSL"
        docker stop temp-nginx && docker rm temp-nginx
        exit 1
    fi
else
    echo "✅ Certificat SSL déjà présent"
fi

# 7. Arrêter nginx temporaire
echo "🛑 Arrêt du nginx temporaire..."
docker stop temp-nginx && docker rm temp-nginx

# 8. Restaurer la configuration nginx finale
cp nginx/nginx.final.conf nginx/nginx.conf

# 9. Construire et démarrer tous les services
echo "🏗️  Construction des images..."
docker compose -f docker-compose.prod.yml build

echo "🚀 Démarrage de tous les services..."
docker compose -f docker-compose.prod.yml up -d

# 10. Vérifier le statut
echo "📊 Vérification du statut..."
sleep 15
docker compose -f docker-compose.prod.yml ps

# 11. Tester la connectivité
echo "🔍 Test de connectivité..."
if curl -f -s -I https://$DOMAIN > /dev/null 2>&1; then
    echo "✅ Site accessible via HTTPS!"
else
    echo "⚠️  Vérifiez les logs avec : docker compose -f docker-compose.prod.yml logs"
fi

echo "✅ Déploiement terminé!"
echo "🌐 Votre application est accessible sur : https://$DOMAIN"

# 12. Créer le script de renouvellement
echo "⏰ Création du script de renouvellement..."
cat > renew-ssl.sh << 'EOF'
#!/bin/bash
cd $(dirname $0)

echo "🔄 Tentative de renouvellement du certificat SSL..."

docker run --rm \
    -v $(pwd)/nginx/ssl:/etc/letsencrypt \
    -v $(pwd)/nginx/www:/var/www/certbot \
    certbot/certbot renew \
    --webroot \
    --webroot-path=/var/www/certbot \
    --quiet

if [ $? -eq 0 ]; then
    echo "✅ Certificat vérifié/renouvelé avec succès"
    echo "🔄 Rechargement de nginx..."
    docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
    echo "✅ Nginx rechargé"
else
    echo "❌ Erreur lors du renouvellement"
fi
EOF

chmod +x renew-ssl.sh

echo "📝 Script de renouvellement créé : renew-ssl.sh"
echo "📅 Pour configurer le renouvellement automatique, ajoutez à votre crontab :"
echo "0 12 * * * $(pwd)/renew-ssl.sh"

# 13. Nettoyage
rm -f nginx/nginx.temp.conf nginx/nginx.final.conf

echo ""
echo "🎉 Déploiement terminé avec succès!"
echo "📋 Commandes utiles :"
echo "  - Voir les logs: docker compose -f docker-compose.prod.yml logs"
echo "  - Redémarrer: docker compose -f docker-compose.prod.yml restart"
echo "  - Arrêter: docker compose -f docker-compose.prod.yml down"