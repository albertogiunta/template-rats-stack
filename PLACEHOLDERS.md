# Template Placeholders Reference

This document lists all placeholder values that should be replaced when creating a new project from this template.

## Unified Placeholder Scheme

This template uses a **simple, consistent naming scheme** with just a few placeholders to replace:

| Placeholder | Context | Example Replacement |
|-------------|---------|---------------------|
| `appname` | Package names, domains, code identifiers (lowercase) | `my-project` |
| `appname_auth` | Code prefixes, cookie names (snake_case) | `myproject_auth` |
| `App Name` | UI display text, page titles (Title Case) | `My Project` |
| `https://appname.com` | Production URLs | `https://myproject.com` |
| `DBPORT` | Drizzle Studio remote port | `4900` |
| `SERVER_IP` | VPS/server IP address | `123.45.67.89` |
| `PROJECT_ID` | Deployment platform project ID | (your project ID) |
| `CONTAINER_ID` | Docker container ID | (your container ID) |

---

## Required Replacements

### 1. Application Identity

**Replace `appname` with your project name** (lowercase, no spaces):

- **package.json** (line 2):
  ```json
  "name": "appname",
  ```

**Replace `App Name` with your application display name**:

- **.env.example** (line 9):
  ```bash
  PUBLIC_APP_NAME="App Name"
  ```

- **astro.config.mjs** (line 36):
  ```javascript
  default: "App Name",
  ```

- **docker-compose.yml** (line 15):
  ```yaml
  - PUBLIC_APP_NAME=App Name
  ```

- **src/pages/index.astro** (lines 16, 23):
  ```html
  <title>App Name</title>
  <h1>Welcome to App Name</h1>
  ```

- **src/components/App.tsx** (line 45):
  ```tsx
  <h1 className="text-2xl font-bold">App Name</h1>
  ```

---

### 2. Production Domain

**Replace `https://appname.com` with your production URL**:

- **astro.config.mjs** (line 13):
  ```javascript
  site: "https://appname.com",
  ```

**Note:** Also update `PUBLIC_APP_URL` in production from `http://localhost:4321` to your actual production URL.

---

### 3. Authentication Cookie Prefix

**Replace `appname_auth` with your app-specific prefix**:

- **src/lib/auth.ts** (line 295):
  ```typescript
  cookiePrefix: "appname_auth",
  ```

**Recommendation:** Use lowercase with underscores (e.g., `myproject_auth`)

---

## Optional Replacements (Deployment-Specific)

### 4. Database Studio Port

**Replace `DBPORT` with your Drizzle Studio port** (only if using remote database access):

- **package.json** (line 16):
  ```json
  "db:studio:remote": "drizzle-kit studio --port DBPORT --host 0.0.0.0"
  ```

- **docker-compose.yml** (line 8):
  ```yaml
  - "127.0.0.1:DBPORT:4983"
  ```

- **.env.example** (line 5):
  ```bash
  # Access via SSH tunnel: ssh -L 5000:localhost:DBPORT root@SERVER_IP
  ```

- **README.md** (line 116):
  ```bash
  ssh -L 5000:localhost:DBPORT root@SERVER_IP
  ```

**Recommendation:** Use `4900`, `4901`, `4902`, etc. to avoid port conflicts.

---

### 5. Server/Deployment Configuration

These placeholders are only needed if you're deploying to a VPS or using specific deployment platforms:

**Replace `SERVER_IP` with your server IP address**:

- **.env.example** (line 5)
- **README.md** (lines 110, 116)

**Replace `PROJECT_ID` with your deployment platform project ID**:

- **README.md** (line 106) - Coolify terminal URL

**Replace `CONTAINER_ID` with your Docker container ID**:

- **README.md** (line 111) - Docker container path

---

## Quick Replacement Workflow

### 1. Create from template

```bash
gh repo create my-project --template albertogiunta/template-rats-stack --private --clone
cd my-project
```

### 2. Perform bulk replacements

**Option A: Using VS Code or your editor**
- Find and replace (Cmd/Ctrl + Shift + F):
  - `appname` → `my-project` (or `myproject`)
  - `"App Name"` → `"My Project"` (include quotes for exact match)
  - `App Name` → `My Project` (without quotes for UI text)
  - `appname_auth` → `myproject_auth`
  - `https://appname.com` → `https://myproject.com`
  - `DBPORT` → `4900` (or your preferred port)

**Option B: Using command line (macOS)**

```bash
#!/bin/bash

# Customize these values
PROJECT_NAME="my-project"
APP_DISPLAY_NAME="My Project"
PRODUCTION_URL="https://myproject.com"
AUTH_PREFIX="myproject_auth"
DB_PORT="4900"

# Perform replacements
find . -type f \
  \( -name "*.md" -o -name "*.json" -o -name "*.mjs" -o -name "*.ts" \
  -o -name "*.tsx" -o -name "*.astro" -o -name "*.yml" -o -name ".env.example" \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*" \
  -exec sed -i '' \
    -e "s/appname/$PROJECT_NAME/g" \
    -e "s/App Name/$APP_DISPLAY_NAME/g" \
    -e "s|https://appname.com|$PRODUCTION_URL|g" \
    -e "s/appname_auth/$AUTH_PREFIX/g" \
    -e "s/DBPORT/$DB_PORT/g" \
    {} +

echo "✅ Replacements complete!"
```

**For Linux, use:**
```bash
sed -i   # (remove the '' after -i)
```

### 3. Set up environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 4. Update deployment-specific values (if applicable)

If deploying to a VPS or using Coolify:
- Replace `SERVER_IP` with your server IP
- Replace `PROJECT_ID` with your Coolify project ID
- Replace `CONTAINER_ID` with your Docker container ID

### 5. Generate authentication secret

```bash
openssl rand -base64 32
# Add to .env as AUTH_SECRET
```

### 6. Initialize database

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### 7. Test locally

```bash
pnpm dev
# Visit http://localhost:4321
```

---

## Files Modified by Replacements

### Critical Files (Always Update)
- ✅ `package.json` - Project name
- ✅ `.env.example` → `.env` - Environment variables
- ✅ `astro.config.mjs` - Site URL and app name defaults
- ✅ `src/pages/index.astro` - Page title and UI text
- ✅ `src/components/App.tsx` - App header
- ✅ `src/lib/auth.ts` - Cookie prefix

### Deployment Files (Update if Deploying)
- ⚙️ `docker-compose.yml` - Port mappings and env vars
- ⚙️ `Dockerfile` - (no changes needed usually)

### Documentation (Optional)
- 📄 `README.md` - Contains deployment examples (update or remove)
- 📄 `CLAUDE.md` - AI assistant instructions
- 📄 `AUTH.md` - Authentication guide
- 📄 `DOCKER.md` - Docker deployment guide

---

## Environment Variables Summary

After copying `.env.example` to `.env`, update these values:

| Variable | Template Default | Update To | Required |
|----------|-----------------|-----------|----------|
| `DATABASE_PATH` | `./db/data.db` | (keep default) | Yes |
| `PUBLIC_APP_NAME` | `App Name` | Your app name | Yes |
| `PUBLIC_APP_URL` | `http://localhost:4321` | Production URL in prod | Yes |
| `AUTH_SECRET` | (not set) | Generate: `openssl rand -base64 32` | Yes (if using auth) |
| `GOOGLE_CLIENT_ID` | (not set) | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | (not set) | Google OAuth secret | No |

---

## Post-Setup Cleanup

After successfully replacing all placeholders, consider:

1. **Delete this file** (`PLACEHOLDERS.md`) - no longer needed
2. **Update README.md** - Rewrite for your specific project
3. **Remove template references** - Update documentation to be project-specific
4. **Delete unused auth files** - If not using authentication, remove `AUTH.md` and auth components
5. **Customize content** - Update homepage copy, footer text, etc.

---

## Verification Checklist

Before committing, verify:

- [ ] No occurrences of `appname` remain (except in this file)
- [ ] No occurrences of `App Name` in code (check with search)
- [ ] `package.json` has your project name
- [ ] `.env` file created and populated
- [ ] `AUTH_SECRET` generated (if using auth)
- [ ] Cookie prefix updated in `src/lib/auth.ts`
- [ ] Page titles updated in `src/pages/index.astro`
- [ ] Production URL set in `astro.config.mjs` (for sitemap)
- [ ] Database initialized: `pnpm db:generate && pnpm db:migrate && pnpm db:seed`
- [ ] App runs locally: `pnpm dev`

---

**Template Version:** 1.0.0
**Last Updated:** 2025-11-07
