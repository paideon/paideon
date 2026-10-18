FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /repo
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm nx build portal

FROM node:24-alpine AS runtime
RUN corepack enable
WORKDIR /repo
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/portal ./apps/portal
EXPOSE 3000
CMD ["pnpm", "--dir", "apps/portal", "exec", "next", "start", "-p", "3000"]