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
