#!/bin/bash

echo "🚀 Starting Django + Next.js Task Manager..."
echo ""
echo "Services:"
echo "  - Frontend (Next.js): http://localhost:3000"
echo "  - Backend API: http://localhost:8000/api/tasks/"
echo "  - Django Admin: http://localhost:8000/admin"
echo ""
echo "Building and starting services..."
echo ""

docker compose up --build

