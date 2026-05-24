# Django Postgres App

A small Django project with a `tasks` app, a server-rendered frontend, and Postgres running in Docker.

## Run with Docker

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:8000`.

## Useful commands

```bash
docker compose exec web python manage.py createsuperuser
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate
```

## Project layout

```text
config/          Django project settings and root URLs
tasks/           Django app with model, views, forms, URLs, admin, migrations
templates/       Server-rendered frontend templates
static/          CSS and static assets
compose.yaml     Django + Postgres services
Dockerfile       Django web image
```
