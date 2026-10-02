## How to run locally

1. Copy `.env.example` to `.env` and set distinct, random values for
   `JWT_SECRET` and `JWT_REFRESH_SECRET`.
   Export the variables in your shell before running the API and database
   commands (`set -a; . ./.env; set +a` in bash).
2. Start PostgreSQL with
   `docker compose -f infrastructure/docker/docker-compose.yml up -d`.
3. Apply the Prisma schema with `pnpm db:migrate`.
4. Seed the demonstration school and accounts with `pnpm db:seed`.
5. Start the API with `pnpm dev:api`.
6. Start the portal with `pnpm dev:portal`.

The seeded sign-in accounts are printed by `pnpm db:seed`. The initial
circulation data includes 30 books, 1–3 uniquely barcoded copies per book, and
10 student accounts with library card barcodes.

## Production deployment

Set `DB_USER`, a URL-safe `DB_PASSWORD`, `DB_NAME`, `DOMAIN`,
`JWT_SECRET`, and `JWT_REFRESH_SECRET` in the deployment environment (or in a
private `.env` file). Use different long random values for the two JWT
secrets. Point the domain's DNS A/AAAA records at the host, then deploy with:

```sh
docker compose -f infrastructure/docker/docker-compose.prod.yml up -d --build
```

The compose stack starts PostgreSQL, applies pending Prisma migrations, starts
the API and portal, and routes HTTPS through Caddy. The API is not published
directly; Caddy routes `/api` to the API and other paths to the portal.

## Backup and restore

Run a compressed PostgreSQL backup and retain the newest 14 local archives:

```sh
bash scripts/backup.sh
```

The production compose stack must be running. To upload each backup as well,
install/configure `rclone` for an S3-compatible remote (Cloudflare R2 works)
and export `RCLONE_REMOTE`, for example `r2:school-backups/paideon`. Configure
the R2 remote credentials with rclone's `RCLONE_CONFIG_<REMOTE>_*` environment
variables.

Nightly cron entry (replace the path and ensure cron has the deployment
environment available):

```cron
0 2 * * * cd /path/to/paideon && /bin/bash scripts/backup.sh >> backups/backup.log 2>&1
```

Test restores into a separate database, never over the production database:

```sh
docker compose -f infrastructure/docker/docker-compose.prod.yml exec -T postgres \
  sh -c 'createdb -U "$POSTGRES_USER" paideon_restore_test'
RESTORE_DATABASE=paideon_restore_test bash scripts/restore.sh backups/paideon-YYYYMMDDTHHMMSSZ.sql.gz
docker compose -f infrastructure/docker/docker-compose.prod.yml exec -T postgres \
  sh -c 'psql -U "$POSTGRES_USER" -d paideon_restore_test -c "SELECT count(*) FROM \\"Book\\";"'
```

Non-test targets require an explicit `RESTORE_CONFIRM=YES`.

## Circulation smoke check

With PostgreSQL, API and seed data running, run:

```sh
pnpm smoke:library
```

The script signs in as the seeded librarian, imports one CSV book, checks it
out to the seeded student, backdates that loan for the late-return path, and
verifies the resulting unpaid fine through the API.

## Assumptions

- The migration contains no library relation or `libraryID` column. Library
  data is scoped directly by `schoolId`.
- Fine blocking uses the schema's `LibraryConfig.maxFineLKR` threshold; students
  use `maxLoansStudent`, and other member roles use `maxLoansTeacher`.
- A multi-copy CSV row uses its starting barcode for copy one and appends
  `-02`, `-03`, and so on for additional copies.
- The local seed accounts and sample catalog are demonstration data and must
  not be used as production credentials.
