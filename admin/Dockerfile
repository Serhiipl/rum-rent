
# 1. Build stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Білд Next.js
RUN npm run build

# 2. Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копіюємо standalone білд Next.js
COPY --from=builder /app/.next/standalone ./

# Копіюємо статичні файли (якщо є)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# У деяких випадках також варто скопіювати .env, якщо він потрібен
# COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["node", "server.js"]
