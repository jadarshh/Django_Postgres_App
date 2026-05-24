# Troubleshooting Guide

## Common Issues and Solutions

### 1. Frontend Build Taking Too Long

**Symptom:** `npm install` seems stuck during Docker build

**Solution:**
```bash
# Cancel current build
docker compose build --no-cache frontend

# If still stuck, try building locally first
cd frontend
npm install
cd ..
docker compose build frontend
```

### 2. DNS Resolution Error (Docker Hub)

**Symptom:**
```
failed to resolve source metadata for docker.io/library/python:3.13-slim
dial tcp: lookup registry-1.docker.io on 127.0.0.53:53: server misbehaving
```

**Solution:**
```bash
# Option 1: Restart Docker
sudo systemctl restart docker

# Option 2: Configure DNS in Docker
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

Then restart:
```bash
sudo systemctl restart docker
```

### 3. Port Already in Use

**Symptom:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Find process using port 8000
sudo lsof -i :8000

# Kill the process (replace PID)
kill -9 <PID>

# Or stop all containers first
docker compose down
```

### 4. CORS Errors in Browser

**Symptom:**
```
Access to fetch at 'http://localhost:8000/api/tasks/' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**

Check `config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

Make sure you're accessing frontend at `http://localhost:3000` (not `127.0.0.1`).

### 5. Frontend Can't Connect to Backend

**Symptom:** Frontend shows "Failed to fetch tasks" error

**Checklist:**
1. ✅ Is backend running? Check: `docker compose ps`
2. ✅ Can you access API directly? Open: `http://localhost:8000/api/tasks/`
3. ✅ Check environment variable: `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. ✅ Check browser console for errors
5. ✅ Verify CORS is configured (see #4 above)

### 6. Database Connection Error

**Symptom:**
```
django.db.utils.OperationalError: could not connect to server: Connection refused
```

**Solution:**
```bash
# Check if database is healthy
docker compose ps

# Check database logs
docker compose logs db

# Restart database
docker compose restart db

# If volume is corrupted, recreate it (WARNING: deletes data)
docker compose down -v
docker compose up
```

### 7. Static Files Not Loading

**Symptom:** CSS/JS files return 404

**Solution:**
```bash
# Collect static files
docker compose exec web python manage.py collectstatic --noinput

# Restart web service
docker compose restart web
```

### 8. Next.js Build Errors

**Symptom:**
```
Error: Cannot find module '@/components/ui/button'
```

**Solution:**

Check `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Rebuild:
```bash
docker compose build --no-cache frontend
```

### 9. Permission Denied Errors

**Symptom:**
```
Permission denied (publickey)
mkdir: cannot create directory '/app': Permission denied
```

**Solution:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /home/kalobiralo/Projects/django/django_postgres_app

# Check Docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

### 10. Containers Keep Restarting

**Symptom:** Container status shows "Restarting"

**Solution:**
```bash
# Check logs for errors
docker compose logs web
docker compose logs frontend
docker compose logs db

# Common causes:
# - Application crashes on startup
# - Database not ready (check healthcheck)
# - Port conflicts
# - Missing environment variables
```

## Debug Commands

### View All Logs
```bash
docker compose logs -f
```

### View Specific Service Logs
```bash
docker compose logs -f frontend
docker compose logs -f web
docker compose logs -f db
```

### Execute Command in Container
```bash
# Django shell
docker compose exec web python manage.py shell

# Check Next.js env variables
docker compose exec frontend env | grep NEXT_PUBLIC

# Access database
docker compose exec db psql -U django_user -d django_app
```

### Inspect Network
```bash
# List networks
docker network ls

# Inspect app network
docker network inspect django_postgres_app_app-network

# Test connectivity between containers
docker compose exec frontend ping web
```

### Clean Start
```bash
# Stop everything
docker compose down

# Remove volumes (WARNING: deletes data)
docker compose down -v

# Remove images
docker compose down --rmi all

# Rebuild from scratch
docker compose build --no-cache
docker compose up
```

### Check Resource Usage
```bash
# Container stats
docker stats

# System-wide info
docker system df

# Clean up unused resources
docker system prune -a
```

## Development Tips

### Run Frontend Locally (Without Docker)
```bash
cd frontend
npm install
npm run dev
```
Then access at `http://localhost:3000`

### Run Backend Locally (Without Docker)
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export POSTGRES_HOST=localhost
export POSTGRES_USER=django_user
export POSTGRES_PASSWORD=django_password
export POSTGRES_DB=django_app

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Hot Reload During Development

For development with hot reload, modify `compose.yaml`:

```yaml
frontend:
  build:
    context: ./frontend
    target: base  # Stop at base stage
  command: npm run dev
  volumes:
    - ./frontend:/app
    - /app/node_modules
  environment:
    NODE_ENV: development
```

### Test API with curl
```bash
# List tasks
curl http://localhost:8000/api/tasks/

# Create task
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "is_done": false}'

# Get specific task
curl http://localhost:8000/api/tasks/1/

# Toggle task
curl -X POST http://localhost:8000/api/tasks/1/toggle/

# Delete task
curl -X DELETE http://localhost:8000/api/tasks/1/
```

## Still Having Issues?

1. Check Docker version: `docker --version` (need 20.10+)
2. Check Docker Compose version: `docker compose version` (need 2.0+)
3. Check system resources (Docker needs 2GB+ RAM)
4. Review logs carefully: `docker compose logs`
5. Try clean rebuild: `docker compose down -v && docker compose build --no-cache && docker compose up`

## Getting Help

If you're still stuck:
1. Check GitHub Issues: [project repo]
2. Copy relevant error messages
3. Include output of: `docker compose logs`
4. Note your OS and Docker version
