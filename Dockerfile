# syntax=docker/dockerfile:1

# ---- deps ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.10.0 --activate
RUN pnpm install --frozen-lockfile

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.10.0 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Si tienes rutas dinámicas, recuerda: export const dynamic = "force-dynamic";
RUN pnpm build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache curl

# Copiar solo lo necesario para producción
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Healthcheck usando IP real del contenedor (evita localhost)
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD sh -lc 'IP=$(hostname -i) && curl -fsS "http://$IP:3000/api/health" || exit 1'

# Ejecutar el servidor escuchando en todas las interfaces
CMD ["node", "server.js", "--hostname", "0.0.0.0", "--port", "3000"]