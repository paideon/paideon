# 🛠️ Project NEXUS: Technology Stack

> Finalized technology decisions for the NEXUS Library Management System.

**Version:** 1.1 **Date:** February 2026 **Author:** S.C. Roshana (Cinderax) **Project:** NEXUS Library Management System**School:** C.W.W. Kannangara Central College - Mathugama

---

## Document Control

|Version|Date|Changes|
|---|---|---|
|1.0|Jan 2026|Initial technology stack|
|1.1|Feb 2026|Updated to reflect finalized monorepo architecture, ORM, and tooling decisions|

---

## 1. 🗂️ Monorepo & Project Management

|Component|Technology|Rationale|
|---|---|---|
|**Monorepo Structure**|**Nx**|Industry-standard build system for managing multiple apps and packages in one repository. Handles caching, task orchestration, code generators, and dependency graph visualization.|
|**Package Manager**|**pnpm**|Fastest and most disk-efficient package manager. Native workspace support makes it the best choice for monorepos. Significantly faster than npm or yarn.|
|**Workspace Layout**|**pnpm Workspaces**|Declares `apps/` and `packages/` as workspace packages. Enables local package linking without publishing to npm.|

**Repository Structure:**

```
nexus/
├── apps/
│   ├── api/          ← NestJS backend
│   └── web/          ← Next.js frontend (PWA)
└── packages/
    ├── database/     ← Prisma schema + client (shared)
    ├── types/        ← Shared TypeScript types
    ├── ui/           ← Shared React components
    └── config/       ← Shared ESLint, Tailwind configs
```

---

## 2. 🧠 Backend (API Layer)

|Component|Technology|Rationale|
|---|---|---|
|**Primary Language**|**TypeScript**|Strict static typing prevents bugs at compile time, not runtime. Essential for a large, complex system serving 5,300+ users.|
|**Backend Framework**|**NestJS**(Node.js)|Enterprise-grade, highly structured architecture using Modules, Controllers, and Services. Built-in support for validation, guards, interceptors, and dependency injection. Scales cleanly as features are added.|
|**Runtime**|**Node.js 20 LTS**|Long-Term Support version. Non-blocking I/O handles concurrent users efficiently.|
|**Real-Time**|**Socket.IO**|Enables instant two-way communication for live notifications — e.g., "Your reserved book is now available."|
|**Validation**|**class-validator + class-transformer**|Declarative, decorator-based input validation integrated natively into NestJS DTOs.|
|**API Documentation**|**Swagger (OpenAPI)**|Auto-generates interactive API docs from NestJS decorators. Available at `/api/docs`during development.|

---

## 3. 💾 Data Layer (Database & ORM)

|Component|Technology|Rationale|
|---|---|---|
|**Database Engine**|**PostgreSQL 16**|Industry-standard relational database. ACID-compliant, excellent for complex queries, and supports advanced indexing. Chosen over MySQL for its superior JSON support and full-text search capabilities.|
|**ORM**|**Prisma**|Modern, type-safe ORM that generates a fully-typed database client from the schema. Eliminates raw SQL for everyday queries, prevents SQL injection by design, and makes migrations straightforward. Shared across `api` and `web` via `@nexus/database` package.|
|**Schema Location**|`packages/database/prisma/schema.prisma`|Single source of truth for the entire database structure. All models, relations, and enums are defined here and used by both apps.|
|**Primary Keys**|**cuid()** (via Prisma)|Collision-resistant IDs that are URL-safe and sortable. Chosen over auto-incrementing integers for security (prevents ID enumeration attacks) and over UUIDs for being shorter and more readable.|
|**Migrations**|**Prisma Migrate**|Version-controlled, declarative migration system. Every schema change produces a migration file committed to Git — full audit trail of every database change.|
|**Caching Layer**|**Redis 7**|In-memory data store for ultra-fast caching of search results, session data, and frequently accessed book lists. Ensures search results in <50ms. Also used for rate limiting and reservation queue state.|

**Database Design Pattern:** Record vs. Item Model (inspired by the Koha Library System)

```
BookRecord (metadata concept)
└── BookItem[] (individual physical copies)
    └── Loan[] (borrowing history per copy)
```

---

## 4. 🎨 Frontend (User Interface)

|Component|Technology|Rationale|
|---|---|---|
|**Frontend Framework**|**Next.js 15**(App Router)|React framework with server-side rendering, static generation, and built-in routing. App Router enables layouts, loading states, and server components natively.|
|**UI Library**|**React 19**|The world-standard library for building component-based UIs. Chosen for its ecosystem, performance, and the team's expertise.|
|**Styling**|**Tailwind CSS v4**|Utility-first CSS framework. Allows rapid UI development directly in JSX without context-switching to stylesheet files. Produces minimal CSS bundle sizes.|
|**Component Library**|**shadcn/ui**|Unstyled, accessible, copy-paste components built on Radix UI primitives. Fully customizable to fit NEXUS's design identity. Not an installed package — components are owned by the project.|
|**PWA Support**|**next-pwa**|Converts the Next.js app into an installable Progressive Web App. Enables offline support, push notifications, and home screen installation on iOS and Android.|
|**Icons**|**Lucide React**|Clean, consistent, and lightweight open-source icon set.|

---

## 5. ⚙️ Development Infrastructure

|Component|Technology|Rationale|
|---|---|---|
|**Local Databases**|**Docker + Docker Compose**|Runs PostgreSQL and Redis in isolated containers locally. No local installation of database software needed. One command (`docker compose up -d`) starts everything.|
|**Code Editor**|**Visual Studio Code**|Professional-grade editor with superior TypeScript, ESLint, Prisma, and Tailwind CSS extensions.|
|**Version Control**|**Git + GitHub**|Git for local tracking. GitHub for remote hosting, backup, and future CI/CD. All source code hosted on a school-owned GitHub Organization account.|
|**Commit Convention**|**Conventional Commits**|Standardized commit message format: `feat:`, `fix:`, `chore:`, `docs:`. Keeps Git history readable and enables automatic changelog generation.|
|**Linting**|**ESLint**|Enforces code quality rules across all apps and packages via a shared root config inherited by every project.|
|**Formatting**|**Prettier**|Automatic, opinionated code formatting. Eliminates debates about code style. Shared config at root, applied to all files.|
|**Environment Variables**|**.env + .env.example**|`.env` holds real secrets (never committed). `.env.example` is the committed template showing what variables are needed.|

---

## 6. 🔐 Security

|Component|Technology|Rationale|
|---|---|---|
|**Authentication**|**JWT (JSON Web Tokens)** via `@nestjs/jwt`|Stateless authentication. Tokens are issued on login and verified on each request. 7-day expiry.|
|**Password Hashing**|**bcrypt** (10 rounds)|Industry-standard one-way hashing for passwords. Even if the database is compromised, passwords cannot be recovered.|
|**Authorization**|**NestJS Guards + RBAC**|Role-Based Access Control enforced at the controller level. Five roles: STUDENT, TEACHER, STAFF, LIBRARIAN, ADMIN.|
|**Input Validation**|**class-validator**|Every API endpoint validates incoming data before it reaches business logic. Prevents malformed or malicious input.|
|**SQL Injection**|**Prisma ORM**|Prisma uses parameterized queries by design. Direct SQL injection is structurally prevented.|
|**Rate Limiting**|**@nestjs/throttler**|Prevents brute-force attacks. 100 requests/minute per user. 5 failed login attempts triggers a 15-minute lockout.|

---

## 7. 📧 Notifications & Communication

|Component|Technology|Rationale|
|---|---|---|
|**Email**|**Nodemailer + Gmail SMTP**|Sends automated emails for due date reminders, overdue notices, reservation alerts. Free for the volume needed.|
|**SMS** (future)|**Dialog SMS API / Twilio**|For critical notifications to users without consistent internet access. Phase 2 feature.|
|**Push Notifications**|**Web Push API** (via PWA)|Browser push notifications for reservation availability alerts. Works after PWA is installed.|

---

## 8. 📊 Analytics & Reporting

|Component|Technology|Rationale|
|---|---|---|
|**Analytics Engine**|**Custom (NestJS + Prisma queries)**|Library-specific analytics built directly into the API. Dead stock analysis, acquisition recommendations, circulation trends.|
|**Charts (Frontend)**|**Recharts**|React-native charting library. Lightweight, responsive, and easy to customize for the admin dashboard.|
|**Report Export**|**PDFKit / ExcelJS**|Generates downloadable PDF and Excel reports from analytics data for administration.|

---

## 9. 🗄️ File Storage

|Component|Technology|Rationale|
|---|---|---|
|**Book Covers**|**Cloud Object Storage** (AWS S3 or Cloudflare R2)|Stores uploaded book cover images. R2 is preferred — no egress fees, cheaper than S3 for a school budget.|
|**Digital Vault PDFs**|**Same cloud storage**|Past papers, Ministry of Education textbooks stored securely. Served via CDN for fast loading.|
|**Local Dev**|**Local filesystem**|During development, files stored locally. Switched to cloud storage in production.|

---

## 10. 🚀 Deployment (To Be Decided)

Deployment platform has not been finalized. Candidates being evaluated:

|Option|Pros|Cons|
|---|---|---|
|**Railway**|Simple, Git-based deploy, affordable|Less control|
|**VPS (DigitalOcean / Hetzner)**|Full control, cheapest long-term|Requires server management|
|**Google Cloud Platform**|Mentioned in proposal, free tier|More complex setup|

**Decision will be made before Month 10 (deployment phase).**

Regardless of platform, the production environment will use:

- Docker containers for consistent, reproducible deployments
- Automated daily PostgreSQL backups with 30-day retention
- SSL/TLS via Let's Encrypt
- Environment variables managed securely by the hosting provider

---

## 11. 📦 Key Package Summary

### `apps/api` (NestJS)

```
@nestjs/common, @nestjs/core, @nestjs/jwt
@nestjs/swagger, @nestjs/throttler
@nestjs/websockets, socket.io
class-validator, class-transformer
bcrypt, nodemailer
@nexus/database, @nexus/types
```

### `apps/web` (Next.js)

```
next, react, react-dom
tailwindcss
@radix-ui/* (via shadcn/ui)
lucide-react, recharts
next-pwa
@nexus/types, @nexus/ui
```

### `packages/database`

```
prisma, @prisma/client
```

---

## 12. ❌ Technologies Considered but Rejected

|Technology|Reason Rejected|
|---|---|
|**MySQL**|PostgreSQL is more capable — better JSON support, full-text search, and advanced indexing|
|**TypeORM**|Prisma has a significantly better developer experience, type safety, and migration tooling|
|**MySQL Workbench**|Not needed — Prisma schema is the single source of truth for database design. Prisma Migrate handles DDL generation.|
|**GraphQL**|Adds complexity that isn't justified for this project. REST with Swagger is sufficient and easier for future maintainers.|
|**Yarn / npm**|pnpm is faster, more disk-efficient, and has better native monorepo support|
|**Create React App**|Deprecated. Next.js supersedes it with SSR, routing, and PWA support built in.|
|**Nx Cloud**|Remote caching for teams. Not needed for a solo developer on one machine.|

---

_Project NEXUS © 2026 — S.C. Roshana (Cinderax) | C.W.W. Kannangara Central College_