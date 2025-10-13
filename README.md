# My Stack Template

Simple full-stack TypeScript template with Astro, React, SQLite.

## Stack

- **Frontend**: Astro + React (SPA mode) + Tailwind + shadcn/ui
- **Data**: React Query
- **Database**: SQLite + Drizzle ORM
- **Deployment**: Anywhere Node.js runs

```
├── src/
│   ├── components/
│   │   ├── app/          # Your app components
│   │   ├── ui/           # shadcn components
│   │   └── App.tsx       # React root
│   ├── lib/
│   │   ├── db/           # Database schema & client
│   │   ├── services/     # Business logic
│   │   └── config.ts     # App configuration
│   ├── pages/
│   │   ├── [...app].astro    # React SPA entry
│   │   └── api/              # API endpoints
│   └── styles/
├── db/
│   └── seeds/            # Seed scripts
└── drizzle/              # Generated migrations
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Initialize database
pnpm db:generate  # 1. Generate initial migration
pnpm db:migrate   # 2. Apply migration (creates db/data.db)
pnpm db:seed      # 3. Seed with sample data

# Start dev server
pnpm dev

# Visit http://localhost:4321/app
```

## Common operations

Update database schema: Edit src/lib/db/schema.ts
Generate migration: pnpm db:generate
Update seed data: Edit db/seeds/seed.ts
Update components: Replace files in src/components/app/
Update API routes: Edit files in src/pages/api/
Update config: Edit .env and src/lib/config.ts

## VPS Deployment

```bash
# Build
pnpm build

# Copy to server
rsync -avz dist/ user@server:/var/www/app/
rsync -avz db/ user@server:/var/www/app/db/

# On server, run with Node
node dist/server/entry.mjs
```

## Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
```

# Create new project from template
```bash
gh repo create new-project --template albertogiunta/template-rats-stack --private --clone
cd new-project

# Install and initialize
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Customize schema
# Edit src/lib/db/schema.ts
pnpm db:generate
pnpm db:migrate

# Start building
pnpm dev
```

## Syncing with Template Updates

To pull updates from the template repository:

```bash
# Add template as remote (one-time setup)
git remote add template https://github.com/albertogiunta/template-rats-stack

# Fetch latest changes
git fetch --all

# Merge template updates
git merge template/main --allow-unrelated-histories
```