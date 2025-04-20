# LogAnal Dockerized Setup

## Overview
This project contains a FastAPI backend and a React frontend, both fully dockerized for development and production.

## Development
To start both services in development mode:

```bash
docker-compose up --build
```
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Production
To build and run in production mode:

1. Edit `docker-compose.yml`:
    - Change `target: dev` to `target: prod` under both `backend` and `frontend` build sections.
2. Run:
```bash
docker-compose up --build
```
- Backend: http://localhost:8000
- Frontend: http://localhost:3000 (served by nginx on port 80 inside container)

## Persistent Data
- The backend SQLite database is persisted in a Docker volume (`backend-db-data`).

## Environment Variables
- Place your backend environment variables in `backend/.env`. This file is used by the backend container but not copied into the image.

## Dockerignore
- `.dockerignore` files are set up for both backend and frontend to avoid copying unnecessary files into images.

## Useful Commands
- View running containers: `docker ps`
- Stop containers: `docker-compose down`
- Remove volumes: `docker-compose down -v`

---
For any issues, check the logs with `docker-compose logs backend` or `docker-compose logs frontend`.
# logAnalyzer
# logAnalyzer
