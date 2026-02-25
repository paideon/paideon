> What a monorepo is, why NEXUS uses one, and how it works in practice.

---

## What is a Monorepo?

A **monorepo** (short for monolithic repository) is a single Git repository that contains multiple projects — apps, packages, and libraries — all living together in one folder.

The opposite of a monorepo is a **polyrepo** — where each project lives in its own separate Git repository.

NEXUS is a monorepo. Everything — the NestJS API, the Next.js web app, the shared database package, the shared types — lives inside one single `nexus/` folder tracked by one single Git repository.

---

## The Two Approaches — Side by Side

To really understand what a monorepo is, you need to see what the alternative looks like.

### The Polyrepo Way (what most beginners start with)

Imagine you built NEXUS as separate repositories:

```
GitHub/
├── nexus-api/          ← separate git repo for the NestJS backend
├── nexus-web/          ← separate git repo for the Next.js frontend
├── nexus-types/        ← separate git repo for shared TypeScript types
└── nexus-database/     ← separate git repo for Prisma schema
```

Each one has its own `package.json`, its own `node_modules`, its own Git history, its own version number. They're completely independent projects.

### The Monorepo Way (what NEXUS uses)

```
nexus/                  ← one git repo
├── apps/
│   ├── api/            ← NestJS backend
│   └── web/            ← Next.js frontend
└── packages/
    ├── database/       ← Prisma schema + client
    ├── types/          ← shared TypeScript types
    ├── ui/             ← shared components
    └── config/         ← shared configs
```

One repo. One Git history. One place to make changes.

---

## Why the Polyrepo Approach Breaks Down

On the surface, separate repos sounds cleaner. Each project is isolated. Tidy. Simple.

But the moment your projects need to **share code or talk to each other** — which NEXUS absolutely does — polyrepos become a nightmare. Here is exactly how:

### Problem 1: Sharing a Type is Painful

In NEXUS, a `Book` has a specific shape — an id, title, authors, coverImageUrl, and so on. Both the API (which returns books from the database) and the web app (which displays books on screen) need to agree on this shape.

In a polyrepo, to share that `Book` type you would have to:

1. Publish `nexus-types` to npm as a package (or use a private registry)
2. Install it in `nexus-api` with `pnpm install @nexus/types`
3. Install it in `nexus-web` with `pnpm install @nexus/types`
4. Every time you change the `Book` type, publish a new version of `nexus-types`
5. Update the version in both `nexus-api` and `nexus-web`
6. Commit and push to both repos

That is six steps every time you change a shared type. In a monorepo, you edit one file and you're done. The API and web are instantly using the updated type.

### Problem 2: Keeping Changes in Sync

Imagine you're adding a new field called `deweyDecimal` to the book schema. In a polyrepo, you need to:

- Update the Prisma schema in `nexus-database`
- Update the `Book` type in `nexus-types` and publish a new version
- Update the API endpoint in `nexus-api` and update the `nexus-types` dependency
- Update the web display in `nexus-web` and update the `nexus-types` dependency
- Make commits and manage pull requests across four separate repositories

This is a single feature that touches one database field. You'd be juggling four repos, four commits, four PRs — for one change. In a monorepo, this is one commit.

### Problem 3: No Visibility Across Projects

In a polyrepo, you have no easy way to answer questions like:

- "Which projects are affected if I change this shared type?"
- "Is the API and the web app using the same version of the type library?"
- "What changed across all my projects in the last week?"

In a monorepo with Nx, these questions are trivially answered with `pnpm nx graph` or `pnpm nx affected`.

### Problem 4: Duplicated Configuration

Every polyrepo project needs its own:

- `tsconfig.json`
- `.eslintrc.json`
- Prettier config
- Git hooks
- CI/CD pipeline config

That means maintaining the same config files in four places. When you want to update an ESLint rule, you update it four times. In a monorepo, there's one root config that everything inherits from.

---

## Why Monorepos Are the Right Choice for NEXUS

NEXUS has deep code sharing between its projects:

- `api` and `web` both need `@nexus/types` — the shared type definitions
- `api` needs `@nexus/database` — the Prisma client to talk to PostgreSQL
- `web` will need `@nexus/ui` — the shared React component library
- Both apps inherit from `@nexus/config` — the shared ESLint and TypeScript configs

With this much sharing, a polyrepo would be unworkable for a solo developer. A monorepo makes it natural.

Beyond sharing, NEXUS will grow. A future school management system on top of the library system. In a monorepo, adding a new app is as simple as running one Nx generator command. All the shared packages are already there, already configured, ready to import.

---

## How a Monorepo Works Technically

### One `node_modules` at the Root

In a polyrepo, each project installs its own `node_modules`. If `nexus-api` and `nexus-web` both use TypeScript, TypeScript gets installed twice — in two separate `node_modules` folders.

In a monorepo with pnpm, there is **one** `node_modules` at the root. All projects share it. pnpm uses a clever linking system so each project only sees the packages it declared in its own `package.json`, but they all pull from the same physical location on disk. This saves gigabytes of disk space and makes `pnpm install` much faster.

### Workspace Protocol

pnpm has a feature called **workspaces** that makes monorepos work. In `pnpm-workspace.yaml` you declare which folders are projects:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This tells pnpm: "Every folder inside `apps/` and `packages/` is a workspace package." Now when `apps/api/package.json` declares a dependency on `@nexus/types`, pnpm knows to link it directly to `packages/types/` on your local machine rather than downloading it from npm. No publishing required.

```json
// apps/api/package.json
{
  "dependencies": {
    "@nexus/types": "workspace:*"
  }
}
```

The `workspace:*` syntax means "use whatever version exists locally in this monorepo." It's a direct local link. Instant. No npm publish step ever needed.

### Shared Root Configuration

Config files at the root of the monorepo are inherited by all projects. This is how one `tsconfig.base.json` sets the TypeScript rules for every single app and package. Each project's own `tsconfig.json` just extends the root:

```json
// apps/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // only api-specific overrides here
  }
}
```

Same pattern for ESLint. The root `.eslintrc.json` defines the base rules. Each project inherits them automatically.

---

## The Folder Structure Explained

```
nexus/                          ← Git root. One repo.
│
├── apps/                       ← Things that RUN and get deployed
│   ├── api/                    ← NestJS backend server
│   │   ├── src/                ← Source code
│   │   ├── project.json        ← Nx configuration for this app
│   │   ├── tsconfig.json       ← Extends root tsconfig.base.json
│   │   └── package.json        ← App-specific dependencies
│   │
│   └── web/                    ← Next.js frontend
│       ├── src/
│       ├── project.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                   ← Shared code. Never deployed alone.
│   │
│   ├── database/               ← Prisma schema + generated client
│   │   ├── prisma/
│   │   │   └── schema.prisma   ← All database tables defined here
│   │   └── src/
│   │       └── index.ts        ← Exports the Prisma client
│   │
│   ├── types/                  ← Shared TypeScript types
│   │   └── src/
│   │       └── index.ts        ← Exports Book, User, Loan types etc.
│   │
│   ├── ui/                     ← Shared React components
│   │   └── src/
│   │       └── index.ts        ← Exports Button, Card, Modal etc.
│   │
│   └── config/                 ← Shared configuration files
│       ├── eslint-base.js
│       └── tailwind-base.js
│
├── docs/                       ← All documentation lives here
│
├── docker-compose.yml          ← PostgreSQL + Redis for local dev
├── .env.example                ← Template for environment variables
├── .gitignore                  ← What Git should ignore
├── nx.json                     ← Nx workspace configuration
├── package.json                ← Root dependencies + scripts
├── pnpm-workspace.yaml         ← Declares workspace packages
└── tsconfig.base.json          ← Root TypeScript config
```

### The `apps/` vs `packages/` Rule

This is the most important structural rule in the monorepo:

- **`apps/`** — Projects that are the final product. They get built and deployed to a server. They can import from `packages/`freely. They should never import from each other (the API should never import from the web app, and vice versa).
    
- **`packages/`** — Shared building blocks. They get imported by apps. They never run on their own. They can import from other packages but never from apps.
    

In plain terms: **packages serve apps, apps never serve each other.**

---

## What a "Change" Looks Like in a Monorepo

Here is a concrete example of adding a new field to a book — from database to screen — in the NEXUS monorepo. This is one Git commit.

**Scenario:** You want to add a `language` field to books so students can filter by Sinhala, Tamil, or English.

**Step 1** — Update the database schema in `packages/database/prisma/schema.prisma`:

```prisma
model BookRecord {
  // ... existing fields
  language String @default("en")
}
```

**Step 2** — Run the migration to update the actual database:

```bash
pnpm db:migrate
```

**Step 3** — Update the shared type in `packages/types/src/index.ts`:

```typescript
export interface BookSearchResult {
  // ... existing fields
  language: string;
}
```

**Step 4** — Update the API to return the field in `apps/api/src/books/books.service.ts`:

```typescript
// Add language to the Prisma select query
```

**Step 5** — Update the web UI to display it in `apps/web/src/app/books/[id]/page.tsx`:

```typescript
// Add language badge to the book detail page
```

All five steps. One folder. One commit:

```bash
git add .
git commit -m "feat: add language field to books"
```

In a polyrepo, this same change would require coordinating across four repositories, publishing a new package version, and updating dependencies. In the monorepo, it's one focused change with a clear history.

---

## Monorepo Misconceptions

### "Monorepo means one big messy codebase"

No. The folder structure enforces clear boundaries. `apps/api` cannot reach into `apps/web`. `packages/database` cannot reach into `apps/api`. Nx's module boundary rules make these boundaries enforced at the linter level — it's actually stricter than a polyrepo where anything can import anything from npm.

### "Monorepo means everything deploys together"

No. Each app deploys completely independently. When you deploy `apps/api` to your server, `apps/web` is not involved at all. The monorepo is about how you develop and share code — not about how you ship it.

### "Monorepo only makes sense for big teams"

No. A solo developer benefits just as much, arguably more. You don't have to context-switch between repos, manage versioning across repos, or coordinate changes in multiple places. One repo, full focus.

### "Monorepo makes Git history messy"

No — if you write good commit messages. The convention is to prefix commits with the scope of the change:

```bash
git commit -m "feat(api): add book search endpoint"
git commit -m "feat(web): add book search UI"
git commit -m "fix(database): correct fine calculation logic"
git commit -m "chore: update dependencies"
```

Using this pattern, you can filter Git history by scope at any time and the log stays perfectly readable.

---

## Monorepo vs Monolith — They Are Not the Same

This is a common confusion worth clearing up:

- A **monolith** is an architectural pattern where your entire backend is one single deployable unit — one server that handles everything. The opposite is microservices.
    
- A **monorepo** is a code organization strategy — one repo for multiple projects.
    

NEXUS uses a **monorepo** but is **not a monolith**. The API is a single NestJS server (which could be considered a monolith in architecture terms), but that's a separate topic from how the code is organized. If NEXUS ever grew to need microservices, you'd just add more apps to the `apps/` folder. The monorepo stays the same.

---

## Summary

|Question|Answer|
|---|---|
|What is a monorepo?|One Git repo containing multiple apps and packages|
|What is the alternative?|Polyrepo — each project in its own repo|
|Why does NEXUS use a monorepo?|Deep code sharing between API, web, and packages|
|How does sharing work?|pnpm workspaces link packages directly, no npm publish needed|
|How is configuration shared?|Root `tsconfig.base.json` and `.eslintrc.json` inherited by all|
|Does everything deploy together?|No. Each app deploys independently|
|Does it work for solo developers?|Yes — arguably better than for teams|
|What tool manages the monorepo?|Nx — see `understanding-nx.md`|

---

_Project NEXUS © 2026 — Cinderax | C.W.W. Kannangara Central College_