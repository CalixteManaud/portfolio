# syntax=docker/dockerfile:1.7
# =============================================================================
# Multi-stage Dockerfile for Next.js (standalone output)
# - deps:    install only what's needed to install (lockfile + manifests)
# - builder: install dev deps, build, prune
# - runner:  minimal runtime, non-root user, healthcheck
# =============================================================================

ARG NODE_VERSION=22-alpine

# -----------------------------------------------------------------------------
# Base — pnpm via corepack
# La version de pnpm vient du champ "packageManager" de package.json, comme en
# CI : corepack la résout dès que pnpm tourne dans /app. Une version fixée ici
# finirait par diverger de celle du projet.
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# -----------------------------------------------------------------------------
# deps — install dependencies (cached layer)
# -----------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

# -----------------------------------------------------------------------------
# builder — build the Next.js app
# -----------------------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# -----------------------------------------------------------------------------
# runner — minimal production image
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build (slim) + static + public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
