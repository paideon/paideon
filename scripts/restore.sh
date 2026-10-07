#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ] || [ ! -f "$1" ]; then
  echo "Usage: $0 path/to/paideon-backup.sql.gz" >&2
  exit 2
fi

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
COMPOSE_FILE=${COMPOSE_FILE:-"$REPO_ROOT/infrastructure/docker/docker-compose.prod.yml"}
RESTORE_DATABASE=${RESTORE_DATABASE:-}
if [ -z "$RESTORE_DATABASE" ]; then
  echo "Set RESTORE_DATABASE to the target database name." >&2
  exit 2
fi
case "$RESTORE_DATABASE" in
  *_restore_test) ;;
  *)
    if [ "${RESTORE_CONFIRM:-}" != "YES" ]; then
      echo "Refusing non-test restore without RESTORE_CONFIRM=YES." >&2
      exit 2
    fi
    ;;
esac

gzip -dc "$1" | docker compose -f "$COMPOSE_FILE" exec -T postgres \
  sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$1"' sh "$RESTORE_DATABASE"
printf 'Restore completed into database %s\n' "$RESTORE_DATABASE"
