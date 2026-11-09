# DataMind AI

DataMind AI is an agentic business-intelligence platform for analyzing arbitrary CSV and Excel datasets through natural-language conversations.

This repository currently contains **Phase 1 — Foundation**. Authentication, the application shell, SQLAlchemy Core database schema, migrations, Docker services, and automated backend tests are implemented. Dataset ingestion and AI analysis are tracked as later phases in [`docs/development-checklist.md`](docs/development-checklist.md).

## Architecture

- [`docs/architecture.md`](docs/architecture.md) — system architecture and technical decisions
- [`docs/database-design.md`](docs/database-design.md) — tables, ownership boundaries, and relationships
- [`docs/api-plan.md`](docs/api-plan.md) — versioned API implementation plan
- [`docs/frontend-structure.md`](docs/frontend-structure.md) — screen, route, state, and network organization
- [`docs/development-checklist.md`](docs/development-checklist.md) — phase-by-phase delivery status

The code follows the supplied Corporate projects' conventions: screen-oriented React folders, centralized route constants and endpoints, Redux session state, shared Axios helpers, modular FastAPI applications, separate request/response models, and database utilities. Database access uses SQLAlchemy Core only—there are no ORM models or sessions.

## Quick start with Docker

1. Copy `.env.example` to `.env` and replace `JWT_SECRET_KEY`.
2. Run `docker compose -f docker-compose.yml up --build`.
3. Open `http://localhost:5173`. API documentation is at `http://localhost:8000/docs`.

Docker runs the initial migration before starting the API. PostgreSQL is exposed on port `5432` and Redis on `6379`.

## Local development

Python 3.12 is required for the backend.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item ..\.env.example .env
.\scripts\run_backend.ps1
```

For a zero-setup local database, set `DATABASE_URL=sqlite:///./datamind.db`. PostgreSQL remains the production and Docker default.

The runner uses `python -m alembic` and `python -m uvicorn` because managed Windows Application Control policies may block the generated command launchers. It also selects SQLAlchemy's supported pure-Python implementation on Windows; Docker/Linux continues to use the accelerated implementation.

```powershell
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:8000` by default. Override it with `VITE_API_BASE_URL`.

## Verification

```powershell
cd backend
pytest
```

```powershell
cd frontend
npm run build
```

## Phase 1 API

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /health`

All application responses use a consistent `{ sts, err, msg, data }` envelope. Passwords are PBKDF2-hashed and never logged. Access tokens carry a unique session ID that is checked against the database and can be revoked on logout.
