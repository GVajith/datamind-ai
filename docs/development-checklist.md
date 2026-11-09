# Development checklist

## Phase 1 — Foundation

- [x] Analyze the SRS and reference implementations.
- [x] Record architecture, database relationships, API plan, and frontend structure.
- [x] Initialize React/Vite and FastAPI applications.
- [x] Configure PostgreSQL and SQLAlchemy Core (no ORM).
- [x] Add initial Alembic migration.
- [x] Implement registration, login, logout, password reset contracts, and current user.
- [x] Add protected frontend routing and application shell.
- [x] Add Docker Compose and environment templates.
- [x] Add authentication tests.
- [ ] Verify Docker Compose on the target machine.

## Phase 2 — Dataset management

- [ ] Local/S3 storage adapter and secure object keys.
- [ ] CSV/XLSX/XLS validation, worksheet selection, upload, and background profiling.
- [ ] Dynamic schema/type/quality profiling.
- [ ] Dataset list, preview, profile, quality, deletion APIs and UI.
- [ ] Isolation, malformed file, and size-limit tests.

## Phase 3 — Basic AI analysis

- [ ] OpenAI/Gemini provider protocol.
- [ ] Approved deterministic Pandas tools and orchestrated chat.
- [ ] Dataset understanding and conversation persistence.
- [ ] Prominent chat UI and grounding/security tests.

## Phase 4 — Agentic AI

- [ ] Specialized agents, follow-up resolution, summaries, and recovery.
- [ ] pgvector retrieval for descriptive context.
- [ ] Timeouts, resource limits, and usage tracking.

## Phase 5 — Visualization and reports

- [ ] Recharts renderer, insights, history, PDF reports, and CSV export.

## Phase 6 — Production features

- [ ] Redis workers, observability, admin views, quotas, retention, and audit events.

## Phase 7 — Test and deploy

- [ ] Full unit/integration/E2E, load, security, and recovery testing.
- [ ] CI quality gates, staged deployment, runbooks, backups, and restore test.
