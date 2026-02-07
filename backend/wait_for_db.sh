#!/bin/sh
# Attend que le service Postgres soit résolvable (DNS) et accepte les connexions.
set -e
DB_HOST="${DB_SERVICE:-postgres_db}"
DB_PORT="${DB_PORT:-5432}"
echo "Waiting for $DB_HOST:$DB_PORT..."

# Attendre la résolution DNS
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if getent hosts "$DB_HOST" >/dev/null 2>&1; then
    echo "DNS resolved: $DB_HOST"
    break
  fi
  echo "  attempt $i: DNS not ready, retrying in 2s..."
  sleep 2
done

if ! getent hosts "$DB_HOST" >/dev/null 2>&1; then
  echo "ERROR: Could not resolve host $DB_HOST"
  exit 1
fi

# Attendre que le port soit ouvert (Postgres accepte les connexions)
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if python -c "
import socket, os
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(3)
try:
  s.connect((os.environ.get('DB_SERVICE', 'postgres_db'), int(os.environ.get('DB_PORT', 5432))))
  s.close()
  exit(0)
except Exception:
  exit(1)
" 2>/dev/null; then
    echo "Database $DB_HOST:$DB_PORT is ready."
    exit 0
  fi
  echo "  attempt $i: port not ready, retrying in 2s..."
  sleep 2
done

echo "ERROR: Database at $DB_HOST:$DB_PORT did not become ready."
exit 1
