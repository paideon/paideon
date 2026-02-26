
> Every command you will need from project start to production deployment. All commands are run from the **project root** unless explicitly stated otherwise.

**Version:** 1.0 **Author:** S.C. Roshana (Cinderax)

---

## The Golden Rule

```
Always be at the project root when running any command.
Never run pnpm install inside apps/ or packages/.
```

Verify you are at the root before running anything:

```bash
pwd
# Should output something like: /Users/yourname/nexus
```

---

## Table of Contents

1. [Docker — Databases](#1-docker--databases)
2. [pnpm — Dependencies](#2-pnpm--dependencies)
3. [Nx — Running Apps](#3-nx--running-apps)
4. [Nx — Code Generation](#4-nx--code-generation)
5. [Database — Prisma](#5-database--prisma)
6. [Git](#6-git)
7. [Testing](#7-testing)
8. [Linting & Formatting](#8-linting--formatting)
9. [Building for Production](#9-building-for-production)
10. [Nx — Workspace Utilities](#10-nx--workspace-utilities)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Docker — Databases

Docker runs PostgreSQL and Redis locally. These must be started before running the API.

```bash
# Start PostgreSQL and Redis in the background
docker compose up -d

# Stop containers (data is preserved)
docker compose down

# Stop containers AND delete all data (full reset)
docker compose down -v

# Check if containers are running
docker compose ps

# View live logs from both containers
docker compose logs -f

# View logs from PostgreSQL only
docker compose logs -f postgres

# View logs from Redis only
docker compose logs -f redis

# Restart containers
docker compose restart

# Open a PostgreSQL shell (useful for direct SQL queries)
docker exec -it nexus_postgres psql -U postgres -d nexus_dev
```

**When to use:**

- `docker compose up -d` — every time you start a development session
- `docker compose down` — when you're done for the day
- `docker compose down -v` — when you want to reset the database completely and start fresh

---

## 2. pnpm — Dependencies

```bash
# Install all dependencies for the entire monorepo (run once after cloning)
pnpm install

# Add a dependency to a specific app
pnpm add <package> --filter api
pnpm add <package> --filter web

# Add a dependency to a specific package
pnpm add <package> --filter @nexus/database
pnpm add <package> --filter @nexus/types

# Add a dev dependency to a specific app
pnpm add -D <package> --filter web
pnpm add -D <package> --filter api

# Add a dependency to the root (shared dev tools only)
pnpm add -D <package> -w

# Remove a dependency from a specific app
pnpm remove <package> --filter web

# Update all dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

**Examples you will actually use:**

```bash
# Add Framer Motion to the web app
pnpm add framer-motion --filter web

# Add bcrypt to the API
pnpm add bcrypt --filter api
pnpm add -D @types/bcrypt --filter api

# Add Prisma to the database package
pnpm add prisma @prisma/client --filter @nexus/database
```

**The --filter flag tells pnpm which app or package to add the dependency to. Never run pnpm add without --filter (except for root-level dev tools).**

---

## 3. Nx — Running Apps

```bash
# Start the API dev server (NestJS)
pnpm nx serve api
# Available at: http://localhost:3001

# Start the Web dev server (Next.js)
pnpm nx serve web
# Available at: http://localhost:3000

# Start both API and Web at the same time
pnpm nx run-many --target=serve --projects=api,web --parallel

# Start everything (all apps in the workspace)
pnpm nx run-many --target=serve --all --parallel
```

---

## 4. Nx — Code Generation

Generators scaffold new code so you never start from a blank file.

### Generating NestJS modules

```bash
# Generate a full CRUD resource (controller + service + module + DTO + tests)
pnpm nx g @nx/nest:resource --name=books --project=api --directory=src/books
pnpm nx g @nx/nest:resource --name=users --project=api --directory=src/users
pnpm nx g @nx/nest:resource --name=loans --project=api --directory=src/loans
pnpm nx g @nx/nest:resource --name=reservations --project=api --directory=src/reservations
pnpm nx g @nx/nest:resource --name=fines --project=api --directory=src/fines

# Generate just a module
pnpm nx g @nx/nest:module --name=auth --project=api --directory=src/auth

# Generate just a service
pnpm nx g @nx/nest:service --name=auth --project=api --directory=src/auth

# Generate just a controller
pnpm nx g @nx/nest:controller --name=auth --project=api --directory=src/auth

# Generate a guard (for auth/role protection)
pnpm nx g @nx/nest:guard --name=jwt-auth --project=api --directory=src/auth/guards

# Generate a middleware
pnpm nx g @nx/nest:middleware --name=logger --project=api --directory=src/common/middleware

# Generate an interceptor
pnpm nx g @nx/nest:interceptor --name=transform --project=api --directory=src/common/interceptors

# Generate a pipe (for validation)
pnpm nx g @nx/nest:pipe --name=validation --project=api --directory=src/common/pipes
```

### Generating shared libraries

```bash
# Generate a new shared library inside packages/
pnpm nx g @nx/js:library --name=utils --directory=packages/utils --importPath=@nexus/utils
```

---

## 5. Database — Prisma

All Prisma commands target `packages/database` where the schema lives.

```bash
# Generate the Prisma client after any schema change
# (must run this every time you edit schema.prisma)
pnpm --filter @nexus/database prisma generate

# Create a new migration after changing schema.prisma
pnpm --filter @nexus/database prisma migrate dev --name <description>

# Examples:
pnpm --filter @nexus/database prisma migrate dev --name init
pnpm --filter @nexus/database prisma migrate dev --name add-users-table
pnpm --filter @nexus/database prisma migrate dev --name add-language-to-books

# Apply migrations in production (never use migrate dev in production)
pnpm --filter @nexus/database prisma migrate deploy

# Open Prisma Studio — visual database browser
pnpm --filter @nexus/database prisma studio
# Available at: http://localhost:5555

# Reset the entire database (drops everything and reruns all migrations)
# WARNING: All data will be deleted
pnpm --filter @nexus/database prisma migrate reset

# Check the status of all migrations
pnpm --filter @nexus/database prisma migrate status

# Push schema changes to DB without creating a migration file
# (useful in early prototyping, not for production)
pnpm --filter @nexus/database prisma db push

# Pull the current database schema into schema.prisma
# (useful if you made direct DB changes and want to sync)
pnpm --filter @nexus/database prisma db pull

# Run the seed script to populate the database with test data
pnpm --filter @nexus/database prisma db seed

# Format the schema.prisma file
pnpm --filter @nexus/database prisma format
```

**The workflow every time you change schema.prisma:**

```bash
# Step 1 — Create the migration
pnpm --filter @nexus/database prisma migrate dev --name describe-your-change

# Step 2 — Regenerate the client
pnpm --filter @nexus/database prisma generate

# Step 3 — Restart the API so it picks up the new client
pnpm nx serve api
```

---

## 6. Git

Standard Git workflow for this project.

```bash
# Check what files have changed
git status

# See the actual changes
git diff

# Stage all changes
git add .

# Stage a specific file
git add apps/api/src/books/books.service.ts

# Commit with a message (follow Conventional Commits format)
git commit -m "feat(api): add books CRUD endpoints"
git commit -m "feat(web): add landing page"
git commit -m "fix(api): correct fine calculation logic"
git commit -m "chore: update dependencies"
git commit -m "docs: update api endpoints documentation"
git commit -m "refactor(api): move auth logic to separate service"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create a new branch for a feature
git checkout -b feat/auth-module
git checkout -b feat/books-catalog
git checkout -b fix/fine-calculation

# Switch back to main
git checkout main

# Merge a branch into main
git merge feat/auth-module

# View commit history (clean one-line format)
git log --oneline

# Undo the last commit (keeps changes in working directory)
git reset --soft HEAD~1

# See all branches
git branch -a
```

**Conventional Commits format:**

|Prefix|When to use|
|---|---|
|`feat:`|New feature|
|`fix:`|Bug fix|
|`chore:`|Maintenance, dependency updates|
|`docs:`|Documentation changes|
|`refactor:`|Code restructuring, no behavior change|
|`test:`|Adding or fixing tests|
|`style:`|Formatting, no logic change|

**Always include the scope in brackets when relevant:**

```bash
git commit -m "feat(api): ..."    # change is in the API
git commit -m "feat(web): ..."    # change is in the web app
git commit -m "fix(database): ..." # change is in the database package
```

---

## 7. Testing

```bash
# Run tests for the API
pnpm nx test api

# Run tests for the web app
pnpm nx test web

# Run tests for all projects
pnpm nx run-many --target=test --all

# Run only tests affected by recent changes
pnpm nx affected --target=test

# Run tests in watch mode (re-runs on file save)
pnpm nx test api --watch
pnpm nx test web --watch

# Run tests with coverage report
pnpm nx test api --coverage
pnpm nx test web --coverage

# Run a specific test file
pnpm nx test api --testFile=src/books/books.service.spec.ts

# Run end-to-end tests
pnpm nx e2e api-e2e
pnpm nx e2e web-e2e
```

---

## 8. Linting & Formatting

```bash
# Lint the API
pnpm nx lint api

# Lint the web app
pnpm nx lint web

# Lint all projects
pnpm nx run-many --target=lint --all

# Lint only affected projects
pnpm nx affected --target=lint

# Auto-fix lint errors where possible
pnpm nx lint api --fix
pnpm nx lint web --fix

# Format all files with Prettier
pnpm prettier --write .

# Check formatting without changing files
pnpm prettier --check .
```

---

## 9. Building for Production

```bash
# Build the API for production
pnpm nx build api

# Build the web app for production
pnpm nx build web

# Build all projects
pnpm nx run-many --target=build --all

# Build only affected projects
pnpm nx affected --target=build

# Preview the production web build locally
pnpm nx start web
```

**Build outputs:**

- API → `dist/apps/api/`
- Web → `apps/web/.next/`

---

## 10. Nx — Workspace Utilities

```bash
# Open the interactive project dependency graph in the browser
pnpm nx graph

# List all projects in the workspace
pnpm nx show projects

# Show details about a specific project (its targets, dependencies)
pnpm nx show project api
pnpm nx show project web

# Clear the Nx build cache
pnpm nx reset

# Check what projects are affected by current changes
pnpm nx affected --target=build --dry-run

# Upgrade all Nx packages to the latest version
pnpm nx migrate latest
# Then apply the migration
pnpm nx migrate --run-migrations
```

---

## 11. Troubleshooting

### "Module not found" or import errors after changing a package

```bash
# Regenerate Prisma client
pnpm --filter @nexus/database prisma generate

# Clear Nx cache and rebuild
pnpm nx reset
pnpm nx build api
```

### App won't start after pulling new changes from Git

```bash
# Someone may have added new dependencies or migrations
pnpm install
pnpm --filter @nexus/database prisma migrate dev
pnpm nx serve api
```

### Port already in use

```bash
# Find what is using port 3001 (API)
lsof -i :3001

# Find what is using port 3000 (Web)
lsof -i :3000

# Kill the process using the port (replace PID with the number shown)
kill -9 <PID>
```

### Database connection refused

```bash
# Make sure Docker containers are running
docker compose ps

# If not running, start them
docker compose up -d

# Check the DATABASE_URL in your .env matches docker-compose.yml
cat .env | grep DATABASE_URL
```

### node_modules appearing inside apps/api or apps/web

```bash
# Delete them
rm -rf apps/api/node_modules
rm -rf apps/web/node_modules

# Clean install from root
rm -rf node_modules
pnpm install
```

### Prisma client is out of sync with schema

```bash
pnpm --filter @nexus/database prisma generate
# Restart the API
pnpm nx serve api
```

### TypeScript errors after adding a new package

```bash
# Make sure the package is installed at root
pnpm install

# Restart the TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Quick Reference Card

```bash
# ── Daily startup ─────────────────────────────────────────────
docker compose up -d                          # Start databases
pnpm nx run-many --target=serve \
  --projects=api,web --parallel               # Run everything

# ── Add a dependency ──────────────────────────────────────────
pnpm add <pkg> --filter api                   # Add to API
pnpm add <pkg> --filter web                   # Add to Web

# ── Generate NestJS code ──────────────────────────────────────
pnpm nx g @nx/nest:resource \
  --name=<n> --project=api                    # Full CRUD module

# ── Database ──────────────────────────────────────────────────
pnpm --filter @nexus/database \
  prisma migrate dev --name <description>     # New migration
pnpm --filter @nexus/database \
  prisma generate                             # Regenerate client
pnpm --filter @nexus/database \
  prisma studio                               # Visual DB browser

# ── Quality ───────────────────────────────────────────────────
pnpm nx test api                              # Test API
pnpm nx test web                              # Test Web
pnpm nx lint api                              # Lint API
pnpm prettier --write .                       # Format everything

# ── Git ───────────────────────────────────────────────────────
git add . && git commit -m "feat(api): ..."   # Commit
git push origin main                          # Push

# ── Nx utilities ──────────────────────────────────────────────
pnpm nx graph                                 # Dependency map
pnpm nx reset                                 # Clear cache
pnpm nx affected --target=build               # Build only what changed
```

---

_Project NEXUS © 2026 — S.C. Roshana (Cinderax) | C.W.W. Kannangara Central College_