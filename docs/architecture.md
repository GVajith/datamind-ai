# DataMind AI architecture

## Architectural direction

DataMind AI is a modular monolith for the MVP, with seams that allow profiling workers and AI execution to be extracted later.

```text
React/Vite client
      |
      v
FastAPI application gateway (/api/v1)
      |
      +-- authentication application
      +-- datasets application        (Phase 2)
      +-- analysis application        (Phase 3+)
      +-- conversations application   (Phase 3+)
      +-- reports application         (Phase 5)
      +-- dashboard/admin applications
      |
      +-- SQLAlchemy Core --> PostgreSQL + pgvector
      +-- job queue -------> Redis worker
      +-- object storage --> local/S3 adapter
      +-- LLM adapter -----> OpenAI or Gemini
```

Each backend domain mirrors the Corporate API convention:

- `<domain>.py` creates the domain FastAPI application.
- `routes/` owns HTTP concerns.
- `rq_rs/` contains Pydantic request and response contracts.
- `utils/` contains use-case and SQLAlchemy Core database utilities.

Cross-cutting code lives under `core/`, database metadata under `database/`, and stable response primitives under `common/classes/`. SQL is built exclusively with Core `Table`, `select`, `insert`, `update`, and `delete` constructs and executed in explicit transaction scopes.

## Request lifecycle

1. Middleware assigns a request ID and logs method, path, status, and duration without payloads or credentials.
2. A route validates input with Pydantic and resolves the authenticated principal.
3. A domain utility enforces ownership and performs SQLAlchemy Core operations.
4. The route returns the common response envelope.
5. Exceptions are converted to consistent, non-sensitive error responses.

## Dataset and AI lifecycle

Uploads are stored through a storage adapter and immediately recorded in PostgreSQL. Profiling is idempotently queued. Workers read CSV/Excel with Pandas, infer structure, write profile metadata, and never execute file content. The AI orchestrator receives metadata and approved tool descriptions—not an unrestricted Python or SQL runtime. It selects validated deterministic tools, then an LLM provider explains their structured results.

Conversation context is scoped by both `user_id` and `dataset_id`. Long histories are summarized, and retrieval indexes only descriptions and business text. Numerical answers always originate from deterministic operations against the uploaded dataset.

## Security boundaries

- JWTs identify a database-backed auth session that can be revoked.
- Every dataset, conversation, analysis, report, usage row, and job is ownership-scoped.
- Uploaded values are untrusted data, never prompt instructions.
- Generated SQL/Python is not executed. Only allow-listed analysis operations are available.
- Object keys are generated server-side; original filenames are display metadata only.
- Secrets remain in environment variables or a deployment secret manager.
- Password reset responses do not disclose whether an email exists.

## Missing decisions resolved

- **Identity:** email/password with short-lived JWT access tokens and revocable server-side sessions.
- **Identifiers:** UUID strings, avoiding guessable sequential tenant resources.
- **Database:** PostgreSQL in production; SQLite only for local tests and smoke development.
- **Migrations:** Alembic owns schema changes; application startup does not mutate production schema.
- **Uploads:** local filesystem adapter first, S3 adapter in Phase 2; the database stores metadata, not file bytes.
- **Jobs:** Redis-backed worker boundary with an in-process test implementation.
- **AI provider:** OpenAI/Gemini provider protocol selected by configuration.
- **Charts:** backend emits provider-neutral chart specifications; Recharts renders them.
- **RAG:** pgvector for descriptive text only, never calculations.
- **Deletion:** transactional metadata deletion plus asynchronous object/vector cleanup.

## Deployment

The frontend is a static Vite build. The API and worker are separate containers sharing the same image. PostgreSQL, Redis, S3-compatible storage, and secrets are managed services in production. ECS/Fargate is the default long-running target.
