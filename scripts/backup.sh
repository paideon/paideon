#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
COMPOSE_FILE=${COMPOSE_FILE:-"$REPO_ROOT/infrastructure/docker/docker-compose.prod.yml"}
BACKUP_DIR=${BACKUP_DIR:-"$REPO_ROOT/backups"}
mkdir -p "$BACKUP_DIR"

timestamp=$(date -u '+%Y%m%dT%H%M%SZ')
archive="$BACKUP_DIR/paideon-$timestamp.sql.gz"
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$archive"

if [ -n "${RCLONE_REMOTE:-}" ]; then
  rclone copy "$archive" "$RCLONE_REMOTE"
fi

ls -1t "$BACKUP_DIR"/paideon-*.sql.gz |
  tail -n +15 |
  while IFS= read -r old; do
    rm -f "$old"
  done

printf 'Backup created: %s\n' "$archive"
