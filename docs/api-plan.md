# API implementation plan

All endpoints are rooted at `/api/v1`, validate Pydantic contracts, return `{ sts, err, msg, data }`, and require a bearer token except registration, login, and password recovery.

## Phase 1 — authentication

- `POST /auth/register`: normalize email, enforce password policy, create user and auth session.
- `POST /auth/login`: constant-time password verification and a new auth session.
- `POST /auth/logout`: revoke the current JWT session.
- `GET /auth/me`: return the active principal.
- `POST /auth/forgot-password`: create a one-time hashed token when the user exists; return a uniform acknowledgement.
- `POST /auth/reset-password`: consume a valid token and revoke all existing sessions.

## Phase 2 — datasets

Upload, list, retrieve, preview, profile, quality, delete, and status endpoints. Multipart validation happens before storage. Ownership is part of every Core query predicate. Profiling is idempotent per dataset version.

## Phase 3/4 — analysis and conversations

Conversation CRUD, message pagination, orchestrated chat, analysis retrieval, chart retrieval, and feedback. Chat accepts `dataset_id`, `conversation_id`, and a question. Streaming uses Server-Sent Events while non-streaming remains supported.

## Phase 5/6 — reports, dashboard, administration

Report generation/download, tenant-scoped dashboard aggregates, and role-protected user/usage/job views. Administrative reads are audited and never expose credentials or raw uploaded data.
