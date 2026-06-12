FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Production ---
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output .output

ENV HOST=0.0.0.0
ENV PORT=3800
ENV NODE_ENV=production

EXPOSE 3800

CMD ["node", ".output/server/index.mjs"]
