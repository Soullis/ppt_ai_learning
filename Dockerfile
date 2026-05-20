# syntax=docker/dockerfile:1.6

# Builder

FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner

FROM node:20-slim AS runner

RUN useradd -m -u 1000 app
WORKDIR /app

COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static     ./.next/static

RUN mkdir -p /app/public && chown -R app:app /app/public

USER app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

EXPOSE 7860

CMD ["node", "server.js"]
