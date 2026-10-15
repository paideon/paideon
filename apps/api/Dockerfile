FROM node:24-alpine AS build
RUN apk add --no-cache openssl
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm db:generate
RUN pnpm nx build api

FROM node:24-alpine AS runtime
RUN apk add --no-cache openssl
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=build /repo/packages/contracts/dist ./packages/contracts/dist
COPY --from=build /repo/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=build /repo/packages/database/node_modules ./packages/database/node_modules
COPY --from=build /repo/packages/database/prisma ./packages/database/prisma
COPY --from=build /repo/packages/database/generated ./packages/database/generated
COPY --from=build /repo/package.json ./package.json
COPY --from=build /repo/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /repo/apps/api/dist ./apps/api/dist
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
