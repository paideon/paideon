> From empty folder to first Git commit.

---

## Prerequisites

Install these first. Do this once on your machine.

|Tool|Version|Download|
|---|---|---|
|Node.js|v20+|https://nodejs.org|
|pnpm|v9+|run: `npm install -g pnpm`|
|Docker Desktop|latest|https://www.docker.com/products/docker-desktop|
|Git|latest|https://git-scm.com|

Verify everything is installed:

```bash
node -v
pnpm -v
docker -v
git -v
```

---

## Step 1 — Create the Nx Workspace

This one command creates the entire monorepo scaffold — `nx.json`, `package.json`, `tsconfig.base.json`, `pnpm-workspace.yaml`, and everything Nx needs.

```bash
pnpm dlx create-nx-workspace@latest nexus --preset=empty --pm=pnpm --nxCloud=skip
```

When it asks questions:

- **Directory**: just press Enter (uses `nexus`)
- **Enable distributed caching**: No

Then move into the project:

```bash
cd nexus
```

---

## Step 2 — Install Nx Plugins

These plugins give Nx the ability to generate NestJS and Next.js apps.

```bash
pnpm add -D @nx/nest @nx/next @nx/node @nx/js
```

---

## Step 3 — Generate the Apps

**NestJS API:**

```bash
pnpm nx g @nx/nest:application --name=api --directory=apps/api --linter=eslint --unitTestRunner=jest
```

**Next.js Web:**

```bash
pnpm nx g @nx/next:application --name=web --directory=apps/web --linter=eslint --style=tailwind --appRouter=true --unitTestRunner=jest
```

After these two commands your `apps/` folder is fully scaffolded with all configs, entry files, and Nx project files.

---

## Step 4 — Create the Shared Packages

These are not generated — you create them manually. Run these commands from the root of the project.

```bash
# Create all package folders
mkdir -p packages/database/prisma
mkdir -p packages/database/src
mkdir -p packages/types/src
mkdir -p packages/ui/src
mkdir -p packages/config
```

Now create a `package.json` for each:

**packages/database/package.json**

```bash
cat > packages/database/package.json << 'EOF'
{
  "name": "@nexus/database",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "studio": "prisma studio",
    "seed": "ts-node src/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.14.0"
  },
  "devDependencies": {
    "prisma": "^5.14.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.4.0"
  }
}
EOF
```

**packages/types/package.json**

```bash
cat > packages/types/package.json << 'EOF'
{
  "name": "@nexus/types",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
EOF
```

**packages/ui/package.json**

```bash
cat > packages/ui/package.json << 'EOF'
{
  "name": "@nexus/ui",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
EOF
```

Create placeholder `index.ts` files so the packages are valid:

```bash
echo "// @nexus/database" > packages/database/src/index.ts
echo "// @nexus/types"    > packages/types/src/index.ts
echo "// @nexus/ui"       > packages/ui/src/index.ts
```

---

## Step 5 — Add Docker Compose

Create `docker-compose.yml` in the project root:

```bash
cat > docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:16
    container_name: nexus_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: nexus_redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT}:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF
```

---

## Step 6 — Set Up Environment Variables

```bash
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:your_strong_password_here@localhost:5433/nexus_dev"
DB_USER=postgres
BD_PASSWORD=your_strong_password_here
BD_NAME=nexus_dev
DB_PORT=5433

# Redis
REDIS_URL="redis://localhost:6379"
REDIS_PORT=6379

# JWT
JWT_SECRET="change-this-to-a-long-random-string-in-production"
JWT_EXPIRES_IN="7d"

# Google Books API (free key from console.cloud.google.com)
GOOGLE_BOOKS_API_KEY="your-google-books-api-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="NEXUS Library <library@school.lk>"

# App
NODE_ENV="development"
API_PORT=3001
WEB_URL="http://localhost:3000"
API_URL="http://localhost:3001"
EOF

# Copy it to actual .env for local dev
cp .env.example .env
```

---

## Step 7 — Update .gitignore

Nx creates a `.gitignore` for you. Add these extra lines to it:

```bash
cat >> .gitignore << 'EOF'

# Environment
.env
.env.local

# Prisma generated client
packages/database/src/generated/
EOF
```

---

## Step 8 — Verify the Folder Structure

Your project should now look like this:

```
nexus/
├── apps/
│   ├── api/              ← NestJS (generated by Nx)
│   └── web/              ← Next.js (generated by Nx)
├── packages/
│   ├── database/
│   │   ├── prisma/       ← Prisma schema goes here later
│   │   └── src/
│   │       └── index.ts
│   ├── types/
│   │   └── src/
│   │       └── index.ts
│   └── ui/
│       └── src/
│           └── index.ts
├── docker-compose.yml
├── .env                  ← local only, never committed
├── .env.example          ← committed, no real secrets
├── .gitignore
├── nx.json
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

Run this to confirm it matches (excludes node_modules and hidden folders):

```bash
find . -not -path '*/node_modules/*' -not -path '*/.nx/*' -not -path '*/.git/*' | sort
```

---

## Step 9 — First Git Commit

```bash
git add .
git commit -m "chore: initial monorepo setup (Nx + pnpm + NestJS + Next.js)"
```

---

## ✅ You're done. What's next?

The next session will be:

1. **Start Docker services** → `docker compose up -d`
2. **Design the Prisma schema** → `packages/database/prisma/schema.prisma`
3. **Run the first migration** → creates all tables in PostgreSQL
4. **Build the Auth module** → JWT login + role guards (everything else depends on this)

---

## Quick Reference — Commands You'll Use Daily

```bash
# Start databases
docker compose up -d

# Run everything
pnpm dev

# Run individually
pnpm dev:api      # API  → http://localhost:3001
pnpm dev:web      # Web  → http://localhost:3000

# Database
pnpm db:migrate   # New migration after schema changes
pnpm db:studio    # Visual DB browser → http://localhost:5555
pnpm db:generate  # Regenerate Prisma client

# Docker
docker compose up -d        # Start services
docker compose down         # Stop (data preserved)
docker compose down -v      # Stop + wipe all data
docker compose logs -f      # Watch logs

# Nx
pnpm nx graph                        # Visual dependency map
pnpm nx affected --target=build      # Only build what changed
```

---

_Project NEXUS © 2026 — Cinderax | C.W.W. Kannangara Central College_