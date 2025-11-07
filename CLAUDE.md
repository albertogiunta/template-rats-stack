# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack Overview

**RATS Stack**: React + Astro + Tailwind + SQLite

- **Frontend**: Astro (server mode) + React SPA (via [...app].astro catch-all route)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Data Layer**: React Query for state management
- **Database**: SQLite via Drizzle ORM (libsql dialect)
- **Deployment**: Node.js SSR (Astro outputs to dist/server/entry.mjs)

## Key Commands

### Development
```bash
pnpm dev                  # Start dev server on localhost:4321
pnpm build                # Type-check and build for production
pnpm preview              # Preview production build
pnpm format               # Format code with Prettier
```

### Database Operations
```bash
pnpm db:generate          # Generate migration from schema changes
pnpm db:migrate           # Apply migrations to database
pnpm db:push              # Push schema directly (skip migrations)
pnpm db:studio            # Open Drizzle Studio UI
pnpm db:seed              # Run seed script (db/seeds/seed.ts)
```

**Initial Setup Sequence**: `db:generate` → `db:migrate` → `db:seed`

## Architecture

### Routing & Rendering

- **Static pages**: `src/pages/*.astro` (e.g., index.astro)
- **React SPA**: All `/app/*` routes → `src/pages/[...app].astro` → renders `App.tsx` with `client:only="react"`
- **API routes**: `src/pages/api/*.ts` export Astro APIRoute handlers (GET, POST, etc.)

### Database Layer

- **Schema**: `src/lib/db/schema.ts` - Define Drizzle tables here
- **Client**: `src/lib/db/index.ts` - Exports configured `db` instance
- **Connection**: Uses libsql with `file:` protocol pointing to DATABASE_PATH
- **Types**: Drizzle infers types via `$inferSelect` and `$inferInsert`

**Important**: With libsql, query results are already resolved - don't call `.all()`, just `await` the query.

### React Architecture

- **Root**: `App.tsx` wraps entire app with QueryClientProvider
- **App Components**: `src/components/app/*.tsx` - Application-specific components
- **UI Components**: `src/components/ui/*.tsx` - shadcn/ui primitives
- **Data Fetching**: Use React Query hooks (useQuery, useMutation) in components
- **API Calls**: Fetch from `/api/*` endpoints (relative URLs work in SSR)

### Environment Configuration

Environment variables are managed via Astro's native `env` schema in `astro.config.mjs`:

- **Server-only public**: `DATABASE_PATH` (access via `astro:env` or `process.env`)
- **Client-accessible**: Must have `PUBLIC_` prefix (e.g., `PUBLIC_APP_NAME`, `PUBLIC_APP_URL`)
- **Secrets**: Set `access: 'secret'` in schema (server-only, no client exposure)

Use `@/` alias to import from `src/` (configured in tsconfig.json).

### Authentication Layer (Opt-In)

The template includes a complete authentication system powered by better-auth:

- **Configuration**: `src/lib/auth/index.ts` - Main better-auth setup with Drizzle adapter
- **Schema**: `src/lib/auth/schema.ts` - Database tables (user, session, account, verification)
- **Client**: `src/lib/auth/client.ts` - React hooks and client utilities
- **Utils**: `src/lib/auth/utils.ts` - Server-side utilities for Astro pages
- **Components**: `src/components/app/auth/` - Login, signup, and protected route components
- **API**: `src/pages/api/auth/[...all].ts` - Catch-all route for auth endpoints

**Features**:
- Email/password authentication
- Google OAuth (when configured)
- Role-based access control (user, admin)
- Protected routes for Astro and React
- Type-safe session management

**To enable**: See AUTH.md for setup instructions.

## Common Workflows

### Modifying Database Schema
1. Edit `src/lib/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:migrate` to apply it
4. Update seed in `db/seeds/seed.ts` if needed

### Adding New API Endpoint
1. Create `src/pages/api/[name].ts`
2. Export APIRoute handlers (GET, POST, PUT, DELETE)
3. Import `db` from `@/lib/db` and query/mutate
4. Return `Response.json()` for JSON responses

### Adding React Component
1. Create component in `src/components/app/` for app-specific logic
2. Use React Query hooks for data fetching
3. Import shadcn/ui components from `@/components/ui/`
4. Fetch API data from `/api/*` endpoints

### Adding shadcn/ui Component
```bash
pnpm dlx shadcn@latest add [component-name]
```
Components install to `src/components/ui/`

### Working with Authentication

**Protecting an Astro page:**
```astro
---
import { requireAuth } from "@/lib/auth/utils";
const session = await requireAuth(Astro);
---
```

**Protecting a React component:**
```tsx
import { ProtectedRoute } from "@/components/app/auth";
<ProtectedRoute><YourComponent /></ProtectedRoute>
```

**Using session in React:**
```tsx
import { useSession } from "@/lib/auth/client";
const { data: session } = useSession();
```

**Checking roles:**
```tsx
import { hasRole } from "@/lib/auth/utils";
if (hasRole(session, "admin")) { /* ... */ }
```

## Deployment

**Build output**: `dist/server/entry.mjs` (Node.js SSR entry point)
**Database**: Copy `db/` directory to deployment environment
**Runtime**: `node dist/server/entry.mjs` or containerize with Node 20+

Ensure DATABASE_PATH environment variable points to correct location in production.

### Docker Deployment

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

### VPS Deployment

```bash
pnpm build
rsync -avz dist/ user@server:/var/www/app/
rsync -avz db/ user@server:/var/www/app/db/
# On server: node dist/server/entry.mjs
```
