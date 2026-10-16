import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

// Prisma 7 does not read .env by itself. The root .env holds DATABASE_URL.
try {
  process.loadEnvFile(path.join('..', '..', '.env'));
} catch {
  // No .env file (e.g. CI): DATABASE_URL must already be in the environment.
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
