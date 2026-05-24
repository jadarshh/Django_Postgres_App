# Django + Next.js Task Manager

A modern full-stack task management application with Django REST API backend and Next.js frontend.

## Architecture

```
Browser → Next.js (React + TypeScript) → Django REST API → PostgreSQL
  :3000          shadcn/ui + Tailwind          :8000         :5432
```

## Features

- ✅ Beautiful UI with shadcn/ui components
- ✅ Task filtering (All/Active/Completed)
- ✅ Task creation with form
- ✅ Toggle task completion
- ✅ Delete tasks
- ✅ Real-time statistics
- ✅ Responsive design
- ✅ Docker multi-service orchestration

## Tech Stack

### Backend
- Django 5.1+ (Python web framework)
- Django REST Framework (API)
- PostgreSQL 16 (Database)
- Gunicorn (WSGI server)
- CORS Headers (Cross-origin support)

### Frontend
- Next.js 14 (React framework)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- shadcn/ui (UI components)
- Lucide React (Icons)

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Named volumes for data persistence
- Custom bridge network

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone and Navigate
```bash
cd /home/kalobiralo/Projects/django/django_postgres_app
```

### 2. Build Services
```bash
docker compose build
```

### 3. Start Services
```bash
docker compose up
```

Or run in detached mode:
```bash
docker compose up -d
```

### 4. Access the Application
- **Frontend (Next.js):** http://localhost:3000
- **Backend API:** http://localhost:8000/api/tasks/
- **Django Admin:** http://localhost:8000/admin

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks |
| POST | `/api/tasks/` | Create new task |
| GET | `/api/tasks/{id}/` | Get single task |
| PUT | `/api/tasks/{id}/` | Update task |
| PATCH | `/api/tasks/{id}/` | Partial update |
| DELETE | `/api/tasks/{id}/` | Delete task |
| POST | `/api/tasks/{id}/toggle/` | Toggle completion |

## Development

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f web
docker compose logs -f db
```

### Run Django Commands
```bash
# Create superuser
docker compose exec web python manage.py createsuperuser

# Make migrations
docker compose exec web python manage.py makemigrations

# Run migrations
docker compose exec web python manage.py migrate

# Django shell
docker compose exec web python manage.py shell
```

### Access Database
```bash
docker compose exec db psql -U django_user -d django_app
```

### Rebuild Services
```bash
# Rebuild all
docker compose up --build

# Rebuild specific service
docker compose build frontend
docker compose up frontend
```

### Stop Services
```bash
# Stop containers (preserves data)
docker compose down

# Stop and remove volumes (deletes data)
docker compose down -v
```

## Project Structure

```
django_postgres_app/
├── config/                  # Django project config
│   ├── settings.py         # Django settings (DRF, CORS)
│   ├── urls.py             # API routing
│   └── wsgi.py             # WSGI application
├── tasks/                   # Django tasks app
│   ├── models.py           # Task model
│   ├── serializers.py      # DRF serializers
│   ├── api_views.py        # API viewsets
│   └── migrations/         # Database migrations
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   │   ├── page.tsx    # Home page
│   │   │   ├── layout.tsx  # Root layout
│   │   │   └── globals.css # Tailwind styles
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── task-form.tsx
│   │   │   └── task-item.tsx
│   │   ├── lib/
│   │   │   ├── api.ts      # API client
│   │   │   └── utils.ts    # Utilities
│   │   └── types/
│   │       └── task.ts     # TypeScript types
│   ├── Dockerfile          # Frontend container
│   └── package.json        # Node dependencies
├── Dockerfile               # Backend container
├── compose.yaml            # Docker Compose config
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables
```

## Environment Variables

### Django Backend
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=django_app
POSTGRES_USER=django_user
POSTGRES_PASSWORD=django_password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

### Next.js Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=production
```

## Common Issues

### DNS Resolution Error
If you see "dial tcp: lookup registry-1.docker.io", it's a DNS issue.

**Fix:**
```bash
# Restart Docker daemon
sudo systemctl restart docker

# Or modify /etc/docker/daemon.json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

### CORS Errors
If frontend can't reach backend:
1. Check `CORS_ALLOWED_ORIGINS` in `config/settings.py`
2. Ensure frontend is accessing `http://localhost:8000` (not `127.0.0.1`)

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :8000

# Kill process
kill -9 <PID>
```

## Testing the API

### Using curl
```bash
# List tasks
curl http://localhost:8000/api/tasks/

# Create task
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "is_done": false}'

# Toggle task (replace {id})
curl -X POST http://localhost:8000/api/tasks/1/toggle/

# Delete task (replace {id})
curl -X DELETE http://localhost:8000/api/tasks/1/
```

## Learning Resources

### Django REST Framework
- Official Docs: https://www.django-rest-framework.org/
- Tutorial: https://www.django-rest-framework.org/tutorial/quickstart/

### Next.js
- Official Docs: https://nextjs.org/docs
- Learn: https://nextjs.org/learn

### shadcn/ui
- Components: https://ui.shadcn.com/docs/components
- Installation: https://ui.shadcn.com/docs/installation

### Docker
- Docker Docs: https://docs.docker.com/
- Compose Docs: https://docs.docker.com/compose/

## Next Steps

1. **Add Authentication**
   - Django REST auth
   - JWT tokens
   - Login/signup pages

2. **Add More Features**
   - Task categories/tags
   - Due dates
   - Priority levels
   - Search functionality

3. **Production Deployment**
   - Add Nginx reverse proxy
   - Use production database (RDS, etc.)
   - Configure SSL/HTTPS
   - Set up CI/CD pipeline

4. **Monitoring & Logging**
   - Add Sentry for error tracking
   - Set up logging aggregation
   - Add performance monitoring

## Contributing

This is a learning project. Feel free to experiment and add features!

## License

MIT
