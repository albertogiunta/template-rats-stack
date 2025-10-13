# Docker Guide for Il Post Podcast Feed

This guide will help you deploy and manage this app using Docker, both locally and on Coolify.

## 🧠 Understanding Docker (No Scary Stuff!)

**What is Docker?**
Docker is like a "shipping container" for your app. It packages your code + all dependencies together so it runs the same way everywhere. That's it!

**Key Concepts:**
- **Dockerfile** = Recipe that says "install Node, copy my code, run it"
- **Container** = A running instance of your app (like a virtual mini-computer)
- **Volume** = A folder on your computer that persists even when containers restart
- **Image** = The built app ready to run (like a .exe or .app file)

**Should I use Docker for local development?**
- **No need!** Use `pnpm dev` for local development (faster, easier hot-reload)
- **Use Docker** only when you want to test the exact production setup locally

---

## 🚀 Quick Start (Local)

### Prerequisites
- Docker installed ([Get Docker Desktop](https://www.docker.com/products/docker-desktop))
- This project cloned locally

### Start the app with Docker
```bash
# Build and start the container
docker compose up

# Your app is now running at http://localhost:4321
```

That's it! The database will be created in `./db-data/` and will persist even if you stop the container.

### Stop the app
```bash
# Stop the container (data persists)
docker compose down

# Stop and delete all data (fresh start)
docker compose down -v
```

---

## 🎯 Common Use Cases

### 1. Deploy a new version with migrations

**On Coolify (automatic):**
```bash
# Just push your code
git add .
git commit -m "New feature with database changes"
git push origin main

# Coolify automatically:
# 1. Builds new Docker image
# 2. Starts new container
# 3. Runs migrations (via docker-entrypoint.sh)
# 4. Starts the app
```

**Locally:**
```bash
# Rebuild and restart with new code
docker compose up --build

# Migrations run automatically on startup
```

### 2. Connect to the remote SQLite database

**Option A: Copy database file to your machine**
```bash
# SSH into your VPS
ssh your-vps-ip

# Navigate to your app directory
cd /path/to/your/app

# Copy database from container to your local machine
docker compose cp app:/app/db/data.db ~/Downloads/production.db

# Now open ~/Downloads/production.db with any SQLite client:
# - TablePlus
# - DBeaver
# - DB Browser for SQLite
# - DataGrip
```

**Option B: Access database inside container**
```bash
# SSH into your VPS
ssh your-vps-ip

# Get a shell inside the running container
docker compose exec app sh

# The database is at /app/db/data.db
# You can use sqlite3 command if available, or just inspect files
ls -lah /app/db/

# Exit the container
exit
```

### 3. View logs (see what's happening)

```bash
# View all logs
docker compose logs

# Follow logs in real-time (like tail -f)
docker compose logs -f

# View only recent logs
docker compose logs --tail=50

# View logs for a specific time range
docker compose logs --since=1h
```

### 4. Run database commands inside container

```bash
# Open Drizzle Studio (database GUI)
docker compose exec app pnpm db:studio

# Run seed script
docker compose exec app pnpm db:seed

# Generate new migration (if you edited schema locally)
docker compose exec app pnpm db:generate

# Open a shell to explore
docker compose exec app sh
```

### 5. Inspect the container

```bash
# See running containers
docker compose ps

# See resource usage (CPU, memory)
docker stats

# Inspect container configuration
docker compose config

# See which port is exposed
docker compose port app 4321
```

### 6. Restart the container

```bash
# Restart without rebuilding
docker compose restart

# Rebuild and restart (if you changed code)
docker compose up --build

# Force recreate container
docker compose up --force-recreate
```

---

## 🛠️ Coolify Deployment Setup

### Step 1: Create New Resource in Coolify
1. Go to your Coolify dashboard
2. Click "Add New Resource" → "Application"
3. Select "Docker Compose" or "Dockerfile"

### Step 2: Configure Git Repository
1. Connect your GitHub/GitLab repository
2. Set branch to `main` (or your preferred branch)
3. Coolify will auto-detect the Dockerfile

### Step 3: Set Build Configuration
- **Build Pack**: Dockerfile
- **Dockerfile Location**: `./Dockerfile` (default)
- **Docker Compose File**: `docker-compose.yml` (if using compose)

### Step 4: Configure Persistent Storage
This is **critical** for SQLite persistence!

1. Go to "Storage" tab
2. Add a new volume:
   - **Name**: `podcast-db`
   - **Mount Path**: `/app/db`
   - **Host Path**: (Coolify will auto-assign, or specify your own)

### Step 5: Set Environment Variables
Add these in the "Environment Variables" tab:

```bash
DATABASE_PATH=/app/db/data.db
PUBLIC_APP_URL=https://your-domain.com
PUBLIC_APP_NAME=Il Post Podcast Feed
NODE_ENV=production
```

### Step 6: Configure Domain
1. Go to "Domains" tab
2. Add your domain (e.g., `podcasts.yourdomain.com`)
3. Enable "Generate SSL Certificate" for HTTPS

### Step 7: Deploy!
1. Click "Deploy"
2. Watch the build logs
3. Once deployed, migrations run automatically
4. Your app is live!

### Redeploy After Code Changes
```bash
# Push to your repo
git push origin main

# Coolify auto-deploys (if webhook enabled)
# Or manually click "Redeploy" in Coolify dashboard
```

---

## 📂 File Structure

```
your-project/
├── Dockerfile              # Instructions to build Docker image
├── docker-compose.yml      # Easy way to run locally
├── docker-entrypoint.sh    # Runs migrations automatically
├── .dockerignore          # Files to exclude from Docker build
├── db-data/               # Local SQLite data (persists)
│   └── data.db           # Your database file
└── dist/                  # Built Astro app (created on build)
```

---

## 🐛 Troubleshooting

### Problem: Database resets on every deployment
**Solution**: Make sure you configured persistent storage in Coolify:
- Mount path: `/app/db`
- The volume must be configured BEFORE first deployment

### Problem: Migrations not running
**Check the logs:**
```bash
docker compose logs app
```
Look for messages like "Running database migrations..."

**Manually run migrations:**
```bash
docker compose exec app pnpm db:migrate
```

### Problem: Can't connect to database
**Verify the database file exists:**
```bash
docker compose exec app ls -lah /app/db/
```

**Check environment variable:**
```bash
docker compose exec app env | grep DATABASE_PATH
```

### Problem: Port 4321 already in use
**Change the port in docker-compose.yml:**
```yaml
ports:
  - "8080:4321"  # Access at localhost:8080
```

### Problem: Container crashes on startup
**Check logs for errors:**
```bash
docker compose logs app --tail=100
```

**Verify build succeeded:**
```bash
docker compose build
```

---

## 🔄 Local vs Production Workflow

### Local Development (Recommended)
```bash
# No Docker needed!
pnpm dev

# Fast hot-reload, easy debugging
# Database at ./db/data.db
```

### Local Testing with Docker
```bash
# Test production setup locally
docker compose up --build

# Slower, but exact production environment
```

### Production (Coolify)
```bash
# Push code → Coolify builds Docker image → Deploys
git push origin main

# Persistent storage configured in Coolify dashboard
```

**Best Practice**: Develop locally with `pnpm dev`, deploy to production with Docker.

---

## 📚 Docker Command Cheatsheet

### Container Management
```bash
docker compose up              # Start containers
docker compose up -d           # Start in background (detached)
docker compose down            # Stop containers
docker compose restart         # Restart containers
docker compose ps              # List running containers
docker compose logs -f         # Follow logs
```

### Building
```bash
docker compose build           # Build image
docker compose up --build      # Rebuild and start
docker compose build --no-cache  # Build from scratch
```

### Debugging
```bash
docker compose exec app sh     # Open shell in container
docker compose exec app env    # View environment variables
docker compose exec app ls -lah  # List files
docker stats                   # Resource usage
```

### Data Management
```bash
docker compose down -v         # Stop and delete volumes (⚠️ deletes data!)
docker compose cp app:/app/db/data.db ./backup.db  # Backup database
```

### Cleanup
```bash
docker system prune            # Remove unused images/containers
docker volume prune            # Remove unused volumes
docker image prune -a          # Remove all unused images
```

---

## 🎓 Learning Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Coolify Documentation](https://coolify.io/docs)

---

## 💡 Tips

1. **Always check logs first** when something doesn't work: `docker compose logs -f`
2. **Use volumes for persistent data** - never store important data only inside containers
3. **Environment variables** are your friend - use them for configuration
4. **Test locally** before deploying to production
5. **Backup your database** regularly (just copy the `db-data/data.db` file)

---

## 🆘 Still Stuck?

Common issues and solutions:
- Check that Docker is running: `docker --version`
- Ensure ports aren't blocked by firewall
- Verify your `.env` file (if you created one)
- Check Coolify build logs for detailed error messages
- Ensure persistent volume is configured in Coolify

If all else fails, try:
```bash
docker compose down -v
docker compose up --build
```

This rebuilds everything from scratch and creates a fresh database.
