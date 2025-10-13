#!/bin/sh
set -e

echo "🗄️  Checking database..."

# Ensure db directory exists
mkdir -p /app/db

# Check if database file exists
if [ ! -f "$DATABASE_PATH" ]; then
  echo "📝 Database not found, will be created on first migration"
fi

# Try migrations, fall back to push if they fail
echo "🔄 Running database migrations..."
if pnpm db:migrate; then
  echo "✅ Migrations complete!"
else
  echo "⚠️  Migrations failed, syncing schema instead..."
  pnpm db:push
  echo "✅ Schema synced!"
fi

echo "✅ Migrations complete!"

# Start the Astro server
echo "🚀 Starting Astro server..."
exec node ./dist/server/entry.mjs
