FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY packages/crypto/package.json ./packages/crypto/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile || pnpm install

COPY packages/db ./packages/db
COPY packages/shared ./packages/shared
COPY packages/crypto ./packages/crypto
COPY apps/api ./apps/api

RUN pnpm --filter @doc-vault/db exec prisma generate
RUN pnpm --filter @doc-vault/crypto build
RUN pnpm --filter @doc-vault/shared build
RUN pnpm --filter @doc-vault/db build
RUN pnpm --filter @doc-vault/api build

FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

RUN mkdir -p /data/uploads
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
