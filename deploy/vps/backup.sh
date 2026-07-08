#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/trevvos}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/$STAMP"

mkdir -p "$BACKUP_DIR"

echo "==> Backup dir: $BACKUP_DIR"

echo "==> Backing up VPS config"
mkdir -p "$BACKUP_DIR/config"
cp -a /opt/trevvos/Caddyfile "$BACKUP_DIR/config/Caddyfile" 2>/dev/null || true
cp -a /opt/portaltrevvos/deploy/vps "$BACKUP_DIR/config/deploy-vps" 2>/dev/null || true

echo "==> Backing up Caddy docker volumes"
mkdir -p "$BACKUP_DIR/volumes"

for volume in $(docker volume ls --format '{{.Name}}' | grep -E 'caddy_(data|config)$' || true); do
  echo "Backing up volume $volume"
  docker run --rm \
    -v "$volume:/volume:ro" \
    -v "$BACKUP_DIR/volumes:/backup" \
    busybox \
    tar -czf "/backup/${volume}.tar.gz" -C /volume .
done

echo "==> Looking for Postgres container"
POSTGRES_CONTAINER="$(docker ps --format '{{.Names}}' | grep -Ei 'postgres|db' | head -1 || true)"

if [ -n "$POSTGRES_CONTAINER" ]; then
  echo "Backing up Postgres from $POSTGRES_CONTAINER"

  POSTGRES_USER="$(docker exec "$POSTGRES_CONTAINER" sh -lc 'printenv POSTGRES_USER || true')"
  POSTGRES_USER="${POSTGRES_USER:-postgres}"

  docker exec "$POSTGRES_CONTAINER" sh -lc "pg_dumpall -U '$POSTGRES_USER'" \
    > "$BACKUP_DIR/postgres-dump.sql"
else
  echo "No Postgres container found, skipping database dump"
fi

echo "==> Creating archive"
tar -czf "$BACKUP_ROOT/trevvos-backup-$STAMP.tar.gz" -C "$BACKUP_ROOT" "$STAMP"

echo "==> Removing expanded backup dir"
rm -rf "$BACKUP_DIR"

echo "==> Removing backups older than 7 days"
find "$BACKUP_ROOT" -type f -name 'trevvos-backup-*.tar.gz' -mtime +7 -delete

echo "==> Backup finished"
ls -lh "$BACKUP_ROOT/trevvos-backup-$STAMP.tar.gz"
