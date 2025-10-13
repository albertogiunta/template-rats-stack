# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Install curl
RUN apk add --no-cache curl

# Build stage
FROM base AS build
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate database migrations from schema
RUN pnpm db:generate

# Build the Astro app
RUN pnpm build

# Production stage
FROM base AS runtime
WORKDIR /app

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Copy database schema and migrations for runtime
COPY --from=build /app/src/lib/db ./src/lib/db
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATABASE_PATH=/app/db/data.db
ENV NODE_ENV=production

# Create db directory for SQLite file
RUN mkdir -p /app/db

# Expose the port
EXPOSE 4321

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use entrypoint to run migrations before starting
ENTRYPOINT ["/docker-entrypoint.sh"]
