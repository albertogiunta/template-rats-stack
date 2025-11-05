# My Stack Template

Simple full-stack TypeScript template with Astro, React, SQLite.

## Stack

- **Frontend**: Astro + React (SPA mode) + Tailwind + shadcn/ui
- **Data**: React Query
- **Database**: SQLite + Drizzle ORM
- **Authentication**: better-auth (opt-in) with email/password + OAuth
- **Deployment**: Anywhere Node.js runs

```
├── src/
│   ├── components/
│   │   ├── app/
│   │   │   ├── auth/     # Auth components (opt-in)
│   │   │   └── ...       # Your app components
│   │   ├── ui/           # shadcn components
│   │   └── App.tsx       # React root
│   ├── lib/
│   │   ├── auth/         # Auth config & utils (opt-in)
│   │   ├── db/           # Database schema & client
│   │   ├── services/     # Business logic
│   │   └── config.ts     # App configuration
│   ├── pages/
│   │   ├── [...app].astro    # React SPA entry
│   │   └── api/
│   │       └── auth/     # Auth API routes (opt-in)
│   └── styles/
├── db/
│   └── seeds/            # Seed scripts
├── drizzle/              # Generated migrations
└── AUTH.md               # Authentication guide
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Update the schema to your needs

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

### Updating database schema

After editing `src/lib/db/schema.ts`:

```bash
# 1. Generate migration from schema changes
pnpm db:generate

# 2. Apply migration to database
pnpm db:migrate

# 3. Re-seed database (optional, but recommended)
pnpm db:seed
```

## Authentication (Optional)

This template includes a complete authentication system that's **opt-in** and easy to enable when needed.

**Features:**
- Email/password authentication
- Google OAuth sign-in
- Role-based access control (admin, user)
- Protected routes for both Astro and React
- Type-safe session management

**Quick Setup:**
1. Uncomment auth variables in `astro.config.mjs` and `.env`
2. Generate a secret: `openssl rand -base64 32`
3. Run database migrations: `pnpm db:generate && pnpm db:migrate`
4. (Optional) Configure Google OAuth credentials

**See [AUTH.md](./AUTH.md) for complete setup instructions and usage examples.**

## Access Remote Database Client

### 1. Start Drizzle studio on the VPS
From the remote Coolify terminal:
- `https://coolify.albertogiunta.com/project/===placeholder===/terminal`
- `pnpm db:studio:remote` 

From a local terminal:
- `ssh  root@5.161.62.19`
- `cd /data/coolify/applications/===project_container_id===/`
- `docker compose exec app pnpm db:studio:remote`

### 2. Open an SSH tunnel
From a local terminal:
- `ssh -L 5000:localhost:49xx root@5.161.62.19`

### 3. Open Drizzle Studio a browser
- [https://local.drizzle.studio/?port=5000](https://local.drizzle.studio/?port=5000)

### Useful Docker commands
- Start Drizzle Studio: `docker compose exec app pnpm db:studio:remote`
- Check open ports: `docker compose exec app ps aux`
- Kill Drizzle Studio: `docker compose exec app pkill -f "drizzle-kit studio"`

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

# Pull changes from template

```bash
git remote add template https://github.com/albertogiunta/template-rats-stack.git
git fetch template
git merge template/main --allow-unrelated-histories
```